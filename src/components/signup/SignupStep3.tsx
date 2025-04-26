import { JSX } from "react";

interface Step3Props {
  selectedRole: string;
  onSelectRole: (role: string) => void;
}

interface RoleOption {
  value: string;
  label: string;
  description: string;
  icon: JSX.Element;
}

export default function SignupStep3({ selectedRole, onSelectRole }: Step3Props) {
  const roles: RoleOption[] = [
    {
      value: "개발자",
      label: "개발자",
      description: "프로젝트 구현 및 개발",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-3 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
    {
      value: "디자이너",
      label: "디자이너",
      description: "UI/UX 디자인 및 시각화",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-3 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
    },
    {
      value: "기획자",
      label: "기획자",
      description: "프로젝트 기획 및 관리",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-3 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
  ];

  return (
    <div className="mb-8">
      <label className="block text-sm font-medium text-gray-300 mb-3">역할을 선택해주세요</label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roles.map((role) => (
          <button
            key={role.value}
            type="button"
            onClick={() => onSelectRole(role.value)}
            className={`p-6 rounded-lg border border-gray-700/50 ${
              selectedRole === role.value
                ? "border-purple-500 bg-purple-900/30"
                : "border-gray-600 bg-gray-800/50 hover:bg-gray-800/60"
            } transition-all duration-200 flex flex-col items-center`}
          >
            {role.icon}
            <span className="text-lg font-medium text-white">{role.label}</span>
            <span className="text-xs text-gray-400 mt-2 text-center">{role.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}