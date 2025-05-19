/**
 * 프롬프트 관리 라우트
 * @description 프롬프트 저장/불러오기/삭제/수정 RESTful API
 */
import { Router } from 'express';
import * as promptController from '../controllers/promptController';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

/**
 * GET /api/prompts - 모든 프롬프트 목록
 */
router.get('/', asyncHandler(promptController.getAllPrompts));

/**
 * POST /api/prompts - 프롬프트 저장
 */
router.post('/', asyncHandler(promptController.savePrompt));

/**
 * GET /api/prompts/:name - 프롬프트 이름으로 불러오기
 */
router.get('/:name', asyncHandler(promptController.getPromptByName));

/**
 * DELETE /api/prompts/:name - 프롬프트 삭제
 */
router.delete('/:name', asyncHandler(promptController.deletePrompt));

/**
 * PUT /api/prompts/:name - 프롬프트 수정
 */
router.put('/:name', asyncHandler(promptController.updatePrompt));

export default router; 