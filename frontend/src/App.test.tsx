import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { axe, toHaveNoViolations } from 'jest-axe';
import { fireEvent } from '@testing-library/react';
expect.extend(toHaveNoViolations);

// 뷰포트 크기 조정 유틸
function setViewport(width: number) {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width });
  window.dispatchEvent(new Event('resize'));
}

describe('App 반응형 UI', () => {
  afterEach(() => {
    setViewport(1024); // 기본 데스크톱
  });

  it('모바일 뷰포트에서 주요 요소가 정상 렌더링된다', () => {
    setViewport(375); // iPhone 크기
    render(<App />);
    expect(screen.getByRole('banner', { name: /앱 헤더/ })).toBeInTheDocument();
    expect(screen.getByLabelText(/입력 카드/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /평가 요청/ })).toBeInTheDocument();
    expect(screen.getByLabelText(/결과 카드/)).toBeInTheDocument();
    expect(screen.getByRole('contentinfo', { name: /앱 푸터/ })).toBeInTheDocument();
  });

  it('데스크톱 뷰포트에서 주요 요소가 정상 렌더링된다', () => {
    setViewport(1440); // 데스크톱
    render(<App />);
    expect(screen.getByRole('banner', { name: /앱 헤더/ })).toBeInTheDocument();
    expect(screen.getByLabelText(/입력 카드/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /평가 요청/ })).toBeInTheDocument();
    expect(screen.getByLabelText(/결과 카드/)).toBeInTheDocument();
    expect(screen.getByRole('contentinfo', { name: /앱 푸터/ })).toBeInTheDocument();
  });
});

describe('App 접근성/명암비/다크모드', () => {
  it('라이트모드에서 접근성 위반이 없어야 한다', async () => {
    render(<App />);
    const results = await axe(document.body);
    expect(results).toHaveNoViolations();
  });
  it('다크모드에서 접근성 위반이 없어야 한다', async () => {
    render(<App />);
    // 다크모드 토글 클릭
    const toggle = screen.getByRole('button', { name: /다크 모드|라이트 모드/ });
    fireEvent.click(toggle);
    const results = await axe(document.body);
    expect(results).toHaveNoViolations();
  });
}); 