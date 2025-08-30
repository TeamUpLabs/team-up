import { useState } from "react";
import { Plus, ChevronDown } from "lucide-react";
import Image from "next/image";
import Badge from "@/components/ui/Badge";

export default function RecommendFollow() {
  const [isExpanded, setIsExpanded] = useState(true);

  const users = [
    { id: 1, name: "김민수", role: "developer", profile_image: "/DefaultProfile.jpg" },
    { id: 2, name: "이자인", role: "designer", profile_image: "/DefaultProfile.jpg" },
    { id: 3, name: "박다은", role: "planner", profile_image: "/DefaultProfile.jpg" },
  ];

  return (
    <div className="bg-component-background border border-component-border rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <span className="font-bold text-text-primary text-lg flex items-center gap-2">
            <span>🚀</span>
            <span>추천 팔로우</span>
          </span>
          <button
            className="text-text-primary cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <ChevronDown
              className={`transition-transform duration-200 ${isExpanded ? '-rotate-180' : ''}`}
            />
          </button>
        </div>
      </div>
      <div className={`px-4 transition-all duration-300 overflow-hidden space-y-4 ${isExpanded ? 'max-h-96 pb-4' : 'max-h-0'}`}>
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-component-tertiary-background">
                <Image
                  src={user.profile_image}
                  alt={user.name}
                  width={32}
                  height={32}
                  className="object-cover rounded-full ring-2 ring-offset-2 ring-red-500"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-text-primary">{user.name}</span>
                <span className="text-xs text-text-secondary">{user.role}</span>
              </div>
            </div>
            <button
              className="flex flex-shrink-0 self-center cursor-pointer active:scale-95 hover:scale-105 transition-all duration-200"
              onClick={() => {}}
            >
              <Badge
                content={
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span className="text-xs">팔로우</span>
                  </div>
                }
                color="violet"
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}