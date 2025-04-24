"use client";

import React, { useState, useEffect } from "react";
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
  faEdit,
  faSave,
  faCircleXmark,
  faCamera,
  faArrowLeft,
  faInfo,
  faToolbox,
  faLanguage,
  faCakeCandles,
  faLink
} from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin, faTwitter, faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { updateUserProfile } from "@/hooks/getMemberData";

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
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("intro");
  const [isLoading, setIsLoading] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [newSocialLink, setNewSocialLink] = useState<{ name: string; url: string }>({ name: "github", url: "" });
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

  useEffect(() => {
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
        socialLinks: user.socialLinks ? Object.entries(user.socialLinks[0] || {}).map(([name, url]) => ({ name, url: url || '' })) : [],
      });
    }
  }, [user]);

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
      setProfileData(prev => ({
        ...prev,
        socialLinks: [...prev.socialLinks, { ...newSocialLink }]
      }));
      setNewSocialLink({ name: "github", url: "" });
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
      console.log(profileData);
      setIsLoading(true);
      const response = await updateUserProfile(user?.id || 0, profileData);
      
      // Update the user data in the auth store with the response from the server
      if (response) {
        useAuthStore.getState().setUser(response);
      }
      
      setIsEditing(false);
      useAuthStore.getState().setAlert("프로필이 성공적으로 업데이트되었습니다.", "success");
      
      // The page refresh is no longer necessary since we're updating the state directly
      // but we'll keep it to ensure everything is synced properly
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("Error updating profile:", error);
      useAuthStore.getState().setAlert("프로필 업데이트 중 오류가 발생했습니다.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors"
            aria-label="뒤로 가기"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">내 프로필</h1>
        </div>
        <button
          onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors duration-200"
          disabled={isLoading}
        >
          <FontAwesomeIcon icon={isEditing ? faSave : faEdit} className="w-4 h-4" />
          {isEditing ? (isLoading ? "저장 중..." : "저장") : "수정"}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 h-32">
          <div className="absolute -bottom-12 left-8">
            {profileData && (
              <div className="relative">
                <div className="h-24 w-24 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                  <FontAwesomeIcon icon={faUser} className="text-gray-400 text-3xl" />
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1.5 shadow-md hover:bg-blue-700 transition-colors">
                    <FontAwesomeIcon icon={faCamera} className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="pt-16 pb-6 px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">기본 정보</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">이름</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faUser} className="text-gray-500 w-4 h-4" />
                      <span className="text-gray-800 dark:text-gray-200">{profileData.name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">이메일</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleChange}
                      readOnly
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faEnvelope} className="text-gray-500 w-4 h-4" />
                      <span className="text-gray-800 dark:text-gray-200">{profileData.email}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">역할</label>
                  {isEditing ? (
                    <select
                      name="role"
                      value={profileData.role}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    >
                      <option value="개발자">개발자</option>
                      <option value="디자이너">디자이너</option>
                      <option value="기획자">기획자</option>
                    </select>
                  ) : (
                    <div className="flex items-center gap-2">
                      {profileData.role === "개발자" && <FontAwesomeIcon icon={faCode} className="text-gray-500 w-4 h-4" />}
                      {profileData.role === "디자이너" && <FontAwesomeIcon icon={faPalette} className="text-gray-500 w-4 h-4" />}
                      {profileData.role === "기획자" && <FontAwesomeIcon icon={faFile} className="text-gray-500 w-4 h-4" />}
                      <span className="text-gray-800 dark:text-gray-200">{profileData.role}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">연락처</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="contactNumber"
                      value={profileData.contactNumber}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faPhone} className="text-gray-500 w-4 h-4" />
                      <span className="text-gray-800 dark:text-gray-200">{profileData.contactNumber}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">생년월일</label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="birthDate"
                      value={profileData.birthDate}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faCakeCandles} className="text-gray-500 w-4 h-4" />
                      <span className="text-gray-800 dark:text-gray-200">{profileData.birthDate}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">근무 시간</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">시작 시간</label>
                    {isEditing ? (
                      <input
                        type="time"
                        name="workingHours.start"
                        value={profileData.workingHours.start}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faClock} className="text-gray-500 w-4 h-4" />
                        <span className="text-gray-800 dark:text-gray-200">{profileData.workingHours.start}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">종료 시간</label>
                    {isEditing ? (
                      <input
                        type="time"
                        name="workingHours.end"
                        value={profileData.workingHours.end}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faClock} className="text-gray-500 w-4 h-4" />
                        <span className="text-gray-800 dark:text-gray-200">{profileData.workingHours.end}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">시간대</label>
                  {isEditing ? (
                    <select
                      name="workingHours.timezone"
                      value={profileData.workingHours.timezone}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    >
                      <option value="Asia/Seoul">한국 표준시 (KST)</option>
                      <option value="UTC">세계 표준시 (UTC)</option>
                      <option value="America/New_York">동부 표준시 (EST)</option>
                      <option value="America/Los_Angeles">태평양 표준시 (PST)</option>
                    </select>
                  ) : (
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faGlobe} className="text-gray-500 w-4 h-4" />
                      <span className="text-gray-800 dark:text-gray-200">
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
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">소셜 링크</label>
                  <div className="space-y-3">
                    {isEditing && (
                      <div className="flex gap-2 items-center">
                        <select
                          name="newSocialLink.name"
                          value={newSocialLink.name}
                          onChange={handleChange}
                          className="w-1/4 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        >
                          <option value="github">GitHub</option>
                          <option value="linkedin">LinkedIn</option>
                          <option value="twitter">Twitter</option>
                          <option value="facebook">Facebook</option>
                          <option value="instagram">Instagram</option>
                          <option value="website">Website</option>
                        </select>
                        <input
                          type="text"
                          name="newSocialLink.url"
                          value={newSocialLink.url}
                          onChange={handleChange}
                          placeholder="URL 입력"
                          className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        />
                        <button
                          onClick={addSocialLink}
                          className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          추가
                        </button>
                      </div>
                    )}

                    {profileData.socialLinks.length > 0 ? (
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
                            {isEditing ? (
                              <>
                                <input
                                  type="text"
                                  value={link.url}
                                  onChange={(e) => {
                                    const newLinks = [...profileData.socialLinks];
                                    newLinks[index].url = e.target.value;
                                    setProfileData({...profileData, socialLinks: newLinks});
                                  }}
                                  className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
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
                                className="text-blue-600 dark:text-blue-400 hover:underline"
                              >
                                {link.url || "링크 없음"}
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">등록된 소셜 링크가 없습니다.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-4 px-4">
            <button
              onClick={() => setActiveTab("intro")}
              className={`py-4 px-2 relative ${activeTab === "intro"
                  ? "text-blue-600 dark:text-blue-400 font-medium"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                }`}
            >
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faInfo} className="w-4 h-4" />
                <span>자기소개</span>
              </div>
              {activeTab === "intro" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("skills")}
              className={`py-4 px-2 relative ${activeTab === "skills"
                  ? "text-blue-600 dark:text-blue-400 font-medium"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                }`}
            >
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faToolbox} className="w-4 h-4" />
                <span>기술 스택</span>
              </div>
              {activeTab === "skills" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("languages")}
              className={`py-4 px-2 relative ${activeTab === "languages"
                  ? "text-blue-600 dark:text-blue-400 font-medium"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                }`}
            >
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faLanguage} className="w-4 h-4" />
                <span>사용 언어</span>
              </div>
              {activeTab === "languages" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400"></span>
              )}
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Introduction Tab */}
          {activeTab === "intro" && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">자기소개</h2>
              {isEditing ? (
                <textarea
                  name="introduction"
                  value={profileData.introduction}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 resize-none"
                  placeholder="자신에 대해 간략하게 소개해주세요."
                />
              ) : (
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {profileData.introduction || "자기소개가 없습니다."}
                </p>
              )}
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === "skills" && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">기술 스택</h2>
              <div className="space-y-4">
                {isEditing && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => handleKeyDown("skills", e)}
                      onCompositionStart={() => setIsComposing(true)}
                      onCompositionEnd={() => setIsComposing(false)}
                      placeholder="기술을 입력하고 Enter 키를 누르세요"
                      className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    />
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {profileData.skills.length > 0 ? (
                    profileData.skills.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-sm"
                      >
                        {skill}
                        {isEditing && (
                          <button onClick={() => removeSkill(skill)} className="text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-400 ml-1">
                            <FontAwesomeIcon icon={faCircleXmark} className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic">등록된 기술이 없습니다.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Languages Tab */}
          {activeTab === "languages" && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">사용 언어</h2>
              <div className="space-y-4">
                {isEditing && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      placeholder="언어 추가..."
                      className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      onKeyDown={(e) => handleKeyDown("languages", e)}
                      onCompositionStart={() => setIsComposing(true)}
                      onCompositionEnd={() => setIsComposing(false)}
                    />
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {profileData.languages.length > 0 ? (
                    profileData.languages.map((language, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 text-sm"
                      >
                        {language}
                        {isEditing && (
                          <button onClick={() => removeLanguage(language)} className="text-green-700 dark:text-green-300 hover:text-green-800 dark:hover:text-green-400 ml-1">
                            <FontAwesomeIcon icon={faCircleXmark} className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic">등록된 언어가 없습니다.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="flex justify-end mt-8 gap-4">
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            disabled={isLoading}
          >
            취소
          </button>
          <button
            onClick={handleSaveProfile}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "저장 중..." : "저장"}
          </button>
        </div>
      )}
    </div>
  );
}