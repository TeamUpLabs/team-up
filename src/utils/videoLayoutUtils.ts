// Video layout utility functions

/**
 * Calculates optimal columns for responsive grid layout
 */
export const calculateOptimalColumns = (
  participantCount: number,
  screenWidth: number
): number => {
  // Base calculation considering screen width
  if (screenWidth < 640) { // Mobile
    return participantCount <= 2 ? participantCount : 2;
  } else if (screenWidth < 768) { // Small tablet
    return participantCount <= 2 ? participantCount : 
           participantCount <= 6 ? 2 : 3;
  } else if (screenWidth < 1024) { // Tablet/small laptop
    return participantCount <= 3 ? participantCount : 
           participantCount <= 8 ? 3 : 4;
  } else if (screenWidth < 1280) { // Desktop
    return participantCount <= 4 ? participantCount : 
           participantCount <= 12 ? 4 : 5;
  } else { // Large desktop
    return participantCount <= 4 ? participantCount : 
           participantCount <= 16 ? 4 : 6;
  }
};

/**
 * Gets appropriate aspect ratio based on participant count
 */
export const getVideoAspectRatio = (
  participantCount: number
): string => {
  // More square-like for many participants, more widescreen for fewer
  if (participantCount <= 2) return 'aspect-video'; // 16:9
  if (participantCount <= 4) return 'aspect-[4/3]'; // 4:3
  if (participantCount <= 9) return 'aspect-[1/1]'; // Square for medium count
  return 'aspect-[1/1]'; // Square for many participants
};

/**
 * Determines the CSS grid layout based on participant count and layout mode
 */
export const getGridLayout = (
  participantCount: number, 
  layout: 'grid' | 'focus', 
  hasPinnedUser: boolean,
  screenWidth: number = window.innerWidth
): string => {
  if (layout === 'focus' && hasPinnedUser) {
    return 'grid-cols-1 lg:grid-cols-4 lg:grid-rows-[1fr_auto]';
  }
  
  // Dynamic and flexible approach for grid layout
  const optimalCols = calculateOptimalColumns(participantCount, screenWidth);
  
  // Use CSS Grid's auto-fit for more flexibility with minimum widths to fill more space
  if (participantCount === 1) {
    return 'grid-cols-1';
  }
  
  if (participantCount === 2) {
    return screenWidth < 640 ? 'grid-cols-1' : 'grid-cols-2';
  }
  
  if (participantCount <= 4) {
    return `grid-cols-2 md:grid-cols-${Math.min(participantCount, 2)}`;
  }
  
  if (participantCount <= 9) {
    return `grid-cols-2 sm:grid-cols-${Math.min(3, optimalCols)} md:grid-cols-3`;
  }
  
  if (participantCount <= 16) {
    return `grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4`;
  }
  
  // For very large number of participants
  return `grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6`;
};

/**
 * Determines the CSS classes for a video item based on the layout mode
 */
export const getVideoItemClass = (
  userId: string,
  pinnedUserId: string | null,
  layout: 'grid' | 'focus',
  participantCount: number = 1
): string => {
  if (layout === 'focus' && pinnedUserId) {
    if (userId === pinnedUserId) {
      return 'col-span-full lg:col-span-3 lg:row-span-full h-full';
    } else {
      return 'h-24 md:h-32 lg:h-full lg:col-span-1';
    }
  }
  
  // Use dynamic aspect ratio based on participant count
  // Return both aspect ratio and additional classes to fill available space
  return `${getVideoAspectRatio(participantCount)} h-full w-full object-cover`;
};

/**
 * Video participant type used for arranging videos
 */
export interface VideoParticipant {
  user_id: string;
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
  remoteParticipants: { user_id: string; stream: MediaStream | null }[],
  pinnedUserId: string | null,
  layout: 'grid' | 'focus'
): VideoParticipant[] => {
  const allParticipants: VideoParticipant[] = [
    { user_id: 'local', stream: localStream, isLocal: true },
    ...remoteParticipants.map(p => ({ 
      user_id: p.user_id, 
      stream: p.stream, 
      isLocal: false 
    }))
  ];
  
  if (layout === 'focus' && pinnedUserId) {
    // Find index of pinned user
    const pinnedIndex = allParticipants.findIndex(p => 
      (p.user_id === 'local' && pinnedUserId === 'local') || 
      (p.user_id === pinnedUserId)
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