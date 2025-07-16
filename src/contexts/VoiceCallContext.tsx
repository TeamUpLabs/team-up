import React, { createContext, useContext, useState, ReactNode } from 'react';

interface VoiceCallContextType {
  isVoiceCallActive: boolean;
  channel_id: string | null;
  user_id: string | null;
  isPipMode: boolean;
  startVoiceCall: (channel_id: string, user_id: string) => void;
  endVoiceCall: () => void;
  setIsPipMode: (isPip: boolean) => void;
}

const VoiceCallContext = createContext<VoiceCallContextType | undefined>(undefined);

export const VoiceCallProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isVoiceCallActive, setIsVoiceCallActive] = useState(false);
  const [channel_id, setChannel_id] = useState<string | null>(null);
  const [user_id, set_user_id] = useState<string | null>(null);
  const [isPipMode, setIsPipMode] = useState(false);

  const startVoiceCall = (channel_id: string, user_id: string) => {
    setChannel_id(channel_id);
    set_user_id(user_id);
    setIsVoiceCallActive(true);
  };

  const endVoiceCall = () => {
    setIsVoiceCallActive(false);
    setChannel_id(null);
    set_user_id(null);
    setIsPipMode(false);
  };

  return (
    <VoiceCallContext.Provider
      value={{
        isVoiceCallActive,
        channel_id,
        user_id,
        isPipMode,
        startVoiceCall,
        endVoiceCall,
        setIsPipMode,
      }}
    >
      {children}
    </VoiceCallContext.Provider>
  );
};

export const useVoiceCall = () => {
  const context = useContext(VoiceCallContext);
  if (context === undefined) {
    throw new Error('useVoiceCall must be used within a VoiceCallProvider');
  }
  return context;
}; 