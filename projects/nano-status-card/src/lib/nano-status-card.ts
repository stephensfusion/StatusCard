import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * One status card supplied by the parent component.
 *
 * Source: requirement Usage Documentation, Model.
 */
export interface CardInfo {
  /** Status label rendered in the card, verbatim. */
  title: string;
  /** Status figure rendered in the card, verbatim (for example `01` or `-`). */
  value: string;
  /** Space-separated CSS class tokens applied to the 48×48 icon slot. */
  iconClass: string;
  /** Space-separated CSS class tokens applied to the card root (`li`). */
  containerClass: string;
}

/** Returns `value` when it is a string, otherwise `''`. Internal; not exported. */
function asText(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

/**
 * Turns the raw input into renderable cards. Entries that are not objects (for
 * example `null`) are skipped, and missing or non-string fields become `''`, so
 * malformed data never throws during rendering (API_CONTRACT G-5). Internal.
 */
function toRenderableCards(data: readonly CardInfo[] | null | undefined): CardInfo[] {
  if (!Array.isArray(data)) {
    return [];
  }
  const cards: CardInfo[] = [];
  for (const item of data as readonly unknown[]) {
    if (typeof item !== 'object' || item === null) {
      continue;
    }
    const raw = item as Partial<Record<keyof CardInfo, unknown>>;
    cards.push({
      title: asText(raw.title),
      value: asText(raw.value),
      iconClass: asText(raw.iconClass),
      containerClass: asText(raw.containerClass),
    });
  }
  return cards;
}

/**
 * `<nano-status-card>` renders the `cardInfoData` collection as a list of status
 * cards styled with the BDS CSS library.
 *
 * - Each card shows its `title`, its `value`, and a 48×48 icon slot that carries
 *   `iconClass`. The card root carries `containerClass`.
 * - Cards render as a `ul` of `li` elements, in source order. They share the
 *   parent's width and wrap onto new rows on narrow screens.
 * - Colours come from BDS `--color-sf-*` tokens, so adding or removing
 *   `.e-dark-mode` on `body` re-themes every card without a new input value.
 * - The icon slot is decorative (`aria-hidden="true"`).
 *
 * The consuming application loads `https://cdn.syncfusion.com/ej2/32.1.19/bds.css`.
 * See `API_CONTRACT.md` conflict C-1 for the `[CardInfo]` snippet versus the
 * `cardInfoData` input.
 *
 * @example
 * ```html
 * <nano-status-card [cardInfoData]="cardInfoData"></nano-status-card>
 * ```
 */
@Component({
  selector: 'nano-status-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './nano-status-card.html',
  styleUrl: './nano-status-card.css',
})
export class NanoStatusCard {
  /**
   * Cards to render, in source order. The binding is required and has no default.
   *
   * The requirement writes this as `@Input({ required: true }) cardInfoData`.
   * `input.required()` is the Angular 22 signal form of the same required input.
   * Replacing the array replaces the rendered cards. An empty array renders no list.
   */
  readonly cardInfoData = input.required<CardInfo[]>();

  /** Renderable view of `cardInfoData`. Internal to the template. */
  protected readonly cards = computed(() => toRenderableCards(this.cardInfoData()));
}
