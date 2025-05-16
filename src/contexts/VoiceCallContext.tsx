import React, { createContext, useContext, useState, ReactNode } from 'react';

interface VoiceCallContextType {
  isVoiceCallActive: boolean;
  channelId: string | null;
  userId: string | null;
  isPipMode: boolean;
  startVoiceCall: (channelId: string, userId: string) => void;
  endVoiceCall: () => void;
  setIsPipMode: (isPip: boolean) => void;
}

const VoiceCallContext = createContext<VoiceCallContextType | undefined>(undefined);

export const VoiceCallProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isVoiceCallActive, setIsVoiceCallActive] = useState(false);
  const [channelId, setChannelId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isPipMode, setIsPipMode] = useState(false);

  const startVoiceCall = (channelId: string, userId: string) => {
    setChannelId(channelId);
    setUserId(userId);
    setIsVoiceCallActive(true);
  };

  const endVoiceCall = () => {
    setIsVoiceCallActive(false);
    setChannelId(null);
    setUserId(null);
    setIsPipMode(false);
  };

  return (
    <VoiceCallContext.Provider
      value={{
        isVoiceCallActive,
        channelId,
        userId,
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