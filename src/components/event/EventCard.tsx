"use client";

import { useState } from "react";
import { Event, EventSize, EventColor } from "@/types/event/Event";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Calendar, MapPin, Users, ArrowRight, Tag, Clock, CalendarRange, Building } from "lucide-react";
import BottomSheet from "@/components/ui/BottomSheet";
import Accordion from "@/components/ui/Accordion";
import Badge from "@/components/ui/Badge";
import { useTheme } from "@/contexts/ThemeContext";

interface EventCardProps {
  event: Event;
}

const sizeClasses: Record<EventSize, string> = {
  small: "md:col-span-1 md:row-span-1",
  medium: "md:col-span-1 md:row-span-2",
  large: "md:col-span-2 md:row-span-2",
}

const colorClasses: Record<EventColor, string> = {
  violet: "from-violet-500/20 via-violet-500/10 to-violet-500/5 border-violet-500/20 hover:border-violet-500/40",
  green: "from-green-500/20 via-green-500/10 to-green-500/5 border-green-500/20 hover:border-green-500 /40",
  pink: "from-pink-500/20 via-pink-500/10 to-pink-500/5 border-pink-500/20 hover:border-pink-500/40",
  emerald: "from-emerald-500/20 via-emerald-500/10 to-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40",
  amber: "from-amber-500/20 via-amber-500/10 to-amber-500/5 border-amber-500/20 hover:border-amber-500/40",
  red: "from-red-500/20 via-red-500/10 to-red-500/5 border-red-500/20 hover:border-red-500/40",
  blue: "from-blue-500/20 via-blue-500/10 to-blue-500/5 border-blue-500/20 hover:border-blue-500/40",
}

export default function EventCard({ event }: EventCardProps) {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const { isDark } = useTheme();

  return (
    <>
      <div
        className={cn(
          "group relative overflow-hidden rounded-3xl border-4 !border-white bg-gradient-to-br transition-all duration-300 shadow-xl hover:scale-[1.02] hover:shadow-2xl",
          sizeClasses[event.size],
          colorClasses[event.color as keyof typeof colorClasses],
        )}
      >

        {/* Content */}
        <div className="relative flex h-full flex-col gap-4 justify-between p-6 lg:p-8">
          {/* Top Section */}
          <div className="space-y-3">
            <div className="inline-flex items-center rounded-full bg-component-background/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide backdrop-blur-sm shadow-sm">
              {event.type}
            </div>
            <h3 className="text-balance text-xl font-bold leading-tight lg:text-2xl xl:text-3xl">{event.title}</h3>
            <p className="text-pretty text-sm text-muted-foreground/90 leading-relaxed">{event.description}</p>
          </div>

          {/* Bottom Section */}
          <div className="space-y-4">
            <div className="grid gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground/80">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground/80">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground/80">
                <div className="flex items-center gap-2 text-muted-foreground/80">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{event.attendees} attending</span>
                </div>
                <span className="font-semibold text-primary">{event.price}</span>
              </div>
            </div>

            <button
              onClick={() => setIsBottomSheetOpen(true)}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-primary/20 hover:scale-[1.02] group-hover:gap-3 focus:outline-none cursor-pointer"
              aria-label={`View details for ${event.title}`}
            >
              View Details
              <ArrowRight className="h-4 w-4 transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110" />
            </button>
          </div>
        </div>
      </div>

      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        size="full"
      >
        <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-8">
          {/* Hero Image */}
          <div className="relative aspect-video overflow-hidden rounded-2xl border-4 border-white shadow-lg">
            <Image src={event.image || "/placeholder.svg"} alt={event.title} className="object-cover" fill />
            <div className="absolute left-4 top-4">
              <span className="inline-block rounded-full bg-white px-4 py-1.5 text-xs font-bold text-black uppercase tracking-wider shadow-lg">
                {event.type}
              </span>
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-3">
            <h2 className="text-balance text-3xl font-black leading-tight lg:text-4xl">{event.title}</h2>
            <p className="text-pretty text-base text-foreground/70 lg:text-lg">
              {event.fullDescription ||
                event.description ||
                "Join us for an amazing event filled with learning, networking, and innovation. Connect with like-minded individuals and expand your horizons."}
            </p>
          </div>

          {/* Event Details Grid */}
          <div className="grid gap-4 rounded-2xl border-2 border-component-border bg-component-tertiary-background/30 p-5">
            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-5 w-5 text-text-secondary" />
              <div>
                <p className="text-sm font-medium text-text-secondary">Date & Time</p>
                <p className="font-bold">{event.date}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 text-text-secondary" />
              <div>
                <p className="text-sm font-medium text-text-secondary">Location</p>
                <p className="font-bold">{event.location}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="mt-0.5 h-5 w-5 text-text-secondary" />
              <div>
                <p className="text-sm font-medium text-text-secondary">Attendees</p>
                <p className="font-bold">{event.attendees} people registered</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Tag className="mt-0.5 h-5 w-5 text-text-secondary" />
              <div>
                <p className="text-sm font-medium text-text-secondary">Price</p>
                <p className="font-bold">{event.price}</p>
              </div>
            </div>
          </div>

          {/* Organizer Info */}
          {event.organizer && (
            <Accordion title="주최" icon={Building}>
              <p className="font-medium">{event.organizer}</p>
            </Accordion>
          )}

          <Accordion title="스케줄" icon={CalendarRange}>
            <div className="flex flex-col gap-2">
              {event.schedule.length > 0 ? (
                event.schedule.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded-md">
                    <Clock className="h-5 w-5" />
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-text-secondary text-sm">등록된 세션이 없습니다.</p>
                </div>
              )}
            </div>
          </Accordion>

          <Accordion title={`태그 (${event.tags.length})`} icon={Tag}>
            <div className="flex flex-wrap gap-2">
              {event.tags.length > 0 ? (
                event.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    content={tag}
                    color="fuchsia"
                    className="!text-xs !font-medium !px-2 !py-1 !rounded-full"
                  />
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-text-secondary text-sm">등록된 태그가 없습니다.</p>
                </div>
              )}
            </div>
          </Accordion>

          <button
            className={`w-full flex items-center justify-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-semibold transition-all duration-300 hover:bg-primary/20 focus:outline-none cursor-pointer active:scale-95 ${isDark ? "bg-white text-black" : "bg-black text-white"}`}
          >
            <span>참석하기</span>
          </button>
        </div>
      </BottomSheet>
    </>
  )
}