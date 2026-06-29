# Decisions

## 0001: AIDDE is the clean rewrite home

The current AIDE prototype remains useful for UX learning and experiments. AIDDE
is the public rewrite home.

Reason:

- the prototype tree contains churn and private development debris,
- the rewrite needs clean architecture,
- the public repo should communicate product direction clearly.

## 0002: Bounded primitives before full integration

AIDDE should borrow bounded primitives from Recall, Lattice, Solver, Checker,
Codex, Claude, and related systems. It should not integrate the full capability
breadth at Beta 0.1.

Reason:

- broad capability increases safety and UX risk,
- the core product is observability and control,
- users need a stable interface before advanced orchestration.

## 0003: Memory and Recall are separate surfaces

Recall is the durable substrate. Memory is the prompt-facing UX.

Reason:

- users need to see candidate context before a model turn,
- users need to see actual context used during a turn,
- raw substrate controls should not crowd the day-to-day memory surface.

## 0004: Audit records actions, not chat prose

Audit should be an operational ledger.

Reason:

- chat is for conversation,
- Audit is for what actually happened,
- action rows can power macros, replay, review, and safety checks.

## 0005: DD is product state, not decoration

DD/DeeDee is the visible state surface for AIDDE.

Reason:

- the face gives app state a natural place to live,
- companion behavior is core to the product identity,
- rewards and physical collectibles make learning and usage tangible.

## 0006: Recall panel MAL reader does not extend the language

The Recall panel may load, replay, and verify MAL netlists, but it implements the
grammar already decided in `/Users/hendrixx./Recallv.5/docs/design/mal-language.md`.
It does not add a second AIDDE-specific MAL dialect.

Reason:

- MAL remains the memory abstraction layer, not a panel-specific feature blob,
- the reader can stay small and debuggable,
- all writes still route through `admit()`,
- replay/verify round-trip tests give a real correctness property.
