# 베이스 이미지
FROM node:20-alpine

# 작업 디렉터리 생성
WORKDIR /app

# 의존성 복사 및 설치 (devDependencies, 모든 npm 스크립트 무시)
COPY package*.json ./
RUN npm install --omit=dev --ignore-scripts

# 소스 복사
COPY . .

# 빌드 (tsc로 컴파일, 실제 배포시)
RUN npm run build

# 포트 오픈
EXPOSE 5000

# 환경변수
ENV NODE_ENV=production

# 앱 실행 (빌드된 JS 실행, 운영 배포용)
CMD ["node", "dist/app.js"]
