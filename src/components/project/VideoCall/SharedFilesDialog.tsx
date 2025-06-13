import React, { useEffect, useState } from 'react';
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
  faEye
} from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import type { SharedFile } from '@/components/project/VideoCall/VideoCall';

interface SharedFilesDialogProps {
  isVisible: boolean;
  sharedFiles: SharedFile[];
  fileUploadProgress: number | null;
  onClose: () => void;
  onShareFile: () => void;
  onPreviewFile: (file: SharedFile) => void;
  onDownloadFile: (file: SharedFile) => void;
  getUserName: (id: string) => string;
  formatFileSize: (bytes: number) => string;
  formatTimestamp: (timestamp: number) => string;
}

const SharedFilesDialog: React.FC<SharedFilesDialogProps> = ({
  isVisible,
  sharedFiles,
  fileUploadProgress,
  onClose,
  onShareFile,
  onPreviewFile,
  onDownloadFile,
  getUserName,
  formatFileSize,
  formatTimestamp
}) => {
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);

  useEffect(() => {
    if (fileUploadProgress === 100) {
      setShowCompletionMessage(true);
      const timer = setTimeout(() => {
        setShowCompletionMessage(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [fileUploadProgress]);

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

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="absolute right-4 bottom-28 md:bottom-32 bg-black/80 backdrop-blur-xl rounded-2xl shadow-xl z-20 w-80 md:w-96 overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <h3 className="text-white text-base font-medium">공유된 파일</h3>
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>

          {/* Upload progress indicator */}
          {(fileUploadProgress !== null && fileUploadProgress < 100) || showCompletionMessage ? (
            <div className="px-4 py-3 border-b border-white/10">
              <div className="flex items-center justify-between text-sm text-white mb-1">
                <span>{fileUploadProgress === 100 ? '업로드 완료' : '업로드 중...'}</span>
                <span>{fileUploadProgress}%</span>
              </div>
              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${fileUploadProgress === 100 ? 'bg-green-600' : 'bg-indigo-600'} transition-all duration-300 ease-out`}
                  style={{ width: `${fileUploadProgress}%` }}
                ></div>
              </div>
            </div>
          ) : null}

          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <span className="text-white text-sm">새 파일 공유하기</span>
            <button
              onClick={onShareFile}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded transition-colors"
            >
              파일 선택
            </button>
          </div>

          <div className="max-h-72 overflow-y-auto">
            {sharedFiles.length === 0 ? (
              <div className="py-8 flex flex-col items-center justify-center text-gray-400 text-sm">
                <FontAwesomeIcon icon={faFile} className="text-2xl mb-2" />
                <p>공유된 파일이 없습니다</p>
              </div>
            ) : (
              <ul className="divide-y divide-white/10">
                {sharedFiles.map(file => (
                  <li key={file.id} className="px-4 py-3 hover:bg-white/5">
                    <div className="flex items-center">
                      <div className="mr-3 text-indigo-400">
                        <FontAwesomeIcon icon={getFileIcon(file.type)} size="lg" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm truncate">{file.name}</p>
                        <div className="flex items-center text-xs text-gray-400 mt-0.5">
                          <span>{formatFileSize(file.size)}</span>
                          <span className="mx-1.5">•</span>
                          <span>공유자: {getUserName(file.sharedBy)}</span>
                          <span className="mx-1.5">•</span>
                          <span>{formatTimestamp(file.timestamp)}</span>
                        </div>
                      </div>
                      <div className="flex">
                        <button
                          onClick={() => onPreviewFile(file)}
                          className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded transition-colors"
                          aria-label="파일 보기"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button
                          onClick={() => onDownloadFile(file)}
                          className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded transition-colors"
                          aria-label="파일 다운로드"
                        >
                          <FontAwesomeIcon icon={faDownload} />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SharedFilesDialog; 