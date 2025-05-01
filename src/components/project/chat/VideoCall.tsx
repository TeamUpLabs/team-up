import React, { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleInfo,
  faPause,
  faPlay,
  faVolumeMute,
  faVolumeHigh,
  faWarning,
  faMinimize,
  faMaximize
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
import ScreenShareControls from '@/components/project/chat/ScreenShareControls';

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
  const [showScreenShareOptions, setShowScreenShareOptions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    localStream,
    screenShareStream,
    isScreenSharing,
    isScreenSharePaused,
    screenShareError,
    screenShareWithAudio,
    peers,
    isAudioMuted,
    isVideoOff,
    connectionStatus,
    toggleAudio,
    toggleVideo,
    startScreenShare,
    stopScreenShare,
    togglePauseScreenShare,
    updateScreenShareAudio,
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
        if (!isParticipantListVisible && !showOptions && !showSettings && !showScreenShareOptions) {
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
  }, [isParticipantListVisible, showOptions, showSettings, showScreenShareOptions]);

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

  // Toggle screen sharing
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      await stopScreenShare();
    } else {
      setShowScreenShareOptions(true);
    }
  };

  // Start screen sharing with options
  const startScreenShareWithOptions = async (withAudio: boolean) => {
    const success = await startScreenShare({ withAudio });
    if (success) {
      setShowScreenShareOptions(false);
    }
  };

  // Toggle screen share pause
  const handleTogglePauseScreenShare = () => {
    togglePauseScreenShare();
  };

  // Toggle screen share audio
  const handleToggleScreenShareAudio = () => {
    updateScreenShareAudio(!screenShareWithAudio);
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
    setShowScreenShareOptions(false);
  };

  const toggleOptions = () => {
    setShowOptions(prev => !prev);
    setIsParticipantListVisible(false);
    setShowSettings(false);
    setShowScreenShareOptions(false);
  };

  const toggleSettings = () => {
    setShowSettings(prev => !prev);
    setIsParticipantListVisible(false);
    setShowOptions(false);
    setShowScreenShareOptions(false);
  };

  const toggleScreenShareOptions = () => {
    setShowScreenShareOptions(prev => !prev);
    setIsParticipantListVisible(false);
    setShowSettings(false);
    setShowOptions(false);
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
        isVideoOff,
        isScreenSharing
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

  // 화면 공유 핀 토글 함수 추가
  const toggleScreenSharePin = () => {
    setPinnedUser(pinnedUser === 'screen' ? null : 'screen');
    if (pinnedUser !== 'screen') {
      setLayout('focus');
    } else {
      setLayout('grid');
    }
  };

  // Arrange videos based on layout mode
  const arrangeVideos = (): VideoParticipant[] => {
    // If screen sharing is active, prioritize it
    if (isScreenSharing && screenShareStream) {
      // 화면 공유가 핀되어 있으면 화면 공유를 먼저 배치
      if (pinnedUser === 'screen') {
        return [
          {
            userId: 'screen',
            stream: screenShareStream,
            isLocal: true,
            isScreenShare: true,
            isPinned: true
          },
          ...arrangeVideoParticipants(
            'local',
            localStream,
            peers.map(peer => ({ userId: peer.userId, stream: peer.stream || null })),
            pinnedUser === 'screen' ? null : pinnedUser,
            layout
          ).filter(p => p.userId !== 'screen')
        ];
      }

      // 화면 공유가 핀되어 있지 않으면 일반 배치
      return [
        {
          userId: 'screen',
          stream: screenShareStream,
          isLocal: true,
          isScreenShare: true,
          isPinned: false
        },
        ...arrangeVideoParticipants(
          'local',
          localStream,
          peers.map(peer => ({ userId: peer.userId, stream: peer.stream || null })),
          pinnedUser,
          layout
        ).filter(p => p.userId !== 'screen')
      ];
    }

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
    const totalParticipants = arrangedUsers.length;

    return (
      <motion.div
        layout
        className={`grid gap-2 md:gap-3 lg:gap-4 w-full h-full ${getGridLayout(totalParticipants, layout, !!pinnedUser)}`}
        style={{
          minHeight: 0,
          minWidth: 0,
          height: '100%'
        }}
      >
        {arrangedUsers.map(user => (
          <motion.div
            layout
            key={user.userId === 'local' ? 'local-video' : (user.userId === 'screen' ? 'screen-share' : user.userId)}
            className={`
              ${user.isScreenShare ? (pinnedUser === 'screen' ? 'col-span-full lg:col-span-3 lg:row-span-full' : 'col-span-full row-span-full') : getVideoItemClass(user.userId, pinnedUser, layout)}
              overflow-hidden rounded-xl shadow-lg relative
            `}
            style={{
              minHeight: 0,
              minWidth: 0
            }}
          >
            {user.isLocal && !user.isScreenShare ?
              <LocalVideo
                isAudioMuted={isAudioMuted}
                isVideoOff={isVideoOff}
                localVideoRef={setLocalVideoRef}
                userName="나"
              /> :
              user.isScreenShare ?
                <div className="w-full h-full rounded-lg overflow-hidden relative bg-black">
                  <video
                    ref={(element) => {
                      if (element && user.stream) {
                        element.srcObject = user.stream;
                      }
                    }}
                    autoPlay
                    playsInline
                    className={`w-full h-full object-contain ${isScreenSharePaused ? 'opacity-50' : ''}`}
                  />
                  <div className="absolute bottom-3 left-3 bg-black/70 px-3 py-1 rounded-lg text-sm text-white flex items-center gap-2">
                    <span>화면 공유 중</span>
                    {isScreenSharePaused && <span className="text-yellow-400">(일시 정지됨)</span>}
                    {!screenShareWithAudio && <FontAwesomeIcon icon={faVolumeMute} className="ml-2 text-red-400" />}
                  </div>

                  {/* Pause overlay */}
                  {isScreenSharePaused && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="bg-black/70 p-4 rounded-full">
                        <FontAwesomeIcon icon={faPause} className="text-white text-3xl" />
                      </div>
                    </div>
                  )}

                  {/* Screen sharing controls */}
                  <div className="absolute top-3 right-3 bg-black/70 rounded-lg overflow-hidden">
                    <div className="flex">
                      <button
                        onClick={handleTogglePauseScreenShare}
                        className="text-white p-2 hover:bg-gray-800"
                      >
                        <FontAwesomeIcon
                          icon={isScreenSharePaused ? faPlay : faPause}
                          className="w-4 h-4"
                        />
                      </button>
                      <button
                        onClick={handleToggleScreenShareAudio}
                        className="text-white p-2 hover:bg-gray-800"
                      >
                        <FontAwesomeIcon
                          icon={screenShareWithAudio ? faVolumeHigh : faVolumeMute}
                          className="w-4 h-4"
                        />
                      </button>
                      <button
                        onClick={toggleScreenSharePin}
                        className={`text-white p-2 hover:bg-gray-800 ${pinnedUser === 'screen' ? 'bg-indigo-600' : ''}`}
                      >
                        <FontAwesomeIcon
                          icon={pinnedUser === 'screen' ? faMinimize : faMaximize}
                          className="w-4 h-4"
                        />
                      </button>
                      <button
                        onClick={stopScreenShare}
                        className="text-white p-2 hover:bg-red-600"
                      >
                        <span className="text-xs">중지</span>
                      </button>
                    </div>
                  </div>
                </div> :
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
      <div className="flex-1 p-2 md:p-3 lg:p-4 relative overflow-hidden">
        {renderVideoLayout()}
      </div>

      {/* Screen share error notification */}
      <AnimatePresence>
        {screenShareError && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg 
              flex items-center gap-2 shadow-lg z-40"
          >
            <FontAwesomeIcon icon={faWarning} />
            <span>{screenShareError}</span>
            <button
              onClick={() => stopScreenShare()}
              className="ml-3 p-1 hover:bg-red-700 rounded"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen share options popup */}
      <AnimatePresence>
        {showScreenShareOptions && (
          <ScreenShareControls
            onClose={toggleScreenShareOptions}
            onStartWithAudio={() => startScreenShareWithOptions(true)}
            onStartWithoutAudio={() => startScreenShareWithOptions(false)}
          />
        )}
      </AnimatePresence>

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
              </div>
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
            showSettings={showSettings}
            showOptions={showOptions}
            channelId={channelId}
            participantCount={peers.length + 1}
            isParticipantListVisible={isParticipantListVisible}
            isScreenSharing={isScreenSharing}
            isScreenSharePaused={isScreenSharePaused}
            onToggleAudio={toggleAudio}
            onToggleVideo={toggleVideo}
            onEndCall={handleEndCall}
            onToggleSettings={toggleSettings}
            onToggleOptions={toggleOptions}
            onToggleFullscreen={toggleFullscreen}
            onToggleParticipantList={toggleParticipantList}
            onToggleScreenShare={toggleScreenShare}
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