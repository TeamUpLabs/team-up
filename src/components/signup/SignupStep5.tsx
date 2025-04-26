import React from 'react';

interface SignupStep5Props {
  introduction: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function SignupStep5({ introduction, onChange }: SignupStep5Props) {
  return (
    <div>
      <label htmlFor="introduction" className="block text-sm font-medium text-text-secondary mb-3">자기소개</label>
      <textarea
        id="introduction"
        name="introduction"
        rows={6}
        value={introduction}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-md bg-input-background border border-input-border hover:border-input-border-hover focus:outline-none focus:ring-1 focus:ring-point-color-indigo resize-none"
        placeholder="자신의 경력, 관심사, 강점 등을 자유롭게 작성해주세요. 팀원들에게 당신을 소개할 수 있는 좋은 기회입니다."
      />
    </div>
  );
}