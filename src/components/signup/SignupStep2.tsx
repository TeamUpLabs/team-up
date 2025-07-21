import { Input } from "@/components/ui/Input";

interface Step2Props {
  password: string;
  confirmPassword: string;
  passwordError: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirmChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SignupStep2({
  password,
  confirmPassword,
  passwordError,
  onChange,
  onConfirmChange,
}: Step2Props) {
  return (
    <>
      <Input
        type="password"
        id="password"
        name="password"
        value={password}
        onChange={onChange}
        placeholder="비밀번호를 입력하세요"
        label="비밀번호"
        isRequired
        isPassword
      />

      <Input
        type="password"
        id="confirmPassword"
        name="confirmPassword"
        value={confirmPassword}
        onChange={onConfirmChange}
        placeholder="비밀번호를 다시 입력하세요"
        label="비밀번호 확인"
        isRequired
        isPassword
        error={passwordError}
      />
    </>
  )
}