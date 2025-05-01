// Video layout utility functions

/**
 * Determines the CSS grid layout based on participant count and layout mode
 */
export const getGridLayout = (
  participantCount: number, 
  layout: 'grid' | 'focus', 
  hasPinnedUser: boolean
): string => {
  if (layout === 'focus' && hasPinnedUser) {
    return 'grid-cols-1 lg:grid-cols-4 lg:grid-rows-[1fr_auto]';
  }
  
  // 동적 그리드 레이아웃: 참가자 수에 따라 최적화된 그리드 배치
  if (participantCount === 1) return 'grid-cols-1';
  if (participantCount === 2) return 'grid-cols-1 sm:grid-cols-2';
  if (participantCount === 3) return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
  if (participantCount === 4) return 'grid-cols-2 md:grid-cols-2';
  if (participantCount <= 6) return 'grid-cols-2 sm:grid-cols-3';
  if (participantCount <= 9) return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-3';
  if (participantCount <= 12) return 'grid-cols-3 sm:grid-cols-3 lg:grid-cols-4';
  return 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6';
};

/**
 * Determines the CSS classes for a video item based on the layout mode
 */
export const getVideoItemClass = (
  userId: string,
  pinnedUserId: string | null,
  layout: 'grid' | 'focus'
): string => {
  if (layout === 'focus' && pinnedUserId) {
    if (userId === pinnedUserId) {
      return 'col-span-full lg:col-span-3 lg:row-span-full';
    } else {
      return 'h-24 md:h-32 lg:h-full lg:col-span-1';
    }
  }
  
  // 그리드 모드에서는 모든 비디오가 동일한 크기를 가지지만, 
  // 비율을 유지하고 컨테이너를 채우도록 설정
  return 'aspect-video';
};

/**
 * Video participant type used for arranging videos
 */
export interface VideoParticipant {
  userId: string;
  stream: MediaStream | null;
  isLocal: boolean;
  isScreenShare?: boolean;
  isPinned?: boolean;
}

/**
 * Arranges video participants with pinned user first if applicable
 */
export const arrangeVideoParticipants = (
  localUserId: string,
  localStream: MediaStream | null,
  remoteParticipants: { userId: string; stream: MediaStream | null }[],
  pinnedUserId: string | null,
  layout: 'grid' | 'focus'
): VideoParticipant[] => {
  const allParticipants: VideoParticipant[] = [
    { userId: 'local', stream: localStream, isLocal: true },
    ...remoteParticipants.map(p => ({ 
      userId: p.userId, 
      stream: p.stream, 
      isLocal: false 
    }))
  ];
  
  if (layout === 'focus' && pinnedUserId) {
    // Find index of pinned user
    const pinnedIndex = allParticipants.findIndex(p => 
      (p.userId === 'local' && pinnedUserId === 'local') || 
      (p.userId === pinnedUserId)
    );
    
    if (pinnedIndex > 0) {
      // Move pinned user to the beginning
      const pinnedUser = allParticipants[pinnedIndex];
      allParticipants.splice(pinnedIndex, 1);
      allParticipants.unshift(pinnedUser);
    }
  }
  
  return allParticipants;
}; 