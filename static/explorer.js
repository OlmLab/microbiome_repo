// Sample explorer — the catalog (human gut, all ages): DuckDB-WASM over data/gut_sample_metadata_wide.parquet (+ gut_studies.parquet
// for titles), fully client-side, one row per sample. Same boot / failure pattern as registry_explorer.js. Values shown with their
// route (R1 archive attribute, R2 supplementary table, R3 paper full text, R4 abstract) and confidence; the verbatim evidence quotes
// live in gut_sample_determinations.parquet (Downloads) and per study in data/studies/<PRJ>_determinations.csv.gz.
const DUCKDB_URL = 'https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@1.29.0/+esm';
const CFG = window.GUT_CFG;
const PAGE = 50;
// core + key fields come from config/packs/gut.yaml through GUT_CFG (item 7); detailed_location is derived from location_site/locality/region
const FIELDS = [...(CFG.coreFields || ['age_at_collection_days', 'sex', 'country', 'health_condition', 'subject_id']), ...(CFG.keyFields || ['detailed_location', 'lifestyle', 'collection_date', 'antibiotic_exposure', 'bmi', 'timepoint_label'])];
// R2026.16: depth (seq_gbp, bases summed over the sample's runs) and the sample's intervention arm are shown; BMI / body-site class stay in the detail panel
const SHOW = ['sample_key', 'archive', 'study_accession', 'age_category', 'age_at_collection_days', 'sex', 'country', 'health_condition', 'intervention', 'antibiotic_exposure', 'subject_id', 'seq_gbp'];
const LOC_PARTS = ['location_site', 'location_locality', 'location_region'];
const HDR = {seq_gbp: 'Gbp', archive: 'archive', age_category: 'age cat.', age_at_collection_days: 'age (d)', health_condition: 'condition', antibiotic_exposure: 'abx', subject_id: 'subject', intervention: 'interv.', study_accession: 'project', sample_key: 'sample'};
let COLS = new Set();   // columns present in the wide table (filled at boot); absent columns are omitted, never rendered as empty
const archiveUrl = acc => { if (!acc) return null; const a = String(acc); if (/^[SED]RR\d+$/.test(a)) return CFG.archive.RUN + a; return (CFG.archive[a.slice(0, 4)] || CFG.archive.SAME) + a; };
const archiveLink = (acc, label) => { const u = archiveUrl(acc); return u ? `<a class="small" href="${u}">${h(label || 'archive')}</a>` : ''; };
const detailedLocation = s => LOC_PARTS.filter(p => COLS.has(p) && s[p] !== null && s[p] !== undefined && s[p] !== '').map(p => s[p]).join(', ');
const SORTABLE = new Set(['sample_key', 'study_accession', 'age_category', 'age_at_collection_days', 'sex', 'bmi', 'country', 'health_condition', 'n_fields_with_value', 'seq_gbp']);
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/'/g, "''");
const h = s => String(s === null || s === undefined ? '' : s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
const fmtV = v => { if (v === null || v === undefined) return ''; if (typeof v === 'bigint') return v.toString(); if (typeof v === 'number') return Number.isInteger(v) ? v.toLocaleString() : v.toFixed(1); return String(v); };
let AGE = null;   // R2026.25 age-strip brush: [min, max] age in days
let duckdb, db, conn, page = 0, total = 0, sortCol = 'study_accession', sortDir = 'ASC', lastFocus = null;

function setBoot(msg) { $('boot-msg').textContent = msg; }
function bootFail(e) { $('boot').innerHTML = '<b>The explorer could not start.</b> ' + h(e && e.message || e) + '<br>DuckDB-WASM (pinned 1.29.0) is loaded from cdn.jsdelivr.net; the tables are plain parquet files under data/ and can be opened with any parquet reader.'; console.error(e); }

async function init() {
  try {
    setBoot('loading DuckDB-WASM module…');
    duckdb = await import(DUCKDB_URL);
    const bundle = await duckdb.selectBundle(duckdb.getJsDelivrBundles());
    const workerUrl = URL.createObjectURL(new Blob([`importScripts("${bundle.mainWorker}");`], {type: 'text/javascript'}));
    const worker = new Worker(workerUrl);
    db = new duckdb.AsyncDuckDB(new duckdb.ConsoleLogger(duckdb.LogLevel.WARNING), worker);
    await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
    URL.revokeObjectURL(workerUrl);
    setBoot('fetching the sample table…');
    for (const [name, url] of [['samples.parquet', CFG.samples], ['studies.parquet', CFG.studies]]) {
      const resp = await fetch(url); if (!resp.ok) throw new Error('fetch of ' + url + ' failed: HTTP ' + resp.status);
      await db.registerFileBuffer(name, new Uint8Array(await resp.arrayBuffer()));
    }
    conn = await db.connect();
    // current samples only: rows carried with release_retired set (bitemporal history, e.g. PRJNA50637 at R2026.14) are not catalog members
    const sCols = new Set((await conn.query(`DESCRIBE SELECT * FROM read_parquet('samples.parquet')`)).toArray().map(r => r.toJSON().column_name));
    await conn.query(`CREATE VIEW s AS SELECT * FROM read_parquet('samples.parquet')${sCols.has('release_retired') ? ' WHERE release_retired IS NULL' : ''}`);
    // R2026.15: study-level interventions (gut_studies.interventions, ';'-joined codes) join the explorer through `st`
    const stCols = new Set((await conn.query(`DESCRIBE SELECT * FROM read_parquet('studies.parquet')`)).toArray().map(r => r.toJSON().column_name));
    await conn.query(`CREATE VIEW st AS SELECT study_accession, study_title${stCols.has('interventions') ? ', interventions AS study_interventions' : ", NULL::VARCHAR AS study_interventions"} FROM read_parquet('studies.parquet')`);
    COLS = new Set((await conn.query(`DESCRIBE s`)).toArray().map(r => r.toJSON().column_name));
    for (const el of document.querySelectorAll('[data-field], [data-text], [data-year]')) {   // filters for columns this package does not carry are hidden
      const col = el.dataset.field || el.dataset.text || (el.dataset.year ? 'collection_date' : null);
      const present = col === 'detailed_location' ? LOC_PARTS.some(p => COLS.has(p)) : COLS.has(col);
      if (!present) { el.disabled = true; const lab = el.closest('.row2') || el; lab.style.display = 'none'; const l = document.querySelector(`label[for="${el.id}"]`); if (l) l.style.display = 'none'; }
    }
    window.__gutReady = true;
    $('boot').style.display = 'none'; $('exp').style.display = '';
    await loadCollection(new URLSearchParams(location.search).get('collection'));   // ?collection=<id>: pre-entered filters from data/collections.json
    const k = new URLSearchParams(location.search).get('sample');   // read BEFORE run(): writeUrl() would drop the param while the panel is still closed
    readUrl();
    if (k && !$('f-q').value.trim()) $('f-q').value = k;   // item 10: ?sample=<key> filters the table to that sample …
    await run();
    if (k) { await showDetail(k); $('detail').scrollIntoView({block: 'start'}); }   // … and opens its detail panel
  } catch (e) { bootFail(e); }
}

function whereClause(skip) {
  const w = [];
  if (AGE && skip !== 'age') w.push(`s.age_at_collection_days >= ${AGE[0]} AND s.age_at_collection_days <= ${AGE[1]}`);
  const q = $('f-q').value.trim();
  if (q) {
    if (/^PRJ[A-Z]*\d+$/i.test(q)) w.push(`s.study_accession = '${esc(q.toUpperCase())}'`);
    else if (/^SAM[NED]A?\d+$/i.test(q) || /^[SED]RR\d+$/i.test(q)) w.push(`(s.sample_key = '${esc(q.toUpperCase())}' OR s.biosample_accession = '${esc(q.toUpperCase())}')`);
    else w.push(`(st.study_title ILIKE '%${esc(q)}%' OR s.study_accession ILIKE '%${esc(q)}%')`);
  }
  for (const sel of document.querySelectorAll('select[data-field]')) { const v = sel.value; if (!v || sel.disabled || (skip === 'hc' && sel.dataset.field === 'health_condition')) continue; w.push(v === '__null__' ? `s."${sel.dataset.field}" IS NULL` : `s."${sel.dataset.field}" = '${esc(v)}'`); }
  for (const inp of document.querySelectorAll('input[data-text]')) {
    const v = inp.value.trim(); if (!v || inp.disabled) continue;
    const cols = inp.dataset.text === 'detailed_location' ? LOC_PARTS.filter(p => COLS.has(p)) : [inp.dataset.text];
    if (cols.length) w.push('(' + cols.map(c => `s."${c}" ILIKE '%${esc(v)}%'`).join(' OR ') + ')');
  }
  if (COLS.has('collection_date') && skip !== 'year') {
    const y0 = $('f-year_min') && $('f-year_min').value, y1 = $('f-year_max') && $('f-year_max').value;
    if (y0) w.push(`TRY_CAST(substr(s.collection_date, 1, 4) AS INTEGER) >= ${parseInt(y0)}`);
    if (y1) w.push(`TRY_CAST(substr(s.collection_date, 1, 4) AS INTEGER) <= ${parseInt(y1)}`);
  }
  const iv = $('f-study_intervention') ? $('f-study_intervention').value : '';
  if (iv === '__none__') w.push(`coalesce(st.study_interventions, '') = ''`);
  else if (iv === '__any__') w.push(`coalesce(st.study_interventions, '') <> ''`);
  else if (iv) w.push(`list_contains(string_split(coalesce(st.study_interventions, ''), ';'), '${esc(iv)}')`);
  const sv = $('f-sample_intervention') ? $('f-sample_intervention').value : '';
  if (sv && COLS.has('intervention')) w.push(sv === '__null__' ? `s.intervention IS NULL` : `list_contains(string_split(coalesce(s.intervention, ''), ';'), '${esc(sv)}')`);
  if ($('f-infant').checked) w.push(`s.infant_scope`);
  if ($('f-has_age').checked) w.push(`s.age_at_collection_days IS NOT NULL`);
  if ($('f-has_subject').checked) w.push(`s.subject_id IS NOT NULL`);
  const mn = $('f-min_fields').value; if (mn !== '') w.push(`s.n_fields_with_value >= ${parseInt(mn)}`);
  for (const c of collectionClauses()) w.push(c);
  return w.length ? 'WHERE ' + w.join(' AND ') : '';
}
// ---- collections (config/collections.yaml → data/collections.json): studies = any-of accessions; filters: list = any-of, {min,max} = range,
// min_samples_per_subject = subjects with >= n samples in the same study. Same semantics as pages/collections.py, so counts match the collection page.
let COLLECTION = null;
async function loadCollection(id) {
  COLLECTION = null; const bar = $('collection-bar'); if (bar) bar.style.display = 'none';
  if (!id) return;
  try {
    const r = await fetch(CFG.collections); if (!r.ok) return;
    const all = await r.json(); if (!all[id]) return;
    COLLECTION = Object.assign({id}, all[id]);
    if (bar) { bar.style.display = ''; bar.innerHTML = `Collection: <b>${h(COLLECTION.title)}</b> — filters pre-entered (<a href="../collections/${h(id)}.html">about this collection</a> · <a href="index.html">clear</a>)`; }
  } catch (e) { COLLECTION = null; }
}
function collectionClauses() {
  if (!COLLECTION) return [];
  const w = [];
  if (COLLECTION.studies && COLLECTION.studies.length) w.push(`s.study_accession IN (${COLLECTION.studies.map(a => `'${esc(String(a))}'`).join(',')})`);
  for (const [k, v] of Object.entries(COLLECTION.filters || {})) {
    if (k === 'min_samples_per_subject') { const mn = (v && typeof v === 'object') ? parseInt(v.min || 1) : parseInt(v); w.push(`(s.study_accession, s.subject_id) IN (SELECT study_accession, subject_id FROM s WHERE subject_id IS NOT NULL GROUP BY 1, 2 HAVING count(*) >= ${mn})`); continue; }
    const col = k === 'collection_year' ? `TRY_CAST(substr(s.collection_date, 1, 4) AS INTEGER)` : (COLS.has(k) ? `s."${k}"` : null);
    if (!col) { w.push('FALSE'); continue; }
    if (v && typeof v === 'object' && !Array.isArray(v)) { if (v.min !== undefined) w.push(`TRY_CAST(${col} AS DOUBLE) >= ${parseFloat(v.min)}`); if (v.max !== undefined) w.push(`TRY_CAST(${col} AS DOUBLE) <= ${parseFloat(v.max)}`); }
    else { const vals = (Array.isArray(v) ? v : [v]).map(x => `'${esc(String(x))}'`); w.push(`CAST(${col} AS VARCHAR) IN (${vals.join(',')})`); }
  }
  return w;
}
const FROM = 'FROM s LEFT JOIN st USING (study_accession)';

function writeUrl() {
  const p = new URLSearchParams();
  if ($('f-q').value.trim()) p.set('q', $('f-q').value.trim());
  for (const sel of document.querySelectorAll('select[data-field], select[data-url], input[data-text], input[data-year]')) if (sel.value && !sel.disabled) p.set(sel.id.replace(/^f-/, ''), sel.value);
  if ($('f-infant').checked) p.set('infant', '1'); if ($('f-has_age').checked) p.set('has_age', '1'); if ($('f-has_subject').checked) p.set('has_subject', '1');
  if ($('f-min_fields').value !== '') p.set('min_fields', $('f-min_fields').value);
  if (page) p.set('page', page + 1);
  if (sortCol !== 'study_accession' || sortDir !== 'ASC') p.set('sort', sortCol + ':' + sortDir);
  if (COLLECTION) p.set('collection', COLLECTION.id);
  if (AGE) p.set('age_d', AGE[0] + '-' + AGE[1]);
  const keep = new URLSearchParams(location.search).get('sample'); if (keep && $('detail').classList.contains('open')) p.set('sample', keep);
  history.replaceState(null, '', location.pathname + (p.toString() ? '?' + p.toString() : '') + location.hash);
}
function readUrl() {
  const p = new URLSearchParams(location.search);
  if (p.get('q')) $('f-q').value = p.get('q');
  if (p.get('study')) $('f-q').value = p.get('study');
  for (const sel of document.querySelectorAll('select[data-field], select[data-url], input[data-text], input[data-year]')) { const v = p.get(sel.id.replace(/^f-/, '')); if (v) sel.value = v; }
  if (p.get('infant')) $('f-infant').checked = true; if (p.get('has_age')) $('f-has_age').checked = true; if (p.get('has_subject')) $('f-has_subject').checked = true;
  if (p.get('min_fields')) $('f-min_fields').value = p.get('min_fields');
  if (p.get('age_d')) { const [a, b] = p.get('age_d').split('-').map(Number); if (isFinite(a) && isFinite(b) && b >= a) AGE = [a, b]; }
  if (p.get('page')) page = Math.max(0, parseInt(p.get('page')) - 1);
  if (p.get('sort')) { const [c, d] = p.get('sort').split(':'); if (SORTABLE.has(c)) { sortCol = c; sortDir = d === 'DESC' ? 'DESC' : 'ASC'; } }
}
function detUrl(acc) { return ['..', 'data', 'studies', h(acc) + '_determinations.csv.gz'].join('/'); }
function routeBadge(r, c) { return r ? `<span class="tag ${h(r)}" title="route ${h(r)}, confidence ${fmtV(c)}">${h(r)}</span>` : ''; }

async function run() {
  const where = whereClause();
  $('count').textContent = 'counting…';
  const c = await conn.query(`SELECT COUNT(*) AS n, COUNT(DISTINCT s.study_accession) AS k ${FROM} ${where}`);
  const c0 = c.toArray()[0].toJSON(); total = Number(c0.n);
  const maxPage = Math.max(0, Math.ceil(total / PAGE) - 1); if (page > maxPage) page = maxPage;
  const r = await conn.query(`SELECT s.* ${FROM} ${where} ORDER BY "${sortCol}" ${sortDir} NULLS LAST, sample_key LIMIT ${PAGE} OFFSET ${page * PAGE}`);
  const rows = r.toArray().map(x => x.toJSON());
  const thead = $('result-table').querySelector('thead'), tbody = $('result-table').querySelector('tbody');
  thead.innerHTML = '<tr>' + SHOW.map(col => SORTABLE.has(col)
    ? `<th data-col="${col}" tabindex="0" role="columnheader button" aria-sort="${col === sortCol ? (sortDir === 'ASC' ? 'ascending' : 'descending') : 'none'}" title="sort by ${col}" style="cursor:pointer">${HDR[col] || col}${col === sortCol ? (sortDir === 'ASC' ? ' ▲' : ' ▼') : ''}</th>`
    : `<th>${HDR[col] || col}</th>`).join('') + '</tr>';
  const td = (val, f, cls) => { const s = val === null || val === undefined ? '' : String(val); const rt = f ? row_[f + '__route'] : null, cf = f ? row_[f + '__confidence'] : null;
    return `<td class="${cls || ''}" title="${h((f || '') + (s ? ': ' + s : '') + (rt ? ' · ' + rt : '') + (cf !== null && cf !== undefined ? ' · confidence ' + fmtV(cf) : ''))}">${h(s)}</td>`; };
  let row_ = null;
  tbody.innerHTML = rows.map(row => { row_ = row; return `<tr data-key="${h(row.sample_key)}" tabindex="0" role="button" aria-label="open details for ${h(row.sample_key)}">` +
    `<td class="mono">${h(row.sample_key)}</td><td>${archiveLink(row.biosample_accession || row.sample_key, (row.biosample_accession || row.sample_key))}</td><td>${studyLink(row)}</td>` +
    td(row.age_category, 'age_category') + td(row.age_at_collection_days === null || row.age_at_collection_days === undefined ? '' : Math.round(Number(row.age_at_collection_days)), 'age_at_collection_days', 'num') +
    td(row.sex, 'sex') + td(row.country, 'country') + td(row.health_condition, 'health_condition', 'tclip') + td(row.intervention, 'intervention', 'tclip') + td(row.antibiotic_exposure, 'antibiotic_exposure') +
    td(row.subject_id, 'subject_id', 'tclip mono') + `<td class="num" title="${h(row.seq_depth_source || '')}">${row.seq_gbp === null || row.seq_gbp === undefined ? '' : Number(row.seq_gbp).toFixed(1)}</td></tr>`; }).join('');
  $('count').textContent = `${total.toLocaleString()} samples match (${Number(c0.k).toLocaleString()} studies)`;
  $('pageinfo').textContent = total ? `page ${page + 1} / ${maxPage + 1}` : '';
  $('prev').disabled = page <= 0; $('next').disabled = page >= maxPage;
  writeUrl();
  drawVis();
}
function studyLink(row) {
  const acc = row.study_accession;
  return `<a href="${CFG.studiesUrl}${h(acc)}.html">${h(acc)}</a>`;
}

async function download() {
  const where = whereClause(), fname = 'gut_samples_slice.csv';
  $('dl-status').textContent = `preparing ${fname} (${total.toLocaleString()} rows)…`;
  try {
    await conn.query(`COPY (SELECT s.*, st.study_title ${FROM} ${where} ORDER BY s.study_accession, s.sample_key) TO '${fname}' (HEADER, DELIMITER ',')`);
    const buf = await db.copyFileToBuffer(fname); await db.dropFile(fname);
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([buf], {type: 'text/csv'})); a.download = fname; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    $('dl-status').textContent = `${fname}: ${(buf.length / 1e6).toFixed(1)} MB`;
  } catch (e) { $('dl-status').textContent = 'download failed: ' + (e.message || e); console.error(e); }
}

