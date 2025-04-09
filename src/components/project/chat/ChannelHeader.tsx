import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faPhone, faGear } from '@fortawesome/free-solid-svg-icons';

export default function ChannelHeader({ channelId }: { channelId: string }) {
 return (
  <div className="flex justify-between px-6 py-4 border-b border-gray-800">
    <h2 className="text-xl font-semibold"># {channelId}</h2>
    <div className="space-x-5 self-center">
      <FontAwesomeIcon icon={faPhone} className="text-gray-400" />
      <FontAwesomeIcon icon={faVideo} className="text-gray-400" />
      <FontAwesomeIcon icon={faGear} className="text-gray-400" />
    </div>
  </div>
 )
}