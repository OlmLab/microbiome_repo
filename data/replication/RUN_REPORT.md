# RUN REPORT — pre-registered replication of published gut-microbiome associations

Run on 2026-11-15 on the owner's instruction ("run"). Every number is read from the result files in `results/` and `tables/`
(collected in `tables/run_numbers.json`). Plan: `SAP.md`; registration: `PREREGISTRATION.md`; both frozen on 2026-11-13.

## 1. What was run

| | |
|---|---|
| Freeze | `FROZEN_2026-11-13T232043Z`, hash `d5f56cba23415d8dcaa8ff8702319035e71d3810c3f45f2dba04d86015c6a966`; all 35 must-match files unchanged before the run, after the testability step, and now (verified). The hash is printed in the notes of release R2026.40 (2026-11-14). |
| Release under test | package 1.34.0 (release R2026.41, DOI 10.5281/zenodo.24241062): the latest published release when the instruction was given. Copy in `release_under_test/`; its 99 files match the release's own `VERSION.json` and the copy published on Zenodo. |
| Claims | 6,933 registered claims (BugSigDB v1.3.1; genus or species; cases versus healthy controls; colorectal cancer set aside) |
| Readings | 374 condition pairs new in this release were read twice by Opus 5 with the frozen reader (46 batches, 0 not completed or refused) |
| Units | cohort unit (one project per unit and condition); discovery exclusion applied (290 experiment-unit links) |

## 2. Headline

**515 of 1,918 testable claims replicated: 26.9 % (95 % CI 24.9 %–28.9 %).**

| outcome | claims |
|---|---|
| Replicated | 515 (of which 20 with an effect smaller than the smallest effect of interest) |
| Not replicated — opposite direction | 31 |
| Not replicated — effect of meaningful size excluded | 738 |
| Not replicated — inconclusive | 634 |
| Untestable — fewer than three projects for the condition | 3,625 |
| Untestable — taxon too rare in the projects | 1,390 |

- Unweighted mean of the per-condition rates (20 conditions with at least 10 testable claims): **22.9 %**.
- Condition-by-taxon units: 224 of 846 testable units have a replicated claim.
- Median number of independent projects per testable claim: 6.
- Before multiplicity control, p < 0.05 in the claimed direction for 36.9 % of testable claims and in the opposite direction for 7.3 %.
- Stricter and looser tests on the same estimates (S4): Hartung-Knapp 191 replicated; stratified Wilcoxon 705.

**H2 (aggregate).** With case and control labels permuted within project, 1,000 permutations of this release gave between 0 and 24 replicated claims (mean 0.27; 107 permutations with any). Observed: 515. One-sided permutation p = 0.0010. H2 is supported.

## 3. By condition

| condition | testable | replicated | rate | 95 % CI |
|---|---|---|---|---|
| Parkinson's disease | 562 | 255 | 45.4 % | 41.3 %–49.5 % |
| Obesity | 223 | 36 | 16.1 % | 11.9 %–21.5 % |
| COVID-19 | 210 | 53 | 25.2 % | 19.8 %–31.5 % |
| Gestational diabetes | 139 | 1 | 0.7 % | 0.1 %–4.0 % |
| Type II diabetes mellitus | 116 | 6 | 5.2 % | 2.4 %–10.8 % |
| Schizophrenia | 85 | 7 | 8.2 % | 4.0 %–16.0 % |
| Autoimmune disease | 74 | 6 | 8.1 % | 3.8 %–16.6 % |
| Irritable bowel syndrome | 73 | 4 | 5.5 % | 2.2 %–13.3 % |
| Ulcerative colitis | 63 | 33 | 52.4 % | 40.3 %–64.2 % |
| Multiple sclerosis | 62 | 4 | 6.5 % | 2.5 %–15.4 % |
| Chronic fatigue syndrome | 52 | 23 | 44.2 % | 31.6 %–57.7 % |
| Crohn's disease | 52 | 39 | 75.0 % | 61.8 %–84.8 % |
| Diabetes mellitus | 43 | 11 | 25.6 % | 14.9 %–40.2 % |
| Inflammatory bowel disease | 36 | 25 | 69.4 % | 53.1 %–82.0 % |
| Autism spectrum disorder | 26 | 2 | 7.7 % | 2.1 %–24.1 % |
| Rheumatoid arthritis | 24 | 0 | 0.0 % | 0.0 %–13.8 % |
| Colorectal adenoma | 22 | 1 | 4.5 % | 0.8 %–21.8 % |
| Cardiovascular disease | 20 | 0 | 0.0 % | 0.0 %–16.1 % |
| Type I diabetes mellitus | 18 | 4 | 22.2 % | 9.0 %–45.2 % |
| Mood disorder | 11 | 4 | 36.4 % | 15.2 %–64.6 % |
| Ankylosing spondylitis | 3 | 0 | 0.0 % | 0.0 %–56.1 % |
| Hypertension | 2 | 0 | 0.0 % | 0.0 %–65.8 % |
| Cancer | 1 | 0 | 0.0 % | 0.0 %–79.3 % |
| Psychiatric disorder | 1 | 1 | 100.0 % | 20.7 %–100.0 % |

