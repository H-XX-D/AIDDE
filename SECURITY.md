# Security

AIDDE is beta-stage and should be treated as experimental until release builds
and security boundaries are documented.

## Reporting

Do not open public issues for secrets, credential leaks, or exploitable
vulnerabilities. Contact the maintainer privately first.

## Design expectations

AIDDE should treat these as core security concerns:

- model tool calls,
- filesystem access,
- terminal commands,
- git operations,
- memory retrieval,
- prompt preflight,
- panel permissions,
- scope boundaries,
- local secrets.

The product direction is to make agent actions observable and stoppable, not to
ask users to blindly trust model output.

