import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faVolumeHigh, 
  faCircleInfo,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

interface VideoOptionsMenuProps {
  onOpenSpeakerSettings?: () => void;
  onShowConnectionInfo?: () => void;
  onClose: () => void;
}

const VideoOptionsMenu: React.FC<VideoOptionsMenuProps> = ({
  onOpenSpeakerSettings,
  onShowConnectionInfo,
  onClose
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className="absolute bottom-28 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-xl rounded-2xl shadow-xl z-20 w-72 overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
        <h3 className="text-white text-base font-medium">옵션</h3>
        <button 
          onClick={onClose}
          className="text-gray-300 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      
      <div className="py-2">
        <button 
          onClick={onOpenSpeakerSettings}
          className="w-full text-left px-5 py-3.5 flex items-center gap-4 text-white hover:bg-white/10 transition-colors"
        >
          <FontAwesomeIcon icon={faVolumeHigh} className="w-5 text-indigo-400" />
          <span>스피커 설정</span>
        </button>
        
        <button 
          onClick={onShowConnectionInfo}
          className="w-full text-left px-5 py-3.5 flex items-center gap-4 text-white hover:bg-white/10 transition-colors"
        >
          <FontAwesomeIcon icon={faCircleInfo} className="w-5 text-indigo-400" />
          <span>연결 정보 보기</span>
        </button>
      </div>
    </motion.div>
  );
};

export default VideoOptionsMenu; 