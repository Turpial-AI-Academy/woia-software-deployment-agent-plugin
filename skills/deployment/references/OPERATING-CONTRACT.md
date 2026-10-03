# Deployment Operating Contract

## Capability boundary

This capability starts from an already-approved release candidate and answers:

> Was that exact candidate promoted/deployed through the real delivery mechanism, did the deployed target pass focused post-deploy checks, and is recovery still known?

It is independently useful and does not require ASPS.

The capability does not own:

- product implementation;
- release-candidate creation or approval;
- security sign-off;
- observability design;
- documentation authoring;
- provider selection merely for preference;
- broad infrastructure redesign.

It may discover and consume evidence from those responsibilities when deployment needs it.

## Required inputs

At minimum:

1. an approved candidate identity;
2. a real target and deployment/promotion mechanism;
3. production authorization when repository policy requires it;
4. a known recovery path appropriate to the target.

If these are not available, report the deployment as blocked rather than manufacturing evidence.

## Success gate

A successful deployment requires evidence that:

- the approved candidate was the one promoted/deployed;
- the intended target reached the expected revision/state;
- focused post-deploy checks passed;
- required observation completed or was explicitly not applicable;
- a practical recovery path remains known.

## Candidate identity

Bind deployment evidence to the strongest identity available:

- exact Git commit SHA;
- immutable artifact checksum or digest;
- container image digest;
- package/release version plus registry digest when available;
- provider deployment identifier tied back to the approved revision.

Prefer promoting the already-validated artifact.

Avoid:

~~~text
validate candidate A
-> rebuild materially different candidate B
-> deploy B
~~~

If the target platform inherently rebuilds from source, require the build source to resolve to the approved revision and verify the deployed revision using target/provider evidence.

## Authorization boundary

Production mutation must not be inferred from technical ability.

When production authorization is required:

~~~text
READY
-> explicit authorization
-> mutation
~~~

Without authorization:

~~~text
READY
-> BLOCKED_AUTHORIZATION
~~~

Preview, staging, or other non-production environments may follow repository policy; do not invent a production-style approval rule when the repository does not require one.

## Deployment state model

Use the smallest status that accurately describes reality:

- `BLOCKED`: a required input, authorization, mechanism, or recovery path is missing;
- `PROMOTION_FAILED`: deployment/promotion did not reach the intended target state;
- `VERIFY_FAILED`: target changed but post-deploy acceptance did not pass;
- `RECOVERED`: a failed deployment was restored to a known acceptable state;
- `RECOVERY_FAILED`: recovery was attempted but acceptable state was not restored;
- `VERIFIED`: approved candidate is deployed and post-deploy acceptance passed.

Do not call a partially observed or unverifiable target `VERIFIED`.

## Mutation discipline

Before each production mutation, re-confirm:

- candidate identity;
- target identity;
- current target revision when discoverable;
- authorization;
- rollback/recovery reference;
- irreversible or data-affecting operations.

Do not broaden the change while deploying. A deployment incident is not authorization for unrelated refactoring, provider migration, credential rotation, or infrastructure redesign.
