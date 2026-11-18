# nano-status-card

A reusable Angular 22 component that displays ticket or test status as a row of cards. The parent supplies the collection. Each card shows a title, a value, and an icon, and is styled with the BDS CSS library so it follows the application's light or dark theme.

The component only displays data. It does not fetch data and has no click, navigation, or selection behaviour.

## Installation

```bash
npm install nano-status-card
```

### Peer dependencies

| Package           | Version   | Notes                                                     |
| ----------------- | --------- | --------------------------------------------------------- |
| `@angular/core`   | `^22.2.0` | Required                                                  |
| `@angular/common` | `^22.2.0` | Required                                                  |
| `@angular/cdk`    | `^22.2.0` | Optional. Only needed for the `nano-status-card/testing` harness |

The only runtime dependency is `tslib`.

## Setup

1. Load the BDS stylesheet once in the application, for example in `index.html`:

   ```html
   <link href="https://cdn.syncfusion.com/ej2/32.1.19/bds.css" rel="stylesheet" />
   ```

   BDS provides the colour tokens and loads the Inter font that the cards use.

2. Import the standalone component where you use it:

   ```ts
   import { Component } from '@angular/core';
   import { CardInfo, NanoStatusCard } from 'nano-status-card';

   @Component({
     selector: 'app-dashboard',
     imports: [NanoStatusCard],
     template: `<nano-status-card [cardInfoData]="cardInfoData"></nano-status-card>`,
   })
   export class Dashboard {
     cardInfoData: CardInfo[] = [];
   }
   ```

There is no global configuration and no `provide…()` function.

## Usage

These examples come from the requirement's Usage Documentation.

### Component

```html
<nano-status-card [cardInfoData]="cardInfoData"></nano-status-card>
```

> The requirement's snippet writes `[CardInfo]="cardInfoData"`. `CardInfo` is the model name, not an input. Bind to `cardInfoData`, as shown above. See `API_CONTRACT.md` conflict C-1.

### Model

```ts
export interface CardInfo {
  title: string;
  value: string;
  iconClass: string;
  containerClass: string;
}
```

### Input

`cardInfoData: CardInfo[]`

```ts
cardInfoData: CardInfo[] = [
  { title: 'Requirements Created', value: '01', iconClass: 'icon-created', containerClass: 'card-created' },
  { title: 'In Progress', value: '01', iconClass: 'icon-progress', containerClass: 'card-progress' },
  { title: 'In Review', value: '-', iconClass: 'icon-review', containerClass: 'card-review' },
  { title: 'Completed Requirement', value: '-', iconClass: 'icon-done', containerClass: 'card-done' },
];
```

### Expected output

- One card is rendered for each item in the collection, in the same order.
- Each card displays its title and its value.
- Each card's icon slot carries the specified `iconClass`.
- Each card carries its `containerClass`, so your custom container styles apply.

## API reference

### `NanoStatusCard`

| | |
| --- | --- |
| Selector | `nano-status-card` |
| Kind | Standalone component, `ChangeDetectionStrategy.OnPush` |

| Input | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `cardInfoData` | `CardInfo[]` | Yes | none | The cards to render, in source order. Replacing the array replaces the rendered cards. An empty array renders nothing. |

There are no outputs and no content projection.

### `CardInfo`

| Field | Type | Description |
| --- | --- | --- |
| `title` | `string` | Label shown in the card, exactly as given. |
| `value` | `string` | Figure shown in the card, exactly as given (`01`, `-`, `0`, …). |
| `iconClass` | `string` | Space-separated classes added to the 48×48 icon slot. Use them to show a glyph, for example `e-icons e-file`, and to tint the slot. |
| `containerClass` | `string` | Space-separated classes added to the card element (`li`). Use them to change the card's shape or appearance. |

Title and value are rendered as text, never as HTML. If an entry is `null`, it is skipped. If a field is missing or is not a string, it renders as empty. Neither case throws.

### Rendered structure

```html
<nano-status-card>
  <ul class="nsc-list">
    <li class="nsc-card {containerClass}">
      <div class="nsc-text">
        <p class="nsc-title">{title}</p>
        <p class="nsc-value">{value}</p>
      </div>
      <span class="nsc-icon {iconClass}" aria-hidden="true"></span>
    </li>
  </ul>
</nano-status-card>
```

The `ul`, the `li` cards, the `containerClass` on the `li`, and the icon slot that carries `iconClass` are the public DOM contract. The `nsc-*` class names are internal and may change.

### Testing entry point: `nano-status-card/testing`

`NanoStatusCardHarness` (Angular CDK component harness) with `getList()`, `getCards()`, `getCardCount()`, `getCardText(index)`, `cardHasClass(index, className)` and `getIcon(index, iconClass)`. `NANO_STATUS_CARD_SELECTORS` lists the public selectors.

```ts
const harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(NanoStatusCardHarness);
expect(await harness.getCardCount()).toBe(4);
```

## Layout

- The Figma card (node `1:34`) uses 20px padding, a 1px border, 12px radius, and the `shadow-xs` shadow. The title sits above the value with a 12px gap, and the 48×48 icon sits at the top end.
- Cards share the parent's width. Each column is at least 240px wide, or the full width when the parent is narrower. Cards wrap onto new rows, with a 16px gap. That gives one column on mobile (320px), three on tablet (768px), and up to five on desktop (1280px).
- Card height follows the content. Long titles and large values wrap inside the card instead of overflowing it.

## Theming

Colours come only from BDS CSS custom properties, so the cards follow the application theme with no extra code:

| Part | Property | Light | Dark |
| --- | --- | --- | --- |
| Card background | `--color-sf-bg-primary` | `#ffffff` | `#0c111d` |
| Card border | `--color-sf-border-secondary` | `#eaecf0` | `#1f242f` |
| Title | `--color-sf-text-tertiary` | `#475467` | `#94969c` |
| Value | `--color-sf-text-primary` | `#101828` | `#f5f5f6` |

To switch to dark, add `e-dark-mode` to `body`. To switch back, remove it. The cards update immediately, with no new `cardInfoData`. Font size, padding, and radius stay the same across themes.

### Customising with `containerClass` and `iconClass`

The component's own styles have zero specificity (they are wrapped in `:where()`), so any consumer rule targeting your classes wins without `!important`:

```css
/* Global stylesheet of the consuming app */
.card-progress { border-radius: 20px; }
.icon-progress {
  border-radius: 10px;
  background: var(--color-sf-brand-primary);
  color: var(--color-sf-base-white);
}
```

Because the component uses emulated view encapsulation, put these rules in a global stylesheet, or reach them from a parent component with `::ng-deep`.

## Accessibility

- The collection is marked up as a list (`ul` / `li`). Note that Safari/VoiceOver may not expose list semantics for lists styled with `list-style: none`; the title and value text is announced either way.
- Each title and value is plain visible text in the accessibility tree.
- The icon slot is decorative: it has `aria-hidden="true"` and no text.
- With the BDS tokens above, title and value contrast is at least 4.5:1 against the card in both themes (WCAG 2.1 AA).
- Cards are not interactive. They are not focusable and have no keyboard behaviour, because the requirement defines none.

If you add an icon class whose colour carries meaning, also convey that meaning in the title or value.

## SSR and zoneless

- The component works without zone.js (`provideZonelessChangeDetection()`). It uses signal inputs and `computed()`.
- It never touches `window`, `document`, or storage, so server-side rendering is safe. Theme changes are handled purely in CSS.
