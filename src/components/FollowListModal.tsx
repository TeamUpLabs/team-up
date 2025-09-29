import ModalTemplete from "@/components/ModalTemplete";
import { UserBrief } from "@/types/brief/Userbrief";
import Image from "next/image";
import { FollowProvider, useFollow } from "@/contexts/FollowContext";
import { Check, UserPlus } from "lucide-react";
import Badge from "@/components/ui/Badge";

interface FollowListModalProps {
  isOpen: boolean;
  onClose: () => void;
  followList: UserBrief[];
  whatToFollow: string;
}

export default function FollowListModal({ isOpen, onClose, followList, whatToFollow }: FollowListModalProps) {
  const { isFollowing, followUser, unfollowUser } = useFollow();

  const handleFollow = async (userId: number) => {
    try {
      if (isFollowing(userId)) {
        await unfollowUser(userId);
      } else {
        await followUser(userId);
      }
    } catch (error) {
      console.error('Follow action failed:', error);
    }
  };

  const Header = (
    <h3 className="text-xl font-bold text-text-primary">
      {whatToFollow === "following" ? "팔로우 리스트" : "팔로워 리스트"}
    </h3>
  )
  return (
    <FollowProvider>
      <ModalTemplete isOpen={isOpen} onClose={onClose} header={Header}>
        <div className="min-h-[400px]">
          {!followList || followList.length === 0 ? (
            <p className="text-center text-text-secondary">{whatToFollow === "following" ? "팔로우가 없습니다." : "팔로워가 없습니다."}</p>
          ) : (
            followList?.map((user, index) => {
              const isFirst = index === 0;
              const isLast = index === followList?.length - 1;

              return (
                <div key={user.id} className={`bg-transparent p-2 hover:bg-component-tertiary-background cursor-pointer ${isFirst ? "rounded-t-md" : ""} ${isLast ? "rounded-b-md" : ""}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Image
                        src={user.profile_image}
                        alt={user.name}
                        width={50}
                        height={50}
                        className="rounded-full"
                      />
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">{user.email}</span>
                        <span className="text-sm">{user.name}</span>
                      </div>
                    </div>

                    <button
                      className="flex flex-shrink-0 self-center cursor-pointer active:scale-95 hover:scale-105 transition-all duration-200"
                      onClick={() => handleFollow(user.id)}
                    >
                      <Badge
                        content={
                          <div className="flex items-center gap-2">
                            {isFollowing(user.id) ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <UserPlus className="w-4 h-4" />
                            )}
                            <span className="text-xs">
                              {isFollowing(user.id) ? "팔로잉" : "팔로우"}
                            </span>
                          </div>
                        }
                        color="purple"
                      />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </ModalTemplete>
    </FollowProvider>
  );
}
