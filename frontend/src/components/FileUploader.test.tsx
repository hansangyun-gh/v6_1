/**
 * FileUploader 컴포넌트 테스트
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FileUploader from './FileUploader';

describe('FileUploader', () => {
  it('파일 업로드 input이 렌더링된다', () => {
    render(<FileUploader onFilesSelected={jest.fn()} />);
    expect(screen.getByLabelText(/파일 업로드/i)).toBeInTheDocument();
  });

  it('파일 선택 시 onFilesSelected 콜백이 배열로 호출된다', () => {
    const handleFilesSelected = jest.fn();
    render(<FileUploader onFilesSelected={handleFilesSelected} />);
    const input = screen.getByLabelText(/파일 업로드/i) as HTMLInputElement;
    const file = new File(['dummy'], 'test.txt', { type: 'text/plain' });
    fireEvent.change(input, { target: { files: [file] } });
    expect(handleFilesSelected).toHaveBeenCalledWith([file]);
  });
}); 