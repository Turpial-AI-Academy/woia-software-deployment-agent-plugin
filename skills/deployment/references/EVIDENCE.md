# Deployment Evidence

## Purpose

Deployment evidence should be concise, reproducible, and bound to the exact candidate and target.

It is an operational receipt, not a secret store and not a dump of provider metadata.

## Recommended fields

Record, when applicable:

- status;
- candidate commit SHA;
- artifact name and checksum/digest;
- target/environment;
- deployment/promotion mechanism;
- production authorization requirement and confirmation;
- authorization reference or change record identifier;
- provider/repository deployment ID;
- deployed revision/digest;
- smoke result;
- observation result/window;
- recovery strategy/reference;
- previous known-good revision/deployment;
- remaining risks or blocked items.

The example asset uses `deployment-receipt/v1` as a portable documentation format. It is not a provider API contract.

## Evidence rules

### Evidence lifecycle

Classify evidence before reusing it:

- **Reusable:** durable, inspectable execution receipts whose candidate/artifact, target, configuration, migration state, authorization scope/window, verification obligations, and recovery reference still match. Preserve unrelated valid records; the start of a new session alone does not invalidate them.
- **Invalidated:** identify only the affected claim or check when its inputs, candidate, target state, authorization window, smoke criteria, or recovery assumptions changed. Retain the original historical receipt instead of relabeling it as current.
- **Fresh:** query authoritative target state when a current claim requires it, renew expired authorization before mutation, and execute real smoke/observation for every new deployment. A previous successful operation cannot prove a new operation.
- **Assumptions:** a deployment plan, configuration presence, recollection, or inferred target/recovery status is not evidence. Mark unavailable facts explicitly.

A bounded read-only amendment may reference still-valid external receipts and runbooks; it does not create evidence that another promotion occurred. If changed facts invalidate the deployment gate, use the deep path and establish the required current evidence before reporting `VERIFIED`.

### Exact candidate

A receipt must identify what was intended and what actually reached the target.

When both are observable, record:

~~~text
requested_candidate
deployed_candidate
~~~

A mismatch blocks `VERIFIED`.

### Authorization

Record whether authorization was required and confirmed. Store only a non-sensitive reference, never approval tokens, cookies, credentials, or copied secret payloads.

### Smoke and observation

Use current execution evidence. Historical success does not prove the new deployment.

Do not mark an unavailable or skipped check as passed.

### Recovery

Record a useful recovery reference before declaring the gate satisfied.

A reference can be:

- repository runbook path;
- task-runner command;
- immutable previous deployment/revision;
- documented provider procedure;
- backup/restore runbook.

The receipt must not contain secret values required to execute that procedure.

## Minimal successful receipt

~~~json
{
  "format": "deployment-receipt/v1",
  "status": "VERIFIED",
  "candidate": {
    "commit": "<approved-commit>",
    "artifact": {
      "name": "<artifact-or-null>",
      "digest": "<digest-or-null>"
    }
  },
  "target": {
    "environment": "production",
    "mechanism": "<repository-defined>",
    "deployment_id": "<id>",
    "deployed_revision": "<revision>"
  },
  "authorization": {
    "required": true,
    "confirmed": true,
    "reference": "<non-sensitive-reference>"
  },
  "verification": {
    "smoke": "passed",
    "observation": "passed"
  },
  "recovery": {
    "known": true,
    "reference": "<runbook-or-operation>",
    "previous_revision": "<known-good-revision>"
  }
}
~~~

Use null or an explicit `not_applicable`/blocked value when a field genuinely does not apply. Do not fabricate identifiers merely to make the receipt look complete.
