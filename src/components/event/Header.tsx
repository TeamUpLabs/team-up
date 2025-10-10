"use client";

import UserDropdown from "@/components/platform/UserDropdown";
import { Home, Users, Speech, Ticket } from "lucide-react";
import SlideingMenu, { IconProps } from "@/components/ui/SlideingMenu";

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

  return (
    <div className="w-full">
      <header className="sticky top-0 z-10 bg-component-background min-h-10 border-b border-component-border">
        <div className="px-3 py-2 flex items-center gap-3 w-full justify-between">
          <div className="flex items-center gap-2">
            <SlideingMenu icons={icons} />

            <div className="flex flex-col">
              <nav aria-label="Breadcrumb">
                <ol className="flex items-center gap-2 text-xs">
                  <li>
                    <span className="font-medium text-point-color-purple">Dashboard</span>
                  </li>
                  <li className="rtl:rotate-180">
                    <span className="text-text-secondary">/</span>
                  </li>
                  <li>
                    <span className="font-medium text-text-primary">Events</span>
                  </li>
                </ol>
              </nav>
              <span className="font-semibold text-text-primary">Events</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <UserDropdown />
          </div>
        </div>
      </header>
    </div>
  );
}