import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

interface VideoSettingsProps {
  onClose: () => void;
}

const VideoSettings: React.FC<VideoSettingsProps> = ({ onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className="absolute bottom-28 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-xl rounded-2xl shadow-xl z-20 w-80 overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
        <h3 className="text-white text-base font-medium">설정</h3>
        <button 
          onClick={onClose}
          className="text-gray-300 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      
      <div className="p-6 space-y-6">
        <div>
          <h4 className="text-white text-sm font-medium mb-3">오디오</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-white/80 text-sm">마이크</label>
              <select className="bg-black/50 text-white text-sm border border-white/20 rounded-lg px-3 py-2">
                <option>기본 마이크</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-white/80 text-sm">스피커</label>
              <select className="bg-black/50 text-white text-sm border border-white/20 rounded-lg px-3 py-2">
                <option>기본 스피커</option>
              </select>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-white text-sm font-medium mb-3">비디오</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-white/80 text-sm">카메라</label>
              <select className="bg-black/50 text-white text-sm border border-white/20 rounded-lg px-3 py-2">
                <option>기본 카메라</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoSettings; 