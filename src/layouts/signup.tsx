"use client";

import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import SignupStep1 from "@/components/signup/SignupStep1";
import SignupStep2 from "@/components/signup/SignupStep2";
import SignupStep3 from "@/components/signup/SignupStep3";
import SignupStep4 from "@/components/signup/SignupStep4";
import SignupStep5 from "@/components/signup/SignupStep5";
import { SignUpFormData } from "@/types/SignUpFormData";
import { signup } from "@/hooks/signup";
import axios from "axios";
import { useAuthStore } from "@/auth/authStore";
import { checkMember } from "@/hooks/getMemberData";
import SignupStep6 from "@/components/signup/SignupStep6";
import SignupStep7 from "@/components/signup/SignupStep7";

export default function SignUpLayout() {
  const [formData, setFormData] = useState<SignUpFormData>({
    name: "",
    email: "",
    password: "",
    profile_image: "",
    role: "",
    status: "inactive",
    bio: "",
    languages: [],
    phone: "",
    birth_date: "",
    last_login: "",
    collaboration_preference: {
      collaboration_style: "",
      preferred_project_type: "",
      preferred_role: "",
      available_time_zone: "",
      work_hours_start: "",
      work_hours_end: "",
      preferred_project_length: "",
    },
    tech_stacks: [],
    interests: [],
  });

  const [step, setStep] = useState(1); // 1단계: 이메일, 2단계: 추가 정보
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [languageInput, setLanguageInput] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);

  const [skillsInput, setSkillsInput] = useState("");
  const [isLanguageComposing, setIsLanguageComposing] = useState(false);
  const [isSkillComposing, setIsSkillComposing] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "phone") {
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
        formatted = `${onlyNums.slice(0, 3)}-${onlyNums.slice(
          3,
          6
        )}-${onlyNums.slice(6)}`;
      } else {
        // 010-1234-5678
        formatted = `${onlyNums.slice(0, 3)}-${onlyNums.slice(
          3,
          7
        )}-${onlyNums.slice(7, 11)}`;
      }

      setFormData((prev) => ({
        ...prev,
        [name]: formatted,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleRoleSelect = (selectedRole: string) => {
    setFormData((prev) => ({
      ...prev,
      role: selectedRole,
    }));
  };

  // Helper to format Date to YYYY-MM-DD string
  const formatDateToString = (date: Date | undefined): string => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleBirthDateChange = (date: Date | undefined) => {
    setFormData((prevData) => ({
      ...prevData,
      birth_date: date ? formatDateToString(date) : "",
    }));
  };

  const handleCollaborationPreferenceChange = (
    field: string,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      collaboration_preference: {
        ...prev.collaboration_preference,
        [field]: value,
      },
    }));
  };

  const handleWorkingHoursChange = (name: string, value: string) => {
    if (name === "timezone") {
      handleCollaborationPreferenceChange("available_time_zone", value);
    } else if (name === "start") {
      const [hours, minutes] = value.split(":").map(Number);
      const timeValue = hours * 100 + (minutes || 0);
      handleCollaborationPreferenceChange("work_hours_start", timeValue);
    } else if (name === "end") {
      const [hours, minutes] = value.split(":").map(Number);
      const timeValue = hours * 100 + (minutes || 0);
      handleCollaborationPreferenceChange("work_hours_end", timeValue);
    } else if (name === "preferred_project_length") {
      handleCollaborationPreferenceChange("preferred_project_length", value);
    }
  };

  const handleLanguageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLanguageInput(value);
  };

  const handleRemoveLanguage = (languageToRemove: string) => {
    const updatedLanguages = languages.filter(
      (language) => language !== languageToRemove
    );
    setLanguages(updatedLanguages);
    setFormData((prev) => ({
      ...prev,
      languages: updatedLanguages,
    }));
  };

  const addInterest = (category: string, interest: string) => {
    const newInterest: {
      interest_category: string;
      interest_name: string;
    } = {
      interest_category: category,
      interest_name: interest,
    };
    const exists = formData.interests.some(
      (item) =>
        item.interest_category === category && item.interest_name === interest
    );
    if (!exists) {
      setFormData((prev) => ({
        ...prev,
        interests: [
          ...prev.interests,
          {
            ...newInterest,
          },
        ],
      }));
    }
  };

  const removeInterest = (category: string, interest: string) => {
    const filtered = formData.interests.filter(
      (item) =>
        !(
          item.interest_category === category && item.interest_name === interest
        )
    );
    setFormData((prev) => ({
      ...prev,
      interests: filtered,
    }));
  };

  const handleSkillLevelChange = (tech: string, level: number) => {
    const updatedSkills = formData.tech_stacks.map((skill) =>
      skill.tech === tech ? { ...skill, level } : skill
    );
    setFormData((prev) => ({
      ...prev,
      tech_stacks: updatedSkills,
    }));
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedSkills = formData.tech_stacks.filter((skill) => skill.tech !== skillToRemove);
    setFormData((prev) => ({
      ...prev,
      tech_stacks: updatedSkills,
    }));
  };

  const handleKeyDown = (
    type: "language" | "skill",
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && !isLanguageComposing && !isSkillComposing) {
      e.preventDefault();
      if (type === "language") {
        const trimmedInput = languageInput.trim();
        if (trimmedInput && !formData.languages.includes(trimmedInput)) {
          const updatedLanguages = [...formData.languages, trimmedInput];
          setFormData((prev) => ({
            ...prev,
            languages: updatedLanguages,
          }));
          setLanguageInput("");
        }
      } else if (type === "skill") {
        const trimmedInput = skillsInput.trim();
        setSkillsInput("");
        if (
          trimmedInput &&
          !formData.tech_stacks.some((skill) => skill.tech === trimmedInput)
        ) {
          const newTechStack = {
            tech: trimmedInput,
            level: 1,
          };
          const updatedSkills = [...formData.tech_stacks, newTechStack];
          setFormData((prev) => ({
            ...prev,
            tech_stacks: updatedSkills,
          }));
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 7) {
      const fetchSignup = async () => {
        try {
          await signup(formData);
          useAuthStore
            .getState()
            .setAlert(
              "회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.",
              "success"
            );
          window.location.href = "/signin";
        } catch (error) {
          console.error("회원가입 오류:", error);
          if (axios.isAxiosError(error) && error.response?.data) {
            console.log(error.response.data);
            useAuthStore
              .getState()
              .setAlert(`회원가입 오류 관리자에게 문의해주세요.`, "error");
          } else {
            useAuthStore
              .getState()
              .setAlert(
                "회원가입 중 오류가 발생했습니다. 다시 시도해주세요.",
                "error"
              );
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
          useAuthStore
            .getState()
            .setAlert("이미 존재하는 이메일입니다.", "error");
          return;
        }
      }
      setStep((prev) => Math.min(7, prev + 1));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-xl bg-component-background rounded-lg shadow-md p-8 border border-component-border">
        <div className="text-center mb-8 relative">
          {step > 1 && (
            <div
              className="absolute left-0 top-0 cursor-pointer transition-all duration-300 hover:translate-x-[-3px]"
              onClick={() => setStep((prev) => Math.max(1, prev - 1))}
            >
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="text-text-secondary text-xl"
              />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-text-primary">회원가입</h1>
            <p className="text-text-secondary mt-2">
              Team-Up에서 당신의 역량을 발휘할 준비를 해보세요
            </p>
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
                  formData.password !== e.target.value
                    ? "비밀번호가 일치하지 않습니다."
                    : ""
                );
              }}
              toggleShowPassword={() => setShowPassword(!showPassword)}
              toggleShowConfirmPassword={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
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
              phone={formData.phone}
              birth_date={formData.birth_date}
              languageInput={languageInput}
              languages={formData.languages}
              onChange={handleInputChange}
              onBirthDateChange={handleBirthDateChange}
              handleLanguageInput={handleLanguageInput}
              onKeyDown={handleKeyDown}
              onRemoveLanguage={handleRemoveLanguage}
              setIsComposing={setIsLanguageComposing}
            />
          )}

          {step === 5 && (
            <SignupStep5
              collaborationStyle={formData.collaboration_preference.collaboration_style}
              setCollaborationStyle={(style) => handleCollaborationPreferenceChange("collaboration_style", style)}
              projectType={formData.collaboration_preference.preferred_project_type}
              setProjectType={(type) => handleCollaborationPreferenceChange("preferred_project_type", type)}
              role={formData.role}
              preferred_role={formData.collaboration_preference.preferred_role}
              setPreferredRole={(role) => handleCollaborationPreferenceChange("preferred_role", role)}
              workingHours={{
                timezone: formData.collaboration_preference.available_time_zone,
                start: formData.collaboration_preference.work_hours_start ? 
                  `${Math.floor(Number(formData.collaboration_preference.work_hours_start) / 100).toString().padStart(2, '0')}:${(Number(formData.collaboration_preference.work_hours_start) % 100).toString().padStart(2, '0')}` : "",
                end: formData.collaboration_preference.work_hours_end ? 
                  `${Math.floor(Number(formData.collaboration_preference.work_hours_end) / 100).toString().padStart(2, '0')}:${(Number(formData.collaboration_preference.work_hours_end) % 100).toString().padStart(2, '0')}` : "",
                preferred_project_length: formData.collaboration_preference.preferred_project_length,
              }}
              onWorkingHoursChange={handleWorkingHoursChange}
            />
          )}

          {step === 6 && (
            <SignupStep6
              interests={formData.interests}
              setInterests={(interests) => setFormData(prev => ({ 
                ...prev, 
                interests: interests.map(interest => ({
                  ...interest,
                }))
              }))}
              addInterest={addInterest}
              removeInterest={removeInterest}
            />
          )}

          {step === 7 && (
            <SignupStep7
              skills={formData.tech_stacks}
              setIsComposing={setIsSkillComposing}
              onKeyDown={handleKeyDown}
              skillsInput={skillsInput}
              setSkillsInput={setSkillsInput}
              onRemoveSkill={handleRemoveSkill}
              onChangeSkillLevel={handleSkillLevelChange}
            />
          )}

          <button
            type="submit"
            className="group w-full py-3 px-4 bg-point-color-indigo hover:bg-point-color-indigo-hover text-white font-medium rounded-md shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-point-color-indigo mt-8 flex items-center justify-center"
          >
            {step === 7 ? "회원가입" : "계속"}
            <span className="ml-1 inline-block opacity-0 translate-x-[-8px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
              →
            </span>
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-text-secondary">
            이미 계정이 있으신가요?
            <Link
              href="/signin"
              className="text-point-color-purple hover:text-point-color-purple-hover ml-1"
            >
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
