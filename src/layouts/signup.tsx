"use client";

import { useState } from "react"
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import SignupStep1 from "@/components/signup/SignupStep1"
import SignupStep2 from "@/components/signup/SignupStep2";
import SignupStep3 from "@/components/signup/SignupStep3";
import SignupStep4 from "@/components/signup/SignupStep4";
import SignupStep5 from "@/components/signup/SignupStep5";
import { SignUpFormData } from "@/types/SignUpFormData";
import { signup } from "@/hooks/signup";
import axios from "axios";
import { useAuthStore } from "@/auth/authStore";
import { checkMember } from "@/hooks/getMemberData";

export default function SignUpLayout() {
  const [formData, setFormData] = useState<SignUpFormData>({
    name: "",
    email: "",
    password: "",
    role: "",
    contactNumber: "",
    skills: [],
    birthDate: "",
    workingHours: {
      timezone: "",
      workingStartHour: "",
      workingEndHour: "",
    },
    languages: [],
    introduction: ""
  });

  const [step, setStep] = useState(1); // 1단계: 이메일, 2단계: 추가 정보
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");

  const [selectedTimeZone, setSelectedTimeZone] = useState("");
  const [workingStartHour, setWorkingStartHour] = useState("");
  const [workingEndHour, setWorkingEndHour] = useState("");

  const [languageInput, setLanguageInput] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);

  const [specialtyInput, setSpecialtyInput] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [isComposing, setIsComposing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "contactNumber") {
      const onlyNums = value.replace(/\D/g, ""); // 숫자만 추출

      let formatted = onlyNums;

      if (onlyNums.length < 4) {
        // 그대로
        formatted = onlyNums;
      } else if (onlyNums.length < 7) {
        // 010-123
        formatted = `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
      } else if (onlyNums.length <= 10) {
        // 010-1234-567
        formatted = `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 6)}-${onlyNums.slice(6)}`;
      } else {
        // 010-1234-5678
        formatted = `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 7)}-${onlyNums.slice(7, 11)}`;
      }

      setFormData(prev => ({
        ...prev,
        [name]: formatted,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  const handleRoleSelect = (selectedRole: string) => {
    setFormData(prev => ({
      ...prev,
      "role": selectedRole
    }))
  };

  const handleBirthDateChange = (type: "year" | "month" | "day", value: string) => {
    if (type === "year") setBirthYear(value);
    if (type === "month") setBirthMonth(value);
    if (type === "day") setBirthDay(value);

    const year = type === "year" ? value : birthYear;
    const month = type === "month" ? value : birthMonth;
    const day = type === "day" ? value : birthDay;

    if (year && month && day) {
      const formatted = `${year.replace("년", "")}-${month.replace("월", "").padStart(2, "0")}-${day.replace("일", "").padStart(2, "0")}`;
      setFormData(prev => ({
        ...prev,
        birthDate: formatted,
      }));
    }
  };

  const handleWorkingHourChange = (type: "timezone" | "workingStartHour" | "workingEndHour", value: string) => {
    if (type === "timezone") setSelectedTimeZone(value);
    if (type === "workingStartHour") setWorkingStartHour(value);
    if (type === "workingEndHour") setWorkingEndHour(value);

    const timezoneVal = type === "timezone" ? value : selectedTimeZone;
    const workingStartHourVal = type === "workingStartHour" ? value : workingStartHour;
    const workingEndHourVal = type === "workingEndHour" ? value : workingEndHour;

    if (timezoneVal && workingStartHourVal && workingEndHourVal) {
      const formatted = {
        timezone: timezoneVal,
        workingStartHour: workingStartHourVal,
        workingEndHour: workingEndHourVal
      }
      setFormData(prev => ({
        ...prev,
        workingHours: formatted,
      }));
    }
  }

  const handleLanguageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLanguageInput(value);
  }

  const handleSpecialtyInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSpecialtyInput(value);
  }

  const handleRemoveLanguage = (languageToRemove: string) => {
    const updatedLanguages = languages.filter(language => language !== languageToRemove);
    setLanguages(updatedLanguages);
    setFormData(prev => ({
      ...prev,
      languages: updatedLanguages,
    }));
  };

  const handleRemoveSpecialty = (specialtyToRemove: string) => {
    const updatedSpecialties = specialties.filter(specialty => specialty !== specialtyToRemove);
    setSpecialties(updatedSpecialties);
    setFormData(prev => ({
      ...prev,
      skills: updatedSpecialties,
    }));
  };

  // 제안 아이템 클릭 시 직접 언어 추가
  const handleAddSuggestion = (type: "language" | "specialty", suggestion: string) => {
    const trimmedSuggestion = suggestion.trim();
    
    if (type === "language") {
      if (trimmedSuggestion && !languages.includes(trimmedSuggestion)) {
        const updatedLanguages = [...languages, trimmedSuggestion];
        setLanguages(updatedLanguages);
        setFormData(prev => ({
          ...prev,
          languages: updatedLanguages,
        }));
        setLanguageInput("");
      }
    } else {
      if (trimmedSuggestion && !specialties.includes(trimmedSuggestion)) {
        const updatedSpecialties = [...specialties, trimmedSuggestion];
        setSpecialties(updatedSpecialties);
        setFormData(prev => ({
          ...prev,
          skills: updatedSpecialties,
        }));
        setSpecialtyInput("");
      }
    }
  };

  const handleKeyDown = (type: "language" | "specialty", e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isComposing) {
      e.preventDefault();
      if (type === "language") {
        const trimmedInput = languageInput.trim();
        if (trimmedInput && !languages.includes(trimmedInput)) {
          const updatedLanguages = [...languages, trimmedInput];
          setLanguages(updatedLanguages);
          setFormData(prev => ({
            ...prev,
            languages: updatedLanguages,
          }));
          setLanguageInput("");
        }
      } else if (type === "specialty") {
        const trimmedInput = specialtyInput.trim();
        if (trimmedInput && !specialties.includes(trimmedInput)) {
          const updatedSpecialties = [...specialties, trimmedInput];
          setSpecialties(updatedSpecialties);
          setFormData(prev => ({
            ...prev,
            skills: updatedSpecialties,
          }));
          setSpecialtyInput("");
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 5) {
      const fetchSignup = async () => {
        try {
          await signup(formData);
          useAuthStore.getState().setAlert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.", "success");
          window.location.href = "/signin";
        } catch (error) {
          console.error("회원가입 오류:", error);
          if (axios.isAxiosError(error) && error.response?.data) {
            console.log(error.response.data);
            useAuthStore.getState().setAlert(`회원가입 오류 관리자에게 문의해주세요.`, "error");
          } else {
            useAuthStore.getState().setAlert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.", "error");
          }
        }
      };
      fetchSignup();
    } else {
      if (step === 3 && !formData.role) {
        useAuthStore.getState().setAlert("역할을 선택해주세요.", "error");
        return;
      }

      if (step === 1) {
        const isExists = await checkMember(formData.email);
        if (isExists) {
          useAuthStore.getState().setAlert("이미 존재하는 이메일입니다.", "error");
          return;
        }
      }
      setStep(prev => Math.min(5, prev + 1));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-xl bg-component-background rounded-lg shadow-md p-8 border border-component-border">
        <div className="text-center mb-8 relative">
          {step > 1 && (
            <div
              className="absolute left-0 top-0 cursor-pointer transition-all duration-300 hover:translate-x-[-3px]"
              onClick={() => setStep(prev => Math.max(1, prev - 1))}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-text-secondary text-xl" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-text-primary">회원가입</h1>
            <p className="text-text-secondary mt-2">Team-Up에서 당신의 역량을 발휘할 준비를 해보세요</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <SignupStep1
              name={formData.name}
              email={formData.email}
              onChange={handleInputChange}
            />
          )}


          {step === 2 && (
            <SignupStep2
              password={formData.password}
              confirmPassword={confirmPassword}
              showPassword={showPassword}
              showConfirmPassword={showConfirmPassword}
              passwordError={passwordError}
              onChange={handleInputChange}
              onConfirmChange={(e) => {
                setConfirmPassword(e.target.value);
                setPasswordError(
                  formData.password !== e.target.value ? "비밀번호가 일치하지 않습니다." : ""
                );
              }}
              toggleShowPassword={() => setShowPassword(!showPassword)}
              toggleShowConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          )}

          {step === 3 && (
            <SignupStep3
              selectedRole={formData.role}
              onSelectRole={(role) => {
                handleRoleSelect(role);
              }}
            />
          )}

          {step === 4 && (
            <SignupStep4
              role={formData.role}
              contactNumber={formData.contactNumber}
              birthYear={birthYear}
              birthMonth={birthMonth}
              birthDay={birthDay}
              selectedTimeZone={selectedTimeZone}
              workingStartHour={workingStartHour}
              workingEndHour={workingEndHour}
              languageInput={languageInput}
              languages={languages}
              specialty={specialtyInput}
              specialties={specialties}
              onChange={handleInputChange}
              onBirthDateChange={handleBirthDateChange}
              onWorkingHourChange={handleWorkingHourChange}
              onLanguageInput={handleLanguageInput}
              onSpecialtyInput={handleSpecialtyInput}
              onKeyDown={handleKeyDown}
              onRemoveLanguage={handleRemoveLanguage}
              onRemoveSpecialty={handleRemoveSpecialty}
              onAddSuggestion={handleAddSuggestion}
              setIsComposing={setIsComposing}
            />
          )}

          {step === 5 && (
            <SignupStep5
              introduction={formData.introduction}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                introduction: e.target.value,
              }))}
            />
          )}

          <button
            type="submit"
            className="group w-full py-3 px-4 bg-point-color-indigo hover:bg-point-color-indigo-hover text-white font-medium rounded-md shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-point-color-indigo mt-8 flex items-center justify-center"
          >
            {step === 5 ? "회원가입" : "계속"}
            <span
              className="ml-1 inline-block opacity-0 translate-x-[-8px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
            >
              →
            </span>
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-text-secondary">
            이미 계정이 있으신가요?
            <Link href="/signin" className="text-point-color-purple hover:text-point-color-purple-hover ml-1">로그인</Link>
          </p>
        </div>
      </div>
    </div>
  )
} 