// Anthropic Claude API 통신 테스트용 코드
// 실행: node claudeTest.js (또는 환경변수 직접 지정)
require('dotenv').config();
const axios = require('axios');

const apiKey = process.env.CLAUDE_API_KEY;
const prompt = "Claude야, 지금 몇 시야? (테스트)";
const model = "claude-3-haiku-20240307";

async function testClaude() {
  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model,
        max_tokens: 256,
        messages: [
          { role: 'user', content: prompt }
        ]
      },
      {
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
      }
    );
    console.log('Claude 응답:', response.data.content?.[0]?.text || response.data);
  } catch (error) {
    console.error('Claude API 호출 실패:', error.response?.data || error.message);
  }
}

testClaude(); 