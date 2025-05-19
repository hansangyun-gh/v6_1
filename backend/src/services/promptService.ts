/**
 * 프롬프트 관리 서비스
 * @description 프롬프트를 파일에 저장/불러오기/삭제/수정 (MVP: JSON 파일)
 */
import fs from 'fs/promises';
import path from 'path';
import { Prompt } from '../types/interfaces';

const PROMPT_FILE = path.resolve(__dirname, '../../data/prompts.json');

/**
 * 모든 프롬프트 목록을 불러옵니다.
 */
export async function getAllPrompts(): Promise<Prompt[]> {
  try {
    const data = await fs.readFile(PROMPT_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err: any) {
    if (err.code === 'ENOENT') return [];
    throw new Error('프롬프트 목록을 불러오는 중 오류 발생: ' + err.message);
  }
}

/**
 * 프롬프트를 저장합니다. (이름 중복 불가)
 */
export async function savePrompt(prompt: Prompt): Promise<void> {
  try {
    const prompts = await getAllPrompts();
    if (prompts.find(p => p.name === prompt.name)) {
      throw new Error('이미 존재하는 프롬프트 이름입니다.');
    }
    prompts.push(prompt);
    await fs.mkdir(path.dirname(PROMPT_FILE), { recursive: true });
    await fs.writeFile(PROMPT_FILE, JSON.stringify(prompts, null, 2), 'utf-8');
  } catch (err: any) {
    throw new Error('프롬프트 저장 중 오류 발생: ' + err.message);
  }
}

/**
 * 프롬프트를 이름으로 불러옵니다.
 */
export async function getPromptByName(name: string): Promise<Prompt | undefined> {
  try {
    const prompts = await getAllPrompts();
    return prompts.find(p => p.name === name);
  } catch (err: any) {
    throw new Error('프롬프트 불러오기 오류: ' + err.message);
  }
}

/**
 * 프롬프트를 삭제합니다.
 */
export async function deletePrompt(name: string): Promise<void> {
  try {
    const prompts = await getAllPrompts();
    const filtered = prompts.filter(p => p.name !== name);
    if (filtered.length === prompts.length) {
      throw new Error('삭제할 프롬프트가 존재하지 않습니다.');
    }
    await fs.writeFile(PROMPT_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
  } catch (err: any) {
    throw new Error('프롬프트 삭제 오류: ' + err.message);
  }
}

/**
 * 프롬프트를 수정합니다.
 */
export async function updatePrompt(name: string, value: string): Promise<void> {
  try {
    const prompts = await getAllPrompts();
    const idx = prompts.findIndex(p => p.name === name);
    if (idx === -1) throw new Error('수정할 프롬프트가 존재하지 않습니다.');
    prompts[idx].value = value;
    await fs.writeFile(PROMPT_FILE, JSON.stringify(prompts, null, 2), 'utf-8');
  } catch (err: any) {
    throw new Error('프롬프트 수정 오류: ' + err.message);
  }
} 