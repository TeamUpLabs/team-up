import { Project } from "@/types/Project";
import { useEffect, useState } from "react";
import { updateProject } from "@/hooks/getProjectData";
import { useAuthStore } from "@/auth/authStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

interface GeneralSettingTabProps {
  project: Project;
}

export default function GeneralSettingTab({ project }: GeneralSettingTabProps) {
  const user = useAuthStore(state => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: [] as string[],
    roles: [] as string[],
    startDate: "",
    endDate: "",
    teamSize: 1,
    location: "",
    projectType: "",
    visibility: "public"
  });

  // Add state for copy feedback
  const [copied, setCopied] = useState(false);

  // For new item inputs
  const [newTechItem, setNewTechItem] = useState("");
  const [newRoleItem, setNewRoleItem] = useState("");

  // Reset form when project changes or edit mode is toggled off
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        description: project.description || "",
        techStack: project.techStack || [],
        roles: project.roles || [],
        startDate: project.startDate || "",
        endDate: project.endDate || "",
        teamSize: project.teamSize || 1,
        location: project.location || "",
        projectType: project.projectType || "",
        visibility: "public" // Assuming visibility is not in Project type
      });
    }
  }, [project, isEditing]);

  // Add copy to clipboard function
  const handleCopyCode = () => {
    if (project.id) {
      navigator.clipboard.writeText(project.id)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddTechItem = () => {
    if (!newTechItem.trim()) return;

    setFormData(prev => ({
      ...prev,
      techStack: [...prev.techStack, newTechItem.trim()]
    }));
    setNewTechItem("");
  };

  const handleRemoveTechItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack.filter((_, i) => i !== index)
    }));
  };

  const handleAddRoleItem = () => {
    if (!newRoleItem.trim()) return;

    setFormData(prev => ({
      ...prev,
      roles: [...prev.roles, newRoleItem.trim()]
    }));
    setNewRoleItem("");
  };

  const handleRemoveRoleItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.filter((_, i) => i !== index)
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent, addHandler: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addHandler();
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form to original values
    if (project) {
      setFormData({
        title: project.title || "",
        description: project.description || "",
        techStack: project.techStack || [],
        roles: project.roles || [],
        startDate: project.startDate || "",
        endDate: project.endDate || "",
        teamSize: project.teamSize || 1,
        location: project.location || "",
        projectType: project.projectType || "",
        visibility: "public"
      });
    }
    // Clear new item inputs
    setNewTechItem("");
    setNewRoleItem("");
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      // Validate required fields
      if (!formData.title.trim()) {
        alert("프로젝트 이름을 입력해주세요.");
        return;
      }

      await updateProject(project.id, formData);
      useAuthStore.getState().setAlert("프로젝트가 업데이트되었습니다.", "success");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("Error saving project:", error);
      useAuthStore.getState().setAlert("저장 중 오류가 발생했습니다.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
      {/* Header with background gradient */}
      <div className="relative">
        <div className="absolute inset-0 border-b border-gray-700/50" />
        <div className="relative px-8 py-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            프로젝트 설정
          </h2>
          {!isEditing ? (
            <button
              onClick={() => {
                if (project.leader.id === user?.id) {
                  setIsEditing(true);
                } else {
                  useAuthStore.getState().setAlert("프로젝트 리더만 편집할 수 있습니다.", "warning");
                }
              }}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-md transition-all shadow-md backdrop-blur-sm flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              편집하기
            </button>
          ) : (
            <div className="px-4 py-2 bg-amber-400/20 text-amber-400 rounded-full font-medium shadow-md backdrop-blur-sm">
              편집 모드
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="p-8">
        {isEditing && (
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4 mb-8 text-indigo-200 flex items-start gap-3">
            <svg className="h-6 w-6 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-medium">편집 모드에서 프로젝트 정보를 수정할 수 있습니다.</p>
              <p className="text-sm mt-1 opacity-80">모든 변경 사항은 저장 버튼을 눌러야 적용됩니다.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: Basic info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-gray-700/50">
              <div className="border-b border-gray-700/50 px-6 py-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <h3 className="text-lg font-semibold text-white">기본 정보</h3>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label htmlFor="code" className="inline-block text-gray-300 mb-2 font-medium">참여 코드</label>
                  <div className="flex items-center w-full border bg-gray-900/70 border-gray-700 rounded-lg px-4 py-3">
                    <input
                      type="text"
                      name="code"
                      value={project.id}
                      onChange={handleChange}
                      readOnly
                      className="text-white outline-none transition-all cursor-not-allowed flex-grow"
                    />
                    <button
                      onClick={handleCopyCode}
                      className="text-gray-300 hover:text-white transition-colors focus:outline-none ml-2"
                      title="코드 복사"
                    >
                      <FontAwesomeIcon icon={faCopy} />
                      {copied && <span className="absolute -mt-8 -ml-3 bg-gray-800 text-xs text-white px-2 py-1 rounded">복사됨!</span>}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="inline-block text-gray-300 mb-2 font-medium">프로젝트 이름</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={`w-full border ${isEditing ? 'bg-gray-800/70 border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' : 'bg-gray-900/70 border-gray-700'} rounded-lg px-4 py-3 text-white outline-none transition-all ${!isEditing && 'cursor-not-allowed'}`}
                  />
                </div>

                <div>
                  <label className="inline-block text-gray-300 mb-2 font-medium">프로젝트 설명</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    rows={4}
                    className={`w-full border ${isEditing ? 'bg-gray-800/70 border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' : 'bg-gray-900/70 border-gray-700'} rounded-lg px-4 py-3 text-white outline-none transition-all ${!isEditing && 'cursor-not-allowed'} resize-none`}
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-gray-700/50">
              <div className="border-b border-gray-700/50 px-6 py-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                <h3 className="text-lg font-semibold text-white">팀 정보</h3>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="inline-block text-gray-300 mb-2 font-medium">프로젝트 유형</label>
                    <input
                      type="text"
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      className={`w-full border ${isEditing ? 'bg-gray-800/70 border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' : 'bg-gray-900/70 border-gray-700'} rounded-lg px-4 py-3 text-white outline-none transition-all ${!isEditing && 'cursor-not-allowed'}`}
                    />
                  </div>

                  <div>
                    <label className="inline-block text-gray-300 mb-2 font-medium">팀 규모</label>
                    <input
                      type="number"
                      name="teamSize"
                      value={formData.teamSize}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      min={1}
                      className={`w-full border ${isEditing ? 'bg-gray-800/70 border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' : 'bg-gray-900/70 border-gray-700'} rounded-lg px-4 py-3 text-white outline-none transition-all ${!isEditing && 'cursor-not-allowed'} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                    />
                  </div>
                </div>

                <div>
                  <label className="inline-block text-gray-300 mb-2 font-medium">위치</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={`w-full border ${isEditing ? 'bg-gray-800/70 border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' : 'bg-gray-900/70 border-gray-700'} rounded-lg px-4 py-3 text-white outline-none transition-all ${!isEditing && 'cursor-not-allowed'}`}
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-gray-700/50">
              <div className="border-b border-gray-700/50 px-6 py-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <h3 className="text-lg font-semibold text-white">일정 정보</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="inline-block text-gray-300 mb-2 font-medium">시작일</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      className={`w-full border ${isEditing ? 'bg-gray-800/70 border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' : 'bg-gray-900/70 border-gray-700'} rounded-lg px-4 py-3 text-white outline-none transition-all ${!isEditing && 'cursor-not-allowed'}`}
                    />
                  </div>

                  <div>
                    <label className="inline-block text-gray-300 mb-2 font-medium">종료일</label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      className={`w-full border ${isEditing ? 'bg-gray-800/70 border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' : 'bg-gray-900/70 border-gray-700'} rounded-lg px-4 py-3 text-white outline-none transition-all ${!isEditing && 'cursor-not-allowed'}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column: Skills, roles, access */}
          <div className="space-y-6">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-gray-700/50">
              <div className="border-b border-gray-700/50 px-6 py-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <h3 className="text-lg font-semibold text-white">기술 스택</h3>
              </div>
              <div className="p-6">
                <div className={`bg-gray-900/40 rounded-lg p-3 min-h-[120px] border ${isEditing ? 'border-blue-900/30' : 'border-gray-800'}`}>
                  <div className="flex flex-wrap gap-2">
                    {formData.techStack.length > 0 ? (
                      formData.techStack.map((tech, index) => (
                        <div key={index} className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-md text-sm flex items-center gap-1">
                          {tech}
                          {isEditing && (
                            <button
                              onClick={() => handleRemoveTechItem(index)}
                              className="text-blue-300 hover:text-white ml-1 focus:outline-none"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm italic">기술 스택이 없습니다.</span>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-3">
                    <div className="flex">
                      <input
                        type="text"
                        value={newTechItem}
                        onChange={(e) => setNewTechItem(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, handleAddTechItem)}
                        placeholder="기술 스택 추가"
                        className="flex-grow bg-gray-800/70 border border-gray-700 rounded-l-lg px-4 py-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                      <button
                        onClick={handleAddTechItem}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r-lg flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-gray-700/50">
              <div className="border-b border-gray-700/50 px-6 py-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                <h3 className="text-lg font-semibold text-white">필요 역할</h3>
              </div>
              <div className="p-6">
                <div className={`bg-gray-900/40 rounded-lg p-3 min-h-[120px] border ${isEditing ? 'border-purple-900/30' : 'border-gray-800'}`}>
                  <div className="flex flex-wrap gap-2">
                    {formData.roles.length > 0 ? (
                      formData.roles.map((role, index) => (
                        <div key={index} className="px-3 py-1 bg-purple-900/50 text-purple-300 rounded-md text-sm flex items-center gap-1">
                          {role}
                          {isEditing && (
                            <button
                              onClick={() => handleRemoveRoleItem(index)}
                              className="text-purple-300 hover:text-white ml-1 focus:outline-none"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm italic">필요 역할이 없습니다.</span>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-3">
                    <div className="flex">
                      <input
                        type="text"
                        value={newRoleItem}
                        onChange={(e) => setNewRoleItem(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, handleAddRoleItem)}
                        placeholder="역할 추가"
                        className="flex-grow bg-gray-800/70 border border-gray-700 rounded-l-lg px-4 py-2.5 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                      />
                      <button
                        onClick={handleAddRoleItem}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 rounded-r-lg flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-gray-700/50">
              <div className="border-b border-gray-700/50 px-6 py-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <h3 className="text-lg font-semibold text-white">접근 설정</h3>
              </div>
              <div className="p-6">
                <label className="block text-gray-300 mb-2 font-medium">공개 여부</label>
                <select
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full border ${isEditing ? 'bg-gray-800/70 border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' : 'bg-gray-900/70 border-gray-700'} rounded-lg px-4 py-3 text-white outline-none transition-all ${!isEditing && 'cursor-not-allowed'}`}
                >
                  <option value="public">공개</option>
                  <option value="private">비공개</option>
                </select>
                <div className="mt-3 flex items-start gap-2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm">공개 프로젝트는 모든 사용자가 볼 수 있습니다.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-700/50">
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2 shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className={`px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all flex items-center gap-2 shadow-lg ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
              저장하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
