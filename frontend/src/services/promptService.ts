/**
 * 프롬프트 서비스 (RESTful API 연동)
 * @description 프롬프트를 서버에 저장/불러오기/삭제/수정
 */
import { Prompt } from '../types/interfaces';

const API_BASE = '/api/prompts';

/**
 * 모든 프롬프트 목록 조회
 */
export async function fetchPrompts(): Promise<Prompt[]> {
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData?.error || res.statusText || '프롬프트 목록 조회 실패');
    }
    const data = await res.json();
    return data.prompts;
  } catch (error: unknown) {
    if (error instanceof Error) throw error;
    throw new Error('프롬프트 목록 조회 실패');
  }
}

/**
 * 프롬프트 저장
 */
export async function savePrompt(prompt: Prompt): Promise<void> {
  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prompt),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData?.error || res.statusText || '프롬프트 저장 실패');
    }
  } catch (error: unknown) {
    if (error instanceof Error) throw error;
    throw new Error('프롬프트 저장 실패');
  }
}

/**
 * 프롬프트 불러오기 (이름 기준)
 */
export async function fetchPromptByName(name: string): Promise<Prompt> {
  try {
    const res = await fetch(`${API_BASE}/${encodeURIComponent(name)}`);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData?.error || res.statusText || '프롬프트 불러오기 실패');
    }
    const data = await res.json();
    return data.prompt;
  } catch (error: unknown) {
    if (error instanceof Error) throw error;
    throw new Error('프롬프트 불러오기 실패');
  }
}

/**
 * 프롬프트 삭제
 */
export async function deletePrompt(name: string): Promise<void> {
  try {
    const res = await fetch(`${API_BASE}/${encodeURIComponent(name)}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData?.error || res.statusText || '프롬프트 삭제 실패');
    }
  } catch (error: unknown) {
    if (error instanceof Error) throw error;
    throw new Error('프롬프트 삭제 실패');
  }
}

/**
 * 프롬프트 수정
 */
export async function updatePrompt(name: string, value: string): Promise<void> {
  try {
    const res = await fetch(`${API_BASE}/${encodeURIComponent(name)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value }),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData?.error || res.statusText || '프롬프트 수정 실패');
    }
  } catch (error: unknown) {
    if (error instanceof Error) throw error;
    throw new Error('프롬프트 수정 실패');
  }
} 