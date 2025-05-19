import 'dotenv/config';
/**
 * Express 앱 엔트리포인트
 * @description 라우터 연결, 에러 핸들러, 서버 실행
 */
import express, { Application, Request, Response, NextFunction } from 'express';
import evaluationRoutes from './routes/evaluationRoutes';
import promptRoutes from './routes/promptRoutes';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 5000;

// CORS 설정: 개발은 전체 허용, 운영은 도메인 제한
if (process.env.NODE_ENV === 'production') {
  app.use(cors({ origin: 'https://your-frontend-domain.com', credentials: true })); // 실제 도메인으로 변경
} else {
  app.use(cors({ origin: true, credentials: true }));
}

app.use(express.json());
app.use('/api', evaluationRoutes);
app.use('/api/prompts', promptRoutes);

/**
 * Swagger 설정 (운영환경에서는 비활성화)
 */
if (process.env.NODE_ENV !== 'production') {
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'LLM 평가 API',
        version: '1.0.0',
        description: 'LLM 기반 보고서 정량 평가 백엔드 API 문서',
      },
      servers: [
        {
          url: 'http://localhost:' + PORT,
        },
      ],
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // JSDoc 주석 위치
  };
  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

/**
 * 헬스 체크 라우트
 */
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

/**
 * 에러 핸들러 미들웨어
 */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('서버 에러:', err.message, err.stack);
  res.status(500).json({ error: err.message, stack: process.env.NODE_ENV === 'production' ? undefined : err.stack });
});

/**
 * 서버 시작 시 업로드 폴더 자동 생성
 */
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`서버 실행 중: http://localhost:${PORT}`);
  });
}

export default app;
