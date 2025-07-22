import { useState, useRef, useCallback, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Paperclip, X } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { useTheme } from '@/contexts/ThemeContext';
import MarkdownEditor from '@/components/ui/MarkdownEditor';

// Types
type Attachment = {
  name: string;
  url: string;
  size?: number;
};

type DocumentData = {
  title: string;
  content: string;
  tags: string[];
  attachments: Attachment[];
};

interface DocumentProps {
  initialData?: Partial<DocumentData>;
  onChange?: (data: DocumentData) => void;
}

export default function Document({
  initialData = {},
  onChange,
}: DocumentProps) {
  const [documentData, setDocumentData] = useState<DocumentData>({
    title: initialData.title || '',
    content: initialData.content || '',
    tags: initialData.tags || [],
    attachments: initialData.attachments || []
  });

  const [tagInput, setTagInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { isDark } = useTheme();

  // Update document data and notify parent
  const updateDocumentData = useCallback((updates: Partial<DocumentData>) => {
    setDocumentData(prev => {
      const newData = { ...prev, ...updates };
      onChange?.(newData);
      return newData;
    });
  }, [onChange]);


  // Update content when history changes
  useEffect(() => {
    if (documentData.content) {
      setDocumentData(prev => ({
        ...prev,
        content: documentData.content
      }));
    }
  }, [documentData.content]);

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
      if (trimmedInput && !documentData.tags.includes(trimmedInput)) {
        const updatedTags = [...documentData.tags, trimmedInput];
        updateDocumentData({ tags: updatedTags });
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    updateDocumentData({ tags: documentData.tags.filter(tag => tag !== tagToRemove) });
  };

  // File attachment handling
  const processFiles = (files: FileList) => {
    if (files.length > 0) {
      const newAttachments = Array.from(files).map(file => ({
        name: file.name,
        url: URL.createObjectURL(file),
        size: file.size
      }));

      updateDocumentData({
        attachments: [...documentData.attachments, ...newAttachments]
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
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

  const removeAttachment = (index: number) => {
    const newAttachments = documentData.attachments.filter((_, i) => i !== index);
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
              isDark={isDark}
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
            문서와 관련된 파일을 첨부해주세요. (PDF, 이미지, 문서 파일 등)
          </p>
        </div>

        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ${isDragging
            ? 'border-component-border bg-component-background'
            : 'border-component-border hover:bg-component-tertiary-background'
            }`}
        >
          <div className="p-2 mb-2 bg-component-background rounded-full">
            <Paperclip className="w-5 h-5 text-blue-600" />
          </div>
          <p className="mb-1 text-sm text-text-secondary">
            <span className="font-medium text-blue-600 hover:text-blue-500">
              {isDragging ? '파일을 여기에 드롭하세요' : '파일을 선택하세요'}
            </span>
            {!isDragging && ' 또는 드래그 앤 드롭'}
          </p>
          <p className="text-xs text-text-secondary">
            PDF, JPG, PNG, DOCX, XLSX (최대 10MB)
          </p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
          />
        </div>

        {documentData.attachments.length > 0 && (
          <div className="mt-3 space-y-2">
            <p className="text-xs font-medium text-text-secondary">
              첨부된 파일 {documentData.attachments.length}개
            </p>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
              {documentData.attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-component-background rounded-lg border border-component-border hover:shadow-sm transition-shadow duration-150"
                >
                  <div className="flex items-center min-w-0">
                    <div className="flex items-center justify-center w-8 h-8 mr-3 bg-component-tertiary-background rounded-md">
                      <Paperclip className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {file.size ? `${Math.round(file.size / 1024)} KB` : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeAttachment(index);
                    }}
                    className="p-1 text-text-secondary hover:text-red-500 rounded-full hover:bg-component-tertiary-background transition-colors"
                    aria-label="파일 삭제"
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