import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import ResultsDisplay from './ResultsDisplay';

expect.extend(toHaveNoViolations);

describe('ResultsDisplay 접근성', () => {
  it('접근성 위반이 없어야 한다', async () => {
    const { container } = render(<ResultsDisplay results={[]} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
}); 