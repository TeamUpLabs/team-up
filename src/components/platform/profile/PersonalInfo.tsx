"use client";

import Badge from "@/components/ui/Badge";
import { Settings, Camera, User } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { updateUserProfileImage } from "@/hooks/getMemberData";
import { Member } from "@/types/Member";
import { useAuthStore } from "@/auth/authStore";
import ImageCropModal from "@/components/platform/profile/ImageCropModal";
import { formatDateToString, parseStringToDate } from "@/utils/dateUtils";
import { Input } from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import DatePicker from "@/components/ui/DatePicker";
import TimePicker from "@/components/ui/TimePicker";
import { TextArea } from "@/components/ui/TextArea";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { Globe } from "lucide-react";

interface PersonalInfoProps {
  user: Member;
}

export default function PersonalInfo({ user }: PersonalInfoProps) {
  const { isDark } = useTheme();
  const [isEditing, setIsEditing] = useState<string>("none");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [originalProfileData, setOriginalProfileData] = useState<Member | null>(user);
  const [newSkill, setNewSkill] = useState<string>("");
  const [newLanguage, setNewLanguage] = useState<string>("");
  const [isComposing, setIsComposing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    contactNumber: "",
    birthDate: "",
    introduction: "",
    skills: [] as string[],
    languages: [] as string[],
    workingHours: {
      start: "",
      end: "",
      timezone: "",
    },
    socialLinks: [
      {
        name: "",
        url: "",
      },
    ],
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email || "",
        role: user.role,
        contactNumber: user.contactNumber || "",
        birthDate: user.birthDate || "",
        introduction: user.introduction || "",
        skills: user.skills || [],
        languages: user.languages || [],
        workingHours: user.workingHours || {
          start: "",
          end: "",
          timezone: "",
        },
        socialLinks: user.socialLinks || [
          {
            name: "",
            url: "",
          },
        ],
      });
    }
  }, [user]);

  const handleEdit = (name: string) => {
    if (name !== "none" && isEditing === "none") {
      setOriginalProfileData({ ...user });
    }

    setIsEditing(name);
    if (name !== "none") {
      useAuthStore.getState().setAlert("편집 모드로 전환되었습니다.", "info");
    } else {
      useAuthStore.getState().setAlert("편집 모드를 종료했습니다.", "info");
    }
  };

  const handleCancelEdit = () => {
    if (originalProfileData) {
      setFormData({
        name: originalProfileData.name,
        email: originalProfileData.email || "",
        role: originalProfileData.role,
        contactNumber: originalProfileData.contactNumber || "",
        birthDate: originalProfileData.birthDate || "",
        introduction: originalProfileData.introduction || "",
        skills: originalProfileData.skills || [],
        languages: originalProfileData.languages || [],
        workingHours: originalProfileData.workingHours || {
          start: "",
          end: "",
          timezone: "",
        },
        socialLinks: originalProfileData.socialLinks || [],
      });
    }

    setIsEditing("none");
    setOriginalProfileData(null);
    useAuthStore.getState().setAlert("편집 모드를 종료했습니다.", "info");
  };

  const handleProfilePictureClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setCropImage(imageUrl);
      setShowCropModal(true);
    }
  };

  const handleCropComplete = async (croppedImageUrl: string) => {
    setIsLoading(true);
    setPreviewImage(croppedImageUrl);

    const response = await updateUserProfileImage(user?.id || 0, croppedImageUrl);

    if (user) {
      useAuthStore.getState().setUser({
        ...user,
        profileImage: response
      });
    }

    setShowCropModal(false);
    useAuthStore.getState().setAlert("프로필 이미지가 업데이트되었습니다.", "success");
    setIsLoading(false);
  };

  const handleCloseModal = () => {
    setShowCropModal(false);
    // Clean up object URL
    if (cropImage) {
      URL.revokeObjectURL(cropImage);
    }
  };

  // Clean up object URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
      if (cropImage) {
        URL.revokeObjectURL(cropImage);
      }
    };
  }, [previewImage, cropImage]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBirthDateChange = (date: Date | undefined) => {
    setFormData(prevData => ({
      ...prevData,
      birthDate: date ? formatDateToString(date) : "",
    }));
  };

  const handleKeyDown = (type: "skills" | "languages", e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isComposing) {
      e.preventDefault();

      if (type === "skills") {
        const trimmedInput = newSkill.trim();
        if (trimmedInput && !formData.skills.includes(trimmedInput)) {
          const updatedSkills = [...formData.skills, trimmedInput];
          setFormData((prev) => ({
            ...prev,
            skills: updatedSkills,
          }));
          setNewSkill("");
        }
      } else if (type === "languages") {
        const trimmedInput = newLanguage.trim();
        if (trimmedInput && !formData.languages.includes(trimmedInput)) {
          const updatedLanguages = [...formData.languages, trimmedInput];
          setFormData((prev) => ({
            ...prev,
            languages: updatedLanguages,
          }));
          setNewLanguage("");
        }
      }
    }
  }

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const removeLanguage = (language: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l !== language),
    }));
  };

  const handleTimeZoneChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        timezone: value,
      },
    }));
  };

  const handleStartTimeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        start: value,
      },
    }));
  };

  const handleEndTimeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        end: value,
      },
    }));
  };

  const handleSocialLinkChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map(link => link.name === name ? { ...link, url: value } : link),
    }));
  };

  return (
    <div className="flex flex-col gap-4 border border-component-border rounded-lg p-6">
      <div className="flex items-center gap-4">
        {user?.profileImage ? (
          <div className="h-24 w-24 relative rounded-full border-4 border-component-border bg-component-secondary-background flex items-center justify-center overflow-hidden group cursor-pointer" onClick={handleProfilePictureClick}>
            <Image
              src={user.profileImage}
              alt="Profile"
              className="w-full h-full object-fit rounded-full"
              quality={100}
              width={100}
              height={100}
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="text-white text-xl" />
            </div>
          </div>
        ) : (
          <div className="h-24 w-24 relative rounded-full border-4 border-component-border bg-component-secondary-background flex items-center justify-center overflow-hidden group cursor-pointer" onClick={handleProfilePictureClick}>
            <User className="text-text-secondary w-15 h-15" />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="text-white" />
            </div>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleProfilePictureChange}
        />

        <div className="flex flex-col">
          <h2 className="text-2xl font-bold">{user?.name}</h2>
          <p className="text-base text-text-secondary">{user?.role}</p>
        </div>
      </div>

      {showCropModal && (
        <ImageCropModal
          image={cropImage || ""}
          onClose={handleCloseModal}
          onCropComplete={handleCropComplete}
          loading={isLoading}
        />
      )}

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="이름"
          name="name"
          placeholder="이름을 입력해주세요."
          isRequired
          value={formData.name}
          onChange={handleOnChange}
          isEditable
          EditOnClick={() => isEditing === "name" ? handleCancelEdit() : handleEdit("name")}
          disabled={isEditing !== "name"}
          className="disabled:cursor-not-allowed disabled:opacity-70"
        />

        <Input
          label="이메일"
          name="email"
          placeholder="이메일을 입력해주세요."
          isRequired
          value={formData.email}
          onChange={handleOnChange}
          isEditable
          EditOnClick={() => isEditing === "email" ? handleCancelEdit() : handleEdit("email")}
          disabled={isEditing !== "email"}
          className="disabled:cursor-not-allowed disabled:opacity-70"
        />

        <Input
          label="연락처"
          name="contactNumber"
          placeholder="연락처를 입력해주세요."
          isRequired
          value={formData.contactNumber}
          onChange={handleOnChange}
          isEditable
          EditOnClick={() => isEditing === "contactNumber" ? handleCancelEdit() : handleEdit("contactNumber")}
          disabled={isEditing !== "contactNumber"}
          className="disabled:cursor-not-allowed disabled:opacity-70"
        />

        <DatePicker
          value={formData.birthDate ? parseStringToDate(formData.birthDate) : undefined}
          onChange={handleBirthDateChange}
          label="생년월일"
          isRequired
          isEditable
          EditOnClick={() => isEditing === "birthDate" ? handleCancelEdit() : handleEdit("birthDate")}
          disabled={isEditing !== "birthDate"}
          className="disabled:cursor-not-allowed disabled:opacity-70 disabled:text-text-secondary"
        />

        <Select
          label="시간대"
          value={formData.workingHours.timezone}
          onChange={(value) => handleTimeZoneChange(value as string)}
          options={[
            { name: "workingHours.timezone", value: "Asia/Seoul", label: "한국 표준시 (KST)" },
            { name: "workingHours.timezone", value: "UTC", label: "세계 표준시 (UTC)" },
            { name: "workingHours.timezone", value: "America/New_York", label: "동부 표준시 (EST)" },
            { name: "workingHours.timezone", value: "America/Los_Angeles", label: "태평양 표준시 (PST)" },
          ]}
          isRequired
          disabled={isEditing !== "workingHours.timezone"}
          isEditable
          EditOnClick={() => isEditing === "workingHours.timezone" ? handleCancelEdit() : handleEdit("workingHours.timezone")}
          dropDownClassName="!w-full"
        />

        <div className="grid grid-cols-2 gap-2">
          <TimePicker
            value={formData.workingHours.start}
            onChange={(value) => handleStartTimeChange(value)}
            disabled={isEditing !== "workingHours.start"}
            className="w-full !bg-input-background !disabled:cursor-not-allowed !disabled:opacity-70"
            step={30}
            label="시작 시간"
            isEditable
            EditOnClick={() => isEditing === "workingHours.start" ? handleCancelEdit() : handleEdit("workingHours.start")}
            isRequired
          />
          <TimePicker
            value={formData.workingHours.end}
            onChange={(value) => handleEndTimeChange(value)}
            disabled={isEditing !== "workingHours.end"}
            className="w-full !bg-input-background !disabled:cursor-not-allowed !disabled:opacity-70"
            step={30}
            label="종료 시간"
            isEditable
            EditOnClick={() => isEditing === "workingHours.end" ? handleCancelEdit() : handleEdit("workingHours.end")}
            isRequired
          />
        </div>

        <div className="flex flex-col gap-2">
          <Input
            label="기술"
            name="skills"
            placeholder="기술을 입력해주세요."
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            isEditable
            EditOnClick={() => isEditing === "skills" ? handleCancelEdit() : handleEdit("skills")}
            disabled={isEditing !== "skills"}
            onKeyDown={(e) => handleKeyDown("skills", e)}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            className="disabled:cursor-not-allowed disabled:opacity-70"
          />
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, index) => (
              isEditing === "skills" ? (
                <Badge
                  key={index}
                  content={skill}
                  color="blue"
                  isEditable={isEditing === "skills"}
                  onRemove={() => removeSkill(skill)}
                />
              ) : (
                <Badge key={index} content={skill} color="blue" />
              )
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Input
            label="언어"
            name="languages"
            placeholder="언어를 입력해주세요."
            value={newLanguage}
            onChange={(e) => setNewLanguage(e.target.value)}
            isEditable
            EditOnClick={() => isEditing === "languages" ? handleCancelEdit() : handleEdit("languages")}
            disabled={isEditing !== "languages"}
            onKeyDown={(e) => handleKeyDown("languages", e)}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            className="disabled:cursor-not-allowed disabled:opacity-70"
          />
          <div className="flex flex-wrap gap-2">
            {formData.languages.map((language, index) => (
              isEditing === "languages" ? (
                <Badge
                  key={index}
                  content={language}
                  color="green"
                  isEditable={isEditing === "languages"}
                  onRemove={() => removeLanguage(language)}
                />
              ) : (
                <Badge key={index} content={language} color="green" />
              )
            ))}
          </div>
        </div>

        <div className="col-span-2">
          <TextArea
            label="소개글"
            name="introduction"
            placeholder="소개글을 입력해주세요."
            value={formData.introduction}
            onChange={handleOnChange}
            isEditable
            EditOnClick={() => isEditing === "introduction" ? handleCancelEdit() : handleEdit("introduction")}
            disabled={isEditing !== "introduction"}
            className="disabled:cursor-not-allowed disabled:opacity-70"
          />
        </div>
          
        <Input
          label="Website"
          name="website"
          placeholder="Website URL을 입력해주세요."
          value={formData.socialLinks.find((link) => link.name === "website")?.url || ""}
          onChange={(e) => handleSocialLinkChange("website", e.target.value)}
          isEditable
          EditOnClick={() => isEditing === "website" ? handleCancelEdit() : handleEdit("website")}
          disabled={isEditing !== "website"}
          startAdornment={<Globe className="w-4 h-4" />}
          className="disabled:cursor-not-allowed disabled:opacity-70"
        />
        
        <Input
          label="Github"
          name="github"
          placeholder="Github URL을 입력해주세요."
          value={formData.socialLinks.find((link) => link.name === "github")?.url.split("/")[3] || ""}
          onChange={(e) => handleSocialLinkChange("github", e.target.value)}
          isEditable
          EditOnClick={() => isEditing === "github" ? handleCancelEdit() : handleEdit("github")}
          disabled={isEditing !== "github"}
          startAdornment={<FontAwesomeIcon icon={faGithub} />}
          className="disabled:cursor-not-allowed disabled:opacity-70"
        />

        <Input
          label="Linkedin"
          name="linkedin"
          placeholder="Linkedin URL을 입력해주세요."
          value={formData.socialLinks.find((link) => link.name === "linkedin")?.url.split("/")[4] || ""}
          onChange={(e) => handleSocialLinkChange("linkedin", e.target.value)}
          isEditable
          EditOnClick={() => isEditing === "linkedin" ? handleCancelEdit() : handleEdit("linkedin")}
          disabled={isEditing !== "linkedin"}
          startAdornment={<FontAwesomeIcon icon={faLinkedin} />}
          className="disabled:cursor-not-allowed disabled:opacity-70"
        />

        <Input
          label="Instagram"
          name="instagram"
          placeholder="Instagram URL을 입력해주세요."
          value={formData.socialLinks.find((link) => link.name === "instagram")?.url.split("/")[3] || ""}
          onChange={(e) => handleSocialLinkChange("instagram", e.target.value)}
          isEditable
          EditOnClick={() => isEditing === "instagram" ? handleCancelEdit() : handleEdit("instagram")}
          disabled={isEditing !== "instagram"}
          startAdornment={<FontAwesomeIcon icon={faInstagram} />}
          className="disabled:cursor-not-allowed disabled:opacity-70"
        />
      </div>
      
      {isEditing !== "none" && (
        <div className="flex justify-end">
          <button
            onClick={() => setIsEditing("none")}
            className="flex cursor-pointer active:scale-95"
          >
          <Badge
            content={
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                <span>프로필 편집</span>
              </div>
            }
            color={isDark ? 'white' : 'black'}
            isDark={isDark}
            className="!px-4 !py-2 !font-semibold"
          />
        </button>
      </div>
    )}
    </div>
  );
}