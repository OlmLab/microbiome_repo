# Exploratory checks after the registered replication test

**Status: EXPLORATORY.** Run on 2026-11-24, after the results of the registered test were known. Nothing here is part of the plan frozen on 2026-11-13, nothing here changes the registered result (515 of 1,918 testable claims replicated) or any label, and the frozen folder and `results/` were only read. Package under test: 1.34.0, as in the registered run. A claim that passes one of these checks has not thereby replicated.

The scripts first reproduce the registered primary result exactly from the same inputs (`x01_validate.py`: 6,933 claims, 1,918 testable, 515 replicated, largest difference in an estimate 1e-16); each check then changes one thing. An independent check of this work is in `REVIEW_exploratory.md`; what it found is applied here.

## 1. Without the correction for multiple tests

Same test, same claims; a claim counts when its one-sided p-value in the claimed direction is below 0.05, with no Benjamini-Hochberg step. The 707 claims counted this way contain all 515 registered ones.

| | Claims | Share | Labels shuffled inside every project, 1,000 reruns |
|---|---|---|---|
| Registered (after correction) | 515 | 26.9 % | (registered check: at most 24 claims) |
| p < 0.05 in the claimed direction, no correction | 707 | 36.9 % | mean 4.2 %; 2.5 to 97.5 %: 2.5 % to 6.5 %; largest 9.2 % |
| p < 0.05 in the opposite direction, no correction | 140 | 7.3 % | mean 4.2 %; 97.5 % limit 6.7 % |

Mean over the 20 conditions with at least 10 testable claims (the cut of the registered report): 32.2 % without correction, 22.9 % registered. In 66.0 % of the testable claims more than half of the projects point in the claimed direction (43.1 % with shuffled labels); in 21.0 % all of them do (4.7 % with shuffled labels).

| Condition | Testable | Registered | Without correction | Shuffled labels: mean (97.5 % limit) | p against shuffled |
|---|---|---|---|---|---|
| Parkinson's disease | 562 | 255 (45.4 %) | 338 (60.1 %) | 4.2 % (10.9 %) | 0.001 |
| Obesity | 223 | 36 (16.1 %) | 53 (23.8 %) | 4.2 % (9.9 %) | 0.001 |
| COVID-19 | 210 | 53 (25.2 %) | 71 (33.8 %) | 3.9 % (12.4 %) | 0.001 |
| Gestational diabetes | 139 | 1 (0.7 %) | 10 (7.2 %) | 4.1 % (11.5 %) | 0.177 |
| Type II diabetes mellitus | 116 | 6 (5.2 %) | 16 (13.8 %) | 4.4 % (11.2 %) | 0.017 |
| Schizophrenia | 85 | 7 (8.2 %) | 12 (14.1 %) | 4.0 % (13.0 %) | 0.026 |
| Autoimmune disease | 74 | 6 (8.1 %) | 14 (18.9 %) | 4.6 % (13.5 %) | 0.005 |
| Irritable bowel syndrome | 73 | 4 (5.5 %) | 4 (5.5 %) | 3.8 % (17.8 %) | 0.293 |
| Ulcerative colitis | 63 | 33 (52.4 %) | 38 (60.3 %) | 4.4 % (12.7 %) | 0.001 |
| Multiple sclerosis | 62 | 4 (6.5 %) | 14 (22.6 %) | 4.2 % (12.9 %) | 0.002 |
| Chronic fatigue syndrome | 52 | 23 (44.2 %) | 28 (53.8 %) | 4.0 % (13.5 %) | 0.001 |
| Crohn's disease | 52 | 39 (75.0 %) | 41 (78.8 %) | 4.4 % (15.4 %) | 0.001 |
| Diabetes mellitus | 43 | 11 (25.6 %) | 13 (30.2 %) | 4.3 % (14.0 %) | 0.001 |
| Inflammatory bowel disease | 36 | 25 (69.4 %) | 27 (75.0 %) | 3.5 % (13.9 %) | 0.001 |
| Autism spectrum disorder | 26 | 2 (7.7 %) | 4 (15.4 %) | 4.5 % (19.2 %) | 0.095 |
| Rheumatoid arthritis | 24 | 0 (0.0 %) | 3 (12.5 %) | 4.8 % (20.8 %) | 0.184 |
| Colorectal adenoma | 22 | 1 (4.5 %) | 5 (22.7 %) | 4.1 % (18.2 %) | 0.008 |
| Cardiovascular disease | 20 | 0 (0.0 %) | 2 (10.0 %) | 4.3 % (20.0 %) | 0.258 |
| Type I diabetes mellitus | 18 | 4 (22.2 %) | 7 (38.9 %) | 4.1 % (22.2 %) | 0.003 |
| Mood disorder | 11 | 4 (36.4 %) | 5 (45.5 %) | 4.0 % (27.3 %) | 0.004 |
| Ankylosing spondylitis | 3 | 0 (0.0 %) | 0 (0.0 %) | 4.2 % (33.3 %) | 1.000 |
| Hypertension | 2 | 0 (0.0 %) | 0 (0.0 %) | 4.6 % (50.0 %) | 1.000 |
| Psychiatric disorder | 1 | 1 (100.0 %) | 1 (100.0 %) | 4.5 % (100.0 %) | 0.046 |
| Cancer | 1 | 0 (0.0 %) | 1 (100.0 %) | 3.6 % (100.0 %) | 0.037 |

