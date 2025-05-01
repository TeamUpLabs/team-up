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

  return (
    <div 
      className={`relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900 group
        transition-all duration-300 ${isPinned ? 'ring-4 ring-indigo-500' : 'hover:ring-2 hover:ring-white/30'}`}
      onClick={togglePin}
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
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-white text-3xl font-medium">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            {hasError && (
              <p className="text-white/70 text-sm mt-3">비디오를 불러올 수 없습니다</p>
            )}
          </div>
        </div>
      )}
      
      <div className="absolute top-0 inset-x-0 p-2 md:p-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md rounded-full pl-1.5 pr-3 py-1">
            <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="text-white text-sm font-medium">{userName}</span>
          </div>
          <div className="flex gap-1.5">
            <button 
              onClick={togglePin}
              className={`w-8 h-8 rounded-full flex items-center justify-center
                ${isPinned ? 'bg-indigo-500 text-white' : 'bg-black/50 text-white/80 hover:bg-black/70 hover:text-white'}`}
            >
              <FontAwesomeIcon icon={isPinned ? faMinimize : faMaximize} className="text-xs" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoteVideo; 