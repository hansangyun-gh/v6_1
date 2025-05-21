"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 평가 라우트
 * @description /evaluate 엔드포인트, 파일 업로드 및 평가 컨트롤러 연결
 */
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const evaluationController_1 = require("../controllers/evaluationController");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ dest: path_1.default.join(__dirname, '../uploads') });
/**
 * @openapi
 * /api/evaluate:
 *   post:
 *     summary: LLM 평가 요청
 *     description: 여러 파일, 프롬프트, 모델을 업로드하여 LLM 기반 평가 결과를 반환합니다.
 *     tags:
 *       - Evaluation
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: 평가 대상 파일들
 *               prompt:
 *                 type: string
 *                 description: LLM 프롬프트
 *               model:
 *                 type: string
 *                 description: 사용할 LLM 모델명
 *           encoding:
 *             files:
 *               contentType: application/octet-stream
 *     responses:
 *       200:
 *         description: 평가 결과 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: object
 *                   description: 평가 결과
 *       400:
 *         description: 필수 파라미터 누락
 *       500:
 *         description: LLM 평가 처리 실패
 */
router.post('/evaluate', upload.array('files'), 
// 입력 검증 및 정화 미들웨어
[
    (0, express_validator_1.body)('prompt')
        .isString().withMessage('프롬프트는 문자열이어야 합니다.')
        .isLength({ min: 1, max: 2000 }).withMessage('프롬프트 길이 초과'),
    (0, express_validator_1.body)('model')
        .isString().withMessage('모델명은 문자열이어야 합니다.')
        .isLength({ min: 1, max: 100 }).withMessage('모델명 길이 초과'),
], (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        console.log('400 에러: express-validator', errors.array());
        res.status(400).json({ error: errors.array() });
        return;
    }
    next();
}, evaluationController_1.evaluateReport);
exports.default = router;
