import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useAuthStore } from "@/auth/authStore";
import { Project } from "@/types/Project";
import { getProjectByMemberId } from "@/hooks/getProjectData";
import { updateProjectMember } from "@/hooks/getMemberData";

interface SelectProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberToScout?: {
    id: number;
    name: string;
  }
}

export default function SelectProjectModal({ isOpen, onClose, memberToScout }: SelectProjectModalProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const data = await getProjectByMemberId(user.id);
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        useAuthStore.getState().setAlert("프로젝트를 가져오는 데 실패했습니다.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  const handleScout = async () => {
    if (!selectedProject || !memberToScout) return;
    
    try {
      setIsSubmitting(true);
      await updateProjectMember(selectedProject, memberToScout.id);
      useAuthStore.getState().setAlert(`${memberToScout.name}님을 프로젝트에 스카우트했습니다!`, "success");
      onClose();
    } catch (error) {
      console.error("Error scouting member:", error);
      useAuthStore.getState().setAlert("스카우트 처리 중 오류가 발생했습니다.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-gray-800/95 backdrop-blur-sm p-6 text-left align-middle shadow-xl transition-all border border-gray-700 flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-start border-b border-gray-700/50 pb-6">
                  <div className="flex items-center space-x-4">
                    <h2 className="text-xl font-bold text-white">프로젝트 선택</h2>
                  </div>
                  <button
                    type="button"
                    className="p-1 text-gray-400 hover:text-white transition-all"
                    onClick={onClose}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="mt-6 flex-1 overflow-y-auto">
                  {loading ? (
                    <div className="flex justify-center items-center py-10">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-gray-300">프로젝트를 불러오는 중...</span>
                    </div>
                  ) : projects.length === 0 ? (
                    <div className="py-8 text-center text-gray-400">
                      <p>참여 중인 프로젝트가 없습니다.</p>
                      <p className="mt-2 text-sm">프로젝트를 생성하거나 참여한 후 다시 시도해주세요.</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {projects.map((project) => (
                        <div
                          key={project.id}
                          onClick={() => setSelectedProject(project.id)}
                          className={`p-4 rounded-lg border ${
                            selectedProject === project.id
                              ? "border-blue-500 bg-blue-500/10"
                              : "border-gray-700 hover:border-gray-600 hover:bg-gray-700/30"
                          } cursor-pointer transition-all`}
                        >
                          <div className="flex justify-between items-center">
                            <h3 className={`font-medium ${selectedProject === project.id ? "text-blue-400" : "text-white"}`}>
                              {project.title}
                            </h3>
                            {selectedProject === project.id && (
                              <div className="flex-shrink-0 h-5 w-5 text-blue-500">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="mt-2 text-sm text-gray-400">{project.description}</div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {project.techStack?.slice(0, 3).map((tech, idx) => (
                              <span key={idx} className="px-2 py-1 rounded-md text-xs bg-gray-700/50 text-gray-300">
                                {tech}
                              </span>
                            ))}
                            {project.techStack?.length > 3 && (
                              <span className="px-2 py-1 rounded-md text-xs bg-gray-700/50 text-gray-300">
                                +{project.techStack.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-700/50">
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors"
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      disabled={!selectedProject || isSubmitting}
                      onClick={handleScout}
                      className={`px-4 py-2 rounded-lg ${
                        !selectedProject
                          ? "bg-blue-500/30 text-blue-300/70 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      } transition-colors flex items-center`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          처리 중...
                        </>
                      ) : (
                        "스카우트하기"
                      )}
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}