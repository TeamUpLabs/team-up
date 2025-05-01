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
  const getAvatarLetter = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="relative rounded-xl overflow-hidden shadow-xl h-full w-full bg-gradient-to-b from-gray-800 to-gray-900"
    >
      <div className="absolute top-0 left-0 w-full p-2 z-10 opacity-70 hover:opacity-100 transition-opacity">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md rounded-full pl-1.5 pr-3 py-1">
            <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white">
              {getAvatarLetter(userName)}
            </div>
            <span className="text-white text-xs font-medium">{userName}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {isAudioMuted && (
              <div className="bg-red-500/80 backdrop-blur-sm rounded-full p-1 w-5 h-5 flex items-center justify-center">
                <FontAwesomeIcon icon={faMicrophoneSlash} className="text-white text-xs" />
              </div>
            )}
            {isVideoOff && (
              <div className="bg-red-500/80 backdrop-blur-sm rounded-full p-1 w-5 h-5 flex items-center justify-center">
                <FontAwesomeIcon icon={faVideoSlash} className="text-white text-xs" />
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="relative w-full h-full">
        {isVideoOff ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-white text-xl sm:text-2xl font-medium">{getAvatarLetter(userName)}</span>
            </div>
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