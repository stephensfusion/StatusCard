# nano-status-card — Public API Contract

|          |                                                                                                                                        |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Package  | `nano-status-card` (testing entry point `nano-status-card/testing`)                                                                    |
| Selector | `nano-status-card`                                                                                                                     |
| Angular  | 22.2.x, standalone, signal inputs, `OnPush`, zoneless                                                                                  |
| Styling  | BDS CSS `https://cdn.syncfusion.com/ej2/32.1.19/bds.css`, loaded by the consuming application                                          |
| Sources  | Requirement "Status Card" (FR-1…FR-12, FEAT-1…FEAT-4, UT-1…UT-16, ADV-1…ADV-6); Figma `LAocEcfNCMpFgKRT0oVDU4` node `1:34` (inspected) |

The component renders a parent-supplied collection of status cards. It does not own ticket data, navigation, or click behaviour. No global configuration is specified, so `provideNanoStatusCard()` and `NANO_STATUS_CARD_CONFIG` are not part of this package.

## Requirement IDs

| ID          | Requirement                                                                                                                                            |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| FR-1        | Accept `cardInfoData` from the parent. The requirement writes `@Input({ required: true }) cardInfoData`.                                               |
| FR-2        | Display every card in the collection.                                                                                                                  |
| FR-3        | Display title, value, and icon for each card.                                                                                                          |
| FR-4        | Support configurable card shape and positioning of title, value, and icon.                                                                             |
| FR-5        | Render any number of cards the parent provides, including zero.                                                                                        |
| FR-6        | Propagate application theme changes automatically.                                                                                                     |
| FR-7        | Arrange cards across screen sizes.                                                                                                                     |
| FR-8        | Apply `containerClass` on each card.                                                                                                                   |
| FR-9        | Match the approved Figma design for spacing, fonts, colours, and layout.                                                                               |
| FR-10       | Use BDS CSS 32.1.19 as the styling framework.                                                                                                          |
| FR-11       | Display the icon with the supplied `iconClass`.                                                                                                        |
| FR-12       | Readable content, contrast, and accessibility support.                                                                                                 |
| FEAT-1      | Design matches the approved Figma design. Same bar as FR-9.                                                                                            |
| FEAT-2      | Light and dark theme changes propagate. Same bar as FR-6.                                                                                              |
| FEAT-3      | Use the BDS stylesheet. Same bar as FR-10.                                                                                                             |
| FEAT-4      | Typography, colours, spacing, and card appearance stay consistent across themes. Colours change with the theme; type size, padding, and radius do not. |
| UD-1        | Usage documentation: selector, model, and input.                                                                                                       |
| UT-1…UT-16  | Unit tests in the requirement, mapped onto the cases below.                                                                                            |
| ADV-1…ADV-6 | Adversarial cases SC-1…SC-6.                                                                                                                           |

## Conflicts and gaps

| ID  | Source conflict or gap                                                                                                                                                   | Resolution used by the tests                                                                                                                                                                                   |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C-1 | The component snippet binds `[CardInfo]="cardInfoData"`. The Usage Input line and FR-1 name the input `cardInfoData: CardInfo[]`.                                        | The public input is `cardInfoData`. `[CardInfo]` is the model name, not a second input. The verified example is `<nano-status-card [cardInfoData]="cardInfoData">`.                                            |
| C-2 | Figma sets `whitespace: nowrap` on the text column. UT-12, UT-13, ADV-3, and ADV-4 say long titles and large values must not break the layout or overflow.               | Long content stays inside the card and the card stays inside the parent frame. `nowrap` is not required.                                                                                                       |
| C-3 | Figma node `1:34` draws one purple file-plus icon. The requirement says the icon comes from `iconClass`, and the sample screenshot uses different icon colours per card. | The library does not paint that glyph. It renders a 48×48 slot that carries the consumer's `iconClass`.                                                                                                        |
| G-1 | FR-4 asks for configurable shape and positioning, and the only related input is `containerClass`.                                                                        | Default layout is the Figma layout. `containerClass` is applied on the card root so a consumer stylesheet can change shape (tested with border radius). No layout-enum input is added.                         |
| G-2 | The Figma frame is 322×110. The sample shows a row of cards, and FR-7 asks for responsive arrangement.                                                                   | 322 is not a fixed card width. Height follows content. Cards share the parent width, wrap when needed, and stay inside it.                                                                                     |
| G-3 | The sample shows a gap between cards. The linked Figma node is a single card and names no inter-card gap.                                                                | Tests require no overlap and left-to-right order within a row. They do not require a specific gap.                                                                                                             |
| G-4 | The requirement names mobile, tablet, and desktop and does not give pixel widths.                                                                                        | Tests use 320, 768, and 1280 as those three widths.                                                                                                                                                            |
| G-5 | ADV-5 says missing or invalid card data must not cause a rendering failure. It does not define invalid data or a fallback.                                               | Empty strings still produce one card. A null item or an item missing fields must not throw, and a later valid collection must still render. Hostile strings are text, not HTML. No fallback copy is specified. |
| G-6 | FR-1 marks the input required. ADV-5 says missing data must not break rendering.                                                                                         | "Missing" in ADV-5 is interpreted as empty or malformed collection entries, not as omitting the required binding. Tests always provide the binding.                                                            |
| G-7 | No keyboard behaviour, focus trap, or card accessible name is specified. The Figma icon has an empty text alternative.                                                   | Cards are not buttons. The icon slot is `aria-hidden="true"` and has no text. Title and value are visible text. axe covers WCAG 2.0/2.1 A and AA.                                                              |

