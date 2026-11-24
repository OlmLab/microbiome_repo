# Statistical analysis plan — pre-registered replication of published gut-microbiome associations on Microbiome Repo profiles

Version 2, frozen on 2026-11-13 (the frozen copy is in the folder named in `FROZEN_CURRENT.txt`). Written before any association
between a taxon and a health condition was computed in catalog data. The pre-registration is informal: it is not filed with an
external registry; the freeze hash is printed in the catalog's release notes as its public date. The owner decided the open
points on 2026-11-13 (SESOI, number of permutations, release rule, informal form). Companion files: `PREREGISTRATION.md`, `PRIOR_EXPOSURE.md`, `DECISIONS.md`, the tables in `tables/`
and the code in `code/`. Counts in this plan come from the pilot on package 1.31.0 (release R2026.38) and are planning figures;
the confirmatory run uses a later release fixed by the rule in section 2.

Abbreviations used: AUC, the probability that a randomly chosen case has a higher abundance than a randomly chosen control
(ties count one half); SESOI, smallest effect size of interest; REML, restricted maximum likelihood; BH, the Benjamini-Hochberg
procedure; EFO, the Experimental Factor Ontology.

## 1. Question

A *claim* is a published statement, as curated in BugSigDB, that a taxon is more abundant or less abundant in stool of people
with a health condition than in stool of healthy controls. For each claim: is the taxon shifted in the claimed direction in
independent projects of Microbiome Repo? Across claims: what share replicates, overall and by condition, taxonomic rank and the
sequencing method of the original study?

## 2. Data and versions

1. **Claims.** BugSigDB bulk export v1.3.1 (`full_dump.csv`, Zenodo DOI 10.5281/zenodo.19740674, CC BY 4.0; sha256
   `af84bfca7bfe7691…`). No claims from other sources.
2. **Abundance profiles.** Microbiome Repo per-sample genus and species profiles (Sandpiper/SingleM, GTDB R232 taxonomy).
3. **Catalog version, by rule.** The confirmatory test runs on **the latest published Microbiome Repo release at the time the
   owner gives the instruction to run** (expected about 28 November 2026). No result with real labels exists before that
   instruction, so the choice of release cannot depend on results. The instruction, its date, the release's version and DOI
   and the freeze hash are written to `RUN_ORDER.md` before anything is computed; the release's package and per-sample
   profiles are copied into `release_under_test/` with their checksums, and `RELEASE.json` points the code at that copy.
   All steps of section 12 are then run on that copy with the code and rules fixed here.
4. **Reference taxonomies.** GTDB R232 genome metadata (bacteria and archaea); NCBI taxonomy dump downloaded 2026-11-13; EFO
   3.96.0 through the EBI Ontology Lookup Service. The same files are reused for the confirmatory run.

## 3. Population of samples

Current catalog rows (`release_retired` empty) with body site `gut_stool`, a Sandpiper profile and no quality flag
(`qc_any_flag` false). In 1.31.0: 285,869 samples from 215,888 persons in 1,799 projects;
136,731 samples carry a health-condition code, 55,766 of them `healthy_control`.
A person is identified by project plus `person_key`.

## 4. Claims: what is tested

1. **Source rows.** Human, curation-complete BugSigDB signatures; one claim per signature and taxon. Body site exactly "Feces"
   (tier 1: 26,743 claims, 3,550 signatures, 679 papers). Other body sites are
   tier 2 (19,081 claims) and are not part of this registration.
2. **Rank.** Genus and species only (20,008 claims). Claims at family rank or above are out of scope.
3. **Taxon mapping** (section 5): the claimed NCBI taxon must have a GTDB anchor under the rule of section 5.1
   (16,906 claims). Whether the taxon is detected in the samples is part of testability (section 8), not of
   the claim list.
