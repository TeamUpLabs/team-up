import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, faUserGroup, 
  faMaximize, faMinimize,
  faMicrophoneSlash, faVideoSlash
} from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

interface Participant {
  userId: string;
  name: string;
  role: string;
  isLocal: boolean;
  isAudioMuted?: boolean;
  isVideoOff?: boolean;
}

interface VideoParticipantListProps {
  participants: Participant[];
  pinnedUser: string | null;
  onClose: () => void;
  onPinUser: (userId: string) => void;
}

const VideoParticipantList: React.FC<VideoParticipantListProps> = ({
  participants,
  pinnedUser,
  onClose,
  onPinUser
}) => {
  const getAvatarLetter = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="absolute top-0 right-0 bottom-0 bg-black/80 backdrop-blur-xl shadow-2xl z-20 w-80 flex flex-col"
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <h3 className="text-white text-lg font-medium">참가자 ({participants.length})</h3>
        <button 
          onClick={onClose}
          className="text-gray-300 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {/* Status message if empty */}
        {participants.length <= 1 ? (
          <div className="py-10 px-6 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-600/20 flex items-center justify-center">
                <FontAwesomeIcon icon={faUserGroup} className="text-indigo-400" />
              </div>
              <p className="text-white/70">아직 다른 참가자가 없습니다</p>
              <button className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-full text-white text-sm transition-colors">
                초대 링크 공유하기
              </button>
            </div>
          </div>
        ) : (
          <ul>
            {participants.map(participant => (
              <li 
                key={`list-${participant.userId}`} 
                className={`px-6 py-4 border-b border-white/10 hover:bg-white/5 transition-colors 
                  ${pinnedUser === participant.userId ? 'bg-indigo-900/30' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md
                      ${participant.isLocal 
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600' 
                        : 'bg-gradient-to-br from-gray-600 to-gray-700'}`}
                    >
                      {getAvatarLetter(participant.name)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium">{participant.name}</p>
                        {participant.isLocal && (
                          <span className="bg-indigo-600/20 text-indigo-300 text-xs px-2 py-0.5 rounded-full">나</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{participant.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {participant.isLocal ? (
                      <div className="flex items-center gap-1.5">
                        {participant.isAudioMuted && (
                          <div className="w-7 h-7 rounded-full bg-red-500/20 flex items-center justify-center">
                            <FontAwesomeIcon icon={faMicrophoneSlash} className="text-red-500 text-xs" />
                          </div>
                        )}
                        {participant.isVideoOff && (
                          <div className="w-7 h-7 rounded-full bg-red-500/20 flex items-center justify-center">
                            <FontAwesomeIcon icon={faVideoSlash} className="text-red-500 text-xs" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                        <button 
                          onClick={() => onPinUser(participant.userId)}
                          className={`w-7 h-7 rounded-full flex items-center justify-center
                            ${pinnedUser === participant.userId
                              ? 'bg-indigo-600 text-white'
                              : 'bg-black/50 text-white/80 hover:bg-black/70 hover:text-white'}`}
                        >
                          <FontAwesomeIcon 
                            icon={pinnedUser === participant.userId ? faMinimize : faMaximize} 
                            className="text-xs" 
                          />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
};

export default VideoParticipantList; 