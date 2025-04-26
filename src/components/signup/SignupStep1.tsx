import React from "react";

interface Step1Props {
  name: string;
  email: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SignupStep1({ name, email, onChange }: Step1Props) {
  return (
    <>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">이름</label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={onChange}
          className="w-full px-4 py-3 rounded-md bg-input-background border border-input-border hover:border-input-border-hover focus:outline-none focus:ring-1 focus:ring-point-color-indigo"
          placeholder="이름을 입력하세요"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">이메일</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={onChange}
          className="w-full px-4 py-3 rounded-md bg-input-background border border-input-border hover:border-input-border-hover focus:outline-none focus:ring-1 focus:ring-point-color-indigo"
          placeholder="이메일 주소를 입력하세요"
          required
        />
      </div>
    </>
  )
}