4. **Contrast type.** The BugSigDB experiment must compare people who have a disease or health condition with healthy controls.
   Each experiment's condition, group names and group definition were read twice, independently, by Opus 5; an experiment is
   eligible when **both** readings say "case versus healthy control", agree on which group is the case group and agree on the
   condition id that names the cases (753 of 2,159 experiments; agreement on contrast type
   92.3 %, Cohen's kappa 0.90). If the case group is BugSigDB's group 0, the
   claimed direction is reversed.
5. **Already examined.** Claims whose case condition is colorectal cancer (EFO:0005842, its synonyms and narrower terms on the
   closed list) are excluded from the confirmatory set. The list is fixed here as EFO:0000365, EFO:0005842, EFO:1001480, EFO:1001951; the
   code only checks that recomputing it from the data gives the same ids. They are excluded because a DEBIAS-M pilot in this
   project compares colorectal-cancer cases with controls on the same profiles. They are analysed and reported separately as
   "already examined" (672 claims).
6. **Confirmatory claim list.** Rules 1–5 give 6,933 claims on 133
   conditions from 367 papers (`tables/registered_claims.csv`). This list is built from BugSigDB, GTDB R232 and the
   NCBI taxonomy only; it does not depend on the catalog version and is part of the freeze. Whether a listed claim is
   *testable* (section 8) is decided on the release under test, from sample counts and
   taxon detection only, before any case-control comparison.
7. **Direction.** `sign` = +1 if the claim says the taxon is higher in cases, −1 if lower.
8. **Same statement from several papers.** Claims are tested one by one (the discovery-cohort exclusion of section 6 is
   claim-specific). Results are also summarised per *test unit* (condition × taxon); a unit claimed in both directions by
   different papers (125 of 648 testable units in the pilot)
   can replicate in at most one direction.

## 5. Variables

### 5.1 Outcome: abundance of the claimed taxon

Relative abundance (fraction of community coverage) of the claimed taxon in the sample's Sandpiper profile, zero when not
detected. BugSigDB names taxa by NCBI id; the profiles use GTDB R232 names. Rule, fixed here:

1. The NCBI id is brought to its current id; sub-species ids are collapsed to their species.
2. **Anchor.** The GTDB taxon with the same name in which the claimed NCBI taxon is the majority NCBI label of the genomes
   (species: majority of genomes that have a formal NCBI species name; genus: majority of the GTDB genus's species, one vote
   each). If no GTDB taxon has the same name, the candidates are the GTDB taxa in which the claimed taxon is the majority
   label, ordered by type material first, then by number of genomes (species) or of species (genera). For a genus the first
   candidate is accepted if it holds type material or at least two species. For a species it is accepted if it holds type
   material, or at least two genomes carrying the NCBI name, or the same species epithet (a species moved to another genus).
   Otherwise the taxon is unmapped.
3. **Primary measure:** the summed abundance of the anchor and of every GTDB taxon that carries the anchor's name with an
   alphabetic suffix (`g__Ruminococcus`, `g__Ruminococcus_C`, …; `s__Escherichia coli`, `s__Escherichia coli_E`, …). This is the
   rule for an NCBI genus that GTDB splits into several: GTDB keeps the name, with a suffix, for lineages that were classified in
   the genus but are not monophyletic with its type, so the suffixed set is the closest GTDB equivalent of the named NCBI taxon.
4. **Variants for sensitivity analysis:** *anchor only* (the taxon in the strict sense) and *broad* (primary plus every other
   GTDB taxon in which the NCBI taxon is the majority label with support: type material, or ≥2 species for genera; ≥2 genomes and
   ≥1 % of the NCBI species' genomes for species).
5. **Lost and not rescued** (tier-1 genus and species claims, pilot): informal species names such as "sp." or "uncultured"
   (1,970); no GTDB genome carries the NCBI taxon (689); the NCBI taxon is only a
   minority label inside a GTDB taxon, for example Shigella inside Escherichia (441). A mapped taxon that is not
   detected in the samples makes its claims untestable (section 8). Mapped: 92.8 % of genus claims and
   74.5 % of species claims.

Tables: `tables/taxon_map.csv` (one row per claimed NCBI taxon), `tables/taxon_targets_long.parquet` (the GTDB members of each variant).

### 5.2 Exposure: case or healthy control

The catalog gives each sample a `health_condition` code and a free-text `health_condition_detail`. Every distinct (code, detail)
pair of the population (2,789 in the pilot) was read twice, independently, by Opus 5 against the closed list of
378 condition ids that BugSigDB uses for human stool experiments. Each reading returns: up to three ids with a
relation (exact, narrower, broader, related), a role (case, healthy control, other control, not a condition, unclear) and a
state (current, treated or in remission, at risk, history).

1. **Case of condition E, one reading:** role = case, state = current, and the pair is mapped with relation exact or narrower
   to E or to a term of which E is an ancestor in EFO (retired EFO ids are first replaced by their current ids;
   144 of the listed ids were retired).
2. **Strict mapping (primary):** both readings make the pair a case of E. **Lenient mapping (sensitivity):** either reading does.
3. **Healthy control, strict (primary):** code `healthy_control` and both readings give role healthy control
   (51,842 of 55,766 control-coded samples). **Lenient:** code
   `healthy_control`.
4. Persons with any sample that is a case of colorectal cancer (under either reading) are not used as cases of a broader
   condition (for example "cancer").
5. Agreement between the two readings in the pilot: role 91.5 % (kappa 0.84); identical set of
   case conditions 90.8 %. A third reader checked samples of one reading and disagreed with
   5 of 60 ordinary pairs and 7 of 30
   infection-flagged pairs; requiring two readings to agree is the safeguard, and the lenient mapping shows what it costs.
6. **New strings in the release under test.** Pairs that have no reading yet (`code/00_population_and_strings.py --new-suffix _run`) are read with the same script
   (`code/llm_reader.py`, sha256 `0d95d3f810ee0e4f…`), prompt, model and two-reading rule before any profile is
   joined. Pairs already in the table keep their mapping.

Tables: `tables/condition_map.csv`, `tables/condition_string_roles.csv`.

## 6. Units, independence and one sample per person

1. **Contrast.** One condition E in one project: the persons who are cases of E and the healthy-control persons **of the same
   project**. Cases are never compared with controls from another project.
2. **One sample per person per contrast.** Among a person's samples that carry the contrast's case label (for controls: the
   healthy-control label), the first is used, in the order: days since the person's first sample, age at collection,
   collection date, sample key (missing values last). Persons who have both a case
   sample and a control sample in the contrast are excluded from it.
3. **Minimum size.** At least 15 case persons and 15 control persons after rule 2. Pilot, strict mapping:
   288 contrasts in 124 projects for 80 conditions;
   24 conditions have at least three projects. Lenient mapping:
   352 contrasts, 30 conditions with at least three projects.
4. **Independent units.** Projects that belong to the same catalog cohort (`cohorts.csv`) or share an own-data paper
   (`catalog_study_papers`, relation `own_data`) form one cohort unit; within a unit only the project with the largest smaller
   arm is used for a given condition, ties going to the alphabetically first project accession
   (`code/02_units_and_discovery_links.py`). Pilot: the 1,799 projects of the
   population form 1,772 units; 22 units hold more than one project (at most 4).
5. **Discovery-cohort exclusion.** A claim's paper is linked to catalog projects through `catalog_study_papers` (any relation:
   the paper produced the data or reused them), by PubMed id or DOI. The PubMed id is taken from the `pmid` column or, where
   that is empty, from `paper_id` (`MED:<id>`, `PMID:<id>` or bare digits); the `pmid` column alone covers only
   1,845 of 5,635 rows, the combined key 5,080. Every cohort unit that
   contains a linked project is left out when that claim is tested. Pilot: 53 of the
   679 stool claim papers are linked to a catalog project (43 of 125 shotgun
   papers, 14 of 550 16S papers), 39 of them to a project of the
   population. A paper without a link cannot be excluded; this is a declared limitation.

## 7. Effect measure and pooling

1. **Effect per project (primary):** AUC, the probability that a case has a higher abundance of the taxon than a control of the
   same project, ties counted one half; variance by DeLong's method (when it is exactly zero, the tie-corrected null variance is
   used). No transformation, no pseudo-count, no rarefaction.
   *Why this measure.* The claims are statements of direction ("higher", "lower"); 394 of the
   629 experiments behind the confirmatory claims (63 %) used a rank test (Mann-Whitney/Wilcoxon,
   Kruskal-Wallis) or LEfSe, which is built on rank tests, and the AUC is the effect size of those tests. It is unaffected by the many zeros and by
   any monotone transformation, has the same meaning in projects with different laboratory protocols and depths, and needs no
   compositional reference. Its cost: it measures how consistently, not by how much, abundance differs.
