import { Project } from "@/types/Project";
import { useEffect, useState } from "react";
import { updateProject } from "@/hooks/getProjectData";
import { useAuthStore } from "@/auth/authStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faPencil } from "@fortawesome/free-solid-svg-icons";
import Badge from "@/components/ui/Badge";
import { useTheme } from "@/contexts/ThemeContext";
import DatePicker from "@/components/ui/DatePicker";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import Select from "@/components/ui/Select";
import {
  Settings,
  Info,
  Users,
  Calendar,
  Tag,
  Signal,
  Lock,
} from "lucide-react";
import CancelBtn from "@/components/ui/button/CancelBtn";
import SubmitBtn from "@/components/ui/button/SubmitBtn";

interface GeneralSettingTabProps {
  project: Project;
}

export default function GeneralSettingTab({ project }: GeneralSettingTabProps) {
  const { isDark } = useTheme();
  const user = useAuthStore((state) => state.user);
  const [isEditing, setIsEditing] = useState<string>("none");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
    visibility: "public",
    tags: [] as string[],
    location: "",
    start_date: "",
    end_date: "",
    team_size: 0,
    project_type: "",
  });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // Add state for copy feedback
  const [copied, setCopied] = useState(false);

  // For new item inputs
  const [newTagItem, setNewTagItem] = useState("");

  // Reset form when project changes or edit mode is toggled off
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        description: project.description || "",
        status: project.status || "",
        visibility: project.visibility || "",
        tags: project.tags || [],
        location: project.location || "",
        start_date: project.start_date || "",
        end_date: project.end_date || "",
        team_size: project.team_size || 0,
        project_type: project.project_type || "",
      });
    }
  }, [project]);

  // Add copy to clipboard function
  const handleCopyCode = () => {
    if (project.id) {
      navigator.clipboard
        .writeText(project.id)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
        });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string | string[]) => {
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleAddTagItem = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTag = newTagItem.trim();
    if (!trimmedTag) return;

    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, trimmedTag],
    }));
    setNewTagItem("");
  };

  const handleRemoveTagItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
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

  // Helper to parse YYYY-MM-DD string to Date object (local timezone)
  const parseStringToDate = (dateString: string): Date | undefined => {
    if (!dateString) return undefined;
    const parts = dateString.split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed for Date constructor
      const day = parseInt(parts[2], 10);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        return new Date(year, month, day); // Interprets as local date
      }
    }
    return undefined;
  };

  const handleStartDateChange = (date: Date | undefined) => {
    setFormData((prevData) => ({
      ...prevData,
      start_date: date ? formatDateToString(date) : "",
    }));
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setFormData((prevData) => ({
      ...prevData,
      end_date: date ? formatDateToString(date) : "",
    }));
  };

  const handleEdit = (field: string) => {
    if (project.members.some((m) => m.user.id === user?.id && m.is_leader)) {
      setIsEditing(field);
      if (field !== "none") {
        useAuthStore.getState().setAlert("편집 모드로 전환되었습니다.", "info");
      } else {
        useAuthStore.getState().setAlert("편집 모드를 종료했습니다.", "info");
      }
    } else {
      useAuthStore
        .getState()
        .setAlert("프로젝트 리더와 관리자만 편집할 수 있습니다.", "warning");
    }
  };

  const handleCancel = () => {
    setIsEditing("none");
    useAuthStore.getState().setAlert("편집 모드를 종료했습니다.", "info");
    // Reset form to original values
    if (project) {
      setFormData({
        title: project.title || "",
        description: project.description || "",
        status: project.status || "",
        visibility: project.visibility || "",
        tags: project.tags || [],
        location: project.location || "",
        start_date: project.start_date || "",
        end_date: project.end_date || "",
        team_size: project.team_size || 0,
        project_type: project.project_type || "",
      });
    }
    // Clear new item inputs
    setNewTagItem("");
  };

  const handleSave = async () => {
    try {
      setSubmitStatus('submitting');
      if (!formData.title.trim()) {
        alert("프로젝트 이름을 입력해주세요.");
        return;
      }

      await updateProject(project.id, formData);
      useAuthStore
        .getState()
        .setAlert("프로젝트가 업데이트되었습니다.", "success");
      setIsEditing("none");
      setSubmitStatus('success');
    } catch (error) {
      console.error("Error saving project:", error);
      useAuthStore.getState().setAlert("저장 중 오류가 발생했습니다.", "error");
      setSubmitStatus('error');
    } finally {
      setSubmitStatus('idle');
    }
  };

  return (
    <div className="bg-component-background border border-component-border rounded-lg overflow-visible">
      <div className="relative">
        <div className="absolute inset-0 border-b border-component-border" />
        <div className="relative px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-400" />
            프로젝트 설정
          </h2>
        </div>
      </div>

      {/* Main content */}
      <div className="p-6">
        {isEditing !== "none" && (
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4 mb-8 text-indigo-400 flex items-start gap-3">
            <Info className="h-6 w-6 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">
                편집 모드에서 프로젝트 정보를 수정할 수 있습니다.
              </p>
              <p className="text-sm mt-1 opacity-80">
                모든 변경 사항은 저장 버튼을 눌러야 적용됩니다.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: Basic info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-component-secondary-background backdrop-blur-sm rounded-xl overflow-visible  border border-component-border">
              <div className="border-b border-component-border px-6 py-4 flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-text-primary">
                  기본 정보
                </h3>
              </div>
              <div className="p-6 space-y-5">
                <Input
                  label="참여 코드"
                  value={project.id}
                  onChange={handleChange}
                  readOnly
                  className="w-full !bg-component-background/50 cursor-not-allowed"
                  endAdornment={
                    <button
                      onClick={handleCopyCode}
                      className="text-text-secondary hover:text-text-primary transition-colors focus:outline-none ml-2 cursor-pointer"
                      title="코드 복사"
                    >
                      <FontAwesomeIcon icon={faCopy} />
                      {copied && (
                        <span className="absolute -mt-6 -ml-8 bg-gray-800 text-xs text-white px-2 py-1 rounded flex-wrap whitespace-nowrap">
                          복사됨!
                        </span>
                      )}
                    </button>
                  }
                  isEndAdornmentClickable
                />
                <Input
                  name="title"
                  label="프로젝트 이름"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full ${isEditing === "title"
                      ? "!bg-input-secondary-background"
                      : "!bg-component-background/50"
                    } disabled:cursor-not-allowed`}
                  disabled={isEditing !== "title"}
                  isEditable
                  EditOnClick={() =>
                    isEditing === "title" ? handleCancel() : handleEdit("title")
                  }
                />

                <TextArea
                  name="description"
                  label="프로젝트 설명"
                  value={formData.description}
                  onChange={handleChange}
                  className={`w-full ${isEditing === "description"
                      ? "!bg-input-secondary-background"
                      : "!bg-component-background/50"
                    } disabled:cursor-not-allowed`}
                  disabled={isEditing !== "description"}
                  isEditable
                  EditOnClick={() =>
                    isEditing === "description"
                      ? handleCancel()
                      : handleEdit("description")
                  }
                  rows={4}
                />
              </div>
            </div>

            <div className="bg-component-secondary-background backdrop-blur-sm rounded-xl overflow-visible  border border-component-border">
              <div className="border-b border-component-border px-6 py-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-text-primary">
                  팀 정보
                </h3>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    name="project_type"
                    label="프로젝트 유형"
                    value={formData.project_type}
                    onChange={handleChange}
                    className={`w-full ${isEditing === "project_type"
                        ? "!bg-input-secondary-background"
                        : "!bg-component-background/50"
                      } disabled:cursor-not-allowed`}
                    disabled={isEditing !== "project_type"}
                    isEditable
                    EditOnClick={() =>
                      isEditing === "project_type"
                        ? handleCancel()
                        : handleEdit("project_type")
                    }
                  />

                  <Input
                    type="number"
                    onWheel={(e) => e.currentTarget.blur()}
                    name="team_size"
                    label="팀 규모"
                    value={formData.team_size}
                    onChange={handleChange}
                    className={`w-full ${isEditing === "team_size"
                        ? "!bg-input-secondary-background"
                        : "!bg-component-background/50"
                      } [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:cursor-not-allowed`}
                    disabled={isEditing !== "team_size"}
                    isEditable
                    EditOnClick={() =>
                      isEditing === "team_size"
                        ? handleCancel()
                        : handleEdit("team_size")
                    }
                    min={1}
                    max={100}
                  />
                </div>

                <Input
                  name="location"
                  label="위치"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full ${isEditing === "location"
                      ? "!bg-input-secondary-background"
                      : "!bg-component-background/50"
                    } disabled:cursor-not-allowed`}
                  disabled={isEditing !== "location"}
                  isEditable
                  EditOnClick={() =>
                    isEditing === "location"
                      ? handleCancel()
                      : handleEdit("location")
                  }
                />
              </div>
            </div>

            <div className="bg-component-secondary-background backdrop-blur-sm rounded-xl overflow-visible  border border-component-border">
              <div className="border-b border-component-border px-6 py-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-400" />
                <h3 className="text-lg font-semibold text-text-primary">
                  일정 정보
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <DatePicker
                    label="시작일"
                    value={
                      formData.start_date
                        ? parseStringToDate(formData.start_date)
                        : undefined
                    }
                    onChange={handleStartDateChange}
                    placeholder="시작일 선택"
                    className={`w-full ${isEditing === "start_date" ? "!bg-input-secondary-background" : "!bg-component-background/50"} disabled:cursor-not-allowed disabled:opacity-100`}
                    isEditable
                    disabled={isEditing !== "start_date"}
                    EditOnClick={() =>
                      isEditing === "start_date"
                        ? handleCancel()
                        : handleEdit("start_date")
                    }
                    calendarPosition="top"
                  />

                  <DatePicker
                    label="종료일"
                    value={
                      formData.end_date
                        ? parseStringToDate(formData.end_date)
                        : undefined
                    }
                    onChange={handleEndDateChange}
                    placeholder="종료일 선택"
                    className={`w-full ${isEditing === "end_date" ? "!bg-input-secondary-background" : "!bg-component-background/50"} disabled:cursor-not-allowed disabled:opacity-100`}
                    isEditable
                    disabled={isEditing !== "end_date"}
                    EditOnClick={() =>
                      isEditing === "end_date"
                        ? handleCancel()
                        : handleEdit("end_date")
                    }
                    calendarPosition="top"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right column: Skills, roles, access */}
          <div className="space-y-6">
            <div className="bg-component-secondary-background backdrop-blur-sm rounded-xl overflow-visible  border border-component-border">
              <div className="border-b border-component-border px-6 py-4 flex items-center gap-2">
                <Tag className="h-5 w-5 text-blue-400" />
                <div className="flex items-center gap-2 group relative">
                  <h3 className="text-lg font-semibold text-text-primary">
                    태그
                  </h3>
                  <FontAwesomeIcon
                    size="xs"
                    icon={faPencil}
                    className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    onClick={() =>
                      isEditing === "tags"
                        ? handleEdit("none")
                        : handleEdit("tags")
                    }
                  />
                </div>
              </div>
              <div className="p-6">
                <div
                  className={`bg-component-background/50 rounded-lg p-3 min-h-[120px] border ${isEditing === "tags"
                      ? "border-blue-900/30"
                      : "border-component-border"
                    }`}
                >
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.length > 0 ? (
                      formData.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          content={tag}
                          color="blue"
                          isEditable={isEditing === "tags" ? true : false}
                          onRemove={() => handleRemoveTagItem(index)}
                          isDark={isDark}
                        />
                      ))
                    ) : (
                      <span className="text-text-secondary text-sm">
                        태그가 없습니다.
                      </span>
                    )}
                  </div>
                </div>

                {isEditing === "tags" && (
                  <div className="mt-3">
                    <form onSubmit={handleAddTagItem}>
                      <Input
                        name="newTagItem"
                        value={newTagItem}
                        onChange={(e) => setNewTagItem(e.target.value)}
                        placeholder="태그 추가"
                        className="!bg-component-background/50"
                      />
                    </form>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-component-secondary-background backdrop-blur-sm rounded-xl overflow-visible border border-component-border">
              <div className="border-b border-component-border px-6 py-4 flex items-center gap-2">
                <Signal className="h-5 w-5 text-yellow-400" />
                <div className="flex items-center gap-2 group relative">
                  <h3 className="text-lg font-semibold text-text-primary">
                    프로젝트 상태
                  </h3>
                  <FontAwesomeIcon
                    size="xs"
                    icon={faPencil}
                    className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    onClick={() =>
                      isEditing === "status"
                        ? handleEdit("none")
                        : handleEdit("status")
                    }
                  />
                </div>
              </div>
              <div className="p-6">
                <Select
                  options={[
                    { name: "status", value: "planning", label: "계획중" },
                    { name: "status", value: "in_progress", label: "진행중" },
                    { name: "status", value: "completed", label: "완료" },
                    { name: "status", value: "on_hold", label: "보류중" },
                  ]}
                  value={formData.status}
                  onChange={(value) => handleSelectChange("status", value as string)}
                  className={`w-full ${isEditing === "status"
                      ? "!bg-input-secondary-background"
                      : "!bg-component-background/50"
                    }`}
                  isEditable
                  disabled={isEditing !== "status"}
                  EditOnClick={() =>
                    isEditing === "status"
                      ? handleCancel()
                      : handleEdit("status")
                  }
                />
                <div className="mt-3 flex items-start gap-2 text-text-secondary">
                  <Info className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm">
                    프로젝트의 현재 진행 상태를 나타냅니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-component-secondary-background backdrop-blur-sm rounded-xl overflow-visible border border-component-border">
              <div className="border-b border-component-border px-6 py-4 flex items-center gap-2">
                <Lock className="h-5 w-5 text-yellow-400" />
                <div className="flex items-center gap-2 group relative">
                  <h3 className="text-lg font-semibold text-text-primary">
                    접근 설정
                  </h3>
                  <FontAwesomeIcon
                    size="xs"
                    icon={faPencil}
                    className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    onClick={() =>
                      isEditing === "visibility"
                        ? handleEdit("none")
                        : handleEdit("visibility")
                    }
                  />
                </div>
              </div>
              <div className="p-6 space-y-2">
                <Select
                  options={[
                    { name: "visibility", value: "public", label: "공개" },
                    { name: "visibility", value: "private", label: "비공개" },
                  ]}
                  value={formData.visibility}
                  onChange={(value) => handleSelectChange("visibility", value as string)}
                  className={`w-full ${isEditing === "visibility"
                      ? "!bg-input-secondary-background"
                      : "!bg-component-background/50"
                    }`}
                  isEditable
                  disabled={isEditing !== "visibility"}
                  EditOnClick={() =>
                    isEditing === "visibility"
                      ? handleCancel()
                      : handleEdit("visibility")
                  }
                />
                <div className="mt-3 flex items-start gap-2 text-text-secondary">
                  <Info className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm">
                    공개 프로젝트는 모든 사용자가 볼 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isEditing !== "none" && (
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-component-border">
            <CancelBtn handleCancel={handleCancel} withIcon />
            <SubmitBtn
              submitStatus={submitStatus}
              onClick={handleSave}
              fit
              withIcon
              buttonText="저장하기"
            />
          </div>
        )}
      </div>
    </div>
  );
}
