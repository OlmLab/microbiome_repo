# Infant Gut Shotgun-Metagenome Catalog — CATALOG_REPORT (release 2026-09-18)

Grant context: Anthropic grant on organizing human microbiome metadata. Scope locked 2026-09-14: DNA shotgun metagenomics (ENA `library_source=METAGENOMIC`, `library_strategy` WGS/WXS; OTHER/Targeted-Capture adjudicated), human subjects 0–36 months (preterm included), gut/stool primary; maternal stool, breast milk and vaginal samples retained only inside an infant cohort. Every committed value carries a labelled evidence quote (≤12 words) and passes the `infant-curation-rules` validators; exclusions use the 22-code controlled vocabulary; no identifier was written from model memory.

## 1. Headline numbers

| quantity | value |
|---|---:|
| ENA studies enumerated (universe) | 5,942 original + 144 gap-fill + 2,732 growth channels (re-enumeration v2, virome slice, misfiled GENOMIC, external-repo leads) + 206 enumeration-v3 delta + 455 growth round 2 (frame-free sweep, v3 full run, KoNA/CNGBdb mirrors) + 38 frame-free ambiguous remnant + 62 growth round 3 (BioSample attributes, cohort names, reanalysis links) = **9,579** |
| ENA runs in universe | 859,851 (+24,160 gap-fill, in-scope strategies) |
| Papers harvested (Europe PMC) | 12,859 |
| Papers screened in (human + infant + shotgun + primary data) | 1,404 (+739 maybe) |
| **Studies included in the catalog** | **389** (incl. 30 from the separate human-review pass, stage `session_model_review`) |
| samples / runs in included studies | 153,701 / 174,022 |
| human-review residue (unresolvable + validator-rejected) | 52 — 41 UNRESOLVABLE after two full-text rounds; 11 uncertain from growth round 3 (archive/BioSample evidence only; outreach pack in release) |
| studies excluded | 9,138 (2,275 deterministic, 6,863 LLM) |
| paper→study links | 1,341 edges (417 papers, 540 studies); 345 own-data |
| cohorts (entity-resolved) | 188 multi-member + 2,095 singletons |
| recall vs curatedMetagenomicData gold (22 BioProjects) | 17/22 = 0.77 (CI 0.57–0.90) study-level (18/22 incl. the human-review pass); 12/14 = 0.86 substantive; **0.972 sample-weighted** |
| gold-negative include rate | 2/108 = 1.9% |
| inter-judge κ (Opus blind vs Sonnet majority, n=200) | 0.77 (3-class) / 0.85 (include vs not) |
| in-universe coverage (capture–recapture) | N̂ = 302–383 → 0.77–0.98; conservative headline 0.78 |
| LLM tokens, whole pipeline | ≈ 47.3 M (see BUDGET.md) |

## 2. Machine-checkable inclusion criteria
A study is `included` iff all four hold with a cited quote: (1) host is *Homo sapiens* (host_tax_id 9606 or an explicit human statement); (2) ≥1 run with `library_source=METAGENOMIC` and strategy WGS/WXS, or OTHER/Targeted-Capture with a shotgun depth signature; (3) primary site gut/stool/meconium (linked sites only alongside infant gut samples); (4) ≥1 sample from a subject aged 0–1,100 days, evidenced by an archive attribute, a sample-title convention, the study description, a linked paper's title/abstract/data-availability text, or a per-sample supplementary table whose sample IDs map to the study's accessions (`paper.supp.table`). Adult cohorts with an incidental infant subgroup are included with `n_infant_samples_est`. Deterministic exclusions: non-human host taxon, isolate genomes, amplicon/RNA-only, environmental/synthetic. Rows that fail any validator are kept as `validator_rejected` and routed to human review.

## 3. Cascade and how each included study was decided
| decision stage | included studies |
|---|---:|
| sonnet_replicates_n3_agree1.00 | 214 |
| opus_adjudication | 68 |
| sonnet_replicates_n2_agree1.00 | 12 |
| supp_rescue_deterministic | 9 |
| opus_adjudication_rescue | 4 |
| opus_adjudication_linked | 3 |

