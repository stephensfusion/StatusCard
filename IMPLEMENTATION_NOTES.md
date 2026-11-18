# nano-status-card — Implementation notes

**Tests were not executed in this session.** No test, coverage, or mutation run was performed and no test report was produced. Pass/fail is determined by the separate test execution process.

## Environment

| Item | Value | Established from |
| --- | --- | --- |
| Node.js | 24.20.0 | `node -v` |
| Package manager | npm 11.19.0 | `package.json` `packageManager`, `angular.json` `cli.packageManager`, `package-lock.json` |
| Angular | 22.2.6 (core, common, compiler, compiler-cli); CLI and build 22.2.7 | `ng version`, `package.json`, `package-lock.json` |
| `@angular/cdk` | 22.2.7 | `ng version` |
| ng-packagr | 22.2.6 | `ng version` |
| TypeScript | 6.0.3 | `npx tsc -v` (`package.json` requests `~6.0.2`) |
| Zoneless | Yes. `provideZonelessChangeDetection()`, no zone.js dependency | `src/test/test-providers.ts`, `API_CONTRACT.md` |
| OS | Windows 11 Enterprise 10.0.26200 (x64) | `ver` |
| Library / package name | `nano-status-card` | `angular.json`, `projects/nano-status-card/package.json` |

No dependencies were installed, added, or upgraded. The lockfile was not changed.

## Inputs used

- Requirement: "Status Card" (`requirement.pdf`).
- `API_CONTRACT.md`, the frozen specs, harness and helpers under `projects/nano-status-card/src/lib/*.spec.ts`, `src/test/`, and `testing/`.
- `UNIT_TEST_REPORT.md` and `ADVERSARIAL_REPORT.md`, read for test classification only.
- Figma `LAocEcfNCMpFgKRT0oVDU4`, node `1:34`. This was **inspected** with `get_design_context` and `get_variable_defs` through the Figma MCP. The values match API_CONTRACT §4: padding 20, `radius-xl` 12, `spacing-lg` 12, `border-secondary` `#eaecf0`, `bg-primary` `#fff`, Text sm/Medium, Display sm/Semibold, `shadow-xs` `#1018280D` (0, 1, 2, 0), `justify-between`, and a 48×48 icon frame.

## Files changed

| File | Change |
| --- | --- |
| `projects/nano-status-card/src/lib/nano-status-card.ts` | Stub replaced. Added `templateUrl`/`styleUrl` and an internal `cards` computed. Two internal helpers, `asText` and `toRenderableCards`, are not exported. Public signature unchanged. |
| `projects/nano-status-card/src/lib/nano-status-card.html` | New template |
| `projects/nano-status-card/src/lib/nano-status-card.css` | New component styles |
| `projects/nano-status-card/README.md` | Consumer documentation |
| `projects/nano-status-card/CHANGELOG.md` | Initial release entry |
| `README.md` (workspace) | The status line no longer says the behaviour is unimplemented |
| `IMPLEMENTATION_NOTES.md` | This file |

The following were **not modified**: `public-api.ts`, `testing/**`, `src/test/**`, every `*.spec.ts`, `angular.json`, every `tsconfig*.json`, `package.json`, `package-lock.json`, and `ng-package.json`.

## Requirement coverage

| ID | Implementation |
| --- | --- |
| FR-1, UD-1 | `cardInfoData = input.required<CardInfo[]>()`. The input is unchanged from the stub. |
| FR-2, FR-5 | `@for` over the cards, tracked by `$index` because titles may repeat. `ul` only when there is at least one card. An empty array renders nothing. |
| FR-3, FR-11 | `<p class="nsc-title">`, `<p class="nsc-value">`, and a `<span class="nsc-icon" [class]="iconClass" aria-hidden="true">` slot. |
| FR-4, FR-8 | `[class]="containerClass"` on the `li`. All component rules are wrapped in `:where()` (zero specificity), so consumer rules on `containerClass`/`iconClass` override shape and positioning. This was verified with Angular's `encapsulateStyle`, which produces `:where(.nsc-card[_ngcontent-c1])`. |
| FR-6, FEAT-2, FEAT-4 | Colours come only from `var(--color-sf-*)`. `.e-dark-mode` re-themes the cards through CSS alone. Sizes, padding, and radius are theme-independent. |
| FR-7, ADV-2, ADV-6 | Grid: `repeat(auto-fit, minmax(min(100%, 240px), 1fr))` with a 16px gap. That gives one column at 320, three at 768, and five at 1280. |
| FR-9, FR-10, FEAT-1, FEAT-3 | Figma metrics and BDS tokens, as in API_CONTRACT §4. `font-family: 'Inter', sans-serif`. BDS loads Inter through its own `@import`. |
| FR-12 | `ul`/`li` structure, visible text, and a decorative `aria-hidden` icon. The token pairs exceed 4.5:1 in both themes. |
| UT-12, UT-13, ADV-3, ADV-4 | `min-width: 0` on the card and text column, `overflow-wrap: anywhere`, and `max-width: 100%` on the title and value. |
| ADV-5 | A `computed()` normaliser skips non-object entries (such as `null`) and maps missing or non-string fields to `''`. Text uses interpolation only, so there is no `innerHTML`. |

