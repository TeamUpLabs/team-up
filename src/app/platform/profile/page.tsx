"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAuthStore } from "@/auth/authStore";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faClock,
  faGlobe,
  faCode,
  faPalette,
  faFile,
  faCircleXmark,
  faCamera,
  faArrowLeft,
  faInfo,
  faShieldHalved,
  faLanguage,
  faCakeCandles,
  faLink,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin, faTwitter, faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { updateUserProfile, updateUserProfileImage } from "@/hooks/getMemberData";
import Badge from "@/components/ui/Badge";
import ImageCropModal from "@/components/platform/profile/ImageCropModal";
import Select from "@/components/ui/Select";

interface WorkingHours {
  start: string;
  end: string;
  timezone: string;
}

interface SocialLinks {
  name: string;
  url: string;
}

interface ProfileData {
  name: string;
  email: string;
  role: string;
  contactNumber: string;
  birthDate: string;
  introduction: string;
  skills: string[];
  languages: string[];
  workingHours: WorkingHours;
  socialLinks: SocialLinks[];
}

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [isEditing, setIsEditing] = useState<string>("none");
  const [activeTab, setActiveTab] = useState("intro");
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isComposing, setIsComposing] = useState(false);
  const [newSocialLink, setNewSocialLink] = useState<{ name: string; url: string }>({ name: "", url: "" });
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [originalProfileData, setOriginalProfileData] = useState<ProfileData | null>(null);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    email: "",
    role: "",
    contactNumber: "",
    birthDate: "",
    introduction: "",
    skills: [],
    languages: [],
    workingHours: {
      start: "",
      end: "",
      timezone: "",
    },
    socialLinks: [],
  });

  const [newSkill, setNewSkill] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropImage, setCropImage] = useState('');

  useEffect(() => {
    setIsDataLoading(true);

    const fetchProfileData = async () => {
      if (user) {
        setProfileData({
          name: user.name || "",
          email: user.email || "",
          role: user.role || "",
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
          socialLinks: user.socialLinks || [],
        });
      }
    };

    fetchProfileData().then(() => {
      setIsDataLoading(false);
    });
  }, [user]);

  const handleSelectChange = (name: string, value: string | string[]) => {
    setProfileData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");

      if (parent === "workingHours") {
        setProfileData(prev => ({
          ...prev,
          workingHours: {
            ...prev.workingHours,
            [child]: value,
          },
        }));
      } else if (parent === "newSocialLink") {
        setNewSocialLink(prev => ({
          ...prev,
          [child]: value,
        }));
      }
    } else {
      setProfileData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEdit = (name: string) => {
    if (name !== "none" && isEditing === "none") {
      setOriginalProfileData({ ...profileData });
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
      setProfileData(originalProfileData);
    }

    setIsEditing("none");
    setOriginalProfileData(null);
    useAuthStore.getState().setAlert("편집 모드를 종료했습니다.", "info");
  };

  const handleKeyDown = (type: "skills" | "languages", e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isComposing) {
      e.preventDefault();

      if (type === "skills") {
        const trimmedInput = newSkill.trim();
        if (trimmedInput && !profileData.skills.includes(trimmedInput)) {
          const updatedSkills = [...profileData.skills, trimmedInput];
          setProfileData((prev) => ({
            ...prev,
            skills: updatedSkills,
          }));
          setNewSkill("");
        }
      } else if (type === "languages") {
        const trimmedInput = newLanguage.trim();
        if (trimmedInput && !profileData.languages.includes(trimmedInput)) {
          const updatedLanguages = [...profileData.languages, trimmedInput];
          setProfileData((prev) => ({
            ...prev,
            languages: updatedLanguages,
          }));
          setNewLanguage("");
        }
      }
    }
  }

  const removeSkill = (skill: string) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const removeLanguage = (language: string) => {
    setProfileData((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l !== language),
    }));
  };

  const addSocialLink = () => {
    if (newSocialLink.name && newSocialLink.url) {
      // URL 형식이 없으면 https:// 추가
      let url = newSocialLink.url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }

      const newLink = {
        name: newSocialLink.name,
        url: url
      };

      setProfileData(prev => ({
        ...prev,
        socialLinks: [...prev.socialLinks, newLink]
      }));

      setNewSocialLink({ name: "", url: "" });
    } else {
      console.log("Cannot add link: missing name or url", newSocialLink);
    }
  };

  const removeSocialLink = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      const response = await updateUserProfile(user?.id || 0, profileData);

      // Update the user data in the auth store with the response from the server
      if (response) {
        useAuthStore.getState().setUser(response);
      }

      setIsEditing("none");
      setOriginalProfileData(null);
      useAuthStore.getState().setAlert("프로필이 성공적으로 업데이트되었습니다.", "success");
    } catch (error) {
      console.error("Error updating profile:", error);
      useAuthStore.getState().setAlert("프로필 업데이트 중 오류가 발생했습니다.", "error");
    } finally {
      setIsLoading(false);
    }
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

  // Skeleton component for text fields
  const SkeletonField = () => (
    <div className="animate-pulse flex items-center gap-2">
      <div className="w-4 h-4 bg-component-secondary-background rounded-full"></div>
      <div className="h-4 bg-component-secondary-background rounded w-3/4"></div>
    </div>
  );

  // Skeleton for social links
  const SkeletonSocialLink = () => (
    <div className="animate-pulse flex items-center gap-2">
      <div className="w-4 h-4 bg-component-secondary-background rounded-full"></div>
      <div className="h-4 bg-component-secondary-background rounded w-40"></div>
    </div>
  );

  // Skeleton for skill/language tags
  const SkeletonTag = () => (
    <div className="animate-pulse h-6 bg-component-secondary-background rounded-full w-20"></div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-component-secondary-background hover:bg-component-tertiary-background border border-component-border text-text-secondary transition-colors"
            aria-label="뒤로 가기"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h1 className="text-2xl font-bold text-text-primary">내 프로필</h1>
        </div>
      </div>

      <div className="bg-component-background border border-component-border rounded-xl shadow-sm mb-8">
        <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 h-32">
          <div className="absolute -bottom-12 left-8">
            <div className="relative">
              <div className="h-24 w-24 relative rounded-full border-4 border-component-border bg-component-secondary-background flex items-center justify-center overflow-hidden group cursor-pointer" onClick={handleProfilePictureClick}>
                {isDataLoading ? (
                  <div className="animate-pulse w-full h-full bg-component-secondary-background"></div>
                ) : user?.profileImage ? (
                  <>
                    <Image
                      src={user.profileImage}
                      alt="Profile"
                      className="w-full h-full object-fit rounded-full"
                      quality={100}
                      fill
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <FontAwesomeIcon icon={faCamera} className="text-white text-xl" />
                    </div>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faUser} className="text-text-secondary text-3xl" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <FontAwesomeIcon icon={faCamera} className="text-white text-xl" />
                    </div>
                  </>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleProfilePictureChange}
              />
              {isEditing === "profileImage" && (
                <div
                  className="absolute bottom-0 right-0 bg-component-secondary-background w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-component-tertiary-background transition-all"
                  onClick={handleProfilePictureClick}
                >
                  <FontAwesomeIcon icon={faCamera} className="text-text-secondary w-4 h-4" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-16 pb-6 px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-text-primary">기본 정보</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 group relative">
                    <label className="block text-sm font-medium text-text-secondary">이름</label>
                    <FontAwesomeIcon
                      icon={faPencil}
                      size="xs"
                      className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      onClick={() => isEditing === "name" ? handleCancelEdit() : handleEdit("name")}
                    />
                  </div>
                  {isDataLoading ? (
                    <SkeletonField />
                  ) : isEditing === "name" ? (
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleChange}
                      className="w-full rounded-md border border-component-border px-3 py-2 bg-component-secondary-background text-text-primary"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faUser} className="text-text-secondary" size="sm" />
                      <span className="text-text-primary">{profileData.name}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 group relative">
                    <label className="block text-sm font-medium text-text-secondary">이메일</label>
                    <FontAwesomeIcon
                      icon={faPencil}
                      size="xs"
                      className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      onClick={() => isEditing === "email" ? handleCancelEdit() : handleEdit("email")}
                    />
                  </div>
                  {isDataLoading ? (
                    <SkeletonField />
                  ) : isEditing === "email" ? (
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleChange}
                      readOnly={isEditing !== "email"}
                      className="w-full rounded-md border border-component-border px-3 py-2 bg-component-secondary-background text-text-primary"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faEnvelope} className="text-text-secondary" size="sm" />
                      <span className="text-text-primary">{profileData.email}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 group relative">
                    <label className="block text-sm font-medium text-text-secondary">역할</label>
                    <FontAwesomeIcon
                      icon={faPencil}
                      size="xs"
                      className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      onClick={() => isEditing === "role" ? handleCancelEdit() : handleEdit("role")}
                    />
                  </div>
                  {isDataLoading ? (
                    <SkeletonField />
                  ) : isEditing === "role" ? (
                    <Select
                      options={[
                        { name: "role", value: "개발자", label: "개발자" },
                        { name: "role", value: "디자이너", label: "디자이너" },
                        { name: "role", value: "기획자", label: "기획자" },
                      ]}
                      value={profileData.role}
                      onChange={(value) => handleSelectChange("role", value as string)}
                      className="w-full rounded-md border border-component-border px-3 py-2 bg-component-secondary-background text-text-primary"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      {profileData.role === "개발자" && <FontAwesomeIcon icon={faCode} className="text-text-secondary" size="sm" />}
                      {profileData.role === "디자이너" && <FontAwesomeIcon icon={faPalette} className="text-text-secondary" size="sm" />}
                      {profileData.role === "기획자" && <FontAwesomeIcon icon={faFile} className="text-text-secondary" size="sm" />}
                      <span className="text-text-primary">{profileData.role}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 group relative">
                    <label className="block text-sm font-medium text-text-secondary">연락처</label>
                    <FontAwesomeIcon
                      icon={faPencil}
                      size="xs"
                      className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      onClick={() => isEditing === "contactNumber" ? handleCancelEdit() : handleEdit("contactNumber")}
                    />
                  </div>
                  {isDataLoading ? (
                    <SkeletonField />
                  ) : isEditing === "contactNumber" ? (
                    <input
                      type="tel"
                      name="contactNumber"
                      value={profileData.contactNumber}
                      onChange={handleChange}
                      className="w-full rounded-md border border-component-border px-3 py-2 bg-component-secondary-background text-text-primary"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faPhone} className="text-text-secondary" size="sm" />
                      <span className="text-text-primary">{profileData.contactNumber}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 group relative">
                    <label className="block text-sm font-medium text-text-secondary">생년월일</label>
                    <FontAwesomeIcon
                      icon={faPencil}
                      size="xs"
                      className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      onClick={() => isEditing === "birthDate" ? handleCancelEdit() : handleEdit("birthDate")}
                    />
                  </div>
                  {isDataLoading ? (
                    <SkeletonField />
                  ) : isEditing === "birthDate" ? (
                    <input
                      type="date"
                      name="birthDate"
                      value={profileData.birthDate}
                      onChange={handleChange}
                      className="w-full rounded-md border border-component-border px-3 py-2 bg-component-secondary-background text-text-primary"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faCakeCandles} className="text-text-secondary" size="sm" />
                      <span className="text-text-primary">{profileData.birthDate}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-text-primary">근무 시간</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center gap-2 group relative">
                      <label className="block text-sm font-medium text-text-secondary">시작 시간</label>
                      <FontAwesomeIcon
                        icon={faPencil}
                        size="xs"
                        className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        onClick={() => isEditing === "workingHours.start" ? handleCancelEdit() : handleEdit("workingHours.start")}
                      />
                    </div>
                    {isDataLoading ? (
                      <SkeletonField />
                    ) : isEditing === "workingHours.start" ? (
                      <input
                        type="time"
                        name="workingHours.start"
                        value={profileData.workingHours.start}
                        onChange={handleChange}
                        className="w-full rounded-md border border-component-border px-3 py-2 bg-component-secondary-background text-text-primary"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faClock} className="text-text-secondary" size="sm" />
                        <span className="text-text-primary">{profileData.workingHours.start}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 group relative">
                      <label className="block text-sm font-medium text-text-secondary">종료 시간</label>
                      <FontAwesomeIcon
                        icon={faPencil}
                        size="xs"
                        className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        onClick={() => isEditing === "workingHours.end" ? handleCancelEdit() : handleEdit("workingHours.end")}
                      />
                    </div>
                    {isDataLoading ? (
                      <SkeletonField />
                    ) : isEditing === "workingHours.end" ? (
                      <input
                        type="time"
                        name="workingHours.end"
                        value={profileData.workingHours.end}
                        onChange={handleChange}
                        className="w-full rounded-md border border-component-border px-3 py-2 bg-component-secondary-background text-text-primary"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faClock} className="text-text-secondary" size="sm" />
                        <span className="text-text-primary">{profileData.workingHours.end}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 group relative">
                    <label className="block text-sm font-medium text-text-secondary mb-1">시간대</label>
                    <FontAwesomeIcon
                      icon={faPencil}
                      size="xs"
                      className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      onClick={() => isEditing === "workingHours.timezone" ? handleCancelEdit() : handleEdit("workingHours.timezone")}
                    />
                  </div>
                  {isDataLoading ? (
                    <SkeletonField />
                  ) : isEditing === "workingHours.timezone" ? (
                    <select
                      name="workingHours.timezone"
                      value={profileData.workingHours.timezone}
                      onChange={handleChange}
                      className="w-full rounded-md border border-component-border px-3 py-2 bg-component-secondary-background text-text-primary"
                    >
                      <option value="Asia/Seoul">한국 표준시 (KST)</option>
                      <option value="UTC">세계 표준시 (UTC)</option>
                      <option value="America/New_York">동부 표준시 (EST)</option>
                      <option value="America/Los_Angeles">태평양 표준시 (PST)</option>
                    </select>
                  ) : (
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faGlobe} className="text-text-secondary" size="sm" />
                      <span className="text-text-primary">
                        {profileData.workingHours.timezone === "Asia/Seoul" ? "한국 표준시 (KST)" :
                          profileData.workingHours.timezone === "UTC" ? "세계 표준시 (UTC)" :
                            profileData.workingHours.timezone === "America/New_York" ? "동부 표준시 (EST)" :
                              profileData.workingHours.timezone === "America/Los_Angeles" ? "태평양 표준시 (PST)" :
                                profileData.workingHours.timezone}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 group relative">
                    <label className="block text-sm font-medium text-text-secondary mb-1">소셜 링크</label>
                    <FontAwesomeIcon
                      icon={faPencil}
                      size="xs"
                      className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      onClick={() => isEditing === "socialLinks" ? handleCancelEdit() : handleEdit("socialLinks")}
                    />
                  </div>
                  <div className="space-y-3">
                    {isEditing === "socialLinks" && (
                      <div className="flex gap-2 items-center mb-2">
                        {/* <select
                          name="newSocialLink.name"
                          value={newSocialLink.name}
                          onChange={handleChange}
                          className="w-1/4 rounded-md border border-component-border px-3 py-2 bg-component-secondary-background text-text-primary"
                        >
                          <option value="">소셜 선택</option>
                          <option value="github">GitHub</option>
                          <option value="linkedin">LinkedIn</option>
                          <option value="twitter">Twitter</option>
                          <option value="facebook">Facebook</option>
                          <option value="instagram">Instagram</option>
                          <option value="website">Website</option>
                        </select> */}
                        <Select
                          options={[
                            { name: "newSocialLink.name", value: "github", label: "GitHub" },
                            { name: "newSocialLink.name", value: "linkedin", label: "LinkedIn" },
                            { name: "newSocialLink.name", value: "twitter", label: "Twitter" },
                            { name: "newSocialLink.name", value: "facebook", label: "Facebook" },
                            { name: "newSocialLink.name", value: "instagram", label: "Instagram" },
                            { name: "newSocialLink.name", value: "website", label: "Website" },
                          ]}
                          value={newSocialLink.name}
                          onChange={(value) => setNewSocialLink(prev => ({ ...prev, name: value as string }))}
                          className="rounded-md border border-component-border px-3 py-2 bg-component-secondary-background text-text-primary"
                        />
                        <input
                          type="text"
                          name="newSocialLink.url"
                          value={newSocialLink.url}
                          onChange={handleChange}
                          placeholder="URL 입력 (https://...)"
                          className="flex-1 rounded-md border border-component-border px-3 py-2 bg-component-secondary-background text-text-primary"
                        />
                        <button
                          onClick={addSocialLink}
                          disabled={!newSocialLink.url}
                          className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                        >
                          추가
                        </button>
                      </div>
                    )}

                    {isDataLoading ? (
                      <div className="space-y-2">
                        <SkeletonSocialLink />
                        <SkeletonSocialLink />
                      </div>
                    ) : profileData.socialLinks.length > 0 ? (
                      <div className="space-y-2">
                        {profileData.socialLinks.map((link, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <FontAwesomeIcon
                              icon={
                                link.name === "github" ? faGithub :
                                  link.name === "linkedin" ? faLinkedin :
                                    link.name === "twitter" ? faTwitter :
                                      link.name === "facebook" ? faFacebook :
                                        link.name === "instagram" ? faInstagram :
                                          link.name === "website" ? faGlobe :
                                            faLink
                              }
                              className="text-gray-500 w-4 h-4"
                            />
                            {isEditing === "socialLinks" ? (
                              <>
                                <input
                                  type="text"
                                  value={link.url}
                                  onChange={(e) => {
                                    const newLinks = [...profileData.socialLinks];
                                    newLinks[index].url = e.target.value;
                                    setProfileData({ ...profileData, socialLinks: newLinks });
                                  }}
                                  className="flex-1 rounded-md border border-component-border px-3 py-2 bg-component-secondary-background text-text-primary"
                                />
                                <button
                                  onClick={() => removeSocialLink(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <FontAwesomeIcon icon={faCircleXmark} className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:underline"
                              >
                                {(() => {
                                  try {
                                    // URL에서 도메인만 표시
                                    const url = new URL(link.url);
                                    return url.hostname;
                                  } catch {
                                    // URL 파싱 실패 시 원래 URL 그대로 표시
                                    return link.url || "링크 없음";
                                  }
                                })()}
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-text-secondary">등록된 소셜 링크가 없습니다.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-component-background border border-component-border rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="border-b border-component-border">
          <div className="flex space-x-4 px-4">
            <button
              onClick={() => setActiveTab("intro")}
              className={`py-4 px-2 relative ${activeTab === "intro"
                ? "text-blue-400 font-medium"
                : "text-text-secondary hover:text-text-primary"
                }`}
            >
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faInfo} />
                <span>자기소개</span>
              </div>
              {activeTab === "intro" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("skills")}
              className={`py-4 px-2 relative ${activeTab === "skills"
                ? "text-blue-400 font-medium"
                : "text-text-secondary hover:text-text-primary"
                }`}
            >
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faShieldHalved} />
                <span>전문 분야</span>
              </div>
              {activeTab === "skills" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("languages")}
              className={`py-4 px-2 relative ${activeTab === "languages"
                ? "text-blue-400 font-medium"
                : "text-text-secondary hover:text-text-primary"
                }`}
            >
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faLanguage} />
                <span>사용 언어</span>
              </div>
              {activeTab === "languages" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400"></span>
              )}
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Introduction Tab */}
          {activeTab === "intro" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 group relative">
                <h2 className="text-xl font-semibold text-text-primary">자기소개</h2>
                <FontAwesomeIcon
                  icon={faPencil}
                  className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={() => isEditing === "introduction" ? handleCancelEdit() : handleEdit("introduction")}
                />
              </div>
              {isDataLoading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-component-secondary-background rounded w-full"></div>
                  <div className="h-4 bg-component-secondary-background rounded w-5/6"></div>
                  <div className="h-4 bg-component-secondary-background rounded w-4/6"></div>
                </div>
              ) : isEditing === "introduction" ? (
                <textarea
                  name="introduction"
                  value={profileData.introduction}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-md border border-component-border px-3 py-2 bg-component-secondary-background text-text-primary resize-none"
                  placeholder="자신에 대해 간략하게 소개해주세요."
                />
              ) : (
                <p className="text-text-primary whitespace-pre-wrap">
                  {profileData.introduction || "자기소개가 없습니다."}
                </p>
              )}
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === "skills" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 group relative">
                <h2 className="text-xl font-semibold text-text-primary">전문 분야</h2>
                <FontAwesomeIcon
                  icon={faPencil}
                  className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={() => isEditing === "skills" ? handleCancelEdit() : handleEdit("skills")}
                />
              </div>
              <div className="space-y-4">
                {isEditing === "skills" && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => handleKeyDown("skills", e)}
                      onCompositionStart={() => setIsComposing(true)}
                      onCompositionEnd={() => setIsComposing(false)}
                      placeholder="전문 분야를 입력하고 Enter 키를 누르세요"
                      className="flex-1 rounded-md border border-component-border px-3 py-2 bg-component-secondary-background text-text-primary"
                    />
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {isDataLoading ? (
                    <>
                      <SkeletonTag />
                      <SkeletonTag />
                      <SkeletonTag />
                      <SkeletonTag />
                      <SkeletonTag />
                    </>
                  ) : profileData.skills.length > 0 ? (
                    profileData.skills.map((skill, index) => (
                      isEditing ? (
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
                    ))
                  ) : (
                    <p className="text-text-secondary italic">등록된 기술이 없습니다.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Languages Tab */}
          {activeTab === "languages" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 group relative">
                <h2 className="text-xl font-semibold text-text-primary">사용 언어</h2>
                <FontAwesomeIcon
                  icon={faPencil}
                  className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={() => isEditing === "languages" ? handleCancelEdit() : handleEdit("languages")}
                />
              </div>
              <div className="space-y-4">
                {isEditing === "languages" && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      placeholder="언어를 입력하고 Enter 키를 누르세요"
                      className="flex-1 rounded-md border border-component-border px-3 py-2 bg-component-secondary-background text-text-primary"
                      onKeyDown={(e) => handleKeyDown("languages", e)}
                      onCompositionStart={() => setIsComposing(true)}
                      onCompositionEnd={() => setIsComposing(false)}
                    />
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {isDataLoading ? (
                    <>
                      <SkeletonTag />
                      <SkeletonTag />
                      <SkeletonTag />
                    </>
                  ) : profileData.languages.length > 0 ? (
                    profileData.languages.map((language, index) => (
                      isEditing ? (
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
                    ))
                  ) : (
                    <p className="text-text-secondary italic">등록된 언어가 없습니다.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {isEditing !== "none" && (
        <div className="flex justify-end mt-8 gap-4">
          <button
            onClick={handleCancelEdit}
            className="px-4 py-2 rounded-lg border border-component-border text-white bg-cancel-button-background hover:bg-cancel-button-background-hover transition-colors"
            disabled={isLoading}
          >
            취소
          </button>
          <button
            onClick={handleSaveProfile}
            className="px-4 py-2 rounded-lg bg-point-color-indigo hover:bg-point-color-indigo-hover text-white transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "저장 중..." : "저장"}
          </button>
        </div>
      )}

      {/* Image Crop Modal */}
      {showCropModal && (
        <ImageCropModal
          image={cropImage}
          onClose={handleCloseModal}
          onCropComplete={handleCropComplete}
          loading={isLoading}
        />
      )}
    </div>
  );
}