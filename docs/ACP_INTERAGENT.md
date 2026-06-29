# ACP Interagent Work Contract

Yes: AIDDE should use ACP for interagent work.

But ACP should be a bounded work protocol, not freeform agent chat. AIDDE should
use it when one agent needs another agent or manager to perform a scoped runtime
task and return an auditable result.

## What ACP is

ACP is the Agent Communication Protocol already present in Recall.

Recall's current ACP surface is:

- durable request queue,
- request status,
- request list/show,
- queued processing,
- one-shot exchange,
- bounded actions such as status, search, compile, write, maintenance, tick,
  daemon run, and operate once.

The existing request shape is:

```ts
interface AcpRequest {
  id: string;
  channel: string;
  fromAgent: string;
  toAgent: string;
  action: AcpRequestAction;
  payload: Record<string, unknown>;
  status: "queued" | "processing" | "completed" | "failed";
  response: Record<string, unknown> | null;
  error: string | null;
  createdAt: string;
  updatedAt: string;
  processedAt: string | null;
}
```

AIDDE should reuse that shape and add AIDDE-specific metadata around it, not
replace it.

## What AIDDE adds

AIDDE should wrap ACP requests with:

- source panel id,
- target panel id,
- workspace id,
- permission level,
- requested capability,
- visible scope,
- related Memory handles,
- related Audit row ids,
- optional user approval requirement.

That makes ACP legible in the UI:

- Memory shows what context the request can use.
- Audit shows the request, action, result, failure, and writes.
- Panels show where the request came from and where the result lands.
- Permissions determine whether the request can run now, queue, or require
  approval.

## When to use ACP

Use ACP for:

- asking a graph/memory manager to compile or search context,
- asking a worker agent to inspect a bounded file set,
- asking a test agent to run or summarize a specific check,
- asking a review agent to inspect a diff,
- queuing background maintenance,
- routing a bounded task to a panel-bound agent,
- handing off a task while preserving status and auditability.

Do not use ACP for:

- ordinary chat between the user and an assistant,
- unbounded autonomous execution,
- bypassing panel permissions,
- hiding tool calls from Audit,
- sending secrets through normal memory,
- writing directly to Recall without admission.

## AIDDE flow

```text
user or agent intent
  -> panel target + permission check
  -> Memory context packet
  -> ACP request
  -> queue or exchange
  -> worker/manager action
  -> admission for writes
  -> Audit row
  -> panel result
```

## Modes

### Exchange

Use exchange for short, interactive work where the user is waiting.

Examples:

- "compile memory for this prompt",
- "search Recall for this project term",
- "summarize the current diff risk".

### Queue

Use queue for work that can run in the background.

Examples:

- maintenance,
- long review,
- test sweep,
- workspace indexing,
- scheduled Recall tick/daemon work.

### Handoff

Use handoff when an agent owns follow-up work and another agent should resume it
later with status, scope, and evidence.

Handoff should create both:

- an ACP request,
- a Recall handoff/checkpoint cell when the result is durable.

## Safety rules

- Every ACP request has a source and target.
- Every request has a bounded action.
- Every request has visible scope.
- Every request is visible in Audit.
- Any write goes through `admit()`.
- Background ACP work cannot silently raise its own permission level.
- Queue draining is rate-limited and cancellable.
- Failed requests stay inspectable.

## Panel integration

Panels can participate in ACP in three ways:

1. Source panel
   - where the request was made.
2. Target panel
   - where the result should render.
3. Worker panel
   - the agent/session responsible for processing.

This gives AIDDE a clean way to say:

```text
agent in panel 3 asks memory-manager to compile context for panel 1
```

without relying on screen scraping or invisible global state.

## Does ACP need its own panel?

Not as a default Beta 0.1 panel.

ACP should first appear through:

- Audit rows,
- source/target panel badges,
- Memory/Recall status when the request is memory-related,
- command rail status for active queued/exchange work.

An advanced `ACP Queue` or `Agent Queue` panel is useful later for users running
multi-agent work. That panel should show:

- queued requests,
- processing requests,
- completed/failed requests,
- source and target panel ids,
- action and bounded scope,
- cancel/retry controls,
- links to Audit rows and Recall cells.

The rule: ACP is visible everywhere it matters, but it should not become another
default workspace panel until the user turns on advanced multi-agent controls.

## Audit integration

ACP needs compact audit rows:

- `acpRequestQueued`
- `acpRequestStarted`
- `acpRequestCompleted`
- `acpRequestFailed`
- `acpWriteAdmitted`

Expanded details should show sanitized request metadata, action, payload summary,
response summary, and related Recall/Audit ids.

## Beta 0.1 position

For Beta 0.1, AIDDE should not build a large multi-agent operating system.

The first ACP slice should prove:

- request shape,
- panel metadata,
- permission check,
- Memory/Recall action,
- Audit visibility,
- queued vs exchange mode,
- cancellation/failure visibility.

That is enough to make interagent work real without turning AIDDE into an
unbounded autonomous runtime.
