import React from "react";
import Select from "@/components/ui/Select";
import { collaborationStyles, projectTypes, preferred_roles } from "@/types/user/CollaborationPreference";

interface SignupStep5Props {
  collaborationStyle: string;
  setCollaborationStyle: (style: string) => void;
  projectType: string;
  setProjectType: (type: string) => void;
  role: string;
  preferred_role: string;
  setPreferredRole: (role: string) => void;
  workingHours: {
    timezone: string;
    start: string;
    end: string;
    preferred_project_length?: string;
  };
  onWorkingHoursChange: (name: string, value: string) => void;
}

export default function SignupStep5({
  collaborationStyle,
  setCollaborationStyle,
  projectType,
  setProjectType,
  role,
  preferred_role,
  setPreferredRole,
  workingHours,
  onWorkingHoursChange,
}: SignupStep5Props) {
  // Convert time string to minutes since midnight for easier comparison
  const toMinutes = (time: string | undefined): number => {
    if (!time) return 0;
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + (minutes || 0);
  };

  // Format minutes to HH:MM string
  const formatMinutes = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  // Generate time options from 00:00 to 23:00 with 1-hour intervals
  const generateTimeOptions = () => {
    const options = [];
    const totalHoursInDay = 24;

    for (let hour = 0; hour < totalHoursInDay; hour++) {
      const timeString = formatMinutes(hour * 60);
      options.push({
        name: "time",
        value: timeString,
        label: timeString,
      });
    }
    return options;
  };

  const TIME_OPTIONS = generateTimeOptions();
  
  // Filter end time options to be after the selected start time
  const getEndTimeOptions = () => {
    if (!workingHours.start) return [];
    const startMinutes = toMinutes(workingHours.start);
    return TIME_OPTIONS.filter(option => toMinutes(option.value) > startMinutes);
  };

  return (
    <div className="space-y-6">
      <div>
        <label
          htmlFor="collaborationStyle"
          className="block text-sm font-medium text-text-secondary mb-3"
        >
          협업 스타일
        </label>
        <div className="grid grid-cols-2 gap-4">
          {collaborationStyles.map((style) => (
            <button
              key={style.value}
              type="button"
              className={`p-6 rounded-lg border border-component-border ${
                collaborationStyle === style.value
                  ? "border-point-color-indigo bg-point-color-indigo/30"
                  : "border-component-border bg-component-secondary-background hover:bg-component-tertiary-background hover:border-point-color-indigo"
              } transition-all duration-200 flex flex-col items-center cursor-pointer`}
              onClick={() => setCollaborationStyle(style.value)}
            >
              <style.icon className="h-10 w-10 mb-3 text-point-color-indigo" />
              <span className="text-lg font-medium text-text-primary">
                {style.label}
              </span>
              <span className="text-xs text-text-secondary mt-2 text-center">
                {style.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="collaborationStyle"
          className="block text-sm font-medium text-text-secondary mb-3"
        >
          선호 프로젝트 타입
        </label>
        <div className="grid grid-cols-3 gap-4">
          {projectTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              className={`p-6 rounded-lg border border-component-border ${
                projectType === type.value
                  ? "border-point-color-indigo bg-point-color-indigo/30"
                  : "border-component-border bg-component-secondary-background hover:bg-component-tertiary-background hover:border-point-color-indigo"
              } transition-all duration-200 flex flex-col items-center cursor-pointer`}
              onClick={() => setProjectType(type.value)}
            >
              <type.icon className="h-10 w-10 mb-3 text-point-color-indigo" />
              <span className="text-lg font-medium text-text-primary">
                {type.label}
              </span>
              <span className="text-xs text-text-secondary mt-2 text-center">
                {type.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Select
        options={preferred_roles[role as keyof typeof preferred_roles]}
        value={preferred_role}
        onChange={(value) => setPreferredRole(value as string)}
        placeholder="선호 역할을 선택해주세요"
        label="선호 역할"
      />

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-3">
          선호 시간대
        </label>
        <div className="grid grid-cols-3 gap-2">
          <Select
            value={workingHours.timezone}
            onChange={(value) => onWorkingHoursChange("timezone", value as string)}
            options={[
              {
                name: "workingHours.timezone",
                value: "Asia/Seoul",
                label: "한국 표준시 (KST)",
              },
              {
                name: "workingHours.timezone",
                value: "UTC",
                label: "세계 표준시 (UTC)",
              },
              {
                name: "workingHours.timezone",
                value: "America/New_York",
                label: "동부 표준시 (EST)",
              },
              {
                name: "workingHours.timezone",
                value: "America/Los_Angeles",
                label: "태평양 표준시 (PST)",
              },
            ]}
            placeholder="시간대"
            className="!w-full"
          />

          <Select
            options={TIME_OPTIONS}
            value={workingHours.start}
            onChange={(value) => {
              onWorkingHoursChange("start", value as string);
              // If end time is before new start time, reset it
              if (workingHours.end && toMinutes(workingHours.end) <= toMinutes(value as string)) {
                onWorkingHoursChange("end", "");
              }
            }}
            placeholder="시작 시간"
            className="!w-full"
          />

          <Select
            options={getEndTimeOptions()}
            value={workingHours.end}
            onChange={(value) => onWorkingHoursChange("end", value as string)}
            placeholder={workingHours.start ? "종료 시간" : "시작 시간을 먼저 선택"}
            className="!w-full"
            disabled={!workingHours.start}
          />
        </div>
      </div>

      <Select
        options={[
          {
            name: "preferred_project_length",
            value: "short",
            label: "짧음",
          },
          {
            name: "preferred_project_length",
            value: "medium",
            label: "보통",
          },
          {
            name: "preferred_project_length",
            value: "long",
            label: "길음",
          },
        ]}
        value={workingHours.preferred_project_length || ""}
        onChange={(value) => onWorkingHoursChange("preferred_project_length", value as string)}
        placeholder="선호 프로젝트 기간을 선택해주세요"
        className="!w-full"
        label="선호 프로젝트 기간"
      />
    </div>
  );
}
