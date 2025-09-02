"use client";

import { useState, useEffect } from "react";
import { ChevronDown, MessageSquare, ThumbsUp, UserPlus, FileText, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

type ActivityType = 'comment' | 'like' | 'follow' | 'post' | 'complete';

interface Activity {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  type: ActivityType;
  content: string;
  target?: string;
  timestamp: Date;
  formattedTime?: string;
}

const sampleActivities: Activity[] = [
  {
    id: '1',
    user: { name: '김팀장', avatar: '/DefaultProfile.jpg' },
    type: 'comment',
    content: '프로젝트 일정 조정이 필요해 보여요',
    target: '프로젝트 기획 회의',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5분 전
  },
  {
    id: '2',
    user: { name: '이디자이너', avatar: '/DefaultProfile.jpg' },
    type: 'like',
    content: '디자인 시안',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30분 전
  },
  {
    id: '3',
    user: { name: '박개발', avatar: '/DefaultProfile.jpg' },
    type: 'complete',
    content: '로그인 기능 구현',
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1시간 전
  },
  {
    id: '4',
    user: { name: '최신입', avatar: '/DefaultProfile.jpg' },
    type: 'post',
    content: '새로운 질문이 있습니다',
    target: '질문 게시판',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3시간 전
  },
];

const getActivityIcon = (type: ActivityType) => {
  switch (type) {
    case 'comment':
      return <MessageSquare className="w-4 h-4 text-blue-500" />;
    case 'like':
      return <ThumbsUp className="w-4 h-4 text-pink-500" />;
    case 'follow':
      return <UserPlus className="w-4 h-4 text-green-500" />;
    case 'post':
      return <FileText className="w-4 h-4 text-purple-500" />;
    case 'complete':
      return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    default:
      return null;
  }
};

export default function RecentActivities() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Format dates after component mounts
    const formattedActivities = sampleActivities.map(activity => ({
      ...activity,
      formattedTime: formatDistanceToNow(activity.timestamp, {
        addSuffix: true,
        locale: ko
      })
    }));
    setActivities(formattedActivities);
  }, []);

  const getActivityMessage = (activity: Activity & { formattedTime?: string }) => {
    const { user, type, content, target, formattedTime } = activity;

    const userElement = <span className="font-medium text-text-primary">{user.name}</span>;
    const contentElement = <span className="font-medium text-text-primary">{content}</span>;
    const targetElement = target ? <span className="text-blue-500">{target}</span> : null;

    switch (type) {
      case 'comment':
        return (
          <div>
            {userElement}님이 {targetElement}에 댓글을 남겼어요: &quot;{contentElement}&quot;
            {isClient && formattedTime && (
              <div className="text-xs text-text-secondary mt-1">{formattedTime}</div>
            )}
          </div>
        );
      case 'like':
        return (
          <div>
            {userElement}님이 {contentElement}에 좋아요를 눌렀어요
            {isClient && formattedTime && (
              <div className="text-xs text-text-secondary mt-1">{formattedTime}</div>
            )}
          </div>
        );
      case 'complete':
        return (
          <div>
            {userElement}님이 {contentElement}를 완료했어요! 🎉
            {isClient && formattedTime && (
              <div className="text-xs text-text-secondary mt-1">{formattedTime}</div>
            )}
          </div>
        );
      case 'post':
        return (
          <div>
            {userElement}님이 {targetElement}에 새로운 게시글을 작성했어요: &quot;{contentElement}&quot;
            {isClient && formattedTime && (
              <div className="text-xs text-text-secondary mt-1">{formattedTime}</div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-component-background border border-component-border rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-text-primary text-lg flex items-center gap-2">
            <span>📢</span>
            <span>최근 활동</span>
          </h3>
          <button
            className="text-text-primary cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? '활동 내역 접기' : '활동 내역 펼치기'}
          >
            <ChevronDown
              className={`transition-transform duration-200 ${isExpanded ? '-rotate-180' : ''}`}
            />
          </button>
        </div>
      </div>
      <div className={`px-4 transition-all duration-300 overflow-y-auto ${isExpanded ? 'max-h-96 pb-4' : 'max-h-0'}`}>
        {isExpanded && (
          <div className="space-y-4">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-component-secondary-background transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-component-tertiary-background flex items-center justify-center">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="text-sm text-text-secondary leading-tight">
                    {getActivityMessage(activity)}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-text-secondary text-sm">
                최근 활동이 없습니다
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}