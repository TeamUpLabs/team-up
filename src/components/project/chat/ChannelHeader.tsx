import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo, faPhone } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import VideoCall from "@/components/project/VideoCall/VideoCall";
import { useAuthStore } from "@/auth/authStore";
import { useVoiceCall } from "@/contexts/VoiceCallContext";
import { Channel } from "@/types/Channel";
import ChannelSettingsDropdown from "@/components/project/chat/ChannelSettingDropdown";

export default function ChannelHeader({ channel }: { channel: Channel }) {
  const [showVideoCall, setShowVideoCall] = useState(false);
  const userId = useAuthStore.getState().user?.id.toString() || "anonymous";
  const { startVoiceCall } = useVoiceCall();

  const startVideoCall = () => {
    setShowVideoCall(true);
  };

  const endVideoCall = () => {
    setShowVideoCall(false);
  };

  const handleStartVoiceCall = () => {
    startVoiceCall(channel.channel_id, userId);
  };

  return (
    <div>
      <div className="flex justify-between px-6 py-4 border-b border-component-border">
        <h2 className="text-xl font-semibold"># {channel.name}</h2>
        <div className="flex items-center space-x-5">
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
          <ChannelSettingsDropdown
            channel={channel}
            isOwner={!!channel.created_by && channel.created_by === Number(userId)}
          />
        </div>
      </div>

      {showVideoCall && (
        <VideoCall
          channel_id={channel.channel_id}
          user_id={userId}
          onClose={endVideoCall}
        />
      )}
    </div>
  );
}
