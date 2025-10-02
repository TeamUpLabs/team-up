"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/auth/authStore";
import { ExtraInfoFormData } from "@/types/SignUpFormData";
import SignupStep3 from "@/components/signup/SignupStep3";
import SignupStep4 from "@/components/signup/SignupStep4";
import SignupStep5 from "@/components/signup/SignupStep5";
import SignupStep6 from "@/components/signup/SignupStep6";
import SignupStep7 from "@/components/signup/SignupStep7";
import { server } from "@/auth/server";
import {
  ArrowLeft,
  Users,
  Info,
  Handshake,
  Lightbulb,
  Cpu,
} from "lucide-react";

const ExtraInfoPage = () => {
  const router = useRouter();

  const [partialUser, setPartialUser] = useState({
    name: "",
    email: "",
    profile_image: "",
    social_links: [],
    bio: "",
    auth_provider: "",
    auth_provider_id: "",
    auth_provider_access_token: "",
  });

  const [formData, setFormData] = useState<ExtraInfoFormData>({
    job: "",
    status: "inactive",
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

  const [step, setStep] = useState(3);
  const totalSteps = 5;
  const progress = ((step - 2) / totalSteps) * 100;

  const stepInfo = [
    {
      title: "직업",
      description: "당신의 직업을 선택해주세요",
      icon: <Users className="h-12 w-12 mx-auto text-primary mb-2" />,
      MiniIcon: <Users className="h-4 w-4" />,
    },
    {
      title: "기본 정보",
      description: "당신의 기본 정보를 입력해주세요",
      icon: <Info className="h-12 w-12 mx-auto text-primary mb-2" />,
      MiniIcon: <Info className="h-4 w-4" />,
    },
    {
      title: "협업 선호도",
      description: "어떤 협업 방식을 선호하시나요?",
      icon: <Handshake className="h-12 w-12 mx-auto text-primary mb-2" />,
      MiniIcon: <Handshake className="h-4 w-4" />,
    },
    {
      title: "관심분야",
      description: "당신이 관심 있는 분야가 궁금해요",
      icon: <Lightbulb className="h-12 w-12 mx-auto text-primary mb-2" />,
      MiniIcon: <Lightbulb className="h-4 w-4" />,
    },
    {
      title: "기술 스택",
      description: "당신이 사용할 수 있는 기술 스택을 입력해주세요",
      icon: <Cpu className="h-12 w-12 mx-auto text-primary mb-2" />,
      MiniIcon: <Cpu className="h-4 w-4" />,
    },
  ];

  const [languageInput, setLanguageInput] = useState("");
  const [skillsInput, setSkillsInput] = useState("");

  const [isLanguageComposing, setIsLanguageComposing] = useState(false);
  const [isSkillComposing, setIsSkillComposing] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("partial_user");
    if (userData) {
      setPartialUser(JSON.parse(userData));
    }
  }, []);

  const handleJobSelect = (selectedJob: string) => {
    setFormData((prev) => ({
      ...prev,
      job: selectedJob,
    }));
  };

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

  const handleLanguageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLanguageInput(value);
  };

  const handleRemoveLanguage = (languageToRemove: string) => {
    const updatedLanguages = formData.languages.filter(
      (language) => language !== languageToRemove
    );
    setFormData((prev) => ({
      ...prev,
      languages: updatedLanguages,
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
        if (trimmedInput && !formData.tech_stacks.some(skill => skill.tech === trimmedInput)) {
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

  const handleCollaborationPreferenceChange = (field: string, value: string | number) => {
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

  const addInterest = (category: string, interest: string) => {
    const newInterest: {
      interest_category: string;
      interest_name: string;
    } = {
      interest_category: category,
      interest_name: interest,
    }
    const exists = formData.interests.some(
      (item) => item.interest_category === category && item.interest_name === interest,
    )
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
  }

  const removeInterest = (category: string, interest: string) => {
    const filtered = formData.interests.filter(
      (item) => !(item.interest_category === category && item.interest_name === interest),
    )
    setFormData((prev) => ({
      ...prev,
      interests: filtered,
    }));
  }

  const handleSkillLevelChange = (tech: string, level: number) => {
    const updatedSkills = formData.tech_stacks.map((skill) =>
      skill.tech === tech ? { ...skill, level } : skill
    );
    setFormData((prev) => ({
      ...prev,
      tech_stacks: updatedSkills,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      ...formData,
      ...partialUser,
    });
    if (step - 2 === 5) {
      const res = await server.post(`/api/v1/user/oauth/additional-info`, {
        ...formData,
        ...partialUser,
      });

      if (res.status === 200) {
        localStorage.removeItem("partial_user");
        useAuthStore.getState().setAlert("회원가입 성공", "success");
        router.push("/signin");
      }
    } else {
      if (step - 2 === 1 && !formData.job) {
        useAuthStore.getState().setAlert("역할을 선택해주세요.", "error");
        return;
      }
      setStep((prev) => Math.min(7, prev + 1));
    }
  };

  if (!partialUser) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-3xl bg-component-background rounded-lg shadow-md p-8 border border-component-border space-y-6">
        <div className="space-y-2">
          {step - 2 > 1 && (
            <div
              className="cursor-pointer transition-all duration-300 hover:translate-x-[-3px]"
              onClick={() => setStep((prev) => Math.max(1, prev - 1))}
            >
              <ArrowLeft className="text-text-secondary text-xl" />
            </div>
          )}
          <div className="w-full h-4 bg-component-secondary-background rounded-full">
            <div
              className="h-full bg-point-color-indigo rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-text-secondary">
            {stepInfo.map((info, index) => {
              return (
                <div
                  key={info.title}
                  className={`flex items-center gap-1 ${
                    step - 2 === index + 1
                      ? "text-text-primary font-medium"
                      : ""
                  }`}
                >
                  {info.MiniIcon}
                  {info.title}
                </div>
              );
            })}
          </div>
        </div>
            
        <div className="space-y-6">
          <div className="text-center mb-6">
            {stepInfo[step - 3].icon}
            <h3 className="text-lg font-semibold text-text-primary">{stepInfo[step - 3].title}</h3>
            <p className="text-text-secondary">{stepInfo[step - 3].description}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 3 && (
            <SignupStep3
              selectedJob={formData.job}
              onSelectJob={(job) => {
                handleJobSelect(job);
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
              job={formData.job}
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
            className="group w-full py-3 px-4 bg-point-color-indigo hover:bg-point-color-indigo-hover text-white font-medium rounded-md shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-point-color-indigo flex items-center justify-center"
          >
            {step - 2 === 5 ? "회원가입" : "계속"}
            <span className="ml-1 inline-block opacity-0 translate-x-[-8px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
              →
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExtraInfoPage;
