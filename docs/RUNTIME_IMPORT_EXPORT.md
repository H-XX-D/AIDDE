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

## Desktop app discovery

Import should not only mean "open an AIDDE export bundle."

AIDDE should discover and import runtime configuration from installed desktop
apps and CLIs the user already uses. This makes AIDDE a control surface over the
existing agent/tool ecosystem instead of forcing users to rebuild everything by
hand.

Discovery sources should include, when present:

- app support directories,
- user config directories,
- project-local config files,
- command-line config,
- extension/plugin manifests,
- MCP server config files,
- skill directories,
- agent adapter profiles,
- OS keychain/secure-store references.

Desktop app imports must be adapter-based. Each adapter should describe:

- app name,
- supported versions,
- config search paths,
- files it can read,
- fields it can extract,
- fields it must redact,
- how secrets are referenced,
- confidence of each detected item,
- whether the source is global, workspace, or project-local.

The import UI should show:

- source app,
- discovered items,
- source path,
- confidence,
- conflicts,
- secrets requiring remap,
- what will be enabled or disabled,
- what will be copied versus referenced.

Imports from desktop apps should default to disabled/untrusted until reviewed.

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
- desktop app profile,
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
- imported desktop app profiles are disabled until reviewed,
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
