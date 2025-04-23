import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faCheck, faUser } from "@fortawesome/free-solid-svg-icons";
import { useProject } from "@/contexts/ProjectContext";
import { createMilestone } from "@/hooks/getMilestoneData";
import { useAuthStore } from "@/auth/authStore";

interface MilestoneCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MilestoneCreateModal({ isOpen, onClose }: MilestoneCreateModalProps) {
  const { project } = useProject();
  const [formData, setFormData] = useState({
    project_id: project?.id,
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "",
    priority: "",
    tags: [] as string[],
    assignee_id: [] as number[],
  });
  const [tagsInput, setTagsInput] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [statusError, setStatusError] = useState(false);
  const [priorityError, setPriorityError] = useState(false);

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      setDateError(new Date(formData.endDate) < new Date(formData.startDate));
    } else {
      setDateError(false);
    }
  }, [formData.startDate, formData.endDate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    let hasError = false;
    
    if (dateError) {
      hasError = true;
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
    
    if (hasError) {
      return;
    }
    
    if (project?.id) {
      try {
        const formattedData = {
          ...formData,
          project_id: project.id,
        };
        
        await createMilestone(formattedData);
        useAuthStore.getState().setAlert('마일스톤이 성공적으로 생성되었습니다.', 'success');
        window.location.reload();
      } catch (error) {
        console.error(error);
        useAuthStore.getState().setAlert('마일스톤 생성에 실패했습니다. 관리자에게 문의해주세요.', 'error');
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Reset errors when user changes values
    if (name === "status") {
      setStatusError(false);
    }
    if (name === "priority") {
      setPriorityError(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isComposing) {
      e.preventDefault();

      const trimmedInput = tagsInput.trim();
      if (trimmedInput && !formData.tags.includes(trimmedInput)) {
        const updatedTags = [...formData.tags, trimmedInput];
        setFormData({ ...formData, tags: updatedTags });
        setTagsInput("");
      }
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  }

  const toggleAssignee = (memberId: number) => {
    setFormData(prev => {
      if (prev.assignee_id.includes(memberId)) {
        return {
          ...prev,
          assignee_id: prev.assignee_id.filter(id => id !== memberId)
        };
      } else {
        return {
          ...prev,
          assignee_id: [...prev.assignee_id, memberId]
        };
      }
    });
  }

  const isAssigned = (memberId: number) => {
    return formData.assignee_id.includes(memberId);
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-40" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-gray-800 p-0 text-left align-middle shadow-xl transition-all border border-gray-700 flex flex-col max-h-[90vh]">
                {/* 헤더 섹션 */}
                <div className="flex justify-between items-center border-b border-gray-700 p-5">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-xl font-bold text-white">새로운 마일스톤 생성</h3>
                  </div>
                  <button
                    type="button"
                    className="p-1 text-gray-400 hover:text-white transition-all duration-150"
                    onClick={onClose}
                    aria-label="닫기"
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-7">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <label htmlFor="title" className="flex items-center text-sm font-medium mb-2 text-gray-300">
                        마일스톤 이름 <span className="text-purple-400 ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400 hover:border-gray-500"
                        placeholder="마일스톤 이름을 입력하세요"
                        required
                      />
                    </div>

                    <div className="col-span-2">
                      <label htmlFor="description" className="flex items-center text-sm font-medium mb-2 text-gray-300">
                        설명 <span className="text-purple-400 ml-1">*</span>
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400 hover:border-gray-500 resize-none"
                        placeholder="마일스톤에 대한 설명을 입력하세요"
                      />
                    </div>

                    <div className="col-span-1">
                      <label htmlFor="startDate" className="flex items-center text-sm font-medium mb-2 text-gray-300">
                        시작일 <span className="text-purple-400 ml-1">*</span>
                      </label>
                      <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400 hover:border-gray-500"
                        required
                      />
                    </div>

                    <div className="col-span-1">
                      <label htmlFor="endDate" className="flex items-center text-sm font-medium mb-2 text-gray-300">
                        종료일 <span className="text-purple-400 ml-1">*</span>
                      </label>
                      <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400 hover:border-gray-500"
                        required
                      />
                      {dateError && (
                        <p className="text-red-500 text-sm mt-2">종료일은 시작일 이후여야 합니다.</p>
                      )}
                    </div>


                    <div className="col-span-1">
                      <label htmlFor="status" className="flex items-center text-sm font-medium mb-2 text-gray-300">
                        상태 <span className="text-purple-400 ml-1">*</span>
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg bg-gray-700 border ${
                          statusError ? 'border-red-500' : 'border-gray-600'
                        } text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400 hover:border-gray-500`}
                        required
                      >
                        <option value="">선택</option>
                        <option value="not-started">준비</option>
                        <option value="in-progress">진행중</option>
                        <option value="done">완료</option>
                      </select>
                      {statusError && (
                        <p className="text-red-500 text-sm mt-2">상태를 선택해주세요.</p>
                      )}
                    </div>

                    <div className="col-span-1">
                      <label htmlFor="priority" className="flex items-center text-sm font-medium mb-2 text-gray-300">
                        우선순위 <span className="text-purple-400 ml-1">*</span>
                      </label>
                      <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg bg-gray-700 border ${
                          priorityError ? 'border-red-500' : 'border-gray-600'
                        } text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400 hover:border-gray-500`}
                        required
                      >
                        <option value="">선택</option>
                        <option value="low">낮음</option>
                        <option value="medium">중간</option>
                        <option value="high">높음</option>
                      </select>
                      {priorityError && (
                        <p className="text-red-500 text-sm mt-2">우선순위를 선택해주세요.</p>
                      )}
                    </div>

                    <div className="col-span-2">
                      <label className="flex items-center text-sm font-medium mb-2 text-gray-300">
                        담당자 <span className="text-purple-400 ml-1">*</span>
                      </label>
                      <div className="border border-gray-600 rounded-lg p-3 bg-gray-700 hover:border-gray-500 transition-all">
                        <div className="mb-3">
                          <p className="text-sm text-gray-400">선택된 담당자: {formData.assignee_id.length > 0 ? `${formData.assignee_id.length}명` : '없음'}</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {project?.members.map((member) => (
                            <div
                              key={member.id}
                              onClick={() => toggleAssignee(member.id)}
                              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 ${isAssigned(member.id)
                                  ? 'bg-purple-500/20 border border-purple-500/50'
                                  : 'bg-gray-600/40 border border-transparent hover:bg-gray-600/60'
                                }`}
                            >
                              <div className="relative flex-shrink-0">
                                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
                                  <div className="relative w-full h-full flex items-center justify-center">
                                    <FontAwesomeIcon 
                                      icon={faUser} 
                                      className={`absolute text-gray-300 transform transition-all duration-300 ${
                                        isAssigned(member.id) 
                                          ? 'opacity-0 rotate-90 scale-0' 
                                          : 'opacity-100 rotate-0 scale-100'
                                      }`} 
                                    />
                                    <FontAwesomeIcon 
                                      icon={faCheck} 
                                      className={`absolute text-white transform transition-all duration-300 ${
                                        isAssigned(member.id) 
                                          ? 'opacity-100 rotate-0 scale-100' 
                                          : 'opacity-0 -rotate-90 scale-0'
                                      }`} 
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col">
                                <p className="text-sm font-medium text-white">{member.name}</p>
                                <p className="text-xs text-gray-400">{member.role}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2">
                      <label htmlFor="tags" className="flex items-center text-sm font-medium mb-2 text-gray-300">
                        태그
                      </label>
                      <input
                        type="text"
                        id="tags"
                        name="tags"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onCompositionStart={() => setIsComposing(true)}
                        onCompositionEnd={() => setIsComposing(false)}
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-gray-500"
                        placeholder="태그을 입력하고 Enter 키를 누르세요"
                      />
                      <div className="mt-2 flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1 bg-purple-900/30 text-white px-3 py-1 rounded-md text-sm"
                          >
                            <span className="text-gray-200">
                              {tag}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="text-gray-400 hover:text-white"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="w-full pt-5 border-t border-gray-700">
                    <button
                      type="submit"
                      className="w-full px-4 py-3 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-all duration-200"
                    >
                      마일스톤 생성
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
