import { afterEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import fc from 'fast-check';
import { CardInfo, NanoStatusCard } from '../public-api';
import { NanoStatusCardHarness } from '../../testing/public-api';
import { installConsumerShapeRule, resolveBdsColor, setDarkMode } from '../test/bds';
import { CardTestHost, renderCards, UsageExampleHost } from '../test/card-test-host';
import {
  cardItems,
  elementWithExactText,
  hasClassTokens,
  iconElement,
  isFigmaShadow,
  isInside,
  layoutProblem,
} from '../test/dom-contract';
import {
  LARGE_VALUE,
  LONG_TITLE,
  largeValueCard,
  longTitleCard,
} from '../test/adversarial-helpers';
import { FIGMA_CARD, SAMPLE_CARDS, SCREEN_WIDTHS } from '../test/samples';

const PBT = { seed: 20261117, numRuns: 15 } as const;

function requireText(scope: ParentNode, text: string, what: string): HTMLElement {
  const element = elementWithExactText(scope, text);
  if (!element) {
    throw new Error(`Expected ${what} "${text}" to be rendered`);
  }
  return element;
}

function requireCard(host: HTMLElement, index: number): HTMLElement {
  const card = cardItems(host)[index];
  if (!card) {
    throw new Error(`Expected card ${index} to be rendered (found ${cardItems(host).length})`);
  }
  return card;
}

function paddingEdge(card: HTMLElement): { top: number; right: number; left: number } {
  const rect = card.getBoundingClientRect();
  const style = getComputedStyle(card);
  const borderTop = Number.parseFloat(style.borderTopWidth) || 0;
  const borderRight = Number.parseFloat(style.borderRightWidth) || 0;
  const borderLeft = Number.parseFloat(style.borderLeftWidth) || 0;
  return {
    top: rect.top + borderTop + (Number.parseFloat(style.paddingTop) || 0),
    right: rect.right - borderRight - (Number.parseFloat(style.paddingRight) || 0),
    left: rect.left + borderLeft + (Number.parseFloat(style.paddingLeft) || 0),
  };
}

describe('NanoStatusCard — functional', () => {
  const fixtures: ComponentFixture<unknown>[] = [];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardTestHost, UsageExampleHost, NanoStatusCard],
    }).compileComponents();
  });

  afterEach(() => {
    while (fixtures.length > 0) {
      fixtures.pop()?.destroy();
    }
  });

  it('[FR-1][UT-1] should accept cardInfoData when the parent provides a collection', async () => {
    const fixture = TestBed.createComponent(NanoStatusCard);
    fixtures.push(fixture);
    fixture.componentRef.setInput('cardInfoData', SAMPLE_CARDS);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.cardInfoData()).toEqual(SAMPLE_CARDS);
  });

  it('[UD-1] should use the nano-status-card selector from the usage documentation', async () => {
    const fixture = TestBed.createComponent(UsageExampleHost);
    fixtures.push(fixture);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('nano-status-card')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('nano-nano-status-card')).toBeNull();
  });

  it('[UD-1][UT-3] should render every card from the usage example in source order', async () => {
    const fixture = TestBed.createComponent(UsageExampleHost);
    fixtures.push(fixture);
    fixture.detectChanges();
    await fixture.whenStable();
    const harness =
      await TestbedHarnessEnvironment.loader(fixture).getHarness(NanoStatusCardHarness);

    expect(await harness.getCardCount()).toBe(SAMPLE_CARDS.length);
    for (const [index, card] of SAMPLE_CARDS.entries()) {
      expect(await harness.getCardText(index)).toContain(card.title);
      expect(await harness.getCardText(index)).toContain(card.value);
      expect(await harness.cardHasClass(index, card.containerClass)).toBe(true);
      expect(await harness.getIcon(index, card.iconClass)).not.toBeNull();
    }
  });

  it('[FR-2][UT-2] should render the single supplied card', async () => {
    const ctx = await renderCards([FIGMA_CARD]);
    fixtures.push(ctx.fixture);

    expect(await ctx.harness.getCardCount()).toBe(1);
    expect(await ctx.harness.getCardText(0)).toContain(FIGMA_CARD.title);
    expect(await ctx.harness.getCardText(0)).toContain(FIGMA_CARD.value);
    expect(await ctx.harness.cardHasClass(0, FIGMA_CARD.containerClass)).toBe(true);
    expect(await ctx.harness.getIcon(0, FIGMA_CARD.iconClass)).not.toBeNull();
  });

  it.each(['Requirements Created', 'In Review', 'Completed Requirement'])(
    '[FR-3][UT-4] should display the title "%s" inside its own card',
    async (title) => {
      const card = SAMPLE_CARDS.find((item) => item.title === title);
      if (!card) {
        throw new Error(`Missing sample card for ${title}`);
      }
      const ctx = await renderCards([card]);
      fixtures.push(ctx.fixture);

      expect(requireText(requireCard(ctx.hostEl, 0), title, 'title').textContent).toBe(title);
    },
  );

  it.each(['01', '-', '0'])(
    '[FR-3][UT-5] should display the value "%s" verbatim',
    async (value) => {
      const ctx = await renderCards([{ ...FIGMA_CARD, value }]);
      fixtures.push(ctx.fixture);

      expect(requireText(requireCard(ctx.hostEl, 0), value, 'value').textContent).toBe(value);
    },
  );

  it('[FR-11][UT-6] should apply every iconClass token on a 48px icon slot', async () => {
    const card: CardInfo = { ...FIGMA_CARD, iconClass: 'e-icons icon-progress' };
    const ctx = await renderCards([card]);
    fixtures.push(ctx.fixture);

    const icon = iconElement(requireCard(ctx.hostEl, 0), card.iconClass);
    expect(icon, 'icon slot').not.toBeNull();
    const rect = icon!.getBoundingClientRect();
    expect(Math.abs(rect.width - 48)).toBeLessThanOrEqual(1);
    expect(Math.abs(rect.height - 48)).toBeLessThanOrEqual(1);
    expect(hasClassTokens(icon!, card.iconClass)).toBe(true);
  });

  it('[FR-8][UT-7] should apply containerClass so a consumer rule can change the card shape', async () => {
    installConsumerShapeRule();
    const ctx = await renderCards([{ ...FIGMA_CARD, containerClass: 'consumer-shape' }]);
    fixtures.push(ctx.fixture);

    const card = requireCard(ctx.hostEl, 0);
    expect(hasClassTokens(card, 'consumer-shape')).toBe(true);
    expect(getComputedStyle(card).borderRadius).toBe('20px');
  });

  it('[FR-4][FR-9][UT-8][UT-15] should lay out the Figma card with title above value and the icon at the top end', async () => {
    const ctx = await renderCards([FIGMA_CARD]);
    fixtures.push(ctx.fixture);
    const card = requireCard(ctx.hostEl, 0);
    const title = requireText(card, FIGMA_CARD.title, 'title');
    const value = requireText(card, FIGMA_CARD.value, 'value');
    const icon = iconElement(card, FIGMA_CARD.iconClass);
    expect(icon, 'icon slot').not.toBeNull();

    const titleRect = title.getBoundingClientRect();
    const valueRect = value.getBoundingClientRect();
    const iconRect = icon!.getBoundingClientRect();
    const edge = paddingEdge(card);
    const style = getComputedStyle(card);

    expect(style.paddingTop).toBe('20px');
    expect(style.paddingRight).toBe('20px');
    expect(style.paddingBottom).toBe('20px');
    expect(style.paddingLeft).toBe('20px');
    expect(style.borderTopWidth).toBe('1px');
    expect(style.borderRadius).toBe('12px');
    expect(isFigmaShadow(style.boxShadow)).toBe(true);
    expect(Math.abs(titleRect.left - edge.left)).toBeLessThanOrEqual(1);
    expect(Math.abs(valueRect.left - titleRect.left)).toBeLessThanOrEqual(1);
    expect(valueRect.top).toBeGreaterThan(titleRect.bottom - 1);
    expect(Math.abs(valueRect.top - titleRect.bottom - 12)).toBeLessThanOrEqual(1);
    expect(Math.abs(iconRect.top - edge.top)).toBeLessThanOrEqual(1);
    expect(Math.abs(iconRect.right - edge.right)).toBeLessThanOrEqual(1);
    expect(iconRect.left).toBeGreaterThanOrEqual(titleRect.right - 1);
  });

  it('[FR-9][FR-10][UT-14][UT-15] should use the Figma type styles and the matching BDS colour tokens', async () => {
    const ctx = await renderCards([FIGMA_CARD]);
    fixtures.push(ctx.fixture);
    const card = requireCard(ctx.hostEl, 0);
    const title = requireText(card, FIGMA_CARD.title, 'title');
    const value = requireText(card, FIGMA_CARD.value, 'value');
    const titleStyle = getComputedStyle(title);
    const valueStyle = getComputedStyle(value);
    const cardStyle = getComputedStyle(card);

    expect(titleStyle.fontFamily).toContain('Inter');
    expect(titleStyle.fontSize).toBe('14px');
    expect(titleStyle.fontWeight).toBe('500');
    expect(titleStyle.lineHeight).toBe('20px');
    expect(titleStyle.color).toBe(resolveBdsColor('--color-sf-text-tertiary'));
    expect(valueStyle.fontFamily).toContain('Inter');
    expect(valueStyle.fontSize).toBe('30px');
    expect(valueStyle.fontWeight).toBe('600');
    expect(valueStyle.lineHeight).toBe('38px');
    expect(valueStyle.color).toBe(resolveBdsColor('--color-sf-text-primary'));
    expect(cardStyle.backgroundColor).toBe(resolveBdsColor('--color-sf-bg-primary'));
    expect(cardStyle.borderTopColor).toBe(resolveBdsColor('--color-sf-border-secondary'));
  });

  it('[FR-6][UT-9] should update every card colour when .e-dark-mode is toggled and the collection is unchanged', async () => {
    const ctx = await renderCards(SAMPLE_CARDS);
    fixtures.push(ctx.fixture);

    setDarkMode(true);
    for (const [index, item] of SAMPLE_CARDS.entries()) {
      const card = requireCard(ctx.hostEl, index);
      const title = requireText(card, item.title, 'title');
      expect(getComputedStyle(card).backgroundColor).toBe(resolveBdsColor('--color-sf-bg-primary'));
      expect(getComputedStyle(title).color).toBe(resolveBdsColor('--color-sf-text-tertiary'));
      expect(getComputedStyle(requireText(card, item.value, 'value')).color).toBe(
        resolveBdsColor('--color-sf-text-primary'),
      );
    }

    setDarkMode(false);
    const first = requireCard(ctx.hostEl, 0);
    expect(getComputedStyle(first).backgroundColor).toBe('rgb(255, 255, 255)');
    expect(getComputedStyle(requireText(first, SAMPLE_CARDS[0].title, 'title')).color).toBe(
      'rgb(71, 84, 103)',
    );
  });

  it('[FR-6][UT-10] should keep every icon visible after the theme changes', async () => {
    const ctx = await renderCards(SAMPLE_CARDS);
    fixtures.push(ctx.fixture);
    setDarkMode(true);

    for (const [index, item] of SAMPLE_CARDS.entries()) {
      const icon = iconElement(requireCard(ctx.hostEl, index), item.iconClass);
      expect(icon, `icon ${index}`).not.toBeNull();
      const style = getComputedStyle(icon!);
      expect(style.display).not.toBe('none');
      expect(style.visibility).not.toBe('hidden');
      expect(icon!.getBoundingClientRect().width).toBeGreaterThan(0);
      expect(icon!.getBoundingClientRect().height).toBeGreaterThan(0);
    }
  });

  it.each([
    ['mobile', SCREEN_WIDTHS.mobile],
    ['tablet', SCREEN_WIDTHS.tablet],
    ['desktop', SCREEN_WIDTHS.desktop],
  ] as const)(
    '[FR-7][UT-11] should keep the sample cards inside the %s frame',
    async (_label, width) => {
      const ctx = await renderCards(SAMPLE_CARDS, width);
      fixtures.push(ctx.fixture);

      expect(await ctx.harness.getCardCount()).toBe(SAMPLE_CARDS.length);
      expect(layoutProblem(ctx.frame, ctx.hostEl)).toBeNull();
    },
  );

  it('[UT-12] should keep a long title inside its card without widening the frame', async () => {
    const ctx = await renderCards([longTitleCard()], SCREEN_WIDTHS.mobile);
    fixtures.push(ctx.fixture);
    const card = requireCard(ctx.hostEl, 0);
    const title = requireText(card, LONG_TITLE, 'title');

    expect(card.textContent).toContain(LONG_TITLE);
    expect(isInside(title.getBoundingClientRect(), card.getBoundingClientRect())).toBe(true);
    expect(layoutProblem(ctx.frame, ctx.hostEl)).toBeNull();
  });

  it('[UT-13] should keep a large value inside its card without overflowing it', async () => {
    const ctx = await renderCards([largeValueCard()], SCREEN_WIDTHS.mobile);
    fixtures.push(ctx.fixture);
    const card = requireCard(ctx.hostEl, 0);
    const value = requireText(card, LARGE_VALUE, 'value');

    expect(card.textContent).toContain(LARGE_VALUE);
    expect(isInside(value.getBoundingClientRect(), card.getBoundingClientRect())).toBe(true);
    expect(layoutProblem(ctx.frame, ctx.hostEl)).toBeNull();
  });

  it.each([0, 1, 8])(
    '[FR-5] should render %i cards when the parent supplies that many',
    async (count) => {
      const cards = Array.from({ length: count }, (_, index) => ({
        title: `Status ${index + 1}`,
        value: String(index + 1),
        iconClass: 'icon-progress',
        containerClass: 'card-progress',
      }));
      const ctx = await renderCards(cards);
      fixtures.push(ctx.fixture);

      expect(await ctx.harness.getCardCount()).toBe(count);
      for (const [index, card] of cards.entries()) {
        expect(await ctx.harness.getCardText(index)).toContain(card.title);
      }
    },
  );

  it('[FR-2] should show two cards that share a title as two cards', async () => {
    const cards: CardInfo[] = [
      { ...FIGMA_CARD, value: '01', containerClass: 'card-progress' },
      { ...FIGMA_CARD, value: '02', iconClass: 'icon-review', containerClass: 'card-review' },
    ];
    const ctx = await renderCards(cards);
    fixtures.push(ctx.fixture);

    expect(await ctx.harness.getCardCount()).toBe(2);
    expect(await ctx.harness.getCardText(0)).toContain('01');
    expect(await ctx.harness.getCardText(1)).toContain('02');
    expect(await ctx.harness.getCardText(0)).not.toContain('02');
  });

  it('[FR-2] should show only the latest collection after successive replacements', async () => {
    const ctx = await renderCards(SAMPLE_CARDS);
    fixtures.push(ctx.fixture);

    ctx.host.cards.set([FIGMA_CARD]);
    await ctx.settle();
    expect(await ctx.harness.getCardCount()).toBe(1);
    expect(await ctx.harness.getCardText(0)).toContain(FIGMA_CARD.value);

    ctx.host.cards.set([]);
    await ctx.settle();
    expect(await ctx.harness.getCardCount()).toBe(0);

    ctx.host.cards.set([SAMPLE_CARDS[2]]);
    await ctx.settle();
    expect(await ctx.harness.getCardCount()).toBe(1);
    expect(await ctx.harness.getCardText(0)).toContain('In Review');
    expect(await ctx.harness.getCardText(0)).not.toContain('Requirements Created');
  });

  it('[FEAT-4] should keep type size, padding, and radius stable when the theme changes', async () => {
    const ctx = await renderCards([FIGMA_CARD]);
    fixtures.push(ctx.fixture);
    const beforeCard = requireCard(ctx.hostEl, 0);
    const beforeTitle = getComputedStyle(requireText(beforeCard, FIGMA_CARD.title, 'title'));
    const beforeValue = getComputedStyle(requireText(beforeCard, FIGMA_CARD.value, 'value'));
    const snapshot = {
      fontSize: beforeTitle.fontSize,
      valueSize: beforeValue.fontSize,
      titleColor: beforeTitle.color,
      padding: getComputedStyle(beforeCard).paddingTop,
      radius: getComputedStyle(beforeCard).borderRadius,
    };

    setDarkMode(true);
    const afterCard = requireCard(ctx.hostEl, 0);
    const afterTitle = getComputedStyle(requireText(afterCard, FIGMA_CARD.title, 'title'));
    const afterValue = getComputedStyle(requireText(afterCard, FIGMA_CARD.value, 'value'));
    expect(afterTitle.fontSize).toBe(snapshot.fontSize);
    expect(afterValue.fontSize).toBe(snapshot.valueSize);
    expect(getComputedStyle(afterCard).paddingTop).toBe(snapshot.padding);
    expect(getComputedStyle(afterCard).borderRadius).toBe(snapshot.radius);
    expect(afterTitle.color).not.toBe(snapshot.titleColor);
  });

  it('[FR-2][FR-3][PBT] should render any collection of titles and values in source order', async () => {
    const text = (min: number, max: number) =>
      fc
        .string({ minLength: min, maxLength: max, unit: 'grapheme' })
        .filter((value) => value.trim().length > 0 && !/[\n\r\u0000]/.test(value));
    const cardArb = fc
      .record({
        title: text(1, 24),
        value: text(1, 8),
        iconClass: fc.constantFrom('icon-progress', 'icon-review'),
        containerClass: fc.constantFrom('card-progress', 'card-review'),
      })
      .filter((card) => !card.title.includes(card.value) && !card.value.includes(card.title));

    await fc.assert(
      fc.asyncProperty(fc.array(cardArb, { minLength: 1, maxLength: 5 }), async (cards) => {
        const ctx = await renderCards(cards);
        try {
          expect(await ctx.harness.getCardCount()).toBe(cards.length);
          for (const [index, card] of cards.entries()) {
            expect(await ctx.harness.getCardText(index)).toContain(card.title);
            expect(await ctx.harness.getCardText(index)).toContain(card.value);
            expect(await ctx.harness.cardHasClass(index, card.containerClass)).toBe(true);
          }
        } finally {
          ctx.fixture.destroy();
        }
      }),
      PBT,
    );
  });
});
