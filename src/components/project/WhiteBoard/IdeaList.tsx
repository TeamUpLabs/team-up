import { WhiteBoard } from "@/types/WhiteBoard";
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import Image from "next/image";
import Badge from "@/components/ui/Badge";
import {
  Lightbulb,
  Paperclip,
  Heart,
  MessageCircle,
  Eye
} from "lucide-react";
import { summarizeMarkdown } from "@/utils/summarizeMarkdown";
import { Suspense, useState } from "react";
import WhiteboardModal from "@/components/project/WhiteBoard/WhiteboardModal";
import { blankUserBrief } from "@/types/user/User";

interface IdeaListProps {
  idea: WhiteBoard;
}

export default function IdeaList({ idea }: IdeaListProps) {
  const document = idea.documents[0] || {
    content: '',
    tags: [],
  };

  const formattedDate = idea.created_at
    ? formatDistanceToNow(new Date(idea.updated_at), {
      addSuffix: true,
      locale: ko
    })
    : '';
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        className="relative bg-component-background rounded-2xl overflow-hidden hover:shadow-lg hover:translate-y-[-4px] transition-all duration-300 border border-component-border"
        onClick={() => setIsModalOpen(true)}
      >
        {/* Header with type and menu */}
        <div className="px-6 pt-5 pb-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Badge
              content={
                <Lightbulb className="w-4 h-4" />
              }
              color="blue"
              className="!p-2"
            />
            <span className="text-sm font-medium text-blue-600">
              {idea.type === "document" ? "Document" : "Canvas"}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pt-1 pb-5">
          <h3 className="text-lg font-bold text-text-primary mb-3 line-clamp-2 leading-tight">
            {idea.title}
          </h3>
          <p className="text-text-secondary text-sm mb-4 line-clamp-3 leading-relaxed">
            {summarizeMarkdown(document.content) || '내용이 없습니다.'}
          </p>
        </div>

        {/* Tags & Attachments */}
        <div className="px-6 pb-4">
          {/* Tags */}
          {document.tags && document.tags.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-2">
                {document.tags.slice(0, 3).map((tag: string, index: number) => (
                  <Badge
                    key={index}
                    content={tag}
                    color="green"
                    className="!px-2.5 !py-1 !font-semibold !text-xs !rounded-full"
                  />
                ))}
                {document.tags.length > 3 && (
                  <span className="text-xs text-text-secondary self-center">
                    +{document.tags.length - 3}개 더
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Attachments */}
          <div className="flex items-center text-xs text-text-secondary">
            <Paperclip className="w-3.5 h-3.5 mr-1" />
            <span>첨부파일 {idea.documents[0]?.attachments?.length || 0}개</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-component-border bg-component-background">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium text-sm shadow-sm">
                  {idea.creator.profile_image ? (
                    <Image
                      src={idea.creator.profile_image}
                      alt={idea.creator.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    idea.creator.name ? idea.creator.name.charAt(0).toUpperCase() : 'U'
                  )}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-text-primary">
                  {idea.creator?.name || '알 수 없음'}
                </p>
                <div className="flex items-center text-xs text-text-secondary">
                  <span>{formattedDate}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-text-secondary text-xs">
                <Heart className={`w-3.5 h-3.5 ${idea.liked_by_users.some((user) => user.id === (user ? user.id : blankUserBrief.id)) ? "text-red-500 fill-red-500" : ""}`} />
                <span>{idea.likes || 0}</span>
              </div>
              <div className="flex items-center space-x-1 text-text-secondary text-xs">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{idea.comments?.length || 0}</span>
              </div>
              <div className="flex items-center space-x-1 text-text-secondary text-xs">
                <Eye className="w-3.5 h-3.5" />
                <span>{idea.views || 0}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <WhiteboardModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          idea={idea}
        />
      </Suspense>
    </>
  );
}