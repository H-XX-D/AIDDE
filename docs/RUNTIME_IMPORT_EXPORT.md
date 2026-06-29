# Runtime Import and Export

ACP Runtime, MCP Runtime, and Skills Runtime all need import/export.

The shared goal is reproducibility without leaking secrets or pretending live
process state can be replayed exactly.

## Shared rules

Every runtime export should include:

- export schema id,
- app version,
- created time,
- workspace id/name,
- source machine label, if user-approved,
- redaction policy,
- included scopes,
- included runtime surfaces,
- content hashes,
- optional signature,
- compatibility notes.

Every runtime import should support:

- dry run,
- diff preview,
- scoped import target,
- conflict detection,
- policy review,
- disabled-by-default option,
- rollback entry,
- Audit row.

## Secrets

No runtime export should contain raw secrets.

Secrets should export as references:

- env var name,
- keychain item label,
- secure-store handle,
- user-provided placeholder,
- required-but-missing marker.

On import, AIDDE should show unresolved secret references and keep affected
servers, skills, or sessions disabled until the user resolves them.

## Scopes

Import/export should support these scopes:

- global,
- workspace,
- panel,
- ACP session,
- MCP server,
- MCP tool,
- skill,
- prompt/turn trace.

## Bundle shape

Use a directory or zip bundle with a manifest:

```text
aidde-runtime-export/
  manifest.json
  policies/
  runtime/
  traces/
  assets/
  README.md
```

Machine-readable files should be JSON or JSONL. Large traces should be JSONL.
Human-readable summaries should be Markdown.

## Redaction

Export should support three levels:

- summary: names, ids, status, counts, and policy only,
- sanitized: schemas, traces, and paths with sensitive values removed,
- full local: includes local paths and richer traces, still no raw secrets.

## Import safety

Imported runtime objects should not become active silently.

Default behavior:

- imported MCP servers are disabled until reviewed,
- imported skills are untrusted until reviewed,
- imported ACP peer graphs are templates until launched,
- imported traces are read-only,
- imported policies require explicit apply.

## Audit

Every import/export creates Audit rows:

- `runtimeExportStarted`
- `runtimeExportCompleted`
- `runtimeExportFailed`
- `runtimeImportStarted`
- `runtimeImportDryRunCompleted`
- `runtimeImportApplied`
- `runtimeImportFailed`

Expanded details should show the manifest, scope, redaction level, conflicts,
and policy changes.
