# 💻 TeamUp  

[![Netlify Status](https://api.netlify.com/api/v1/badges/2e8fcf47-6b5c-467c-bf92-1ba9c92b8e2b/deploy-status)](https://app.netlify.com/projects/team-up-service/deploys)

**TeamUp**은 개발자, 디자이너, 기획자 등 다양한 역할을 가진 사람들이 모여  
**토이 프로젝트를 비대면으로 협업**할 수 있도록 돕는 플랫폼입니다.

> 함께 만들고, 함께 성장하는 협업 커뮤니티

---

## 🚀 핵심 기능 (MVP 기준)

### 👥 팀 빌딩
- 역할 기반 사용자 프로필 (개발자, 디자이너, 기획자 등)
- 프로젝트 팀 생성 및 참여
- 관심사 기반 팀원 탐색 및 수동 매칭

### 💬 실시간 협업
- 실시간 채팅 (WebSocket 기반)
- 화상통화 (WebRTC 지원)
- 협업용 화이트보드 (간단한 아이디어 정리용)

### 📋 프로젝트 관리
- 프로젝트 대시보드
- 일정 및 마일스톤 설정
- 칸반 보드 & 회의록 저장 기능

### 🔗 외부 연동
- GitHub OAuth 로그인 및 저장소 연동
- Figma / Notion / Google Docs 링크 첨부

---

## 🧱 기술 스택

### 프론트엔드
- `Next.js`
- `Tailwind CSS`
- `Zustand` (상태 관리)
- `WebSocket` (실시간 채팅)
- `WebRTC` (화상통화)

### 백엔드
- `Python FastAPI`
- `PostgreSQL`
- `Firebase Authentication` (GitHub OAuth)

### 기타
- 배포: `Vercel`, `Render`, `AWS`
- 이미지/파일 업로드: `Cloudinary` or `Amazon S3`
- 푸시 알림: `Firebase Cloud Messaging (FCM)`

---

## 🧪 개발 우선순위 (MVP Roadmap)

### ✅ 1차 목표 (기초 기능)
- GitHub 로그인 및 사용자 프로필
- 팀 생성 / 팀 참여 기능
- 실시간 채팅
- 기본 프로젝트 대시보드

### ⏳ 2차 목표 (핵심 협업)
- 화상통화 (WebRTC)
- 프로젝트 칸반보드
- 일정 관리 & 회의록
- 외부 툴 연동 (GitHub, Figma 등)


## ✨ 슬로건

> **“Create. Collaborate. Code. Together.”**  
> 당신의 아이디어, 팀이 되어 현실로.

---

## 📎 프로젝트 목적

- 다양한 역할의 사용자가 쉽게 팀을 만들고 협업할 수 있는 환경을 제공
- 비대면 기반의 **사이드 프로젝트 협업 툴**이라는 니치 타겟 공략
- 나만의 포트폴리오 & 실무 경험 제공

---

## 📌 향후 계획

- 자동 매칭 기반 팀 빌딩 알고리즘
- 커뮤니티 기능 (피드, 피드백, 포트폴리오 공유)
- 온라인 해커톤 운영 기능
- AI 매니저 봇 (회의 요약, 업무 분배 추천 등)

---

## 🛠️ 설치 및 실행

(예시: Next.js + Node.js 조합일 경우)

```bash
# 프론트엔드
cd frontend
npm install
npm run dev

# 백엔드
cd backend
./gradlew bootRun   # Spring Boot 사용 시
# 또는
npm install
npm run start       # Node.js 사용 시
```

## 🤝 Contributing

TeamUp은 함께 만들어가는 플랫폼입니다.

기여, 아이디어 제안, 피드백 모두 환영합니다!

## 📄 라이선스

[MIT License](./LICENSE)
