import { MileStone } from '@/types/MileStone';
import { getPriorityColor } from '@/utils/getPriorityColor';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/auth/authStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faUser, faCheck } from '@fortawesome/free-solid-svg-icons';
import { deleteMilestone } from '@/hooks/getMilestoneData';
import ModalTemplete from '@/components/ModalTemplete';
import Badge from '@/components/Badge';
import { getStatusColor } from '@/utils/getStatusColor';
import { useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { updateMilestone } from '@/hooks/getMilestoneData';
interface MilestoneModalProps {
  milestone: MileStone;
  isOpen: boolean;
  onClose: () => void;
}


export default function MilestoneModal({ milestone, isOpen, onClose }: MilestoneModalProps) {
  const user = useAuthStore.getState().user;
  const params = useParams();
  const { project, refreshProject } = useProject();
  const router = useRouter();
  const [milestoneData, setMilestoneData] = useState<MileStone>(milestone);
  const [isEditing, setIsEditing] = useState<string>("none");
  const [newTag, setNewTag] = useState('');
  const [isComposing, setIsComposing] = useState(false);

  if (!isOpen) return null;

  const calculateProgress = () => {
    let totalTasks = 0;
    let completedTasks = 0;

    milestoneData?.subtasks.forEach(task => {
      // Count the main task
      totalTasks++;
      if (task.status === 'done') {
        completedTasks++;
      }

      // Count subtasks
      if (task.subtasks.length > 0) {
        totalTasks += task.subtasks.length;
        completedTasks += task.subtasks.filter(st => st.completed).length;
      }
    });

    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  const progressPercentage = calculateProgress();

  const isUserAssignee = milestoneData?.assignee.some(assi => assi.id === user?.id);

  const handleAssigneeClick = (assiId: number) => {
    localStorage.setItem('selectedAssiId', assiId.toString());

    const projectId = params?.projectId ? String(params.projectId) : 'default';
    router.push(`/platform/${projectId}/members`);

    onClose();
  };

  const handleTaskClick = (taskId: number) => {
    localStorage.setItem('selectedTaskId', taskId.toString());

    const projectId = params?.projectId ? String(params.projectId) : 'default';
    router.push(`/platform/${projectId}/tasks`);

    onClose();
  };

  const handleRemoveTag = (tagIndex: number) => {
    const updatedTags = milestoneData.tags.filter((_, index) => index !== tagIndex);
    setMilestoneData({ ...milestoneData, tags: updatedTags });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Validate end date is not earlier than start date
    if (name === 'endDate') {
      const startDate = milestoneData.startDate;
      if (startDate && value && new Date(value) < new Date(startDate)) {
        useAuthStore.getState().setAlert("종료일은 시작일보다 빠를 수 없습니다.", "warning");
        setMilestoneData({ ...milestoneData, [name]: milestoneData[name] });
        return;
      }
    }

    // Validate start date is not later than end date
    if (name === 'startDate') {
      const endDate = milestoneData.endDate;
      if (endDate && value && new Date(endDate) < new Date(value)) {
        useAuthStore.getState().setAlert("시작일은 종료일보다 늦을 수 없습니다.", "warning");
        setMilestoneData({ ...milestoneData, [name]: milestoneData[name] });
        return;
      }
    }

    setMilestoneData({ ...milestoneData, [name]: value });
  };

  const handleDelete = () => {
    useAuthStore.getState().setConfirm("마일스톤을 삭제하시겠습니까?", async () => {
      try {
        await deleteMilestone(milestone.id);
        useAuthStore.getState().setAlert("마일스톤 삭제에 성공했습니다.", "success");
        useAuthStore.getState().clearConfirm();
        onClose();
        await refreshProject();
      } catch (error) {
        console.error("Error deleting milestone:", error);
        useAuthStore.getState().setAlert("마일스톤 삭제에 실패했습니다.", "error");
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isComposing) {
      e.preventDefault();
      if (newTag.trim() !== '') {
        setMilestoneData({
          ...milestoneData,
          tags: [...milestoneData.tags, newTag.trim()]
        });
        setNewTag('');
      }
    }
  };

  const handleEdit = (name: string) => {
    if (milestoneData.assignee?.some(a => a.id === user?.id)) {
      setIsEditing(name);
      if (name !== "none") {
        useAuthStore.getState().setAlert("편집 모드로 전환되었습니다.", "info");
      } else {
        useAuthStore.getState().setAlert("편집 모드를 종료했습니다.", "info");
      }
    } else {
      useAuthStore.getState().setAlert("담당자가 아니므로 수정할 수 없습니다.", "warning");
    }
  };

  const handleSaveEdit = async () => {
    try {
      await updateMilestone(params?.projectId ? String(params.projectId) : 'default', milestone.id, {
        ...milestoneData,
        assignee_id: milestoneData.assignee.map(a => a.id)
      });
      useAuthStore.getState().setAlert("마일스톤이 성공적으로 수정되었습니다.", "success");
      setIsEditing("none");
      await refreshProject();
    } catch (error) {
      console.error("Error updating milestone:", error);
      useAuthStore.getState().setAlert("마일스톤 수정에 실패했습니다.", "error");
    } finally {
      setIsEditing("none");
    }
  };

  const handleCancelEdit = () => {
    setMilestoneData(milestone);
    setIsEditing("none");
    useAuthStore.getState().setAlert("편집 모드를 종료했습니다.", "info");
  };

  // Header content
  const headerContent = (
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        {isEditing === "title" ? (
          <input
            type="text"
            name="title"
            value={milestoneData.title}
            onChange={handleChange}
            className="w-full text-lg p-2 rounded-lg bg-component-secondary-background border border-component-border text-text-primary focus:outline-none focus:ring-1 focus:ring-point-color-indigo"
          />
        ) : (
          <div className="flex items-center gap-2 group relative">
            <h3 className="text-2xl font-semibold text-text-primary">{milestoneData.title}</h3>
            <FontAwesomeIcon
              icon={faPencil}
              size='xs'
              className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={() => isEditing === "title" ? handleEdit("none") : handleEdit("title")}
            />
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {isEditing === "tags" ? (
            <>
              {milestoneData.tags.map((tag, index) => (
                <Badge key={index} content={tag} color="pink" isEditable={true} onRemove={() => handleRemoveTag(index)} />
              ))}
              <div className="flex">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onCompositionStart={() => setIsComposing(true)}
                  onCompositionEnd={() => setIsComposing(false)}
                  placeholder="새 태그 추가"
                  className="px-2 rounded-md bg-component-secondary-background border border-component-border text-text-primary focus:outline-none focus:ring-1 focus:ring-point-color-indigo"
                />
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 group relative">
              {milestoneData?.tags.map((tag, index) => (
                <Badge key={index} content={tag} color="pink" />
              ))}
              <FontAwesomeIcon
                icon={faPencil}
                size='xs'
                className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={() => isEditing === "tags" ? handleEdit("none") : handleEdit("tags")}
              />
            </div>
          )}
        </div>
      </div>
      {isUserAssignee && (
        <div className="flex items-center gap-2">
          {isEditing !== "none" && (
            <>
              <button
                onClick={handleCancelEdit}
                className="flex items-center gap-1.5 text-sm bg-cancel-button-background hover:bg-cancel-button-background-hover text-white px-3 py-2 rounded-md transition-all duration-200 font-medium"
              >
                취소
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex items-center gap-1.5 text-sm bg-point-color-indigo hover:bg-point-color-indigo-hover text-white px-3 py-2 rounded-md transition-all duration-200 font-medium"
              >
                <FontAwesomeIcon icon={faCheck} />
                저장
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );

  // Footer content (conditionally rendered)
  const footerContent = isEditing !== "none" ? (
    <div className="flex gap-2 justify-end">
      <button
        onClick={handleDelete}
        className="flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 px-4 py-2 rounded-md transition-all duration-200 font-medium"
        aria-label="마일스톤 삭제"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        마일스톤 삭제
      </button>
    </div>
  ) : null;

  // Main content
  const mainContent = (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2 group relative">
          <h4 className="text-text-primary">설명</h4>
          <FontAwesomeIcon
            icon={faPencil}
            size='xs'
            className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            onClick={() => isEditing === "description" ? handleEdit("none") : handleEdit("description")}
          />
        </div>
        {isEditing === "description" ? (
          <textarea
            name="description"
            value={milestoneData.description}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-component-secondary-background border border-component-border text-text-primary focus:outline-none focus:ring-1 focus:ring-point-color-indigo resize-none"
          />
        ) : (
          <p className="bg-component-secondary-background p-4 rounded-lg text-text-secondary">{milestoneData.description}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 group relative">
            <h4 className="text-text-primary">시작일</h4>
            <FontAwesomeIcon
              icon={faPencil}
              size='xs'
              className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={() => isEditing === "startDate" ? handleEdit("none") : handleEdit("startDate")}
            />
          </div>
          {isEditing === "startDate" ? (
            <input
              type="date"
              name="startDate"
              value={milestoneData.startDate}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-component-secondary-background border border-component-border text-text-primary focus:outline-none focus:ring-1 focus:ring-point-color-indigo"
            />
          ) : (
            <p className="bg-component-secondary-background p-4 rounded-lg text-text-secondary">시작일: {milestoneData.startDate}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 group relative">
            <h4 className="text-text-primary">종료일</h4>
            <FontAwesomeIcon
              icon={faPencil}
              size='xs'
              className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={() => isEditing === "endDate" ? handleEdit("none") : handleEdit("endDate")}
            />
          </div>
          {isEditing === "endDate" ? (
            <input
              type="date"
              name="endDate"
              value={milestoneData.endDate}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-component-secondary-background border border-component-border text-text-primary focus:outline-none focus:ring-1 focus:ring-point-color-indigo"
            />
          ) : (
            <p className="bg-component-secondary-background p-4 rounded-lg text-text-secondary">종료일: {milestoneData.endDate}</p>
          )}
        </div>


        <div className="space-y-2">
          <div className="flex items-center gap-2 group relative">
            <h4 className="text-text-primary">상태</h4>
            <FontAwesomeIcon
              icon={faPencil}
              size='xs'
              className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={() => isEditing === "status" ? handleEdit("none") : handleEdit("status")}
            />
          </div>
          {isEditing === "status" ? (
            <select
              name="status"
              value={milestoneData.status}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-component-secondary-background border border-component-border text-text-primary focus:outline-none focus:ring-1 focus:ring-point-color-indigo"
            >
              <option value="not-started">시작 전</option>
              <option value="in-progress">진행 중</option>
              <option value="completed">완료</option>
            </select>
          ) : (
            <div className="bg-component-secondary-background p-4 rounded-lg">
              <span className={`inline-block px-3 py-1 rounded-md text-sm font-medium ${getStatusColor(milestoneData.status)}`}>
                {milestoneData.status === 'not-started' ? '시작 전' : milestoneData.status === 'in-progress' ? '진행 중' : '완료'}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 group relative">
            <h4 className="text-text-primary">우선순위</h4>
            <FontAwesomeIcon
              icon={faPencil}
              size='xs'
              className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={() => isEditing === "priority" ? handleEdit("none") : handleEdit("priority")}
            />
          </div>
          {isEditing === "priority" ? (
            <select
              name="priority"
              value={milestoneData.priority}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-component-secondary-background border border-component-border text-text-primary focus:outline-none focus:ring-1 focus:ring-point-color-indigo"
            >
              <option value="high">높음</option>
              <option value="medium">중간</option>
              <option value="low">낮음</option>
            </select>
          ) : (
            <div className="bg-component-secondary-background p-4 rounded-lg">
              <span className={`inline-block px-3 py-1 rounded-md text-sm font-medium
              ${getPriorityColor(milestoneData.priority)}`}>
                {milestoneData.priority === 'high' ? '높음' : milestoneData.priority === 'medium' ? '중간' : '낮음'}
              </span>
            </div>
          )}
        </div>

        <div className="col-span-2 space-y-2">
          <div className="flex items-center gap-2 group relative">
            <h4 className="text-text-primary">담당자</h4>
            <FontAwesomeIcon
              icon={faPencil}
              size='xs'
              className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={() => isEditing === "assignee" ? handleEdit("none") : handleEdit("assignee")}
            />
          </div>
          {isEditing === "assignee" ? (
            <div className="border border-component-border rounded-lg p-3 bg-component-secondary-background hover:border-component-border-hover transition-all">
              <div className="mb-3">
                <p className="text-sm text-text-secondary">선택된 담당자: {milestoneData.assignee.length > 0 ? `${milestoneData.assignee.length}명` : '없음'}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {project?.members.map((member) => {
                  const isSelected = milestoneData.assignee.some(a => a.id === member.id);
                  return (
                    <div
                      key={member.id}
                      onClick={() => {
                        if (isSelected) {
                          if (milestoneData.assignee.length > 1) {
                            setMilestoneData({
                              ...milestoneData,
                              assignee: milestoneData.assignee.filter(a => a.id !== member.id),
                            });
                          } else {
                            useAuthStore.getState().setAlert("최소 한 명의 담당자는 필요합니다.", "warning");
                          }
                        } else {
                          setMilestoneData({
                            ...milestoneData,
                            assignee: [...milestoneData.assignee, member],
                          });
                        }
                      }}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 ${isSelected
                        ? 'bg-purple-500/20 border border-purple-500/50'
                        : 'bg-component-tertiary-background border border-transparent hover:bg-component-tertiary-background/60'
                        }`}
                    >
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-component-secondary-background flex items-center justify-center overflow-hidden">
                          <div className="relative w-full h-full flex items-center justify-center">
                            <FontAwesomeIcon
                              icon={faUser}
                              className={`absolute text-text-secondary transform transition-all duration-300 ${isSelected
                                ? 'opacity-0 rotate-90 scale-0'
                                : 'opacity-100 rotate-0 scale-100'
                                }`}
                            />
                            <FontAwesomeIcon
                              icon={faCheck}
                              className={`absolute text-text-primary transform transition-all duration-300 ${isSelected
                                ? 'opacity-100 rotate-0 scale-100'
                                : 'opacity-0 -rotate-90 scale-0'
                                }`}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-text-primary">{member.name}</p>
                        <p className="text-xs text-text-secondary">{member.role}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 bg-component-secondary-background p-4 rounded-lg">
              {
                milestoneData.assignee.map((assi) => (
                  <p key={assi.id} className="text-text-secondary hover:text-blue-400 cursor-pointer transition-colors" onClick={() => handleAssigneeClick(assi.id)}    >{assi.name}</p>
                ))
              }
            </div>
          )}
        </div>

        <div className="col-span-2">
          <h4 className="text-text-primary">진행률</h4>
          <div className="flex justify-between text-sm text-text-secondary mb-2">
            <span>진행도</span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="w-full bg-component-secondary-background rounded-full h-2">
            <div
              className="bg-point-color-indigo h-2 rounded-full transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

      </div>


      <div className="space-y-2">
        <h4 className="text-text-primary">하위 작업</h4>
        <div className="bg-component-secondary-background p-4 rounded-lg space-y-2">
          {milestoneData.subtasks.length > 0 ? (
            milestoneData.subtasks.map((subtask) => (
              <div key={subtask.id} className="flex flex-col">
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    readOnly
                    checked={
                      subtask.subtasks.length > 0 &&
                      subtask.subtasks.every((st) => st.completed) ||
                      subtask.status === 'done'
                    }
                    className='rounded bg-component-secondary-background border-component-border'
                  />
                  <span className={`text-sm cursor-pointer hover:text-blue-400 ${subtask.subtasks.length > 0 && subtask.subtasks.every(st => st.completed) || subtask.status === 'done' ?
                    'text-text-secondary line-through' : 'text-text-primary'
                    }`}
                    onClick={() => handleTaskClick(subtask.id)}
                  >
                    {subtask.title}
                  </span>
                </div>
                <div className="ml-8 mt-2">
                  {
                    subtask.subtasks.map((sub, idx) => (
                      <div key={idx} className='space-x-2'>
                        <input
                          type="checkbox"
                          readOnly
                          checked={sub.completed}
                          className='rounded bg-component-secondary-background border-component-border'
                        />
                        <span className={`text-sm ${sub.completed ? 'text-text-secondary line-through' : 'text-text-primary'}`}>{sub.title}</span>
                      </div>
                    ))
                  }
                </div>
              </div>
            ))
          ) : (
            <span className="text-text-secondary">하위 작업이 없습니다.</span>
          )}
        </div>
      </div>
    </div >
  );

  return (
    <ModalTemplete
      header={headerContent}
      footer={footerContent}
      isOpen={isOpen}
      onClose={onClose}
    >
      {mainContent}
    </ModalTemplete>
  );
}
