"use client";

import Header from "@/components/header";
import Badge from "@/components/ui/Badge"
import { useTheme } from "@/contexts/ThemeContext"
import Link from "next/link";
import {
  Users,
  Shield,
  GitBranch,
  MessageSquare,
  CheckSquare,
  Calendar,
  BarChart3,
  Target,
  Zap,
  Rocket,
  Globe,
  Palette,
  Smartphone,
  Code,
} from "lucide-react";

export default function About() {
  const { isDark } = useTheme();

  const features = [
    {
      icon: <Users />,
      title: "프로젝트 생성 및 팀 구성",
      description: "누구나 쉽게 프로젝트를 만들고 팀원을 초대할 수 있습니다.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Shield />,
      title: "역할 기반 권한 설정",
      description: "관리자, 개발자, 디자이너 등 다양한 역할에 따라 접근 권한을 세밀하게 제어할 수 있습니다.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <GitBranch />,
      title: "GitHub 연동",
      description: "GitHub 계정을 연결하면 레포지토리, 이슈, PR, 커밋 등과 자동 연동되어 작업 효율이 높아집니다.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <MessageSquare />,
      title: "실시간 협업",
      description: "실시간 채팅, PR 리뷰 알림, 이슈 변경사항을 즉시 반영하여 팀워크를 강화합니다.",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: <CheckSquare />,
      title: "작업(Task) 관리",
      description: "할 일, 마감일, 우선순위, SubTask 등을 관리하고 시각적으로 한눈에 파악할 수 있습니다.",
      color: "from-violet-500 to-purple-500",
    },
    {
      icon: <Calendar />,
      title: "마일스톤 & 일정 관리",
      description: "달력 기반의 일정 설정 및 차트를 통해 프로젝트 흐름을 시각화합니다.",
      color: "from-teal-500 to-cyan-500",
    },
    {
      icon: <BarChart3 />,
      title: "코드 품질 분석",
      description: "커밋 수, 테스트 결과 등을 통해 코드베이스 건강도를 점검할 수 있습니다.",
      color: "from-indigo-500 to-blue-500",
    },
    {
      icon: <Target />,
      title: "통계 & 리포트 생성",
      description: "프로젝트 활동 분석 리포트를 주간/월간 단위로 자동 생성합니다.",
      color: "from-pink-500 to-rose-500",
    },
  ]

  const targetUsers = [
    {
      icon: <Code />,
      text: "사이드 프로젝트를 함께할 팀원을 찾고 싶은 개발자",
      color: "text-purple-400",
    },
    {
      icon: <Rocket />,
      text: "디자인과 개발 간의 협업을 효율적으로 만들고 싶은 스타트업",
      color: "text-green-400",
    },
    {
      icon: <Globe />,
      text: "오픈소스 프로젝트를 체계적으로 관리하고 싶은 커뮤니티",
      color: "text-blue-400",
    },
    {
      icon: <Palette />,
      text: "기획자와 개발자 사이의 커뮤니케이션을 줄이고 싶은 팀",
      color: "text-pink-400",
    },
  ]

  const futureFeatures = [
    { text: "Slack, Discord 등 외부 툴과의 연동", icon: <MessageSquare /> },
    { text: "AI를 활용한 Task 자동 생성 및 요약 기능", icon: <Zap /> },
    { text: "OpenAPI 기반 GitHub 외 다른 버전관리툴 지원", icon: <GitBranch /> },
    { text: "모바일 앱 출시 및 PWA 지원", icon: <Smartphone /> },
  ]

  return (
    <div className="min-h-screen">
      <Header />
      <section className="relative">
        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
          <Badge
            color="purple"
            content="베타 서비스 중"
            isDark={isDark}
            className="!rounded-full"
          />
          <h1 className="text-5xl md:text-7xl font-bold my-8">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-green-400 bg-clip-text text-transparent">
              TeamUp
            </span>
            <span className="text-text-primary">에 대해</span>
            <br />
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">더 알아보기</span>
          </h1>
          <p className="text-xl font-semibold text-text-primary mb-12 max-w-3xl mx-auto leading-relaxed">
            개발자, 디자이너, 기획자가 함께 성장하고 협업하는 신뢰 기반 플랫폼입니다. <br />
            코드를 공유하고, 지식을 나누며, 함께 미래를 만들어갑니다.
          </p>
          <Link
            href="/signin"
            className="flex w-fit items-center justify-center mx-auto"
          >
            <Badge
              color="blue"
              content={
                <span className="flex items-center gap-2 font-semibold">
                  <Zap className="h-5 w-5" />
                  지금 시작하기
                </span>
              }
              isDark={isDark}
              className="!w-fit !flex !justify-center !items-center !px-8 !py-3"
              isHover
            />
          </Link>
        </div>
      </section>

      {/* What is TeamUp */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">TeamUp</span>
            <span className="text-text-primary-color">이란?</span>
          </h2>
          <p className="text-lg font-semibold text-text-primary max-w-4xl mx-auto leading-8">
            <span className="text-purple-400 font-semibold">TeamUp</span>은 개발자, 디자이너, 기획자 등 다양한 역할을
            가진 사람들이 모여 프로젝트를 효율적으로 관리하고 협업할 수 있도록 도와주는{" "}
            <span className="text-green-400 font-semibold">올인원 협업 플랫폼</span>입니다. 단순한 이슈 관리 툴이 아닌,
            소셜 로그인, GitHub 연동, 실시간 커뮤니케이션, 프로젝트 생성부터 배포에 이르기까지 전 과정을 포괄하는{" "}
            <span className="text-blue-400 font-semibold">완전한 프로덕트 중심 협업 환경</span>을 제공합니다.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">주요 기능</span>
          </h2>
          <p className="text-lg text-text-primary">TeamUp이 제공하는 강력한 협업 도구들을 만나보세요</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-component-background border border-component-border rounded-lg transition-all duration-300 hover:scale-105"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center text-white`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-text-primary">{feature.title}</h3>
                </div>
                <p className="text-text-secondary font-semibold leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why TeamUp */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">
            <span className="text-text-primary">왜 </span>
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">TeamUp</span>
            <span className="text-text-primary">인가?</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg font-semibold text-text-primary leading-8">
              많은 협업 도구들이 각기 다른 기능을 제공하지만,{" "}
              <span className="text-purple-400 font-bold">
                TeamUp은 협업의 처음부터 끝까지를 하나의 플랫폼 안에서 해결
              </span>
              할 수 있습니다.
            </p>
            <p className="text-lg font-semibold text-text-primary leading-8">
              복잡한 설정이나 연동 없이도 빠르게 시작할 수 있으며,{" "}
              <span className="text-green-400 font-bold">
                스타트업, 사이드 프로젝트 팀, 오픈소스 커뮤니티 등 다양한 규모의 팀
              </span>
              에 최적화되어 있습니다.
            </p>
            <p className="text-lg font-semibold text-text-primary leading-8">
              또, GitHub와의 긴밀한 통합을 통해{" "}
              <span className="text-blue-400 font-bold">코드 중심의 협업 문화를 강화</span>하며, 실시간 커뮤니케이션
              기능은 원격 팀 환경에서도 높은 생산성을 유지할 수 있게 도와줍니다.
            </p>
          </div>
          <div className="relative">
            <div className="bg-component-background border border-component-border rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-4">
                <Badge
                  color="purple"
                  content={
                    <div className="flex flex-col justify-center items-center h-full gap-2">
                      <div className="text-3xl font-bold">100%</div>
                      <div className="text-sm text-text-secondary">통합 솔루션</div>
                    </div>
                  }
                  isDark={isDark}
                  className="!rounded-lg items-center h-full !p-4"
                />
                <Badge
                  color="green"
                  content={
                    <div className="flex flex-col justify-center items-center h-full gap-2">
                      <div className="text-3xl font-bold">24/7</div>
                      <div className="text-sm text-text-secondary">실시간 협업</div>
                    </div>
                  }
                  isDark={isDark}
                  className="!rounded-lg items-center h-full !p-4"
                />
                <Badge
                  color="blue"
                  content={
                    <div className="flex flex-col justify-center items-center h-full gap-2">
                      <div className="text-3xl font-bold">∞</div>
                      <div className="text-sm text-text-secondary">확장 가능</div>
                    </div>
                  }
                  isDark={isDark}
                  className="!rounded-lg items-center h-full !p-4"
                />
                <Badge
                  color="orange"
                  content={
                    <div className="flex flex-col justify-center items-center h-full gap-2">
                      <div className="text-3xl font-bold">0</div>
                      <div className="text-sm text-text-secondary">복잡한 설정</div>
                    </div>
                  }
                  isDark={isDark}
                  className="!rounded-lg items-center h-full !p-4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Users */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              이런 분들에게 적합합니다
            </span>
          </h2>
          <p className="text-lg text-text-primary">TeamUp과 함께 더 효율적인 협업을 경험해보세요</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {targetUsers.map((user, index) => (
            <div
              key={index}
              className="group flex items-center p-6 bg-component-background border border-component-border rounded-lg hover:border-point-color-purple transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-10 h-10 bg-component-tertiary-background rounded-lg flex items-center justify-center ${user.color} group-hover:scale-110 transition-transform`}
                >
                  {user.icon}
                </div>
                <p className="text-text-primary font-semibold leading-relaxed flex-1">{user.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Future Plans */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
              앞으로의 계획
            </span>
          </h2>
          <p className="text-lg text-text-primary mb-8">
            현재 TeamUp은 베타 서비스 중이며, 지속적으로 아래 기능들을 추가할 예정입니다
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {futureFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 p-4 bg-component-background border border-component-border rounded-lg hover:border-point-color-purple transition-colors"
            >
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white p-2">
                {feature.icon}
              </div>
              <span className="text-text-primary font-semibold">{feature.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">
          <span className="text-text-primary">지금 바로 </span>
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-green-400 bg-clip-text text-transparent">
            TeamUp
          </span>
          <span className="text-text-primary">을 시작해보세요</span>
        </h2>
        <p className="text-xl text-text-primary mb-8 leading-relaxed">
          복잡한 설정 없이 5분 만에 팀 협업을 시작할 수 있습니다
        </p>
        <div className="flex justify-center">
          <Link href="/signin" className="flex">
            <Badge
              content={
                <span className="flex items-center gap-2 font-semibold">
                  <Users className="mr-2 h-5 w-5" />
                  무료로 시작하기
                </span>
              }
              color="blue"
              isDark={isDark}
              className="!px-8 !py-3"
              isHover
            />
          </Link>
        </div>
      </section>
    </div>
  )
}