## Decisions (not dictated by a source; recorded for review)

1. **Null entries are skipped, not rendered as an empty card.** G-5 requires "no throw", and leaves open whether a null entry occupies a card. Skipping it is the least surprising choice. A partial object still renders as a card with empty fields.
2. **Non-string field values render as `''`.** The contract types every field as `string`. A JavaScript consumer that passes `value: 5` gets an empty value rather than `"5"`. If coercion is preferred, the change is a single line in `asText`.
3. **Inter-card gap 16px and minimum column 240px.** G-3 names no gap. The Figma node is a single card, and the sample screenshot shows a visible gap. The 240px minimum keeps the title, the 48px icon, and the padding readable. Neither value is tested.
4. **No gap between the text column and the icon.** Figma uses `justify-between` with no explicit gap, so none is added. A very long title can wrap right up to the icon's edge.
5. **The icon slot has no default background, radius, or glyph** (C-3). The Figma icon is a single image asset with a purple tile, which the consumer supplies through `iconClass`. The slot centres its content, so font-icon glyphs such as `e-icons` sit in the middle.
6. **Card shadow is the same in dark mode.** Figma defines only `shadow-xs`, and no dark shadow token is specified.

## Risks for the test run

- **`[FR-2][FR-3][PBT]`, whitespace at text boundaries.** `NanoStatusCardHarness.getCardText()` uses CDK `UnitTestElement.text()`, which returns `textContent.trim()`. The card's text is `title + value`. If fast-check (seed `20261117`, `unit: 'grapheme'`) produces a title with leading whitespace, or a value with trailing whitespace, then `toContain(card.title)` / `toContain(card.value)` fails. That would happen for any implementation that renders the strings verbatim, which FR-3 and the contract require. Whether this seed produces such a case is unknown because tests were not run. If it fails for this reason, it should go through a TEST_CHANGE_REQUEST, for example adding `value.trim() === value` to the arbitrary's filter. The implementation should not change.
- Layout assertions (the ±1px geometry and the 12px title/value gap) depend on the Chromium rendering and on BDS loading from the CDN at test time.

No `TEST_CHANGE_REQUEST.md` was created. No inspected test contradicts the requirement or the contract.

## Static verification

Run from `nano-status-card-workspace`:

| Command | Result |
| --- | --- |
| `npx ng build nano-status-card` (baseline, before changes) | Success |
| `npx tsc -p projects/nano-status-card/tsconfig.lib.json --noEmit` (baseline) | Exit 0 |
| `npx tsc -p projects/nano-status-card/tsconfig.spec.json --noEmit` (baseline) | Exit 0 |
| `npx ng build nano-status-card --configuration production` | Success. Both entry points built, 0 warnings in the output. |
| `npx tsc -p projects/nano-status-card/tsconfig.lib.json --noEmit` | Exit 0 |
| `npx tsc -p projects/nano-status-card/tsconfig.spec.json --noEmit` (covers the specs, helpers, and harness) | Exit 0 |
| `ng lint nano-status-card` | Not run. `angular.json` has no `lint` target, and none was added. |

Note: `tsconfig.lib.json` does not enable `strict` (it is inherited from the workspace root, which does not set it). `tsconfig.spec.json` does enable `strict` and `strictTemplates`, and it also compiles the component sources. The configuration was left as found.

### Leftover scan

`grep` for `NOT_IMPLEMENTED|TODO|FIXME|console.|debugger|@ts-ignore|: any|as any|bypassSecurityTrust|innerHTML|window.|document.` over the library sources (`nano-status-card.ts/.html/.css`, `public-api.ts`) returned **no matches**. The test helpers under `src/test/` use `document` by design. They are frozen and out of scope.
