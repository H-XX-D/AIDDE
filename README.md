# AIDDE

Artificial Intelligence Driven Development Environment.

AIDDE is the rewrite home for an agent-native IDE. The goal is not to bolt a
chat box onto an editor. The goal is a development environment where agents,
memory, project structure, audit trails, learning, and human control all live in
the same interface.

Status: beta design and rewrite base. The current working prototype exists in a
separate AIDE development tree. This repository is the clean public home for the
AIDDE rewrite.

## Why AIDDE exists

Most AI coding tools still treat the editor as the center of the product. AIDDE
starts from a different assumption: when agents can read, plan, edit, test,
explain, and recover work, the interface should show what the agents are doing
and give the user fast control over scope.

AIDDE is built around four ideas:

- Agents should be visible. Tool calls, memory pulls, edits, tests, failures,
  and stop points should be inspectable without reading chat prose.
- Context should be operational. Recall/MAL-style memory should show what is
  being used, what is stale, and what the user can stop before it enters a turn.
- Panels should be geometry, not decoration. Every panel is a bounded work
  surface that can carry permissions, focus, routing, state, and agent targets.
- Learning should be part of the product. AIDDE should teach users how to work
  with AI to build real software, not only teach syntax.

## What AIDDE is

AIDDE is planned as a desktop development environment with:

- DD, also known as DeeDee: the small companion face that lives in the window
  frame, sidecar, dock icon, and future collectible system.
- An agent-first panel layout for editor, terminal, console, explorer, recall,
  memory, audit, browser, SSH, todo, kneeboard, and future tools.
- A command rail at the bottom of the app for prompt preflight, memory tokens,
  stop/edit/play, macros, panel targeting, and quick actions.
- A Recall/MAL memory layer that surfaces candidate memory before a model turn
  and shows actual memory used during the turn.
- An audit panel that records condensed model actions: tool calls, edits,
  memory pulls, terminal commands, tests, git operations, and failures.
- A learning system focused on working with AI: prompt iteration, scope control,
  debugging, project structure, review habits, and shipping.
- A DD wardrobe and reward system with unlockable cosmetics, hidden unlocks,
  and future 3D-printable accessories.

## Beta stage

AIDDE is not being presented as finished software. It is in beta design and
rewrite preparation.

What exists now:

- A working AIDE prototype with DD sidecar behavior, panels, AI chat, Recall
  surfaces, audit work, and early layout experiments.
- A product direction: AIDDE as the clean rewrite and public base.
- A concrete UX thesis around visibility, memory preflight, agent action audit,
  panel targeting, and learning.

What this repository contains now:

- Product concept.
- Architecture notes.
- Roadmap.
- Beta expectations.
- DD mascot and reward-system direction.
- Learning-system direction.

Implementation will land here as the rewrite becomes public-ready.

## DD and DeeDee

DD is the companion identity of AIDDE. DD is not just mascot decoration. DD is
the user-facing expression of the runtime:

- the face in the title bar,
- the sidecar that can slide in and out,
- the voice target for "Hey DeeDee",
- the state indicator for wake/sleep/focus behavior,
- the collectible surface for cosmetics, achievements, and 3D-printable swag.

The DD system is intended to make the environment feel alive without hiding
important state. If DD is awake, sleeping, listening, waiting, blocked, or
acting, the UI should make that legible.

## Learning wedge

AIDDE includes a learning path because the biggest shift is not "learn to code."
It is "learn to build with AI without losing control of the work."

The learning system is planned around:

- AI coding habits.
- Prompt and scope discipline.
- Debugging with agents.
- Understanding diffs, tests, git, and blast radius.
- Using memory safely.
- Building projects from templates.
- Short, practical missions that turn into real software.

## Swag, unlocks, and 3D printable DD

AIDDE treats usage and learning as a product surface:

- DD cosmetics unlock through use, milestones, and hidden conditions.
- Some unlocks are obvious achievements.
- Some unlocks are ARG-style discoveries tied to timing, behavior, project
  actions, and seasonal windows.
- Future DD accessories should export as STL or printable files so users can
  physically print and customize their own DD.

This is not required for the IDE to function, but it is part of the product
identity. It makes learning, shipping, and exploration tangible.

## Roadmap

Start here:

- [ROADMAP.md](ROADMAP.md) for the long arc.
- [docs/MVP.md](docs/MVP.md) for the Beta 0.1 vertical slice.
- [docs/BACKLOG.md](docs/BACKLOG.md) for the first task breakdown.
- [docs/DECISIONS.md](docs/DECISIONS.md) for current architecture/product decisions.

## License

This repository is licensed under the Apache License, Version 2.0. See
[LICENSE](LICENSE).

Apache-2.0 covers the code and documentation in this repository. The DD/DeeDee
names and mascot identity may also function as project branding; see
[NOTICE.md](NOTICE.md).
