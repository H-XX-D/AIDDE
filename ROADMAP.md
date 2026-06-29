# AIDDE Roadmap

This roadmap describes the public rewrite direction. The prototype work happens
in AIDE; the clean architecture lands here as AIDDE.

## Phase 0: public base

- Publish the AIDDE concept and Apache-2.0 repo.
- Document the product thesis, beta status, and rewrite plan.
- Keep the repo clean, readable, and free of private prototype debris.

## Phase 1: shell and panel geometry

- Build the app shell.
- Define the DD title-bar face and window-state behavior.
- Implement the panel primitive as bounded geometry.
- Support center panels, sidebars, panel type switching, panel persistence, and
  swap/move behavior.
- Add layout save/restore as a core feature, not a later preference.

## Phase 2: command rail and targeting

- Move the command input to the center bottom of the app frame.
- Add stop/edit/play behavior for prompt preflight.
- Add panel targeting by number, title-bar focus, and crosshair/routing actions.
- Add command macros that can target panes, agents, and workflows.

## Phase 3: Memory and Recall/MAL

- Split Memory from Recall:
  - Memory: prompt-facing context, memory-in-use, preflight, and day-to-day
    retrieval.
  - Recall: substrate inspection, graph state, stats, compile/search/show/write.
- Show memory candidates near the user prompt before model execution.
- Show actual pulled memory during the turn.
- Allow stop/edit/replay of preflight keyword sets before the prompt is sent.
- Integrate MAL handles so memory and panel transitions have stable references.

## Phase 4: audit and observability

- Make the Audit panel a condensed operational ledger.
- Record model actions without chat prose:
  - tool calls,
  - file reads/writes,
  - terminal commands,
  - tests,
  - git actions,
  - memory pulls,
  - failures,
  - cancels.
- Keep rows compact by default with expandable sanitized details.
- Use audit data as the base for macros and replayable workflows.

## Phase 5: agent workflow and safety

- Add per-panel permissions.
- Add visible scope and workspace boundaries.
- Add blast-radius awareness from Lattice-style structural analysis.
- Add git/bodyguard checks for etiquette, risky edits, secrets, and broken
  states.
- Add explicit "what will be touched" previews before higher-risk actions.

## Phase 6: learning system

- Add the AIDDE start page:
  - tutorials,
  - project templates,
  - community links,
  - news,
  - pinned favorites,
  - learning missions.
- Teach AI coding as the wedge:
  - prompt iteration,
  - scope control,
  - debugging,
  - reading diffs,
  - using tests,
  - reviewing agent actions,
  - recovering from mistakes.
- Add kneeboard-style compact guidance for current mission/context.

## Phase 7: DD rewards, wardrobe, and ARG unlocks

- Add DD cosmetic slots.
- Add achievement-triggered unlocks.
- Add hidden unlock rules that are discovered through use.
- Add time-window and seasonal unlocks.
- Add future STL/export pipeline for 3D-printable DD accessories.
- Keep the unlock system playful, but never let it hide critical safety state.

## Phase 8: integrations

- Tighten Codex and Claude integration.
- Support bring-your-own subscription/API keys.
- Prepare hosted-access options later if needed.
- Connect Recall, Lattice, Solver, Checker, and other tools through bounded
  panel/runtime contracts instead of dumping every feature into v1.

## Phase 9: beta release

- Ship a focused beta with:
  - DD shell,
  - panel geometry,
  - command rail,
  - AI chat,
  - memory preflight,
  - audit ledger,
  - basic editor/explorer/terminal,
  - learning start page.
- Keep advanced features behind settings until the core workflow is stable.

