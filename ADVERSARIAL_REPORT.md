# nano-status-card — Adversarial report

| | |
|---|---|
| Library | `nano-status-card` |
| Suite | `projects/nano-status-card/src/lib/nano-status-card.adversarial.spec.ts` |
| Runner | Vitest 5.1.0, Playwright Chromium headless, zoneless Angular 22.2.7 |
| Command | `ng test nano-status-card --watch=false` |
| Result | 14 tests, 14 failed, 0 passed |
| Date | 2026-11-17 |

Failures are the red state of the unimplemented stub. Each one reports that no card was rendered (`found 0` or a count of 0). None failed because the runner, the harness, or the BDS stylesheet was unavailable.

## Scenarios

| ID | Requirement | Tests | Safe outcome asserted | Result |
|---|---|---:|---|---|
| SC-1 | ADV-1. Dark-to-light and light-to-dark, including icons | 1 | Background colour changes with `.e-dark-mode` in both directions. Every icon stays visible and non-zero. | Failed: no card to measure |
| SC-2 | ADV-2. Alignment for any number of cards | 4 | 1, 2, 5, and 12 cards stay inside a 1280px frame, do not overlap, and stay left-to-right within a row | Failed: count was 0 |
| SC-3 | ADV-3. Long titles | 1 | The full title remains in the card, inside the card box, and the frame does not scroll horizontally | Failed: no card |
| SC-4 | ADV-4. Large values | 1 | The full value remains in the card, inside the card box, and the card itself does not scroll horizontally | Failed: no card |
| SC-5 | ADV-5. Missing or invalid data | 4 | Empty strings still produce one card. A partial item, then a valid card, renders the valid card. A null item does not throw, and the following valid card renders. Hostile HTML is text and creates no `img` or `script` | Failed: the valid or empty card was not rendered |
| SC-6 | ADV-6. Mobile, tablet, and desktop | 3 | 1, 4, and 8 cards fit a 320, 768, and 1280 frame without overlap | Failed: count was 0 |

## Failure category

| Category | Tests |
|---|---:|
| Missing rendered card | 14 |
| Thrown exception from the stub | 0 |
| Test-environment or locator failure | 0 |
| Timeout or timer leak | 0 |

## Security and integrity

SC-5 is the integrity case. A title of `<img src=x onerror="alert(1)">` and a value of `<script>alert(1)</script>` must appear as text. The host must not contain an `img` or a `script` element. The stub fails earlier, because it does not render the card, so this assertion has not yet observed a vulnerable implementation. The test is in place for the engineer who implements rendering.

Null and partial items must not prevent a later valid collection from rendering. The stub accepts those values without throwing, then fails the assertion that the valid card appears.

## Coverage gaps

- ADV-5 does not define an error message, a fallback title, or whether a null entry occupies a card. The tests do not invent one. See `API_CONTRACT.md` G-5 and G-6.
- No pixel gap between cards is required (G-3). Alignment means containment, no overlap, and source order.
- Theme checks use `.e-dark-mode` on `body`, which is how BDS 32.1.19 switches `--color-sf-*` tokens. The requirement does not name another theme API.

## Recommendation

Implement the DOM contract in `API_CONTRACT.md` §3 and the Figma metrics in §4. Do not change these tests to match an empty template. After implementation, `ng test nano-status-card --watch=false` should report 50 passed.
