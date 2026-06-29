# Beta 0.1 MVP

Beta 0.1 should prove that AIDDE has a different center of gravity than a
normal IDE.

The MVP is not "all integrations." It is the smallest useful rewrite that makes
agent work visible, bounded, and easier to steer.

## Product promise

Open AIDDE, start a project, talk to an agent, see the memory/context it is
about to use, stop or edit bad context before it runs, watch the real actions it
takes, and keep the work organized in panels that can be targeted.

## Required vertical slice

1. App shell
   - desktop app launches,
   - DD mark is present,
   - default window size persists,
   - basic app menu exists.

2. Panel primitive
   - center and sidebar panels share one model,
   - panels have type, title, bounds, focus, and permission metadata,
   - default layout restores after reload.

3. Command rail
   - bottom-centered input,
   - prompt preflight token row,
   - stop/edit/play cycle,
   - panel target indicator.

4. Agent chat
   - one default agent panel,
   - stable per-panel session identity,
   - visible run state,
   - cancel path,
   - first ACP request shape for bounded interagent work,
   - MCP tool availability comes through permissions/settings, not a default
     protocol panel.

5. Memory v0
   - candidate context appears before send,
   - actual memory used appears during/after the turn,
   - Recall remains substrate inspection, Memory is the working UX,
   - MAL netlist replay/verify uses the frozen reader contract.

6. Audit v0
   - model actions are logged without chat prose,
   - tool calls/results, terminal commands, edits, memory pulls, tests, git, and
     errors have compact rows,
   - details are expandable and sanitized.

7. Learning start page
   - tutorials,
   - project templates,
   - "how to build with AI" missions,
   - pinned/recent projects.

8. DD v0
   - title-bar face,
   - awake/sleep/listening state,
   - app icon/DD mark,
   - first cosmetic slot in data model.

9. Rewards v0
   - explicit achievement unlocks,
   - hidden rule format,
   - no critical function gated by hidden unlocks.

10. Blast-radius teaser
    - file explorer can show red/yellow/green state for changed/risky files,
    - implementation may be mocked or structurally simple in Beta 0.1,
    - the UX contract should be real.

## Non-goals for Beta 0.1

- Full VS Code marketplace compatibility.
- Full Lattice/Solver/Checker capability integration.
- Hosted model reseller billing.
- Native OS replacement behavior.
- Complex 3D STL generation pipeline.
- Advanced multi-agent orchestration.

These can come later. The first beta should make the core shape undeniable.

## Acceptance criteria

- A new user can understand what AIDDE is from the start page.
- A returning user can restore the same layout.
- The command rail is the obvious place to type.
- Memory preflight is visible before the model turn is committed.
- The Audit panel shows what happened without requiring chat transcript reading.
- A bounded ACP request can be shown with source, target, status, and audit row.
- MCP calls can be audited and permissioned without requiring a default MCP panel.
- DD state is legible.
- At least one learning mission is useful without leaving the app.
- At least one cosmetic unlock can be earned.
- The file explorer can communicate "changed and good," "warning," and "broken."
