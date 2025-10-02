import Image from "next/image";
import BottomSheet from "@/components/ui/BottomSheet";
import Badge from "@/components/ui/Badge";
import { useState } from "react";
import { Mentor } from "@/app/mentoring/page";
import { getStatusInfo } from "@/utils/getStatusColor";
import { Star, MapPin, CircleCheck } from "lucide-react";

export default function MentorCard({ mentor }: { mentor: Mentor }) {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const statusInfo = getStatusInfo(mentor.user.status);

  return (
    <>
      <div
        className="flex flex-col gap-4 bg-transparent border border-component-border rounded-lg p-4 hover:translate-y-[-5px] transition-all hover:shadow-md hover:shadow-component-border-hover cursor-pointer"
        onClick={() => setIsBottomSheetOpen(true)}
      >
        <div className="flex items-center gap-4">
          <div className="bg-component-tertiary-background rounded-full w-16 h-16">
            {mentor.user.profile_image ? (
              <div className="relative">
                <Image
                  src={mentor.user.profile_image}
                  alt={mentor.user.name}
                  className="rounded-full"
                  width={100}
                  height={100}
                />
                <span
                  className={`absolute bottom-0 right-0 w-4 h-4 ${statusInfo.indicator} rounded-full border-2 border-component-background`}
                  title={statusInfo.label}
                ></span>
              </div>
            ) : (
              <div className="relative">
                <div className={`w-[70px] h-[70px] rounded-full bg-component-secondary-background flex items-center justify-center text-2xl font-bold text-gray-700 ring-2 ${statusInfo.ringColor} ring-offset-2`}>
                  {mentor.user.name.charAt(0).toUpperCase()}
                </div>
                <span
                  className={`absolute bottom-0 right-0 w-4 h-4 ${statusInfo.indicator} rounded-full border-2 border-white`}
                  title={statusInfo.label}
                ></span>
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <h3 className="text-text-primary text-lg font-semibold">{mentor.user.name}</h3>
            <p className="text-text-secondary text-sm">{mentor.user.job}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Star className="text-yellow-500 fill-yellow-500 w-5 h-5" />
            <span className="font-medium text-sm">{parseFloat((mentor.reviews.map((review) => review.rating).reduce((a, b) => a + b, 0) / mentor.reviews.length).toFixed(1))}</span>
          </div>
          <span className="text-text-secondary text-sm">{mentor.sessions.length} sessions</span>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span className="text-text-primary text-sm font-semibold">Location</span>
          </div>
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

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <CircleCheck className="w-4 h-4" />
            <span className="text-text-primary text-sm font-semibold">Available for</span>
          </div>
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
      </div>

      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        title={`${mentor.user.name} - ${mentor.user.job}`}
        size="full"
      >
        <div className="flex flex-col gap-6">
          {/* Profile Image and Basic Info */}
          <div className="flex items-center gap-4">
            <Image
              src={mentor.user.profile_image}
              alt={mentor.user.name}
              className="rounded-full w-20 h-20"
              width={80}
              height={80}
            />
            <div className="flex flex-col">
              <h3 className="text-xl font-semibold text-text-primary">{mentor.user.name}</h3>
              <p className="text-text-secondary">{mentor.user.job}</p>
              <p className="text-text-tertiary text-sm">경력 {mentor.experience}년</p>
            </div>
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-2">
            <h4 className="text-lg font-semibold text-text-primary">소개</h4>
            <p className="text-text-secondary">{mentor.bio}</p>
          </div>

          {/* Available For */}
          <div className="flex flex-col gap-2">
            <h4 className="text-lg font-semibold text-text-primary">제공 가능한 서비스</h4>
            <div className="flex flex-wrap gap-2">
              {mentor.availablefor.map((af, idx) => (
                <Badge
                  key={idx}
                  color="violet"
                  content={af}
                  className="!text-sm !py-1 !px-3"
                />
              ))}
            </div>
          </div>

          {/* Topics */}
          <div className="flex flex-col gap-2">
            <h4 className="text-lg font-semibold text-text-primary">전문 분야</h4>
            <div className="flex flex-wrap gap-2">
              {mentor.topic.map((topic, idx) => (
                <Badge
                  key={idx}
                  color="blue"
                  content={topic}
                  className="!text-sm !py-1 !px-3"
                />
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="flex flex-col gap-2">
            <h4 className="text-lg font-semibold text-text-primary">활동 지역</h4>
            <div className="flex flex-wrap gap-2">
              {mentor.location.map((location, idx) => (
                <Badge
                  key={idx}
                  color="orange"
                  content={location}
                  className="!text-sm !py-1 !px-3"
                />
              ))}
            </div>
          </div>
        </div>
      </BottomSheet>
    </>
  );
}