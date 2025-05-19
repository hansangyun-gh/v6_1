/**
 * ModelSelector 컴포넌트 테스트
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ModelSelector from './ModelSelector';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('ModelSelector', () => {
  it('모델 선택 드롭다운이 렌더링된다', () => {
    render(<ModelSelector models={['claude', 'local']} selectedModel="claude" onChange={jest.fn()} />);
    expect(screen.getByRole('combobox', { name: /모델 선택/ })).toBeInTheDocument();
  });

  it('모델 선택 시 onChange 콜백이 호출된다', () => {
    const handleChange = jest.fn();
    render(<ModelSelector models={['claude', 'local']} selectedModel="claude" onChange={handleChange} />);
    const select = screen.getByRole('combobox', { name: /모델 선택/ }) as HTMLSelectElement;
    fireEvent.change(select, { target: { value: 'local' } });
    expect(handleChange).toHaveBeenCalledWith('local');
  });

  it('접근성 위반이 없어야 한다', async () => {
    const { container } = render(<ModelSelector models={['claude', 'local']} selectedModel="claude" onChange={jest.fn()} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
}); 