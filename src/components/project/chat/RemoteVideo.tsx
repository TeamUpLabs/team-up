import React, { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMaximize, faMinimize } from '@fortawesome/free-solid-svg-icons';

interface RemoteVideoProps {
  stream: MediaStream | null;
  userName: string;
  userId: string;
  isPinned: boolean;
  muted?: boolean;
  onPinToggle: (userId: string) => void;
}

const RemoteVideo: React.FC<RemoteVideoProps> = ({ 
  stream, 
  userName, 
  userId, 
  isPinned,
  muted = false,
  onPinToggle
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
    
    const currentVideo = videoRef.current;
    return () => {
      if (currentVideo) {
        currentVideo.srcObject = null;
      }
    };
  }, [stream]);

  const handleVideoLoaded = () => {
    setVideoLoaded(true);
  };

  const handleVideoError = () => {
    setHasError(true);
  };

  const togglePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPinToggle(userId);
  };

  // 사용자 이름의 첫 글자를 가져오는 유틸리티 함수
  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <div 
      className={`relative w-full h-full overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900 group
        transition-all duration-300 rounded-xl ${isPinned ? 'ring-4 ring-indigo-500' : 'hover:ring-2 hover:ring-white/30'}`}
    >
      {stream && !hasError ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={muted}
            className={`w-full h-full object-cover ${!videoLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 transform rotate-y-180`}
            onLoadedData={handleVideoLoaded}
            onError={handleVideoError}
          />
          {!videoLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-white text-xl sm:text-2xl font-medium">
                {getInitials(userName)}
              </span>
            </div>
            {hasError && (
              <p className="text-white/70 text-sm mt-3">비디오를 불러올 수 없습니다</p>
            )}
          </div>
        </div>
      )}
      
      <div className="absolute top-0 inset-x-0 p-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md rounded-full pl-1.5 pr-3 py-1">
            <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white">
              {getInitials(userName)}
            </div>
            <span className="text-white text-xs font-medium">{userName}</span>
          </div>
          <button 
            onClick={togglePin}
            className={`w-7 h-7 rounded-full flex items-center justify-center
              ${isPinned ? 'bg-indigo-500 text-white' : 'bg-black/50 text-white/80 hover:bg-black/70 hover:text-white'}`}
          >
            <FontAwesomeIcon icon={isPinned ? faMinimize : faMaximize} className="text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoteVideo; 