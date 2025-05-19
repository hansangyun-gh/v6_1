/**
 * E2E 통합 테스트 (파일 업로드~평가~결과 반환)
 */
import request from 'supertest';
import app from '../src/app';
import path from 'path';

describe('E2E: 파일 업로드~평가~결과 반환', () => {
  it('정상 파일/프롬프트/모델 입력 시 200과 결과 반환', async () => {
    const res = await request(app)
      .post('/api/evaluate')
      .attach('file', path.join(__dirname, 'fixtures', 'sample.txt'))
      .field('prompt', '테스트 프롬프트')
      .field('model', 'claude');
    expect(res.status).toBe(200);
    expect(res.body.results).toBeDefined();
  });

  it('프롬프트 누락 시 400 반환', async () => {
    const res = await request(app)
      .post('/api/evaluate')
      .attach('file', path.join(__dirname, 'fixtures', 'sample.txt'))
      .field('model', 'claude');
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('XSS 공격 입력 시 400 반환', async () => {
    const res = await request(app)
      .post('/api/evaluate')
      .attach('file', path.join(__dirname, 'fixtures', 'sample.txt'))
      .field('prompt', '<script>alert(1)</script>')
      .field('model', 'claude');
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
}); 