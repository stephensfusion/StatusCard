# Changelog

All notable changes to `nano-status-card` are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

## [0.0.1] - 2026-11-17

### Added

- `NanoStatusCard` (`<nano-status-card>`): a standalone, `OnPush`, zoneless-compatible component that renders the required `cardInfoData: CardInfo[]` input as a `ul` of `li` status cards, in source order.
- `CardInfo` model with `title`, `value`, `iconClass`, and `containerClass`.
- Card layout from Figma node `1:34`:
  - 20px padding, 1px border, 12px radius, and the `shadow-xs` shadow.
  - Inter 14/500/20 title above Inter 30/600/38 value, with a 12px gap.
  - A 48×48 decorative icon slot at the top end.
- BDS 32.1.19 colour tokens (`--color-sf-bg-primary`, `--color-sf-border-secondary`, `--color-sf-text-tertiary`, `--color-sf-text-primary`). The cards follow `.e-dark-mode` automatically.
- A responsive grid: cards share the parent's width and wrap, with a 240px minimum column and a 16px gap. Long titles and large values wrap inside the card.
- `containerClass` is applied on the card root and `iconClass` on the icon slot. The component's styles have zero specificity, so consumer rules win.
- Resilient rendering. Null entries are skipped, and missing or non-string fields render as empty. Text is always rendered as text, never HTML.
- `nano-status-card/testing` entry point with `NanoStatusCardHarness` and `NANO_STATUS_CARD_SELECTORS`.
