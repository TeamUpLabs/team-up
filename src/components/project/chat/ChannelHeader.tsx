import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faPhone, faGear } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import VideoCall from '@/components/project/chat/VideoCall';
import VoiceCall from '@/components/project/chat/VoiceCall';
import { useAuthStore } from '@/auth/authStore';

export default function ChannelHeader({ channelId }: { channelId: string }) {
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [showVoiceCall, setShowVoiceCall] = useState(false);
  
  // This would come from your authentication system
  const userId = useAuthStore.getState().user?.id.toString() || 'anonymous';
  
  const startVideoCall = () => {
    setShowVideoCall(true);
  };
  
  const endVideoCall = () => {
    setShowVideoCall(false);
  };

  const startVoiceCall = () => {
    setShowVoiceCall(true);
  };

  const endVoiceCall = () => {
    setShowVoiceCall(false);
  };
  
  return (
    <div>
      <div className="flex justify-between px-6 py-4 border-b border-component-border">
        <h2 className="text-xl font-semibold"># {channelId}</h2>
        <div className="space-x-5 self-center">
          <FontAwesomeIcon 
            icon={faPhone} 
            className="text-text-secondary cursor-pointer hover:text-text-primary" 
            onClick={startVoiceCall}
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
          channelId={channelId}
          userId={userId}
          onClose={endVideoCall}
        />
      )}

      {showVoiceCall && (
        <VoiceCall
          channelId={channelId}
          userId={userId}
          onClose={endVoiceCall}
        />
      )}
    </div>
  )
}