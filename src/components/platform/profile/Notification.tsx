"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/Switch";
import { Info } from "lucide-react";
import { updateUserProfile } from "@/hooks/getMemberData";
import { User } from "@/types/user/User";
import Badge from "@/components/ui/Badge";

interface NotificationProps {
  notificationSettings: User['notification_settings'];
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

export default function Notification({ notificationSettings, setUser }: NotificationProps) {  const [emailEnabled, setEmailEnabled] = useState<boolean>(Boolean(notificationSettings.emailEnable));
  const [taskNotification, setTaskNotification] = useState<boolean>(Boolean(notificationSettings.taskNotification));
  const [milestoneNotification, setMilestoneNotification] = useState<boolean>(Boolean(notificationSettings.milestoneNotification));
  const [scheduleNotification, setScheduleNotification] = useState<boolean>(Boolean(notificationSettings.scheduleNotification));
  const [deadlineNotification, setDeadlineNotification] = useState<boolean>(Boolean(notificationSettings.deadlineNotification));
  const [weeklyReport, setWeeklyReport] = useState<boolean>(Boolean(notificationSettings.weeklyReport));
  const [pushNotification, setPushNotification] = useState<boolean>(Boolean(notificationSettings.pushNotification));
  const [securityNotification, setSecurityNotification] = useState<boolean>(Boolean(notificationSettings.securityNotification));


  const handleEmailToggle = async (name: string, newValue: boolean) => {
    let newEmailEnabled = emailEnabled;
    let newTaskNotification = taskNotification;
    let newMilestoneNotification = milestoneNotification;
    let newScheduleNotification = scheduleNotification;
    let newDeadlineNotification = deadlineNotification;
    let newWeeklyReport = weeklyReport;

    if (name === 'emailEnabled') {
      newEmailEnabled = newValue;
      if (!newValue) {
        newTaskNotification = false;
        newMilestoneNotification = false;
        newScheduleNotification = false;
        newDeadlineNotification = false;
        newWeeklyReport = false;
      } else {
        newTaskNotification = true;
        newMilestoneNotification = true;
        newScheduleNotification = true;
        newDeadlineNotification = true;
        newWeeklyReport = true;
      }
    } else if (name === 'taskNotification') {
      newTaskNotification = newValue;
      newEmailEnabled = newValue || emailEnabled;
    } else if (name === 'milestoneNotification') {
      newMilestoneNotification = newValue;
      newEmailEnabled = newValue || emailEnabled;
    } else if (name === 'scheduleNotification') {
      newScheduleNotification = newValue;
      newEmailEnabled = newValue || emailEnabled;
    } else if (name === 'deadlineNotification') {
      newDeadlineNotification = newValue;
      newEmailEnabled = newValue || emailEnabled;
    } else if (name === 'weeklyReport') {
      newWeeklyReport = newValue;
      newEmailEnabled = newValue || emailEnabled;
    }

    setEmailEnabled(newEmailEnabled);
    setTaskNotification(newTaskNotification);
    setMilestoneNotification(newMilestoneNotification);
    setScheduleNotification(newScheduleNotification);
    setDeadlineNotification(newDeadlineNotification);
    setWeeklyReport(newWeeklyReport);

    const response = await updateUserProfile({
      notification_settings: {
        emailEnable: newEmailEnabled ? 1 : 0,
        taskNotification: newTaskNotification ? 1 : 0,
        milestoneNotification: newMilestoneNotification ? 1 : 0,
        scheduleNotification: newScheduleNotification ? 1 : 0,
        deadlineNotification: newDeadlineNotification ? 1 : 0,
        weeklyReport: newWeeklyReport ? 1 : 0,
        pushNotification: pushNotification ? 1 : 0,
        securityNotification: securityNotification ? 1 : 0,
      }
    });

    setUser(response);
  };

  return (
    <div className="flex flex-col gap-4 border border-component-border rounded-lg px-6">
      <div className="divide-y divide-component-border">
        <div className="flex flex-col gap-4 py-6">
          <h2 className="text-lg font-semibold text-text-secondary">이메일 알림</h2>
          <Badge
            content={
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                <p className="text-sm">알림 설정은 자동으로 저장됩니다.</p>
              </div>
            }
            color="indigo"
            className="!p-3"
          />
          <Switch
            checked={emailEnabled}
            onChange={() => handleEmailToggle('emailEnabled', !emailEnabled)}
            label="Email 알림"
            description="Email 알림을 받을 수 있습니다."
            className="justify-between"
          />
          <Switch
            checked={taskNotification}
            onChange={() => handleEmailToggle('taskNotification', !taskNotification)}
            label="Task 할당 알림"
            description="Task가 할당되면 알림을 받을 수 있습니다."
            className="justify-between"
          />
          <Switch
            checked={milestoneNotification}
            onChange={() => handleEmailToggle('milestoneNotification', !milestoneNotification)}
            label="Milestone 할당 알림"
            description="Milestone이 할당되면 알림을 받을 수 있습니다."
            className="justify-between"
          />
          <Switch
            checked={scheduleNotification}
            onChange={() => handleEmailToggle('scheduleNotification', !scheduleNotification)}
            label="회의 및 이벤트 알림"
            description="다가오는 회의 및 이벤트에 알림을 받을 수 있습니다."
            className="justify-between"
          />
          <Switch
            checked={deadlineNotification}
            onChange={() => handleEmailToggle('deadlineNotification', !deadlineNotification)}
            label="마감 임박 알림"
            description="다가오는 마감일에 알림을 받을 수 있습니다."
            className="justify-between"
          />
          <Switch
            checked={weeklyReport}
            onChange={() => handleEmailToggle('weeklyReport', !weeklyReport)}
            label="주간 보고서"
            description="주간 보고서를 받을 수 있습니다."
            className="justify-between"
          />
        </div>

        <div className="flex flex-col gap-4 py-6">
          <h2 className="text-lg font-semibold text-text-secondary">푸시 알림</h2>
          <Switch
            checked={pushNotification}
            onChange={() => setPushNotification(!pushNotification)}
            label="Push 알림"
            description="Push 알림을 받을 수 있습니다."
            className="justify-between"
          />
        </div>

        <div className="flex flex-col gap-4 py-6">
          <h2 className="text-lg font-semibold text-text-secondary">보안 및 계정</h2>
          <Switch
            checked={securityNotification}
            onChange={() => setSecurityNotification(!securityNotification)}
            label="보안 알림"
            description="보안 관련된 알림을 받을 수 있습니다."
            className="justify-between"
          />
        </div>
      </div>
    </div>
  );
}