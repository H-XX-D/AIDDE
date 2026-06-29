# Recall Panel MAL Reader Contract

The Recall panel can support MAL netlists without bloating the MAL framing.

This document is not a second grammar. The grammar is already decided upstream
in `/Users/hendrixx./Recallv.5/docs/design/mal-language.md`. The AIDDE reader
implements exactly that contract and nothing more.

## Scope

The reader exists so AIDDE can:

- load a MAL netlist into a Recall-backed store,
- replay a rendered graph,
- verify that render and parse are faithful inverses,
- show line-numbered errors that keep netlists debuggable by sight.

The reader does not define new MAL syntax, new op math, or a second memory
model.

## Reader pipeline

### 1. Grammar is frozen

`mal-language.md` is the source of truth.

The Recall panel reader must not extend the grammar opportunistically. If the
language changes, the change belongs in the upstream MAL language document first.

### 2. Tokenizer

Tokenization is deliberately small:

- split a line on whitespace,
- a quoted `"..."` run is one token,
- `#` outside a quoted token ends the line as a comment,
- comments are ignored after quote-aware tokenization,
- the quoted-string plus comment rule is the only non-trivial lexing.

### 3. Line classifier

Each non-empty line maps to exactly one form.

Precedence:

1. Keyworded forms:
   - `net`
   - `setp`
   - `addf`
2. Top-level assignment:
   - any line with a top-level `=` is a set form.
3. Edge form:
   - a second token like `relation>` or `relation<` is an edge.
4. Cell declaration:
   - a handle followed by a quoted `"title"` is a cell declaration/read form.

If a line can appear to match more than one form, the earlier rule wins. If it
matches none, the reader reports a line-numbered parse error.

### 4. Reuse existing address parsing

Do not reinvent operand parsing.

Operands are:

- handles,
- `field(value)` values,
- dotted/dashed addresses,
- edge-address forms.

The sentence parser should call the existing address parser from Recall
(`address.ts`) for those pieces. The hard part is already done there.

### 5. Typed AST and admission

Parsing yields a typed AST:

```ts
type MalNode =
  | CellDecl
  | Edge
  | Set
  | Schedule
  | Wire;
```

The interpreter applies those nodes against a Store.

Every write routes through `admit()`. The loader is just another author. That is
the point: admission has the same shape no matter who wrote the memory.

### 6. Load semantics

The reader must choose load semantics explicitly. Hidden merge behavior is not
acceptable.

Supported modes:

- `replay`: reconstruct a fresh graph from the netlist.
- `verify`: assert the netlist is equal to the live/rendered graph.
- `merge`: merge into an existing graph.

`replay` and `verify` are the high-value modes. `merge` is risky and should be
gated as an explicit advanced action.

### 7. Round-trip verifier

The honest verifier is a property:

```text
render -> parse -> load -> render
```

The output must be byte-identical to the original render.

If render and parse are inverses, the netlist is a faithful serialization. This
is a property test, not a benchmark.

### 8. Line-numbered errors

Errors carry line numbers, like `halcmd`.

Netlists must stay debuggable by sight. The user should be able to jump from an
error to the exact line and understand whether the failure is lexing,
classification, operand parsing, admission, or verification.

## Non-goals

- No inline formula language.
- No extra expression parser.
- No alternate MAL dialect for AIDDE.
- No silent merge into the live graph.
- No bypass around `admit()`.

## Acceptance checklist

- [ ] Tokenizer handles whitespace, quoted strings, and comments.
- [ ] Classifier maps every non-empty line to exactly one form.
- [ ] Parser emits `CellDecl | Edge | Set | Schedule | Wire`.
- [ ] Operand parsing reuses Recall address parsing.
- [ ] Interpreter routes all writes through `admit()`.
- [ ] Load mode is explicit: `replay`, `verify`, or gated `merge`.
- [ ] Round-trip property test is byte-identical.
- [ ] Errors include line numbers and failure phase.
