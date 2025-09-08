"use client";

import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale/ko";
import Badge from "@/components/ui/Badge";
import { UserPlus, Check, Bookmark, Copy, Heart, MessageCircle, Share2, Eye } from "lucide-react";
import { useState, Suspense } from "react";
import Tooltip from "@/components/ui/Tooltip";
import { useTheme } from "@/contexts/ThemeContext";
import CommentModal from "@/components/community/CommentModal";
import Loading from "@/components/ui/Loading";
import { Post } from "@/types/community/Post";
import { useAuthStore } from "@/auth/authStore";
import { followUser, unfollowUser } from "@/hooks/follow";

// Decodes escaped sequences (e.g., "\n", "\t") into actual characters
function decodeEscapedWhitespace(input?: string): string {
  if (!input) return "";
  return input
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\f/g, "\f")
    .replace(/\\v/g, "\v");
}

export default function Posts({ post }: { post: Post }) {
  const { isDark } = useTheme();
  const user = useAuthStore.getState().user;
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleCopyCode = async () => {
    const raw = typeof post.code === 'object' ? post.code.code : post.code;
    const codeToCopy = decodeEscapedWhitespace(raw ?? "");
    if (!codeToCopy) return;
    
    try {
      await navigator.clipboard.writeText(codeToCopy);
      setShowCopied(true);
      
      // Clear any existing timeout and set a new one
      setTimeout(() => {
        setShowCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  const handleFollow = async () => {
    if (isFollowing) {
      try {
        await unfollowUser(post.creator.id);
        useAuthStore.getState().setAlert("팔로우를 취소했습니다.", "success");
      } catch (error) {
        console.error(error);
      } finally {
        setIsFollowing(false);
      }
    } else {
      try {
        await followUser(post.creator.id);
        useAuthStore.getState().setAlert("팔로우를 추가했습니다.", "success");
      } catch (error) {
        console.error(error);
      } finally {
        setIsFollowing(true);
      }
    }
  };

  return (
    <div className="p-6 border border-component-border rounded-lg flex flex-col gap-4">
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-component-tertiary-background rounded-full w-10 h-10 flex items-center justify-center">
            <Image src={post.creator.profile_image} alt={post.creator.name} width={40} height={40} className="w-10 h-10 rounded-full ring-2 ring-offset-2 ring-red-500" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{post.creator.name}</span>
              <span className="text-xs text-text-secondary">
                {post.created_at ? `${formatDistanceToNow(new Date(post.created_at), { locale: ko })} 전` : '방금 전'}
              </span>
            </div>
            <span className="text-xs text-text-secondary">{post.creator.role}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user?.id != post.creator.id && (
            <button
              className="flex flex-shrink-0 self-center cursor-pointer active:scale-95 hover:scale-105 transition-all duration-200"
              onClick={handleFollow}
            >
              <Badge
                content={
                  <div className="flex items-center gap-2">
                    {isFollowing ? <Check className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                    <span className="text-xs">{isFollowing ? "팔로잉" : "팔로우"}</span>
                  </div>
                }
                color="purple"
              />
            </button>
          )}

          <button
            className="flex p-2 hover:bg-component-tertiary-background cursor-pointer rounded-md"
            onClick={() => setIsBookmarked(!isBookmarked)}
          >
            <Bookmark
              className="w-4 h-4"
              fill={isBookmarked ? "currentColor" : "none"}
              stroke={isBookmarked ? "currentColor" : "currentColor"}
            />
          </button>
        </div>
      </div>

      <div className="font-medium text-text-primary whitespace-pre-line break-words">
        {post.content}
      </div>
      {post.code && (
        <div className={`bg-${isDark ? "gray-800" : "gray-700"} p-4 rounded-md flex flex-col gap-2`}>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-red-500 p-2 rounded-full"></span>
              <span className="bg-yellow-500 p-2 rounded-full"></span>
              <span className="bg-green-500 p-2 rounded-full"></span>
            </div>

            <Tooltip content={showCopied ? "복사 완료!" : "코드 복사"} placement="left">
              <button 
                onClick={handleCopyCode}
                className="p-2 hover:bg-gray-600 rounded-md transition-colors"
                aria-label="Copy code"
              >
                <Copy className="w-4 h-4 text-white" />
              </button>
            </Tooltip>
          </div>

          <div className="text-white w-full overflow-x-auto">
            <pre className="font-mono !p-0">
              <code className="block whitespace-pre">
                {decodeEscapedWhitespace(
                  typeof post.code === 'object' ? post.code?.code : (post.code as string)
                )}
              </code>
            </pre>
          </div>
        </div>
      )}
      <div className="flex items-center gap-2">
        {post.tags.map((tag, index) => (
          <Badge 
            key={index} 
            content={
              <span>#{tag}</span>
            } 
            color="green" 
            className="!px-2 !py-1 !font-semibold !text-xs !rounded-full"
          />
        ))}
      </div>

      <div className="w-full h-px bg-component-border"></div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-text-secondary cursor-pointer hover:text-red-500" onClick={() => setIsLiked(!isLiked)} fill={isLiked ? "red" : "none"} stroke={isLiked ? "red" : "currentColor"} />
            <span className="text-text-secondary text-sm">{isLiked ? post.reaction.likes + 1 : post.reaction.likes}</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-text-secondary cursor-pointer hover:text-green-500" onClick={() => setIsCommentModalOpen(true)} />
            <span className="text-text-secondary text-sm">{post.reaction.comments.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-text-secondary cursor-pointer hover:text-blue-500" />
            <span className="text-text-secondary text-sm">{post.reaction.shares}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-text-secondary" />
          <span className="text-text-secondary text-sm">{post.reaction.views}</span>
        </div>
      </div>
      <Suspense fallback={<Loading />}>
        <CommentModal isOpen={isCommentModalOpen} onClose={() => setIsCommentModalOpen(false)} />
      </Suspense>
    </div>
  );
}