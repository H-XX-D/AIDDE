# Real ACP Integration Contract

AIDDE should integrate the real Agent Client Protocol, not a private queue that
only resembles it.

ACP is a client/agent protocol. AIDDE is the client/editor/runtime. Claude,
Codex, Gemini CLI, or any other compatible process is an ACP agent. The boundary
is a bidirectional JSON-RPC connection.

References:

- https://agentclientprotocol.com/protocol/v1/overview
- https://agentclientprotocol.com/protocol/v1/initialization
- https://agentclientprotocol.com/protocol/v1/session-setup
- https://agentclientprotocol.com/protocol/v1/prompt-turn
- https://agentclientprotocol.com/protocol/v1/tool-calls
- https://agentclientprotocol.com/protocol/v1/file-system
- https://agentclientprotocol.com/protocol/v1/terminals
- https://agentclientprotocol.com/protocol/v1/transports
- https://agentclientprotocol.com/libraries/typescript

Implementation package:

- `@agentclientprotocol/sdk`
- observed npm version on 2026-06-29: `1.1.0`

## Roles

### AIDDE as ACP Client

AIDDE owns:

- the visible UI,
- panel geometry,
- workspace roots,
- unsaved editor buffers,
- permissions,
- file access,
- terminal execution,
- MCP server configuration,
- Audit,
- Memory preflight display,
- stop/cancel controls.

### ACP Agent

The agent owns:

- LLM orchestration,
- prompt processing,
- tool-call planning,
- progress updates,
- requests for permission,
- requests to read/write files through the client,
- requests to run or inspect terminals through the client,
- final stop reason for each prompt turn.

## Transport

Beta should start with ACP stdio.

In stdio mode:

- AIDDE launches the agent as a subprocess.
- AIDDE writes newline-delimited JSON-RPC messages to the agent's stdin.
- The agent writes newline-delimited JSON-RPC messages to stdout.
- messages must not contain embedded newlines.
- stdout must contain only valid ACP messages.
- stderr is logs only.

Streamable HTTP is a draft proposal and custom transports are possible, but
stdio is the clean Beta target because it matches desktop IDE behavior and keeps
permissions local.

## Core lifecycle

```text
AIDDE starts agent process
  -> initialize
  -> authenticate, only if required
  -> session/new or session/load or session/resume
  -> session/prompt
  -> session/update notifications stream back
  -> agent may call AIDDE client methods
  -> session/prompt returns stopReason
```

## Initialization

AIDDE begins every connection with `initialize`.

AIDDE sends:

- protocol version,
- client capabilities,
- client name/version.

The agent returns:

- negotiated protocol version,
- agent capabilities,
- agent name/version,
- auth methods.

Important AIDDE rule: omitted capabilities are unsupported. Do not call optional
methods unless the other side advertised the capability.

## Sessions

AIDDE creates one ACP session per agent thread/panel target.

`session/new` sends:

- `cwd`,
- optional `additionalDirectories`, only when the agent advertises support,
- MCP servers the agent should connect to.

The agent returns a `sessionId`. AIDDE stores that id on the panel/session model.
All later prompt, cancel, mode, config, load, resume, and close operations use
that `sessionId`.

## Prompt turns

The command rail and chat input eventually become `session/prompt`.

The prompt payload is a list of content blocks. Baseline text is required.
Images, audio, and embedded context must only be sent when the agent advertises
the matching prompt capability.

AIDDE Memory preflight should happen before this call:

```text
user text
  -> Memory preflight candidates shown under the user's draft
  -> user can stop/edit
  -> selected context becomes prompt content or _meta
  -> session/prompt is sent
```

Once `session/prompt` is in flight, the agent reports progress through
`session/update` notifications:

- user message chunks during replay,
- agent message chunks,
- thought chunks if supplied,
- plan updates,
- tool calls,
- tool call updates,
- usage updates,
- mode/config updates.

The prompt turn ends only when the agent responds to the original
`session/prompt` request with a stop reason such as `end_turn`, `max_tokens`,
`max_turn_requests`, `refusal`, or `cancelled`.

## Tool calls

