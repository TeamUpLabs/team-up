import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPhoneSlash,
  faMicrophone,
  faMicrophoneSlash,
  faUsers,
  faTimes,
  faCompressAlt
} from '@fortawesome/free-solid-svg-icons';
import useVoiceCallWebRTC, { VoicePeerConnection } from '@/hooks/useVoiceCallWebRTC';
import { useAuthStore } from '@/auth/authStore';
import { useProject } from '@/contexts/ProjectContext';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import PipControls from '@/components/project/chat/PipView';
import { useVoiceCall } from '@/contexts/VoiceCallContext';

interface VoiceCallProps {
  channelId: string;
  userId: string;
  onClose: () => void;
}

const MAX_DISPLAY_AVATARS = 5;

interface DisplayParticipant extends Partial<VoicePeerConnection> {
  userId: string;
  name: string;
  profileImage?: string | null;
  isLocal: boolean;
  currentAudioMuted: boolean;
}

const VoiceCall: React.FC<VoiceCallProps> = ({ channelId, userId, onClose }) => {
  const { project } = useProject();
  const [isParticipantListVisible, setIsParticipantListVisible] = useState(false);
  const { isPipMode, setIsPipMode } = useVoiceCall();
  const connectedUser = useAuthStore((state) => state.user);

  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localStream,
    peers,
    isAudioMuted,
    connectionStatus,
    toggleAudio,
    endCall,
  } = useVoiceCallWebRTC({
    channelId,
    userId,
    projectId: project?.id,
  });

  const handleEndCall = () => {
    endCall();
    onClose();
  };

  const toggleParticipantList = () => {
    setIsParticipantListVisible(prev => !prev);
  };

  const togglePipMode = () => {
    setIsPipMode(!isPipMode);
    if (isPipMode && isParticipantListVisible) {
        setIsParticipantListVisible(false);
    }
  };
  
  const handleExitPip = () => {
    setIsPipMode(false);
  };

  const getInitials = (name: string = '') => {
    const nameParts = name.split(' ');
    if (nameParts.length === 0 || !nameParts[0]) return '??';
    if (nameParts.length > 1 && nameParts[1]) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };


  const allDisplayParticipants = React.useMemo((): DisplayParticipant[] => {
    const localParticipant: DisplayParticipant = {
      userId: userId,
      name: connectedUser?.name || 'You',
      profileImage: connectedUser?.profileImage,
      isLocal: true,
      currentAudioMuted: isAudioMuted,
    };

    const remoteParticipants: DisplayParticipant[] = peers.map(peer => ({
      userId: peer.userId,
      name: project?.members.find(m => m.id.toString() === peer.userId)?.name || `User ${peer.userId.substring(0, 6)}`,
      profileImage: project?.members.find(m => m.id.toString() === peer.userId)?.profileImage,
      isLocal: false,
      currentAudioMuted: !!peer.isRemoteAudioMuted,
      connection: peer.connection,
      stream: peer.stream,
      dataChannel: peer.dataChannel,
      remoteDataChannel: peer.remoteDataChannel,
      dataChannelReady: peer.dataChannelReady,
      remoteDataChannelReady: peer.remoteDataChannelReady,
    }));

    return [localParticipant, ...remoteParticipants];
  }, [userId, connectedUser, isAudioMuted, peers, project?.members]);


  useEffect(() => {
    peers.forEach(peer => {
      if (peer.stream && peer.userId) {
        let audioEl = document.getElementById(`audio-${peer.userId}`) as HTMLAudioElement;
        if (!audioEl) {
          audioEl = document.createElement('audio');
          audioEl.id = `audio-${peer.userId}`;
          audioEl.autoplay = true;
          document.body.appendChild(audioEl);
        }
        if (audioEl.srcObject !== peer.stream) {
          audioEl.srcObject = peer.stream;
        }
      }
    });
    const currentPeerIds = peers.map(p => p.userId);
    const audioElements = document.querySelectorAll('audio[id^="audio-"]');
    audioElements.forEach(audioEl => {
      const peerId = audioEl.id.substring('audio-'.length);
      if (!currentPeerIds.includes(peerId)) {
        audioEl.remove();
      }
    });
  }, [peers]);

  useEffect(() => {
    if (!isPipMode) {
      document.body.classList.add('video-call-active');
    } else {
      document.body.classList.remove('video-call-active');
    }
    return () => {
      document.body.classList.remove('video-call-active');
    };
  }, [isPipMode]); // Re-run when isPipMode changes

  if (isPipMode) {
    return (
      <PipControls
        participantCount={allDisplayParticipants.length}
        isAudioMuted={isAudioMuted}
        onToggleAudio={toggleAudio}
        onEndCall={handleEndCall}
        onToggleParticipantList={toggleParticipantList}
        onExitPip={handleExitPip}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col z-[9999] overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
        {!isParticipantListVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center text-white flex flex-col items-center"
          >
            {/* Participant Avatars/Initials Display */}
            <div className="flex items-center justify-center mb-8 -space-x-4">
              {allDisplayParticipants.slice(0, MAX_DISPLAY_AVATARS).map((p, index) => {
                const zIndex = MAX_DISPLAY_AVATARS - index;
                return (
                  <div
                    key={p.userId}
                    className="w-20 h-20 relative rounded-full bg-gray-700 border-4 border-gray-900 flex items-center justify-center text-2xl font-semibold text-white shadow-lg"
                    style={{ zIndex }}
                  >
                    {p.profileImage ? (
                      <Image src={p.profileImage} alt={p.name} className="w-full h-full rounded-full object-cover" width={32} height={32} />
                    ) : (
                      getInitials(p.name)
                    )}
                  </div>
                );
              })}
              {allDisplayParticipants.length > MAX_DISPLAY_AVATARS && (
                <div
                  className="w-20 h-20 rounded-full bg-gray-600 border-4 border-gray-900 flex items-center justify-center text-xl font-semibold text-white shadow-lg"
                  style={{ zIndex: 0 }}
                >
                  +{allDisplayParticipants.length - MAX_DISPLAY_AVATARS}
                </div>
              )}
            </div>

            <h2 className="text-3xl font-semibold mb-2">Voice Call Active</h2>
            <p className="text-lg text-gray-300 mb-1">{connectionStatus}</p>
            <p className="text-md text-gray-400">
              {allDisplayParticipants.length} Participant{allDisplayParticipants.length === 1 ? '' : 's'}
            </p>
          </motion.div>
        )}
      </div>

      {/* Participant List Panel */}
      <AnimatePresence>
        {isParticipantListVisible && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-xs sm:max-w-sm bg-gray-800 shadow-2xl z-50 flex flex-col border-l border-gray-700"
          >
            <div className="flex justify-between items-center p-5 border-b border-gray-700">
              <h3 className="text-xl font-semibold text-gray-100">Participants ({allDisplayParticipants.length})</h3>
              <button onClick={toggleParticipantList} className="text-gray-400 hover:text-white">
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {allDisplayParticipants.map((p) => (
                <div key={p.userId} className="flex items-center justify-between p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 relative rounded-full bg-gray-600 flex items-center justify-center text-sm font-semibold text-white overflow-hidden">
                      {p.profileImage ? (
                        <Image src={p.profileImage} alt={p.name} className="w-full h-full object-cover" width={32} height={32} />
                      ) : (
                        getInitials(p.name)
                      )}
                    </div>
                    <span className={`text-sm ${p.isLocal ? 'text-white font-medium' : 'text-gray-300'}`}>{p.name}{p.isLocal && " (You)"}</span>
                  </div>
                  <FontAwesomeIcon
                    icon={p.currentAudioMuted ? faMicrophoneSlash : faMicrophone}
                    className={`w-5 h-5 ${p.currentAudioMuted ? "text-red-400" : "text-green-400"}`}
                  />
                </div>
              ))}
              {allDisplayParticipants.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-4">Waiting for participants...</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls Bar */}
      <motion.div
        initial={{ y: 120 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 25, delay: 0.2 }}
        className="bg-black/40 backdrop-blur-lg p-3 w-full max-w-md mx-auto mb-5 rounded-2xl shadow-xl"
      >
        <div className="flex justify-around items-center text-gray-200">
          <button
            onClick={toggleAudio}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 w-24 h-16 
                        hover:bg-white/20 active:bg-white/30 
                        ${isAudioMuted ? 'text-yellow-400' : 'text-white'}`}
            aria-label={isAudioMuted ? 'Unmute' : 'Mute'}
          >
            <FontAwesomeIcon icon={isAudioMuted ? faMicrophoneSlash : faMicrophone} size="lg" className="mb-1.5" />
            <span className="text-xs font-medium">{isAudioMuted ? 'Unmute' : 'Mute'}</span>
          </button>

          <button
            onClick={togglePipMode} // Button to enter PIP mode
            className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-white/20 active:bg-white/30 transition-all duration-200 text-white w-24 h-16"
            aria-label="Picture-in-Picture"
          >
            <FontAwesomeIcon icon={faCompressAlt} size="lg" className="mb-1.5" />
            <span className="text-xs font-medium">PIP</span>
          </button>

          <button
            onClick={handleEndCall}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-red-500 hover:bg-red-600 active:bg-red-700 transition-all duration-200 text-white w-24 h-16"
            aria-label="End Call"
          >
            <FontAwesomeIcon icon={faPhoneSlash} size="lg" className="mb-1.5" />
            <span className="text-xs font-medium">End Call</span>
          </button>

          <button
            onClick={toggleParticipantList}
            className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-white/20 active:bg-white/30 transition-all duration-200 text-white w-24 h-16"
            aria-label="Participants"
          >
            <FontAwesomeIcon icon={faUsers} size="lg" className="mb-1.5" />
            <span className="text-xs font-medium">Participants</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default VoiceCall; 