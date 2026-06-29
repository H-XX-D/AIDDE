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
   - ACP interagent request routing,
   - MCP tool/server registry.

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
   - ACP request lifecycle rows.

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
Recall, Audit, Browser, SSH, Todo, Console, and future tools.

## Memory split

Recall is the durable memory system. Memory is the turn-facing UX.

This split matters:

- Recall shows graph/substrate state.
- Memory shows what will be used or was used in the current agent turn.
- MAL handles connect the two without forcing every user to inspect raw graph
  details.

The Recall panel's MAL reader is intentionally narrow. See
[RECALL_PANEL_MAL_READER.md](RECALL_PANEL_MAL_READER.md).

## ACP interagent work

AIDDE should use ACP for bounded agent-to-agent work where a request has source,
target, action, scope, status, and audit trail. ACP is not the chat surface and
not a way to bypass permissions. See [ACP_INTERAGENT.md](ACP_INTERAGENT.md).

## MCP integrations

AIDDE should support MCP as an integration/tool capability surface. MCP does not
need a default workspace panel; it belongs first in Settings/Integrations,
permissions, and Audit. See [MCP_INTEGRATION.md](MCP_INTEGRATION.md).
