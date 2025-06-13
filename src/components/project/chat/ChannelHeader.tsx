import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faPhone, faGear } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import VideoCall from '@/components/project/VideoCall/VideoCall';
import { useAuthStore } from '@/auth/authStore';
import { useVoiceCall } from '@/contexts/VoiceCallContext';
import { Channel } from '@/types/Channel';

export default function ChannelHeader({ channel }: { channel: Channel }) {
  const [showVideoCall, setShowVideoCall] = useState(false);
  const userId = useAuthStore.getState().user?.id.toString() || 'anonymous';
  const { startVoiceCall } = useVoiceCall();
  
  const startVideoCall = () => {
    setShowVideoCall(true);
  };
  
  const endVideoCall = () => {
    setShowVideoCall(false);
  };

  const handleStartVoiceCall = () => {
    startVoiceCall(channel.channelId, userId);
  };
  
  return (
    <div>
      <div className="flex justify-between px-6 py-4 border-b border-component-border">
        <h2 className="text-xl font-semibold"># {channel.channelName}</h2>
        <div className="space-x-5 self-center">
          <FontAwesomeIcon 
            icon={faPhone} 
            className="text-text-secondary cursor-pointer hover:text-text-primary" 
            onClick={handleStartVoiceCall}
          />
          <FontAwesomeIcon 
            icon={faVideo} 
            className="text-text-secondary cursor-pointer hover:text-text-primary" 
            onClick={startVideoCall}
          />
          <FontAwesomeIcon icon={faGear} className="text-text-secondary cursor-pointer hover:text-text-primary" />
        </div>
      </div>
      
      {showVideoCall && (
        <VideoCall
          channelId={channel.channelId}
          userId={userId}
          onClose={endVideoCall}
        />
      )}
    </div>
  )
}