2. **Informative project.** A project contributes to a claim only if the taxon is detected in at least 10 persons of the
   contrast (cases and controls together).
3. **Pooling:** random-effects model across projects on AUC − 0.5, between-project variance by REML.
   θ = sign × (pooled AUC − 0.5).
4. **Primary test:** z = θ / (model standard error), normal reference, **one-sided in the claimed direction**. The mirror test
   (opposite direction) is computed for labelling only.
5. **Why this test and not the Hartung-Knapp test.** With three to ten projects the Hartung-Knapp t test is valid but has
   almost no power once multiplicity is controlled. On simulated data (`work/validation/test_choice.json`,
   `code/05b_simulate_test_choice.py`) the rejection rates at nominal 5 % were:

   | simulated situation | random-effects z (chosen) | Hartung-Knapp t | stratified Wilcoxon |
   |---|---|---|---|
   | no effect, 3 projects | 0.038 | 0.002 | 0.049 |
   | no effect, 10 projects | 0.039 | 0.025 | 0.046 |
   | no mean effect, strong heterogeneity (SD of d = 0.3), 3 projects | 0.056 | 0.007 | 0.085 |
   | same, 10 projects | 0.061 | 0.044 | 0.095 |
   | true d = 0.2, 3 projects | 0.531 | 0.137 | 0.609 |
   | true d = 0.2, 5 projects | 0.724 | 0.551 | 0.788 |
   | true d = 0.2, 10 projects | 0.945 | 0.917 | 0.965 |

   In a simulated set of 1,500 claims of which 30 % were true (d = 0.3, heterogeneity SD 0.1), BH at 5 % declared on average
   114 claims replicated with the chosen test (false share 4.7 %),
   11 with Hartung-Knapp, and 144 with the stratified Wilcoxon test (false share
   5.7 %). The chosen test keeps its error rate near nominal without heterogeneity and exceeds it modestly
   under strong heterogeneity (up to 0.061); the stratified test, which ignores heterogeneity, exceeds it more (up to
   0.097). This known small-sample behaviour of the z test is accepted and declared; both other tests are reported for
   every claim.