## 4. By rank and by sequencing method of the original study

| rank | testable | replicated | rate | 95 % CI |
|---|---|---|---|---|
| genus | 1,319 | 341 | 25.9 % | 23.6 %–28.3 % |
| species | 599 | 174 | 29.0 % | 25.6 %–32.8 % |

| original study | testable | replicated | rate | 95 % CI |
|---|---|---|---|---|
| 16S | 1,460 | 358 | 24.5 % | 22.4 %–26.8 % |
| WMS | 417 | 139 | 33.3 % | 29.0 %–38.0 % |
| other or not recorded | 41 | 18 | 43.9 % | 29.9 %–59.0 % |

## 5. Sensitivity analyses (registered; none replaces the headline)

| analysis | claims | testable | replicated | rate (95 % CI) | opposite direction |
|---|---|---|---|---|---|
| Primary | 6,933 | 1,918 | 515 | 26.9 % (24.9 %–28.9 %) | 31 |
| S1 claims from 16S studies | 5,298 | 1,460 | 346 | 23.7 % (21.6 %–25.9 %) | 20 |
| S1 claims from shotgun studies | 1,533 | 417 | 144 | 34.5 % (30.1 %–39.2 %) | 7 |
| S2 lenient readings | 7,245 | 2,095 | 531 | 25.3 % (23.5 %–27.3 %) | 34 |
| S3 taxon rule: anchor only | 6,933 | 1,686 | 438 | 26.0 % (23.9 %–28.1 %) | 32 |
| S3 taxon rule: broad | 6,933 | 1,980 | 515 | 26.0 % (24.1 %–28.0 %) | 33 |
| S5 adjusted for age, sex, BMI | 6,933 | 676 | 191 | 28.3 % (25.0 %–31.8 %) | 12 |
| S6 subject ids for ≥90 % of persons | 6,933 | 1,342 | 250 | 18.6 % (16.6 %–20.8 %) | 12 |
| S7 discovery exclusion off | 6,933 | 1,970 | 573 | 29.1 % (27.1 %–31.1 %) | 31 |
| S8 colorectal adenoma left out | 6,891 | 1,896 | 514 | 27.1 % (25.2 %–29.2 %) | 31 |
| S9 colorectal cancer (already examined, not confirmatory) | 672 | 363 | 200 | 55.1 % (50.0 %–60.1 %) | 12 |

S5 detail: 676 claims could be tested with covariates. On the same projects and persons, 191 replicated with adjustment and 188 without; the median difference in θ (adjusted − unadjusted) was 0.0008 (quartiles -0.0083 to 0.0092); 116 claims changed label.

S6 detail: the 1,342 claims testable in S6 were all testable in the primary analysis, where 404 of them replicated (30.1 %); S6 uses fewer projects per claim (median 5 against 7), so the drop mixes lost power with the removal of projects where repeated samples of one person may have been counted as separate persons.

## 6. Strongest replicated units (largest pooled distance from 0.5; full list in `results/real_strict_primary_all/replicated_units.csv`, 224 rows)

| condition | taxon | claimed | pooled AUC | projects | claims |
|---|---|---|---|---|---|
| Crohn's disease | Gemmiger (genus) | lower in cases | 0.283 | 7 | 1 |
| Ulcerative colitis | Alistipes (genus) | lower in cases | 0.285 | 12 | 1 |
| Crohn's disease | Eubacterium (genus) | lower in cases | 0.288 | 7 | 1 |
| Crohn's disease | Coprococcus (genus) | lower in cases | 0.293 | 7 | 1 |
| Inflammatory bowel disease | Coprococcus (genus) | lower in cases | 0.297 | 15 | 2 |
| Ulcerative colitis | Alistipes putredinis (species) | lower in cases | 0.301 | 12 | 1 |
| Crohn's disease | Alistipes (genus) | lower in cases | 0.313 | 8 | 1 |
| Crohn's disease | Alistipes putredinis (species) | lower in cases | 0.321 | 8 | 1 |
| COVID-19 | Dorea (genus) | lower in cases | 0.324 | 5 | 4 |
| Inflammatory bowel disease | Ruminococcus (genus) | lower in cases | 0.326 | 15 | 2 |
| Crohn's disease | Lachnospira (genus) | lower in cases | 0.328 | 8 | 1 |
| COVID-19 | Fusicatenibacter (genus) | lower in cases | 0.331 | 5 | 1 |
| COVID-19 | Roseburia (genus) | lower in cases | 0.332 | 5 | 5 |
| Crohn's disease | Ruminococcus (genus) | lower in cases | 0.333 | 7 | 2 |
| COVID-19 | Fusicatenibacter saccharivorans (species) | lower in cases | 0.334 | 5 | 1 |
| Ulcerative colitis | Ruminococcus (genus) | lower in cases | 0.334 | 10 | 1 |
| Crohn's disease | Faecalimonas umbilicata (species) | higher in cases | 0.663 | 3 | 1 |
| Ulcerative colitis | Mediterraneibacter faecis (species) | lower in cases | 0.341 | 9 | 1 |
| COVID-19 | Roseburia faecis (species) | lower in cases | 0.342 | 5 | 1 |
| Crohn's disease | Mediterraneibacter gnavus (species) | higher in cases | 0.655 | 6 | 1 |

