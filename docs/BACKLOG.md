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
