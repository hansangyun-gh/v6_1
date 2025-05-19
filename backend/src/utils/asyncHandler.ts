/**
 * asyncHandler - 비동기 Express 핸들러 래퍼
 * @description 비동기 컨트롤러에서 발생한 에러를 next로 전달
 */
import { Request, Response, NextFunction, RequestHandler } from 'express';
 
export function asyncHandler(fn: (...args: any[]) => Promise<any>): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
} 