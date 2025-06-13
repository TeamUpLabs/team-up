import React, { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophoneSlash, faVideoSlash } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

interface LocalVideoProps {
  isAudioMuted: boolean;
  isVideoOff: boolean;
  localVideoRef: React.RefObject<HTMLVideoElement> | ((instance: HTMLVideoElement | null) => void);
  userName: string;
}

const LocalVideo: React.FC<LocalVideoProps> = memo(({
  isAudioMuted,
  isVideoOff,
  localVideoRef,
  userName
}) => {
  // Get avatar letter
  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="relative rounded-md overflow-hidden h-full w-full bg-gray-900"
    >
      <div className="absolute top-0 left-0 w-full p-1.5 z-10 opacity-70 hover:opacity-100 transition-opacity">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md rounded-full pl-1 pr-2 py-0.5">
            <div className="w-5 h-5 text-xs rounded-full bg-indigo-600 flex items-center justify-center text-white">
              {getInitials(userName)}
            </div>
            <span className="text-white text-xs font-medium">{userName}</span>
          </div>
          <div className="flex items-center gap-1">
            {isAudioMuted && (
              <div className="bg-red-500/80 backdrop-blur-sm rounded-full p-0.5 w-4 h-4 flex items-center justify-center">
                <FontAwesomeIcon icon={faMicrophoneSlash} className="text-white text-xs" />
              </div>
            )}
            {isVideoOff && (
              <div className="bg-red-500/80 backdrop-blur-sm rounded-full p-0.5 w-4 h-4 flex items-center justify-center">
                <FontAwesomeIcon icon={faVideoSlash} className="text-white text-xs" />
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="relative w-full h-full">
        {isVideoOff ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-700 flex items-center justify-center shadow-lg">
              <span className="text-white text-lg sm:text-xl font-medium">{getInitials(userName)}</span>
            </div>
            <p className="text-white/70 text-xs mt-2">카메라가 꺼져 있습니다</p>
          </div>
        ) : (
          <video
            ref={localVideoRef as React.RefObject<HTMLVideoElement>}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transform rotate-y-180"
          />
        )}
      </div>
    </motion.div>
  );
});

LocalVideo.displayName = 'LocalVideo';

export default LocalVideo; 