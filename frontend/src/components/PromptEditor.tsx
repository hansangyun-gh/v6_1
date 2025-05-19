/**
 * 평가 프롬프트 입력 및 관리 컴포넌트
 * @description 평가 프롬프트 입력, 저장, 불러오기, 삭제, 에러/성공 메시지 표시
 * @prop value 현재 평가 프롬프트 값
 * @prop onChange 평가 프롬프트 변경 콜백
 */
import React, { useState, useEffect } from 'react';
import {
  FormControl, FormLabel, Textarea, useColorModeValue, Input, Button, Select, HStack, useToast, Box, Spinner
} from '@chakra-ui/react';
import { Prompt } from '../types/interfaces';
import * as promptApi from '../services/promptService';

interface PromptEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const PromptEditor: React.FC<PromptEditorProps> = ({ value, onChange }) => {
  const labelColor = useColorModeValue('brand.600', 'mint.200');
  const textareaBg = useColorModeValue('gray.50', 'gray.700');
  const textareaFocus = useColorModeValue('brand.500', 'mint.400');
  const textareaColor = useColorModeValue('gray.800', 'mint.200');
  const toast = useToast();

  // 상태
  const [promptName, setPromptName] = useState('');
  const [promptList, setPromptList] = useState<Prompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  // 프롬프트 목록 불러오기
  const loadPrompts = async () => {
    setLoading(true);
    try {
      const list = await promptApi.fetchPrompts();
      setPromptList(list);
    } catch (err: any) {
      toast({ status: 'error', title: '프롬프트 목록 불러오기 실패', description: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrompts();
  }, []);

  // 저장
  const handleSave = async () => {
    if (!promptName.trim()) {
      toast({ status: 'warning', title: '이름을 입력하세요.' });
      return;
    }
    try {
      await promptApi.savePrompt({ name: promptName, value });
      toast({ status: 'success', title: '저장 완료' });
      setPromptName('');
      loadPrompts();
    } catch (err: any) {
      toast({ status: 'error', title: '저장 실패', description: err.message });
    }
  };

  // 불러오기
  const handleLoad = async () => {
    if (!selectedPrompt) return;
    try {
      const prompt = await promptApi.fetchPromptByName(selectedPrompt);
      onChange(prompt.value);
      toast({ status: 'success', title: '불러오기 완료' });
    } catch (err: any) {
      toast({ status: 'error', title: '불러오기 실패', description: err.message });
    }
  };

  // 삭제
  const handleDelete = async () => {
    if (!selectedPrompt) return;
    try {
      await promptApi.deletePrompt(selectedPrompt);
      toast({ status: 'success', title: '삭제 완료' });
      setSelectedPrompt('');
      loadPrompts();
    } catch (err: any) {
      toast({ status: 'error', title: '삭제 실패', description: err.message });
    }
  };

  return (
    <FormControl>
      <FormLabel fontWeight="bold" color={labelColor}>평가 프롬프트</FormLabel>
      <Textarea
        value={value}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
        borderRadius="lg"
        boxShadow="md"
        minH="100px"
        bg={textareaBg}
        color={textareaColor}
        _focus={{ borderColor: textareaFocus, boxShadow: "0 0 0 2px #90caf9" }}
        placeholder="평가 프롬프트를 입력하세요..."
        fontSize="md"
        aria-label="평가 프롬프트 입력"
      />
      <Box mt={3}>
        <HStack spacing={2} mb={2}>
          <Input
            value={promptName}
            onChange={e => setPromptName(e.target.value)}
            placeholder="프롬프트 이름"
            size="sm"
            aria-label="프롬프트 이름 입력"
            maxW="180px"
          />
          <Button size="sm" colorScheme="blue" onClick={handleSave} isDisabled={loading}>저장</Button>
        </HStack>
        <HStack spacing={2}>
          <Select
            placeholder="저장된 프롬프트 선택"
            value={selectedPrompt}
            onChange={e => setSelectedPrompt(e.target.value)}
            size="sm"
            maxW="220px"
            aria-label="저장된 프롬프트 선택"
            isDisabled={loading || promptList.length === 0}
          >
            {promptList.map(p => (
              <option key={p.name} value={p.name}>{p.name}</option>
            ))}
          </Select>
          <Button size="sm" onClick={handleLoad} isDisabled={!selectedPrompt || loading}>불러오기</Button>
          <Button size="sm" colorScheme="red" onClick={handleDelete} isDisabled={!selectedPrompt || loading}>삭제</Button>
          {loading && <Spinner size="sm" />}
        </HStack>
      </Box>
    </FormControl>
  );
};

export default PromptEditor; 