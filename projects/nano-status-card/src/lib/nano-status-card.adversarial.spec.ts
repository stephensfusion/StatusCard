import { afterEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardInfo, NanoStatusCard } from '../public-api';
import { setDarkMode } from '../test/bds';
import { CardTestHost, renderCards } from '../test/card-test-host';
import { cardItems, iconElement, isInside, layoutProblem } from '../test/dom-contract';
import {
  LARGE_VALUE,
  LONG_TITLE,
  cardsWithCount,
  hostileCard,
  largeValueCard,
  longTitleCard,
} from '../test/adversarial-helpers';
import { FIGMA_CARD, SCREEN_WIDTHS } from '../test/samples';

describe('NanoStatusCard — adversarial', () => {
  const fixtures: ComponentFixture<unknown>[] = [];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardTestHost, NanoStatusCard],
    }).compileComponents();
  });

  afterEach(() => {
    while (fixtures.length > 0) {
      fixtures.pop()?.destroy();
    }
  });

  it('[ADV][SC-1] should update card and icon appearance in both theme directions', async () => {
    const cards = [
      FIGMA_CARD,
      {
        ...FIGMA_CARD,
        title: 'In Review',
        iconClass: 'icon-review',
        containerClass: 'card-review',
      },
    ];
    const ctx = await renderCards(cards);
    fixtures.push(ctx.fixture);

    const lightBackground = getComputedStyle(
      cardItems(ctx.hostEl)[0] ?? ctx.hostEl,
    ).backgroundColor;
    setDarkMode(true);
    for (const [index, item] of cards.entries()) {
      const card = cardItems(ctx.hostEl)[index];
      expect(card, `card ${index} after dark theme`).toBeTruthy();
      expect(getComputedStyle(card!).backgroundColor).not.toBe(lightBackground);
      const icon = iconElement(card!, item.iconClass);
      expect(icon, `icon ${index}`).not.toBeNull();
      expect(getComputedStyle(icon!).display).not.toBe('none');
      expect(icon!.getBoundingClientRect().width).toBeGreaterThan(0);
    }

    setDarkMode(false);
    const restored = cardItems(ctx.hostEl)[0];
    expect(restored, 'card after returning to light').toBeTruthy();
    expect(getComputedStyle(restored!).backgroundColor).toBe(lightBackground);
    expect(
      iconElement(restored!, FIGMA_CARD.iconClass)?.getBoundingClientRect().width,
    ).toBeGreaterThan(0);
  });

  it.each([1, 2, 5, 12])(
    '[ADV][SC-2] should keep %i cards aligned inside the frame without overlap',
    async (count) => {
      const ctx = await renderCards(cardsWithCount(count), SCREEN_WIDTHS.desktop);
      fixtures.push(ctx.fixture);

      expect(cardItems(ctx.hostEl)).toHaveLength(count);
      expect(layoutProblem(ctx.frame, ctx.hostEl)).toBeNull();
    },
  );

  it('[ADV][SC-3] should keep a long title from breaking the card or the frame', async () => {
    const ctx = await renderCards([longTitleCard(), FIGMA_CARD], SCREEN_WIDTHS.tablet);
    fixtures.push(ctx.fixture);
    const card = cardItems(ctx.hostEl)[0];
    expect(card, 'long-title card').toBeTruthy();
    expect(card!.textContent).toContain(LONG_TITLE);
    const title = Array.from(card!.querySelectorAll<HTMLElement>('*')).find(
      (el) => el.textContent === LONG_TITLE,
    );
    expect(title, 'title element').toBeTruthy();
    expect(isInside(title!.getBoundingClientRect(), card!.getBoundingClientRect())).toBe(true);
    expect(layoutProblem(ctx.frame, ctx.hostEl)).toBeNull();
  });

  it('[ADV][SC-4] should show a large value without overflowing its card', async () => {
    const ctx = await renderCards([largeValueCard()], SCREEN_WIDTHS.mobile);
    fixtures.push(ctx.fixture);
    const card = cardItems(ctx.hostEl)[0];
    expect(card, 'card').toBeTruthy();
    expect(card!.textContent).toContain(LARGE_VALUE);
    const value = Array.from(card!.querySelectorAll<HTMLElement>('*')).find(
      (el) => el.textContent === LARGE_VALUE,
    );
    expect(value, 'value element').toBeTruthy();
    expect(isInside(value!.getBoundingClientRect(), card!.getBoundingClientRect())).toBe(true);
    expect(card!.scrollWidth).toBeLessThanOrEqual(card!.clientWidth + 1);
  });

  it('[ADV][SC-5] should still render a card when its strings are empty', async () => {
    const ctx = await renderCards([{ title: '', value: '', iconClass: '', containerClass: '' }]);
    fixtures.push(ctx.fixture);

    expect(ctx.hostEl.isConnected).toBe(true);
    expect(cardItems(ctx.hostEl)).toHaveLength(1);
  });

  it('[ADV][SC-5] should keep rendering after an incomplete item is replaced by a valid card', async () => {
    const ctx = await renderCards([{ title: 'Only title' } as CardInfo]);
    fixtures.push(ctx.fixture);
    expect(ctx.hostEl.isConnected).toBe(true);

    ctx.host.cards.set([FIGMA_CARD]);
    await ctx.settle();
    expect(cardItems(ctx.hostEl)).toHaveLength(1);
    expect(cardItems(ctx.hostEl)[0].textContent).toContain(FIGMA_CARD.title);
    expect(cardItems(ctx.hostEl)[0].textContent).toContain(FIGMA_CARD.value);
  });

  it('[ADV][SC-5] should keep rendering after a null item is replaced by a valid card', async () => {
    const ctx = await renderCards([null as unknown as CardInfo]);
    fixtures.push(ctx.fixture);
    expect(ctx.hostEl.isConnected).toBe(true);

    ctx.host.cards.set([FIGMA_CARD]);
    await ctx.settle();
    expect(cardItems(ctx.hostEl)).toHaveLength(1);
    expect(cardItems(ctx.hostEl)[0].textContent).toContain(FIGMA_CARD.value);
  });

  it('[ADV][SC-5] should render hostile strings as text and not as elements', async () => {
    const payload = hostileCard();
    const ctx = await renderCards([payload]);
    fixtures.push(ctx.fixture);
    const card = cardItems(ctx.hostEl)[0];
    expect(card, 'card').toBeTruthy();
    expect(card!.textContent).toContain(payload.title);
    expect(card!.textContent).toContain(payload.value);
    expect(ctx.hostEl.querySelector('img, script')).toBeNull();
  });

  it.each([
    ['mobile', SCREEN_WIDTHS.mobile],
    ['tablet', SCREEN_WIDTHS.tablet],
    ['desktop', SCREEN_WIDTHS.desktop],
  ] as const)(
    '[ADV][SC-6] should render 1, 4, and 8 cards inside the %s frame',
    async (_label, width) => {
      for (const count of [1, 4, 8]) {
        const ctx = await renderCards(cardsWithCount(count), width);
        fixtures.push(ctx.fixture);
        expect(cardItems(ctx.hostEl)).toHaveLength(count);
        expect(layoutProblem(ctx.frame, ctx.hostEl)).toBeNull();
      }
    },
  );
});
