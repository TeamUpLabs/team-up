import Image from "next/image";
import { Mentor } from "@/app/mentoring/page";
import Badge from "@/components/ui/Badge";

export default function MentorCard({ mentor }: { mentor: Mentor }) {
  return (
    <div className="flex flex-col gap-4 bg-transparent border border-component-border rounded-lg p-4">
      <div className="bg-component-tertiary-background rounded-full w-16 h-16">
        <Image 
          src={mentor.profile_image} 
          alt={mentor.name} 
          className="rounded-full"
          width={100}
          height={100}
        />
      </div>

      <div className="flex flex-col">
        <h3 className="text-text-primary text-lg font-semibold">{mentor.name}</h3>
        <p className="text-text-secondary text-sm">{mentor.job}</p>
      </div>

      <div className="flex flex-col">
        <span className="text-text-secondary text-sm">{mentor.bio}</span>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-text-primary text-sm font-semibold">Available for</span>
        <div className="flex flex-wrap gap-2">
          {mentor.availablefor.slice(0, 3).map((af, idx) => (
            <Badge 
              key={idx} 
              color="violet" 
              content={af}
              className="!text-xs !py-0.5 !px-2 !rounded-full"
            />
          ))}
          {mentor.availablefor.length > 3 && (
            <Badge 
              color="violet" 
              content={`+${mentor.availablefor.length - 2}`}
              className="!text-xs !py-0.5 !px-2 !rounded-full"
            />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-text-primary text-sm font-semibold">Location</span>
        <div className="flex flex-wrap gap-2">
          {mentor.location.map((location, idx) => (
            <Badge 
              key={idx} 
              color="orange" 
              content={location}
              className="!text-xs !py-0.5 !px-2 !rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  )
}