Per claim: `uncorrected_claims.csv` (p-values, whether below 0.05, number and share of projects in the claimed direction).

## 2. Abundance floor

Before the test, a claimed taxon's abundance in a sample is set to zero when it is below the floor. The abundance is the sum over the GTDB groups counted for the taxon, as a share of the profile, so groups that are each below the floor can pass it together; only the claimed taxa are touched and profiles are not rescaled (the test uses ranks of one taxon at a time). Everything else is the registered procedure, including the rule that a project needs the taxon in at least 10 people.

A floor makes claims untestable, so the rate among the claims that remain is NOT comparable with the headline. The comparison that holds is on the same claims:

| Floor | Non-zero values removed | Still testable | Replicated with the floor | Registered, same claims | Replicated → not | Not → replicated | No longer testable (of which registered-replicated) |
|---|---|---|---|---|---|---|---|
| 0.05 % | 7.1 % | 1,854 | 529 (28.5 %) | 510 (27.5 %) | 22 | 41 | 64 (5) |
| 0.1 % | 13.0 % | 1,741 | 506 (29.1 %) | 498 (28.6 %) | 25 | 33 | 177 (17) |
| 0.5 % | 51.5 % | 1,300 | 379 (29.2 %) | 393 (30.2 %) | 60 | 46 | 618 (122) |

Registered, no floor: 515 of 1,918. Per claim and floor: `floor_claims.csv`.

## 3. Claims left with one or two cohorts

