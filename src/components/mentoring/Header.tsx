"use client";

import { useState } from "react";
import UserDropdown from "@/components/platform/UserDropdown";
import { Home, UserRoundPlus, Users, Speech, Ticket } from "lucide-react";
import SlideingMenu, { IconProps } from "@/components/ui/SlideingMenu";
import Badge from "@/components/ui/Badge";
import EnrollMentorModal from "@/components/mentoring/modal/EnrollMentorModal";

const icons: IconProps[] = [
  {
    icon: <Home className="w-5 h-5" />,
    label: "Home",
    href: "/",
  },
  {
    icon: <Users className="w-5 h-5" />,
    label: "community",
    href: "/community",
  },
  {
    icon: <Speech className="w-5 h-5"/>,
    label: "mentoring",
    href: "/mentoring",
  },
  {
    icon: <Ticket className="w-5 h-5"/>,
    label: "event",
    href: "/event",
  },
]

export default function Header() {
  const [isEnrollMentorModalOpen, setIsEnrollMentorModalOpen] = useState(false);

  return (
    <div className="w-full">
      <header className="sticky top-0 z-10 bg-component-background min-h-10 border-b border-component-border">
        <div className="px-3 py-2 flex items-center gap-3 w-full justify-between">
          <div className="flex items-center">
            <SlideingMenu icons={icons} />
          </div>
          <div className="flex items-center gap-6">
            <Badge
              content={
                <div className="flex items-center gap-2">
                  <UserRoundPlus className="w-4 h-4" />
                  <span className="font-semibold">멘토 등록하기</span>
                </div>
              }
              color="black"
              className="!px-3 !py-1 cursor-pointer active:scale-95"
              onClick={() => setIsEnrollMentorModalOpen(true)}
            />
            <UserDropdown />
          </div>
        </div>
        <EnrollMentorModal isOpen={isEnrollMentorModalOpen} onClose={() => setIsEnrollMentorModalOpen(false)} />
      </header>
    </div>
  );
}