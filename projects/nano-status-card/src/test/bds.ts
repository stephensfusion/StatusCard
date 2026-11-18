/** Stylesheet mandated by the requirement and the generator default. */
export const BDS_STYLESHEET_URL = 'https://cdn.syncfusion.com/ej2/32.1.19/bds.css';

/** Class BDS uses to switch `--color-sf-*` tokens to the dark theme. */
export const BDS_DARK_MODE_CLASS = 'e-dark-mode';

const LINK_ID = 'nano-test-bds-stylesheet';
const CONSUMER_STYLE_ID = 'nano-test-consumer-style';

/** Injects the BDS stylesheet once and resolves when it has loaded. */
export function loadBdsStylesheet(): Promise<void> {
  if (document.getElementById(LINK_ID)) {
    return Promise.resolve();
  }
  return new Promise<void>((resolve, reject) => {
    const link = document.createElement('link');
    link.id = LINK_ID;
    link.rel = 'stylesheet';
    link.href = BDS_STYLESHEET_URL;
    link.addEventListener('load', () => resolve());
    link.addEventListener('error', () =>
      reject(new Error(`Test environment: failed to load ${BDS_STYLESHEET_URL}`)),
    );
    document.head.appendChild(link);
  });
}

/** Removes theme classes, stray hosts, and consumer styles left by earlier tests. */
export function resetTestDocument(): void {
  document.body.classList.remove(BDS_DARK_MODE_CLASS);
  document.documentElement.classList.remove(BDS_DARK_MODE_CLASS);
  document.querySelectorAll('nano-status-card').forEach((el) => el.remove());
  document.getElementById(CONSUMER_STYLE_ID)?.remove();
}

/** Toggles the BDS dark theme on `document.body`, the way a consumer app switches theme. */
export function setDarkMode(enabled: boolean): void {
  document.body.classList.toggle(BDS_DARK_MODE_CLASS, enabled);
}

/** Resolves a BDS colour token to its computed `rgb()` / `rgba()` string in the current theme. */
export function resolveBdsColor(token: string): string {
  const probe = document.createElement('span');
  probe.style.color = `var(${token})`;
  document.body.appendChild(probe);
  const value = getComputedStyle(probe).color;
  probe.remove();
  return value;
}

/**
 * Installs one global consumer rule used to prove `containerClass` can change the card shape.
 * The rule is removed by `resetTestDocument()`.
 */
export function installConsumerShapeRule(): void {
  document.getElementById(CONSUMER_STYLE_ID)?.remove();
  const style = document.createElement('style');
  style.id = CONSUMER_STYLE_ID;
  style.textContent = 'nano-status-card li.consumer-shape { border-radius: 20px; }';
  document.head.appendChild(style);
}
