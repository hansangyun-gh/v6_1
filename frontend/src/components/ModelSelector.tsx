/**
 * 세련된 모델 선택 드롭다운 컴포넌트
 * @description Claude, Local 등 LLM 모델 선택 드롭다운
 * @prop models 선택 가능한 모델 목록
 * @prop selectedModel 현재 선택된 모델
 * @prop onChange 모델 변경 콜백
 */
import React from 'react';
import { FormControl, FormLabel, Select, useColorModeValue } from '@chakra-ui/react';

interface ModelSelectorProps {
  models: string[];
  selectedModel: string;
  onChange: (model: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ models, selectedModel, onChange }) => {
  const labelColor = useColorModeValue('brand.600', 'mint.200');
  const selectBg = useColorModeValue('gray.50', 'gray.700');
  const selectFocus = useColorModeValue('brand.500', 'mint.400');
  return (
    <FormControl>
      <FormLabel fontWeight="bold" color={labelColor}>모델 선택</FormLabel>
      <Select
        value={selectedModel}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
        borderRadius="full"
        boxShadow="md"
        bg={selectBg}
        _focus={{ borderColor: selectFocus, boxShadow: "0 0 0 2px #90caf9" }}
        fontWeight="medium"
        aria-label="모델 선택"
      >
        {models.map(model => (
          <option key={model} value={model}>{model}</option>
        ))}
      </Select>
    </FormControl>
  );
};

export default ModelSelector; 