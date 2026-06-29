# Skills Runtime Panel

Skills are instruction packs and task playbooks. They are not agents, and they
are not MCP tools.

In AIDDE, a skill can teach an agent how to work in a domain, how to operate a
workflow, which docs to read first, which scripts to run, and how to verify the
result. The Skills Runtime panel makes that layer visible and controllable.

## Product position

Skills answer:

```text
What specialized operating knowledge is available to this agent turn?
```

ACP answers which agent/session is working. MCP answers which tools/resources
are callable. Skills answer which instruction packs, workflows, and local
playbooks are allowed to shape the agent's behavior.

## What the panel owns

The Skills Runtime panel owns live skill visibility and policy:

- installed skills,
- available skills,
- enabled/disabled state,
- active skill activations,
- manual skill pins,
- per-workspace skill policy,
- per-panel skill policy,
- per-agent/session skill policy,
- skill source paths,
- skill trust level,
- skill version or content hash,
- required references/scripts/assets,
- conflicts with other skills,
- last activation,
- last failure,
- related Audit rows.

## Runtime lanes

The panel should group state by:

- Installed
- Enabled
- Suggested
- Active
- Pinned
- Conflicts
- Failures
- Audit

## Row anatomy

Each skill row should show:

- skill name,
- source,
- scope,
- enabled/disabled,
- trigger mode,
- trust level,
- active/pinned state,
- last used,
- related agent/session,
- related panel,
- related Audit row.

Example:

```text
enabled  recall  source: ~/.codex/skills  scope: AIDE  active in panel 4
```

## Controls

The Skills panel needs direct controls:

- enable/disable skill globally,
- enable/disable skill for workspace,
- enable/disable skill for panel,
- enable/disable skill for ACP session,
- pin skill to current prompt,
- unpin skill,
- force suggest skill,
- inspect `SKILL.md`,
- inspect required references/scripts/assets,
- open source folder,
- copy skill path,
- view activation trace,
- mark trusted/untrusted for this workspace.

Disabling a skill should prevent future activations. If the skill is already
active in a running turn, AIDDE should show that it was already injected and
allow the user to stop/cancel the turn through ACP if necessary.

## Activation trace

Every skill activation should be auditable.

The trace should show:

- why the skill matched,
- whether it was user-pinned, model-suggested, or rule-triggered,
- which agent/session received it,
- which panel requested it,
- which files were read as skill instructions,
- which scripts/assets were used,
- whether activation was blocked by policy,
- related Audit row,
- related Memory preflight id when applicable.

This is especially important because skills can strongly shape behavior without
looking like a tool call.

## Command rail and panel badges

Skills should be visible where the user is already looking:

- command rail shows active skill chips before send,
- command rail allows removing a suggested skill before send,
- agent panel title shows active/pinned skill count,
- Audit rows show skill activation and files read,
- ACP Runtime peer edges show which skills shaped each agent turn.

## Agent-scoped population

When the user attaches an agent to an agent chat panel, Skills Runtime should
populate from that agent's available and discovered skill sources.

Sources include:

- skills bundled with the agent adapter,
- skills discovered from the source desktop app profile,
- skills installed in AIDDE,
- project-local skill packs,
- manually imported disabled/untrusted candidates.

The Skills panel should default to "follow focused agent". In that mode it
filters to the focused agent chat panel and shows:

- skills available to that agent,
- skills enabled for that panel/session,
- disabled candidate skills,
- pinned skills,
- suggested skills for the current prompt,
- policy-denied skills,
- activation history for that agent/session.

The user should be able to disable skills that add noise and enable or pin them
when they matter. Those toggles should update the selected ACP session policy,
the command rail skill chips, and the Audit trail immediately.

This makes instruction scope visible before the prompt is sent.

## Skill policy

Skill enablement is scoped.

AIDDE should support skill toggles at:

- global skill level,
- workspace level,
- panel level,
- ACP session level,
- individual prompt level.

The effective policy should be visible before a prompt is sent. If a skill is
disabled for a panel/session, it should not appear in that agent's available
skill list unless shown as policy-denied for debugging.

## Import and export

Skills Runtime needs import/export for skill packs, workspace policy, and
activation evidence. Use the shared rules in
[RUNTIME_IMPORT_EXPORT.md](RUNTIME_IMPORT_EXPORT.md).

Skills import should also discover skill directories and instruction packs from
desktop agent apps, CLIs, and editor extensions already installed on the user's
machine. AIDDE should normalize them into its Skills Runtime registry instead of
requiring users to recreate them manually.

Skills export should include:

- skill manifests,
- source paths or packaged skill files,
- content hashes,
- enabled/disabled policy,
- trusted/untrusted state,
- workspace/panel/session scope,
- pinned skills,
- suggested skill rules,
- activation traces,
- required references/scripts/assets metadata,
- related Audit row ids.

Skills export must not include:

- raw secrets in skill files,
- private local files outside the selected skill package,
- large referenced assets unless explicitly included,
- hidden activation state that is not visible in Audit.

Skills import should support:

- importing as untrusted by default,
- importing from detected desktop app profiles,
- copying a skill pack or referencing its original source path,
- inspecting `SKILL.md` before enable,
- hash/conflict detection,
- policy diff preview,
- per-workspace install,
- per-panel enablement,
- rollback after apply.

## Difference from ACP, MCP, and Memory

- ACP: agent/session protocol, prompt turns, updates, peer edges.
- MCP: callable tools, resources, prompts, server health.
- Skills: instruction packs, workflows, domain operating rules.
- Memory: retrieved context and durable substrate references.

All four can influence a turn, so AIDDE should show them together in the command
rail preflight:

```text
prompt + Memory cells + Skills + MCP availability + ACP target/session
```

## Beta 0.1 slice

The first Skills slice should prove:

- skill registry,
- enabled/disabled state,
- per-workspace and per-panel policy,
- active skill chips in command rail,
- skill activation Audit rows,
- inspect `SKILL.md`,
- activation trace,
- distinction from MCP tools and Memory context.

That is enough to make skills visible without turning the app into a package
manager.