Signal mapping: FR-1's `@Input({ required: true }) cardInfoData` is `input.required<CardInfo[]>()`. That is the approved Angular 22 signal form of the same required input. It adds no default and no extra behaviour.

## 1. `CardInfo`

```ts
export interface CardInfo {
  title: string;
  value: string;
  iconClass: string;
  containerClass: string;
}
```

| Field            | Type     | Meaning                                                                | Source            |
| ---------------- | -------- | ---------------------------------------------------------------------- | ----------------- |
| `title`          | `string` | Label rendered in the card. Shown verbatim, including an empty string. | UD-1, FR-3, UT-4  |
| `value`          | `string` | Figure rendered in the card. Shown verbatim (`01`, `-`, `0`, empty).   | UD-1, FR-3, UT-5  |
| `iconClass`      | `string` | Space-separated class tokens applied to the icon slot.                 | UD-1, FR-11, UT-6 |
| `containerClass` | `string` | Space-separated class tokens applied to the card root.                 | UD-1, FR-8, UT-7  |

No error type is specified for a malformed object. See G-5.

## 2. `NanoStatusCard`

```ts
@Component({
  selector: 'nano-status-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NanoStatusCard {
  readonly cardInfoData: InputSignal<CardInfo[]>; // input.required, no default
}
```

| Member         | Kind                           | Default | Behaviour                                                                                                                                                 | Source                 |
| -------------- | ------------------------------ | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `cardInfoData` | `input.required<CardInfo[]>()` | none    | The cards to render, in source order. Replacing the array replaces the rendered cards in the same change-detection turn. An empty array renders no cards. | FR-1, FR-2, FR-5, UD-1 |

There are no outputs, no content-projection slots, and no host attributes other than the selector.

### Usage example

```html
<nano-status-card [cardInfoData]="cardInfoData"></nano-status-card>
```

```ts
cardInfoData: CardInfo[] = [
  { title: 'Requirements Created', value: '01', iconClass: 'icon-created', containerClass: 'card-created' },
  { title: 'In Progress', value: '01', iconClass: 'icon-progress', containerClass: 'card-progress' },
  { title: 'In Review', value: '-', iconClass: 'icon-review', containerClass: 'card-review' },
  { title: 'Completed Requirement', value: '-', iconClass: 'icon-done', containerClass: 'card-done' },
];
```

The titles and values are the requirement sample. The class tokens are representative; the sample does not name them. The Figma node uses title `In Progress` and value `-`.

## 3. Public DOM contract

Default view encapsulation (emulated), so a consumer stylesheet can reach the card. Shadow DOM would block `containerClass` rules (FR-8).

| Part  | Selector                   | Contract                                                                                                          |
| ----- | -------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Host  | `nano-status-card`         | One host per component instance.                                                                                  |
| List  | `nano-status-card ul`      | Present when at least one card is rendered.                                                                       |
| Card  | `nano-status-card ul > li` | One `li` per `CardInfo`, in source order. The `li` carries every token in `containerClass`.                       |
| Title | descendant of the card     | An element whose text content is exactly `title`.                                                                 |
| Value | descendant of the card     | A different element whose text content is exactly `value`.                                                        |
| Icon  | descendant of the card     | The element that carries every token in `iconClass`. It is the 48×48 slot, `aria-hidden="true"`, and has no text. |

`NanoStatusCardHarness` in `nano-status-card/testing` locates these parts. Load it with `TestbedHarnessEnvironment.loader(fixture)`.

