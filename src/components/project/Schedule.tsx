'use client';

import Image from "next/image";
import { useProject } from "@/contexts/ProjectContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef, useEffect } from "react";
import { Task } from "@/types/Task";

const dummyMeetings = [
  {
    id: 1,
    title: "Sprint Planning",
    status: "Starting Soon",
    statusColor: "bg-yellow-100 text-yellow-600",
    platform: "Zoom Meeting",
    platformIcon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect width="20" height="20" rx="6" fill="#2563EB"/><path d="M6.5 7.5C6.5 6.94772 6.94772 6.5 7.5 6.5H12.5C13.0523 6.5 13.5 6.94772 13.5 7.5V12.5C13.5 13.0523 13.0523 13.5 12.5 13.5H7.5C6.94772 13.5 6.5 13.0523 6.5 12.5V7.5Z" fill="white"/><rect x="13" y="8.5" width="2" height="3" rx="0.5" fill="white"/></svg>
    ),
    time: "10:00 AM – 11:00 AM",
    members: [
      "/avatar1.png",
      "/avatar2.png"
    ]
  },
  {
    id: 2,
    title: "Design Handoff",
    status: "Scheduled",
    statusColor: "bg-green-100 text-green-600",
    platform: "Google Meeting",
    platformIcon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect width="20" height="20" rx="6" fill="#FBBF24"/><path d="M6.5 7.5C6.5 6.94772 6.94772 6.5 7.5 6.5H12.5C13.0523 6.5 13.5 6.94772 13.5 7.5V12.5C13.5 13.0523 13.0523 13.5 12.5 13.5H7.5C6.94772 13.5 6.5 13.0523 6.5 12.5V7.5Z" fill="white"/><rect x="13" y="8.5" width="2" height="3" rx="0.5" fill="white"/></svg>
    ),
    time: "01:00 PM – 02:00 PM",
    members: [
      "/avatar3.png",
      "/avatar4.png"
    ]
  }
];

export default function Schedule() {
  const { project } = useProject();
  const [activeTab, setActiveTab] = useState<'meetings' | 'tasks'>("meetings");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDeleteClick = () => {
    // Implement delete functionality here
    console.log('Delete button clicked');
    setShowDropdown(false);
  };

  return (
    <div className="col-span-1 sm:col-span-2 bg-component-background p-4 sm:p-6 rounded-lg shadow-md border border-component-border">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-text-primary">일정</h2>
        <div className="relative" ref={dropdownRef}>
          <button 
            className="flex items-center text-text-secondary hover:text-text-primary p-2 rounded-md border border-component-border"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <FontAwesomeIcon icon={faEllipsis} />
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-1 w-36 bg-component-secondary-background border border-component-border rounded-md shadow-lg z-10">
              <ul>
                <li>
                  <button 
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-component-tertiary-background flex items-center rounded-md"
                    onClick={handleDeleteClick}
                  >
                    <FontAwesomeIcon icon={faTrash} className="mr-2" />
                    삭제
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      {/* 탭 UI */}
      <div className="flex mb-4 bg-component-secondary-background rounded-lg overflow-hidden w-fit p-1">
        <button
          className={`px-6 py-2 rounded-lg text-base font-semibold transition-colors relative ${activeTab === 'meetings' ? 'bg-component-tertiary-background text-text-primary' : 'text-text-secondary'} `}
          onClick={() => {
            setActiveTab('meetings');
          }}
        >
          Meetings <span className="ml-1 text-xs font-bold text-red-500">4</span>
        </button>
        <button
          className={`px-6 py-2 rounded-lg text-base font-semibold transition-colors relative ${activeTab === 'tasks' ? 'bg-component-tertiary-background text-text-primary' : 'text-text-secondary'} `}
          onClick={() => {
            setActiveTab('tasks');
          }}
        >
          Task <span className="ml-1 text-xs font-bold text-gray-500">{project?.tasks?.length ?? 0}</span>
        </button>
      </div>
      {/* 탭별 내용 */}
      {activeTab === 'meetings' && (
        <div className="space-y-4">
          {dummyMeetings.map((meeting) => (
            <div key={meeting.id} className="bg-component-secondary-background border border-component-border rounded-xl p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-text-primary">{meeting.title}</span>
                  <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${meeting.statusColor}`}>{meeting.status}</span>
                </div>
                <span className="text-sm text-text-secondary font-medium">Start at <span className="text-text-primary font-bold">{meeting.time}</span></span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="flex items-center gap-1">{meeting.platformIcon}<span className="ml-1 text-xs font-medium text-text-secondary bg-component-tertiary-background px-2 py-1 rounded">{meeting.platform}</span></span>
                <div className="flex ml-auto gap-1">
                  {meeting.members.map((avatar, idx) => (
                    <Image key={idx} src={avatar} alt="member" className="w-7 h-7 rounded-full border-2 border-white -ml-2 first:ml-0" width={28} height={28} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          {(project?.tasks?.slice(0, 3) as Task[] ?? []).map((task) => (
            <div key={task.id} className="bg-component-secondary-background border border-component-border rounded-xl p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-text-primary">{task.title}</span>
                <span className="text-sm text-text-secondary font-medium">Due <span className="text-text-primary font-bold">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</span></span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${task.status === 'done' ? 'bg-green-100 text-green-600' : task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-500'}`}>{task.status}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${task.priority === 'high' ? 'bg-red-100 text-red-600' : task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-500'}`}>{task.priority}</span>
                <div className="flex ml-auto gap-1">
                  {task.assignee?.slice(0,2).map((member, idx) => (
                    <Image key={idx} src={member.profileImage || '/default-avatar.png'} alt="assignee" className="w-7 h-7 rounded-full border-2 border-white -ml-2 first:ml-0" width={28} height={28} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}