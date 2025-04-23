import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCheck, faUser, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { useProject } from '@/contexts/ProjectContext';
import { createTask } from '@/hooks/getTaskData';
import { useAuthStore } from '@/auth/authStore';
import SubmitBtn from '@/components/SubmitBtn';
interface TaskCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestone_id: number | null;
}

export default function TaskCreateModal({ isOpen, onClose, milestone_id }: TaskCreateModalProps) {
  const { project } = useProject();
  const [formData, setFormData] = useState({
    project_id: project?.id,
    title: '',
    description: '',
    status: 'not-started',
    dueDate: '',
    assignee_id: [] as number[],
    tags: [] as string[],
    priority: 'medium',
    subtasks: [] as string[],
    milestone_id: milestone_id
  })
  const [tagsInput, setTagsInput] = useState('');
  const [subtasksInput, setSubtasksInput] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitStatus('submitting');

    if (project?.id) {
      try {
        await createTask({ ...formData, project_id: project.id, milestone_id: milestone_id ?? 0 });
        setSubmitStatus('success');
        useAuthStore.getState().setAlert('작업이 성공적으로 생성되었습니다.', 'success');

        setTimeout(() => {
          setSubmitStatus('idle');
          onClose();
          window.location.reload();
        }, 1000);
      } catch (error) {
        console.error(error);
        useAuthStore.getState().setAlert('작업 생성에 실패했습니다. 관리자에게 문의해주세요.', 'error');
      }
    }
  }

  const handleKeyDown = (type: "tags" | "subtasks", e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isComposing) {
      e.preventDefault();

      if (type === "tags") {
        const trimmedInput = tagsInput.trim();
        if (trimmedInput && !formData.tags.includes(trimmedInput)) {
          const updatedTags = [...formData.tags, trimmedInput];
          setFormData({ ...formData, tags: updatedTags });
          setTagsInput('');
        }
      } else if (type === "subtasks") {
        const trimmedInput = subtasksInput.trim();
        if (trimmedInput && !formData.subtasks.includes(trimmedInput)) {
          const updatedSubtasks = [...formData.subtasks, trimmedInput];
          setFormData({ ...formData, subtasks: updatedSubtasks });
          setSubtasksInput('');
        }
      }
    }
  }

  const handleRemoveTag = (tag: string) => {
    const updatedTags = formData.tags.filter(t => t !== tag);
    setFormData({ ...formData, tags: updatedTags });
  }

  const handleRemoveSubtask = (subtask: string) => {
    const updatedSubtasks = formData.subtasks.filter(s => s !== subtask);
    setFormData({ ...formData, subtasks: updatedSubtasks });
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-gray-800/95 backdrop-blur-sm p-0 text-left align-middle shadow-xl transition-all border border-gray-700 flex flex-col max-h-[90vh]">
                {/* 헤더 섹션 */}
                <div className="flex justify-between items-center border-b border-gray-700/50 p-5">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-xl font-bold text-white">새로운 작업 생성</h3>
                  </div>
                  <button
                    type="button"
                    className="p-1 text-gray-400 hover:text-white transition-all"
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
                        작업 이름 <span className="text-purple-400 ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400 hover:border-gray-500"
                        placeholder="작업 이름을 입력하세요"
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
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400 resize-none hover:border-gray-500"
                        placeholder="작업 설명을 입력하세요"
                      />
                    </div>

                    <div className="relative">
                      <label htmlFor="dueDate" className="flex items-center text-sm font-medium mb-2 text-gray-300">
                        마감 일자 <span className="text-purple-400 ml-1">*</span>
                      </label>
                      <input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-gray-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="priority" className="flex items-center text-sm font-medium mb-2 text-gray-300">
                        우선순위 <span className="text-purple-400 ml-1">*</span>
                      </label>
                      <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-gray-500"
                        required
                      >
                        <option value="low">낮음</option>
                        <option value="medium">중간</option>
                        <option value="high">높음</option>
                      </select>
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
                                      className={`absolute text-gray-300 transform transition-all duration-300 ${isAssigned(member.id)
                                        ? 'opacity-0 rotate-90 scale-0'
                                        : 'opacity-100 rotate-0 scale-100'
                                        }`}
                                    />
                                    <FontAwesomeIcon
                                      icon={faCheck}
                                      className={`absolute text-white transform transition-all duration-300 ${isAssigned(member.id)
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
                        onKeyDown={(e) => handleKeyDown("tags", e)}
                        onCompositionStart={() => setIsComposing(true)}
                        onCompositionEnd={() => setIsComposing(false)}
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-gray-500"
                        placeholder="태그을 입력하고 Enter 키를 누르세요"
                      />
                      <div className="mt-2 flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1 bg-purple-900/50 text-purple-300 px-3 py-1 rounded-md text-sm"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="text-purple-300 hover:text-white ml-1 focus:outline-none"
                            >
                              <FontAwesomeIcon icon={faCircleXmark} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="col-span-2">
                      <label htmlFor="subtasks" className="flex items-center text-sm font-medium mb-2 text-gray-300">
                        하위 작업
                      </label>
                      <input
                        type="text"
                        id="subtasks"
                        name="subtasks"
                        value={subtasksInput}
                        onChange={(e) => setSubtasksInput(e.target.value)}
                        onKeyDown={(e) => handleKeyDown("subtasks", e)}
                        onCompositionStart={() => setIsComposing(true)}
                        onCompositionEnd={() => setIsComposing(false)}
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400 hover:border-gray-500"
                        placeholder="하위 작업을 입력하고 Enter 키를 누르세요"
                      />
                      <div className="mt-2 flex flex-col gap-2">
                        {formData.subtasks.map((subtask, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between gap-2 bg-purple-900/30 hover:bg-purple-900/50 p-3 rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={false}
                                readOnly
                                className="rounded"
                              />
                              <span className="text-purple-300">
                                {subtask}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveSubtask(subtask)}
                              className="text-purple-300 hover:text-white"
                            >
                              <FontAwesomeIcon icon={faCircleXmark} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <SubmitBtn submitStatus={submitStatus} />
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