async function showDetail(key) {
  const box = $('detail'), body = $('detail-body');
  if (!box.classList.contains('open')) lastFocus = document.activeElement;
  box.classList.add('open'); body.innerHTML = '<p class="status">loading…</p>'; box.focus();
  const r = await conn.query(`SELECT s.*, st.study_title ${FROM} WHERE s.sample_key = '${esc(key)}'`);
  const rows = r.toArray(); if (!rows.length) { body.innerHTML = `<p>No sample <b>${h(key)}</b>.</p>`; return; }
  const s = rows[0].toJSON();
  const p = new URLSearchParams(location.search); p.set('sample', key); history.replaceState(null, '', location.pathname + '?' + p.toString() + location.hash);
  let html = `<h2 style="margin-top:0">${h(key)}</h2><p>${studyLink(s)} · ${h(s.study_title)} · <a href="sample.html?id=${encodeURIComponent(key)}">sample page</a></p>
  <p class="small">${archiveLink(s.biosample_accession || key, 'archive record ' + (s.biosample_accession || key))}${/^[SED]RR\d+$/.test(key) ? '' : ' · <a href="' + CFG.enaSampleUrl + h(s.biosample_accession || key) + '">ENA</a>'} · unit ${h(s.sample_unit)} · body site ${h(s.body_site_code)} (${h(s.body_site_class)}) · source ${h(s.curated_source)}${s.infant_scope ? ' · infant extension' : ''}</p>
  <h3>Age category</h3><p><b>${h(s.age_category)}</b> <span class="small">(basis: ${h(s.age_category_basis)})</span></p>
  <h3>Fields</h3><table class="tbl kv">`;
  const tierOf = f => (CFG.coreFields || []).includes(f) ? 'core' : 'key';
  for (const f of FIELDS) {
    if (f === 'detailed_location') { if (LOC_PARTS.some(p => COLS.has(p))) html += `<tr><td>detailed_location <span class="tag tier-key">key</span></td><td>${h(detailedLocation(s))}</td></tr>`; continue; }
    if (!COLS.has(f)) continue;   // column absent from this package → omitted
    html += `<tr><td>${f} <span class="tag tier-${tierOf(f)}">${tierOf(f)}</span></td><td>${fmtV(s[f])} ${routeBadge(s[f + '__route'], s[f + '__confidence'])}</td></tr>`;
    if (f === 'lifestyle' && COLS.has('lifestyle_detail') && s.lifestyle_detail) html += `<tr><td>lifestyle_detail</td><td class="small">${h(s.lifestyle_detail)}</td></tr>`;
  }
  if (s.health_condition_detail) html += `<tr><td>health_condition_detail</td><td class="small">${h(s.health_condition_detail)}</td></tr>`;
  if (COLS.has('latitude') && COLS.has('longitude') && s.latitude !== null && s.latitude !== undefined && s.longitude !== null && s.longitude !== undefined) {
    const la = Number(s.latitude), lo = Number(s.longitude);
    html += `<tr><td>latitude, longitude</td><td>${la.toFixed(4)}, ${lo.toFixed(4)} ${routeBadge(s.latitude__route, s.latitude__confidence)} · <a href="https://www.openstreetmap.org/?mlat=${la}&mlon=${lo}#map=8/${la}/${lo}">OpenStreetMap</a></td></tr>`;
  }
  html += '</table>';
  const inf = ['delivery_mode', 'feeding_mode', 'preterm_status', 'gestational_age_weeks', 'birth_weight_grams', 'maternal_antibiotics', 'probiotic_exposure', 'hmo_supplementation', 'nec_status'].filter(f => COLS.has(f) && s[f] !== null && s[f] !== undefined);
  if (inf.length) html += '<h3>Infant extension fields</h3><table class="tbl kv">' + inf.map(f => `<tr><td>${f}</td><td>${fmtV(s[f])}</td></tr>`).join('') + '</table>';
  html += `<h3>Evidence</h3><p class="small">Every value above has an evidence row (verbatim quote ≤ 12 words, labelled source, locator, route, confidence): <a href="${detUrl(s.study_accession)}">${h(s.study_accession)}_determinations.csv.gz</a> (this study) or <span class="mono">gut_sample_determinations.parquet</span> (all). Cohort-wide statements (R3/R4) are shown on the <a href="${CFG.studiesUrl}${h(s.study_accession)}.html">study page</a>.</p>`;
  body.innerHTML = html;
}

