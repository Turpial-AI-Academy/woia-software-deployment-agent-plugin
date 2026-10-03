# Targets and Strategies

## Discover the repository-owned adapter

Deployment should reuse the repository's stable delivery interface when one exists.

Examples include:

- task-runner commands such as `deploy`, `promote`, `release`, or environment-specific operations;
- provider CLI/API procedures already documented by the repository;
- container or orchestration manifests;
- registry publication procedures;
- desktop/update-channel distribution;
- manual control-plane steps recorded in a runbook.

Do not make a consumer adopt this plugin repository's Node, pnpm, Mise, or Docker maintenance environment.

## Strategy hierarchy

Prefer the least ambiguous mechanism that preserves candidate identity.

### 1. Immutable artifact promotion

Best when the platform supports moving the exact validated artifact between environments.

~~~text
validated artifact
-> staging/preview
-> production promotion
~~~

Examples include promoting an existing deployment, image digest, signed installer, package, or release asset.

### 2. Exact-revision deployment

Use when the platform deploys directly from an immutable source revision.

Verify both:

- requested source revision;
- target/provider-reported deployed revision.

### 3. Provider rebuild from approved source

Some providers always rebuild.

This is acceptable only when repository policy treats that path as canonical and the rebuild is bound to the approved source revision. Verify target identity after the provider finishes. Do not claim byte identity unless the system actually proves it.

### 4. Manual activation/distribution

A human-operated promotion can be valid when it is the repository's real mechanism. Capture the candidate, target, authorization, action performed, verification, and recovery evidence.

## Product profiles

### Web / SaaS / service

Typical shape:

~~~text
approved candidate
-> preview/staging when used
-> smoke
-> production promotion/deployment
-> health + observation
~~~

### Containers / orchestration

Prefer immutable image digests over mutable tags when available. Record workload/target revision and recovery image/revision.

### Desktop / installed applications

Deployment may mean distribution or update-channel promotion rather than a live server mutation. Verify installer/package identity and a launch/installation smoke appropriate to the product.

### CLI / library / package

Do not invent a runtime production deployment when publication/distribution is the actual final action. Respect repository ownership boundaries between release publication and downstream deployment.

### Documentation / standards

If there is no runtime or distribution target, deployment may be `not applicable`. Do not invent an application deployment solely to make the capability run.

## Preserve target policy

Do not replace a healthy deployment mechanism because another provider is more familiar.

Escalate provider migration, environment redesign, release-channel changes, or infrastructure architecture to the capability that owns those decisions.
