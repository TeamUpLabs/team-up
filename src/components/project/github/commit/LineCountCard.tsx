import { Plus, Minus } from "flowbite-react-icons/outline";

interface LineCountCardProps {
  lineCount: number;
  state: "additions" | "deletions";
}

export default function LineCountCard({ lineCount, state }: LineCountCardProps) {
  return (
    <div className="bg-component-background rounded-lg p-6 border border-component-border space-y-2 hover:border-point-color-indigo-hover transition duration-200 ease-in-out">
      <div className="flex items-center justify-between">
        <span className="text-text-primary text-sm font-semibold">{state === "additions" ? "추가된 라인" : "삭제된 라인"}</span>
        {state === "additions" ? (
          <Plus className="text-green-600" />
        ) : (
          <Minus className="text-red-600" />
        )}
      </div>
      <div>
        <span className={`${state === "additions" ? "text-green-600" : "text-red-600"} text-3xl font-bold`}>
          {state === "additions" ? "+" : "-"}{lineCount || 0}
        </span>
        <p className="text-xs text-text-secondary">라인</p>
      </div>
    </div>
  );
}