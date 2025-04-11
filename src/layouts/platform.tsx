"use client";

import Link from "next/link";
import ProjectData from "../../public/json/projects.json";
import { useState } from "react";
import Sidebar from "@/components/platform/sidebar";
import { faHouse, faFolder, faPeopleGroup, faGear } from "@fortawesome/free-solid-svg-icons";
import { Project } from "@/types/Project";
import Logo from "@/components/logo";
import { useAuthStore } from "@/auth/authStore";


export default function Platform() {
  const projects: Project[] = ProjectData.slice();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const mainNavItems = [
    { icon: faHouse, label: "홈", href: "/platform" },
    { icon: faFolder, label: "프로젝트 찾기", href: "/platform/projects" },
    { icon: faPeopleGroup, label: "팀원 찾기", href: "/platform/members" },
    { icon: faGear, label: "설정", href: "/platform/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-(--color-background)">
      {/* 모바일 사이드바 오버레이 */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-(--color-background)/70 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar 
        isSidebarOpen={isSidebarOpen}
        title={<Logo />}
        titleHref="/platform"
        navItems={mainNavItems}
      />

      {/* 메인 컨텐츠 영역 */}
      <div className="w-full lg:ml-64 flex-1">
        {/* 헤더 */}
        <header className="h-16 border-b border-gray-800 backdrop-blur-sm fixed top-0 right-0 left-0 lg:left-64 z-10">
          <div className="h-full px-4 md:px-6 flex items-center justify-between">
            <div className="flex items-center">
              <button 
                className="mr-4 lg:hidden"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h2 className="text-lg md:text-xl font-semibold">프로젝트 둘러보기</h2>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <button className="px-3 py-1.5 md:px-4 md:py-2 bg-purple-600 text-white text-sm md:text-base rounded-lg hover:bg-purple-700">
                + 새 프로젝트
              </button>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-700"></div>
              {user ? (
                <p>👤 사용자 이름: {user.name}</p>
              ) : (
                <p>로딩 중...</p>
              )}
              <button onClick={logout}>로그아웃</button>
            </div>
          </div>
        </header>

        {/* 메인 컨텐츠 */}
        <main className="pt-20 md:pt-24 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            {/* 필터 영역 */}
            <div className="mb-6 flex flex-col md:flex-row gap-4 md:items-center md:space-x-4">
              <div className="relative">
                <select className="appearance-none bg-gray-800 border border-gray-700 rounded-lg pl-4 pr-10 py-2.5 text-sm w-full md:w-48 text-gray-300 hover:border-gray-600 focus:border-purple-500 focus:outline-none transition-colors">
                  <option value="">모든 카테고리</option>
                  <option value="web">웹 개발</option>
                  <option value="mobile">모바일 앱</option>
                  <option value="design">디자인</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a 1 1 0 01-1.414 0l-4-4a 1 1 0 010-1.414z"/>
                  </svg>
                </div>
              </div>
              <div className="relative flex-1">
                <input
                  type="search"
                  placeholder="프로젝트 검색..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-300 placeholder-gray-400 hover:border-gray-600 focus:border-purple-500 focus:outline-none transition-colors"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* 프로젝트 그리드 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
              {/* 프로젝트 카드 */}
              {projects.map(project => (
                <div key={project.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-colors duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">{project.title}</h3>
                    <span className="text-sm text-green-400">{project.status}</span>
                  </div>
                  <p className="text-gray-400 mb-4 line-clamp-2 min-h-[3rem]">{project.description}</p>
                  <div className="flex items-center space-x-2 mb-4">
                    {project.roles.map((role, index) => (
                      <span key={index} className="text-sm bg-purple-900/50 text-purple-300 px-2 py-1 rounded">{role}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-800"></div>
                      <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-800"></div>
                      <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-800"></div>
                    </div>
                    <Link href={`/platform/${project.id}`} className="text-sm text-purple-400 hover:text-purple-300">
                      참여하기
                    </Link>
                  </div>
                </div>
              ))}

              {/* 빈 프로젝트 카드 */}
              <div className="bg-gray-800/50 rounded-lg p-6 border border-dashed border-gray-700 flex flex-col">
                <div className="flex-1 flex items-center justify-center min-h-[12rem]">
                  <div className="text-center">
                    <p className="text-gray-400 mb-2">새로운 프로젝트를 시작해보세요</p>
                    <button className="text-purple-400 hover:text-purple-300">+ 프로젝트 생성</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}