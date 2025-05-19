/**
 * PromptEditor 컴포넌트 테스트
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PromptEditor from './PromptEditor';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('PromptEditor', () => {
  it('프롬프트 입력창이 렌더링된다', () => {
    render(<PromptEditor value="" onChange={jest.fn()} />);
    expect(screen.getByRole('textbox', { name: /프롬프트/ })).toBeInTheDocument();
  });

  it('프롬프트 입력 시 onChange 콜백이 호출된다', () => {
    const handleChange = jest.fn();
    render(<PromptEditor value="" onChange={handleChange} />);
    const textarea = screen.getByRole('textbox', { name: /프롬프트/ }) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: '새 프롬프트' } });
    expect(handleChange).toHaveBeenCalledWith('새 프롬프트');
  });
});

describe('PromptEditor 접근성', () => {
  it('접근성 위반이 없어야 한다', async () => {
    const { container } = render(<PromptEditor value="" onChange={jest.fn()} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
}); 