## 7. What changed between the pilot release (1.31.0) and the release under test (1.34.0)

| | pilot 1.31.0 | run 1.34.0 |
|---|---|---|
| Population samples / projects | 285,869 / 1,799 | 285,181 / 1,801 |
| Samples with a health-condition code / healthy controls | 136,731 / 55,766 | 142,563 / 57,597 |
| Condition pairs (all read twice) | 2,789 | 2,800 (374 new, read at the run) |
| Samples with a strict case mapping | 44,370 | 47,136 |
| Strict contrasts / projects / conditions | 288 / 124 / 80 | 352 / 152 / 94 |
| Conditions with ≥3 projects (strict) | 24 | 32 |
| Cohort units | 1,772 | 1,762 |
| Claim papers linked to a catalog project (of 679) | 53 | 89 |
| … shotgun claim papers linked (of 125) | 43 | 68 |
| Registered claims with a discovery unit excluded | 291 | 489 |
| Testable claims / units / conditions | 1,474 / 648 / 20 | 1,918 / 846 / 24 |

## 8. Deviations from the frozen plan and document

1. **Date.** The pre-registration expected the instruction about 28 November 2026; it came on 15 November. The rule (the latest published release when the owner says run) was applied as written.
2. **Layout of the copy.** The package was unpacked directly into `release_under_test/` rather than into a sub-folder; `RELEASE.json` points there. No effect on any computation.
3. **Script added after the freeze:** `code/17_run_report.py` (this report; reads results only). `freeze.py verify` lists it.
4. No analytic choice was changed, no frozen file was edited, and no real-label result was overwritten.

## 9. Limits to keep in mind when reading the headline

1. **Unlinked discovery cohorts.** 57 of 125 shotgun claim papers still have no link to a catalog project. If their data are in the catalog under an unlinked project, their claims were tested partly on their own data. S7 shows what the exclusion changes where links exist; shotgun-derived claims replicate more often than 16S-derived ones (section 4), which is the pattern unlinked discovery data would also produce. A check that was **not registered** (exploratory): among testable shotgun-derived claims, those from linked papers (discovery data removed) replicated at 35.3 % (113 of 320, 14 papers) and those from unlinked papers at 26.8 % (26 of 97, 14 papers), so unlinked papers do not show the higher rate that leakage would produce.
2. **Concentration.** 562 of the 1,918 testable claims concern one condition (Parkinson's disease); the unweighted mean of condition rates is the fairer summary across conditions.
3. **Power.** 634 claims are inconclusive: the data cannot tell a small effect from none. "Not replicated" is established only for the 738 claims whose effect of meaningful size is excluded and the 31 in the opposite direction.
4. **The primary test** exceeds its nominal error rate modestly under strong heterogeneity (SAP 7.5); the Hartung-Knapp count above is the conservative bound.
5. **Readings.** A third reader disagreed with 9 of 30 audited new readings, mostly on the relation label; the strict mapping needs two readings to agree, and the lenient mapping (S2) shows the other bound.
6. **Labels and claims share sources**, and the catalog's labels were revised between the freeze and the run (section 7), without access to results.
7. **Independence.** A claim counts once per paper and taxon; the 846 units are fewer than the 1,918 claims, and claims on the same unit share their data.

## 10. Files

- `results/real_strict_primary_all/`: `claim_results.csv` (every registered claim with its status, pooled estimate, interval, p-values and label), `project_effects.parquet` (per-project estimates), `headline.json`, `headline.md`, `replicated_units.csv`
- `results/real_*`: the same for each sensitivity analysis; `results/permutation_reference.json`: H2
- `release_under_test/`: the copy of package 1.34.0 and its profiles, with `SHA256SUMS.txt`; `RUN_ORDER.md`; `RELEASE.json`
- `tables/`: mapping, contrasts, links and testability on the release under test; `tables/run_numbers.json`

Spend of this chat: US$124.09 of the US$350 cap.
