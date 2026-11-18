import { CardInfo } from '../public-api';

/** A title long enough to overflow a fixed card if the layout does not contain it. */
export const LONG_TITLE =
  'Requirements Created for the quarterly platform review across every participating squad';

/** A value long enough to overflow the Figma value line if it is not contained. */
export const LARGE_VALUE = '1234567890'.repeat(8);

export function longTitleCard(): CardInfo {
  return {
    title: LONG_TITLE,
    value: '01',
    iconClass: 'icon-created',
    containerClass: 'card-created',
  };
}

export function largeValueCard(): CardInfo {
  return {
    title: 'In Progress',
    value: LARGE_VALUE,
    iconClass: 'icon-progress',
    containerClass: 'card-progress',
  };
}

/** Strings that must be shown as text and must not become elements. */
export function hostileCard(): CardInfo {
  return {
    title: '<img src=x onerror="alert(1)">',
    value: '<script>alert(1)</script>',
    iconClass: 'icon-progress',
    containerClass: 'card-progress',
  };
}

export function cardsWithCount(count: number): CardInfo[] {
  return Array.from({ length: count }, (_, index) => ({
    title: `Status ${index + 1}`,
    value: String(index + 1),
    iconClass: index % 2 === 0 ? 'icon-progress' : 'icon-review',
    containerClass: index % 2 === 0 ? 'card-progress' : 'card-review',
  }));
}
