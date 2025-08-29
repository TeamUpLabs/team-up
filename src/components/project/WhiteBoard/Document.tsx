import { useState, useRef, useCallback, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Paperclip, X } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import MarkdownEditor from '@/components/ui/MarkdownEditor';
import { WhiteBoardCreateFormData, blankWhiteBoardCreateFormData } from '@/types/WhiteBoard';
import { useAuthStore } from '@/auth/authStore';

interface DocumentProps {
  formData?: WhiteBoardCreateFormData;
  onChange?: (data: WhiteBoardCreateFormData) => void;
}

export default function Document({
  formData,
  onChange,
}: DocumentProps) {
  const [tagInput, setTagInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [documentData, setDocumentData] = useState<WhiteBoardCreateFormData>(formData || blankWhiteBoardCreateFormData);
  const MAX_FILE_SIZE_MB = 10;
  const MAX_FILE_COUNT = 5;

  // Update internal state when formData prop changes
  useEffect(() => {
    if (formData) {
      setDocumentData(formData);
    }
  }, [formData]);

  const updateDocumentData = useCallback((updates: Partial<WhiteBoardCreateFormData>) => {
    const currentData = documentData;
    setDocumentData({ ...currentData, ...updates });
    onChange?.({ ...currentData, ...updates });
  }, [documentData, onChange]);

  // No longer needed as we're handling formData changes in the effect above

  // Handle text changes
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    updateDocumentData({ title: newTitle });
  };

  const handleContentChange = useCallback((value: string) => {
    updateDocumentData({ content: value });
  }, [updateDocumentData]);

  // Tag management
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isComposing) {
      e.preventDefault();

      const trimmedInput = tagInput.trim();
      if (trimmedInput) {
        const currentTags = documentData.tags || [];
        if (!currentTags.includes(trimmedInput)) {
          const updatedTags = [...currentTags, trimmedInput];
          updateDocumentData({ tags: updatedTags });
          setTagInput("");
        }
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = documentData.tags || [];
    updateDocumentData({ tags: currentTags.filter(tag => tag !== tagToRemove) });
  };

  // File attachment handling
  const processFiles = (files: FileList) => {
    if (files.length === 0) return;

    // Check file count limit
    if (documentData.attachments.length + files.length > MAX_FILE_COUNT) {
      useAuthStore.getState().setAlert(`최대 ${MAX_FILE_COUNT}개까지 첨부할 수 있습니다.`, "error");
      return;
    }

    const validFiles = Array.from(files).filter(file => {
      // Check file size (10MB limit)
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        useAuthStore.getState().setAlert(`파일 크기는 ${MAX_FILE_SIZE_MB}MB를 초과할 수 없습니다: ${file.name}`, "error");
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      const newAttachments = validFiles.map(file => ({
        filename: file.name,
        file_url: URL.createObjectURL(file),
        file_type: file.type,
        file_size: file.size,
      }));

      updateDocumentData({
        attachments: [...documentData.attachments, ...newAttachments]
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      // Reset the file input to allow selecting the same file again
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (index: number) => {
    const newAttachments = [...documentData.attachments];
    newAttachments.splice(index, 1);
    updateDocumentData({ attachments: newAttachments });
  };

  return (
    <div className="space-y-6">
      <Input
        id="title"
        label="제목"
        isRequired
        value={documentData.title}
        onChange={handleTitleChange}
        placeholder="문서 제목을 입력하세요"
        className="w-full"
        autoFocus
      />

      <MarkdownEditor
        value={documentData.content}
        onChange={handleContentChange}
        placeholder="문서 내용을 작성하세요."
        label="내용"
        isRequired
      />

      <div className="space-y-2">
        <Input
          type="text"
          value={tagInput}
          label="태그"
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
          placeholder="태그를 입력하고 엔터"
          className="flex-1 min-w-[120px] p-1 outline-none text-sm"
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {documentData.tags.map((tag, idx) => (
            <Badge
              key={idx}
              color="blue"
              onRemove={() => removeTag(tag)}
              content={tag}
              isEditable
              fit
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-text-secondary">
            파일 첨부
            <span className="ml-1 text-xs text-text-secondary font-normal">(최대 10MB)</span>
          </label>
          <p className="text-xs text-text-secondary">
            문서와 관련된 파일을 첨부해주세요. (PDF, 이미지, 문서 파일 등, 최대 {MAX_FILE_COUNT}개, 각 {MAX_FILE_SIZE_MB}MB 이하)
          </p>
        </div>

        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ${
            isDragging
              ? 'border-component-border bg-component-background'
              : 'border-component-border hover:bg-component-tertiary-background'
          }`}
        >
          <div className="p-2 mb-2 bg-component-background rounded-full">
            <Paperclip className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-xs text-text-secondary text-center">
            <span className="font-medium text-blue-600 hover:text-blue-500">
              {isDragging ? '파일을 여기에 드롭하세요' : '파일을 선택하세요'}
            </span>
            {!isDragging && ' 또는 드래그 앤 드롭'}
          </p>
          <p className="text-xs text-text-secondary">
            PDF, JPG, PNG, DOCX, XLSX, PPT, PPTX (최대 {MAX_FILE_SIZE_MB}MB)
          </p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
          />
        </div>

        {documentData.attachments.length > 0 && (
          <div className="mt-3 space-y-2">
            <p className="text-xs font-medium text-text-secondary">
              첨부된 파일 {documentData.attachments.length}개
            </p>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
            {documentData.attachments.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-component-background rounded border border-component-border">
                  <div className="flex items-center space-x-2">
                    <Paperclip className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{file.filename}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-text-secondary hover:text-red-500 p-1 rounded-full hover:bg-component-tertiary-background cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}