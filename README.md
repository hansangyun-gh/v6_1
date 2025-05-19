# report-eval

## 프로젝트 개요
- 여러 보고서를 LLM(Claude, Local)로 정량 평가하는 웹앱
- React + TypeScript(프론트), Node.js + Express + TypeScript(백엔드)
- Render.com으로 배포

## 폴더 구조
```
backend/      # 백엔드 서버 (Express, TypeScript)
frontend/     # 프론트엔드 (React, TypeScript, Chakra UI)
render.yaml   # Render 배포 설정
README.md     # 프로젝트 설명
```

## 주요 기술스택
- 프론트: React, TypeScript, Chakra UI
- 백엔드: Node.js, Express, TypeScript
- LLM: Claude, Local LLM
- 배포: Render.com

## 배포 방법(간단)
1. Render.com에 깃허브 연동
2. frontend, backend 각각 서비스로 등록
3. render.yaml 참고

## 주요 기능
- 다양한 파일(txt, doc, docx, pdf) 업로드 및 텍스트 추출
- Claude API 및 로컬 LLM을 통한 정량 평가
- 프롬프트 관리 및 평가 결과 시각화
- Render 플랫폼 배포 지원

## 설치 및 실행

### 1. 의존성 설치
```bash
cd frontend && npm install
cd ../backend && npm install
```

### 2. 개발 서버 실행
- 프론트엔드: `cd frontend && npm start`
- 백엔드: `cd backend && npm run dev`

### 3. 테스트 실행
- 백엔드: `cd backend && npm test`

## 환경 변수 예시
- 백엔드: `.env` 파일 또는 Render 환경변수 사용
```
NODE_ENV=production
PORT=5000
CLAUDE_API_KEY=your-key
LOCAL_LLM_API_URL=http://localhost:8000
```
- 프론트엔드: `.env` 파일 또는 Render 환경변수 사용
```
REACT_APP_API_URL=https://report-evaluator-backend.onrender.com/api
```

## 기술스택
- 프론트엔드: React, TypeScript, Chakra UI, Axios
- 백엔드: Node.js, Express, TypeScript, multer, pdf-parse, mammoth, textract
- 테스트: Jest, supertest
- 배포: Docker, Render

## 문의 및 기여
- Pull Request 및 Issue 환영 