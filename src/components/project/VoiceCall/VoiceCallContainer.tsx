import React from 'react';
import { useVoiceCall } from '@/contexts/VoiceCallContext';
import VoiceCall from '@/components/project/VoiceCall/VoiceCall';

const VoiceCallContainer: React.FC = () => {
  const { isVoiceCallActive, channel_id, user_id, endVoiceCall } = useVoiceCall();

  if (!isVoiceCallActive || !channel_id || !user_id) {
    return null;
  }

  return (
    <VoiceCall
      channel_id={channel_id}
      user_id={user_id}
      onClose={endVoiceCall}
    />
  );
};

export default VoiceCallContainer; 