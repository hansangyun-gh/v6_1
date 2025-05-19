/**
 * 백엔드 공통 타입 정의
 * @description 평가 결과, LLM 모델, 프롬프트 등
 */

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
    name: string;
    value: string;
  }
  