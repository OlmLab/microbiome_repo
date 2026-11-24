# VANISH and BloSSUM taxa — written method, version 2 (2026-11-13)

Version 2 replaces `METHOD.md` (v1) on the owner's instruction. It is the only specification for both implementations.
Sections 1–3 and 5–6 of v1 stand unless changed here; everything that differs is written out in full.
Terms: NI = non-industrialized group; REF = reference group; cohort = `study_group_id` when the project has one, else
`study_accession`; stratum = `adult` (age_category adult, elderly) or `infant` (infant, neonate).

## A. Model-based definition

### A1. Inputs added in v2

- External label table (argument): CSV with `sample_key`, `ext_label` (`H-G`, `Transitional` or `Industrial`), `ext_source`.
  It carries the lifestyle labels of Carter et al. 2023, Supplemental Table S4, assigned to catalog samples. These are
  external labels: they are not catalog values and every output marks them as external.
- Samples, QC, strata, order key, one sample per person, cap of 100 per cohort and group, cells under 10 dropped,
  estimability (3 cohorts and 30 samples per group), depth covariate z: exactly as v1 section 2 (steps 1–3, 6–8).

### A2. Groups

- **NI-ext (primary)**: the sample's stated `lifestyle` is hunter_gatherer, indigenous_community, pastoralist or
  traditional_agriculturalist; OR its `ext_label` is `H-G` or `Transitional` and its stated lifestyle is not
  urban_industrialized. A sample with stated urban_industrialized and an external NI label is in no group (count them).
- **NI-strict**: stated labels only (the four values above). **NI-broad**: NI-ext plus stated rural_non_industrialized.
- **REF-hdi (primary reference)**: country in the `high` HDI band of `country_hdi.csv`, stated lifestyle null or
  urban_industrialized, and not in the NI group of the contrast. **REF-stated**: stated urban_industrialized, not NI.
- Contrasts: **C1 primary = NI-ext vs REF-hdi**; C2 = NI-ext vs REF-stated (sensitivity: stated reference);
  C3 = NI-strict vs REF-hdi (sensitivity: catalog labels only); C4 = NI-broad vs REF-hdi (sensitivity: broad).
  Each in both strata, at species, genus and family level (v1 section 3 for taxa and the testing rule).

### A3. Prevalence model, score

As v1 section 4: logit P(detected_ij) = b0 + b1 NI_ij + b2 z_ij + u_j, u_j ~ Normal(0, s^2); Laplace-approximated
marginal likelihood (adaptive Gauss-Hermite also acceptable); penalty -b1^2 / (2 * 2.5^2); score = b1 / ln 2.
- **Bound (v2):** 0.01 <= s <= 12.
- **Optimisation (v2):** every fit is run from s = 0.05, 0.5 and 1.5 (plus any warm start) and keeps the highest
  penalised log-likelihood.
- T = 2 * (maximised penalised log-likelihood with b1 free - maximised log-likelihood with b1 = 0), clipped at 0.
  `p_lrt` = chi-square(1) tail of T (reported, and used only in A5).

### A4. p-values from cohort-label permutations (v2)

- Cohort label: 1 if the majority of the cohort's analysis samples are NI (ties count as NI), else 0. Sort cohorts by
  cohort id (ascending, as strings); L = label vector in that order, n = its length.
- Permutation b = 1..B: `pi = numpy.random.default_rng(20261113 + b).permutation(n)`; cohort i receives label `L[pi[i]]`;
  every sample takes its cohort's permuted label. Samples, z and the tested taxa are those of the observed analysis.
- For each tested taxon i and permutation b: T_ib from the full fit under permuted labels and the OBSERVED null fit
  (the null model has no group term, so it does not change).
