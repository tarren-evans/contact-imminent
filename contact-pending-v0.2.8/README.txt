CONTACT PENDING v0.2.8 — DISPLAY LOCK

Purpose: isolate and eliminate small-display focus/viewport zoom behavior while preserving v0.2.7 ISR/input architecture and gameplay.

Changes:
- fixed desktop application viewport and locked game shell
- action buttons use pointerdown and immediately release focus
- 16px+ action-control text to avoid browser focus magnification heuristics
- visualViewport telemetry added to DEV panel
- double-click and Ctrl+wheel browser zoom suppressed inside the game session
- no gameplay or balance changes

Run:
  python -m http.server 8080
Then open http://localhost:8080

Test especially: ISR -> UNKNOWN -> COLLECT -> CLEAR/INTERCEPT repeatedly on the smaller 1080p display. Open DEV to watch VIEWPORT/SCALE.