## 4. Visual contract (Figma node `1:34`)

Measured on the card whose title is `In Progress` and whose value is `-`.

| Property          | Expected                                                                         | Token                                                           |
| ----------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Padding           | 20px on all sides                                                                | Figma padding                                                   |
| Border            | 1px solid                                                                        | `--color-sf-border-secondary` (`#eaecf0` light, `#1f242f` dark) |
| Radius            | 12px, unless `containerClass` overrides it                                       | Figma `radius-xl`                                               |
| Background        | BDS background token                                                             | `--color-sf-bg-primary` (`#fff` light, `#0c111d` dark)          |
| Shadow            | offset (0, 1), blur 2, spread 0, `#101828` at about 5% alpha                     | Figma `shadow-xs`                                               |
| Title             | Inter, 14px, weight 500, line-height 20px                                        | `--color-sf-text-tertiary` (`#475467` light, `#94969c` dark)    |
| Value             | Inter, 30px, weight 600, line-height 38px                                        | `--color-sf-text-primary` (`#101828` light, `#f5f5f6` dark)     |
| Title / value gap | 12px                                                                             | Figma `spacing-lg`                                              |
| Title and value   | left edge on the left padding edge; title above value                            | Figma                                                           |
| Icon              | 48×48, top and inline-end on the padding edges, to the right of the title in LTR | Figma icon frame                                                |

BDS loads the Inter face and does not set it on `body`. The card sets `font-family` so the computed family contains `Inter`.

Theme switches by adding or removing `.e-dark-mode` on `body`. Colours follow the tokens above without a new `cardInfoData` value. Type size, padding, and radius stay the same (FEAT-4). Icons stay visible (non-zero box, not `display: none`, not `visibility: hidden`).

## 5. Layout and resilience

| Case                                           | Expected                                                                                                                    | Source                          |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| 0 cards                                        | Host stays in the document. No `li`. No thrown error.                                                                       | FR-5                            |
| N cards                                        | N `li` elements, source order, no overlap, left-to-right within a row, inside the parent frame.                             | FR-2, FR-5, FR-7, ADV-2         |
| Widths 320, 768, 1280                          | The same rules.                                                                                                             | FR-7, ADV-6, G-4                |
| Long title, large value                        | The full string is in the card text. The text element sits inside the card. The frame does not gain a horizontal scrollbar. | UT-12, UT-13, ADV-3, ADV-4, C-2 |
| Empty strings                                  | One card, no throw.                                                                                                         | ADV-5, G-5                      |
| Null or partial item, then a valid collection  | No throw. The valid collection then renders.                                                                                | ADV-5, G-5                      |
| Title `<img …>` and value `<script>…</script>` | Both strings are text. No `img` or `script` element is created.                                                             | ADV-5                           |
| Two cards with the same title                  | Both render, each with its own value.                                                                                       | FR-2                            |

## 6. Accessibility contract

| Item          | Contract                                                                                                                            | Source               |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| Structure     | `ul` / `li` for the collection                                                                                                      | FR-12                |
| Text          | Title and value are in the accessibility tree as their exact strings                                                                | FR-12, UT-16         |
| Icon          | `aria-hidden="true"`, no text alternative                                                                                           | Figma empty alt, G-7 |
| Contrast      | Title and value against the card background are at least 4.5:1 in light and dark                                                    | FR-12                |
| axe           | No WCAG 2.0/2.1 A or AA violations on the host for one card, the sample set, the empty collection, the dark theme, and a long title | FR-12, UT-16         |
| Not specified | Keyboard activation, focus movement, a card name beyond the visible text                                                            | G-7                  |

## 7. Testing entry point — `nano-status-card/testing`

```ts
export const NANO_STATUS_CARD_SELECTORS: { host: 'nano-status-card'; list: 'ul'; card: 'ul > li' };

export interface NanoStatusCardHarnessFilters extends BaseHarnessFilters {
  id?: string;
}

export class NanoStatusCardHarness extends ComponentHarness {
  static hostSelector: 'nano-status-card';
  static with(options?: NanoStatusCardHarnessFilters): HarnessPredicate<NanoStatusCardHarness>;
  getList(): Promise<TestElement | null>;
  getCards(): Promise<TestElement[]>;
  getCardCount(): Promise<number>;
  getCardText(index: number): Promise<string>;
  cardHasClass(index: number, className: string): Promise<boolean>;
  getIcon(index: number, iconClass: string): Promise<TestElement | null>;
}
```

`@angular/cdk` is an optional peer dependency, required only for this entry point.