$('apply').addEventListener('click', () => { page = 0; run(); });
$('reset').addEventListener('click', () => { AGE = null; history.replaceState(null, '', location.pathname + location.hash); for (const el of document.querySelectorAll('.filters select, .filters input')) { if (el.type === 'checkbox') el.checked = false; else el.value = ''; } page = 0; sortCol = 'study_accession'; sortDir = 'ASC'; run(); });
$('prev').addEventListener('click', () => { page = Math.max(0, page - 1); run(); });
$('next').addEventListener('click', () => { page++; run(); });
$('dl-csv').addEventListener('click', download);
$('detail-close').addEventListener('click', closeDetail);
function activate(e) {
  const th = e.target.closest('th[data-col]'); if (th) { const c = th.dataset.col; if (sortCol === c) sortDir = sortDir === 'ASC' ? 'DESC' : 'ASC'; else { sortCol = c; sortDir = 'ASC'; } page = 0; run(); return; }
  if (e.target.closest('a')) return;
  const tr = e.target.closest('tr[data-key]'); if (tr) showDetail(tr.dataset.key);
}
$('result-table').addEventListener('click', activate);
$('result-table').addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { if (e.target.closest('th[data-col], tr[data-key]')) { e.preventDefault(); activate(e); } } });
function closeDetail() { $('detail').classList.remove('open'); const p = new URLSearchParams(location.search); p.delete('sample'); history.replaceState(null, '', location.pathname + (p.toString() ? '?' + p.toString() : '') + location.hash); if (lastFocus) lastFocus.focus(); }
document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('detail').classList.contains('open')) closeDetail(); });
for (const el of document.querySelectorAll('.filters input')) el.addEventListener('keydown', e => { if (e.key === 'Enter') { page = 0; run(); } });
for (const el of document.querySelectorAll('.filters select, .filters input[type=checkbox]')) el.addEventListener('change', () => { page = 0; run(); });

