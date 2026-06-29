# ACP Runtime and Interagent Orchestration

AIDDE should integrate the real Agent Client Protocol first.

The old framing of ACP as a private AIDDE/Recall request queue is not the
implementation contract. The implementation contract is documented in
[ACP_REAL_PROTOCOL.md](ACP_REAL_PROTOCOL.md).

This file now describes the AIDDE layer on top of real ACP.

## Product position

ACP gives AIDDE the standard client/agent boundary:

```text
AIDDE client/editor/runtime <-> ACP agent process
```

That is the important integration. Once that works, AIDDE can orchestrate
multiple ACP sessions, but it should not confuse orchestration with the protocol
itself.

## What the ACP panel is

The panel should be named `ACP Runtime` or `Agent Runtime`, not `ACP Queue`.

It is an advanced inspector for real ACP state:

- agent connections,
- negotiated capabilities,
- sessions,
- prompt turns,
- streamed updates,
- tool calls,
- permission requests,
- file requests,
- terminal requests,
- cancellations,
- errors,
- raw JSON-RPC messages.

The default workspace should not require this panel. Normal users should see ACP
through chat panels, command rail status, Audit rows, panel badges, and
permission prompts.

## Runtime lanes

When visible, the panel can group live state by lane:

- Connections
- Sessions
- Turns
- Tool Calls
- Permissions
- Terminals
- Errors

This is more accurate than a generic queue because ACP is session-oriented and
bidirectional.

## Row anatomy

Each visible row should be compact:

```text
running  sess_abc123  panel 4  session/prompt  turn req 17  perm 2
```

Rows should show:

- status,
- session id,
- panel id,
- JSON-RPC method or update type,
- request id when present,
- agent name,
- permission level,
- related Audit row,
- related Memory preflight id,
- timestamp.

The detail drawer should show:

- sanitized JSON-RPC envelope,
- params/result/error,
- capability gates,
- source and target panel,
- file paths or terminal ids touched,
- cancellation state,
- related Audit rows,
- related Recall/Memory handles.

## Panel badges

ACP state should be visible on the panels that matter:

- source chat panel shows active prompt turn,
- editor/file panel shows read/write requests,
- terminal panel shows terminal-owned requests,
- target panel shows incoming result routing,
- command rail shows active stop/cancel state.

Audit remains the source of truth. The ACP Runtime panel is the expanded view of
the same events.

## Peer-to-peer orchestration

The desired UX is peer-to-peer: one agent can hand bounded work to another agent
and the user can see the edge between them.

AIDDE should implement this as a supervised peer graph:

```text
session A result or request
  -> AIDDE Audit + Memory
  -> user or policy selects session B
  -> AIDDE sends session/prompt to B
  -> B streams ACP updates
  -> result routes back to the selected panel
```

This makes agents behave like peers while keeping the traffic observable and
cancellable. AIDDE should not hide the handoff inside either chat transcript.

## Peer graph view

The ACP Runtime panel should have a peer graph mode.

Nodes:

- ACP sessions,
- agent processes,
- panels,
- MCP-backed tool servers when relevant,
- Memory/Recall context packets.

Edges:

- prompt handoff,
- review request,
- test request,
- file inspection request,
- Memory compile/search request,
- result return,
- cancellation,
- permission decision.

Each edge should show:

- source session,
- target session,
- source panel,
- target panel,
- action,
- scope,
- permission level,
- state,
- token/usage summary when available,
- related Audit rows,
- related Memory handles.

Clicking an edge opens the full protocol trace: prompt sent, updates streamed,
tool calls, permissions, files, terminals, result, and stop reason.

## Monitoring rules

Peer-to-peer does not mean invisible.

- Every peer edge gets a correlation id.
- Every edge is visible in Audit.
- Every edge can be cancelled if still active.
- Every permission request resolves through AIDDE.
- Every file or terminal touch is still owned by AIDDE.
- Memory preflight and memory-in-use are attached to the edge.
- Results route to an explicit panel or session.

If direct peer transports are ever enabled, they must mirror this same trace
back to AIDDE before they are considered trusted.

## Import and export

ACP Runtime needs import/export for reproducible agent setups and peer graphs.
Use the shared rules in [RUNTIME_IMPORT_EXPORT.md](RUNTIME_IMPORT_EXPORT.md).

ACP import should also discover agent profiles and adapters from desktop apps
and CLIs already installed on the user's machine. AIDDE should use those as
candidate ACP-backed sessions while preserving user review and policy gates.

ACP export should include:

- agent adapter profiles,
- negotiated capability snapshots,
- session templates,
- peer graph templates,
- permission policy,
- prompt/turn traces,
- sanitized JSON-RPC envelopes,
- stop reasons,
- related Audit row ids,
- related Memory handles.

ACP export must not include:

- live process ids as replayable state,
- raw secrets,
- unsanitized terminal output,
- unsanitized file contents,
- hidden peer channels.

ACP import should support:

- dry-run compatibility checks,
- importing from detected desktop app profiles,
- importing agent profiles as disabled,
- importing peer graphs as templates,
- importing traces as read-only evidence,
- mapping old panel ids to current panels,
- refusing unknown extensions unless the user explicitly allows them.

## MCP boundary

MCP stays separate.

- ACP is the protocol between AIDDE and an agent.
- MCP is the tool/data-server protocol an agent can use.

AIDDE passes MCP server configs through ACP session setup. AIDDE's Integrations
surface owns MCP configuration and health.

## Beta 0.1 target

The first ACP milestone is not multi-agent autonomy.

The first milestone is:

- one stdio ACP agent process,
- initialize,
- session/new,
- session/prompt,
- session/update rendering,
- tool-call rendering,
- permission request handling,
- file read/write handlers,
- terminal handlers,
- session/cancel,
- Audit rows for every protocol event.

After that, AIDDE can add multi-session orchestration.
