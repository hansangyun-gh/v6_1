/**
 * 프롬프트 관리 컨트롤러
 * @description 프롬프트 저장/불러오기/삭제/수정 API
 */
import { Request, Response, NextFunction } from 'express';
import * as promptService from '../services/promptService';

/**
 * 모든 프롬프트 목록 반환
 */
export async function getAllPrompts(req: Request, res: Response, next: NextFunction) {
  try {
    const prompts = await promptService.getAllPrompts();
    res.json({ success: true, prompts });
  } catch (err: any) {
    next(err);
  }
}

/**
 * 프롬프트 저장
 */
export async function savePrompt(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, value } = req.body;
    if (!name || !value) {
      return res.status(400).json({ success: false, error: '프롬프트 이름과 내용을 모두 입력하세요.' });
    }
    await promptService.savePrompt({ name, value });
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
}

/**
 * 프롬프트 이름으로 불러오기
 */
export async function getPromptByName(req: Request, res: Response, next: NextFunction) {
  try {
    const { name } = req.params;
    const prompt = await promptService.getPromptByName(name);
    if (!prompt) {
      return res.status(404).json({ success: false, error: '해당 프롬프트가 존재하지 않습니다.' });
    }
    res.json({ success: true, prompt });
  } catch (err: any) {
    next(err);
  }
}

/**
 * 프롬프트 삭제
 */
export async function deletePrompt(req: Request, res: Response, next: NextFunction) {
  try {
    const { name } = req.params;
    await promptService.deletePrompt(name);
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
}

/**
 * 프롬프트 수정
 */
export async function updatePrompt(req: Request, res: Response, next: NextFunction) {
  try {
    const { name } = req.params;
    const { value } = req.body;
    if (!value) {
      return res.status(400).json({ success: false, error: '수정할 프롬프트 내용을 입력하세요.' });
    }
    await promptService.updatePrompt(name, value);
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
} 