"use client";

import Badge from "@/components/ui/Badge";
import { Camera, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  updateUserProfileImage,
  updateUserProfile,
} from "@/hooks/getMemberData";
import { User as UserType, blankUser } from "@/types/User";
import { useAuthStore } from "@/auth/authStore";
import ImageCropModal from "@/components/platform/profile/ImageCropModal";
import { formatDateToString, parseStringToDate } from "@/utils/dateUtils";
import { Input } from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import DatePicker from "@/components/ui/DatePicker";
import { TextArea } from "@/components/ui/TextArea";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedin,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { Globe } from "lucide-react";
import CancelBtn from "@/components/ui/button/CancelBtn";
import SubmitBtn from "@/components/ui/button/SubmitBtn";
import FollowListModal from "@/components/FollowListModal";

interface PersonalInfoProps {
  user: UserType;
  setUser: React.Dispatch<React.SetStateAction<UserType>>;
}

export default function PersonalInfo({ user, setUser }: PersonalInfoProps) {
  const [isEditing, setIsEditing] = useState<string>("none");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(user.profile_image);
  const [originalProfileData, setOriginalProfileData] = useState<UserType | null>(user);
  const [newSkill, setNewSkill] = useState<string>("");
  const [newLanguage, setNewLanguage] = useState<string>("");
  const [isComposing, setIsComposing] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [formData, setFormData] = useState<UserType>(blankUser);
  const [followListModalOpen, setFollowListModalOpen] = useState(false);
  const [whatToFollow, setWhatToFollow] = useState<string>("");

  useEffect(() => {
    setFormData(user);
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
      setFormData(originalProfileData);
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

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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

    const response = await updateUserProfileImage(
      user?.id || 0,
      croppedImageUrl
    );

    if (user) {
      useAuthStore.getState().setUser({
        ...user,
        profile_image: response,
      });
    }

    setShowCropModal(false);
    useAuthStore
      .getState()
      .setAlert("프로필 이미지가 업데이트되었습니다.", "success");
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

  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBirthDateChange = (date: Date | undefined) => {
    setFormData((prevData) => ({
      ...prevData,
      birth_date: date ? formatDateToString(date) : "",
    }));
  };

  const handleKeyDown = (
    type: "tech_stacks" | "languages",
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && !isComposing) {
      e.preventDefault();
      if (type === "tech_stacks") {
        const trimmedInput = newSkill.trim();
        if (
          trimmedInput &&
          !formData.tech_stacks.some((stack) => stack.tech === trimmedInput)
        ) {
          const updatedTechStacks = [
            ...formData.tech_stacks,
            { tech: trimmedInput, level: 1 },
          ];
          setFormData((prev) => ({
            ...prev,
            tech_stacks: updatedTechStacks,
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
  };

  const removeSkill = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      tech_stacks: prev.tech_stacks.filter((s) => s.tech !== tech),
    }));
  };
  const removeLanguage = (language: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l !== language),
    }));
  };

  const handleTimeZoneChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      collaboration_preference: {
        ...prev.collaboration_preference,
        available_time_zone: value,
      },
    }));
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData((prev) => {
      // Check if the platform already exists in social_links
      const linkExists = prev.social_links.some(link => link.platform === platform);

      if (linkExists) {
        // Update existing platform's URL
        return {
          ...prev,
          social_links: prev.social_links.map((link) =>
            link.platform === platform ? { ...link, url: value } : link
          ),
        };
      } else {
        // Add new platform with URL
        return {
          ...prev,
          social_links: [
            ...prev.social_links,
            { platform, url: value }
          ],
        };
      }
    });
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

  // Format minutes to HH:MM string
  const formatMinutes = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  };

  // Convert numeric time value (hours * 100 + minutes) to HH:MM string
  const formatNumericTime = (timeValue: number | string | undefined): string => {
    if (!timeValue) return "";

    if (typeof timeValue === 'number') {
      const hours = Math.floor(timeValue / 100);
      const minutes = timeValue % 100;
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    }

    return timeValue.toString();
  };

  // Convert time string or number to minutes since midnight for easier comparison
  const toMinutes = (time: string | number | undefined): number => {
    if (!time) return 0;

    // If time is a number (stored format: hours * 100 + minutes)
    if (typeof time === 'number') {
      const hours = Math.floor(time / 100);
      const minutes = time % 100;
      return hours * 60 + minutes;
    }

    // If time is a string (HH:MM format)
    if (typeof time === 'string') {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + (minutes || 0);
    }

    return 0;
  };

  // Generate time options from 00:00 to 23:00 with 30-minute intervals
  const generateTimeOptions = () => {
    const options = [];
    const totalHoursInDay = 24;

    for (let hour = 0; hour < totalHoursInDay; hour++) {
      const timeString = formatMinutes(hour * 60);
      options.push({
        name: "time",
        value: timeString,
        label: timeString,
      });
    }
    return options;
  };

  const TIME_OPTIONS = generateTimeOptions();

  // Filter end time options to be after the selected start time
  const getEndTimeOptions = () => {
    if (!formData.collaboration_preference.work_hours_start) return [];
    const startMinutes = toMinutes(
      formData.collaboration_preference.work_hours_start
    );
    return TIME_OPTIONS.filter(
      (option) => toMinutes(option.value) > startMinutes
    );
  };

  const handleSkillLevelChange = (index: number, value: string) => {
    const updatedTechStacks = [...formData.tech_stacks];
    updatedTechStacks[index].level = parseInt(value);
    setFormData((prev) => ({
      ...prev,
      tech_stacks: updatedTechStacks,
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setSubmitStatus("submitting");
      const response = await updateUserProfile(formData);
      if (response) {
        setUser({
          ...user,
          ...formData,
        })
        useAuthStore.getState().setAlert("프로필이 업데이트되었습니다.", "success");
        setIsEditing("none");
        setSubmitStatus("success");
      }
    } catch (error) {
      console.error("프로필 업데이트 중 오류:", error);
      useAuthStore.getState().setAlert("프로필 업데이트 중 오류가 발생했습니다.", "error");
      setSubmitStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowListModalOpen = (whatToFollow: string) => {
    setFollowListModalOpen(true);
    setWhatToFollow(whatToFollow)
  };

  const handleFollowListModalClose = () => {
    setFollowListModalOpen(false);
    setWhatToFollow("")
  };

  return (
    <div className="flex flex-col gap-4 border border-component-border rounded-lg p-6">
      <div className="flex items-center gap-4">
        {user?.profile_image ? (
          <div
            className="h-24 w-24 relative rounded-full border-4 border-component-border bg-component-secondary-background flex items-center justify-center overflow-hidden group cursor-pointer"
            onClick={handleProfilePictureClick}
          >
            <Image
              src={user.profile_image}
              alt="Profile"
              className="w-full h-full object-fit rounded-full"
              quality={100}
              width={100}
              height={100}
              priority
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="text-white text-xl" />
            </div>
          </div>
        ) : (
          <div
            className="h-24 w-24 relative rounded-full border-4 border-component-border bg-component-secondary-background flex items-center justify-center overflow-hidden group cursor-pointer"
            onClick={handleProfilePictureClick}
          >
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
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <div className="flex items-center gap-2 text-sm">
              <div 
                className="flex flex-row items-center gap-1 cursor-pointer"
                onClick={() => handleFollowListModalOpen("following")}
              >
                <span>{user?.following.length}</span>
                <span>팔로우</span>
              </div>
              <div 
                className="flex flex-row items-center gap-1 cursor-pointer"
                onClick={() => handleFollowListModalOpen("followers")}
              >
                <span>{user?.followers.length}</span>
                <span>팔로워</span>
              </div>
            </div>
            <Badge
              content={`${user?.auth_provider == "github" ? "Github와" : "Google과"} 연동됨`}
              color="violet"
              className="!px-2 !py-1 !text-xs"
            />
          </div>
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
          EditOnClick={() =>
            isEditing === "name" ? handleCancelEdit() : handleEdit("name")
          }
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
          EditOnClick={() =>
            isEditing === "email" ? handleCancelEdit() : handleEdit("email")
          }
          disabled={isEditing !== "email"}
          className="disabled:cursor-not-allowed disabled:opacity-70"
        />

        <Input
          label="연락처"
          name="phone"
          placeholder="연락처를 입력해주세요."
          isRequired
          value={formData.phone}
          onChange={handleOnChange}
          isEditable
          EditOnClick={() =>
            isEditing === "phone" ? handleCancelEdit() : handleEdit("phone")
          }
          disabled={isEditing !== "phone"}
          className="disabled:cursor-not-allowed disabled:opacity-70"
        />

        <DatePicker
          value={
            formData.birth_date
              ? parseStringToDate(formData.birth_date)
              : undefined
          }
          onChange={handleBirthDateChange}
          label="생년월일"
          isRequired
          isEditable
          EditOnClick={() =>
            isEditing === "birth_date"
              ? handleCancelEdit()
              : handleEdit("birth_date")
          }
          disabled={isEditing !== "birth_date"}
          className="disabled:cursor-not-allowed disabled:opacity-70 disabled:text-text-secondary"
        />

        <Select
          label="시간대"
          value={formData.collaboration_preference.available_time_zone}
          onChange={(value) => handleTimeZoneChange(value as string)}
          options={[
            {
              name: "collaboration_preference.available_time_zone",
              value: "Asia/Seoul",
              label: "한국 표준시 (KST)",
            },
            {
              name: "collaboration_preference.available_time_zone",
              value: "UTC",
              label: "세계 표준시 (UTC)",
            },
            {
              name: "collaboration_preference.available_time_zone",
              value: "America/New_York",
              label: "동부 표준시 (EST)",
            },
            {
              name: "collaboration_preference.available_time_zone",
              value: "America/Los_Angeles",
              label: "태평양 표준시 (PST)",
            },
          ]}
          isRequired
          disabled={
            isEditing !== "collaboration_preference.available_time_zone"
          }
          isEditable
          EditOnClick={() =>
            isEditing === "collaboration_preference.available_time_zone"
              ? handleCancelEdit()
              : handleEdit("collaboration_preference.available_time_zone")
          }
          dropDownClassName="!w-full"
        />

        <div className="grid grid-cols-2 gap-2">
          <Select
            options={TIME_OPTIONS}
            value={formatNumericTime(formData.collaboration_preference.work_hours_start)}
            onChange={(value) => {
              handleWorkingHoursChange("start", value as string);
              // If end time is before new start time, reset it
              if (
                formData.collaboration_preference.work_hours_end &&
                toMinutes(formData.collaboration_preference.work_hours_end) <=
                toMinutes(value as string)
              ) {
                handleWorkingHoursChange("end", "");
              }
            }}
            placeholder="시작 시간"
            isRequired
            disabled={isEditing !== "collaboration_preference.work_hours_start"}
            isEditable
            EditOnClick={() =>
              isEditing === "collaboration_preference.work_hours_start"
                ? handleCancelEdit()
                : handleEdit("collaboration_preference.work_hours_start")
            }
            label="시작 시간"
          />
          <Select
            options={getEndTimeOptions()}
            value={formatNumericTime(formData.collaboration_preference.work_hours_end)}
            onChange={(value) =>
              handleWorkingHoursChange("end", value as string)
            }
            placeholder={
              formData.collaboration_preference.work_hours_start
                ? "종료 시간"
                : "시작 시간을 먼저 선택"
            }
            isRequired
            disabled={isEditing !== "collaboration_preference.work_hours_end"}
            isEditable
            EditOnClick={() =>
              isEditing === "collaboration_preference.work_hours_end"
                ? handleCancelEdit()
                : handleEdit("collaboration_preference.work_hours_end")
            }
            label="종료 시간"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Input
            label="기술"
            name="tech_stacks"
            placeholder="기술을 입력해주세요."
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            isEditable
            EditOnClick={() =>
              isEditing === "tech_stacks"
                ? handleCancelEdit()
                : handleEdit("tech_stacks")
            }
            disabled={isEditing !== "tech_stacks"}
            onKeyDown={(e) => handleKeyDown("tech_stacks", e)}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            className="disabled:cursor-not-allowed disabled:opacity-70"
          />
          <div className="flex flex-wrap gap-2">
            {formData.tech_stacks.map((stack, index) =>
              isEditing === "tech_stacks" ? (
                <Badge
                  key={index}
                  content={
                    <span className="flex items-center flex-wrap gap-2">
                      {stack.tech}
                      <Select
                        options={[
                          { name: "tech_stacks", value: "0", label: "초급" },
                          { name: "tech_stacks", value: "1", label: "중급" },
                          { name: "tech_stacks", value: "2", label: "고급" },
                        ]}
                        value={stack.level.toString()}
                        onChange={(value) => handleSkillLevelChange(index, value as string)}
                        isEditable
                        EditOnClick={() =>
                          isEditing === "tech_stacks"
                            ? handleCancelEdit()
                            : handleEdit("tech_stacks")
                        }
                        disabled={isEditing !== "tech_stacks"}
                        autoWidth
                        likeBadge
                        color="blue"
                        className="!px-2 !py-1"
                      />
                    </span>
                  }
                  color="blue"
                  isEditable={isEditing === "tech_stacks"}
                  onRemove={() => removeSkill(stack.tech)}
                />
              ) : (
                <Badge
                  key={index}
                  content={
                    <span>
                      {stack.tech} {stack.level === 0 ? "초급" : stack.level === 1 ? "중급" : "고급"}
                    </span>
                  }
                  color="blue"
                />
              )
            )}
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
            EditOnClick={() =>
              isEditing === "languages"
                ? handleCancelEdit()
                : handleEdit("languages")
            }
            disabled={isEditing !== "languages"}
            onKeyDown={(e) => handleKeyDown("languages", e)}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            className="disabled:cursor-not-allowed disabled:opacity-70"
          />
          <div className="flex flex-wrap gap-2">
            {formData.languages.map((language, index) =>
              isEditing === "languages" ? (
                <Badge
                  key={index}
                  content={language}
                  color="green"
                  isEditable={isEditing === "languages"}
                  onRemove={() => removeLanguage(language)}
                />
              ) : (
                <Badge
                  key={index}
                  content={language}
                  color="green"
                />
              )
            )}
          </div>
        </div>

        <div className="col-span-2">
          <TextArea
            label="소개글"
            name="bio"
            placeholder="소개글을 입력해주세요."
            value={formData.bio}
            onChange={handleOnChange}
            isEditable
            EditOnClick={() =>
              isEditing === "bio" ? handleCancelEdit() : handleEdit("bio")
            }
            disabled={isEditing !== "bio"}
            className="disabled:cursor-not-allowed disabled:opacity-70"
          />
        </div>

        <Input
          label="Website"
          name="website"
          placeholder="Website URL을 입력해주세요."
          value={
            formData.social_links.find((link) => link.platform === "website")?.url || ""
          }
          onChange={(e) => handleSocialLinkChange("website", e.target.value)}
          isEditable
          EditOnClick={() =>
            isEditing === "website" ? handleCancelEdit() : handleEdit("website")
          }
          disabled={isEditing !== "website"}
          startAdornment={<Globe className="w-4 h-4" />}
          className="disabled:cursor-not-allowed disabled:opacity-70"
        />

        <Input
          label="Github"
          name="github"
          placeholder="Github URL을 입력해주세요."
          value={
            isEditing === "github" ? formData.social_links.find((link) => link.platform === "github")?.url : formData.social_links.find((link) => link.platform === "github")?.url.split("/")[3] || ""
          }
          onChange={(e) => handleSocialLinkChange("github", e.target.value)}
          isEditable
          EditOnClick={() =>
            isEditing === "github" ? handleCancelEdit() : handleEdit("github")
          }
          disabled={isEditing !== "github"}
          startAdornment={<FontAwesomeIcon icon={faGithub} />}
          className="disabled:cursor-not-allowed disabled:opacity-70"
        />

        <Input
          label="Linkedin"
          name="linkedin"
          placeholder="Linkedin URL을 입력해주세요."
          value={
            formData.social_links
              .find((link) => link.platform === "linkedin")
              ?.url.split("/")[4] || ""
          }
          onChange={(e) => handleSocialLinkChange("linkedin", e.target.value)}
          isEditable
          EditOnClick={() =>
            isEditing === "linkedin"
              ? handleCancelEdit()
              : handleEdit("linkedin")
          }
          disabled={isEditing !== "linkedin"}
          startAdornment={<FontAwesomeIcon icon={faLinkedin} />}
          className="disabled:cursor-not-allowed disabled:opacity-70"
        />

        <Input
          label="Instagram"
          name="instagram"
          placeholder="Instagram URL을 입력해주세요."
          value={
            formData.social_links
              .find((link) => link.platform === "instagram")
              ?.url.split("/")[3] || ""
          }
          onChange={(e) => handleSocialLinkChange("instagram", e.target.value)}
          isEditable
          EditOnClick={() =>
            isEditing === "instagram"
              ? handleCancelEdit()
              : handleEdit("instagram")
          }
          disabled={isEditing !== "instagram"}
          startAdornment={<FontAwesomeIcon icon={faInstagram} />}
          className="disabled:cursor-not-allowed disabled:opacity-70"
        />
      </div>

      {isEditing !== "none" && (
        <div className="flex gap-2 justify-end">
          <CancelBtn handleCancel={() => setIsEditing("none")} withIcon />
          <SubmitBtn
            onClick={handleSubmit}
            buttonText="저장"
            submitStatus={submitStatus}
            withIcon
            fit
          />
        </div>
      )}
      <FollowListModal 
        isOpen={followListModalOpen} 
        onClose={handleFollowListModalClose} 
        followList={whatToFollow === "following" ? user.following : user.followers} 
        whatToFollow={whatToFollow}
      />
    </div>
  );
}
