# nano-status-card — Unit test report

| | |
|---|---|
| Library | `nano-status-card` |
| Workspace | `nano-status-card-workspace` |
| Angular | 22.2.7 |
| Test runner | Vitest 5.1.0 via `@angular/build:unit-test` |
| Browser | Playwright Chromium, headless, viewport 1280×720 |
| Change detection | Zoneless (`provideZonelessChangeDetection()`). zone.js is not loaded. |
| Stylesheet | `https://cdn.syncfusion.com/ej2/32.1.19/bds.css` |
| Accessibility | axe-core 4.14.1, WCAG 2.0/2.1 A and AA |
| Property tests | fast-check 4.10.2, seed `20261117`, 15 runs |
| Date | 2026-11-17 |

## Commands

```bash
ng build nano-status-card
ng test nano-status-card --watch=false
```

Both commands were run from `nano-status-card-workspace`. The raw test log is `reports/test-run.log`.

## Results

| Suite | File | Tests | Passed | Failed |
|---|---|---:|---:|---:|
| Environment | `src/test/test-environment.spec.ts` | 3 | 3 | 0 |
| Functional | `src/lib/nano-status-card.spec.ts` | 28 | 3 | 25 |
| Accessibility | `src/lib/nano-status-card.a11y.spec.ts` | 5 | 1 | 4 |
| Adversarial | `src/lib/nano-status-card.adversarial.spec.ts` | 14 | 0 | 14 |
| **Total** | | **50** | **7** | **43** |

Vitest summary: `Test Files  3 failed | 1 passed (4)` and `Tests  43 failed | 7 passed (50)`. `ng test` exited 1.

### Counts requested by the generator

| Count | Value |
|---|---:|
| Functional tests | 28 (this includes 1 property-based test) |
| Accessibility tests | 5 |
| Property-based tests | 1 (`[FR-2][FR-3][PBT]`, 15 runs) |
| Adversarial tests | 14 |
| Tests executed | 50 |

## Build

`ng build nano-status-card` succeeded. Both entry points were emitted:

- `dist/nano-status-card`
- `dist/nano-status-card/testing`

## Red state

The stub compiles, the harness loads, and dependency injection works. The BDS stylesheet loads and its light and dark tokens resolve. Failures are missing card rendering, not a broken test environment.

Every failed test stops on the same missing behaviour: the host is present and `cardInfoData` is accepted, but no `ul > li` card is rendered (`found 0`).

### Tests that passed against the stub

These pass because the stub already satisfies them. They remain valid once the cards are implemented.

| Test | Why it passes now |
|---|---|
| `[ENV]` stylesheet and light/dark tokens | Test infrastructure only |
| `[FR-1][UT-1]` accepts `cardInfoData` | The required input is part of the public signature |
| `[UD-1]` selector is `nano-status-card` | The stub declares that selector |
| `[FR-5]` zero cards | An empty template contains no `li` |
| `[A11Y][FR-12][empty]` | The empty host stays in the document and axe reports no violations |

No test uses `fakeAsync`, `tick`, a real sleep, or a timeout. The requirement has no time-based behaviour, so fake timers are not installed.

## Traceability

| Requirement test | Spec |
|---|---|
| UT-1 | `[FR-1][UT-1]` |
| UT-2 | `[FR-2][UT-2]` |
| UT-3 | `[UD-1][UT-3]` |
| UT-4 | `[FR-3][UT-4]` (three titles) |
| UT-5 | `[FR-3][UT-5]` (`01`, `-`, `0`) |
| UT-6 | `[FR-11][UT-6]` |
| UT-7 | `[FR-8][UT-7]` |
| UT-8 | `[FR-4][FR-9][UT-8][UT-15]` |
| UT-9 | `[FR-6][UT-9]` |
| UT-10 | `[FR-6][UT-10]` |
| UT-11 | `[FR-7][UT-11]` at 320, 768, and 1280 |
| UT-12 | `[UT-12]` |
| UT-13 | `[UT-13]` |
| UT-14 | `[FR-9][FR-10][UT-14][UT-15]` |
| UT-15 | Figma layout and type tests above |
| UT-16 | The five `[A11Y][FR-12]` tests |
| Usage example | `[UD-1]` selector and `[UD-1][UT-3]` |

## Coverage gaps

Recorded in `API_CONTRACT.md` and not turned into extra product behaviour:

- C-1: the snippet's `[CardInfo]` binding is not a public input.
- C-2: Figma `nowrap` is not asserted; long text must stay inside the card.
- C-3: the Figma glyph is not drawn by the library; `iconClass` is.
- G-1: no layout-enum input. Shape configuration is `containerClass` plus the Figma default.
- G-2: card width is not fixed at 322px.
- G-3: no required pixel gap between cards.
- G-4: 320 / 768 / 1280 stand in for mobile, tablet, and desktop.
- G-5 / G-6: malformed entries must not throw; omitting the required binding is not the case under test.
- G-7: no keyboard, focus, or extra accessible-name API.