3,625 registered claims were not testable because, after the claim's own cohort was set aside, fewer than three independent cohorts with same-project healthy controls were left; for 121 of them the condition does have three cohorts and the claim's own is among them. For 2,446 no cohort is usable at all (no project with 15 cases and 15 healthy controls, the only one is the claim's own, or the taxon is too rare). The others are tested here on what there is: the registered per-project estimate, a one-sided test of it (one cohort) or of the registered pooled estimate (two cohorts). The two groups are reported separately and are never added to the registered count. **One cohort is one more study, not a replication across studies.**

| | Tested in one cohort | Tested in two cohorts |
|---|---|---|
| Claims tested | 837 | 342 |
| Conditions; papers | 41; 104 | 13; 36 |
| Cohorts these tests rest on (claims carried by the largest) | 33 (174) | 19 (116) |
| p < 0.05 in the claimed direction, no correction | 240 of 837 (28.7 %) | 76 of 342 (22.2 %) |
| Same with labels shuffled (300 reruns): mean; 97.5 % limit | 5.4 %; 7.4 % | 4.2 %; 8.2 % |
| p < 0.05 in the opposite direction, no correction | 119 of 837 (14.2 %) | 26 of 342 (7.6 %) |
| Same with labels shuffled: mean; 97.5 % limit | 5.3 %; 7.7 % | 4.3 %; 8.2 % |
| Significant after correction within the group, claimed direction | 161 of 837 (19.2 %) | 49 of 342 (14.3 %) |
| Significant after correction within the group, opposite direction | 59 | 12 |
| Same with shuffled labels, claimed direction: mean; largest | 0.89; 12 | 0.35; 8 |
| Median persons per claim: cases; controls | 48; 66 | 86; 203 |

Read with care. (1) The claims are many but the cohorts are few, so these are not independent results: one project's peculiarity moves dozens of claims at once. (2) With one cohort the share significant in the OPPOSITE direction is 14.2 %, against 5.3 % with shuffled labels. A single case-control study differs between its arms in more than the condition, and a test inside one study cannot tell these apart; this is what the three-cohort rule of the plan guards against. (3) With two cohorts the answer depends on the test: the same 342 claims give 121 below 0.05 under the stratified Wilcoxon test, which assumes no disagreement between the two cohorts, against 76 under the registered pooling; the pooling estimates that disagreement as exactly zero for 181 of them, which two cohorts cannot establish. Per claim: `fewer_projects_claims.csv`; by condition: `fewer_projects_by_condition.csv`.

## 4. Between-project comparison: calibration only

Question: can the persons of a project be compared with healthy controls of OTHER projects, matched on country and age band? (Every profile is Illumina shotgun DNA, so sequencing type cannot separate samples and a 16S region does not apply.) Reference: healthy-control persons of other cohorts in the same country and age band, at most 30 per outside project and cell, at least 3 outside cohorts per cell. Run on the 1,918 claims the registered run could test. **No new condition was tested, and nothing in this section is a replication result.**

| Check | Result |
|---|---|
| (a) Negative control: a project's own healthy controls against matched healthy controls of other projects, same taxa and directions, pooled as registered | 39 of 1,536 (2.5 %) claims called replicated and 64 called opposite, so 6.7 % significant after correction in one direction or the other; nothing should be |
| (a) without correction | 103 claims below 0.05 in the claimed direction and 132 in the opposite one, of 1,536 (5 % each expected) |
| (a) one project at a time | 45.6 % of 3,844 project-by-taxon estimates from 113 project arms are more than 1.96 standard errors from no difference (5 % expected if a project's healthy controls were exchangeable with those of other projects); 44.1 % for arms of up to 40 persons, 45.4 % for 41 to 100, 55.1 % above 100 |
| (b) Positive control: a project's cases against the same kind of outside reference, compared with the registered within-project result | same outcome for 77.5 % of 1,536 claims, against 65.4 % expected from the two rates alone (kappa 0.35); 1,037 of the agreements are claims that neither analysis calls replicated. Of 443 claims the registered test called replicated, 154 (34.8 %) are also significant in the claimed direction this way, and 56 only this way. The cases are the same people, so this is agreement between two analyses, not a second replication |
| Coverage | 113 of 180 project contrasts could be matched in each control (the others lack an age band or enough outside controls); 111 are the same projects in both. Median matched arm: 39 persons in (a), 51 in (b) |

What this says: one project against an outside reference is not usable, because differences between projects look like differences between groups in almost half of the comparisons. Pooled over three or more projects the registered random-effects step absorbs most of that, but not all, and the between-project analysis finds about a third of what the within-project one finds. The error in (a) grows with the size of the arm and the arms of (a) are smaller than those of (b), so the figure in (a) is a lower bound for arms the size of real case arms.

Limits of this calibration. The single-project estimator was checked on simulated numbers (`x07_selftest.py`: with one cell it equals the registered estimate, and under the null 5 % of its tests are below 0.05), so the excess at project level is differences between projects, not the arithmetic. The pooled figures in addition treat the project estimates of a claim as independent, which they are not: they share one reference pool; that is part of what (a) measures and it was not simulated separately. The claim's own cohort is left out as an arm, but its healthy controls stay in the reference of the other projects (one cohort among a median of 71). The rule of 10 carriers is evaluated on the arm plus its reference: in 35.4 % of the estimates of (a) fewer than 10 carriers are inside the arm. Variants (depth band added; no cap per outside project; five outside cohorts per cell) give the same picture: `exploratory_summary.csv`, rows `between_*`.

## Files

Scripts `x_common.py`, `x01_validate.py` to `x09_report.py` (run in this order from this folder; each takes the output folder as its argument; they read `projects/replication` and write only where told). Tables in `out/`: `exploratory_summary.csv` (every summary number; the scripts also write `*_summary.json`, which this chat's sandbox could not copy into the shared folder, so the CSV is the record), `uncorrected_claims.csv`, `uncorrected_by_condition.csv`, `floor_claims.csv`, `floor_by_condition.csv`, `fewer_projects_claims.csv`, `fewer_projects_by_condition.csv`, `between_main_{negative,positive}_{claims,coverage}.csv`, `between_main_{negative,positive}_effects.csv.gz`.
