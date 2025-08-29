import eventsData from '../../public/json/events.json';
import { ArrowRight, Users, MapPin, CalendarMonth } from "flowbite-react-icons/outline"
import Badge, { BadgeColor } from '@/components/ui/Badge';
import Link from 'next/link';

interface event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  participant: number;
}

export default function Events() {  const events: event[] = eventsData.slice(0, 3);
  const colorPalette = [
    {
      color: "green",
      borderColor: "border-green-500",
      iconColor: "text-green-500",
      textColor: "text-green-500",
      bgColor: "bg-green-500",
      hoverBgColor: "hover:bg-green-600",
    },
    {
      color: "purple",
      borderColor: "border-purple-500",
      iconColor: "text-purple-500",
      textColor: "text-purple-500",
      bgColor: "bg-purple-500",
      hoverBgColor: "hover:bg-purple-600",
    },
    {
      color: "blue",
      borderColor: "border-blue-500",
      iconColor: "text-blue-500",
      textColor: "text-blue-500",
      bgColor: "bg-blue-500", 
      hoverBgColor: "hover:bg-blue-600",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            다가오는 이벤트
          </span>
        </h2>
        <p className="text-xl text-text-primary">온라인과 오프라인에서 개최되는 다양한 개발자 이벤트에 참여하세요</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <div
            key={index}
            className={`bg-component-background border border-l-4
               ${colorPalette[index % colorPalette.length].borderColor}
               rounded-lg hover:-translate-y-1
              p-6 overflow-hidden space-y-4 transition-all duration-300`}
          >
            <div className="flex items-center justify-between">
              <Badge
                content={event.date}
                color={colorPalette[index % colorPalette.length].color as BadgeColor}
                className="!rounded-full !text-xs"
              />
              <div className="flex items-center gap-1 text-sm text-text-secondary">
                <Users className="h-4 w-4" />
                {event.participant}명 참여
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-text-primary font-bold">{event.title}</p>
              <p className="text-text-secondary font-semibold">{event.description}</p>
              <div className="flex items-center gap-1 text-sm text-text-secondary">
                <MapPin className={`${colorPalette[index % colorPalette.length].iconColor} h-4 w-4`} />
                {event.location}
              </div>
            </div>
            <button 
              className={`flex items-center gap-2 justify-self-center 
                ${colorPalette[index % colorPalette.length].textColor}
                p-2 cursor-pointer hover:underline`}
            >
              <CalendarMonth className="h-4 w-4" />
              <span>참여 신청하기</span>
            </button>
          </div>
        ))}
      </div>

      <Link
        href="#"
        className="flex group mt-12 justify-center w-full sm:w-fit justify-self-center"
      >
        <Badge
          content={
            <span className="flex items-center gap-2">
              모든 이벤트 보기
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </span>
          }
          color="fuchsia"
          className="!px-6 !py-2 !font-semibold flex !w-full sm:!w-fit !justify-center"
          isHover
        />
      </Link>
    </section>
  )
}