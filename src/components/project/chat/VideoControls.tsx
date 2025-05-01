import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMicrophone, faMicrophoneSlash, 
  faVideo, faVideoSlash, 
  faPhone, faMaximize, faMinimize,
  faEllipsisVertical, faGear,
  faUsers,
  faDesktop,
  faStop
} from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import Tooltip from '@/components/ui/Tooltip';

interface VideoControlsProps {
  isAudioMuted: boolean;
  isVideoOff: boolean;
  isFullscreen: boolean;
  showSettings: boolean;
  showOptions: boolean;
  channelId: string;
  participantCount: number;
  isParticipantListVisible: boolean;
  isScreenSharing?: boolean;
  isScreenSharePaused?: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onEndCall: () => void;
  onToggleSettings: () => void;
  onToggleOptions: () => void;
  onToggleFullscreen: () => void;
  onToggleParticipantList: () => void;
  onToggleScreenShare?: () => void;
}

const VideoControls: React.FC<VideoControlsProps> = ({
  isAudioMuted,
  isVideoOff,
  isFullscreen,
  showSettings,
  showOptions,
  channelId,
  participantCount,
  isParticipantListVisible,
  isScreenSharing = false,
  isScreenSharePaused,
  onToggleAudio,
  onToggleVideo,
  onEndCall,
  onToggleSettings,
  onToggleOptions,
  onToggleFullscreen,
  onToggleParticipantList,
  onToggleScreenShare
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 py-3 px-4 md:px-5
        bg-black/50 backdrop-blur-xl rounded-2xl flex justify-center items-center gap-3 md:gap-4 shadow-xl"
    >
      {/* Channel info */}
      <div className="flex items-center gap-2 text-white pr-2 mr-1 border-r border-white/20">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-sm whitespace-nowrap">채널: #{channelId}</span>
      </div>
      
      <Tooltip content={isParticipantListVisible ? "참가자 목록 닫기" : "참가자 목록 보기"}>
        <button 
          onClick={onToggleParticipantList} 
          className={`w-10 h-10 rounded-full flex items-center justify-center
            ${isParticipantListVisible 
              ? 'bg-indigo-600'
              : 'bg-black/70 hover:bg-black/90'} transition-colors`}
        >
          <span className="flex items-center gap-1">
            <FontAwesomeIcon icon={faUsers} className="text-white text-sm" />
            <span className="text-white text-xs">{participantCount}</span>
          </span>
        </button>
      </Tooltip>
      
      <div className="w-px h-8 bg-white/20 mx-1"></div>
      
      <Tooltip content={isAudioMuted ? "마이크 켜기" : "마이크 끄기"}>
        <button 
          onClick={onToggleAudio} 
          className={`w-12 h-12 md:w-14 md:h-14 rounded-full transition-all flex items-center justify-center
            ${isAudioMuted 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-indigo-600 hover:bg-indigo-700'}`}
        >
          <FontAwesomeIcon 
            icon={isAudioMuted ? faMicrophoneSlash : faMicrophone} 
            className="text-white" 
          />
        </button>
      </Tooltip>
      
      <Tooltip content={isVideoOff ? "비디오 켜기" : "비디오 끄기"}>
        <button 
          onClick={onToggleVideo} 
          className={`w-12 h-12 md:w-14 md:h-14 rounded-full transition-all flex items-center justify-center
            ${isVideoOff 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-indigo-600 hover:bg-indigo-700'}`}
        >
          <FontAwesomeIcon 
            icon={isVideoOff ? faVideoSlash : faVideo} 
            className="text-white" 
          />
        </button>
      </Tooltip>
      
      <Tooltip content="통화 종료">
        <button 
          onClick={onEndCall} 
          className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center"
        >
          <FontAwesomeIcon 
            icon={faPhone} 
            className="transform rotate-135 text-white" 
          />
        </button>
      </Tooltip>
      
      <div className="w-px h-8 bg-white/20 mx-1"></div>
      
      <Tooltip content="설정">
        <button 
          onClick={onToggleSettings}
          className={`w-10 h-10 rounded-full flex items-center justify-center
            ${showSettings 
              ? 'bg-indigo-600'
              : 'bg-black/70 hover:bg-black/90'} transition-colors`}
        >
          <FontAwesomeIcon icon={faGear} className="text-white text-sm" />
        </button>
      </Tooltip>
      
      <Tooltip content="더 보기">
        <button 
          onClick={onToggleOptions}
          className={`w-10 h-10 rounded-full flex items-center justify-center
            ${showOptions 
              ? 'bg-indigo-600'
              : 'bg-black/70 hover:bg-black/90'} transition-colors`}
        >
          <FontAwesomeIcon icon={faEllipsisVertical} className="text-white text-sm" />
        </button>
      </Tooltip>
      
      <Tooltip content={isFullscreen ? "전체화면 종료" : "전체화면"}>
        <button 
          onClick={onToggleFullscreen}
          className="w-10 h-10 rounded-full bg-black/70 hover:bg-black/90 flex items-center justify-center transition-colors"
        >
          <FontAwesomeIcon 
            icon={isFullscreen ? faMinimize : faMaximize} 
            className="text-white text-sm" 
          />
        </button>
      </Tooltip>
      
      {onToggleScreenShare && (
        <Tooltip content={isScreenSharing ? "화면 공유 종료" : "화면 공유"}>
          <button 
            onClick={onToggleScreenShare}
            className={`w-10 h-10 rounded-full bg-black/70 hover:bg-black/90 flex items-center justify-center transition-colors ${isScreenSharePaused ? 'animate-pulse ring-2 ring-yellow-500' : ''}`}
          >
            <FontAwesomeIcon 
              icon={isScreenSharing ? faStop : faDesktop} 
              className={`text-white text-sm ${isScreenSharePaused ? 'text-yellow-400' : ''}`} 
            />
          </button>
        </Tooltip>
      )}
    </motion.div>
  );
};

export default VideoControls; 