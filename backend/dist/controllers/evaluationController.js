"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateReport = evaluateReport;
const llmService_1 = require("../services/llmService");
/**
 * LLM 평가 요청 핸들러
 * @param req Express Request
 * @param res Express Response
 * @returns void
 * @description 파일, 프롬프트, 모델을 받아 LLM 평가 결과 반환. 에러 발생 시 중복 응답 방지 및 상세 로깅. prompt에 XSS 공격 문자열이 포함되면 400 반환.
 */
async function evaluateReport(req, res) {
    try {
        // 다중 파일 지원: req.files (multer.array)
        const files = req.files || [];
        const prompt = req.body?.prompt;
        const model = req.body?.model;
        if (!Array.isArray(files) || files.length === 0 || typeof prompt !== 'string' || !prompt || typeof model !== 'string' || !model) {
            console.log('400 에러: 파라미터 누락/타입 오류', { files, prompt, model });
            res.status(400).json({ error: '필수 파라미터 누락 또는 타입 오류' });
            return;
        }
        // XSS 공격 패턴만 차단 (예: <script, </script, onerror=, onload=, javascript:)
        const xssPattern = /<script|<\/script|onerror=|onload=|javascript:/i;
        if (xssPattern.test(prompt)) {
            console.log('400 에러: XSS 패턴 감지', { prompt });
            res.status(400).json({ error: 'XSS 공격 시도 감지됨 (script, onerror 등 금지)' });
            return;
        }
        // 각 파일별 평가 결과 배열 생성
        const results = await Promise.all(files.map(async (file) => {
            try {
                const evalResultArr = await (0, llmService_1.evaluateWithLLM)(file, prompt, model); // 항상 배열 반환
                // 파일명-결과 매핑: summary에 파일명 포함
                return evalResultArr.map(r => ({ ...r, summary: `[${file.originalname}]\n` + r.summary }));
            }
            catch (err) {
                return [{ id: file.originalname, score: 0, summary: '에러: ' + (err.message || '평가 실패') }];
            }
        }));
        // 2차원 배열 평탄화
        const flatResults = results.flat();
        res.status(200).json({ results: flatResults });
        return;
    }
    catch (error) {
        console.error('LLM 평가 처리 실패(컨트롤러):', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'LLM 평가 처리 실패(컨트롤러)' });
        }
        return;
    }
}
