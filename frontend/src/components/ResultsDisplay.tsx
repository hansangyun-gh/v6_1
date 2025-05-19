/**
 * 세련된 평가 결과 표시 컴포넌트 (카드+테이블+알림 스타일)
 * @description LLM 평가 결과를 시각적으로 계층감 있게 표시
 * @prop results 평가 결과 배열
 */
import React, { useState } from 'react';
import {
  Box, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, Alert, AlertIcon,
  useColorModeValue, Tooltip, IconButton, Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalBody, ModalCloseButton, Progress, HStack, useDisclosure, Button, useToast
} from '@chakra-ui/react';
import { FiInfo } from 'react-icons/fi';
import { DownloadIcon, ViewIcon } from '@chakra-ui/icons';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { EvaluationResult, ParsedResult } from '../types/interfaces';

export interface ResultsDisplayProps {
  results: EvaluationResult[];
}

// 항목명 리스트 (프롬프트 기준)
const SCORE_FIELDS = [
  '내용 충실도',
  '논리 구조',
  '표현 정확성',
  '창의적 사고',
  '참고문헌 활용도',
  '형식 완성도',
  '총점',
];

function getScoreColor(score: number) {
  if (score >= 90) return 'green.400';
  if (score >= 80) return 'blue.400';
  if (score >= 70) return 'yellow.400';
  if (score >= 60) return 'orange.400';
  return 'red.400';
}

