import { useState, useEffect } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import { useCommunity } from '@/contexts/CommunityContext';
import { useSearchParams } from 'next/navigation';

interface TopicsProps {
  onTopicClick?: (topic: string) => void;
  onOpenSearch?: () => void;
}

export default function Topics({ onTopicClick, onOpenSearch }: TopicsProps) {
  const { hot_topic, isLoading, error } = useCommunity();
  const [isExpanded, setIsExpanded] = useState(true);
  const searchParams = useSearchParams();

  // Update search query when URL search params change
  useEffect(() => {
    const search = searchParams?.get('search');
    if (search && onTopicClick) {
      onTopicClick(search);
    }
  }, [searchParams, onTopicClick]);

  const handleTopicClick = (topic: string) => {
    if (onTopicClick) {
      onTopicClick(topic);
    }
    if (onOpenSearch) {
      onOpenSearch();
    }
  };

  if (error) {
    console.error('Error loading hot topics:', error);
    return null;
  }

  return (
    <div className="bg-component-background border border-component-border rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <span className="font-bold text-text-primary text-lg flex items-center gap-2">
            <span>🔥</span>
            <span>지금 핫한 주제</span>
          </span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-text-primary cursor-pointer"
            aria-label={isExpanded ? '접기' : '펼치기'}
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
      <div className={`px-4 transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-96 pb-4' : 'max-h-0'} space-y-4`}>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : hot_topic.length > 0 ? (
          hot_topic.map((topic, idx) => (
            <div key={idx} className="flex flex-col px-2">
              <span 
                className="font-semibold text-text-primary hover:underline cursor-pointer"
                onClick={() => handleTopicClick(topic.tag)}
              >
                #{topic.tag}
              </span>
              <span className="text-sm text-text-secondary">
                {topic.count}개의 게시글
              </span>
            </div>
          ))
        ) : (
          <p className="text-text-secondary text-sm py-2 text-center">
            인기 주제가 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}