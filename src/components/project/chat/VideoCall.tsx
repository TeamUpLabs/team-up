import React, { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCircleInfo, 
  faShareFromSquare
} from '@fortawesome/free-solid-svg-icons';
import { useProject } from '@/contexts/ProjectContext';
import useWebRTC from '@/hooks/useWebRTC';
import { motion, AnimatePresence } from 'framer-motion';

// Import separated components
import RemoteVideo from '@/components/project/chat/RemoteVideo';
import LocalVideo from '@/components/project/chat/LocalVideo';
import VideoControls from '@/components/project/chat/VideoControls';
import VideoParticipantList from '@/components/project/chat/VideoParticipantList';
import VideoOptionsMenu from '@/components/project/chat/VideoOptionsMenu';
import VideoSettings from '@/components/project/chat/VideoSettings';

// Import layout utilities
import {
  getGridLayout,
  getVideoItemClass,
  arrangeVideoParticipants,
  VideoParticipant
} from '@/utils/videoLayoutUtils';

interface VideoCallProps {
  channelId: string;
  userId: string;
  onClose: () => void;
}

const VideoCall: React.FC<VideoCallProps> = ({ channelId, userId, onClose }) => {
  const { project } = useProject();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isParticipantListVisible, setIsParticipantListVisible] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [pinnedUser, setPinnedUser] = useState<string | null>(null);
  const [layout, setLayout] = useState<'grid' | 'focus'>('grid');
  const [showSettings, setShowSettings] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Auto-hide controls after inactivity
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      
      controlsTimeoutRef.current = setTimeout(() => {
        if (!isParticipantListVisible && !showOptions && !showSettings) {
          setShowControls(false);
        }
      }, 3000);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isParticipantListVisible, showOptions, showSettings]);

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
  useEffect(() => {
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
    setShowOptions(false);
    setShowSettings(false);
  };

  const toggleOptions = () => {
    setShowOptions(prev => !prev);
    setIsParticipantListVisible(false);
    setShowSettings(false);
  };

  const toggleSettings = () => {
    setShowSettings(prev => !prev);
    setIsParticipantListVisible(false);
    setShowOptions(false);
  };

  const toggleLayout = () => {
    setLayout(prev => prev === 'grid' ? 'focus' : 'grid');
  };

  const pinUser = (userId: string) => {
    setPinnedUser(pinnedUser === userId ? null : userId);
    if (pinnedUser !== userId) {
      setLayout('focus');
    } else {
      setLayout('grid');
    }
  };

  const handleEndCall = () => {
    endCall();
    onClose();
  };

  // Get user name by ID
  const getUserName = (id: string) => {
    return project?.members.find(member => member.id === Number(id))?.name || 'Unknown';
  };

  // Get user role by ID
  const getUserRole = (id: string) => {
    return project?.members.find(member => member.id === Number(id))?.role || '';
  };

  // Prepare participant list for the VideoParticipantList component
  const getParticipantList = () => {
    const participants = [
      {
        userId: 'local',
        name: getUserName(userId),
        role: getUserRole(userId),
        isLocal: true,
        isAudioMuted,
        isVideoOff
      },
      ...peers.map(peer => ({
        userId: peer.userId,
        name: getUserName(peer.userId),
        role: getUserRole(peer.userId),
        isLocal: false
      }))
    ];
    
    return participants;
  };

  // Arrange videos based on layout mode
  const arrangeVideos = (): VideoParticipant[] => {
    return arrangeVideoParticipants(
      'local',
      localStream,
      peers.map(peer => ({ userId: peer.userId, stream: peer.stream || null })),
      pinnedUser,
      layout
    );
  };

  // Render the video layout
  const renderVideoLayout = () => {
    const arrangedUsers = arrangeVideos();
    
    return (
      <motion.div 
        layout
        className={`grid gap-3 md:gap-4 h-full ${getGridLayout(peers.length + 1, layout, !!pinnedUser)}`}
      >
        {arrangedUsers.map(user => (
          <motion.div 
            layout
            key={user.userId === 'local' ? 'local-video' : user.userId}
            className={getVideoItemClass(user.userId, pinnedUser, layout)}
          >
            {user.isLocal ? 
              <LocalVideo
                isAudioMuted={isAudioMuted}
                isVideoOff={isVideoOff}
                localVideoRef={setLocalVideoRef}
                userName="나"
              /> :
              <RemoteVideo 
                stream={user.stream} 
                userName={getUserName(user.userId)} 
                userId={user.userId}
                isPinned={pinnedUser === user.userId}
                onPinToggle={pinUser}
              />
            }
          </motion.div>
        ))}
      </motion.div>
    );
  };

  // Share invite link handler
  const handleShareInviteLink = () => {
    // Placeholder for invite link functionality
    console.log("Share invite link");
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 flex flex-col z-50"
      onMouseMove={() => setShowControls(true)}
    >
      {/* Video container */}
      <div className="flex-1 p-3 md:p-4 lg:p-5 relative">
        {renderVideoLayout()}
      </div>
      
      {/* Status message when no peers */}
      <AnimatePresence>
        {peers.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 
              bg-black/60 backdrop-blur-xl px-8 py-6 rounded-2xl text-white text-center max-w-md shadow-2xl"
          >
            <div className="flex flex-col items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <FontAwesomeIcon icon={faCircleInfo} className="text-white text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-medium">{connectionStatus}</h3>
                <p className="text-sm mt-2 text-gray-300">다른 참가자가 입장할 때까지 기다려주세요</p>
                <p className="text-xs mt-4 text-gray-400">아래 버튼으로 초대 링크를 복사하여 공유할 수 있습니다</p>
              </div>
              <button 
                onClick={handleShareInviteLink}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-6 py-3 rounded-full transition-all shadow-lg"
              >
                <FontAwesomeIcon icon={faShareFromSquare} />
                <span className="font-medium">초대 링크 복사</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main controls */}
      <AnimatePresence>
        {showControls && (
          <VideoControls 
            isAudioMuted={isAudioMuted}
            isVideoOff={isVideoOff}
            isFullscreen={isFullscreen}
            layout={layout}
            showSettings={showSettings}
            showOptions={showOptions}
            channelId={channelId}
            participantCount={peers.length + 1}
            isParticipantListVisible={isParticipantListVisible}
            onToggleAudio={toggleAudio}
            onToggleVideo={toggleVideo}
            onEndCall={handleEndCall}
            onToggleLayout={toggleLayout}
            onToggleSettings={toggleSettings}
            onToggleOptions={toggleOptions}
            onToggleFullscreen={toggleFullscreen}
            onToggleParticipantList={toggleParticipantList}
          />
        )}
      </AnimatePresence>
      
      {/* Participants list */}
      <AnimatePresence>
        {isParticipantListVisible && (
          <VideoParticipantList 
            participants={getParticipantList()}
            pinnedUser={pinnedUser}
            onClose={toggleParticipantList}
            onPinUser={pinUser}
          />
        )}
      </AnimatePresence>
      
      {/* Options menu */}
      <AnimatePresence>
        {showOptions && (
          <VideoOptionsMenu 
            onShareInviteLink={handleShareInviteLink}
            onOpenSpeakerSettings={toggleSettings}
            onClose={toggleOptions}
          />
        )}
      </AnimatePresence>
      
      {/* Settings panel */}
      <AnimatePresence>
        {showSettings && (
          <VideoSettings onClose={toggleSettings} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoCall; 