6. **Reported for every testable claim:** pooled AUC with 95 % confidence interval, θ, number of projects, number of projects
   whose own estimate is in the claimed direction, τ², I², 95 % prediction interval, one-sided p (primary), BH-adjusted value,
   Hartung-Knapp p, stratified-Wilcoxon p, and the per-project estimates.

## 8. Minimum data and "untestable"

A confirmatory claim is **testable** when, after the discovery-cohort exclusion, at least **three independent cohort units**
have a contrast for its condition (section 6) in which the taxon is informative (section 7.2). Otherwise it is **untestable**,
with the reason recorded: taxon not mapped (decided in the claims table, before the test); fewer than three projects for the
condition (after the discovery exclusion); taxon too rare in the projects.
Testability is fixed from counts before any case-control comparison. Pilot on 1.31.0, with cohort units and discovery
exclusion applied: 1,474 of 6,933 confirmatory claims are testable, in
20 conditions, from 143 papers (1,535 if
every project counted as a unit and nothing were excluded; 291 confirmatory claims have at
least one unit excluded as their discovery cohort).

## 9. Smallest effect size of interest, power

BugSigDB records the direction of a claim, not its size, so replication cannot be judged against the original effect.
SESOI: **θ = Φ(0.2/√2) − 0.5 = 0.05623** (pooled AUC 0.556 in the claimed direction; the code uses the
unrounded value), the AUC that corresponds to a standardised
mean difference d = 0.2 between two normal distributions, the conventional "small" effect. Smaller shifts are regarded as too
weak to matter for a claim that a taxon marks a condition. This is a reasoned convention, not an estimate from data.

Power from sample sizes alone (normal approximation, no heterogeneity), for the 1,474 pilot-testable claims
(median 4 projects per claim): at the SESOI and one-sided α = 0.05 the median power is
0.86 and 64 % of claims reach 0.80. After multiplicity control the
effective threshold is stricter; at α = 0.005 the median power at the SESOI is 0.57
(5 % of claims reach 0.80), while for d = 0.5 100 % reach 0.80.
These figures are upper bounds: the formula ignores that τ² is estimated. An independent Monte Carlo of the full procedure
(4,000 replicates in each of four configurations, `work/review/REVIEW.md`) gave 0.32 where the formula gives 0.36, 0.51
against 0.57, and 0.66 against 0.73.
The test is therefore well powered for moderate effects and under-powered for small ones in conditions with few projects;
the "inconclusive" label of section 10 exists for that reason.

## 10. Multiplicity and the definition of outcomes

1. **Family:** all testable confirmatory claims under the primary settings (strict condition mapping, primary taxon rule,
   all sequencing types). BH adjustment of the one-sided p-values; false-discovery rate 5 %. The mirror p-values are adjusted
   the same way, as their own family.
2. **Replicated:** BH-adjusted p in the claimed direction < 0.05.
3. **Not replicated:** testable and not replicated. Every such claim carries exactly one sub-label, in this order of precedence:
   *opposite direction* (BH-adjusted mirror p < 0.05); *smaller than the SESOI* (upper one-sided 95 % confidence limit of θ
   below the SESOI: an effect of meaningful size in the claimed direction is excluded); *inconclusive* (neither: the data cannot
   distinguish no effect from a small one).
