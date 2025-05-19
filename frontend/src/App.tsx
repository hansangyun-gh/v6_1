/**
 * App 컴포넌트 (LLM 평가 통합 예시)
 * - 파일 업로드, 모델 선택, 프롬프트 입력, 결과 표시, API 연동
 * - 접근성(aria), 색상 대비, 메모리 누수/불필요 렌더링 방지
 */
import React, { useState, useCallback } from 'react';
import { Spinner, Box, Text, Button, Stack, Heading, Container, Flex, useColorMode, useColorModeValue, IconButton } from '@chakra-ui/react';
import FileUploader from './components/FileUploader';
import ModelSelector from './components/ModelSelector';
import PromptEditor from './components/PromptEditor';
import ResultsDisplay from './components/ResultsDisplay';
import { submitEvaluation } from './services/evaluationService';
import { EvaluationResult } from './types/interfaces';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

const MODEL_LIST = ['claude', 'local'];

const App: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>(MODEL_LIST[0]);
  const [prompt, setPrompt] = useState<string>('');
  const [results, setResults] = useState<EvaluationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { colorMode, toggleColorMode } = useColorMode();
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardText = useColorModeValue('brand.600', 'mint.200');
  const mainBg = useColorModeValue('brand.50', 'gray.900');
  const headerBg = useColorModeValue('white', 'gray.800');
  const footerBg = useColorModeValue('brand.600', 'gray.900');
  const footerText = useColorModeValue('white', 'mint.200');
  const buttonBg = useColorModeValue('brand.500', 'mint.400');
  const buttonHover = useColorModeValue('brand.600', 'mint.500');
  const buttonActive = useColorModeValue('brand.700', 'mint.600');
  const spinnerColor = useColorModeValue('blue.500', 'mint.300');
  const errorBg = useColorModeValue('red.100', 'red.900');
  const errorText = useColorModeValue('red.700', 'red.200');

  // 평가 요청 핸들러
  const handleEvaluate = useCallback(async () => {
    if (!files.length || !prompt || !selectedModel) {
      setError('파일, 프롬프트, 모델을 모두 입력하세요.');
      return;
    }
    setLoading(true);
    setError(null);
    setResults([]);
    try {
      const response = await submitEvaluation({ files, prompt, model: selectedModel });
      setResults(response.results);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message || '평가 요청 실패');
      else setError('평가 요청 실패');
    } finally {
      setLoading(false);
    }
  }, [files, prompt, selectedModel]);

  return (
    // 전체 화면 중앙 정렬
    <Flex direction="column" minH="100vh" w="100vw" align="center" justify="center" bg={mainBg}>
      {/* 헤더 */}
      <Box as="header" w="100%" bg={headerBg} boxShadow="sm" py={{ base: 2, md: 3 }} px={{ base: 2, md: 4 }} role="banner" aria-label="앱 헤더">
        <Container maxW="6xl" display="flex" alignItems="center" justifyContent="space-between" px={{ base: 0, md: 2 }}>
          <Heading as="h1" size={{ base: 'md', md: 'lg' }} color={cardText} letterSpacing="tight">
            Report Evaluator
          </Heading>
          <Flex align="center" gap={2}>
            <Text color={useColorModeValue('gray.400', 'mint.300')} fontWeight="bold" fontSize={{ base: 'xs', md: 'sm' }} aria-label="브랜드 태그라인">
              LLM 평가 웹앱
            </Text>
            <IconButton
              aria-label={colorMode === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
              icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
              onClick={toggleColorMode}
              variant="ghost"
              size="sm"
              color={colorMode === 'dark' ? 'yellow.300' : 'gray.600'}
              _hover={{ bg: colorMode === 'dark' ? 'gray.700' : 'gray.100', transform: 'scale(1.1)' }}
              transition="all 0.2s"
              ml={2}
              tabIndex={0}
            />
          </Flex>
        </Container>
      </Box>
      {/* 메인 컨텐츠 - 화면 중앙에 배치 */}
      <Flex as="main" flex="1" align="center" justify="center" w="100vw" minH="calc(100vh - 120px)" py={{ base: 2, md: 10 }} role="main" aria-label="주요 컨텐츠 영역">
        {/* 중앙 정렬, 내부 카드만 maxW로 제한 */}
        <Box w="100%" maxW="480px" px={2} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          {/* 입력 카드 */}
          <Box
            bg={cardBg}
            borderRadius="xl"
            boxShadow="xl"
            p={{ base: 3, md: 8 }}
            mb={{ base: 4, md: 8 }}
            tabIndex={0}
            aria-label="입력 카드"
            w="100%"
            maxW="600px"
          >
            <Heading as="h2" size={{ base: 'md', md: 'xl' }} color={cardText} mb={2} textAlign="center">
              보고서 평가
            </Heading>
            <Text color={useColorModeValue('gray.600', 'mint.300')} mb={{ base: 3, md: 6 }} textAlign="center" fontSize={{ base: 'sm', md: 'md' }}>
              LLM(Claude, Local) 기반 보고서 정량 평가
            </Text>
            <Stack gap={{ base: 2, md: 4 }}>
              <FileUploader onFilesSelected={setFiles} />
              <ModelSelector models={MODEL_LIST} selectedModel={selectedModel} onChange={setSelectedModel} />
              <PromptEditor value={prompt} onChange={setPrompt} />
              <Button
                bg={buttonBg}
                color="white"
                borderRadius="full"
                px={{ base: 4, md: 8 }}
                py={{ base: 2, md: 4 }}
                fontWeight="bold"
                fontSize={{ base: 'md', md: 'lg' }}
                boxShadow="lg"
                _hover={{ bg: buttonHover, transform: "scale(1.04)" }}
                _active={{ bg: buttonActive }}
                _focus={{ boxShadow: "0 0 0 3px #90caf9" }}
                _disabled={{ bg: "gray.300", color: "gray.500", cursor: "not-allowed" }}
                transition="all 0.2s"
                aria-label="LLM 평가 요청 버튼"
                onClick={handleEvaluate}
                disabled={loading}
                tabIndex={0}
                role="button"
                w={{ base: '100%', md: 'auto' }}
              >
                평가 요청
              </Button>
            </Stack>
            {loading && <Spinner size="lg" color={spinnerColor} aria-label="로딩 중" mt={4} role="status" />}
            {error && (
              <Box bg={errorBg} borderRadius="md" p={3} mt={4} aria-label="에러 메시지" role="alert" aria-live="assertive">
                <Text color={errorText} fontWeight={600}>{error}</Text>
              </Box>
            )}
          </Box>
          {/* 평가 결과 카드 - maxW, overflow 조정 */}
          <Box
            bg={cardBg}
            borderRadius="xl"
            boxShadow="lg"
            p={{ base: 3, md: 8 }}
            tabIndex={0}
            aria-label="결과 카드"
            mt={{ base: 2, md: 0 }}
            w="100%"
            maxW="900px"
            overflowX="auto"
          >
            <ResultsDisplay results={results} />
          </Box>
        </Box>
      </Flex>
      {/* 푸터 */}
      <Box as="footer" w="100%" bg={footerBg} color={footerText} py={{ base: 2, md: 4 }} mt={{ base: 4, md: 8 }} role="contentinfo" aria-label="앱 푸터">
        <Container maxW="6xl" textAlign="center" fontSize={{ base: 'xs', md: 'sm' }}>
          © {new Date().getFullYear()} LLM Report Evaluator. All rights reserved.
        </Container>
      </Box>
    </Flex>
  );
};

export default App;
