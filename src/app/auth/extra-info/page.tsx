"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/auth/authStore";
import { ExtraInfoFormData } from "@/types/SignUpFormData";
import SignupStep3 from "@/components/signup/SignupStep3";
import SignupStep4 from "@/components/signup/SignupStep4";
import { server } from "@/auth/server";
import { getCurrentKoreanTimeDate, getCurrentKoreanTime } from "@/utils/dateUtils";

const ExtraInfoPage = () => {
  const router = useRouter();
  const url = new URL(window.location.href);
  const social = url.searchParams.get("social");

  const [partialUser, setPartialUser] = useState({
    name: "",
    email: "",
    profileImage: "",
    socialLinks: [],
    introduction: "",
    social_id: "",
    social_access_token: "",
  });
  const [formData, setFormData] = useState<ExtraInfoFormData>({
    status: "활성",
    contactNumber: "",
    birthDate: "",
    role: "",
    introduction: "",
    skills: [],
    workingHours: {
      timezone: "",
      start: "",
      end: "",
    },
    languages: [],
  });

  const [step, setStep] = useState(3);

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

  useEffect(() => {
    const userData = localStorage.getItem("partial_user");
    if (userData) {
      setPartialUser(JSON.parse(userData));
    }
  }, []);

  const handleRoleSelect = (selectedRole: string) => {
    setFormData(prev => ({
      ...prev,
      "role": selectedRole
    }))
  };

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

  const handleWorkingHourChange = (type: "timezone" | "start" | "end", value: string) => {
    if (type === "timezone") setSelectedTimeZone(value);
    if (type === "start") setWorkingStartHour(value);
    if (type === "end") setWorkingEndHour(value);

    const timezoneVal = type === "timezone" ? value : selectedTimeZone;
    const workingStartHourVal = type === "start" ? value : workingStartHour;
    const workingEndHourVal = type === "end" ? value : workingEndHour;

    if (timezoneVal && workingStartHourVal && workingEndHourVal) {
      const formatted = {
        timezone: timezoneVal,
        start: workingStartHourVal,
        end: workingEndHourVal
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
    if (step === 4) {
      const res = await server.post(`/auth/signup`, {
        ...formData,
        name: partialUser.name,
        email: partialUser.email,
        profileImage: partialUser.profileImage,
        socialLinks: partialUser.socialLinks,
        introduction: partialUser.introduction,
        github_id: social === "github" ? partialUser.social_id : "",
        isGithub: social === "github",
        signupMethod: social,
        createdAt: getCurrentKoreanTimeDate(),
        lastLogin: getCurrentKoreanTime(),
        github_access_token: social === "github" ? partialUser.social_access_token : "",
      });

      const data = res.data;
      if (data.access_token) {
        useAuthStore.getState().setToken(data.access_token);
        useAuthStore.getState().setUser(data.user_info);
        useAuthStore.getState().setAlert("로그인 성공", "success");
        router.push("/platform");
      }
    } else {
      if (step === 3 && !formData.role) {
        useAuthStore.getState().setAlert("역할을 선택해주세요.", "error");
        return;
      }
      setStep(prev => Math.min(4, prev + 1));
    }
  };

  if (!partialUser) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-xl bg-component-background rounded-lg shadow-md p-8 border border-component-border">
        <div className="text-center mb-8 relative">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">추가 정보 입력</h1>
            <p className="text-text-secondary mt-2">Team-Up에서 당신의 역량을 발휘할 준비를 해보세요</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <button
            type="submit"
            className="group w-full py-3 px-4 bg-point-color-indigo hover:bg-point-color-indigo-hover text-white font-medium rounded-md shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-point-color-indigo mt-8 flex items-center justify-center"
          >
            {step === 4 ? "회원가입" : "계속"}
            <span
              className="ml-1 inline-block opacity-0 translate-x-[-8px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
            >
              →
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExtraInfoPage;