/**
 * LLM 서비스
 * @description Claude(haiku) API에 프롬프트만 전송하여 평가 결과를 반환
 */

/**
 * Claude API 응답 타입
 */
interface ClaudeResponse {
  content?: { text?: string }[];
}

/**
 * LLM 평가 함수
 * @param file 업로드 파일 (무시)
 * @param prompt 프롬프트 (사용자 입력)
 * @param model LLM 모델명 (무시, haiku로 고정)
 * @returns 평가 결과 배열(Promise)
 */
export async function evaluateWithLLM(file: Express.Multer.File, prompt: string, model: string): Promise<any[]> {
  try {
    const apiKey = process.env.CLAUDE_API_KEY;
    const cheapModel = 'claude-3-haiku-20240307'; // 가장 저렴한 모델

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey ?? '',
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: cheapModel,
        max_tokens: 4096, // 더 긴 피드백 응답을 위해 토큰 수 상향
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error('LLM 평가 서비스 실패: ' + errorData);
    }

    const data = await response.json() as ClaudeResponse;
    let summary = data.content?.[0]?.text || 'Claude 응답 없음';
    let parsedSummary: any[] = [];
    let extractedScore = 90; // 기본값
    // summary에서 가장 마지막 JSON 배열만 robust하게 추출
    const matches = [...summary.matchAll(/\[\s*{[\s\S]*?}\s*\]/g)];
    const lastJson = matches.length > 0 ? matches[matches.length - 1][0] : null;
    if (lastJson) {
      try {
        const arr = JSON.parse(lastJson);
        if (Array.isArray(arr)) {
          parsedSummary = arr.map(item => ({ ...item, 제목: file.originalname }));
          if (arr[0]?.총점 && !isNaN(Number(arr[0].총점))) {
            extractedScore = Number(arr[0].총점);
          }
        }
      } catch {
        // fallback
      }
    }
    if (parsedSummary.length === 0) {
      // summary가 JSON이 아니면 robust하게 항목별 점수/피드백 추출
      const fields = [
        '내용 충실도', '논리 구조', '표현 정확성', '창의적 사고', '참고문헌 활용도', '형식 완성도', '총점', '피드백'
      ];
      const result: any = { 제목: file.originalname };
      // 각 항목별로 다양한 패턴(콜론, 점, 등호, 괄호, 띄어쓰기 등) 허용
      fields.forEach(field => {
        let value = null;
        if (field === '피드백') {
          // 피드백은 여러 줄, 따옴표, 콤마, 중괄호 등 robust하게 추출
          // 1. "피드백": "..." 또는 '피드백': '...'
          let feedbackMatch = summary.match(/피드백[\s.:=\-\(\)]*["']([\s\S]*?)["'][\n\r,}]/m);
          if (feedbackMatch) value = feedbackMatch[1].trim();
          // 2. 못 찾으면 : 다음 줄부터 끝까지(빈 줄 또는 끝까지)
          if (!value) {
            const alt = summary.match(/피드백[\s.:=\-\(\)]*([\s\S]+?)(\n\n|$)/m);
            if (alt) value = alt[1].trim();
          }
        } else {
          // 숫자 항목 robust 추출 (하이픈은 반드시 맨 뒤에 위치)
          const regex = new RegExp(`${field}[\s.:=()\-]*([0-9]{1,3})`, 'm');
          const match = summary.match(regex);
          if (match) value = Number(match[1]);
        }
        result[field] = value ?? 0;
      });
      // 총점 보정
      if (result['총점'] && !isNaN(result['총점'])) {
        extractedScore = Number(result['총점']);
      }
      parsedSummary = [result];
    }
    console.log('Claude 응답 summary:', summary);
    return [{
      id: file.originalname || '1',
      score: extractedScore,
      summary, // LLM 원문 전체
      parsedSummary // robust하게 추출된 JSON 배열
    }];
  } catch (error: any) {
    console.error('LLM 평가 서비스 실패:', error);
    throw new Error('LLM 평가 서비스 실패: ' + error.message);
  }
}
  