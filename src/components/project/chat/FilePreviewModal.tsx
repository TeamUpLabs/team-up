import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFile,
  faFilePdf,
  faFileImage,
  faFileWord,
  faFileExcel,
  faFilePowerpoint,
  faFileZipper,
  faFileLines,
  faXmark,
  faDownload,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface SharedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  sharedBy: string;
  timestamp: number;
}

interface FilePreviewModalProps {
  file: SharedFile | null;
  sharedFiles: SharedFile[];
  onClose: () => void;
  onDownload: (file: SharedFile) => void;
  getUserName: (id: string) => string;
  formatFileSize: (bytes: number) => string;
  onNavigate: (direction: 'next' | 'prev') => void;
}

const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  file,
  sharedFiles,
  onClose,
  onDownload,
  getUserName,
  formatFileSize,
  onNavigate
}) => {
  if (!file) return null;

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return faFilePdf;
    if (fileType.includes('image')) return faFileImage;
    if (fileType.includes('word') || fileType.includes('document')) return faFileWord;
    if (fileType.includes('sheet') || fileType.includes('excel')) return faFileExcel;
    if (fileType.includes('presentation') || fileType.includes('powerpoint')) return faFilePowerpoint;
    if (fileType.includes('zip') || fileType.includes('compressed')) return faFileZipper;
    if (fileType.includes('text')) return faFileLines;
    return faFile;
  };

  const navigatePreview = (direction: 'next' | 'prev') => {
    if (!file || sharedFiles.length <= 1) return;
    onNavigate(direction);
  };

  const renderPreviewContent = () => {
    // Image preview
    if (file.type.startsWith('image/')) {
      return (
        <Image
          src={file.url}
          alt={file.name}
          className="max-w-full max-h-full object-contain"
          fill
        />
      );
    }

    // PDF preview
    if (file.type === 'application/pdf') {
      return (
        <iframe
          src={`${file.url}#view=FitH`}
          title={file.name}
          className="w-full h-full border-0"
        />
      );
    }

    // Text preview
    if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      return (
        <iframe
          src={file.url}
          title={file.name}
          className="w-full h-full border-0 bg-white"
        />
      );
    }

    // Unsupported file type
    return (
      <div className="flex flex-col items-center justify-center gap-4 text-white p-8">
        <FontAwesomeIcon icon={getFileIcon(file.type)} className="text-6xl text-indigo-400" />
        <div className="text-center">
          <h3 className="text-xl font-medium mb-2">{file.name}</h3>
          <p className="text-gray-300">이 파일 유형은 미리보기를 지원하지 않습니다</p>
          <button
            onClick={() => onDownload(file)}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <FontAwesomeIcon icon={faDownload} />
            <span>파일 다운로드</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {file && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/80 z-[10000] flex flex-col"
        >
          {/* Preview header */}
          <div className="bg-black/70 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={getFileIcon(file.type)} className="text-indigo-400" />
              <div>
                <h3 className="text-white font-medium">{file.name}</h3>
                <p className="text-gray-300 text-sm">
                  {formatFileSize(file.size)} • 공유자: {getUserName(file.sharedBy)}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-white/10"
            >
              <FontAwesomeIcon icon={faXmark} size="lg" />
            </button>
          </div>

          {/* Preview content */}
          <div className="flex-1 flex items-center justify-center overflow-auto p-4 relative">
            {renderPreviewContent()}

            {/* Navigation controls for multiple files */}
            {sharedFiles.length > 1 && (
              <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 flex justify-between px-4 pointer-events-none">
                <button
                  onClick={() => navigatePreview('prev')}
                  className="bg-black/50 hover:bg-black/70 w-10 h-10 rounded-full flex items-center justify-center text-white pointer-events-auto"
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <button
                  onClick={() => navigatePreview('next')}
                  className="bg-black/50 hover:bg-black/70 w-10 h-10 rounded-full flex items-center justify-center text-white pointer-events-auto"
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            )}
          </div>

          {/* Footer with download button */}
          <div className="bg-black/70 p-3 flex justify-end">
            <button
              onClick={() => onDownload(file)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faDownload} />
              <span>다운로드</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FilePreviewModal; 