ACP tool calls are not AIDDE tools directly. They are status objects the agent
reports so AIDDE can display what the agent is doing.

A tool call includes:

- `toolCallId`,
- title,
- kind,
- status,
- content,
- locations,
- raw input/output when available.

AIDDE should map these into:

- Audit rows,
- status bar chips,
- panel badges,
- file explorer blast-radius hints,
- expandable raw JSON.

## Permissions

When the agent needs user approval, it calls AIDDE with
`session/request_permission`.

AIDDE answers with the selected option:

- allow once,
- allow always,
- reject once,
- cancelled,
- or another option provided by the agent.

AIDDE panel permission levels should compile down to this decision point. A high
permission panel may auto-approve bounded low-risk operations. A low permission
panel must force explicit user approval.

## File system methods

If AIDDE advertises `fs.readTextFile`, the agent may call `fs/read_text_file`.
If AIDDE advertises `fs.writeTextFile`, the agent may call
`fs/write_text_file`.

AIDDE must implement those methods against the editor model, not just disk:

- absolute paths only,
- unsaved buffer state wins over stale disk state,
- writes update the editor/buffer layer,
- Audit records reads and writes,
- workspace roots and panel permissions bound the operation.

## Terminal methods

If AIDDE advertises `terminal`, the agent may call:

- `terminal/create`,
- `terminal/output`,
- `terminal/wait_for_exit`,
- `terminal/release`,
- `terminal/kill`.

AIDDE owns the process. The agent gets terminal ids and output through protocol
methods. Terminal output can also be embedded in tool-call content for live UI.

## Cancellation

AIDDE needs two cancellation paths:

- `session/cancel` for the active prompt turn,
- JSON-RPC `$/cancel_request` for request-level cancellation when supported.

When the user hits stop, AIDDE should:

- mark unfinished tool calls as cancelled in UI,
- answer pending permission requests with `cancelled`,
- send `session/cancel`,
- expect the prompt response to return stop reason `cancelled`.

## MCP through ACP

MCP is not the same thing as ACP.

ACP is the client/agent control protocol. MCP is how the agent connects to tool
servers and data sources.

AIDDE passes MCP server configs to the agent in `session/new`, `session/load`,
or `session/resume`. AIDDE's Integrations UI owns those configs, health checks,
and permission policy.

MCP secrets must come from the OS or AIDDE secure store. They should not be
logged into Audit as raw environment values.

## AIDDE panel mapping

Each ACP-backed agent panel should store:

- agent id/name/version,
- transport kind,
- process id when local,
- negotiated protocol version,
- agent capabilities,
- client capabilities used,
- `sessionId`,
- `cwd`,
- additional roots,
- configured MCP servers,
- active prompt request id,
- current tool calls,
- current permission request,
- current mode/config options,
- related Audit rows,
- related Memory preflight ids.

## Interagent work

Real ACP does not directly define agent-to-agent messaging.

For AIDDE, interagent work should be mediated by the client:

```text
agent/session A produces a bounded request
  -> AIDDE records it in Audit/Memory
  -> AIDDE chooses or asks for target agent/session B
  -> AIDDE sends session/prompt to B with explicit context
  -> B streams real ACP updates back
```

If AIDDE needs custom routing, use ACP extensions only after capability
advertisement:

- custom data goes in `_meta`,
- custom JSON-RPC methods must begin with `_`,
- unrecognized custom requests must fail cleanly with method-not-found.

Do not invent root-level fields in ACP objects.

## Beta implementation slice

The first real integration should prove:

1. install `@agentclientprotocol/sdk`,
2. launch one example ACP agent over stdio,
3. send `initialize`,
4. create `session/new`,
5. send `session/prompt`,
6. render `session/update` message chunks,
7. render tool calls and tool-call updates,
8. handle `session/request_permission`,
9. implement `fs/read_text_file`,
10. implement `fs/write_text_file`,
11. implement basic terminal create/output/wait/kill,
12. wire stop to `session/cancel`,
13. write every protocol event to Audit,
14. expose session/capability state in an advanced ACP Runtime panel.

That is enough to make AIDDE a real ACP client.
