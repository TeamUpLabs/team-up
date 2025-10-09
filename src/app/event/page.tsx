import { Event } from "@/types/event/Event";
import EventCard from "@/components/event/EventCard";

const events: Event[] = [
  {
    id: 1,
    title: "AI Hackathon 2025",
    type: "hackathon",
    date: "Mar 15-17, 2025",
    location: "San Francisco, CA",
    attendees: 500,
    price: "Free",
    image: "/placeholder.svg?height=400&width=600",
    size: "large",
    color: "primary",
    description: "Build the future of AI in 48 hours",
  },
  {
    id: 2,
    title: "Design Systems Conference",
    type: "conference",
    date: "Apr 5, 2025",
    location: "New York, NY",
    attendees: 1200,
    price: "$299",
    image: "/placeholder.svg?height=300&width=400",
    size: "medium",
    color: "secondary",
    description: "Learn from industry leaders",
  },
  {
    id: 3,
    title: "React Developers Meetup",
    type: "meetup",
    date: "Mar 20, 2025",
    location: "Austin, TX",
    attendees: 80,
    price: "Free",
    image: "/placeholder.svg?height=300&width=400",
    size: "small",
    color: "accent",
    description: "Monthly React community gathering",
  },
  {
    id: 4,
    title: "Web3 Summit",
    type: "conference",
    date: "May 10-12, 2025",
    location: "Miami, FL",
    attendees: 2000,
    price: "$499",
    image: "/placeholder.svg?height=400&width=600",
    size: "large",
    color: "chart-1",
    description: "The future of decentralized web",
  },
  {
    id: 5,
    title: "Startup Weekend",
    type: "hackathon",
    date: "Apr 1-3, 2025",
    location: "Seattle, WA",
    attendees: 150,
    price: "$99",
    image: "/placeholder.svg?height=300&width=400",
    size: "medium",
    color: "chart-2",
    description: "Launch your startup idea",
  },
  {
    id: 6,
    title: "Coffee & Code",
    type: "meetup",
    date: "Every Friday",
    location: "Portland, OR",
    attendees: 30,
    price: "Free",
    image: "/placeholder.svg?height=300&width=400",
    size: "small",
    color: "chart-3",
    description: "Casual coding sessions",
  },
  {
    id: 7,
    title: "DevOps Days",
    type: "conference",
    date: "Jun 8-9, 2025",
    location: "Boston, MA",
    attendees: 800,
    price: "$349",
    image: "/placeholder.svg?height=300&width=400",
    size: "medium",
    color: "chart-4",
    description: "Cloud & infrastructure best practices",
  },
  {
    id: 8,
    title: "Women in Tech Meetup",
    type: "meetup",
    date: "Mar 25, 2025",
    location: "Chicago, IL",
    attendees: 120,
    price: "Free",
    image: "/placeholder.svg?height=300&width=400",
    size: "small",
    color: "chart-5",
    description: "Empowering women in technology",
  },
]

export default function EventPage() {
  return (
    <div className="grid auto-rows-[280px] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}