function calcStats(arr: number[]) {
  if (!arr.length) return { avg: 0, min: 0, max: 0, std: 0 };
  const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const std = Math.sqrt(arr.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / arr.length);
  return { avg, min, max, std };
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = React.memo(({ results }) => {
  const cardBg = useColorModeValue('gray.50', 'gray.800');
  const cardText = useColorModeValue('brand.600', 'mint.200');
  const tableBg = useColorModeValue('white', 'gray.900');
  const alertBg = useColorModeValue('blue.50', 'gray.700');
  const alertText = useColorModeValue('gray.500', 'mint.200');
  const [modal, setModal] = useState<{title: string, feedback: string} | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [llmModal, setLlmModal] = useState<{title: string, summary: string} | null>(null);
  const toast = useToast();

  // parsedSummary 우선 사용
  const parsed: ParsedResult[] = results.flatMap(r => {
    if (Array.isArray(r.parsedSummary) && r.parsedSummary.length > 0) {
      return r.parsedSummary.map((item: ParsedResult) => ({ ...item, _filename: String(r.id) }));
    }
    // fallback: summary에서 기존처럼 파싱 시도
    try {
      const arr: ParsedResult[] = JSON.parse(r.summary);
      if (Array.isArray(arr)) return arr.map((item: ParsedResult) => ({ ...item, _filename: String(r.id) }));
      return [];
    } catch {
      return [{ _filename: String(r.id), 총점: r.score, 피드백: r.summary }];
    }
  });

  // 통계 계산
  const stats: Record<string, ReturnType<typeof calcStats>> = {};
  SCORE_FIELDS.forEach(field => {
    const arr = parsed.map(r => Number(r[field])).filter(n => !isNaN(n));
    stats[field] = calcStats(arr);
  });

  // 총점 분포
  const totalScores = parsed.map(r => Number(r['총점'])).filter(n => !isNaN(n));
  const maxScore = Math.max(100, ...totalScores);

  // CSV 변환 유틸
  function toCSV(rows: ParsedResult[]) {
    if (!rows.length) return '';
    const fields = ['제목', ...SCORE_FIELDS, '피드백'];
    const header = fields.join(',');
    const escape = (v: string | number | undefined) => `"${String(v ?? '').replace(/"/g, '""').replace(/\n/g, ' ')}"`;
    const body = rows.map(r => fields.map(f => escape(r[f])).join(',')).join('\n');
    return header + '\n' + body;
  }
  // CSV 다운로드 핸들러
  const handleDownloadCSV = () => {
    const csv = toCSV(parsed);
    const bom = '\uFEFF'; // UTF-8 BOM 추가
    const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evaluation_results_${new Date().toISOString().replace(/[:.]/g, '-')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: 'CSV 다운로드 완료', status: 'success', duration: 2000 });
  };

  return (
    <Box
      borderRadius="xl"
      boxShadow="md"
      bg={cardBg}
      p={6}
      minH="120px"
      aria-label="평가 결과 영역"
      overflowX="auto"
      w="100%"
      maxW="100%"
    >
      <HStack justify="space-between" mb={2}>
        <Heading as="h2" size="md" color={cardText} textAlign="center">
          평가 결과
        </Heading>
        <Button
          leftIcon={<DownloadIcon />}
          colorScheme="teal"
          size="sm"
          aria-label="CSV로 내보내기"
          onClick={handleDownloadCSV}
          variant="outline"
        >
          CSV로 내보내기
        </Button>
      </HStack>
      {parsed.length === 0 ? (
        <Alert status="info" variant="subtle" borderRadius="md" justifyContent="center" bg={alertBg}>
          <AlertIcon as={FiInfo} color={cardText} />
          <Text color={alertText} ml={2}>아직 평가 결과가 없습니다.</Text>
        </Alert>
      ) : (
        <>
          <Table variant="simple" size="md" bg={tableBg} borderRadius="lg" boxShadow="sm" minWidth="900px" maxW="100%">
            <Thead>
              <Tr>
                <Th>파일명</Th>
                {SCORE_FIELDS.map(field => <Th key={field}>{field}</Th>)}
                <Th>피드백</Th>
                <Th>LLM 원본</Th>
              </Tr>
            </Thead>
            <Tbody>
              {parsed.map((r, idx) => (
                <Tr key={`${r._filename}-${idx}`}>
                  <Td fontWeight="bold">{String(r['제목'] ?? r._filename)}</Td>
                  {SCORE_FIELDS.map(field => (
                    <Td key={field} color={getScoreColor(Number(r[field]))} fontWeight={field === '총점' ? 'bold' : 'normal'}>
                      {typeof r[field] === 'number' || /^[0-9]+$/.test(String(r[field])) ? r[field] : '-'}
                    </Td>
                  ))}
                  <Td>
                    {r['피드백'] ? (
                      <Tooltip label={r['피드백']} aria-label="피드백 상세">
                        <IconButton
                          icon={<InfoOutlineIcon />}
                          size="sm"
                          aria-label="피드백 보기"
                          onClick={() => { setModal({ title: String(r['제목'] ?? r._filename), feedback: String(r['피드백'] ?? '') }); onOpen(); }}
                        />
                      </Tooltip>
                    ) : '-'}
                  </Td>
                  <Td>
                    <Tooltip label="LLM 원본 전체 보기" aria-label="LLM 원본 전체 보기">
                      <IconButton
                        icon={<ViewIcon />}
                        size="sm"
                        aria-label="LLM 원본 전체 보기"
                        onClick={() => {
                          const found = results.find(res => (String(res.id) === String(r['제목']) || String(res.id) === String(r._filename)));
                          setLlmModal({ title: String(r['제목'] ?? r._filename), summary: String(found?.summary ?? '') });
                          onOpen();
                        }}
                      />
                    </Tooltip>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {/* 통계 */}
          <Box mt={6}>
            <Heading as="h3" size="sm" color={cardText} mb={2}>항목별 통계</Heading>
            <Table size="sm" bg={tableBg} borderRadius="md">
              <Thead>
                <Tr>
                  <Th>항목</Th>
                  <Th>평균</Th>
                  <Th>최고</Th>
                  <Th>최저</Th>
                  <Th>표준편차</Th>
                </Tr>
              </Thead>
              <Tbody>
                {SCORE_FIELDS.map(field => (
                  <Tr key={field}>
                    <Td>{field}</Td>
                    <Td>{stats[field].avg.toFixed(1)}</Td>
                    <Td>{stats[field].max}</Td>
                    <Td>{stats[field].min}</Td>
                    <Td>{stats[field].std.toFixed(1)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
          {/* 총점 분포 시각화 */}
          <Box mt={6}>
            <Heading as="h3" size="sm" color={cardText} mb={2}>총점 분포</Heading>
            <HStack spacing={2} align="flex-end">
              {parsed.map((r, idx) => (
                <Box key={`bar-${r._filename}-${idx}`} textAlign="center">
                  <Progress value={Number(r['총점'])} max={maxScore} size="lg" colorScheme="blue" borderRadius="md" w="30px" h="80px" orientation="vertical" />
                  <Text fontSize="xs" mt={1}>{String(r['제목'] ?? r._filename)}</Text>
                  <Text fontSize="xs" color={getScoreColor(Number(r['총점']))}>{String(r['총점'] ?? '')}</Text>
                </Box>
              ))}
            </HStack>
          </Box>
          {/* LLM 원본 모달 */}
          <Modal isOpen={!!llmModal && isOpen} onClose={() => { setLlmModal(null); onClose(); }} isCentered size="xl">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{llmModal?.title} - LLM 원본 전체</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Box as="pre" whiteSpace="pre-wrap" fontSize="sm" maxH="60vh" overflowY="auto" p={2} borderRadius="md" bg="gray.50">
                  {llmModal?.summary}
                </Box>
              </ModalBody>
            </ModalContent>
          </Modal>
          {/* 기존 피드백 모달 유지 */}
          <Modal isOpen={!!modal && isOpen} onClose={() => { setModal(null); onClose(); }} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{modal?.title} - 피드백</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text whiteSpace="pre-line">
                  {(() => {
                    try {
                      // modal.feedback이 JSON이면 파싱해서 피드백 필드만 추출
                      const parsed = JSON.parse(modal?.feedback ?? '');
                      if (Array.isArray(parsed) && parsed[0]?.피드백) return parsed[0].피드백;
                      if (typeof parsed === 'object' && parsed.피드백) return parsed.피드백;
                    } catch { /* ignore */ }
                    // 아니면 원본 텍스트 fallback
                    return modal?.feedback;
                  })()}
                </Text>
              </ModalBody>
            </ModalContent>
          </Modal>
        </>
      )}
    </Box>
  );
});

export default ResultsDisplay; 