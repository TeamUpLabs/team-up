import Image from "next/image";
import BottomSheet from "@/components/ui/BottomSheet";
import Badge from "@/components/ui/Badge";
import { useState } from "react";
import { MentorExtended } from "@/types/mentoring/Mentor";
import { getStatusInfo } from "@/utils/getStatusColor";
import { Star, MapPin, CircleCheck, Shell, Calendar } from "lucide-react";
import Accordion from "@/components/ui/Accordion";
import { convertJobName } from "@/utils/ConvertJobName";
import NewSessionModal from "@/components/mentoring/modal/NewSessionModal";
import NewReviewModal from "@/components/mentoring/modal/NewReviewModal";

export default function MentorCard({ mentor }: { mentor: MentorExtended }) {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);
  const [isNewReviewModalOpen, setIsNewReviewModalOpen] = useState(false);

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
            <p className="text-text-secondary text-sm">{convertJobName(mentor.user.job)}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Star className="text-yellow-500 fill-yellow-500 w-5 h-5" />
            <span className="font-medium text-sm">
              {mentor.reviews.length > 0
                ? parseFloat((mentor.reviews.reduce((acc, review) => acc + review.rating, 0) / mentor.reviews.length).toFixed(1))
                : "0"}
            </span>
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
        size="full"
      >
        <div className="flex flex-col gap-6 max-w-3xl mx-auto">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-6">
              <div className="bg-component-tertiary-background rounded-lg w-32 h-32">
                <Image
                  src={mentor.user.profile_image}
                  alt={mentor.user.name}
                  className="rounded-lg"
                  width={128}
                  height={128}
                />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-text-primary text-xl font-semibold">{mentor.user.name}</h3>
                <p className="text-text-secondary">{convertJobName(mentor.user.job)}</p>
                <div className="flex flex-wrap gap-2">
                  {mentor.topic.map((topic, idx) => (
                    <Badge
                      key={idx}
                      color="fuchsia"
                      content={topic}
                      className="!text-xs !py-0.5 !px-2 !rounded-full"
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-component-tertiary-background/60 border border-component-border/60 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              <span className="text-sm font-medium">
                {mentor.reviews.length > 0
                  ? parseFloat((mentor.reviews.reduce((acc, review) => acc + review.rating, 0) / mentor.reviews.length).toFixed(1))
                  : "0"}
                <span className="text-text-secondary ml-1">({mentor.reviews.length}개 후기)</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-text-secondary text-sm font-medium">소개</span>
            <p className="text-text-primary text-sm font-semibold">{mentor.bio}</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <span className="text-text-secondary text-sm font-medium">경력</span>
              <p className="text-text-primary text-sm font-semibold">{mentor.experience}년</p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-text-secondary text-sm font-medium">장소</span>
              <p className="text-text-primary text-sm font-semibold">{mentor.location.join(', ')}</p>
            </div>
            <div className="col-span-2 flex flex-col gap-1">
              <span className="text-text-secondary text-sm font-medium">가능한 작업</span>
              <div className="flex flex-wrap gap-2">
                {mentor.availablefor.map((af, idx) => (
                  <Badge
                    key={idx}
                    color="violet"
                    content={af}
                    className="!text-xs !py-0.5 !px-2 !rounded-full"
                  />
                ))}
              </div>
            </div>
          </div>

          <Accordion title={`세션 (${mentor.sessions.length})`} icon={Shell}>
            <div className="flex flex-col gap-4">
              {mentor.sessions.length > 0 ? (
                mentor.sessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 border border-component-border rounded-lg hover:bg-component-tertiary-background/50 transition-colors cursor-pointer"
                  >
                    <div className="flex flex-col gap-2">
                      <h4 className="text-text-primary font-medium">{session.title}</h4>
                      {session.description && (
                        <p className="text-text-secondary text-sm">{session.description}</p>
                      )}
                      <div className="flex items-center text-xs text-text-secondary mt-2">
                        <Calendar className="w-3.5 h-3.5 mr-1.5" />
                        <span>
                          {new Date(session.start_date).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            weekday: 'short',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-text-secondary text-sm">등록된 세션이 없습니다.</p>
                </div>
              )}
            </div>
          </Accordion>

          <Accordion title={`후기 (${mentor.reviews.length})`} icon={Star}>
            <div className="flex flex-col gap-4">
              {mentor.reviews.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-text-secondary text-sm">등록된 후기가 없습니다.</p>
                </div>
              ) : (
                mentor.reviews.map((review, idx) => (
                  <div key={idx} className="border-b border-component-border/70 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${review.rating >= star ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-text-secondary">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-2 text-text-primary text-sm">{review.comment}</p>
                  </div>
                )))}
            </div>
          </Accordion>

          <div className="grid grid-cols-2 gap-2">
            <div
              onClick={() => {
                setIsBottomSheetOpen(false);
                setIsNewReviewModalOpen(true);
              }}
              className="flex items-center gap-4 w-full bg-transparent hover:bg-component-tertiary-background border border-component-border justify-center py-2 rounded-lg transition-colors duration-200 ease-in-out cursor-pointer active:scale-95">
              <Star className="w-5 h-5" />
              <span className="font-medium">후기 작성</span>
            </div>
            <div
              onClick={() => {
                setIsBottomSheetOpen(false);
                setIsNewSessionModalOpen(true);
              }}
              className="flex items-center gap-4 w-full bg-transparent hover:bg-component-tertiary-background border border-component-border justify-center py-2 rounded-lg transition-colors duration-200 ease-in-out cursor-pointer active:scale-95"
            >
              <Calendar className="w-5 h-5" />
              <span className="font-medium">세션 예약</span>
            </div>
          </div>
        </div>
      </BottomSheet>
      <NewSessionModal mentor={mentor} isOpen={isNewSessionModalOpen} onClose={() => setIsNewSessionModalOpen(false)} />
      <NewReviewModal mentor={mentor} isOpen={isNewReviewModalOpen} onClose={() => setIsNewReviewModalOpen(false)} />
    </>
  );
}