"use client";

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Member } from '@/types/Member';
import SelectProjectModal from './SelectProjectModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

interface MemberScoutDetailModalProps {
  member: Member;
  isOpen: boolean;
  onClose: () => void;
}

export default function MemberScoutDetailModal({ member, isOpen, onClose }: MemberScoutDetailModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
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
                enterTo="opacity-100   scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-gray-800/95 backdrop-blur-sm p-6 text-left align-middle shadow-xl transition-all border border-gray-700 flex flex-col max-h-[90vh]">
                  {/* 헤더 섹션 */}
                  <div className="flex justify-between items-start border-b border-gray-700/50 pb-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 
                                    flex items-center justify-center text-xl font-bold text-white">
                          {member.name.charAt(0)}
                        </div>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-1">{member.name}</h2>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center px-2.5 py-1 rounded-full bg-gray-700/30 text-gray-300">
                            <span
                              className={`w-2.5 h-2.5 rounded-full mr-2 ${member.status === "활성" ? "bg-emerald-500" :
                                member.status === "자리비움" ? "bg-amber-500" : "bg-gray-500"
                                } animate-pulse`}
                            />
                            <span className="text-sm">{member.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="text-gray-400 hover:text-white transition-all"
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </div>
                  {/* 내용 섹션 */}
                  <div className="mt-6 space-y-6 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                          <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          역할
                        </h3>
                        <div className="px-4 py-3 bg-gray-700/30 rounded-lg text-gray-300 font-medium">
                          {member.role}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                          <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          이메일
                        </h3>
                        <div className="px-4 py-3 bg-gray-700/30 rounded-lg text-gray-300">
                          {member.email}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                          <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          연락처
                        </h3>
                        <div className="px-4 py-3 bg-gray-700/30 rounded-lg text-gray-300">
                          {member.contactNumber}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                          <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          생년월일
                        </h3>
                        <div className="px-4 py-3 bg-gray-700/30 rounded-lg text-gray-300">
                          {member.birthDate || "정보 없음"}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        참여중인 프로젝트
                      </h3>
                      <div className="px-4 py-3 bg-gray-700/30 rounded-lg">
                        {member.projectDetails?.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {member.projectDetails.map((project, idx) => (
                              <div key={idx} className="inline-flex items-center px-3 py-1.5 border border-gray-600/40 rounded-md bg-gray-700/40 backdrop-blur-sm text-gray-200 text-sm hover:bg-gray-700/60 transition-colors group">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2 group-hover:bg-blue-300"></span>
                                {project.title}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500">현재 참여중인 프로젝트가 없습니다.</p>
                        )}
                      </div>
                    </div>


                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        전문 분야
                      </h3>
                      <div className="flex flex-wrap gap-2 ">
                        {member.skills?.map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                            {skill}
                          </span>
                        )) || "등록된 전문 분야가 없습니다."}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        소개
                      </h3>
                      <div className="px-4 py-3 bg-gray-700/30 rounded-lg text-gray-300">
                        {member.introduction || "소개 정보가 없습니다."}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        연락 가능 시간
                      </h3>
                      <div className="px-4 py-3 bg-gray-700/30 rounded-lg text-gray-300">
                        <div className="flex items-center">
                          {member.workingHours ? (
                            <>
                              <span className="font-medium">{member.workingHours.start} - {member.workingHours.end}</span>
                              {member.workingHours.timezone && (
                                <span className="ml-2 text-gray-400 text-sm">({member.workingHours.timezone})</span>
                              )}
                            </>
                          ) : (
                            "연락 가능 시간 정보가 없습니다."
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                        </svg>
                        언어
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {member.languages?.length > 0 ? (
                          member.languages.map((language, index) => (
                            <span key={index} className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                              {language}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500">등록된 언어가 없습니다.</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        소셜 링크
                      </h3>
                      <div className="flex space-x-3">
                        {member.socialLinks && member.socialLinks[0]?.github && (
                          <a
                            href={member.socialLinks[0].github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors flex items-center"
                          >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
                            </svg>
                            GitHub
                          </a>
                        )}
                        {member.socialLinks && member.socialLinks[0]?.linkedin && (
                          <a
                            href={member.socialLinks[0].linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors flex items-center"
                          >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                            </svg>
                            LinkedIn
                          </a>
                        )}
                        {(!member.socialLinks || (!member.socialLinks[0]?.github && !member.socialLinks[0]?.linkedin)) && (
                          <p className="text-gray-500">소셜 링크가 없습니다.</p>
                        )}
                      </div>
                    </div>

                    {/* 하단 액션 버튼 */}
                    <div className="border-t border-gray-700/50 pt-6 mt-auto">
                      <button
                        onClick={() => {
                          setIsModalOpen(true);
                          onClose();
                        }}
                        className="w-full px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 
                              rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2
                              hover:text-blue-300"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        <span>프로젝트에 스카우트하기</span>
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      
      {isModalOpen && (
        <SelectProjectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          memberToScout={{
            id: member.id,
            name: member.name
          }}
          memberProjects={member.projectDetails || []}
        />
      )}
    </>
  )
}