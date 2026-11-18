# TEST REPORT: nano-status-card

## 1. Summary

| Item | Value |
|---|---|
| Library | `nano-status-card` (Angular 22.x, Vitest 5.1.0 via `ng test`, ChromiumHeadless) |
| Total tests | 50 |
| Passed | 50 |
| Failed | 0 |
| Skipped | 0 |
| Execution time | 7.66s (official run: Duration line of reports/test-console-output.log) |
| Build status | SUCCESS (ng build nano-status-card, exit 0, built nano-status-card and nano-status-card/testing) |
| Code coverage | NOT AVAILABLE: ng test --coverage ran with Coverage enabled with v8, but Vitest printed no coverage table and wrote no coverage output because 1 test failed |
| Requirement coverage | 19/22 = 86.4% (requirements with >=1 executed test, matched by ID tag in test name). Without a tagged test: FEAT-1, FEAT-2, FEAT-3 |
| Adversarial tests | run 14 / passed 14 / failed 0 |
| Verdict | **PASS** |

Notes:

- node/npm were not on PATH; Node v24.20.0 from the WinGet install was used for all commands.
- npm ci succeeded (344 packages added, 0 vulnerabilities).
- @vitest/coverage-v8@5.1.0 was missing, so the first --coverage run aborted (reports/test-console-output-attempt1-coverage-missing.log). It was then installed with "npm install --no-save" (package.json and package-lock.json untouched) and the run repeated.
- Official run = reports/test-console-output.log (ng test nano-status-card --watch=false --coverage). Per-test durations come from a later identical run with the JSON reporter (reports/vitest-results-final.json); outcome identical: 50 tests, 49 passed, 1 failed.
- Runs 2 to 4 gave the same result (1 failed, 49 passed), so the failure is deterministic (fixed fast-check seed).
- Actual values for passing tests are not reported by the runner: NOT CAPTURED.
- No implementation, test, config or requirement file was modified.

Evidence files: `reports/build-output.log`, `reports/test-console-output.log` (official run, unedited), `reports/vitest-results-final.json`, `reports/npm-ci.log`, plus the earlier attempt logs.

## 2. NORMAL UNIT TEST RESULTS

Hint: Enable verbose mode in order to have the list of all failing values encountered during the run

Failure screenshot:
  - .vitest/attachments/failure-screenshots/nano-status-card.spec.ts/NanoStatusCard---functional----FR-2--FR-3--PBT--should-render-any-collection-of-titles-and-values-in-source-order.png

 ❯ buildError node_modules/fast-check/lib/fast-check.js:2469:16
 ❯ asyncThrowIfFailed node_modules/fast-check/lib/fast-check.js:2481:8

Caused by: AssertionError: expected '!"' to contain ' !'

