"use client";

import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale/ko";
import Badge from "@/components/ui/Badge";
import { UserPlus, Check, Bookmark, Copy, Heart, MessageCircle, Share2, Eye } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import Tooltip from "@/components/ui/Tooltip";
import { useTheme } from "@/contexts/ThemeContext";
import CommentModal from "@/components/community/CommentModal";
import Loading from "@/components/ui/Loading";
import { Post } from "@/types/community/Post";
import { useAuthStore } from "@/auth/authStore";
import { useFollow } from "@/contexts/FollowContext";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { likeCommunityPost, unlikeCommunityPost } from "@/hooks/community/getCommunityPostData";
import { bookmarkCommunityPost, unbookmarkCommunityPost } from "@/hooks/community/getCommunityPostData";

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
  const { isFollowing, followUser, unfollowUser } = useFollow();
  const [showCopied, setShowCopied] = useState(false);

  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  console.log(post)

  useEffect(() => {
    const currentUserId = user?.id;
    setIsLiked(post.reaction?.likes?.users.some(u => u.id === currentUserId));
    setIsBookmarked(post.bookmark?.is_bookmarked);
  }, [post.reaction?.likes?.users, post.bookmark?.is_bookmarked, user?.id]);

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
    try {
      if (isFollowing(post.creator.id)) {
        await unfollowUser(post.creator.id);
      } else {
        await followUser(post.creator.id);
      }
    } catch (error) {
      console.error('Follow action failed:', error);
    }
  };

  const handleLike = async () => {
    try {
      if (isLiked) {
        const data = await unlikeCommunityPost(post.id);
        setIsLiked(false);
        post.reaction.likes.count = data.reaction.likes.count;
      } else {
        const data = await likeCommunityPost(post.id);
        setIsLiked(true);
        post.reaction.likes.count = data.reaction.likes.count;
      }
    } catch (error) {
      console.error('Like action failed:', error);
    }
  };

  const handleBookmark = async () => {
    try {
      if (isBookmarked) {
        await unbookmarkCommunityPost(post.id);
        setIsBookmarked(false);
        post.bookmark.count = post.bookmark.count - 1;
      } else {
        await bookmarkCommunityPost(post.id);
        setIsBookmarked(true);
        post.bookmark.count = post.bookmark.count + 1;
      }
    } catch (error) {
      console.error('Bookmark action failed:', error);
    }
  };
  
  return (
    <div className="p-6 border border-component-border rounded-lg flex flex-col gap-4">
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-component-tertiary-background rounded-full w-10 h-10 flex items-center justify-center">
            {post.creator?.profile_image ? (
              <Image 
                src={post.creator.profile_image} 
                alt={post.creator?.name || 'User'} 
                width={40} 
                height={40} 
                className="w-10 h-10 rounded-full ring-2 ring-offset-2 ring-red-500" 
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                {post.creator?.name?.[0]?.toUpperCase() || '?'}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{post.creator?.name || 'Unknown User'}</span>
              <span className="text-xs text-text-secondary">
                {post.created_at ? `${formatDistanceToNow(new Date(post.created_at), { locale: ko })} 전` : '방금 전'}
              </span>
            </div>
            {post.creator?.role && (
              <span className="text-xs text-text-secondary">{post.creator.role}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user?.id && post.creator?.id && user.id !== post.creator.id && (
            <button
              className="flex flex-shrink-0 self-center cursor-pointer active:scale-95 hover:scale-105 transition-all duration-200"
              onClick={handleFollow}
            >
              <Badge
                content={
                  <div className="flex items-center gap-2">
                    {isFollowing(post.creator.id) ? <Check className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                    <span className="text-xs">{isFollowing(post.creator.id) ? "팔로잉" : "팔로우"}</span>
                  </div>
                }
                color="purple"
              />
            </button>
          )}

          <button
            className="flex p-2 hover:bg-component-tertiary-background cursor-pointer rounded-md"
            onClick={handleBookmark}
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
            <SyntaxHighlighter language={post.code.language} style={docco} className="!pl-2">
              {decodeEscapedWhitespace(
                typeof post.code === 'object' ? post.code?.code : (post.code as string)
              )}
            </SyntaxHighlighter>
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
            <Heart 
              className="w-4 h-4 text-text-secondary cursor-pointer hover:text-red-500 hover:scale-105 transition-all duration-200 active:scale-95" 
              onClick={handleLike} 
              fill={isLiked ? "red" : "none"} 
              stroke={isLiked ? "red" : "currentColor"} 
            />
            <span className="text-text-secondary text-sm">
              {post.reaction?.likes ? post.reaction.likes.count : 0}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-text-secondary cursor-pointer hover:text-green-500" onClick={() => setIsCommentModalOpen(true)} />
            <span className="text-text-secondary text-sm">{post.reaction?.comments?.length || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-text-secondary cursor-pointer hover:text-blue-500" />
            <span className="text-text-secondary text-sm">{post.reaction?.shares?.count || 0}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-text-secondary" />
          <span className="text-text-secondary text-sm">{post.reaction?.views?.count || 0}</span>
        </div>
      </div>
      <Suspense fallback={<Loading />}>
        <CommentModal 
          isOpen={isCommentModalOpen} 
          onClose={() => setIsCommentModalOpen(false)} 
          comments={post.reaction?.comments || []} 
          post_id={post.id} 
        />
      </Suspense>
    </div>
  );
}