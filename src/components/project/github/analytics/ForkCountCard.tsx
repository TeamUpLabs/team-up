import { CodeFork } from "flowbite-react-icons/outline";

interface ForkCountCardProps {
  forkCount: number;
}

export default function ForkCountCard({ forkCount }: ForkCountCardProps) {
  return (
    <div className="bg-component-background rounded-lg p-6 border border-component-border space-y-2 hover:border-point-color-indigo-hover transition duration-200 ease-in-out">
      <div className="flex items-center justify-between">
        <span className="text-text-primary text-sm font-semibold">총 포크</span>
        <CodeFork className="text-violet-600" />
      </div>
      <div>
        <span className="text-text-primary text-3xl font-bold">{forkCount || 0}</span>
        <p className="text-xs text-text-secondary">포크</p>
      </div>
    </div>
  );
}