4. **Untestable:** section 8.
5. A replicated claim whose upper limit is below the SESOI is flagged "replicated, smaller than the SESOI".
6. **Headline numbers** (`code/15_summarise_results.py`): replicated / testable, with a 95 % Wilson interval; the same by
   condition, by rank, and by sequencing type of the original study in three groups (16S; shotgun; other or not recorded,
   which holds the PCR-based and unrecorded claims and is not part of S1); and the unweighted mean of the per-condition rates
   over the conditions with at least 10 testable claims, because a few conditions hold most claims
   (in the pilot one condition holds 507 of 1,474 testable claims).
7. **Benchmarks reported next to the headline:** (a) the number of claims declared replicated when case and control labels are
   permuted within project (expected near zero; pilot: mean 0.06 per run over 50 permutations of
   the pilot data, at most 2); (b) the number of claims with the "opposite direction" label (BH-adjusted mirror
   value < 0.05), and next to it the unadjusted shares with p < 0.05 in the claimed and in the opposite direction, which
   show how often an arbitrary direction would look supported before multiplicity control.
8. **Aggregate hypothesis H2.** The number of replicated claims is compared with its distribution over 1,000 within-project
   label permutations of the release under test (seeds 1 to 1,000, primary configuration; `code/14_permutation_reference.py`).
   One-sided permutation p = (1 + number of permutations with a count at least as large as the observed one) / 1,001.
   H2 is supported if p < 0.05.

## 11. Covariates

The primary analysis is unadjusted. Reasons: comparisons are made only within a project, which removes differences between
projects in country, protocol and depth; BugSigDB records a controlled confounder for only 95 of the
629 experiments behind the confirmatory claims (15 %); and age and sex are recorded for only
28 % and 28 % of the population's samples (BMI 8 %), so a covariate-adjusted primary
analysis would discard most projects. Adjustment is a registered sensitivity analysis (section 13, S5).

## 12. Order of operations for the confirmatory run

1. **Freeze (done on 2026-11-13).** `code/freeze.py make` copied this plan, the pre-registration document, the registered claim
   list, the fixed derived tables and all code into a read-only folder with `SHA256SUMS.txt`. The freeze hash is the sha256 of
   that file; the Editor prints it in the next release notes.
2. **Instruction to run.** When the owner says "run": `code/freeze.py verify` must report every frozen file unchanged (if not,
   nothing is run and the difference is reported); `RUN_ORDER.md` is written; the latest published package and its
   per-sample profiles are copied into `release_under_test/` with checksums; `RELEASE.json` points the code at the copy.
3. **Prepare** (`bash code/16_run_all.sh prepare`): population and condition pairs of the release. Pairs without two readings
   are read twice by Opus 5 with the frozen reader script, prompt and batch rules (`SUFFIX='_run'`).
4. **Test** (`bash code/16_run_all.sh test`): merge of the readings, contrasts, cohort units and discovery links, testability
   (the registered claim list must come out byte-identical, checked by a second `freeze.py verify`), the test with real
   labels in the primary configuration, the headline, every sensitivity analysis, and the 1,000 permutations of H2.
5. `code/09_run_test.py --labels real` refuses to run unless the freeze verifies and `RUN_ORDER.md` exists, and never
   overwrites a real-label result.
6. Scripts added after the freeze may only read results and format the report; `freeze.py verify` lists them.
7. **Paper links.** Step `02` was first held by a safety check that could not run and was run on 2026-11-13 after the owner
   approved it; all pilot counts in this plan apply cohort units and the discovery exclusion. The Editor is completing the
   project links of the 82 shotgun claim papers that had none; the links of the release under test are used.

## 13. Sensitivity analyses (all registered; none changes the headline)

