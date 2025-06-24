import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

interface WatcherCountCardProps {
  watcherCount: number;
}

export default function WatcherCountCard({ watcherCount }: WatcherCountCardProps) {
  return (
    <div className="bg-component-background rounded-lg p-6 border border-component-border space-y-2 hover:border-point-color-indigo-hover transition duration-200 ease-in-out">
      <div className="flex items-center justify-between">
        <span className="text-text-primary text-sm font-semibold">워치</span>
        <FontAwesomeIcon icon={faEye} className="w-4 h-4 text-green-500" />
      </div>
      <div>
        <span className="text-text-primary text-3xl font-bold">{watcherCount || 0}</span>
        <p className="text-xs text-text-secondary">관찰자 수</p>
      </div>
    </div>
  );
}