Pipeline: deterministic auto-exclude (1,112; Sonnet audit 100/100 agree) → Haiku batched screen of 3,978 studies (40/request) → Sonnet 4-criterion rubric on 1,135 candidates (4/request) → Sonnet ×3 replicates on 558 include/unsure/sample (401 unanimous, 136 majority, 9 split) → Opus adjudication of 290 disagreements + 124 paper-linked studies (Sonnet, with paper context) + 32 linked adjudications → supplement-table rescue (134 candidates; 9 included by the study-matched-ID rule, 4 by Opus) → gap-fill re-enumeration (171 studies; Sonnet ×2 agreement 168/171, Opus on 11). Literature channel: Haiku 4-slot screen of 12,859 abstracts (25/request; 952 re-run at 10/request after batch drop-outs), full-text fetch (6,528 JATS ok / 1,125 HTTP 500), 484,485 raw accession mentions → 1,319 links (205 deterministic from data-availability sections, 39 single-mention, 1,075 Sonnet-adjudicated), plus 22 from bioRxiv/medRxiv JATS.

## 4. Per-channel recall on gold (22 cMD BioProjects)
Signals present on gold positives: literature link 19/22; Haiku screen `yes` 10/22; ENA keyword flag 9/22; title pattern 4/22. Stage that captured them: Sonnet unanimous 9, Opus adjudication 4, supplement rescue 4, missed 4 (+1 unsure). Recall by release year (proxy held-out): <2019 12/13; ≥2019 5/9 — recent, weakly annotated deposits are the soft spot. The post-2025-06 held-out split is empty (cMD's newest infant cohort is 2022). Remaining misses are documented disagreements: PRJNA486009 (assay: ENA says isolate genomes), PRJNA516054 / PRJNA521455 (age granularity: "children"/"preschool", no per-sample age table linked), PRJNA397112 / PRJNA529400 (2–4 infant samples inside pooled meta-analysis tables; below the resolution of readable supplements).

## 5. Recoverability of decisive metadata (292 included studies assessed; gap-fill not assessed)
Share of included samples by best tier (R1 archive attribute / R2 per-sample supplementary table / R3 text only / R0 none): see `field_atlas.png` panel a. Age at collection is per-sample recoverable (R1+R2) for 59% of included samples; delivery 42%; feeding 42%; preterm 29%; antibiotics 34%; probiotics 31%. 184 of 436 included/unsure studies have no linked paper at all (orphan deposits, 75,729 samples) and are R0 across fields unless archive attributes exist. R1 is a lower bound: the ENA `age` field was empty for every harvested run and BioSample attribute XML was not harvested — the first item of future work.

## 6. Frames, access and abstract-only curation
Archive vs literature: 151 matched pairs, 206 orphan deposits, 75 studies linked only through reuse; 1,167 screened-in papers with no universe study ("phantom-data" papers: 602 without full text, 291 with full text but no accession, 245 with accessions outside the universe — 85 amplicon, 28 isolate, 40 BioProjects without reads, 32 unresolvable, 7 true enumeration misses now gap-filled, 11 external-repository only). 620 of 1,404 screened-in papers (44%) can only support abstract-level curation (`evidence_limited_to=abstract`, confidence ≤0.6): 503 are preprint/abstract-only tiers and 117 are OA papers whose full text Europe PMC failed to serve. Controlled-access registry: 29 entries (19 dbGaP, 6 EGA; TEDDY PRJNA400115 ranks #1 on the worklist but is blocked). 240 paper↔study mismatch links (paper says infant/shotgun, study excluded or non-WGS): 40 reviewed (25 triage correct, 12 misfiled strategy, 2 triage-error candidates, 1 link error); 200 reused-data mismatches listed unreviewed.

## 7. Mislabelling audit (334,024 ENA runs across 436 studies)
No WGS run in any included/unsure study carries a `target_gene`. 11 studies are deposited entirely as `OTHER` yet have NovaSeq/NextSeq shotgun depth (e.g. PRJNA588513/588514, PRJEB84376/89462, PRJNA1046438) — catalog-relevant shotgun hidden behind the OTHER label; 2 WGS studies (PRJEB9403 BAMBI, PRJEB28671 IHAT) have MiSeq depth compatible with either shallow shotgun or amplicon (confidence 0.5, paper check required); 92 studies are genuinely mixed-assay and need run-level inclusion. Signatures are undefined for ~25% of runs with `read_count=0` in ENA.

## 8. Coverage estimate
Capture–recapture over 296 included studies with four sources (ENA signals 274, literature 205, cMD 17, snowball 68): Chapman S1×S2 N̂ = 302 (295–309) and log-linear k=3 N̂ = 299–302 agree but rest on positively dependent sources (lower bounds on N); the cMD-anchored estimates give N̂ ≈ 380 (300–514). Headline: **coverage 0.77–0.98 of in-universe infant shotgun studies; 0.78 conservatively**. Outside the original universe, the probe found two enumeration bugs (taxid 3007725 → 2705415 for "human feces metagenome"; the OTHER slice never run for taxon 9606) accounting for 171 studies — now gap-filled (14 new includes: HELMi, PREVENT 1, HMO-formula trials, PRIMAL, maternal FMT). Non-recoverable: 25 controlled-access deposits, 73 GSA accessions (unassessed), 32 unresolvable BioProject strings.

## 8b. Universe growth (2026-09-18/23)
After release v1 the universe was grown through five channels (fixed re-enumeration, virome taxon slice, literature snowball, external repositories, misfiled `library_source=GENOMIC`): 2,732 new studies triaged, +22 included (e.g. PRJEB49383 preterm neonatal stool 2,351 samples; PRJNA1060349; PRJEB46943 COPSAC infant virome; 13 misfiled-GENOMIC infant cohorts). The literature channel is saturated against the fixed enumeration; GMrepo's 18 infant metagenomic projects are all in the universe. 22 open GSA infant-gut deposits and 342 controlled GSA-Human studies form a non-INSDC annex. Full account: `universe_growth_report.md`. Downstream assessment (paper links, recoverability, cohorts, covariates, worklist) was subsequently extended to all growth/gap-fill included and unsure studies — `assessed_downstream=True` for 425 studies; only 1 (the v3-delta include PRJEB35919) remains unassessed. Worklist v2 covers 517 studies (`extraction_worklist.csv`, `yield_curve_v2.png`): 4 addendum studies enter the top 50.

### 8c. Growth round 2 (2026-09-24)
A frame-free sweep of every METAGENOMIC WGS/WXS run in ENA (1.46M runs) found 442 human-signal studies outside every taxon frame — 237 under a blank tax_id — and added **14 included infant cohorts (~10,300 samples)**, most deposited in 2025–26. The v3 full run confirmed the frame is a superset of the catalog and refreshed 226 studies' run counts. KoNA (now K-BDS KRA) and CNGBdb hold no infant shotgun deposits outside INSDC except 5 CNGB-native cohorts that cannot join. Details: `universe_growth_report.md`, `frame_free_sweep_report.md`, `V3_FULL_RUN.md`, `nonINSDC_round2_report.md`. Human-review round 2 (separate session) then resolved 41 of the 60 archive-only uncertains (7 include / 34 exclude / 19 unresolvable). Downstream addendum #2 then assessed the remaining 25 included/unsure studies, so every included/unsure study now carries recoverability, cohort and worklist fields (`assessed_downstream=True` for all). Worklist v3 = 429 open included/unsure studies (113 v2 rows dropped because their outcome is now excluded); age R1+R2 reachable for ~48% of the 149,852 open samples (`yield_curve_v3.png`). Loose ends closed 2026-09-24: the 523 frame-free 'ambiguous' human/animal ties were filtered to 38 and rubric-judged (0 include, 1 uncertain); the three sibling deposits of the included paediatric-leukaemia cohort were re-checked with the cohort paper (PRJEB59728 → include at 0.58; PRJEB29237/PRJEB41463 → uncertain, per-sample ages needed).

### 8d. Growth round 3 (2026-09-24)
BioSample-attribute sweep, cohort-name cross-walk and reanalysis-link following added 4 includes (PRJNA1368374, PRJNA687137, PRJNA61745, and PRJEB49206 overturned from exclude on 53 infant-age BioSample records) and, more usefully, per-sample infant annotations for 108 included studies (`biosample_infant_samples.parquet`, 312,686 flagged samples across ENA/NCBI), cohort names for 75 included studies (`cohort_crosswalk_hits.csv`), a 2,379-row study-relations table, a tested monthly re-sweep tool (`resweep_universe.py`) and a submitter-outreach pack for the unresolvable residue. See `universe_growth_report.md` §Growth round 3. The 11 included/uncertain studies added in this round are not yet downstream-assessed.

## 9. Extraction worklist (top 25 of 435 open studies)
Ranking = expected_field_yield (Σ w_f·p(tier)) × log10(n_samples+1); weights age 3, delivery 2, feeding 2, preterm 1.5, antibiotics 1, probiotic 0.5; p(R1)=0.95, p(R2)=0.8, p(R3)=0.4, p(R4)=0.15, p(R0)=0.05. Working the top 25 / 50 / 100 studies yields 17.7% / 25.5% / 38.5% of the cumulative expected field coverage over 149,861 samples (`yield_curve.png`).

|   rank | study_accession   | cohort_name                      |   n_samples | tier_age   | tier_delivery   | tier_feeding   |   expected_field_yield | effort_class         |
|-------:|:------------------|:---------------------------------|------------:|:-----------|:----------------|:---------------|-----------------------:|:---------------------|
|      2 | PRJEB11419        | singleton study PRJEB11419       |        7024 | R2         | R2              | R2             |                  7     | multiple_supp_tables |
|      3 | PRJNA806984       | singleton study PRJNA806984      |        1347 | R1         | R2              | R2             |                  8.25  | one_supp_table       |
|      4 | PRJEB32631        | Shao 2019 UK                     |        1679 | R2         | R2              | R2             |                  8     | multiple_supp_tables |
|      5 | PRJNA799247       | singleton study PRJNA799247      |        2171 | R2         | R2              | R2             |                  7.625 | one_supp_table       |
|      6 | PRJNA497734       | DIABIMMUNE                       |        1154 | R2         | R2              | R2             |                  8     | multiple_supp_tables |
|      7 | PRJNA296814       | New Hampshire Birth Cohort Study |        1063 | R2         | R2              | R2             |                  8     | multiple_supp_tables |
|      8 | PRJEB24771        | singleton study PRJEB24771       |        1392 | R1         | R2              | R3             |                  7.65  | one_supp_table       |
|      9 | PRJNA698986       | Lou 2021 USA                     |         819 | R1         | R2              | R2             |                  8.25  | one_supp_table       |
|     10 | PRJNA290380       | Majta 2019 Finland               |         785 | R2         | R2              | R2             |                  8     | multiple_supp_tables |
|     11 | PRJEB51728        | Robertson 2023 Zimbabwe          |         875 | R2         | R2              | R2             |                  7.8   | multiple_supp_tables |
|     12 | PRJNA63661        | Taft 2015 USA                    |         667 | R2         | R2              | R2             |                  8     | multiple_supp_tables |
|     13 | PRJEB39610        | Stewart 2013 UK                  |         644 | R2         | R2              | R2             |                  8.025 | multiple_supp_tables |
|     14 | PRJNA345144       | singleton study PRJNA345144      |         646 | R2         | R2              | R2             |                  8     | multiple_supp_tables |
|     15 | PRJNA595749       | COSMIC2                          |         753 | R2         | R2              | R2             |                  7.8   | multiple_supp_tables |
|     16 | PRJNA695570       | Peterson 2021 USA                |        1767 | R2         | R2              | R2             |                  6.8   | multiple_supp_tables |
|     17 | PRJNA473126       | Baumann-Dudenhoeffer 2018 USA    |         402 | R1         | R2              | R2             |                  8.45  | multiple_supp_tables |
|     18 | PRJNA961698       | singleton study PRJNA961698      |         736 | R2         | R2              | R2             |                  7.625 | one_supp_table       |
|     19 | PRJNA376566       | Brooks 2017 USA                  |         407 | R2         | R2              | R2             |                  8.225 | multiple_supp_tables |
|     20 | PRJEB6456         | singleton study PRJEB6456        |         400 | R2         | R2              | R2             |                  8     | multiple_supp_tables |
|     21 | PRJNA838575       | CHILD                            |        2934 | R2         | R3              | R2             |                  6     | multiple_supp_tables |
|     22 | PRJNA475246       | Lamichhane 2022                  |         286 | R1         | R2              | R2             |                  8.45  | multiple_supp_tables |
|     23 | PRJNA489090       | singleton study PRJNA489090      |         429 | R2         | R2              | R2             |                  7.8   | multiple_supp_tables |
|     24 | PRJNA301903       | singleton study PRJNA301903      |         403 | R2         | R2              | R2             |                  7.8   | multiple_supp_tables |
|     25 | PRJEB45799        | Valles-Colomer 2023 Italy        |        2394 | R2         | R2              | R3             |                  6     | one_supp_table       |
|     26 | PRJNA916952       | STORK                            |        1144 | R2         | R2              | R2             |                  6.625 | multiple_supp_tables |

## 10. Technical covariates (310 included studies)
Instrument generation: NovaSeq 102, HiSeq 2000/2500 73, MiSeq/NextSeq 64, HiSeq 3000/4000/X 22, MGI 10, other 21. Median depth per run spans 0.01–30 Gb (three orders of magnitude); long reads are rare. Timepoint design (archive proxy): single 351 / 2–4 timepoints 41 / 5+ 44 (longitudinal designs under-detected). `extraction_protocol` is unpopulated in ENA for every matched run. Half of included studies were first public 2022–2026 (`field_atlas.png` b).

## 11. Known limitations and provisional inputs
* Held-out gold split empty; ≥2019 proxy is not contamination-free. Study-level recall gate (≥0.95) not met (0.77); sample-weighted gate met (0.97).
* R1 lower bound (ENA age empty; BioSample XML not harvested). 132 supplement ZIPs >20 MB not inventoried; 124/324 age tables with unit-less headers not parsed.
* Preprint JATS rescue partial (70/268; HTTP 429). 200 reused-data mismatch links unreviewed. 31 links with sentinel relation.
* Cohort clustering used strong edges only; unique_infants_est committed for 35 cohorts.
* Enumeration v3 (`scope_constants_v3.py`, `enumerate_universe_v3.py`, `ENUMERATION_V3.md`) makes the virome, misfiled-GENOMIC and adjudication slices standing, adds a runtime taxid guard, and corrected FOUR wrong taxids in v1/v2 (human feces 2705415, human milk 1633571, milk 1616037, human vaginal 1632839). Its 206-study delta (mostly generic viral-metagenome and dairy/vaginal taxa) was triaged: 1 include (PRJEB35919, preterm NICU stool phage+shotgun), 205 excluded. The 20 unchanged v2 slices have grown ~1.5k runs since 2026-09-18 and need a full v3 run to refresh.
* GSA annex (`GSA_ANNEX_ASSESSMENT.md`): 188 GSA/GSA-Human candidates triaged with the catalog rubric → 3 included (1 open, CRA015134 preterm cohort 137 samples; 2 controlled HRA), 17 human_review, 168 excluded; +0.3% samples vs the ENA catalog, DDBJ now mirrors post-2025 GSA deposits into ENA (108/108 human shotgun mirrors already in the universe). Recommendation: list-only annex, no parallel catalog. The 3 included GSA studies are in `controlled_access_registry.csv` / `gsa_included_studies.csv`.
* 1,125 tier-A papers (15%) had no full text served by Europe PMC (HTTP 500) at harvest time.

## 12. Files (release/)
`catalog_studies.{parquet,csv}` (6,086 studies, all fields), `catalog_included_studies.csv` (310), `catalog_included_runs.parquet` (143,833 runs), `human_review_queue.csv` (157), `paper_study_links.parquet`, `cohorts.csv`, `recoverability.parquet`, `extraction_worklist.csv`, `mislabel_audit.csv`, `enumeration_misses.csv`, `controlled_access_registry.csv`, `screened_in_papers.parquet`, `schema.json`. Supporting reports: `triage_validation.md`, `coverage_estimate.md`, `recoverability_report.md`, `access_report.md`, `yield_method.md`, `BUDGET.md`.

## 13. Token budget log
See BUDGET.md (final): ≈19.6 M tokens across 3 track agents (Phase 1), 24 leaf workers (Haiku screen 12+1, Sonnet confirm 5+2+1, Opus 3), 4 track agents (Phases 3–4), and ≈1.2 M in-frame. No single frame exceeded 1.6 M.


## 10. Per-sample metadata extraction (final, 2026-09-25)
609,584 validated sample × field determinations over 151,198 samples / 381 included studies; 12 core fields + 4 extension fields (health_condition, multiple_birth, sibling_in_study, geo_subregion). Age at collection: 37% of infant-scope samples; preterm 23%; delivery 20%; antibiotics 14%. Gold (3,670 cMD samples): age precision 0.991 / recall 0.951, delivery 0.995 / 0.932, preterm 1.000 / 0.961. Details `extraction/EXTRACTION_REPORT.md`. Sample unit is the BioSample except for 6 one-BioSample-per-infant deposits keyed per run (§10 of EXTRACTION_REPORT).

## 11. Publication
Data package v1 (`data_package_v1.zip`: README, DATA_DICTIONARY, sample_metadata_wide, study_metadata_wide, cohorts, runs, determinations with evidence, notebook) and a static GitHub Pages website (`site.zip`, 774 pages: study, cohort, explorer with DuckDB-WASM slice downloads, fields, universe, methods; 0 broken internal links of 134,567). Publishing steps: `website/PUBLISH_INSTRUCTIONS.md`.
