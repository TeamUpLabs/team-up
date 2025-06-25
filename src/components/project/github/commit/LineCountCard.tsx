import { Plus, Minus, Code } from "flowbite-react-icons/outline";

interface LineCountCardProps {
  lineCount: number;
  state: "additions" | "deletions" | "total";
}

export default function LineCountCard({ lineCount, state }: LineCountCardProps) {
  return (
    <div className="bg-component-background rounded-lg p-6 border border-component-border space-y-2 hover:border-point-color-indigo-hover transition duration-200 ease-in-out">
      <div className="flex items-center justify-between">
        <span className="text-text-primary text-sm font-semibold">{state === "additions" ? "추가된 라인" : state === "deletions" ? "삭제된 라인" : "코드 변경"}</span>
        {state === "additions" ? (
          <Plus className="text-green-600" />
        ) : state === "deletions" ? (
          <Minus className="text-red-600" />
        ) : (
          <Code className="text-text-primary" />
        )}
      </div>
      <div>
        <span className={`${state === "additions" ? "text-green-600" : state === "deletions" ? "text-red-600" : "text-text-primary"} text-3xl font-bold`}>
          {state === "additions" ? "+" : state === "deletions" ? "-" : ""}{lineCount || 0}
        </span>
        <p className="text-xs text-text-secondary">라인</p>
      </div>
    </div>
  );
}