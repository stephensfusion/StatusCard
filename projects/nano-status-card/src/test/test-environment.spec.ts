import { describe, expect, it } from 'vitest';
import { BDS_STYLESHEET_URL, resolveBdsColor, setDarkMode } from './bds';

describe('test environment', () => {
  it('[ENV] should load the required BDS 32.1.19 stylesheet', () => {
    const link = document.querySelector<HTMLLinkElement>(
      'link[rel="stylesheet"]#nano-test-bds-stylesheet',
    );
    expect(link).not.toBeNull();
    expect(link?.href).toBe(BDS_STYLESHEET_URL);
  });

  it('[ENV] should resolve the status-card BDS tokens in the light theme', () => {
    expect(resolveBdsColor('--color-sf-bg-primary')).toBe('rgb(255, 255, 255)');
    expect(resolveBdsColor('--color-sf-text-primary')).toBe('rgb(16, 24, 40)');
    expect(resolveBdsColor('--color-sf-text-tertiary')).toBe('rgb(71, 84, 103)');
    expect(resolveBdsColor('--color-sf-border-secondary')).toBe('rgb(234, 236, 240)');
  });

  it('[ENV] should switch those tokens when .e-dark-mode is toggled on body', () => {
    setDarkMode(true);
    expect(resolveBdsColor('--color-sf-bg-primary')).toBe('rgb(12, 17, 29)');
    expect(resolveBdsColor('--color-sf-text-primary')).toBe('rgb(245, 245, 246)');
    expect(resolveBdsColor('--color-sf-text-tertiary')).toBe('rgb(148, 150, 156)');
    expect(resolveBdsColor('--color-sf-border-secondary')).toBe('rgb(31, 36, 47)');

    setDarkMode(false);
    expect(resolveBdsColor('--color-sf-bg-primary')).toBe('rgb(255, 255, 255)');
    expect(resolveBdsColor('--color-sf-text-tertiary')).toBe('rgb(71, 84, 103)');
  });
});
