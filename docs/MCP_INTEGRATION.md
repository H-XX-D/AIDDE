# MCP Integration Surface

MCP should be supported in AIDDE, but MCP does not need its own default panel.

MCP is a tool connector protocol. It tells AIDDE what tools, resources, and
servers are available to agents and panels. It is not itself the user's work
surface.

## Where MCP belongs first

For Beta 0.1, MCP belongs in:

- Settings / Integrations,
- panel permission menus,
- command rail tool availability,
- Audit rows for tool calls,
- optional developer diagnostics.

## What MCP should expose

AIDDE should show:

- connected MCP servers,
- available tools,
- tool permissions,
- health/status,
- last call time,
- last error,
- which panels/agents can use each server,
- whether a tool is read-only, write-capable, networked, or sensitive.

## Does MCP need its own panel?

Not by default.

MCP should become an optional `Integrations` or `Runtime Inspector` panel for
advanced users and developers. That panel is useful when debugging tools,
permissions, or connector failures.

Default users should experience MCP as capability:

```text
this panel can use Recall
this agent can call GitHub
this command can run Playwright
this tool call was audited
```

They should not need to understand MCP just to use AIDDE.

## Difference from ACP

ACP and MCP solve different problems:

- MCP answers: what tools can an agent call?
- ACP answers: what bounded work did one agent ask another agent or manager to
  do?

MCP is capability discovery and tool invocation.

ACP is work coordination, queueing, handoff, and status.

Both must be visible in Audit. Neither should bypass panel permissions.

## Beta 0.1 rule

The first MCP slice should prove:

- tool/server registry,
- health/status,
- per-panel permission binding,
- audit rows for MCP calls,
- settings/integrations UI.

The first ACP slice should prove:

- source/target request metadata,
- exchange/queue/handoff modes,
- audit lifecycle,
- cancellation/failure visibility.

Keep these separate. Do not turn AIDDE into a protocol dashboard by default.

