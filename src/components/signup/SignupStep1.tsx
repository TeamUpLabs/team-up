import React from "react";
import { Input } from "@/components/ui/Input";

interface Step1Props {
  name: string;
  email: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SignupStep1({ name, email, onChange }: Step1Props) {
  return (
    <div className="space-y-4">
      <Input
        type="text"
        label="이름"
        id="name"
        name="name"
        value={name}
        onChange={onChange}
        placeholder="이름을 입력하세요"
        isRequired
      />

      <Input
        type="email"
        label="이메일"
        id="email"
        name="email"
        value={email}
        onChange={onChange}
        placeholder="이메일 주소를 입력하세요"
        isRequired
      />
    </div>
  );
}
