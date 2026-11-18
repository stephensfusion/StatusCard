import { beforeAll, beforeEach, expect } from 'vitest';
import { axeMatchers } from './axe';
import { loadBdsStylesheet, resetTestDocument } from './bds';

expect.extend(axeMatchers);

beforeAll(async () => {
  await loadBdsStylesheet();
});

/* Isolation: drop theme state and hosts left by a previous test or a leaking implementation. */
beforeEach(() => {
  resetTestDocument();
});
