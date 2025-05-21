"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
/**
 * Express 앱 엔트리포인트
 * @description 라우터 연결, 에러 핸들러, 서버 실행
 */
const express_1 = __importDefault(require("express"));
const evaluationRoutes_1 = __importDefault(require("./routes/evaluationRoutes"));
const promptRoutes_1 = __importDefault(require("./routes/promptRoutes"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 5000;
app.use(express_1.default.json());
app.use('/api', evaluationRoutes_1.default);
app.use('/api/prompts', promptRoutes_1.default);
/**
 * Swagger 설정
 */
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
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
/**
 * 헬스 체크 라우트
 */
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
/**
 * 에러 핸들러 미들웨어
 */
app.use((err, req, res, next) => {
    console.error('서버 에러:', err.message, err.stack);
    res.status(500).json({ error: err.message, stack: process.env.NODE_ENV === 'production' ? undefined : err.stack });
});
/**
 * 서버 시작 시 업로드 폴더 자동 생성
 */
const uploadDir = path_1.default.join(__dirname, '../uploads');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`서버 실행 중: http://localhost:${PORT}`);
    });
}
exports.default = app;
