import { CardInfo } from '../public-api';

/**
 * Titles and values copied from the requirement sample screenshot.
 * The screenshot does not name `iconClass` or `containerClass`, so these tokens
 * stand in for the classes a parent component supplies.
 */
export const SAMPLE_CARDS: CardInfo[] = [
  {
    title: 'Requirements Created',
    value: '01',
    iconClass: 'icon-created',
    containerClass: 'card-created',
  },
  {
    title: 'In Progress',
    value: '01',
    iconClass: 'icon-progress',
    containerClass: 'card-progress',
  },
  {
    title: 'In Review',
    value: '-',
    iconClass: 'icon-review',
    containerClass: 'card-review',
  },
  {
    title: 'Completed Requirement',
    value: '-',
    iconClass: 'icon-done',
    containerClass: 'card-done',
  },
];

/** The single card drawn in Figma node `1:34`. Icon and container classes are consumer-supplied. */
export const FIGMA_CARD: CardInfo = {
  title: 'In Progress',
  value: '-',
  iconClass: 'icon-progress',
  containerClass: 'card-progress',
};

/** Device widths used for the requirement's mobile, tablet, and desktop screen sizes. */
export const SCREEN_WIDTHS = {
  mobile: 320,
  tablet: 768,
  desktop: 1280,
} as const;
