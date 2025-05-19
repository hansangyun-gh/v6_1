/**
 * 공통 타입 정의 (프론트엔드/백엔드)
 * @description LLM 평가 API 요청/응답, 모델, 프롬프트 등
 * 환경별 file 타입 분기 지원
 */

/**
 * 환경별 file 타입 분기
 * 프론트엔드(브라우저): File
 * 백엔드(Node): Express.Multer.File
 */
// @ts-ignore
export type FileType = File;

/**
 * 평가 결과 타입
 */
export interface EvaluationResult {
  id: string;
  score: number;
  summary: string;
}

/**
 * LLM 모델 타입
 */
export interface LLMModel {
  id: string;
  name: string;
}

/**
 * 프롬프트 타입
 */
export interface Prompt {
  value: string;
}

/**
 * LLM 평가 요청 타입
 */
export interface EvaluationRequest {
  file: FileType;
  prompt: string;
  model: string;
}

/**
 * LLM 평가 응답 타입
 */
export interface EvaluationResponse {
  results: Record<string, unknown> | unknown; // 실제 결과 구조에 맞게 수정 가능
} 