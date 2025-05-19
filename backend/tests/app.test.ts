/**
 * app 테스트
 * @description health check, /api/evaluate mock 테스트
 */
import request from 'supertest';
import app from '../src/app';

describe('Express App', () => {
  it('GET /health는 200 ok를 반환해야 한다', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('POST /api/evaluate는 400을 반환해야 한다(파라미터 누락)', async () => {
    const res = await request(app).post('/api/evaluate');
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('POST /api/evaluate는 XSS 공격 입력을 차단해야 한다', async () => {
    const res = await request(app)
      .post('/api/evaluate')
      .field('prompt', '<script>alert(1)</script>')
      .field('model', 'claude');
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('POST /api/evaluate는 모델명 길이 초과 시 400을 반환해야 한다', async () => {
    const longModel = 'a'.repeat(101);
    const res = await request(app)
      .post('/api/evaluate')
      .field('prompt', '테스트')
      .field('model', longModel);
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});
