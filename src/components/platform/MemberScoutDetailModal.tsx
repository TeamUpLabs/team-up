"use client";

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Member } from '@/types/Member';

interface MemberScoutDetailModalProps {
  member: Member;
  isOpen: boolean;
  onClose: () => void;
}

export default function MemberScoutDetailModal({ member, isOpen, onClose }: MemberScoutDetailModalProps) {

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
                    className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
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
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        전문 분야
                      </h3>
                      <div className="mt-2 p-3 bg-gray-700/30 rounded-lg text-gray-300 flex gap-2">
                        <p>{member.skills.length === 0 && "전문 분야가 없습니다."}</p>
                        {member.skills.map((skill, idx) => (
                          <p key={idx}>{skill}</p>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                        </svg>
                        선호 언어
                      </h3>
                      <div className="mt-2 p-3 bg-gray-700/30 rounded-lg text-gray-300 flex gap-2">
                        {member.languages.length > 0 ? (
                          member.languages.map((language, idx) => (
                            <p key={idx}>{language}</p>
                          ))
                        ) : (
                          <p className="text-gray-500">선호 언어가 없습니다.</p>
                        )}
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
                          <span className="font-medium">{member.workingHours.start} - {member.workingHours.end}</span>
                          {member.workingHours.timezone && (
                            <span className="ml-2 text-gray-400 text-sm">({member.workingHours.timezone})</span>
                          )}
                        </div>
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
                      {member.projects.length > 0 ? (
                        member.projects.map((project, idx) => (
                          <p key={idx}>{project.title}</p>
                        ))
                      ) : (
                        <p className="text-gray-500">현재 참여중인 프로젝트가 없습니다.</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 12a4 4 0 104 4 4 4 0 00-4-4zm-2 4a6 6 0 116-6 6 6 0 01-6 6z" />
                      </svg>
                      소개
                    </h3>
                    <div className="px-4 py-3 bg-gray-700/30 rounded-lg">
                      {member.introduction}
                    </div>
                  </div>

                  {/* 하단 액션 버튼 */}
                  <div className="border-t border-gray-700/50 pt-6 mt-auto">
                    <button
                      onClick={() => {
                        if (confirm('정말로 이 팀원을 프로젝트에 스카우트하시겠습니까?')) {
                          alert(`${member.name}님을 프로젝트에 스카우트했습니다!`);
                          onClose();
                        }
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
    </Transition >
  )

}