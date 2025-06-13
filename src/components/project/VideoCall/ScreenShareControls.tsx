import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeHigh, faVolumeMute, faXmark } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

interface ScreenShareControlsProps {
  onClose: () => void;
  onStartWithAudio: () => void;
  onStartWithoutAudio: () => void;
}

const ScreenShareControls: React.FC<ScreenShareControlsProps> = ({
  onClose,
  onStartWithAudio,
  onStartWithoutAudio
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <motion.div
        className="bg-gray-900 rounded-xl shadow-2xl p-5 max-w-md w-full border border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white text-lg font-medium">화면 공유 설정</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        
        <p className="text-gray-300 text-sm mb-5">
          화면을 공유하는 방식을 선택하세요. 시스템 소리와 함께 공유하거나, 영상만 공유할 수 있습니다.
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onStartWithAudio}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-4 px-3 flex flex-col items-center transition-colors"
          >
            <div className="bg-indigo-500 rounded-full p-3 mb-2">
              <FontAwesomeIcon icon={faVolumeHigh} className="w-5 h-5" />
            </div>
            <span className="font-medium">소리와 함께 공유</span>
            <span className="text-xs mt-1 text-indigo-300">시스템 오디오 포함</span>
          </button>
          
          <button
            onClick={onStartWithoutAudio}
            className="bg-gray-700 hover:bg-gray-600 text-white rounded-lg py-4 px-3 flex flex-col items-center transition-colors"
          >
            <div className="bg-gray-600 rounded-full p-3 mb-2">
              <FontAwesomeIcon icon={faVolumeMute} className="w-5 h-5" />
            </div>
            <span className="font-medium">화면만 공유</span>
            <span className="text-xs mt-1 text-gray-400">오디오 없음</span>
          </button>
        </div>
        
        <p className="text-gray-400 text-xs mt-5">
          참고: 브라우저에서 화면과 함께 시스템 오디오 공유를 지원하지 않는 경우, 영상만 공유됩니다.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ScreenShareControls; 