- p_i = (1 + #{b : T_ib >= T_i}) / (1 + B). q = Benjamini-Hochberg over the tested taxa of one level x contrast x stratum
  (the standard step-up procedure, as `statsmodels` `fdr_bh`).
- B = 200 for C1 and C2; B = 100 for C3 and C4. Store T_ib (taxa x B) on disk; the stage must be resumable.

### A5. Candidates, leave one cohort out, class

Thresholds (arguments, defaults): Q = 0.05, S_min = 2.0, D_min = 0.10, P_loco = 0.01.
- Candidate: q < Q, |score| >= S_min, and the two groups' mean per-cohort prevalences differ by at least D_min in the
  direction of the score.
- Leave-out set: every NI cohort; and every REF cohort when REF has 30 cohorts or fewer. Refit A3 without that cohort
  (z recomputed). **Stable** if in every refit the score keeps its sign, |score| >= S_min and p_lrt <= P_loco.
  A refit that cannot be done makes the candidate not stable.
- Class per contrast: VANISH = stable and score > 0; BloSSUM = stable and score < 0.
- **Headline class (v2) = the class under C1**, per level and stratum. C2–C4 are shown as sensitivity analyses.

### A6. Calibration against Carter's lists (declared)

For species x adult x C1 the implementation reports the number of stable VANISH and BloSSUM species, and their
agreement with Carter's lists, at the defaults and under each single relaxation: S_min in {1.585, 1.0}; D_min = 0.05;
P_loco = 0.05; Q = 0.10. At most ONE threshold may be relaxed, chosen by the main session and recorded; the page states
that Carter's lists were used for this calibration and that Carter's cohorts are part of the NI group.

### A7. Shuffled-label check of the whole class rule

For b* = 1..20 treat permutation b* as if it were the data: T_i = T_ib*, p_i from the other B - 1 permutations,
q, candidates (scores and prevalences recomputed under the shuffled labels), leave-one-cohort-out, classes. Report per
b* the number of taxa with q < Q, candidates and stable classes, for C1 and C2, species level, adults.

## B. Simple rule (owner's rule; github.com/MrOlm/microbiome-atlas, scripts/vanish.py, commit 4f44d5e)

Groups come from the country's HDI only; lifestyle labels and external labels are ignored.
- Samples: QC-clean gut_stool specimen samples (v1 section 2 step 1) with a stratum.
- Subject = `person_key` (null: the sample is its own subject). Within a stratum a subject is one record:
  **carried** = the taxon is detected in at least one of the subject's samples in that stratum.
  Subject country = the most frequent `country` among those samples (ties: first alphabetically); no country: excluded.
- Band from `hdi_2023` in `country_hdi.csv`: industrialized >= 0.80; non-industrialized < 0.70; otherwise transitional
  (prevalence reported, not tested). Country missing from the file, or listed there without an HDI value (package 1.31.0: Taiwan, Puerto Rico, French Guiana, Turks and Caicos Islands, British Indian Ocean Territory): its subjects are excluded from the simple rule (they are not counted as transitional).
- Per taxon (species, genus, family) and stratum: two-sided Fisher's exact test on subjects, non-industrialized versus
  industrialized, for taxa carried by at least one subject of either group; q = Benjamini-Hochberg over those taxa.
- n_countries = number of countries (any band) with at least one carrying subject.
- **VANISH**: prevalence >= 0.20 non-industrialized, <= 0.05 industrialized, q < 0.05, n_countries >= 2.
  **BloSSUM**: prevalence >= 0.20 industrialized, <= 0.05 non-industrialized, q < 0.05, n_countries >= 2.
- lfc = log2((prev_nonind + 0.001) / (prev_ind + 0.001)).
- If the non-industrialized or the industrialized group of a stratum has fewer than 30 subjects, report "not estimable".

## C. Outputs

`results.csv`: the v1 section 8 columns with `ni_def` in {ext, strict, broad}, plus `p_lrt`, `n_perm`, `n_exceed`
(`p` and `q` are the permutation-based values) and `headline_class`.
`simple_results.csv`: level, stratum, taxon, lineage, n_ind, n_nonind, n_trans, pos_ind, pos_nonind, pos_trans,
prev_ind, prev_nonind, prev_trans, p, q, lfc, n_countries, class.
`analyses.csv` (model) and `simple_analyses.csv` (simple rule): one row per level x contrast (or band design) x stratum
with counts, thresholds used, numbers tested / candidates / classed, or "not estimable".
`calibration.csv` (A6), `permutation_classes.csv` (A7), `groups.csv` (per contrast and stratum: samples and cohorts by
label source: stated, external, both).

## D. Third class: StIL candidate (added 2026-11-15, round 3)

Source of the term: "stable independent of lifestyle" (StIL), a class named in the Discussion of the preprint
bioRxiv 2025.08.15.670570 (peer-reviewed version: Nature, doi 10.1038/s41586-026-11106-1): species that are
prevalent across lifestyles and nevertheless show strain-level isolation between two distant non-industrialized
populations (Tsimane and Hadza). The paper gives no prevalence threshold and no per-species test, and its second
half (strain sharing between genome pairs) cannot be computed from read-based profiles. What is defined here is
therefore only the first half, and the class is always called **StIL candidate**: a taxon that is common in both
groups and whose detection does not differ between them. It is a statement that a difference of the stated size
is excluded, not a discovery tested against chance: with shuffled labels many common taxa would qualify, by design.

- D1 (model rule, per contrast and level, adults). A tested taxon is a StIL candidate when all of these hold:
  (a) it is not a VANISH or BloSSUM candidate (section A5);
  (b) mean per-cohort prevalence >= P_st in the non-industrialized group AND in the reference group (P_st = 0.20,
      the same bar the simple rule uses for "carried");
  (c) the interval score +/- 1.96 x se (log2 odds ratio and its standard error from the fitted model) lies
      entirely inside (-E, +E), E = 1.0, i.e. less than a two-fold difference in the odds of detection;
  (d) in every leave-one-cohort-out refit (the same set of refits as A5) the score stays inside (-E, +E).
  The headline class is the one under C1. Thresholds are arguments (--stil-min-prev, --stil-max-score).
- D2 (simple rule, per level and age stratum). A taxon is a StIL candidate when it is carried by >= 20 % of the
  subjects of the industrialized band AND of the non-industrialized band, |lfc| < 1.0 (carriage differs by less
  than two-fold), and it is carried in at least two countries. No test is involved (with these group sizes
  Fisher's test rejects equality for almost every common taxon).
- D3. Output: the value `StIL` in the `class` column of results.csv and simple_results.csv, and columns n_stil in
  analyses.csv and simple_analyses.csv. VANISH, BloSSUM and StIL are mutually exclusive by construction.
- D4. The page states that this is the prevalence half only, names the paper, and says that the paper's own
  per-species list is not public in a form that could be read here.

## E. Round 4 notes (2026-11-23)

- D1 (model-rule StIL candidate) has been run: adults, C1: 10 species, 13 genera, 1 family. The run used the
  HDI table as it stood at the round-2 run, so the stored permutations apply unchanged.
- Page: for infants the primary definition is not estimable (49 non-industrialized samples, 1 cohort). The page
  draws contrast C4 (NI-broad vs REF-hdi; 273 samples, 4 cohorts, 100 permutations) for infants under the model
  rule and says so. No rule or threshold changed.