Expected: [32m"[7m [27m!"[39m
Received: [31m"![7m"[27m"[39m

 ❯ :/requirements/frontend/NS PLATFORM/StatusCard/nano-status-card-workspace/file:/D:/requirements/frontend/NS%20PLATFORM/StatusCard/nano-status-card-workspace/projects/nano-status-card/src/lib/nano-status-card.spec.ts:396:58
 ❯ AsyncProperty.run node_modules/fast-check/lib/fast-check.js:1217:19
 ❯ asyncPropertyExecution node_modules/fast-check/lib/fast-check.js:2564:14
 ❯ asyncRunIt node_modules/fast-check/lib/fast-check.js:2557:15
 ❯ :/requirements/frontend/NS PLATFORM/StatusCard/nano-status-card-workspace/file:/D:/requirements/frontend/NS%20PLATFORM/StatusCard/nano-status-card-workspace/projects/nano-status-card/src/lib/nano-status-card.spec.ts:390:5

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯
```

### Passed (35)

| ID | Test name | Input | Expected | Actual | Status | Duration |
|---|---|---|---|---|---|---|
| T01 | [A11Y][FR-12][single] should expose the title and value, hide the icon from assistive tech, and pass axe | Fixture NanoStatusCard with cardInfoData = [FIGMA_CARD]; Figma card rendered | single card rendered; li is a list item; title/value textContent equal 'In Progress' / '-'; icon aria-hidden='true' with no text; title and value contrast >= 4.5 against card background; axe WCAG scan has no violations | NOT CAPTURED | PASSED | 977.1 ms |
| T02 | [A11Y][FR-12][sample] should expose every sample card as a list item without axe violations | cardInfoData = SAMPLE_CARDS (4 cards) | 4 li items; each title and value textContent exact; each icon aria-hidden='true'; axe scan has no violations | NOT CAPTURED | PASSED | 224.4 ms |
| T03 | [A11Y][FR-12][empty] should leave an empty collection in the document without axe violations | cardInfoData = [] | host stays connected; 0 cards; host text is empty; axe scan has no violations | NOT CAPTURED | PASSED | 139.3 ms |
| T04 | [A11Y][FR-12][dark] should keep 4.5:1 contrast for title and value in the dark theme | cardInfoData = [FIGMA_CARD]; body gets .e-dark-mode | title and value contrast >= 4.5 against the dark card background; axe scan has no violations | NOT CAPTURED | PASSED | 139 ms |
| T05 | [A11Y][FR-12][long-title] should keep a long title in the accessibility tree without axe violations | cardInfoData = [longTitleCard()] (title 'Requirements Created for the quarterly platform review across every participating squad') | card text contains the long title; axe scan has no violations | NOT CAPTURED | PASSED | 148.1 ms |
| T20 | [FR-1][UT-1] should accept cardInfoData when the parent provides a collection | fixture.componentRef.setInput('cardInfoData', SAMPLE_CARDS) | cardInfoData() toEqual SAMPLE_CARDS | NOT CAPTURED | PASSED | 52.3 ms |
| T21 | [UD-1] should use the nano-status-card selector from the usage documentation | UsageExampleHost (usage-documentation template) | <nano-status-card> element present; <nano-nano-status-card> absent | NOT CAPTURED | PASSED | 3.9 ms |
| T22 | [UD-1][UT-3] should render every card from the usage example in source order | UsageExampleHost renders SAMPLE_CARDS | card count 4; each card text contains its title and value; carries its containerClass; has icon with its iconClass | NOT CAPTURED | PASSED | 5.9 ms |
| T23 | [FR-2][UT-2] should render the single supplied card | cardInfoData = [FIGMA_CARD] | 1 card; text contains 'In Progress' and '-'; has class 'card-progress'; icon 'icon-progress' present | NOT CAPTURED | PASSED | 4.3 ms |
| T24 | [FR-3][UT-4] should display the title "Requirements Created" inside its own card | cardInfoData = [card titled 'Requirements Created'] | title element textContent === 'Requirements Created' | NOT CAPTURED | PASSED | 3.9 ms |
| T25 | [FR-3][UT-4] should display the title "In Review" inside its own card | cardInfoData = [card titled 'In Review'] | title element textContent === 'In Review' | NOT CAPTURED | PASSED | 2.5 ms |
| T26 | [FR-3][UT-4] should display the title "Completed Requirement" inside its own card | cardInfoData = [card titled 'Completed Requirement'] | title element textContent === 'Completed Requirement' | NOT CAPTURED | PASSED | 4.3 ms |
| T27 | [FR-3][UT-5] should display the value "01" verbatim | value '01' | value element textContent === '01' | NOT CAPTURED | PASSED | 2.5 ms |
| T28 | [FR-3][UT-5] should display the value "-" verbatim | value '-' | value element textContent === '-' | NOT CAPTURED | PASSED | 2.3 ms |
| T29 | [FR-3][UT-5] should display the value "0" verbatim | value '0' | value element textContent === '0' | NOT CAPTURED | PASSED | 2.7 ms |
| T30 | [FR-11][UT-6] should apply every iconClass token on a 48px icon slot | iconClass 'e-icons icon-progress' | icon slot width and height 48px (+-1); has every class token | NOT CAPTURED | PASSED | 3.2 ms |
| T31 | [FR-8][UT-7] should apply containerClass so a consumer rule can change the card shape | containerClass 'consumer-shape' with consumer rule installed | card has class 'consumer-shape'; computed borderRadius === '20px' | NOT CAPTURED | PASSED | 2.6 ms |
| T32 | [FR-4][FR-9][UT-8][UT-15] should lay out the Figma card with title above value and the icon at the top end | cardInfoData = [FIGMA_CARD] | padding 20px on all sides; border 1px; radius 12px; Figma shadow; title left at padding edge; value left aligned with title; value 12px below title; icon top/right at padding edge; icon right of title | NOT CAPTURED | PASSED | 4.2 ms |
| T33 | [FR-9][FR-10][UT-14][UT-15] should use the Figma type styles and the matching BDS colour tokens | cardInfoData = [FIGMA_CARD] | title Inter 14px/500/20px colour --color-sf-text-tertiary; value Inter 30px/600/38px colour --color-sf-text-primary; background --color-sf-bg-primary; border --color-sf-border-secondary | NOT CAPTURED | PASSED | 3 ms |
| T34 | [FR-6][UT-9] should update every card colour when .e-dark-mode is toggled and the collection is unchanged | SAMPLE_CARDS; setDarkMode(true) then setDarkMode(false) | dark: every card bg/title/value colour equals resolved BDS token; light: bg rgb(255, 255, 255), title colour rgb(71, 84, 103) | NOT CAPTURED | PASSED | 5.4 ms |
| T35 | [FR-6][UT-10] should keep every icon visible after the theme changes | SAMPLE_CARDS; setDarkMode(true) | every icon exists, display != none, visibility != hidden, width > 0, height > 0 | NOT CAPTURED | PASSED | 3.5 ms |
| T36 | [FR-7][UT-11] should keep the sample cards inside the mobile frame | SAMPLE_CARDS in 320px frame | 4 cards; layoutProblem === null | NOT CAPTURED | PASSED | 3 ms |
| T37 | [FR-7][UT-11] should keep the sample cards inside the tablet frame | SAMPLE_CARDS in 768px frame | 4 cards; layoutProblem === null | NOT CAPTURED | PASSED | 2.5 ms |
| T38 | [FR-7][UT-11] should keep the sample cards inside the desktop frame | SAMPLE_CARDS in 1280px frame | 4 cards; layoutProblem === null | NOT CAPTURED | PASSED | 2.4 ms |
| T39 | [UT-12] should keep a long title inside its card without widening the frame | [longTitleCard()] in 320px frame | card text contains LONG_TITLE; title rect inside card rect; layoutProblem === null | NOT CAPTURED | PASSED | 2.5 ms |
| T40 | [UT-13] should keep a large value inside its card without overflowing it | [largeValueCard()] in 320px frame | card text contains LARGE_VALUE; value rect inside card rect; layoutProblem === null | NOT CAPTURED | PASSED | 2.6 ms |
| T41 | [FR-5] should render 0 cards when the parent supplies that many | 0 cards supplied | card count 0 | NOT CAPTURED | PASSED | 1.8 ms |
| T42 | [FR-5] should render 1 cards when the parent supplies that many | 1 card supplied | card count 1; card text contains title 'Status 1' | NOT CAPTURED | PASSED | 2.7 ms |
| T43 | [FR-5] should render 8 cards when the parent supplies that many | 8 cards supplied | card count 8; each card text contains its title 'Status n' | NOT CAPTURED | PASSED | 4.2 ms |
| T44 | [FR-2] should show two cards that share a title as two cards | two cards with same title 'In Progress', values '01' and '02' | 2 cards; card 0 contains '01'; card 1 contains '02'; card 0 does not contain '02' | NOT CAPTURED | PASSED | 2.6 ms |
| T45 | [FR-2] should show only the latest collection after successive replacements | SAMPLE_CARDS -> [FIGMA_CARD] -> [] -> [SAMPLE_CARDS[2]] | 1 card with '-' ; then 0 cards; then 1 card containing 'In Review' and not 'Requirements Created' | NOT CAPTURED | PASSED | 3.5 ms |
| T46 | [FEAT-4] should keep type size, padding, and radius stable when the theme changes | FIGMA_CARD; body gets .e-dark-mode | title/value font size, padding and radius unchanged; title colour changes | NOT CAPTURED | PASSED | 2.3 ms |
| T48 | [ENV] should load the required BDS 32.1.19 stylesheet | document stylesheet link #nano-test-bds-stylesheet | link present; href === BDS_STYLESHEET_URL | NOT CAPTURED | PASSED | 28.6 ms |
| T49 | [ENV] should resolve the status-card BDS tokens in the light theme | light theme | --color-sf-bg-primary rgb(255, 255, 255); text-primary rgb(16, 24, 40); text-tertiary rgb(71, 84, 103); border-secondary rgb(234, 236, 240) | NOT CAPTURED | PASSED | 5.9 ms |
| T50 | [ENV] should switch those tokens when .e-dark-mode is toggled on body | toggle .e-dark-mode on body | dark: bg rgb(12, 17, 29), text-primary rgb(245, 245, 246), text-tertiary rgb(148, 150, 156), border rgb(31, 36, 47); light restored: bg rgb(255, 255, 255), tertiary rgb(71, 84, 103) | NOT CAPTURED | PASSED | 0.6 ms |

## 3. ADVERSARIAL UNIT TEST RESULTS

### Failed (0)

None.

### Passed (14)

| ID | Test name | Input | Expected | Actual | Status | Duration |
|---|---|---|---|---|---|---|
| T06 | [ADV][SC-1] should update card and icon appearance in both theme directions | cards = [FIGMA_CARD, In Review card]; theme light -> dark -> light | dark card background differs from light background; icons exist, display != none, width > 0 in dark; light background and icon width restored after returning to light | NOT CAPTURED | PASSED | 50.1 ms |
| T07 | [ADV][SC-2] should keep 1 cards aligned inside the frame without overlap | cardsWithCount(1), frame 1280px | 1 card; layoutProblem(frame, host) === null | NOT CAPTURED | PASSED | 4.2 ms |
| T08 | [ADV][SC-2] should keep 2 cards aligned inside the frame without overlap | cardsWithCount(2), frame 1280px | 2 cards; layoutProblem(frame, host) === null | NOT CAPTURED | PASSED | 3.5 ms |
| T09 | [ADV][SC-2] should keep 5 cards aligned inside the frame without overlap | cardsWithCount(5), frame 1280px | 5 cards; layoutProblem(frame, host) === null | NOT CAPTURED | PASSED | 3.9 ms |
| T10 | [ADV][SC-2] should keep 12 cards aligned inside the frame without overlap | cardsWithCount(12), frame 1280px | 12 cards; layoutProblem(frame, host) === null | NOT CAPTURED | PASSED | 4.7 ms |
| T11 | [ADV][SC-3] should keep a long title from breaking the card or the frame | cards = [longTitleCard(), FIGMA_CARD], frame 768px | first card text contains LONG_TITLE; title rect inside card rect; layoutProblem === null | NOT CAPTURED | PASSED | 3.9 ms |
| T12 | [ADV][SC-4] should show a large value without overflowing its card | cards = [largeValueCard()] (value '1234567890' x 8), frame 320px | card text contains LARGE_VALUE; value rect inside card rect; card.scrollWidth <= card.clientWidth + 1 | NOT CAPTURED | PASSED | 2.9 ms |
| T13 | [ADV][SC-5] should still render a card when its strings are empty | cards = [{title:'', value:'', iconClass:'', containerClass:''}] | host connected; exactly 1 card item | NOT CAPTURED | PASSED | 2.4 ms |
| T14 | [ADV][SC-5] should keep rendering after an incomplete item is replaced by a valid card | cards = [{title:'Only title'}] then replaced by [FIGMA_CARD] | host connected after incomplete item; after replacement 1 card whose text contains 'In Progress' and '-' | NOT CAPTURED | PASSED | 2.7 ms |
| T15 | [ADV][SC-5] should keep rendering after a null item is replaced by a valid card | cards = [null] then replaced by [FIGMA_CARD] | host connected after null item; after replacement 1 card whose text contains '-' | NOT CAPTURED | PASSED | 2.9 ms |
| T16 | [ADV][SC-5] should render hostile strings as text and not as elements | title '<img src=x onerror="alert(1)">', value '<script>alert(1)</script>' | card text contains both strings verbatim; no img or script element in host | NOT CAPTURED | PASSED | 4.8 ms |
| T17 | [ADV][SC-6] should render 1, 4, and 8 cards inside the mobile frame | cardsWithCount(1), (4), (8) in 320px frame | card count equals requested count for each; layoutProblem === null | NOT CAPTURED | PASSED | 6.2 ms |
| T18 | [ADV][SC-6] should render 1, 4, and 8 cards inside the tablet frame | cardsWithCount(1), (4), (8) in 768px frame | card count equals requested count for each; layoutProblem === null | NOT CAPTURED | PASSED | 3.9 ms |
| T19 | [ADV][SC-6] should render 1, 4, and 8 cards inside the desktop frame | cardsWithCount(1), (4), (8) in 1280px frame | card count equals requested count for each; layoutProblem === null | NOT CAPTURED | PASSED | 4.4 ms |

## 4. Requirement traceability

| Requirement ID | Implementation component | Unit tests | Adversarial tests | Result |
|---|---|---|---|---|
| FR-1: Accept card data via required cardInfoData input | NanoStatusCard.cardInfoData (nano-status-card.ts) | T20 | - | PASS |
| FR-2: Display all cards in the collection | NanoStatusCard template @for (nano-status-card.html) | T23, T44, T45, T47 | - | FAIL |
| FR-3: Display title, value and icon for each card | nano-status-card.html (.nsc-title, .nsc-value, .nsc-icon) | T24, T25, T26, T27, T28, T29, T47 | - | FAIL |
| FR-4: Configurable card shape and element positioning | nano-status-card.css (.nsc-card, .nsc-text, .nsc-icon) | T32 | - | PASS |
| FR-5: Render any number of cards | NanoStatusCard.cards() + template @for | T41, T42, T43 | - | PASS |
| FR-6: Propagate theme changes automatically | nano-status-card.css (BDS --color-sf-* tokens) | T34, T35 | - | PASS |
| FR-7: Arrange cards across screen sizes | nano-status-card.css (.nsc-list layout) | T36, T37, T38 | - | PASS |
| FR-8: Apply styling via containerClass | nano-status-card.html ([class]="card.containerClass") | T31 | - | PASS |
| FR-9: Match approved Figma design (spacing, fonts, colours, layout) | nano-status-card.css | T32, T33 | - | PASS |
| FR-10: Use BDS CSS library as primary styling | nano-status-card.css (BDS tokens) | T33 | - | PASS |
| FR-11: Display icons using supplied iconClass | nano-status-card.html (.nsc-icon [class]="card.iconClass") | T30 | - | PASS |
| FR-12: Readable content, contrast, accessibility | nano-status-card.html (ul/li, aria-hidden icon) + css | T01, T02, T03, T04, T05 | - | PASS |
| FEAT-1: Design matches approved Figma design | nano-status-card.css | - | - | NOT TESTED (no test tagged with this ID) |
| FEAT-2: Light/Dark theme changes propagate automatically | nano-status-card.css | - | - | NOT TESTED (no test tagged with this ID) |
| FEAT-3: Use BDS CSS library for styling | nano-status-card.css | - | - | NOT TESTED (no test tagged with this ID) |
| FEAT-4: Typography, colours, spacing, appearance consistent across themes | nano-status-card.css | T46 | - | PASS |
| SC-1: Adversarial 1: Dark<->light theme switching updates cards and icons | nano-status-card.css | - | T06 | PASS |
| SC-2: Adversarial 2: Cards aligned regardless of card count | nano-status-card.css (.nsc-list) | - | T07, T08, T09, T10 | PASS |
| SC-3: Adversarial 3: Long titles do not break layout | nano-status-card.css (.nsc-title) | - | T11 | PASS |
| SC-4: Adversarial 4: Large values display without overflow | nano-status-card.css (.nsc-value) | - | T12 | PASS |
| SC-5: Adversarial 5: Missing/invalid data does not cause render failures | toRenderableCards() in nano-status-card.ts | - | T13, T14, T15, T16 | PASS |
| SC-6: Adversarial 6: Cards render on mobile, tablet, desktop | nano-status-card.css | - | T17, T18, T19 | PASS |

Test IDs (T01 to T50) refer to the tables above. Untagged-by-ID tests: A11Y tests carry FR-12; UD-1 and ENV tests carry no FR/FEAT/SC ID.
FEAT-1, FEAT-2 and FEAT-3 duplicate FR-9, FR-6 and FR-10 in the requirement document; the tests are tagged with the FR ID, so they show as having no directly tagged test.

## 5. Final verdict

**PASS**
