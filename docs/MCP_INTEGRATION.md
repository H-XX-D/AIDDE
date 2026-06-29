# MCP Runtime and Integration Surface

MCP should be supported in AIDDE as both configuration and runtime monitoring.

MCP is a tool connector protocol. It tells AIDDE what tools, resources, and
servers are available to agents and panels. It is not itself the user's work
surface.

## Product position

Settings / Integrations owns MCP configuration:

- add/remove servers,
- credentials and environment binding,
- startup mode,
- trusted workspace rules,
- default policy.

The MCP panel owns live runtime control:

- monitor server health,
- monitor tools/resources/prompts exposed by each server,
- enable or disable a server,
- enable or disable a tool,
- enable or disable MCP access for a panel/session,
- inspect last calls and failures,
- see which agent/panel used which MCP capability.

## What MCP should expose

AIDDE should show:

- connected MCP servers,
- available tools,
- tool permissions,
- health/status,
- enabled/disabled state,
- startup state,
- last call time,
- last error,
- which panels/agents can use each server,
- whether a tool is read-only, write-capable, networked, or sensitive.

## MCP Runtime panel

MCP needs an operational panel for the same reason ACP does: users need to see
and control live protocol surfaces while agents are running.

The panel should be named `MCP Runtime` or `Tool Runtime`.

It should group state by:

- Servers
- Tools
- Resources
- Prompts
- Sessions
- Calls
- Failures
- Permissions

Each server row should show:

- server name,
- transport,
- status,
- enabled/disabled,
- connected sessions,
- exposed tools/resources/prompts,
- last call,
- last error,
- trust level.

Each tool row should show:

- tool name,
- server,
- read/write/network/sensitive tags,
- enabled/disabled,
- allowed panels/sessions,
- last caller,
- last result status,
- related Audit row.

The panel needs direct controls:

- start server,
- stop server,
- restart server,
- enable/disable server,
- enable/disable tool,
- allow/deny for current panel,
- allow/deny for selected agent session,
- quarantine server after failure,
- open sanitized call trace,
- copy sanitized schema or call JSON.

Toggles should be fast and visible. If a server or tool is disabled while an
agent is running, future calls fail cleanly through policy and create an Audit
row. Active calls should either complete, be cancelled, or require explicit
confirmation depending on risk.

## Panel badges and command rail

MCP state should also appear where the user is already looking:

- panel title badges show MCP enabled/disabled for that panel,
- agent panels show connected MCP server count,
- command rail shows blocked/unavailable tool chips,
- Audit shows every MCP call and failure,
- ACP Runtime peer edges can show MCP-backed tool use.

The full MCP Runtime panel is the expanded view of those same events.

## Runtime policy

MCP enable/disable is scoped.

AIDDE should support toggles at:

- global server level,
- workspace level,
- panel level,
- ACP session level,
- individual tool level.

The effective policy should be visible before a call runs. A disabled tool
should be visibly disabled in the command rail and should not appear as callable
to agents unless the agent needs to see a policy-denied capability for
explanation/debugging.

## Import and export

MCP Runtime needs import/export for server setups, tool policy, and debugging.
Use the shared rules in [RUNTIME_IMPORT_EXPORT.md](RUNTIME_IMPORT_EXPORT.md).

MCP import should also discover MCP configuration from desktop apps and CLIs the
user already has installed. Examples include agent apps, editors, IDEs, and CLIs
that store MCP server definitions in app support or project config files.

MCP export should include:

- server definitions,
- transport type,
- startup policy,
- enabled/disabled state,
- tool/resource/prompt schemas,
- panel/session allow-deny policy,
- health snapshot,
- sanitized call traces,
- last error summaries,
- related Audit row ids.

MCP export must not include:

- raw env values,
- API keys,
- bearer tokens,
- passwords,
- raw secret-bearing command lines,
- unsanitized tool outputs.

MCP import should support:

- importing servers disabled by default,
- importing from detected desktop app profiles,
- mapping source app config paths to AIDDE server definitions,
- unresolved secret placeholders,
- dry-run schema diff,
- tool allow-deny policy preview,
- per-workspace import,
- per-panel import,
- rollback after apply.

## Difference from ACP

ACP and MCP solve different problems:

- MCP answers: what tools can an agent call?
- ACP answers: which agent/session is doing work, streaming updates, requesting
  permissions, or handing work to another session?

MCP is capability discovery and tool invocation.

ACP is client/agent runtime, prompt turns, permissions, tool-call status,
session cancellation, and supervised peer edges.

Both must be visible in Audit. Neither should bypass panel permissions.

## Beta 0.1 rule

The first MCP slice should prove:

- tool/server registry,
- health/status,
- enable/disable server controls,
- enable/disable tool controls,
- per-panel permission binding,
- audit rows for MCP calls,
- settings/integrations UI,
- MCP Runtime panel.

The first ACP slice should prove:

- real ACP session lifecycle,
- streamed update rendering,
- supervised peer graph,
- cancellation/failure visibility,
- audit lifecycle.

Keep these separate, but let them sit side-by-side in the Runtime view:

- ACP Runtime: who is working and how agent sessions are connected.
- MCP Runtime: what tools/resources are available, enabled, called, or blocked.
