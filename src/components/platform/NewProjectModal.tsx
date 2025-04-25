"use client";

import { useState, KeyboardEvent } from 'react';
import { createProject } from '@/hooks/getProjectData';
import { updateProjectMember } from '@/hooks/getMemberData';
import { useAuthStore } from '@/auth/authStore';
import SubmitBtn from '@/components/SubmitBtn';
import ModalTemplete from '@/components/ModalTemplete';
import Badge from '@/components/Badge';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}


export default function NewProjectModal({ isOpen, onClose }: NewProjectModalProps) {
  const user = useAuthStore((state) => state.user);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    leader_id: user?.id,
    projectType: '',
    roles: [] as string[],
    techStack: [] as string[],
    location: '',
    teamSize: 1,
    endDate: '',
  });

  // Add state for role and tech stack inputs
  const [roleInput, setRoleInput] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [isComposing, setIsComposing] = useState(false);

  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // New functions to handle role and tech stack inputs
  const handleRoleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoleInput(e.target.value);
  };

  const handleTechStackInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTechStackInput(e.target.value);
  };

  const handleKeyDown = (type: "role" | "techStack", e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isComposing) {
      e.preventDefault();

      if (type === "role") {
        const trimmedInput = roleInput.trim();
        if (trimmedInput && !formData.roles.includes(trimmedInput)) {
          const updatedRoles = [...formData.roles, trimmedInput];
          setFormData({ ...formData, roles: updatedRoles });
          setRoleInput("");
        }
      } else if (type === "techStack") {
        const trimmedInput = techStackInput.trim();
        if (trimmedInput && !formData.techStack.includes(trimmedInput)) {
          const updatedTechStack = [...formData.techStack, trimmedInput];
          setFormData({ ...formData, techStack: updatedTechStack });
          setTechStackInput("");
        }
      }
    }
  };

  const handleRemoveRole = (roleToRemove: string) => {
    const updatedRoles = formData.roles.filter(role => role !== roleToRemove);
    setFormData({ ...formData, roles: updatedRoles });
  };

  const handleRemoveTechStack = (techToRemove: string) => {
    const updatedTechStack = formData.techStack.filter(tech => tech !== techToRemove);
    setFormData({ ...formData, techStack: updatedTechStack });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitStatus('submitting');

    if (user?.id) {
      try {
        const projectId = await createProject({ ...formData, leader_id: user.id });
        await updateProjectMember(projectId, user.id);
        setSubmitStatus('success');
        useAuthStore.getState().setAlert("프로젝트가 생성되었습니다.", "success");

      setTimeout(() => {
        setSubmitStatus('idle');
        onClose();
          window.location.reload();
        }, 1000);
      } catch (error) {
        console.error(error);
        useAuthStore.getState().setAlert("프로젝트 생성에 실패했습니다. 관리자에게 문의해주세요.", "error");
      }
    }
  };

  const handleButtonClick = () => {
    // Create a synthetic form event
    const syntheticEvent = { preventDefault: () => {} } as React.FormEvent<HTMLFormElement>;
    handleSubmit(syntheticEvent);
  };

  const modalHeader = (
    <div>
      <h3 className="text-xl font-bold text-white">새로운 프로젝트 생성</h3>
      <p className="text-purple-400 text-sm mt-1">팀원들과 함께할 새로운 프로젝트를 만들어보세요</p>
    </div>
  );

  const modalContent = (
    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto mt-4 pl-2 pr-2">
      <div className="space-y-6 mb-1">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            프로젝트 이름 <span className="text-purple-400 ml-1">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
            placeholder="프로젝트 이름을 입력하세요"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            프로젝트 설명 <span className="text-purple-400 ml-1">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none placeholder:text-gray-400"
            placeholder="프로젝트에 대한 간략한 설명을 입력하세요"
            required
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <label htmlFor="projectType" className="block text-sm font-medium mb-1">
              프로젝트 카테고리 <span className="text-purple-400 ml-1">*</span>
            </label>
            <select
              id="projectType"
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 appearance-none"
              required
            >
              <option value="">카테고리 선택</option>
              <option value="웹 개발">웹 개발</option>
              <option value="모바일 개발">모바일 개발</option>
              <option value="디자인">디자인</option>
              <option value="마케팅">마케팅</option>
              <option value="비즈니스">비즈니스</option>
              <option value="토이">토이 프로젝트</option>
            </select>
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium mb-1">
              프로젝트 종료일 <span className="text-purple-400 ml-1">*</span>
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>
        </div>

        <div className="space-y-5">
          <h4 className="text-white font-medium border-b border-gray-700/50 pb-2">팀 구성 정보</h4>

          <div>
            <label htmlFor="roles" className="block text-sm font-medium mb-1">
              필요한 역할 <span className="text-purple-400 ml-1">*</span>
            </label>
            <input
              type="text"
              id="roles"
              name="roles"
              value={roleInput}
              onChange={handleRoleInput}
              onKeyDown={(e) => handleKeyDown("role", e)}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              className="w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
              placeholder="역할을 입력하고 Enter 키를 누르세요"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.roles.map((role, index) => (
                <Badge key={index} content={role} color="purple" isEditable={true} onRemove={() => handleRemoveRole(role)} />
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="techStack" className="block text-sm font-medium mb-1">
              필요한 기술 <span className="text-purple-400 ml-1">*</span>
            </label>
            <input
              type="text"
              id="techStack"
              name="techStack"
              value={techStackInput}
              onChange={handleTechStackInput}
              onKeyDown={(e) => handleKeyDown("techStack", e)}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              className="w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
              placeholder="기술을 입력하고 Enter 키를 누르세요"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.techStack.map((tech, index) => (
                <Badge key={index} content={tech} color="orange" isEditable={true} onRemove={() => handleRemoveTechStack(tech)} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-1">
                위치 <span className="text-purple-400 ml-1">*</span>
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
                placeholder="원격, 서울"
                required
              />
            </div>

            <div>
              <label htmlFor="teamSize" className="block text-sm font-medium mb-1">
                팀 규모 <span className="text-purple-400 ml-1">*</span>
              </label>
              <input
                type="number"
                id="teamSize"
                name="teamSize"
                value={formData.teamSize}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="5"
                required
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );

  const modalFooter = (
    <SubmitBtn submitStatus={submitStatus} onClick={handleButtonClick} />
  );

  return (
    <ModalTemplete
      header={modalHeader}
      footer={modalFooter}
      isOpen={isOpen}
      onClose={onClose}
    >
      {modalContent}
    </ModalTemplete>
  )
}