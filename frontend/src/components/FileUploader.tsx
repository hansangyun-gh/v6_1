/**
 * 세련된 파일 업로드 컴포넌트 (Dropzone 스타일)
 */
import React, { useRef } from 'react';
import { Box, Text, VStack, Icon, useColorMode } from '@chakra-ui/react';
import { FiUploadCloud } from 'react-icons/fi';

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFilesSelected }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = React.useState<File[]>([]);
  const { colorMode } = useColorMode();
  const [isDragActive, setIsDragActive] = React.useState(false);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files ? Array.from(e.target.files) : [];
    setFiles(selected);
    onFilesSelected(selected);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    const droppedFiles = e.dataTransfer.files ? Array.from(e.dataTransfer.files) : [];
    setFiles(droppedFiles);
    onFilesSelected(droppedFiles);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  return (
    <VStack gap={3} align="stretch">
      <Box
        border="2px dashed"
        borderColor={isDragActive ? (colorMode === 'dark' ? 'mint.400' : 'brand.500') : (colorMode === 'dark' ? 'mint.300' : 'brand.300')}
        borderRadius="xl"
        bg={isDragActive ? (colorMode === 'dark' ? 'gray.700' : 'brand.100') : (colorMode === 'dark' ? 'gray.800' : 'brand.50')}
        p={6}
        textAlign="center"
        cursor="pointer"
        _hover={{ borderColor: colorMode === 'dark' ? 'mint.400' : 'brand.500', bg: colorMode === 'dark' ? 'gray.700' : 'brand.100', transform: 'scale(1.02)' }}
        transition="all 0.2s"
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        aria-label="파일 업로드 영역"
        aria-dropeffect="copy"
        role="button"
        tabIndex={0}
      >
        <Icon as={FiUploadCloud} boxSize={8} color={colorMode === 'dark' ? 'mint.300' : 'brand.400'} mb={2} transition="color 0.2s" />
        <Text color={colorMode === 'dark' ? 'mint.200' : 'gray.600'} fontWeight="bold" transition="color 0.2s">
          파일 선택 또는 드래그
        </Text>
        {files.length > 0 ? (
          <VStack as="ul" spacing={0.5} align="center" mt={2} maxH="80px" overflowY="auto">
            {files.map((file, idx) => (
              <Text as="li" key={file.name + idx} fontSize="sm" color={colorMode === 'dark' ? 'gray.300' : 'gray.500'} noOfLines={1} maxW="200px">
                {file.name}
              </Text>
            ))}
          </VStack>
        ) : (
          <Text fontSize="sm" color={colorMode === 'dark' ? 'gray.400' : 'gray.400'} transition="color 0.2s">
            선택된 파일 없음
          </Text>
        )}
      </Box>
      <input
        type="file"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        aria-label="파일 선택"
        multiple
      />
    </VStack>
  );
};

export default FileUploader; 