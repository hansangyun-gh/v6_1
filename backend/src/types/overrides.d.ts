/**
 * 백엔드 타입 오버라이드
 * @description shared/types/interfaces의 FileType을 Express.Multer.File로 재정의
 */
import type { Express } from 'express';
 
declare module '../../../shared/types/interfaces' {
  export type FileType = Express.Multer.File;
} 