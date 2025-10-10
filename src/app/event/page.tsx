"use client";

import { useState, useEffect } from "react";
import { Event } from "@/types/event/Event";
import EventCard from "@/components/event/EventCard";
import SearchBar from "@/components/event/SearchBar";
import { Sparkles, Code, Mic, Users, Rocket } from "lucide-react";
import events from "../../../public/json/events.json";
import { assignEventSizes } from "@/lib/eventUtils";

const categories = [
  { id: "all", label: "All Events", icon: Sparkles },
  { id: "hackathon", label: "Hackathons", icon: Code },
  { id: "conference", label: "Conferences", icon: Mic },
  { id: "meetup", label: "Meetups", icon: Users },
]

export default function EventPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchEventQuery, setSearchEventQuery] = useState("");
  const [displayedEventsCount, setDisplayedEventsCount] = useState(10);

  // 필터가 변경될 때마다 표시 카운트를 초기화
  useEffect(() => {
    setDisplayedEventsCount(10);
  }, [activeCategory, searchEventQuery]);

  const eventsWithSizes = assignEventSizes(events as Event[]);

  const filteredEvents = activeCategory === "all" ? eventsWithSizes : eventsWithSizes.filter((event) => event.type === activeCategory)

  const filteredEventsBySearch = filteredEvents.filter((event) => {
    return event.title.toLowerCase().includes(searchEventQuery.toLowerCase()) ||
      event.type.toLowerCase().includes(searchEventQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchEventQuery.toLowerCase())
  })

  const displayedEvents = filteredEventsBySearch.slice(0, displayedEventsCount);

  const handleLoadMore = () => {
    setDisplayedEventsCount(prev => Math.min(prev + 5, filteredEventsBySearch.length));
  };

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-6xl font-black">DISCOVER</h1>
          <p className="text-text-secondary text-xl">Find your next adventure in hackathons, conferences, and meetups</p>
        </div>
        <SearchBar searchEventQuery={searchEventQuery} setSearchEventQuery={setSearchEventQuery} />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-full transition-all hover:scale-105 ${activeCategory === category.id ? "bg-blue-400 text-white" : "border border-component-border hover:bg-teal-500 hover:text-white"}`}
            >
              <Icon className="h-4 w-4" />
              {category.label}
            </button>
          )
        })}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr">
        {displayedEvents.map((event) => (
          <EventCard key={event.id} event={event as Event} />
        ))}
      </div>

      {/* Load More */}
      {displayedEventsCount < filteredEventsBySearch.length && (
        <div className="flex justify-center pt-8">
          <button
            onClick={handleLoadMore}
            className="flex items-center gap-2 rounded-full px-4 py-2 text-sm border border-component-border font-semibold text-text-primary transition-all duration-300 hover:scale-[1.02] focus:outline-none hover:bg-teal-500 hover:text-white"
            aria-label="Load more events"
          >
            <Rocket className="h-4 w-4" />
            Load More Events
          </button>
        </div>
      )}
    </div>
  );
}