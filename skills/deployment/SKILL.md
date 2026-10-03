---
name: deployment
description: Promote or deploy an approved release candidate through the repository's real delivery mechanism, verify post-deploy health, and preserve a known recovery path.
license: MIT
---

# Promotion & Deployment

Use this skill when an already-approved release candidate must be promoted, deployed, activated, or otherwise moved through the repository's real delivery mechanism. The capability is standalone and does not require ASPS.

## Operating flow

~~~text
DISCOVER -> DECIDE -> IMPLEMENT -> VALIDATE -> REPORT
~~~

The deployment-specific invariant is:

~~~text
approved candidate identity
-> required authorization
-> real promotion/deployment
-> focused post-deploy verification
-> known recovery
-> evidence
~~~

## Select execution depth

Use a bounded read-only follow-up for a healthy existing deployment receipt or recovery runbook when the request only reconciles an external evidence reference or a local explanation. Confirm that the approved candidate/artifact, target, configuration, migration state, authorization window, smoke/observation obligations, and recovery procedure are unchanged. This path does not perform a new promotion or deployment.

1. Locate the authoritative receipt, runbook, and durable execution evidence.
2. Compare the affected claim with its owning source and the recorded candidate/target identity.
3. Inspect only the changed section and required candidate, authorization, verification, and recovery invariants.
4. Amend the smallest authorized reporting unit; preserve unrelated valid evidence and historical receipts.
5. Re-observe any target fact whose freshness expired; distinguish that read-only observation from a deployment operation.
6. Report reused, invalidated, and fresh evidence, plus assumptions and limitations. A plan or runbook does not establish deployment success.

Use the deep path for every new promotion/deployment, a new or unhealthy receipt/runbook, missing durable execution evidence, unclear scope, contradictions, or a change to candidate/artifact, target, configuration, migration/data compatibility, authorization window, security boundary, observation criteria, or recovery procedure. Mutation of an approved artifact requires a new frozen approved candidate before deployment. Every new operation needs a current preflight, valid required authorization, real target smoke/observation evidence, and known usable recovery.

Load detailed references by trigger:

| Trigger | Reference |
|---|---|
| New operation, missing inputs, authorization, or candidate/state ambiguity | [OPERATING-CONTRACT.md](references/OPERATING-CONTRACT.md) |
| Target adapter, strategy, provider rebuild, or distribution-channel question | [TARGETS-AND-STRATEGIES.md](references/TARGETS-AND-STRATEGIES.md) |
| Smoke, observation, migration compatibility, or recovery risk | [VALIDATION-AND-RECOVERY.md](references/VALIDATION-AND-RECOVERY.md) |
| Receipt amendment, evidence reuse/freshness, or reporting an operation | [EVIDENCE.md](references/EVIDENCE.md) |

The bounded route rejoins at Validate/Report with its affected claims. The operation steps below apply when a promotion/deployment is actually authorized.

## Discover

Read the repository and target state before changing anything. Identify:

- the exact approved candidate: commit SHA and, when applicable, artifact name plus checksum/digest;
- the real deployment or promotion mechanism already owned by the repository;
- target environment, production domains/endpoints, regions, aliases, registries, devices, or distribution channels;
- whether production authorization, a change window, separation of duties, or another human boundary is required;
- the current/previous known-good deployment or release that can be recovered to;
- migrations, persisted data, compatibility constraints, or one-way operations that can make rollback unsafe;
- the smallest useful smoke and health signals, plus any observation window already defined by the product.

Apply the selected depth; expand discovery only when a missing input, affected invariant, or contradiction requires it.

## Decide

Preserve healthy repository procedures. Select the smallest deployment strategy that proves the approved candidate reached the intended target.

Prefer promotion of the already-validated artifact when the platform supports it. Do not validate one build and silently deploy a materially different rebuild. When a platform inherently rebuilds from source, bind that build to the exact approved revision and verify the resulting target identity using the repository's accepted mechanism.

Do not impose a provider or orchestration system. Adapt to repository-owned scripts, task runners, deployment CLIs, APIs, control planes, or documented manual procedures.

Before mutation, decide:

- candidate identity;
- target and intended state;
- required authorization;
- preflight checks;
- promotion/deployment command or manual operation;
- post-deploy smoke and observation criteria;
- rollback/recovery trigger and procedure.

## Implement

Do not cross a required production authorization boundary implicitly.

Use the repository's real mechanism and the exact candidate selected during discovery. Keep secrets in the operator/provider's existing secret store or process environment; never copy usable credentials into plugin files or deployment evidence.

When supported, run a read-only preflight before the mutation. During deployment:

1. re-confirm candidate and target;
2. confirm required authorization;
3. execute only the intended promotion/deployment;
4. capture provider/repository deployment identifiers without exposing secrets;
5. stop and report if actual target identity diverges from the approved candidate.

A failed mutation is not a reason to improvise a second unrelated deployment path.

## Validate

Run focused post-deploy checks against the deployed target. Smoke should be small and high-value; do not rerun the full pre-release suite merely because deployment completed.

Observe the signals and duration justified by repository policy and release risk. If acceptance criteria fail, follow the known recovery path rather than inventing one after the incident.

Rollback automation is optional. A practical recovery procedure is required before declaring the deployment gate satisfied.

For a bounded follow-up, validate the affected claims and freshness without replaying an unchanged deployment. For a new operation, obtain actual post-deploy evidence for that operation.

## Report

Report facts separately from assumptions:

- candidate commit and artifact/digest when applicable;
- target/environment and deployment/promotion mechanism;
- authorization state/reference without sensitive content;
- deployment identifier and resulting revision;
- smoke and observation results;
- recovery strategy/reference and whether it remains usable;
- final status and remaining risk.

Use the example receipt under [assets/deployment-receipt.example.json](assets/deployment-receipt.example.json) when a new receipt is useful; an existing healthy receipt does not need template replay.

Never report a skipped, historical, or blocked check as passed.
