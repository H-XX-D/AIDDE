# Panel Rewrite Notes

AIDDE's panel system should be designed as geometry first.

## Principles

- Every panel is a bounded rectangle.
- Center panels and sidebars use the same primitive.
- The app frame is the outer fixed boundary.
- Internal split lines can move.
- Colinear segments can snap together.
- Collapsed sections become visible double-line segments with restore affordances.
- Panels can be swapped without changing geometry.
- Tabs are locations and policy contexts, not just labels.

## Default layouts

1. Start page
   - home,
   - tutorials,
   - project templates,
   - community/news,
   - pinned favorites.

2. Blank project
   - editor,
   - file explorer,
   - AI chat,
   - terminal/console as needed.

3. Agent workspace
   - Memory,
   - Audit,
   - editor,
   - terminal,
   - console,
   - explorer,
   - agent chat.

## Panel menu

Every panel should expose:

- type switch,
- permissions,
- target id,
- link/swap controls,
- collapse controls,
- details on hover.

## Command rail

The command rail belongs at the bottom center of the app frame. It should be the
place for:

- prompt entry,
- keyword preflight,
- stop/edit/play,
- panel targeting,
- macros,
- quick commands.

