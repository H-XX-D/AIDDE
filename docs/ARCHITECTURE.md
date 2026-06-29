# Architecture Direction

This is a public rewrite direction, not a frozen implementation.

## Runtime layers

1. Shell
   - desktop app runtime,
   - DD window/title behavior,
   - app frame,
   - layout persistence.

2. Panel system
   - typed panels,
   - geometric bounds,
   - center and sidebar parity,
   - panel permissions,
   - panel targeting.

3. Command rail
   - prompt input,
   - preflight keywords,
   - stop/edit/play,
   - macro execution,
   - panel routing.

4. Agent bridge
   - Codex,
   - Claude,
   - future model/provider adapters,
   - stream events,
   - tool-call action events,
   - real ACP client integration,
   - supervised peer-to-peer agent graph,
   - MCP tool/server registry,
   - Skills runtime registry.

5. Memory layer
   - Memory panel for day-to-day context,
   - Recall panel for substrate inspection,
   - MAL handles for stable references,
   - memory-in-use display,
   - MAL netlist reader contract for replay/verify flows.

6. Observability layer
   - Audit panel,
   - condensed model actions,
   - file/git/test/terminal ledger,
   - expandable sanitized details,
   - ACP JSON-RPC lifecycle rows.

7. Learning and reward layer
   - start page,
   - tutorials,
   - missions,
   - kneeboard,
   - DD wardrobe,
   - hidden unlocks,
   - 3D printable accessories.

## Panel primitive

A panel is a rectangle with:

- bounds,
- type,
- title,
- permissions,
- focus state,
- routing identity,
- optional agent binding,
- optional memory context.

The same primitive should power editor, chat, terminal, explorer, Memory,
Recall, Audit, Browser, SSH, Todo, Console, ACP Runtime, MCP Runtime, Skills
Runtime, and future tools.

## Memory split

Recall is the durable memory system. Memory is the turn-facing UX.

This split matters:

- Recall shows graph/substrate state.
- Memory shows what will be used or was used in the current agent turn.
- MAL handles connect the two without forcing every user to inspect raw graph
  details.

The Recall panel's MAL reader is intentionally narrow. See
[RECALL_PANEL_MAL_READER.md](RECALL_PANEL_MAL_READER.md).

## ACP runtime

AIDDE should integrate the real Agent Client Protocol as a client/editor/runtime.
The first milestone is one ACP agent over stdio with initialization, session
setup, prompt turns, streamed updates, permission requests, file access,
terminal access, cancellation, and Audit visibility.

Interagent work should feel peer-to-peer to the user, but it is supervised by
AIDDE so every handoff, result, permission, file touch, terminal touch, and
cancel remains observable. See [ACP_REAL_PROTOCOL.md](ACP_REAL_PROTOCOL.md) and
[ACP_INTERAGENT.md](ACP_INTERAGENT.md).

Agent chat panels are the primary attachment point for ACP sessions. When an
agent is attached to a chat panel, AIDDE should populate MCP Runtime and Skills
Runtime from that agent's discovered/imported capabilities and let those panels
follow the focused agent by default.

## MCP integrations

AIDDE should support MCP as both an integration/tool capability surface and a
live runtime monitor. Settings owns server configuration; the MCP Runtime panel
owns live health, calls, failures, and enable/disable controls for servers,
tools, panels, and sessions. See [MCP_INTEGRATION.md](MCP_INTEGRATION.md).

## Skills runtime

AIDDE should support Skills as visible instruction packs and workflow playbooks,
not invisible prompt magic. The Skills Runtime panel owns installed/enabled
skills, activation traces, per-workspace/panel/session policy, pinned skills,
conflicts, and Audit links. See [SKILLS_RUNTIME.md](SKILLS_RUNTIME.md).

## Runtime import/export

ACP Runtime, MCP Runtime, and Skills Runtime all need import/export. Shared
rules live in [RUNTIME_IMPORT_EXPORT.md](RUNTIME_IMPORT_EXPORT.md): dry runs,
diff preview, scoped imports, conflict detection, redaction, no raw secrets,
rollback, and Audit rows. Import also needs desktop-app discovery adapters so
AIDDE can pull existing ACP/MCP/Skills config from installed apps and CLIs
instead of forcing users to rebuild their setup manually.
