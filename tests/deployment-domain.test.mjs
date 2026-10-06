import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKILL = path.join(ROOT, "skills", "deployment", "SKILL.md");
const REF = (...parts) => path.join(ROOT, "skills", "deployment", "references", ...parts);
const ASSET = (...parts) => path.join(ROOT, "skills", "deployment", "assets", ...parts);

async function text(file) {
  return readFile(file, "utf8");
}

test("deployment uses the real repository mechanism without imposing a provider", async () => {
  const skill = await text(SKILL);
  assert.match(skill, /repository's real mechanism/i);
  assert.match(skill, /Do not impose a provider/i);
});

test("success is bound to exact candidate identity and deployed target identity", async () => {
  const operating = await text(REF("OPERATING-CONTRACT.md"));
  const targets = await text(REF("TARGETS-AND-STRATEGIES.md"));
  assert.match(operating, /exact Git commit SHA/i);
  assert.match(operating, /immutable artifact checksum or digest/i);
  assert.match(operating, /Avoid:[\s\S]*validate candidate A[\s\S]*candidate B/i);
  assert.match(targets, /requested source revision/i);
  assert.match(targets, /target\/provider-reported deployed revision/i);
});

test("required production authorization is a hard mutation boundary", async () => {
  const operating = await text(REF("OPERATING-CONTRACT.md"));
  const skill = await text(SKILL);
  assert.match(operating, /production mutation must not be inferred from technical ability/i);
  assert.match(operating, /BLOCKED_AUTHORIZATION/);
  assert.match(skill, /Do not cross a required production authorization boundary implicitly/i);
});

test("post-deploy smoke stays focused instead of rerunning the release suite", async () => {
  const validation = await text(REF("VALIDATION-AND-RECOVERY.md"));
  const skill = await text(SKILL);
  assert.match(validation, /Post-deploy smoke is intentionally small/i);
  assert.match(validation, /Do not rerun the complete pre-release suite/i);
  assert.match(skill, /smoke should be small and high-value/i);
});

test("recovery must be known before deployment can be verified", async () => {
  const operating = await text(REF("OPERATING-CONTRACT.md"));
  const recovery = await text(REF("VALIDATION-AND-RECOVERY.md"));
  assert.match(operating, /a practical recovery path remains known/i);
  assert.match(recovery, /Automation is optional\. Knowledge of the procedure is not\./i);
  assert.match(recovery, /Never claim .*rollback ready.* solely because a previous application artifact exists/is);
});

test("migration risk can change rollback into restore or roll-forward", async () => {
  const recovery = await text(REF("VALIDATION-AND-RECOVERY.md"));
  assert.match(recovery, /Binary\/application rollback can be unsafe/i);
  assert.match(recovery, /rollback, roll-forward, restore/i);
  assert.match(recovery, /backward\/forward compatibility/i);
});

test("deployment receipt carries candidate, target, authorization, verification, and recovery without secrets", async () => {
  const receipt = JSON.parse(await text(ASSET("deployment-receipt.example.json")));
  assert.equal(receipt.format, "deployment-receipt/v1");
  assert.equal(receipt.status, "VERIFIED");
  assert.match(receipt.candidate.commit, /^[0-9a-f]{40}$/);
  assert.match(receipt.candidate.artifact.digest, /^sha256:[0-9a-f]{64}$/);
  assert.equal(receipt.target.deployed_revision, receipt.candidate.commit);
  assert.equal(receipt.authorization.required, true);
  assert.equal(receipt.authorization.confirmed, true);
  assert.equal(receipt.verification.smoke, "passed");
  assert.equal(receipt.recovery.known, true);

  const serialized = JSON.stringify(receipt).toLowerCase();
  for (const forbidden of ["token", "password", "secret", "cookie", "private_key"]) {
    assert.equal(serialized.includes(`"${forbidden}"`), false, `receipt must not contain a ${forbidden} field`);
  }
});

test("evidence contract rejects fabricated success semantics in documentation", async () => {
  const evidence = await text(REF("EVIDENCE.md"));
  assert.match(evidence, /A mismatch blocks .*VERIFIED/is);
  assert.match(evidence, /Historical success does not prove the new deployment/i);
  assert.match(evidence, /Do not mark an unavailable or skipped check as passed/i);
  assert.match(evidence, /Do not fabricate identifiers/i);
});

test("bounded follow-up reconciles existing receipts without performing a new operation", async () => {
  const skill = await text(SKILL);
  const bounded = skill.split("## Select execution depth")[1].split("Use the deep path")[0];
  for (const obligation of [/bounded.*read-only/is, /existing.*receipt.*runbook/is, /authoritative.*durable execution evidence/is, /owning source/i, /candidate.*target.*identity/is, /smallest.*reporting unit/is, /preserve.*unrelated.*evidence/is, /freshness/i, /plan.*does not establish.*success/is]) {
    assert.match(bounded, obligation);
  }
  const noNewOperation = /\b(?:does\s+not|must\s+not|cannot|may\s+not|never)\b[^.!?\n]{0,60}\b(?:perform|start|execute|initiate|trigger)\b[^.!?\n]{0,30}\b(?:new|another|additional)\b[^.!?\n]{0,30}\b(?:promotion[^.!?\n]{0,30}deployment|deployment[^.!?\n]{0,30}promotion)\b/i;
  const assertReadOnlyFollowUp = (value) => {
    assert.match(value, /read[- ]only/i);
    assert.match(value, noNewOperation);
  };
  assertReadOnlyFollowUp(bounded);
  assertReadOnlyFollowUp("The follow-up remains read-only and cannot start another deployment or promotion.");
  assertReadOnlyFollowUp("Read-only reconciliation must not initiate an additional promotion or deployment.");
  assert.throws(() => assertReadOnlyFollowUp(bounded.replace(noNewOperation, "may start another deployment or promotion")), assert.AssertionError);
  assert.throws(() => assertReadOnlyFollowUp("The follow-up remains read-only and may start another deployment or promotion."), assert.AssertionError);
});

test("deep deployment routing preserves current authorization, target smoke, and recovery obligations", async () => {
  const skill = await text(SKILL);
  const deep = skill.split("Use the deep path")[1].split("Load detailed references")[0];
  for (const trigger of [/every new promotion\/deployment/i, /missing durable execution evidence/i, /contradictions/i, /candidate\/artifact/i, /target/i, /configuration/i, /migration\/data compatibility/i, /authorization window/i, /security boundary/i, /recovery procedure/i]) {
    assert.match(deep, trigger);
  }
  for (const obligation of [/new frozen approved candidate/i, /current preflight/i, /valid required authorization/i, /real target smoke\/observation evidence/i, /known usable recovery/i]) {
    assert.match(deep, obligation);
  }
});

test("receipt lifecycle preserves historical evidence while invalidating changed claims", async () => {
  const evidence = await text(REF("EVIDENCE.md"));
  const lifecycle = evidence.split("### Evidence lifecycle")[1].split("### Exact candidate")[0];
  for (const state of ["Reusable", "Invalidated", "Fresh", "Assumptions"]) assert.match(lifecycle, new RegExp(state));
  assert.match(lifecycle, /durable, inspectable execution receipts/i);
  assert.match(lifecycle, /only the affected claim or check/i);
  assert.match(lifecycle, /original historical receipt/i);
  assert.match(lifecycle, /every new deployment/i);
  assert.match(lifecycle, /plan.*recollection.*is not evidence/is);
});

test("detailed deployment references are routed by their domain trigger", async () => {
  const skill = await text(SKILL);
  const routing = skill.split("Load detailed references by trigger:")[1].split("## Discover")[0];
  for (const reference of ["OPERATING-CONTRACT.md", "TARGETS-AND-STRATEGIES.md", "VALIDATION-AND-RECOVERY.md", "EVIDENCE.md"]) assert.match(routing, new RegExp(reference.replaceAll(".", "\\.")));
  for (const trigger of [/authorization/i, /strategy/i, /migration compatibility/i, /evidence reuse\/freshness/i]) assert.match(routing, trigger);
});
