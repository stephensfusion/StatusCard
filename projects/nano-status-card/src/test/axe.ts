import axe, { AxeResults, Result } from 'axe-core';

/**
 * Runs axe-core against `element`, restricted to WCAG 2.0/2.1 A and AA rules.
 * Best-practice rules are excluded: the requirement does not define an accessible
 * name beyond the visible title and value text.
 */
export function axeWcag(element: Element): Promise<AxeResults> {
  return axe.run(element, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
    resultTypes: ['violations'],
  });
}

function formatViolation(violation: Result): string {
  const targets = violation.nodes.map((node) => `    - ${node.target.join(' ')}`).join('\n');
  return `  [${violation.impact ?? 'n/a'}] ${violation.id}: ${violation.help}\n${targets}`;
}

/** Vitest matcher: `expect(await axeWcag(el)).toHaveNoViolations()`. */
export const axeMatchers = {
  toHaveNoViolations(received: AxeResults) {
    const violations = received.violations;
    return {
      pass: violations.length === 0,
      message: () =>
        violations.length === 0
          ? 'Expected axe violations, but none were found'
          : `Expected no axe violations, found ${violations.length}:\n${violations.map(formatViolation).join('\n')}`,
    };
  },
};

interface AxeMatchers<R = unknown> {
  toHaveNoViolations(): R;
}

declare module 'vitest' {
  interface Matchers<
    R extends void | Promise<void> = void | Promise<void>,
    T = unknown,
  > extends AxeMatchers<R> {}
}
