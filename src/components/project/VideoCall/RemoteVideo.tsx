import React, { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMaximize, faMinimize, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

interface RemoteVideoProps {
  stream: MediaStream | null;
  userName: string;
  userId: string;
  userProfileImage: string | undefined;
  isPinned: boolean;
  muted?: boolean;
  isRemoteVideoOff?: boolean;
  isRemoteAudioMuted?: boolean;
  onPinToggle: (userId: string) => void;
}

const RemoteVideo: React.FC<RemoteVideoProps> = ({ 
  stream, 
  userName, 
  userId, 
  userProfileImage,
  isPinned,
  muted = false,
  isRemoteVideoOff = false,
  isRemoteAudioMuted = false,
  onPinToggle
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const previousStreamRef = useRef<MediaStream | null>(null);

  // Reset video loaded state when remote video state changes
  useEffect(() => {
    if (isRemoteVideoOff) {
      setVideoLoaded(false);
    } else if (!isRemoteVideoOff && stream) {
      // If video is turned back on, force a reload of the stream
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        setTimeout(() => {
          if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
          }
        }, 50);
      }
    }
  }, [isRemoteVideoOff, stream]);

  useEffect(() => {
    if (videoRef.current && stream) {
      // Check if this is a new stream (different from the previous one)
      const isNewStream = previousStreamRef.current !== stream;
      
      if (isNewStream) {
        console.log(`Setting new stream for peer ${userId}, isRemoteVideoOff=${isRemoteVideoOff}`);
        // Reset loaded state when we get a new stream
        setVideoLoaded(false);
        setHasError(false);
        
        // Save the current stream for future comparison
        previousStreamRef.current = stream;
        
        // Force a reload of the stream to trigger loadeddata event
        videoRef.current.srcObject = null;
        setTimeout(() => {
          if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
            
            // Create a direct event listener for stream loading
            const videoElement = videoRef.current;
            const handleVideoLoad = () => {
              console.log(`Direct event: Video loaded for peer ${userId}`);
              setVideoLoaded(true);
            };
            
            videoElement.addEventListener('loadeddata', handleVideoLoad);
            
            // Fallback: set loaded after a timeout if no event fires
            setTimeout(() => {
              if (!videoLoaded && !isRemoteVideoOff && stream.getVideoTracks().some(track => track.enabled)) {
                console.log(`Fallback: Setting video loaded for peer ${userId} after timeout`);
                setVideoLoaded(true);
              }
            }, 2000);
            
            return () => {
              videoElement.removeEventListener('loadeddata', handleVideoLoad);
            };
          }
        }, 50);
      } else if (!videoRef.current.srcObject) {
        // If we have a stream but no srcObject (rare case), set it
        videoRef.current.srcObject = stream;
      }
    }
    
    const currentVideo = videoRef.current;
    return () => {
      if (currentVideo) {
        currentVideo.srcObject = null;
      }
    };
  }, [stream, userId, isRemoteVideoOff, videoLoaded]);

  const handleVideoLoaded = () => {
    console.log(`Video loaded for peer ${userId}`);
    setVideoLoaded(true);
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error(`Video error for peer ${userId}:`, e);
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

  // Determine if we should show the avatar instead of video
  const shouldShowAvatar = !stream || hasError || isRemoteVideoOff;

  return (
    <div 
      className={`relative w-full h-full overflow-hidden bg-gray-900 group
        transition-all duration-300 rounded-md ${isPinned ? 'ring-2 ring-indigo-500' : ''}`}
    >
      {shouldShowAvatar ? (
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 relative rounded-full bg-gray-700 flex items-center justify-center shadow-lg">
              {userProfileImage ? (
                <Image src={userProfileImage} alt="Profile" className="w-full h-full object-fit rounded-full" quality={100} width={100} height={100} />
              ) : (
                <span className="text-white text-lg sm:text-xl font-medium">
                  {getInitials(userName)}
                </span>
              )}
            </div>
            {hasError && (
              <p className="text-white/70 text-xs mt-2">비디오를 불러올 수 없습니다</p>
            )}
            {isRemoteVideoOff && !hasError && stream && (
              <p className="text-white/70 text-xs mt-2">카메라가 꺼져 있습니다</p>
            )}
          </div>
        </div>
      ) : (
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
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </>
      )}
      
      <div className="absolute top-0 inset-x-0 p-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md rounded-full pl-1 pr-2 py-0.5">
            <div className="w-5 h-5 relative text-xs rounded-full bg-indigo-600 flex items-center justify-center text-white">
              {userProfileImage ? (
                <Image src={userProfileImage} alt="Profile" className="w-full h-full object-fit rounded-full" quality={100} width={100} height={100} />
              ) : (
                getInitials(userName)
              )}
            </div>
            <span className="text-white text-xs font-medium">{userName}</span>
            {isRemoteAudioMuted && (
              <FontAwesomeIcon icon={faMicrophoneSlash} className="text-red-400 text-xs ml-1" />
            )}
          </div>
          <button 
            onClick={togglePin}
            className={`w-6 h-6 rounded-full flex items-center justify-center
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