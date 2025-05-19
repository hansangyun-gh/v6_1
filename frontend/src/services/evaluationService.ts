/**
 * LLM 평가 서비스
 * @description 보고서 파일과 프롬프트, 모델 정보를 받아 LLM 평가 결과를 반환
 */
import axios from 'axios';
import { EvaluationRequest, EvaluationResponse } from '../types/interfaces';

/**
 * 평가 요청 파라미터 타입
 */
export interface EvaluationParams {
  file: File;
  prompt: string;
  model: string;
}

/**
 * LLM 평가 요청을 서버에 전송하는 서비스 함수 (다중 파일 지원)
 * @param data 평가 요청 데이터 (files, prompt, model)
 * @returns 평가 결과
 */
export async function submitEvaluation(data: EvaluationRequest): Promise<EvaluationResponse> {
  try {
    const formData = new FormData();
    data.files.forEach((file) => {
      formData.append('files', file);
    });
    formData.append('prompt', data.prompt);
    formData.append('model', data.model);
    const response = await axios.post('/api/evaluate', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error: any) {
    // 서버/네트워크 에러 메시지 명확히 전달
    throw new Error(error?.response?.data?.error || error.message || 'LLM 평가 요청 실패');
  }
} 