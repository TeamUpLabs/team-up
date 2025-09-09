import { useState } from "react";
import { ChevronDown, Check, UserPlus, Loader2 } from "lucide-react";
import Image from "next/image";
import Badge from "@/components/ui/Badge";
import { useCommunity } from "@/contexts/CommunityContext";
import { FollowProvider } from '@/contexts/FollowContext';
import { useFollow } from "@/contexts/FollowContext";

export default function RecommendFollow() {
  const { recommended_follow, isLoading, error } = useCommunity();
  const [isExpanded, setIsExpanded] = useState(true);
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

  if (error) {
    console.error('Error loading recommended follows:', error);
    return null;
  }

  return (
    <FollowProvider>
      <div className="bg-component-background border border-component-border rounded-lg overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-bold text-text-primary text-lg flex items-center gap-2">
              <span>🚀</span>
              <span>추천 팔로우</span>
            </span>
            <button
              className="text-text-primary cursor-pointer"
              onClick={() => setIsExpanded(!isExpanded)}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <ChevronDown
                  className={`transition-transform duration-200 ${isExpanded ? '-rotate-180' : ''}`}
                />
              )}
            </button>
          </div>
        </div>
        <div className={`px-4 transition-all duration-300 overflow-hidden space-y-4 ${isExpanded ? 'max-h-96 pb-4' : 'max-h-0'}`}>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : recommended_follow.length > 0 ? (
            recommended_follow.map((user) => (
              <div key={user.user_id} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-component-tertiary-background overflow-hidden">
                    <Image
                      src={user.profile_image || "/DefaultProfile.jpg"}
                      alt={user.name}
                      width={32}
                      height={32}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-text-primary">{user.name}</span>
                    {user.role && (
                      <span className="text-xs text-text-secondary">{user.role}</span>
                    )}
                  </div>
                </div>
                <button
                  className="flex flex-shrink-0 self-center cursor-pointer active:scale-95 hover:scale-105 transition-all duration-200"
                  onClick={() => handleFollow(user.user_id)}
                >
                  <Badge
                    content={
                      <div className="flex items-center gap-2">
                        {isFollowing(user.user_id) ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <UserPlus className="w-4 h-4" />
                        )}
                        <span className="text-xs">
                          {isFollowing(user.user_id) ? "팔로잉" : "팔로우"}
                        </span>
                      </div>
                    }
                    color="purple"
                  />
                </button>
              </div>
            ))
          ) : (
            <p className="text-text-secondary text-sm py-2 text-center">
              추천 사용자가 없습니다.
            </p>
          )}
        </div>
      </div>
    </FollowProvider>
  );
}