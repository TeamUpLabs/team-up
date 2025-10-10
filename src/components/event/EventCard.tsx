import { Event, EventSize, EventColor } from "@/types/event/Event";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";

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

  return (
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

        {event.image && (
          <div className="relative flex-1 overflow-hidden rounded-lg">
            <Image src={event.image} alt={event.title} className="object-cover" fill />
          </div>
        )}

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

          <button className="w-full flex items-center justify-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-primary/20 hover:scale-[1.02] group-hover:gap-3 focus:outline-none" aria-label={`View details for ${event.title}`}>
            View Details
            <ArrowRight className="h-4 w-4 transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110" />
          </button>
        </div>
      </div>
    </div>
  )
}