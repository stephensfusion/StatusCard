import { NANO_STATUS_CARD_SELECTORS } from '../../testing/public-api';

/** Card roots (`ul > li`) inside a `<nano-status-card>` host, in DOM order. */
export function cardItems(host: HTMLElement): HTMLElement[] {
  return Array.from(host.querySelectorAll<HTMLElement>(NANO_STATUS_CARD_SELECTORS.card));
}

/**
 * Deepest element whose own text content is exactly `text`.
 * Returns null when title and value are not separate elements.
 */
export function elementWithExactText(scope: ParentNode, text: string): HTMLElement | null {
  const matches = Array.from(scope.querySelectorAll<HTMLElement>('*')).filter(
    (el) => el.textContent === text,
  );
  if (matches.length === 0) {
    return null;
  }
  return matches.reduce((deepest, el) => (deepest.contains(el) ? el : deepest));
}

/** Descendant that carries every token in `iconClass`. */
export function iconElement(card: HTMLElement, iconClass: string): HTMLElement | null {
  const tokens = iconClass.split(/\s+/).filter((token) => token.length > 0);
  if (tokens.length === 0) {
    return null;
  }
  return (
    Array.from(card.querySelectorAll<HTMLElement>('*')).find((el) =>
      tokens.every((token) => el.classList.contains(token)),
    ) ?? null
  );
}

export function hasClassTokens(el: HTMLElement, className: string): boolean {
  const tokens = className.split(/\s+/).filter((token) => token.length > 0);
  return tokens.length > 0 && tokens.every((token) => el.classList.contains(token));
}

export interface Rgb {
  r: number;
  g: number;
  b: number;
  a: number;
}

/** Parses a computed `rgb()` / `rgba()` colour. Returns null for any other format. */
export function parseRgb(value: string): Rgb | null {
  const match = value.match(
    /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/,
  );
  if (!match) {
    return null;
  }
  return {
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3]),
    a: match[4] === undefined ? 1 : Number(match[4]),
  };
}

function channel(value: number): number {
  const s = value / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(color: Rgb): number {
  return 0.2126 * channel(color.r) + 0.7152 * channel(color.g) + 0.0722 * channel(color.b);
}

/** WCAG contrast ratio of two opaque colours. Alpha is ignored; callers must pass painted colours. */
export function contrastRatio(foreground: string, background: string): number {
  const fg = parseRgb(foreground);
  const bg = parseRgb(background);
  if (!fg || !bg) {
    return 0;
  }
  const lighter = Math.max(relativeLuminance(fg), relativeLuminance(bg));
  const darker = Math.min(relativeLuminance(fg), relativeLuminance(bg));
  return (lighter + 0.05) / (darker + 0.05);
}

export function boxesOverlap(a: DOMRect, b: DOMRect): boolean {
  return (
    a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1
  );
}

/** True when `inner` sits inside `outer`, allowing one pixel of rounding. */
export function isInside(inner: DOMRect, outer: DOMRect): boolean {
  return (
    inner.left >= outer.left - 1 &&
    inner.right <= outer.right + 1 &&
    inner.top >= outer.top - 1 &&
    inner.bottom <= outer.bottom + 1
  );
}

/**
 * Null when the cards stay inside the frame, do not overlap, and read left-to-right
 * within each row. Otherwise a short description of the broken layout.
 */
export function layoutProblem(frame: HTMLElement, host: HTMLElement): string | null {
  if (frame.scrollWidth > frame.clientWidth + 1) {
    return `frame overflows: scrollWidth ${frame.scrollWidth} > clientWidth ${frame.clientWidth}`;
  }
  const frameRect = frame.getBoundingClientRect();
  const cards = cardItems(host);
  for (let i = 0; i < cards.length; i++) {
    const rect = cards[i].getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      return `card ${i} has no size`;
    }
    if (!isInside(rect, frameRect)) {
      return `card ${i} escapes the frame`;
    }
    for (let j = i + 1; j < cards.length; j++) {
      if (boxesOverlap(rect, cards[j].getBoundingClientRect())) {
        return `card ${i} overlaps card ${j}`;
      }
    }
  }
  const rows = new Map<number, number[]>();
  cards.forEach((card, index) => {
    const top = Math.round(card.getBoundingClientRect().top);
    const key = [...rows.keys()].find((existing) => Math.abs(existing - top) <= 1);
    const bucket = key ?? top;
    rows.set(bucket, [...(rows.get(bucket) ?? []), index]);
  });
  for (const indexes of rows.values()) {
    const lefts = indexes.map((index) => cards[index].getBoundingClientRect().left);
    for (let k = 1; k < lefts.length; k++) {
      if (lefts[k] < lefts[k - 1] - 1) {
        return 'a row is not left-to-right in source order';
      }
    }
  }
  return null;
}

/** True when the computed shadow matches Figma shadow-xs: offset (0, 1), blur 2, spread 0, #101828 at ~5% alpha. */
export function isFigmaShadow(boxShadow: string): boolean {
  const color = boxShadow.match(/rgba?\(\s*16\s*,\s*24\s*,\s*40(?:\s*,\s*([\d.]+))?\s*\)/);
  const lengths = boxShadow.match(/(-?[\d.]+)px\s+(-?[\d.]+)px\s+(-?[\d.]+)px\s+(-?[\d.]+)px/);
  if (!color || !lengths) {
    return false;
  }
  const alpha = color[1] === undefined ? 1 : Number(color[1]);
  const x = Number(lengths[1]);
  const y = Number(lengths[2]);
  const blur = Number(lengths[3]);
  const spread = Number(lengths[4]);
  return (
    Math.abs(alpha - 0.05) <= 0.02 &&
    Math.abs(x) <= 0.5 &&
    Math.abs(y - 1) <= 0.5 &&
    Math.abs(blur - 2) <= 0.5 &&
    Math.abs(spread) <= 0.5
  );
}
