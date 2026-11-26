# PRE-REGISTRATION (informal) — Replication of published gut-microbiome associations in Microbiome Repo

Frozen on 2026-11-13, before any association between a taxon and a health condition was computed in the catalog by this
project (one declared exception: colorectal cancer, see Q18).

**Status of this document.** It is not filed with an external registry. The pre-registration consists of this document, the
analysis plan (`SAP.md`), the list of claims to be tested (`tables/registered_claims.csv`, 6,933 claims)
and the code (`code/`), frozen together as read-only copies with sha256 checksums by `code/freeze.py`. The folder named in
`FROZEN_CURRENT.txt` holds the copies, `SHA256SUMS.txt` and `MANIFEST.json`; the freeze hash (sha256 of `SHA256SUMS.txt`) is
handed to the catalog's Editor to be printed in the next release notes, which gives the freeze a public date. The test runs
later, when the owner says "run" (Q5, and "What happens at run" at the end).

The questions below are those of the OSF template for secondary data analysis (Van den Akker et al., "Preregistration of
secondary data analysis: A template and tutorial", DOI 10.31234/osf.io/hvfmr; 6 parts, 25 questions), used here as a
checklist. Where `SAP.md` and this document differ, `SAP.md` governs.

---

## Part 1: Study information

### Q1: Provide the working title of your study.

Do published gut-microbiome associations replicate? A pre-registered test of BugSigDB taxon-by-condition claims on the
taxonomic profiles of Microbiome Repo (secondary analysis of public metagenomes).

### Q2: Name the authors of this preregistration.

Matt Olm, owner of Microbiome Repo, commissioned the test and decided the open points on 13 November 2026: the smallest
effect size of interest, the number of permutations, the release rule and the informal form of the registration. The plan, the
code and the tables were prepared by an AI agent (Claude Science session, 13 November 2026). The catalog's condition strings
and BugSigDB's contrast descriptions were each read twice by Opus 5 sub-agents; a separate Opus 5 agent checked the plan
against the code (`work/review/REVIEW.md`).

### Q3: List each research question included in this study.

1. For each published claim that a bacterial or archaeal genus or species is more (or less) abundant in stool of people with a
   health condition than in stool of healthy controls: is the taxon shifted in the claimed direction in independent projects?
2. What share of such claims replicates, overall and by condition, by taxonomic rank, and by the sequencing method of the
   original study (16S amplicon versus shotgun)?

### Q4: Please provide the hypotheses of your secondary data analysis. Make sure they are specific and testable, and make it clear what your statistical framework is (e.g., Bayesian inference, NHST). In case your hypothesis is directional, do not forget to state the direction. Please also provide a rationale for each hypothesis.

Framework: null-hypothesis significance testing with control of the false-discovery rate.

**H1 (one hypothesis per claim; 6,933 listed claims).** For claim *c*, stating that taxon *t* is higher
(lower) in stool of persons with condition *E* than in healthy controls: across independent projects, the pooled probability
that a case has a higher abundance of *t* than a control of the same project is above (below) 0.5. Directional, one-sided, in
the direction recorded by BugSigDB (reversed when BugSigDB's group 0 is the case group). The full list, with direction, is
`tables/registered_claims.csv`.
*Rationale.* Each claim is a published finding; if it describes the condition rather than one cohort, it should reappear in
other cohorts. The direction comes from the publication, not from these data.

**H2 (aggregate).** The number of claims declared replicated exceeds the number declared replicated when case and control
labels are permuted within project (reference distribution: 1,000 permutations of the release under test; SAP 10.8).
*Rationale.* A check that replication, where found, is not produced by the procedure.

No hypothesis is registered about which conditions or taxa replicate more often; those comparisons are descriptive.
A scoping search on 13 November 2026 (reported in the handoff to this session) found no pre-registered large-scale
replication of microbiome associations.

---

## Part 2: Data description

### Q5: Name and describe the dataset(s), and if applicable, the subset(s) of the data you plan to use. Useful information to include here is the type of data (e.g., cross-sectional or longitudinal), the general content of the questions, and some details about the respondents. In the case of longitudinal data, information about the survey's waves is useful as well.

1. **Microbiome Repo** (data package; pilot version 1.31.0, release R2026.38: 806,037 samples in
   5,051 projects, 416,336 with a taxonomic profile). A catalog of public human metagenome samples from the
   sequence archives, with per-sample metadata curated from archive records and papers by AI agents, and per-sample genus and
   species profiles taken from Sandpiper (SingleM on raw reads, GTDB R232). Projects are a mixture of cross-sectional
   case-control studies and longitudinal cohorts; where a person has several samples, one is used (SAP section 6).
   **Subset:** stool samples with a profile and no quality flag: 285,869 samples, 215,888 persons,
   1,799 projects in 1.31.0; 136,731 samples have a health-condition code. The test uses only persons
   who are a case of a claimed condition or a healthy control in a project with at least 15 of each (pilot: 20,368
   persons' samples in 288 strict and 352 lenient contrasts).
   **Version to be analysed:** not 1.31.0 but **the latest published release at the time the owner says "run"** (expected
   about 28 November 2026). No result with real labels exists before that instruction, so the choice of release cannot depend
   on results. The release's version and DOI are recorded in `RUN_ORDER.md` before anything is computed (SAP section 2.3).
   Between this freeze and the run the catalog's Editor continues to revise sample metadata, including health-condition
   labels and paper-to-project links.
2. **BugSigDB** bulk export v1.3.1: manually curated signatures of taxa reported as differentially abundant between two groups
   in published studies. Used: human, curation-complete, stool signatures (26,743 taxon-level claims from
   679 papers).

### Q6: Specify the extent to which the dataset is open or publicly available. Make note of any barriers to accessing the data, even if it is publicly available.

Both are public without registration. BugSigDB export: CC BY 4.0. Microbiome Repo data package: public on Zenodo and the
project site, under the licence stated in each release. The per-sample profile tables are redistributed from Sandpiper's
public release (Zenodo record cited in the package); raw reads are in ENA/SRA. Controlled-access cohorts are not in the
profile tables.

### Q7: How can the data be accessed? Provide a persistent identifier or link if the data are available online, or give a description of how you obtained the dataset.

BugSigDB v1.3.1: DOI 10.5281/zenodo.19740674, file `full_dump.csv` (a copy is in the frozen set). Microbiome Repo 1.31.0
(pilot): DOI 10.5281/zenodo.24202832 as recorded in the frozen copy's manifest; the version and DOI of the release under test
are written to `RUN_ORDER.md` at run time. GTDB R232 metadata: https://data.gtdb.ecogenomic.org/releases/release232/232.0/
(sha256 of the two files in the freeze manifest). Code: the frozen `code/` folder.

### Q8: Specify the date of download and/or access for each author.

The agent session downloaded BugSigDB v1.3.1, GTDB R232 metadata and the NCBI taxonomy dump on 13 November 2026 and first
read the frozen copy of package 1.31.0 on 13 November 2026 (frozen the same day). The owner built the catalog and has had
access to its metadata and profiles throughout; his access dates are not recorded here. The copy analysed is the copy of the
release under test made at run time on the owner's machine.

### Q9: If the data collection procedure is well documented, provide a link to that information. If the data collection procedure is not well documented, describe, to the best of your ability, how data were collected.

Microbiome Repo collects nothing itself: it enumerates public human metagenome projects in ENA/SRA, and AI agents curate
sample metadata from archive records, papers and supplements under written rules; taxonomic profiles come from Sandpiper.
Documentation ships with every package (`README.md`, `DATA_DICTIONARY.md`, `EXTRACTION_REPORT.md`, `CATALOG_SANDPIPER_REPORT.md`,
release notes). The samples are what researchers chose to deposit: not a random sample of any population; cases and controls
were recruited by each original study under its own criteria. BugSigDB: curated by trained volunteers and staff from
published papers under its curation policy (bugsigdb.org); it covers the papers its curators selected.

### Q10: Some studies offer codebooks to describe their data. If such a codebook is publicly available, link to it here or upload the document. If not, provide other available documentation. Also provide guidance on what parts of the codebook or other documentation are most relevant.

`DATA_DICTIONARY.md` in the data package: the fields `health_condition`, `health_condition_detail`, `body_site_code`,
`person_key`, `subject_id`, age, sex, BMI, and the quality flags (`qc_any_flag`); `catalog_study_papers` (paper-to-project
links); the profile tables' columns (`sample_key`, `genus`/`species`, `lineage`, `relabund`, `coverage`). BugSigDB: column
definitions in the export's README (Group 0 / Group 1, "Abundance in Group 1", EFO id, NCBI taxonomy ids).

---

## Part 3: Variables

### Q11: If you are going to use any manipulated variables, identify them here. Describe the variables and the levels or treatment arms of each variable (note that this is not applicable for observational studies and meta-analyses). If you are collapsing groups across variables this should be explicitly stated, including the relevant formula. If your further analysis is contingent on a manipulation check, describe your decisions rules here.

Not applicable (observational data). Groups are collapsed in two declared ways: catalog condition strings are grouped into EFO
conditions, including all narrower EFO terms (SAP 5.2); GTDB taxa are summed into the claimed NCBI taxon (SAP 5.1).

### Q12: If you are going to use measured variables, identify them here. Describe both outcome measures as well as predictors and covariates and label them accordingly. If you are using a scale or an index, state the construct the scale/index represents, which items the scale/index will consist of, how these items will be aggregated, and whether this aggregation is based on a recommendation from the study codebook or validation research. When the aggregation of the items is based on exploratory factor analysis (EFA) or confirmatory factor analysis (CFA), also specify the relevant details (EFA: rotation, how the number of factors will be determined, how best fit will be selected, CFA: how loadings will be specified, how fit will be assessed, which residuals variance terms will be correlated). If you are using any categorical variables, state how you will code them in the statistical analyses.

1. **Outcome:** relative abundance of the claimed taxon in a stool sample = sum of `relabund` over the GTDB taxa assigned to the
   claimed NCBI taxon by the rule of SAP 5.1 (an index constructed for this study, not supplied with the data): the GTDB taxon of
   the same name plus its alphabetically suffixed splits; zero when undetected. The members of each sum are fixed in
   `tables/taxon_targets_long.parquet` (frozen). Variants (anchor only; broad) are sensitivity analyses.
2. **Predictor:** case (1) versus healthy control (0) for condition E, from `health_condition` and `health_condition_detail`,
   mapped to EFO by two independent Opus 5 readings; primary definition requires both readings to agree (SAP 5.2).
3. **Stratum:** project (`study_accession`), merged into cohort units where projects share a cohort or an own-data paper.
4. **Covariates (sensitivity analysis only):** age (years, linear), sex (male 1, female 0), BMI where recorded.
5. **Claim attributes:** direction (+1 higher in cases, −1 lower), taxonomic rank, sequencing type of the original study, PMID.

No variable other than these enters a confirmatory analysis.

### Q13: Which units of analysis (respondents, cases, etc.) will be included or excluded in your study? Taking these inclusion/exclusion criteria into account, indicate the (expected) sample size of the data you'll be using for your statistical analyses to the best of your knowledge. In the next few questions, you will be asked to refine this sample size estimation based on your judgments about missing data and outliers.

Three levels. **Claims:** the 6,933 listed claims (SAP section 4); a claim is tested if at least three
independent cohort units have at least 15 case persons and 15 healthy-control persons for its condition and the taxon is
detected in at least 10 persons of each such contrast. **Projects:** every project meeting those counts. **Persons:** one sample
per person per contrast; persons with samples in both arms excluded.
Expected numbers, from the pilot on 1.31.0 with cohort units and the discovery-cohort exclusion applied (the release under
test will be larger and its labels revised, so these are planning figures):
1,474 testable claims (648 distinct condition-by-taxon units) in 20
conditions from 143 papers; 288 contrasts in 124 projects; median
4 projects per testable claim; median contrast size 45.5 cases
and 40.0 controls.

### Q14: What do you know about missing data in the dataset (i.e., overall missingness rate, information about differential dropout)? How will you deal with incomplete or missing data? Based on this information, provide a new expected sample size.

1. **Health condition:** 149,138 of 285,869 population samples (52 %)
   have no health-condition code and cannot enter any contrast. Pairs whose condition the two readings could not settle are
   excluded from the strict mapping (they are listed for the catalog's editor to resolve). No imputation.
2. **Taxon not detected:** treated as abundance zero, not as missing.
3. **Person identity:** a subject id is recorded for 73 % of population samples; without it each sample
   counts as its own person, so repeated samples of one person may be treated as independent. Sensitivity analysis S6 uses only
   contrasts with subject ids for at least 90 % of persons (196 of
   288 strict contrasts in the pilot).
4. **Covariates:** age 28 %, sex 28 %, BMI 8 % of samples; used only in sensitivity
   analysis S5, complete cases within projects that record age and sex for at least 80 % of persons.
5. **Profiles:** samples without a Sandpiper profile, or with a quality flag, are outside the population.
The expected sample size is unchanged from Q13, which already applies these rules.

### Q15: If you plan to remove outliers, how will you define what a statistical outlier is in your data? Please also provide a new expected sample size. Note that this will be the definitive expected sample size for your study and you will use this number to do any power analyses.

No outlier removal. The effect measure is rank-based and insensitive to extreme abundances. Samples with a quality flag are
excluded by the population definition. Definitive expected size: as in Q13.

### Q16: Are there sampling weights available with this dataset? If so, are you using them or are you using your own sampling weights?

No sampling weights exist and none are used. Projects are weighted by the inverse of their variance plus the between-project
variance (random-effects weights). The results describe the deposited projects, not a defined human population.

---

## Part 4: Knowledge of data

### Q17: List the publications, working papers (in preparation, unpublished, preprints), and conference presentations (talks, posters) you have worked on that are based on the dataset you will use. For each work, list the variables you analyzed, but limit yourself to variables that are relevant to the proposed analysis. If the dataset is longitudinal, also state which wave of the dataset you analyzed.

Known to this session: the Microbiome Repo catalog itself, its manuscript in preparation and its site, whose Profile measures
pages were computed on the same profiles (profiling coverage, agreement between sample labels and composition, known-species
fraction, depth); none relates a taxon to a health condition. Work within this project is listed in `PRIOR_EXPOSURE.md`.
The owner's other publications on these public cohorts or on Sandpiper profiles are not listed: this registration is
informal and was prepared without that inventory.

### Q18: What prior knowledge do you have about the dataset that may be relevant for the proposed analysis? Your prior knowledge could stem from working with the data first-hand, from reading previously published research, or from codebooks. Also provide any relevant knowledge of subsets of the data you will not be using. Provide prior knowledge for every author separately.

Declared in full in `PRIOR_EXPOSURE.md`; in summary:

1. **Colorectal cancer has been examined.** A DEBIAS-M pilot in this project compares colorectal-cancer cases with controls on
   these profiles (20 projects, 2,490 samples). All colorectal-cancer claims (672)
   are therefore outside the confirmatory set and will be reported as already examined. 752
   of that pilot's control samples also serve as controls for other conditions in the same projects (colorectal adenoma in
   7 projects); a sensitivity analysis leaves adenoma out.
2. **No other taxon-by-condition association has been computed** in these data by the project's chats. Computed so far: sample
   counts, taxon detection counts with cases and controls pooled, simulations, and the full test with labels permuted within
   project. The test code refuses real labels until the freeze verifies and the owner's instruction to run is recorded.
3. **Labels and claims share sources.** The catalog's health-condition labels were partly extracted from the papers that made
   the claims, and the Editor keeps revising labels until the release under test. A claim's own cohort is excluded when the
   claim is tested.
4. **Literature.** The claims are published; for several conditions multi-cohort meta-analyses of some of the same public data
   exist. The owner's own knowledge of such results is not recorded here. The safeguard does not rest on it: hypotheses and
   directions are taken mechanically from BugSigDB, and every analytic choice is fixed in the frozen plan and code.

---

## Part 5: Analyses

### Q19: For each hypothesis, describe the statistical model you will use to test the hypothesis. Include the type of model (e.g., ANOVA, multiple regression, SEM) and the specification of the model. Specify any interactions and post-hoc analyses and remember that any test not included here must be labeled as an exploratory test in the final paper.

**H1.** Per project: AUC = P(case > control) + ½ P(tie) for the taxon's abundance, one sample per person, DeLong variance.
Across projects: random-effects meta-analysis of AUC − 0.5 (REML between-project variance); θ = sign × pooled value;
z = θ / standard error, normal reference, one-sided. Cohort units that contain a project linked to the claim's own paper are
left out. No interactions.
Code: `code/replication_stats.py` (functions `auc_delong`, `meta_reml`, `claim_test`, `run_claims`, `classify`) and
`code/09_run_test.py`. Details: SAP sections 6–8.
**H2.** The observed number of replicated claims is compared with its distribution over 1,000 within-project label
permutations (seeds 1 to 1,000, `code/14_permutation_reference.py`); one-sided permutation
p = (1 + number of permutations with a count at least as large as the observed one) / 1,001 (SAP 10.8).

### Q20: If applicable, specify a predicted effect size or a minimum effect size of interest for all the effects tested in your statistical analyses.

No effect size is predicted: BugSigDB records direction only. Smallest effect size of interest: θ = Φ(0.2/√2) − 0.5 =
0.05623 (pooled AUC 0.556 in the claimed direction), equivalent to a standardised mean difference of 0.2. It is a convention chosen
by reasoning, not estimated from a pilot (SAP section 9); the owner confirmed it on 13 November 2026.

### Q21: Present the statistical power available to detect the predicted effect size(s) or the smallest effect size(s) of interest, OR present the accuracy that will be obtained for estimation. Use the sample size after updating for missing data and outliers, and justify the assumptions and parameters used (e.g., give an explanation of why anything smaller than the smallest effect size of interest would be theoretically or practically unimportant).

Computed from the pilot's sample sizes for the 1,474 testable claims (`code/10_pilot_numbers.py`,
function `power_one_sided`; Python 3, NumPy, SciPy; normal approximation with the null variance (n+1)/(12·n₁·n₀) per project,
no between-project heterogeneity): at the SESOI and one-sided α = 0.05, median power 0.86;
64 % of claims reach 0.80. At α = 0.005, a plausible threshold after false-discovery control,
median power 0.57 at the SESOI and 100 % of claims reach 0.80 for
d = 0.5. These are upper bounds, because the formula ignores that the between-project variance is estimated (an
independent Monte Carlo gave values 4 to 7 points lower in four configurations). Simulations with heterogeneity are in SAP
sections 7 and 15. Consequence: failure to replicate a small effect in a
condition with few projects is labelled "inconclusive", not "absent".

### Q22: What criteria will you use to make inferences? Describe the information you will use (e.g. specify the p-values, effect sizes, confidence intervals, Bayes factors, specific model fit indices), as well as cut-off criteria, where appropriate. Will you be using one- or two-tailed tests for each of your analyses? If you are comparing multiple conditions or testing multiple hypotheses, will you account for this, and if so, how?

One-tailed tests in the claimed direction. Benjamini-Hochberg adjustment over all testable confirmatory claims, false-discovery
rate 5 %.

| outcome | criterion |
|---|---|
| **Replicated** | adjusted p in the claimed direction < 0.05 |
| **Not replicated — opposite direction** | not replicated, and adjusted p in the opposite direction < 0.05 |
| **Not replicated — smaller than the SESOI** | neither of the above, and the upper one-sided 95 % limit of θ is below the SESOI |
| **Not replicated — inconclusive** | none of the above |
| **Untestable** | fewer than three independent cohort units with enough cases and controls, or the taxon detected in too few persons, or taxon not mapped |

Headline: replicated / testable with a 95 % Wilson interval, overall, by condition, rank and original sequencing type (16S;
shotgun; other or not recorded), plus the unweighted mean of per-condition rates over conditions with at least 10 testable
claims. No p-value between 0.05 and 0.10 will be described as a trend. H2: permutation
p < 0.05.

### Q23: What will you do should your data violate assumptions, your model not converge, or some other analytic problem arises?

The measure is rank-based and makes no distributional assumption about abundances. Foreseen problems and fixed responses
(SAP section 14): zero DeLong variance → tie-corrected null variance; REML at the boundary → τ² = 0; refused reading batch →
pairs stay unmapped and are counted; any other departure is reported as a deviation with both analyses where possible.
The z test is known to exceed its nominal level modestly with few, heterogeneous projects (simulated: up to
0.061 at nominal 0.05); the Hartung-Knapp and stratified-Wilcoxon results are reported for every claim.

### Q24: Provide a series of decisions about evaluating the strength, reliability, or robustness of your focal hypothesis test. This may include within-study replication attempts, additional covariates, cross-validation efforts (out-of-sample replication, split/hold-out sample), applying weights, selectively applying constraints in an SEM context (e.g., comparing model fit statistics), overfitting adjustment techniques used (e.g., regularization approaches such as ridge regression), or some other simulation/sampling/bootstrapping method.

Registered sensitivity analyses (SAP section 13): S1 claims from 16S versus shotgun studies; S2 lenient readings (one reading
suffices for condition pairs and for the contrast type); S3 taxon rule (anchor only; broad); S4 Hartung-Knapp and
stratified-Wilcoxon tests; S5 adjustment for age, sex and BMI; S6 contrasts with subject ids for at least 90 % of persons;
S7 discovery-cohort exclusion switched off; S8 colorectal adenoma left out; S9 the already-examined colorectal-cancer claims,
reported separately. Label-permutation runs give the empirical null. None of these replaces the headline.

### Q25: If you plan to explore your dataset to look for unexpected differences or relationships, describe those tests here, or add them to the final paper under a heading that clearly differentiates this exploratory part of your study from the confirmatory part.

Exploratory, to be reported under a separate heading: claims at family rank and above; claims from "case versus other
control" experiments; what distinguishes replicated from non-replicated claims (original sample size, statistical test,
multiple-testing correction in the original, year); heterogeneity between projects by country and sequencing depth; other
body sites (tier 2).

---

## Part 6: Statement of integrity

This pre-registration was written to the best of the preparing session's knowledge and frozen before any association
between a taxon and a health condition was computed in the catalog by this project, with the one declared exception
(colorectal cancer). No other pre-registration of these hypotheses on this dataset is known to the session. It is informal:
it carries no signature and is not deposited with a registry; its evidence of date is the freeze hash in the catalog's
release notes.

---

## What happens at "run"

1. `python code/freeze.py verify` must report every frozen file unchanged. If it does not, nothing is run and the difference
   is reported.
2. `RUN_ORDER.md` is written: the date of the instruction, the version and DOI of the latest published release, the freeze
   hash.
3. That release's package and per-sample profiles are copied into `release_under_test/` inside this folder, with checksums;
   `RELEASE.json` points the code at the copy.
4. `bash code/16_run_all.sh prepare`; condition pairs that have no reading yet are read twice by Opus 5 with the frozen reader;
   `bash code/16_run_all.sh test` (SAP section 12).
5. The report gives the headline, every registered sensitivity analysis, H2, the numbers that changed between the pilot
   release and the release under test (samples, contrasts, links, testable claims), and every deviation from this document
   or from `SAP.md`, with its reason.
