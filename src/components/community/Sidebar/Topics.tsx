import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Topics() {
  const topics = [
    { id: 1, name: "React", count: 424 },
    { id: 2, name: "이벤트", count: 23 },
    { id: 3, name: "프로젝트", count: 10 },
  ];

  const [isExpanded, setIsExpanded] = useState(true);

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
          >
            <ChevronDown className={`transition-transform duration-200 ${isExpanded ? '-rotate-180' : ''}`} />
          </button>
        </div>
      </div>
      <div className={`px-4 transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-96 pb-4' : 'max-h-0'} space-y-4`}>
        {topics.map((topic) => (
          <div key={topic.id} className="flex flex-col px-2">
            <span className="font-semibold text-text-primary hover:underline cursor-pointer"># {topic.name}</span>
            <span className="text-sm text-text-secondary">{topic.count}개의 새 게시글</span>
          </div>
        ))}
      </div>
    </div>
  );
}