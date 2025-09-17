import { Flame, Eye, Globe, Smartphone, Bot } from "lucide-react";

export const collaborationStyles = [
  {
    value: "active",
    label: "적극적 협업",
    description: "팀원들과 적극적으로 협업하고 싶어요",
    icon: Flame,
  },
  {
    value: "passive",
    label: "소극적 협업",
    description: "팀원들의 리드에 따라 협업하고 싶어요",
    icon: Eye,
  },
];

export const projectTypes = [
  {
    value: "web",
    label: "웹 서비스",
    description: "웹 사이트 & 웹 앱",
    icon: Globe,
  },
  {
    value: "mobile",
    label: "모바일 앱",
    description: "iOS & Android 앱",
    icon: Smartphone,
  },
  {
    value: "ai",
    label: "AI 서비스",
    description: "머신러닝 & 딥러닝",
    icon: Bot,
  },
];

export const preferred_roles = {
  developer: [
    {
      name: "preferred_role",
      value: "frontend_developer",
      label: "프론트엔드 개발자",
    },
    {
      name: "preferred_role",
      value: "backend_developer",
      label: "백엔드 개발자",
    },
    {
      name: "preferred_role",
      value: "fullstack_developer",
      label: "풀스택 개발자",
    },
    {
      name: "preferred_role",
      value: "ios_developer",
      label: "iOS 개발자",
    },
    {
      name: "preferred_role",
      value: "android_developer",
      label: "Android 개발자",
    },
    {
      name: "preferred_role",
      value: "game_developer",
      label: "게임 개발자",
    },
    {
      name: "preferred_role",
      value: "ai_developer",
      label: "AI 개발자",
    },
    {
      name: "preferred_role",
      value: "data_engineer",
      label: "데이터 엔지니어",
    },
    {
      name: "preferred_role",
      value: "devops_engineer",
      label: "DevOps 엔지니어",
    },
    {
      name: "preferred_role",
      value: "security_engineer",
      label: "보안 엔지니어",
    },
    {
      name: "preferred_role",
      value: "blockchain_developer",
      label: "블록체인 개발자",
    },
  ],
  designer: [
    {
      name: "preferred_role",
      value: "ui_designer",
      label: "UI 디자이너",
    },
    {
      name: "preferred_role",
      value: "ux_designer",
      label: "UX 디자이너",
    },
    {
      name: "preferred_role",
      value: "graphic_designer",
      label: "그래픽 디자이너",
    },
    {
      name: "preferred_role",
      value: "motion_designer",
      label: "모션 디자이너",
    },
    {
      name: "preferred_role",
      value: "illustrator",
      label: "일러스트레이터",
    },
    {
      name: "preferred_role",
      value: "3d_designer",
      label: "3D 디자이너",
    },
    {
      name: "preferred_role",
      value: "video_editor",
      label: "비디오 편집자",
    },
    {
      name: "preferred_role",
      value: "product_designer",
      label: "제품 디자이너",
    },
  ],
  planner: [
    {
      name: "preferred_role",
      value: "product_manager",
      label: "제품 매니저",
    },
    {
      name: "preferred_role",
      value: "product_owner",
      label: "제품 책임자",
    },
    {
      name: "preferred_role",
      value: "service_manager",
      label: "서비스 매니저",
    },
    {
      name: "preferred_role",
      value: "marketing_manager",
      label: "마케팅 매니저",
    },
    {
      name: "preferred_role",
      value: "content_manager",
      label: "콘텐츠 매니저",
    },
  ],
};

export interface CollaborationPreference {
  collaboration_style: string;
  preferred_project_type: string;
  preferred_role: string;
  available_time_zone: string;
  work_hours_start: string;
  work_hours_end: string;
  preferred_project_length: string;
}

export const blankCollaborationPreference: CollaborationPreference = {
  collaboration_style: "",
  preferred_project_type: "",
  preferred_role: "",
  available_time_zone: "",
  work_hours_start: "",
  work_hours_end: "",
  preferred_project_length: "",
}
    