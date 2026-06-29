# Beta 0.1 Backlog

This backlog is intentionally narrow. AIDDE earns the right to integrate more
systems only after the core interface is stable.

## P0

### 1. Bootstrap app shell and development workflow

Create the first runnable AIDDE app scaffold with install, dev, build, lint, and
test commands.

Acceptance:

- `npm install` or documented equivalent works.
- `npm run dev` opens the shell.
- `npm run test` has at least one passing smoke test.
- README points to the dev command.

### 2. Define the panel geometry model

Represent panels as bounded rectangles with type, title, permission, focus, and
target id.

Acceptance:

- Default layout serializes to JSON.
- Layout reloads after app restart.
- Center and sidebar panels use the same schema.
- Illegal geometries are rejected or repaired deterministically.

### 3. Implement command rail v0

Add the bottom-centered command rail with prompt input, preflight display, stop,
edit, and play.

Acceptance:

- Prompt text appears in the rail.
- Candidate keywords/context chips render before send.
- Stop turns preflight into editable text.
- Play sends the edited prompt/context set.

### 4. Split Memory and Recall panels

Memory is turn-facing. Recall is substrate-facing.

Acceptance:

- Memory shows preflight candidates and memory-in-use.
- Recall shows compile/search/show/write/stats controls.
- The two panels can be placed independently.
- The app copy does not imply Recall panel equals the memory system.
- Recall panel MAL loading follows
  [RECALL_PANEL_MAL_READER.md](RECALL_PANEL_MAL_READER.md) instead of inventing a
  second grammar.

### 5. Build Audit v0 operational ledger

Audit should show model and user actions, stripped of chat prose.

Acceptance:

- Agent start/finish/cancel/error rows exist.
- Tool calls/results create compact rows.
- Memory pulls create compact rows.
- Details expand into sanitized JSON.
- Replay/macro promotion ignores observation-only rows.

## P1

### 6. DD state primitive

Create DD state as app-level state, not one-off animation.

Acceptance:

- DD can be awake, asleep, listening, thinking, blocked, and idle.
- Title-bar face reflects state.
- State changes are accessible to panels and command rail.

### 7. Learning start page

Create the start page around learning to build with AI.

Acceptance:

- Tutorials and templates are visible.
- At least one mission exists.
- A mission can reference app surfaces such as Memory, Audit, panels, and DD.

### 8. Rewards and hidden unlock schema

Define unlock data before implementing a large wardrobe.

Acceptance:

- Explicit achievements and hidden unlocks share a schema.
- Unlocks can grant cosmetics.
- Unlocks cannot gate critical IDE functionality.
- Time-window and seasonal conditions are representable.

### 9. DD printable accessory direction

Define the path from digital cosmetic to future printable asset.

Acceptance:

- Cosmetic metadata can reference future STL/export data.
- Docs explain what is planned and what is not in Beta 0.1.
- Printable accessories are framed as future output, not current promise.

### 10. File explorer blast-radius teaser

Implement the first red/yellow/green explorer state.

Acceptance:

- Green means changed and currently good.
- Yellow means warning/risk.
- Red means broken/failing.
- The model is workspace-scoped.
- The state can later be fed by Lattice or tests.

## P2

### 11. Panel targeting and hotkeys

Number panels from top-to-bottom, left-to-right with the center-first rule.

Acceptance:

- Holding a modifier can reveal panel numbers.
- Alt+number focuses a panel.
- Agent prompts can target a panel id.

### 12. Kneeboard compact guidance

Create a compact mission/context panel for current work.

Acceptance:

- Shows current mission, constraints, and next action.
- Does not duplicate chat prose.
- Can reference Memory/Audit/Panel targets.

### 13. ACP interagent routing design

Use the real Agent Client Protocol as AIDDE's client/agent integration boundary.

Acceptance:

- `docs/ACP_REAL_PROTOCOL.md` identifies AIDDE as the ACP client and agents as
  ACP agents.
- Stdio transport, JSON-RPC lifecycle, initialization, session setup, prompt
  turns, updates, tool calls, permissions, file methods, terminal methods, MCP
  handoff, cancellation, and extension rules are specified.
- The advanced panel is framed as `ACP Runtime`, not a substitute protocol.
- Interagent work is framed as supervised peer-to-peer across real ACP sessions.
- ACP Runtime includes a peer graph view for session-to-session edges.
- ACP Runtime supports import/export of agent profiles, session templates, peer
  graph templates, sanitized traces, and permission policy.
- ACP Runtime can discover/import agent profiles from installed desktop apps and
  CLIs as disabled candidates.
- Attaching an agent to a chat panel creates/resumes the ACP session and
  populates MCP Runtime and Skills Runtime for that focused agent.
- Each attached agent chat panel creates a stable agent tab in MCP Runtime and
  Skills Runtime.
- `hold Tab + number` selects the matching agent tab across open runtime
  panels.
- ACP and MCP are documented as different primitives: client/agent protocol
  versus tool/data-server protocol.

### 14. MCP integration surface design

Expose MCP as tool capability, integration state, and runtime control.

Acceptance:

- Settings/Integrations shows connected MCP servers and health.
- MCP Runtime panel shows live servers, tools, resources, calls, failures, and
  permissions.
- Users can enable/disable MCP servers and tools.
- Users can enable/disable MCP access for a panel or ACP session.
- MCP Runtime supports import/export of server definitions, tool schemas,
  allow-deny policy, health snapshots, and sanitized call traces.
- MCP Runtime can discover/import MCP server definitions from installed desktop
  apps and CLIs as disabled candidates.
- MCP Runtime can follow the focused agent chat panel and show only that
  agent/session's available, enabled, disabled, and policy-denied MCP
  capabilities.
- MCP Runtime shows one tab per attached agent chat panel.
- Panel permissions can allow or deny MCP-backed tools.
- Audit rows capture MCP tool calls and failures.
- MCP and ACP responsibilities are documented as separate.

### 15. Skills runtime surface design

Expose Skills as instruction packs and workflow playbooks that can be monitored,
enabled, disabled, pinned, and audited.

Acceptance:

- Skills Runtime panel shows installed, enabled, suggested, active, pinned,
  conflicting, and failed skills.
- Users can enable/disable skills globally, per workspace, per panel, per ACP
  session, and per prompt.
- Skills Runtime supports import/export of skill packs, skill policy, pins,
  hashes, and activation traces.
- Skills Runtime can discover/import skill directories and instruction packs
  from installed desktop apps, CLIs, and editor extensions as untrusted
  candidates.
- Skills Runtime can follow the focused agent chat panel and show only that
  agent/session's available, enabled, disabled, pinned, suggested, and
  policy-denied skills.
- Skills Runtime shows one tab per attached agent chat panel.
- Command rail shows active/suggested skill chips before send.
- Skill activation traces explain why a skill matched and which instruction
  files were read.
- Audit rows capture skill activation, policy blocks, and skill file reads.
- Skills, MCP, ACP, and Memory are documented as separate turn inputs.

### 16. Runtime import/export contract

Define shared import/export rules for ACP Runtime, MCP Runtime, and Skills
Runtime.

Acceptance:

- Export manifests include schema id, app version, scope, redaction level,
  runtime surfaces, hashes, and compatibility notes.
- Import supports dry-run, diff preview, conflict detection, scoped target,
  disabled-by-default mode, rollback, and Audit rows.
- Import supports desktop-app discovery adapters with source paths, confidence,
  redaction rules, and secret remapping.
- Raw secrets are never exported.
- ACP, MCP, and Skills each define their own exportable payloads and forbidden
  payloads.