// ---- R2026.25 linked mini-charts above the table: age strip (drag), condition treemap (click), collection-year timeline (drag).
// Each chart counts the rows matching every OTHER filter (crossfilter), so a brushed chart still shows its full distribution.
const VIS_AGE_TICKS = [[1, '1 d'], [7, '1 wk'], [30.4, '1 mo'], [365.25, '1 y'], [3652.5, '10 y'], [36525, '100 y']];
const fmtAge = d => d < 7 ? Math.round(d) + ' d' : d < 60 ? Math.round(d / 7) + ' wk' : d < 730 ? Math.round(d / 30.4) + ' mo' : Math.round(d / 365.25) + ' y';
const SEXC = {female: '#c9a45c', male: '#7d8aa0', other: '#ddd6c6'};
let visTok = 0, visBusy = false, visAgain = false;
async function q(sql) { return (await conn.query(sql)).toArray().map(x => x.toJSON()); }
async function drawVis() {
  if (!window.d3 || !$('vis')) return;
  if (visBusy) { visAgain = true; return; }
  visBusy = true; const tok = ++visTok;
  try {
    const NB = 36, L0 = 0, L1 = Math.log10(36525 + 1);
    const ages = await q(`SELECT LEAST(${NB - 1}, GREATEST(0, CAST(floor((log10(s.age_at_collection_days + 1) - ${L0}) / ${(L1 - L0) / NB}) AS INTEGER))) AS b,
      CASE WHEN s.sex IN ('female', 'male') THEN s.sex ELSE 'other' END AS sx, COUNT(*) AS n ${FROM} ${andWhere(whereClause('age'), 's.age_at_collection_days >= 0')} GROUP BY 1, 2`);
    const hcs = await q(`SELECT coalesce(s.health_condition, '__null__') AS c, COUNT(*) AS n ${FROM} ${whereClause('hc')} GROUP BY 1 ORDER BY 2 DESC`);
    const yrs = COLS.has('collection_date') ? await q(`SELECT TRY_CAST(substr(s.collection_date, 1, 4) AS INTEGER) AS y, COUNT(*) AS n ${FROM} ${andWhere(whereClause('year'), 's.collection_date IS NOT NULL')} GROUP BY 1 HAVING y BETWEEN 1980 AND ${new Date().getFullYear()} ORDER BY 1`) : [];
    if (tok !== visTok) return;
    drawAge(ages, NB, L0, L1); drawHc(hcs); drawYear(yrs);
  } catch (e) { console.warn('vis', e); }
  finally { visBusy = false; if (visAgain) { visAgain = false; drawVis(); } }
}
function andWhere(w, extra) { return w ? w + ' AND ' + extra : 'WHERE ' + extra; }
function visBox(id) { const el = $(id); const W = Math.max(160, el.clientWidth), H = el.clientHeight || 96; el.innerHTML = ''; return {el, W, H, svg: d3.select(el).append('svg').attr('width', W).attr('height', H).attr('viewBox', `0 0 ${W} ${H}`)}; }
function visNote(id, html) { const el = $(id + '-sel'); if (el) el.innerHTML = html; }
function rerun() { page = 0; run(); }
function drawAge(rows, NB, L0, L1) {
  const {svg, W, H} = visBox('vis-age'); const m = {l: 4, r: 4, t: 4, b: 16};
  const bins = d3.range(NB).map(b => ({b, female: 0, male: 0, other: 0}));
  for (const r of rows) bins[Number(r.b)][r.sx] += Number(r.n);
  const tot = d3.sum(bins, d => d.female + d.male + d.other);
  const x = d3.scaleLinear().domain([L0, L1]).range([m.l, W - m.r]);
  const ymax = d3.max(bins, d => d.female + d.male + d.other) || 1;
  const y = d3.scaleLinear().domain([0, ymax]).range([H - m.b, m.t]);
  const bw = (W - m.l - m.r) / NB;
  const st = d3.stack().keys(['female', 'male', 'other'])(bins);
  const sel = AGE ? [Math.log10(AGE[0] + 1), Math.log10(AGE[1] + 1)] : null;
  svg.append('g').selectAll('g').data(st).join('g').attr('fill', d => SEXC[d.key]).selectAll('rect').data(d => d).join('rect')
    .attr('x', (d, i) => x(L0 + i * (L1 - L0) / NB) + 0.5).attr('width', Math.max(1, bw - 1)).attr('y', d => y(d[1])).attr('height', d => Math.max(0, y(d[0]) - y(d[1])))
    .attr('opacity', (d, i) => { if (!sel) return 1; const c = L0 + (i + 0.5) * (L1 - L0) / NB; return c >= sel[0] && c <= sel[1] ? 1 : 0.28; })
    .append('title').text((d, i) => { const a = Math.pow(10, L0 + i * (L1 - L0) / NB) - 1, b = Math.pow(10, L0 + (i + 1) * (L1 - L0) / NB) - 1; return `${fmtAge(a)} – ${fmtAge(b)}: ${(d.data.female + d.data.male + d.data.other).toLocaleString()} samples (${d.data.female.toLocaleString()} female, ${d.data.male.toLocaleString()} male)`; });
  const ax = svg.append('g').attr('class', 'vis-ax').attr('transform', `translate(0,${H - m.b + 2})`);
  for (const [d, l] of VIS_AGE_TICKS) { const xx = x(Math.log10(d + 1)); ax.append('line').attr('x1', xx).attr('x2', xx).attr('y1', 0).attr('y2', 3); ax.append('text').attr('x', xx).attr('y', 12).attr('text-anchor', d < 2 ? 'start' : d > 30000 ? 'end' : 'middle').text(l); }
  const br = d3.brushX().extent([[m.l, m.t], [W - m.r, H - m.b]]).on('end', ev => {
    if (!ev.sourceEvent) return;
    if (!ev.selection) { if (AGE) { AGE = null; rerun(); } return; }
    const [a, b] = ev.selection.map(v => Math.max(0, Math.round(Math.pow(10, x.invert(v)) - 1))); AGE = [a, Math.max(a, b)]; rerun(); });
  const g = svg.append('g').attr('class', 'vis-brush').call(br);
  if (sel) g.call(br.move, sel.map(x));
  visNote('vis-age', AGE ? `${fmtAge(AGE[0])} – ${fmtAge(AGE[1])} <button type="button" class="vis-x" id="vis-age-x" title="clear age range">×</button>` : (tot ? `${tot.toLocaleString()} with age` : 'no ages'));
  const xb = $('vis-age-x'); if (xb) xb.onclick = () => { AGE = null; rerun(); };
}
function drawHc(rows) {
  const {svg, W, H} = visBox('vis-hc'); const sel = $('f-health_condition').value;
  const nNull = d3.sum(rows.filter(r => r.c === '__null__'), r => Number(r.n)); rows = rows.filter(r => r.c !== '__null__');
  const TOP = 11; const top = rows.slice(0, TOP).map(r => ({c: r.c, n: Number(r.n)}));
  const rest = d3.sum(rows.slice(TOP), r => Number(r.n)); if (rest) top.push({c: '__other__', n: rest});
  const root = d3.hierarchy({children: top}).sum(d => d.n || 0);
  d3.treemap().size([W, H]).paddingInner(2).round(true)(root);
  const pal = d3.scaleOrdinal().range(['#cfb87c', '#a2a4a3', '#e1d3a9', '#8c9db0', '#d8c18d', '#b9b2a0', '#e9dfc2', '#a9b6c3', '#cdbf9a', '#c4c8cc', '#efe6cd']);
  const lab = c => c === '__null__' ? '(no value)' : c === '__other__' ? 'other' : String(c).replace(/_/g, ' ');
  const tot = d3.sum(top, d => d.n);
  const cell = svg.selectAll('g').data(root.leaves()).join('g').attr('transform', d => `translate(${d.x0},${d.y0})`)
    .attr('class', d => 'vis-tile' + (d.data.c === '__other__' ? ' other' : '') + (sel && d.data.c === sel ? ' on' : '')).style('cursor', d => d.data.c === '__other__' ? 'default' : 'pointer')
    .on('click', (ev, d) => { if (d.data.c === '__other__') return; const s = $('f-health_condition'); const v = d.data.c; if (![...s.options].some(o => o.value === v)) return; s.value = s.value === v ? '' : v; rerun(); });
  cell.append('rect').attr('width', d => Math.max(0, d.x1 - d.x0)).attr('height', d => Math.max(0, d.y1 - d.y0)).attr('rx', 3)
    .attr('fill', (d, i) => d.data.c === '__null__' ? '#f1efe9' : pal(i)).attr('opacity', d => !sel || d.data.c === sel ? 1 : 0.35);
  cell.append('title').text(d => `${lab(d.data.c)}: ${d.data.n.toLocaleString()} samples (${(100 * d.data.n / (tot || 1)).toFixed(1)}%)${d.data.c === '__other__' ? '' : sel === d.data.c ? ' — click to clear' : ' — click to filter'}`);
  cell.filter(d => d.x1 - d.x0 > 42 && d.y1 - d.y0 > 15).append('text').attr('x', 4).attr('y', 12).text(d => { const w = (d.x1 - d.x0 - 8) / 5.6; const t = lab(d.data.c); return t.length > w ? t.slice(0, Math.max(1, w - 1)) + '…' : t; });
  visNote('vis-hc', sel ? `${h(lab(sel))} <button type="button" class="vis-x" id="vis-hc-x" title="clear condition">×</button>` : (nNull ? `${nNull.toLocaleString()} without a value` : 'click a tile'));
  const xb = $('vis-hc-x'); if (xb) xb.onclick = () => { $('f-health_condition').value = ''; rerun(); };
}
function drawYear(rows) {
  const box = $('vis-year'); if (!box) return;
  if (!rows.length) { box.closest('.vis-card').style.display = 'none'; return; }
  const {svg, W, H} = visBox('vis-year'); const m = {l: 4, r: 4, t: 6, b: 16};
  const data = rows.map(r => ({y: Number(r.y), n: Number(r.n)}));
  const y0 = d3.min(data, d => d.y), y1 = d3.max(data, d => d.y);
  const full = d3.range(y0, y1 + 1).map(yy => ({y: yy, n: (data.find(d => d.y === yy) || {n: 0}).n}));
  const x = d3.scaleLinear().domain([y0 - 0.5, y1 + 0.5]).range([m.l, W - m.r]);
  const yy = d3.scaleLinear().domain([0, d3.max(full, d => d.n) || 1]).range([H - m.b, m.t]);
  const a = d3.area().x(d => x(d.y)).y0(H - m.b).y1(d => yy(d.n)).curve(d3.curveMonotoneX);
  const lo = parseInt($('f-year_min').value) || null, hi = parseInt($('f-year_max').value) || null;
  svg.append('path').datum(full).attr('class', 'vis-area').attr('d', a);
  svg.append('path').datum(full).attr('class', 'vis-line').attr('d', d3.line().x(d => x(d.y)).y(d => yy(d.n)).curve(d3.curveMonotoneX));
  svg.append('g').selectAll('rect').data(full).join('rect').attr('x', d => x(d.y - 0.5)).attr('width', d => x(d.y + 0.5) - x(d.y - 0.5)).attr('y', m.t).attr('height', H - m.b - m.t).attr('fill', 'transparent')
    .append('title').text(d => `${d.y}: ${d.n.toLocaleString()} samples`);
  const ax = svg.append('g').attr('class', 'vis-ax').attr('transform', `translate(0,${H - m.b + 2})`);
  const step = (y1 - y0) > 24 ? 10 : 5; for (let t = Math.ceil(y0 / step) * step; t <= y1; t += step) { ax.append('line').attr('x1', x(t)).attr('x2', x(t)).attr('y1', 0).attr('y2', 3); ax.append('text').attr('x', x(t)).attr('y', 12).attr('text-anchor', 'middle').text(t); }
  const br = d3.brushX().extent([[m.l, m.t], [W - m.r, H - m.b]]).on('end', ev => {
    if (!ev.sourceEvent) return;
    if (!ev.selection) { $('f-year_min').value = ''; $('f-year_max').value = ''; rerun(); return; }
    const [p, q2] = ev.selection.map(v => Math.round(x.invert(v))); $('f-year_min').value = Math.max(y0, p); $('f-year_max').value = Math.min(y1, Math.max(p, q2)); rerun(); });
  const g = svg.append('g').attr('class', 'vis-brush').call(br);
  if (lo || hi) g.call(br.move, [x((lo || y0) - 0.5), x((hi || y1) + 0.5)]);
  visNote('vis-year', (lo || hi) ? `${lo || y0}–${hi || y1} <button type="button" class="vis-x" id="vis-year-x" title="clear years">×</button>` : `${d3.sum(full, d => d.n).toLocaleString()} dated`);
  const xb = $('vis-year-x'); if (xb) xb.onclick = () => { $('f-year_min').value = ''; $('f-year_max').value = ''; rerun(); };
}
let visRs = null; window.addEventListener('resize', () => { clearTimeout(visRs); visRs = setTimeout(drawVis, 200); });
init();

// R2026.18: home-style search box + filters toggle
(function () {
  const tq = document.getElementById('top-q'), fq = document.getElementById('f-q'), tg = document.getElementById('toggle-filters'), ex = document.getElementById('exp');
  if (tq && fq) { let t = null; tq.value = fq.value || new URLSearchParams(location.search).get('q') || '';
    tq.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { fq.value = tq.value; const b = document.getElementById('apply'); if (b) b.click(); }, 300); }); }
  if (tg && ex) tg.addEventListener('click', () => { const off = ex.classList.toggle('nofilters'); tg.setAttribute('aria-expanded', off ? 'false' : 'true'); tg.textContent = off ? 'Filters' : 'Hide filters'; });
})();