| | analysis | how |
|---|---|---|
| S1 | Claims from 16S studies versus claims from shotgun studies | `--seq 16S`, `--seq WMS`; replication rates compared descriptively; claims of other or unrecorded sequencing type appear in the headline only |
| S2 | Lenient readings: one reading suffices, both for the catalog's condition pairs and for BugSigDB's contrast type (the other reading may say "case versus other control" or no case-control contrast, but may not contradict the case group) | `--mapping lenient` |
| S3 | Taxon rule: anchor only; broad | `--variant strict`, `--variant broad`; the claim list stays the one selected under the primary rule |
| S4 | Other tests on the same estimates | Hartung-Knapp t; stratified Wilcoxon (both BH-adjusted) |
| S5 | Covariates | `--adjust`: mid-ranks/n regressed on case, age and sex (plus BMI when known for ≥80 % of the contrast), HC3 variance; projects with age and sex for ≥80 % of persons. Compared with the same claims on the same projects and persons without covariates: number replicated under each, median and quartiles of the difference in θ, number of claims whose label changes. The stratified-Wilcoxon side test is not defined for adjusted effects |
| S6 | Repeated persons | `--min-subject-id 0.9`: only contrasts in which ≥90 % of persons have a subject id |
| S7 | Discovery exclusion switched off | `--no-discovery-exclusion`, to show its size |
| S8 | Colorectal adenoma left out | `--drop-condition EFO:0005406`: its controls are shared with the DEBIAS-M pilot |
| S9 | Already-examined colorectal-cancer claims | `--crc-only`: same pipeline, reported separately, not confirmatory |

In the pilot, with permuted labels, S5 could test 376 claims and S6 700.

## 14. If something goes wrong

1. REML does not converge or returns a boundary value: the bounded one-dimensional search used here always returns a value;
   τ² = 0 is accepted.
2. A project's DeLong variance is exactly zero (for example AUC 0 or 1): the tie-corrected null variance is used.
6. Real-label results are never overwritten: the script refuses to write into a folder that already holds one, and every
   result carries the hashes of the code and input tables it was computed from.
3. The release under test changes a claim's testability relative to the pilot: expected; the rule decides, not the pilot list.
4. A reading batch is refused by a safety filter: it is not re-sent; the affected pairs stay unmapped and are counted.
5. Any departure from this plan is listed in the report under "Deviations", with the reason and the result under both the
   planned and the changed analysis where both can be computed.

## 15. Validation of the code (simulated and label-permuted data only)

1. Pooling against R metafor 5.2-1 (`rma`, REML) on 300 random data sets: largest difference in the estimate
   0.00020, in the standard error 0.92 %.
2. AUC against SciPy's Mann-Whitney statistic on tied data: largest difference 4.4e-16.
3. Simulated projects (zero-inflated log-normal abundances; script `05`, 4,000 replicates, a different generator from the
   table of section 7.5, which comes from script `05b` with 3,000 replicates, hence slightly different null rates):
   rejection rate without effect 0.044 /
   0.043 / 0.034 for 3 / 5 / 10 projects; 95 % interval coverage
   0.957 / 0.959 / 0.963; mean estimate with 5 projects 0.0580
   against a true 0.0562.
4. Whole claim runner on simulated claims with a discovery project selected for significance: with the discovery project
   excluded, false share among replicated 4.6 %; with it included,
   20.0 %. In an all-null simulation, 0 of
   2,447 claims replicated with exclusion, and the share of p < 0.05 was
   0.047 with exclusion against 0.146 without.
5. Real profiles with case/control labels permuted within project, 50 permutations, 1,474 testable
   claims: mean 0.06 claims declared replicated per run (at most 2; 2 runs with any);
   share of p < 0.05 on average 0.043. Every sensitivity configuration (S1–S9) ran end to end on permuted labels.
6. Independent check by a separate Opus 5 agent (`work/review/REVIEW.md`): it reproduced the AUC and its DeLong variance by
   brute force, the REML estimate from its estimating equation and on a grid, the contrasts table and the set of testable
   claims exactly, and found no path that computes a real-label statistic in permuted mode. It recomputed 68 quoted numbers
   (2 mismatches, corrected). Its 6 errors and 14 gaps between plan and code are resolved in this version (`DECISIONS.md`).
   Not covered by that check: the catalog package's own counts, the individual readings of condition strings and
   experiments, individual taxon anchors, and the row-by-row parse of the BugSigDB export.
7. Changes made after that check and before the freeze (`work/validation/refactor_regression.json`): the claim list was made
   independent of the catalog release (a taxon with a GTDB anchor stays on the list even if no sample contains it; this added
   141 claims and removed 0, and the set of testable claims is identical: 1,474); a script for
   step 0 was added and reproduces the earlier interactive work exactly; release paths moved to `code/config.py`; the
   real-label lock was tied to the freeze. The whole pipeline, the permutation runs and every sensitivity configuration
   were run again afterwards. These changes were not seen by the independent checker.
