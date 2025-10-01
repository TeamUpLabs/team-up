"use client";

import ModalTemplete from "@/components/ModalTemplete";
import { IssueData } from "@/types/github/IssueData";
import { Flag } from "flowbite-react-icons/outline";
import { useState, useCallback } from "react";
import { Input } from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import DatePicker from "@/components/ui/DatePicker";
import SubmitBtn from "@/components/ui/button/SubmitBtn";
import MarkdownEditor from "@/components/ui/MarkdownEditor";
import { useProject } from "@/contexts/ProjectContext";
import { useAuthStore } from "@/auth/authStore";
import { formatDateToString, parseStringToDate } from "@/utils/dateUtils";
import Badge from "@/components/ui/Badge";
import AssigneeSelect from "@/components/project/AssigneeSelect";
import { createMilestone } from "@/hooks/getMilestoneData";
import { MilestoneCreateFormData, blankMilestoneCreateFormData } from "@/types/MileStone";

interface IssueToMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  issueData: IssueData;
}

export default function IssueToMilestoneModal({ isOpen, onClose, issueData }: IssueToMilestoneModalProps) {
  const { project } = useProject();
  const user = useAuthStore((state) => state.user);
  const [formData, setFormData] = useState<MilestoneCreateFormData>(blankMilestoneCreateFormData);
  const [tagsInput, setTagsInput] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [statusError, setStatusError] = useState(false);
  const [priorityError, setPriorityError] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = useCallback((value: string) => {
    setFormData((prev) => {
      if (prev.description === value) {
        return prev;
      }
      return { ...prev, description: value };
    });
  }, []);

  const handleSelectChange = (name: string, value: string | string[]) => {
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleStartDateChange = (date: Date | undefined) => {
    setFormData(prevData => ({
      ...prevData,
      start_date: date ? formatDateToString(date) : "",
    }));
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setFormData(prevData => ({
      ...prevData,
      due_date: date ? formatDateToString(date) : "",
    }));
  };

  const handleKeyDown = (type: "tags", e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isComposing) {
      e.preventDefault();

      const trimmedInput = tagsInput.trim();
      if (trimmedInput && !formData.tags.includes(trimmedInput)) {
        const updatedTags = [...formData.tags, trimmedInput];
        setFormData((prev) => ({ ...prev, tags: updatedTags }));
        setTagsInput("");
      }
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  const toggleAssignee = (memberId: number) => {
    setFormData((prev) => {
      if (prev.assignee_ids.includes(memberId)) {
        return {
          ...prev,
          assignee_ids: prev.assignee_ids.filter((id) => id !== memberId),
        };
      } else {
        return {
          ...prev,
          assignee_ids: [...prev.assignee_ids, memberId],
        };
      }
    });
  };

  const isAssigned = (memberId: number) => {
    return formData.assignee_ids.includes(memberId);
  };

  const handleSubmit = async () => {
    let hasError = false;

    if (!project?.id) {
      console.error("Project ID is missing. Cannot create milestone.")
      useAuthStore.getState().setAlert("프로젝트 정보를 찾을 수 없습니다. 페이지를 새로고침하거나 문제가 지속되면 관리자에게 문의해주세요.", "error")
      return;
    }

    if (formData.due_date === "") {
      setDateError(true);
      hasError = true;
    } else {
      setDateError(false);
    }

    if (formData.status === "") {
      setStatusError(true);
      hasError = true;
    } else {
      setStatusError(false);
    }

    if (formData.priority === "") {
      setPriorityError(true);
      hasError = true;
    } else {
      setPriorityError(false);
    }

    if (formData.assignee_ids.length === 0) {
      useAuthStore.getState().setAlert("최소 한 명의 담당자는 필요합니다.", "error");
      return;
    }

    if (hasError) {
      return;
    }

    if (project?.id) {
      try {
        setSubmitStatus('submitting');
        await createMilestone(project.id || "", {
          ...formData,
          title: issueData.title,
          description: issueData.body,
          start_date: issueData.created_at.split("T")[0],
          tags: issueData.labels.map((label) => label.name),
          created_by: user?.id || 0,
          project_id: project.id,
          assignee_ids: formData.assignee_ids.map((id) => id as number),
        });
        useAuthStore.getState().setAlert("마일스톤이 성공적으로 생성되었습니다.", "success");
        setSubmitStatus('success');

        setTimeout(() => {
          onClose();
        }, 1000);
      } catch (error) {
        console.error(error);
        setSubmitStatus('error');
        useAuthStore.getState().setAlert("마일스톤 생성에 실패했습니다. 관리자에게 문의해주세요.", "error");
      } finally {
        setTimeout(() => {
          setSubmitStatus('idle');
        }, 1000);
      }
    }
  };

  const modalHeader = (
    <div className="flex items-center space-x-3">
      <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary-100">
        <Flag
          className="text-text-primary text-lg"
        />
      </div>
      <div>
        <h3 className="text-xl font-bold text-text-primary">
          마일스톤 변환
        </h3>
        <p className="text-sm text-point-color-indigo mt-0.5">
          이슈를 마일스톤으로 변환합니다.
        </p>
      </div>
    </div>
  )

  const modalFooter = (
    <div className="flex justify-end">
      <SubmitBtn
        submitStatus={submitStatus}
        onClick={handleSubmit}
        buttonText="마일스톤 생성"
        successText="생성 완료"
        errorText="생성 실패"
      />
    </div>
  )
  return (
    <ModalTemplete header={modalHeader} footer={modalFooter} isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <Input
          label="마일스톤 이름"
          name="title"
          value={formData.title}
          onChange={handleChange}
          isRequired
        />
        <MarkdownEditor
          label="설명"
          value={formData.description}
          onChange={handleDescriptionChange}
        />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Select
              label="상태"
              isRequired
              value={formData.status}
              onChange={(e) => handleSelectChange("status", e)}
              options={[
                { name: "status", value: "not-started", label: "준비" },
                { name: "status", value: "in-progress", label: "진행중" },
                { name: "status", value: "done", label: "완료" },
              ]}
              dropDownClassName="!w-full"
              placeholder="상태를 선택해주세요"
            />
            {statusError && (
              <p className="text-red-500 text-sm mt-2">상태를 선택해주세요.</p>
            )}
          </div>
          <div className="space-y-2">
            <Select
              label="우선순위"
              isRequired
              value={formData.priority}
              onChange={(e) => handleSelectChange("priority", e)}
              options={[
                { name: "priority", value: "low", label: "낮음" },
                { name: "priority", value: "medium", label: "중간" },
                { name: "priority", value: "high", label: "높음" },
              ]}
              dropDownClassName="!w-full"
              placeholder="우선순위를 선택해주세요"
            />
            {priorityError && (
              <p className="text-red-500 text-sm mt-2">우선순위를 선택해주세요.</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <DatePicker
            value={formData.start_date ? parseStringToDate(formData.start_date) : undefined}
            onChange={handleStartDateChange}
            label="시작일"
            isRequired
          />
          <div className="space-y-2">
            <DatePicker
              value={formData.due_date ? parseStringToDate(formData.due_date) : undefined}
              onChange={handleEndDateChange}
              minDate={formData.start_date ? parseStringToDate(formData.start_date) : undefined}
              label="종료일"
              isRequired
            />
            {dateError && (
              <p className="text-red-500 text-sm mt-2">종료일을 선택해주세요.</p>
            )}
          </div>
        </div>

        <Input
          label="태그"
          name="tags"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          onKeyDown={(e) => handleKeyDown("tags", e)}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          className="w-full px-3 py-2 rounded-md bg-input-background border border-input-border text-text-secondary focus:outline-none focus:ring-1 focus:ring-point-color-indigo focus:border-transparent transition-all duration-200 hover:border-input-border-hover"
          placeholder="태그를 입력하고 Enter 키를 누르세요"
        />

        <div className="mt-2 flex flex-wrap gap-2">
          {formData.tags.map((tag, index) => (
            <Badge
              key={index}
              content={tag}
              color="pink"
              isEditable={true}
              onRemove={() => handleRemoveTag(tag)}
            />
          ))}
        </div>

        <AssigneeSelect
          selectedAssignee={formData.assignee_ids}
          assignee={project?.members?.map((member) => member.user) || []}
          toggleAssignee={toggleAssignee}
          isAssigned={isAssigned}
          label="선택된 담당자"
        />
      </div>
    </ModalTemplete>
  )
}