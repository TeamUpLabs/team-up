import React, { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash, faVideo, faVideoSlash, faPhone, faUserGroup, faMaximize, faMinimize, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useProject } from '@/contexts/ProjectContext';
import useWebRTC from '@/hooks/useWebRTC';

interface VideoCallProps {
  channelId: string;
  userId: string;
  onClose: () => void;
}

const VideoCall: React.FC<VideoCallProps> = ({ channelId, userId, onClose }) => {
  const { project } = useProject();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isParticipantListVisible, setIsParticipantListVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { 
    localStream, 
    peers, 
    isAudioMuted, 
    isVideoOff, 
    connectionStatus, 
    toggleAudio, 
    toggleVideo, 
    endCall,
    setLocalVideoRef
  } = useWebRTC({ 
    channelId, 
    userId, 
    projectId: project?.id 
  });

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Handle fullscreen change event
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleParticipantList = () => {
    setIsParticipantListVisible(prev => !prev);
  };

  const handleEndCall = () => {
    endCall();
    onClose();
  };

  // Video element component for remote videos
  const RemoteVideo = React.memo(({ stream }: { stream: MediaStream | null }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

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

    return (
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-contain bg-gray-900"
      />
    );
  });
  RemoteVideo.displayName = 'RemoteVideo';

  // Render a video element with participant info
  const renderVideoElement = (stream: MediaStream | null, userId: string, isLocal: boolean = false) => {
    return (
      <div 
        className={`relative rounded-lg overflow-hidden border-2 h-full
          ${isLocal ? 'border-blue-400' : 'border-transparent hover:border-gray-300'}`}
      >
        <div className="absolute top-2 left-2 z-10 bg-black bg-opacity-50 px-3 py-1 rounded-full text-white text-sm">
          {isLocal ? 'You' : userId}
          {isLocal && isAudioMuted && (
            <FontAwesomeIcon icon={faMicrophoneSlash} className="ml-2 text-red-500" />
          )}
        </div>
        
        {stream ? (
          isLocal ? (
            <video
              ref={setLocalVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-contain bg-gray-900"
            />
          ) : (
            <RemoteVideo stream={stream} />
          )
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-800 text-white">
            <div className="text-center">
              <FontAwesomeIcon icon={faUserGroup} className="text-gray-400 text-4xl mb-3" />
              <p>연결 중...</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-gray-900 flex flex-col z-50"
    >
      {/* Header - simplified */}
      <div className="px-4 py-3 bg-gray-800 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <h2 className="text-white">채널: #{channelId}</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleParticipantList}
            className="text-white hover:bg-gray-700 p-2 rounded relative"
            title="참가자 목록"
          >
            <FontAwesomeIcon icon={faUserGroup} />
            <span className="absolute -top-1 -right-1 bg-blue-500 text-xs text-white rounded-full w-4 h-4 flex items-center justify-center">
              {peers.length + 1}
            </span>
          </button>
          <button 
            onClick={toggleFullscreen}
            className="text-white hover:bg-gray-700 p-2 rounded"
            title={isFullscreen ? "전체화면 종료" : "전체화면"}
          >
            <FontAwesomeIcon icon={isFullscreen ? faMinimize : faMaximize} />
          </button>
        </div>
      </div>
      
      {/* Participants list modal */}
      {isParticipantListVisible && (
        <div className="absolute top-14 right-4 bg-gray-800 rounded-md shadow-lg z-20 w-64 overflow-hidden">
          <div className="flex items-center justify-between bg-gray-700 px-4 py-2">
            <h3 className="text-white font-medium">참가자 ({peers.length + 1})</h3>
            <button 
              onClick={toggleParticipantList}
              className="text-gray-300 hover:text-white"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <ul className="max-h-80 overflow-y-auto">
            {/* Local user */}
            <li className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                  {userId.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white">{userId} (You)</p>
                  <p className="text-xs text-gray-400">로컬</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {isAudioMuted && <FontAwesomeIcon icon={faMicrophoneSlash} className="text-red-500" />}
                {isVideoOff && <FontAwesomeIcon icon={faVideoSlash} className="text-red-500" />}
              </div>
            </li>
            
            {/* Remote users */}
            {peers.map(peer => (
              <li key={`list-${peer.userId}`} className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white">
                    {peer.userId.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white">{peer.userId}</p>
                    <p className="text-xs text-gray-400">원격</p>
                  </div>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Status message when no peers */}
      {peers.length === 0 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-gray-800 bg-opacity-80 px-6 py-4 rounded-lg text-white text-center">
          <p className="text-lg">{connectionStatus}</p>
          <p className="text-sm mt-2 text-gray-300">다른 참가자가 입장할 때까지 기다려주세요</p>
        </div>
      )}
      
      {/* Video container - grid layout */}
      <div className="flex-1 p-4">
        <div className={`grid gap-4 h-full ${
          peers.length === 0 ? 'grid-cols-1' : 
          peers.length === 1 ? 'grid-cols-2' : 
          peers.length <= 3 ? 'grid-cols-2 md:grid-cols-3' : 
          'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
        }`}>
          {/* Local video */}
          <div key="local-video">
            {renderVideoElement(localStream, 'You', true)}
          </div>
          
          {/* Remote videos */}
          {peers.map(peer => (
            <div key={peer.userId}>
              {renderVideoElement(peer.stream || null, peer.userId)}
            </div>
          ))}
        </div>
      </div>
      
      {/* Controls - simplified */}
      <div className="px-4 py-3 bg-gray-800 flex justify-center items-center gap-4">
        <button 
          onClick={toggleAudio} 
          className={`p-3 rounded-full ${isAudioMuted ? 'bg-red-500' : 'bg-blue-500'}`}
          title={isAudioMuted ? "마이크 켜기" : "마이크 끄기"}
        >
          <FontAwesomeIcon 
            icon={isAudioMuted ? faMicrophoneSlash : faMicrophone} 
            className="text-white" 
          />
        </button>
        
        <button 
          onClick={toggleVideo} 
          className={`p-3 rounded-full ${isVideoOff ? 'bg-red-500' : 'bg-blue-500'}`}
          title={isVideoOff ? "비디오 켜기" : "비디오 끄기"}
        >
          <FontAwesomeIcon 
            icon={isVideoOff ? faVideoSlash : faVideo} 
            className="text-white" 
          />
        </button>
        
        <button 
          onClick={handleEndCall} 
          className="p-3 rounded-full bg-red-500"
          title="통화 종료"
        >
          <FontAwesomeIcon 
            icon={faPhone} 
            className="transform rotate-135 text-white" 
          />
        </button>
      </div>
    </div>
  );
};

export default VideoCall; 