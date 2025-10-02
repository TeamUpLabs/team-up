import React from "react";
import { Braces, Palette, Brain } from "lucide-react";

interface Step3Props {
  selectedJob: string;
  onSelectJob: (job: string) => void;
}

interface JobOption {
  value: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

export default function SignupStep3({ selectedJob, onSelectJob }: Step3Props) {
  const jobs: JobOption[] = [
    {
      value: "developer",
      label: "개발자",
      description: "프로젝트 구현 및 개발",
      icon: <Braces className="h-10 w-10 mb-3 text-point-color-indigo" />,
    },
    {
      value: "designer",
      label: "디자이너",
      description: "UI/UX 디자인 및 시각화",
      icon: <Palette className="h-10 w-10 mb-3 text-point-color-indigo" />,
    },
    {
      value: "planner",
      label: "기획자",
      description: "프로젝트 기획 및 관리",
      icon: <Brain className="h-10 w-10 mb-3 text-point-color-indigo" />,
    },
  ];

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-text-secondary">직업을 선택해주세요 <span className="text-purple-500">*</span></label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <button
            key={job.value}
            type="button"
            onClick={() => onSelectJob(job.value)}
            className={`p-6 rounded-lg border border-component-border ${
              selectedJob === job.value
                ? "border-point-color-indigo bg-point-color-indigo/30"
                : "border-component-border bg-component-secondary-background hover:bg-component-tertiary-background hover:border-point-color-indigo"
            } transition-all duration-200 flex flex-col items-center cursor-pointer`}
          >
            {job.icon}
            <span className="text-lg font-medium text-text-primary">{job.label}</span>
            <span className="text-xs text-text-secondary mt-2 text-center">{job.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}