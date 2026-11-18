import {
  BaseHarnessFilters,
  ComponentHarness,
  HarnessPredicate,
  TestElement,
} from '@angular/cdk/testing';

/** Public DOM contract selectors for `<nano-status-card>` (see API_CONTRACT.md §3). */
export const NANO_STATUS_CARD_SELECTORS = {
  host: 'nano-status-card',
  list: 'ul',
  card: 'ul > li',
} as const;

/** Filters for locating a `NanoStatusCardHarness`. */
export interface NanoStatusCardHarnessFilters extends BaseHarnessFilters {
  /** Matches the `id` attribute of the `<nano-status-card>` host element. */
  id?: string;
}

/** Builds a CSS class selector from a consumer class string. Empty input yields `''`. */
function classSelector(className: string): string {
  return className
    .split(/\s+/)
    .filter((token) => token.length > 0)
    .map((token) => `.${CSS.escape(token)}`)
    .join('');
}

/**
 * Component harness for `<nano-status-card>`.
 * Locators follow the public DOM contract: a `ul` of `li` cards inside the host.
 */
export class NanoStatusCardHarness extends ComponentHarness {
  static hostSelector = NANO_STATUS_CARD_SELECTORS.host;

  /** Creates a predicate to find a `NanoStatusCardHarness` that matches the given filters. */
  static with(options: NanoStatusCardHarnessFilters = {}): HarnessPredicate<NanoStatusCardHarness> {
    return new HarnessPredicate(NanoStatusCardHarness, options).addOption(
      'id',
      options.id,
      async (harness, id) => (await (await harness.host()).getAttribute('id')) === id,
    );
  }

  private readonly listOptional = this.locatorForOptional(NANO_STATUS_CARD_SELECTORS.list);
  private readonly cards = this.locatorForAll(NANO_STATUS_CARD_SELECTORS.card);

  /** The card list, or null when it is not in the DOM. */
  async getList(): Promise<TestElement | null> {
    return this.listOptional();
  }

  /** Card elements (`ul > li`) in DOM order. */
  async getCards(): Promise<TestElement[]> {
    return this.cards();
  }

  /** Number of rendered cards. */
  async getCardCount(): Promise<number> {
    return (await this.cards()).length;
  }

  /** Full text of the card at `index`, or `''` when that card is absent. */
  async getCardText(index: number): Promise<string> {
    const card = (await this.cards())[index];
    return card ? card.text() : '';
  }

  /** Whether the card at `index` carries `className` as a class token. */
  async cardHasClass(index: number, className: string): Promise<boolean> {
    const card = (await this.cards())[index];
    if (!card || className.length === 0) {
      return false;
    }
    const tokens = className.split(/\s+/).filter((token) => token.length > 0);
    const checks = await Promise.all(tokens.map((token) => card.hasClass(token)));
    return checks.every(Boolean);
  }

  /**
   * The icon slot of the card at `index`: the descendant that carries every
   * token in `iconClass`. Null when the card or the icon is absent.
   */
  async getIcon(index: number, iconClass: string): Promise<TestElement | null> {
    const selector = classSelector(iconClass);
    if (selector.length === 0) {
      return null;
    }
    return this.locatorForOptional(`ul > li:nth-child(${index + 1}) ${selector}`)();
  }
}
