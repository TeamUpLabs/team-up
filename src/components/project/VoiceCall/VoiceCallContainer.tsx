import React from 'react';
import { useVoiceCall } from '@/contexts/VoiceCallContext';
import VoiceCall from '@/components/project/VoiceCall/VoiceCall';

const VoiceCallContainer: React.FC = () => {
  const { isVoiceCallActive, channelId, userId, endVoiceCall } = useVoiceCall();

  if (!isVoiceCallActive || !channelId || !userId) {
    return null;
  }

  return (
    <VoiceCall
      channelId={channelId}
      userId={userId}
      onClose={endVoiceCall}
    />
  );
};

export default VoiceCallContainer; 