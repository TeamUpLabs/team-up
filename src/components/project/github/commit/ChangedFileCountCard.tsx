import { FileLines } from "flowbite-react-icons/outline";

interface ChangedFileCountCardProps {
  changedFileCount: number;
}

export default function ChangedFileCountCard({ changedFileCount }: ChangedFileCountCardProps) {
  return (
    <div className="bg-component-background rounded-lg p-6 border border-component-border space-y-2 hover:border-point-color-indigo-hover transition duration-200 ease-in-out">
      <div className="flex items-center justify-between">
        <span className="text-text-primary text-sm font-semibold">변경된 파일</span>
        <FileLines className="text-blue-500" />
      </div>
      <div>
        <span className="text-text-primary text-3xl font-bold">{changedFileCount || 0}</span>
        <p className="text-xs text-text-secondary">개</p>
      </div>
    </div>
  );
}