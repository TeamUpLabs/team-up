import React, { useState } from 'react';
import { Plus, Milestone, Calendar, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import SelectMilestoneModal from '@/components/project/task/SelectMilestoneModal';
import MilestoneCreateModal from '@/components/project/milestone/MilestoneCreateModal';
import ScheduleCreateModal from '@/components/project/calendar/ScheduleCreateModal';


interface QuickActionItem {
  id: string;
  icon: React.ReactElement;
  label: string;
  bgColor: string;
  textColor: string;
  onClick?: () => void;
}

export default function QuickAction() {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  // const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const quickActions: QuickActionItem[] = [
    {
      id: 'new-task',
      icon: <Plus />,
      label: '새 작업',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      id: 'new-milestone',
      icon: <Milestone />,
      label: '마일스톤',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
    },
    {
      id: 'new-meeting',
      icon: <Calendar />,
      label: '일정',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      id: 'invite-member',
      icon: <UserPlus />,
      label: '팀원 초대',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600',
    },
  ];

  const handleActionClick = (actionId: string) => {
    switch (actionId) {
      case 'new-task':
        setIsTaskModalOpen(true);
        break;
      case 'new-milestone':
        setIsMilestoneModalOpen(true);
        break;
      case 'new-meeting':
        setIsMeetingModalOpen(true);
        break;
      // case 'invite-member':
      //   setIsInviteModalOpen(true);
      //   break;
      default:
        break;
    }
  };

  return (
    <div className="bg-component-background rounded-md border border-component-border shadow-sm overflow-hidden">
      <div className="p-6">
        <h2 className="text-text-primary text-lg font-semibold mb-6">빠른 실행</h2>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon.type;
            return (
              <button
                key={action.id}
                onClick={() => handleActionClick(action.id)}
                className={cn(
                  "flex flex-col gap-2 items-center justify-center p-4 rounded-md",
                  "bg-component-secondary-background hover:bg-component-tertiary-background border border-component-border transition-colors",
                  "h-28 cursor-pointer active:scale-95"
                )}
              >
                <Icon className={cn("w-5 h-5", action.textColor)} />
                <span className="text-text-primary text-sm font-medium">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <SelectMilestoneModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      />

      <MilestoneCreateModal
        isOpen={isMilestoneModalOpen}
        onClose={() => setIsMilestoneModalOpen(false)}
      />

      <ScheduleCreateModal
        isOpen={isMeetingModalOpen}
        onClose={() => setIsMeetingModalOpen(false)}
      />
    </div>
  );
}