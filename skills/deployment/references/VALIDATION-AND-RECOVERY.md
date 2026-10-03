# Validation and Recovery

## Post-deploy smoke

Post-deploy smoke is intentionally small.

Good examples:

- health/readiness endpoint;
- homepage or application boot;
- login when critical and safely testable;
- one primary user operation;
- CLI `--version`;
- installer launch;
- a narrow service/API request.

Do not rerun the complete pre-release suite after deployment. The release candidate should already have passed its deep validation before promotion.

A useful smoke proves that the deployed target is reachable and that one or a few critical behaviors still work in the real environment.

## Observation

Use repository-defined health signals and observation windows when they exist.

Possible signals include:

- error rate;
- latency;
- availability/readiness;
- crash rate;
- queue/backlog health;
- deployment events;
- provider health;
- a small set of product-specific business signals.

Do not invent universal thresholds. Use existing SLOs, release criteria, or explicit task requirements.

If no observation window is defined, choose only what the task authorizes and report the limitation.

## Recovery readiness

Before production mutation, know:

- the previous known-good revision/artifact/deployment;
- the recovery command or documented manual procedure;
- whether rollback is technically compatible with current data/schema;
- whether recovery needs a backup, restore, migration reversal, or forward fix;
- the owner/authorization boundary for executing recovery.

Automation is optional. Knowledge of the procedure is not.

## Data and migration risk

Binary/application rollback can be unsafe after a one-way schema or data change.

Before deployment with migration risk, determine:

- backward/forward compatibility;
- whether old application code can run against the new schema;
- backup/restore requirements;
- whether the safe recovery path is rollback, roll-forward, restore, or another documented operation.

Never claim `rollback ready` solely because a previous application artifact exists.

## Recovery triggers

Use repository-defined triggers when available. Examples:

- smoke failure;
- sustained health regression beyond accepted thresholds;
- critical error introduced by the deployment;
- deployed revision mismatch;
- migration failure leaving the target unsafe.

Do not trigger a destructive recovery merely because one noncritical metric fluctuates.

## Recovery result

After recovery, verify the recovered target with a focused smoke and health check.

Report:

- what failed;
- recovery action;
- resulting revision/state;
- verification outcome;
- data/operational risks still open.

`RECOVERED` means acceptable service/state was restored. It does not mean the original deployment succeeded.
