import { afterEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NanoStatusCard } from '../public-api';
import { axeWcag } from '../test/axe';
import { setDarkMode } from '../test/bds';
import { CardTestHost, renderCards } from '../test/card-test-host';
import { cardItems, contrastRatio, elementWithExactText, iconElement } from '../test/dom-contract';
import { LONG_TITLE, longTitleCard } from '../test/adversarial-helpers';
import { FIGMA_CARD, SAMPLE_CARDS } from '../test/samples';

function requireText(scope: ParentNode, text: string, what: string): HTMLElement {
  const element = elementWithExactText(scope, text);
  if (!element) {
    throw new Error(`Expected ${what} "${text}" to be rendered`);
  }
  return element;
}

describe('NanoStatusCard — accessibility', () => {
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

  it('[A11Y][FR-12][single] should expose the title and value, hide the icon from assistive tech, and pass axe', async () => {
    const ctx = await renderCards([FIGMA_CARD]);
    fixtures.push(ctx.fixture);
    const card = cardItems(ctx.hostEl)[0];
    expect(card, 'card').toBeTruthy();
    expect(ctx.hostEl.querySelector('ul')).not.toBeNull();
    expect(card!.tagName).toBe('LI');

    const title = requireText(card!, FIGMA_CARD.title, 'title');
    const value = requireText(card!, FIGMA_CARD.value, 'value');
    expect(title.textContent).toBe(FIGMA_CARD.title);
    expect(value.textContent).toBe(FIGMA_CARD.value);

    const icon = iconElement(card!, FIGMA_CARD.iconClass);
    expect(icon, 'icon').not.toBeNull();
    expect(icon!.getAttribute('aria-hidden')).toBe('true');
    expect(icon!.textContent?.trim() ?? '').toBe('');

    const background = getComputedStyle(card!).backgroundColor;
    expect(contrastRatio(getComputedStyle(title).color, background)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(getComputedStyle(value).color, background)).toBeGreaterThanOrEqual(4.5);
    await expect(axeWcag(ctx.hostEl)).resolves.toHaveNoViolations();
  });

  it('[A11Y][FR-12][sample] should expose every sample card as a list item without axe violations', async () => {
    const ctx = await renderCards(SAMPLE_CARDS);
    fixtures.push(ctx.fixture);
    const cards = cardItems(ctx.hostEl);

    expect(cards).toHaveLength(SAMPLE_CARDS.length);
    for (const [index, item] of SAMPLE_CARDS.entries()) {
      expect(cards[index].tagName).toBe('LI');
      expect(requireText(cards[index], item.title, 'title').textContent).toBe(item.title);
      expect(requireText(cards[index], item.value, 'value').textContent).toBe(item.value);
      expect(iconElement(cards[index], item.iconClass)?.getAttribute('aria-hidden')).toBe('true');
    }
    await expect(axeWcag(ctx.hostEl)).resolves.toHaveNoViolations();
  });

  it('[A11Y][FR-12][empty] should leave an empty collection in the document without axe violations', async () => {
    const ctx = await renderCards([]);
    fixtures.push(ctx.fixture);

    expect(ctx.hostEl.isConnected).toBe(true);
    expect(cardItems(ctx.hostEl)).toHaveLength(0);
    expect(ctx.hostEl.textContent?.trim() ?? '').toBe('');
    await expect(axeWcag(ctx.hostEl)).resolves.toHaveNoViolations();
  });

  it('[A11Y][FR-12][dark] should keep 4.5:1 contrast for title and value in the dark theme', async () => {
    const ctx = await renderCards([FIGMA_CARD]);
    fixtures.push(ctx.fixture);
    setDarkMode(true);

    const card = cardItems(ctx.hostEl)[0];
    expect(card, 'card').toBeTruthy();
    const title = requireText(card!, FIGMA_CARD.title, 'title');
    const value = requireText(card!, FIGMA_CARD.value, 'value');
    const background = getComputedStyle(card!).backgroundColor;
    expect(contrastRatio(getComputedStyle(title).color, background)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(getComputedStyle(value).color, background)).toBeGreaterThanOrEqual(4.5);
    await expect(axeWcag(ctx.hostEl)).resolves.toHaveNoViolations();
  });

  it('[A11Y][FR-12][long-title] should keep a long title in the accessibility tree without axe violations', async () => {
    const ctx = await renderCards([longTitleCard()]);
    fixtures.push(ctx.fixture);
    const card = cardItems(ctx.hostEl)[0];
    expect(card, 'card').toBeTruthy();
    expect(card!.textContent).toContain(LONG_TITLE);
    await expect(axeWcag(ctx.hostEl)).resolves.toHaveNoViolations();
  });
});
