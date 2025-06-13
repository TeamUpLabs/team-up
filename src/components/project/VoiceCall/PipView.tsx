import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMicrophone,
  faMicrophoneSlash,
  faPhoneSlash,
  faUsers,
  faExpand,
  faGripLines,
} from '@fortawesome/free-solid-svg-icons';

interface PipControlsProps {
  participantCount: number;
  isAudioMuted: boolean;
  onToggleAudio: () => void;
  onEndCall: () => void;
  onToggleParticipantList: () => void;
  onExitPip: () => void;
}

type HandleCorner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

const MIN_WIDTH = 200;
const MIN_HEIGHT = 130;
const EDGE_MARGIN = 10;

const determineHandleCorner = (posX: number, posY: number, pipWidth: number, pipHeight: number): HandleCorner => {
  const screenCenterX = window.innerWidth / 2;
  const screenCenterY = window.innerHeight / 2;
  const pipCenterX = posX + pipWidth / 2;
  const pipCenterY = posY + pipHeight / 2;

  if (pipCenterY < screenCenterY) { // PIP is in top half
    if (pipCenterX < screenCenterX) return 'bottom-right'; // PIP top-left -> Handle bottom-right
    return 'bottom-left'; // PIP top-right -> Handle bottom-left
  } else { // PIP is in bottom half
    if (pipCenterX < screenCenterX) return 'top-right'; // PIP bottom-left -> Handle top-right
    return 'top-left'; // PIP bottom-right -> Handle top-left
  }
};

const PipControls: React.FC<PipControlsProps> = ({
  participantCount,
  isAudioMuted,
  onToggleAudio,
  onEndCall,
  onToggleParticipantList,
  onExitPip,
}) => {
  const [size, setSize] = useState({ width: MIN_WIDTH, height: MIN_HEIGHT });
  const initialPosition = { x: window.innerWidth - MIN_WIDTH - EDGE_MARGIN, y: window.innerHeight - MIN_HEIGHT - EDGE_MARGIN };
  const [position, setPosition] = useState(initialPosition);
  const [activeHandleCorner, setActiveHandleCorner] = useState<HandleCorner>(() => 
    determineHandleCorner(initialPosition.x, initialPosition.y, MIN_WIDTH, MIN_HEIGHT)
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; initialX: number; initialY: number } | null>(null);
  const resizeStartRef = useRef<{
    width: number; height: number;
    mouseX: number; mouseY: number;
    initialPipX: number; initialPipY: number;
    corner: HandleCorner;
  } | null>(null);
  const pipRef = useRef<HTMLDivElement>(null);

  const handleEndCallWithAnimation = () => {
    onEndCall();
  };

  const updatePipAfterDragOrResize = useCallback(() => {
    if (!pipRef.current) return;
    const pipWidth = pipRef.current.offsetWidth;
    const pipHeight = pipRef.current.offsetHeight;
    setActiveHandleCorner(determineHandleCorner(position.x, position.y, pipWidth, pipHeight));
  }, [position.x, position.y]);


  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && dragStartRef.current && pipRef.current) {
        const newX = e.clientX - dragStartRef.current.x + dragStartRef.current.initialX;
        const newY = e.clientY - dragStartRef.current.y + dragStartRef.current.initialY;
        setPosition({ x: newX, y: newY });
      }
      if (isResizing && resizeStartRef.current && pipRef.current) {
        const { 
            width: initialWidth, height: initialHeight, 
            mouseX: initialMouseX, mouseY: initialMouseY, 
            corner, initialPipX, initialPipY 
        } = resizeStartRef.current;
        
        const deltaX = e.clientX - initialMouseX;
        const deltaY = e.clientY - initialMouseY;

        let finalWidth = initialWidth;
        let finalHeight = initialHeight;
        let finalX = initialPipX;
        let finalY = initialPipY;

        switch (corner) {
            case 'bottom-right': // Anchor: top-left
                finalWidth = initialWidth + deltaX;
                finalHeight = initialHeight + deltaY;
                break;
            case 'bottom-left': // Anchor: top-right
                finalWidth = initialWidth - deltaX;
                finalHeight = initialHeight + deltaY;
                finalX = initialPipX + deltaX;
                break;
            case 'top-right': // Anchor: bottom-left
                finalWidth = initialWidth + deltaX;
                finalHeight = initialHeight - deltaY;
                finalY = initialPipY + deltaY;
                break;
            case 'top-left': // Anchor: bottom-right
                finalWidth = initialWidth - deltaX;
                finalHeight = initialHeight - deltaY;
                finalX = initialPipX + deltaX;
                finalY = initialPipY + deltaY;
                break;
        }

        if (finalWidth < MIN_WIDTH) {
            const widthDiff = MIN_WIDTH - finalWidth;
            finalWidth = MIN_WIDTH;
            if (corner === 'bottom-left' || corner === 'top-left') {
                finalX -= widthDiff; 
            }
        }
        if (finalHeight < MIN_HEIGHT) {
            const heightDiff = MIN_HEIGHT - finalHeight;
            finalHeight = MIN_HEIGHT;
            if (corner === 'top-right' || corner === 'top-left') {
                finalY -= heightDiff; 
            }
        }
        setSize({ width: finalWidth, height: finalHeight });
        setPosition({ x: finalX, y: finalY });
      }
    };

    const handleMouseUp = () => {
      if (isDragging && pipRef.current) {
        let newX = position.x;
        let newY = position.y;
        const { innerWidth, innerHeight } = window;
        const pipWidth = pipRef.current.offsetWidth;
        const pipHeight = pipRef.current.offsetHeight;
        const centerX = position.x + pipWidth / 2;
        const centerY = position.y + pipHeight / 2;

        if (centerX < innerWidth / 2) newX = EDGE_MARGIN;
        else newX = innerWidth - pipWidth - EDGE_MARGIN;
        if (centerY < innerHeight / 2) newY = EDGE_MARGIN;
        else newY = innerHeight - pipHeight - EDGE_MARGIN;
        
        setPosition({ x: newX, y: newY });
      }
      if (isDragging || isResizing) {
        updatePipAfterDragOrResize();
      }
      setIsDragging(false);
      setIsResizing(false);
      dragStartRef.current = null;
      resizeStartRef.current = null;
      document.body.style.userSelect = 'auto';
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'auto';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'auto';
    };
  }, [isDragging, isResizing, position.x, position.y, updatePipAfterDragOrResize]);

  useEffect(() => {
    const handleResize = () => {
      if (pipRef.current) {
        const { innerWidth, innerHeight } = window;
        const pipWidth = pipRef.current.offsetWidth;
        const pipHeight = pipRef.current.offsetHeight;
        
        let newX = position.x;
        let newY = position.y;
        
        if (newX + pipWidth > innerWidth - EDGE_MARGIN) {
          newX = innerWidth - pipWidth - EDGE_MARGIN;
        }
        
        if (newY + pipHeight > innerHeight - EDGE_MARGIN) {
          newY = innerHeight - pipHeight - EDGE_MARGIN;
        }
        
        if (newX !== position.x || newY !== position.y) {
          setPosition({ x: newX, y: newY });
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [position.x, position.y]);

  const onDragMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.classList.contains('resize-handle-area')) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY, initialX: position.x, initialY: position.y };
    e.preventDefault(); 
  };

  const onResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    setIsResizing(true);
    resizeStartRef.current = {
      width: size.width, height: size.height,
      mouseX: e.clientX, mouseY: e.clientY,
      initialPipX: position.x, initialPipY: position.y,
      corner: activeHandleCorner,
    };
    e.preventDefault();
    e.stopPropagation();
  };

  const getHandleStyles = () => {
    let containerClasses = "resize-handle-area absolute w-6 h-6 flex group";
    let iconRotationClass = "-rotate-45"; 
    let cursorClass = "cursor-nwse-resize";
    let iconMarginClass = "mr-0.5 mb-0.5"; // Default for bottom-right

    switch (activeHandleCorner) {
      case 'bottom-right': 
        containerClasses += " bottom-0 right-0 items-end justify-end"; 
        // Default rotation, cursor, margin are fine
        break;
      case 'bottom-left': 
        containerClasses += " bottom-0 left-0 items-end justify-start"; 
        iconRotationClass = "rotate-45"; 
        cursorClass = "cursor-nesw-resize"; 
        iconMarginClass = "ml-0.5 mb-0.5";
        break;
      case 'top-right': 
        containerClasses += " top-0 right-0 items-start justify-end"; 
        iconRotationClass = "rotate-45"; 
        cursorClass = "cursor-nesw-resize"; 
        iconMarginClass = "mr-0.5 mt-0.5";
        break;
      case 'top-left': 
        containerClasses += " top-0 left-0 items-start justify-start"; 
        // Default rotation, cursor are fine for nwse
        iconMarginClass = "ml-0.5 mt-0.5";
        break;
    }
    return { container: `${containerClasses} ${cursorClass}`, iconRotation: iconRotationClass, iconMargin: iconMarginClass };
  };

  const handleStyles = getHandleStyles();

  return (
    <div
      ref={pipRef}
      className="fixed bg-slate-800/70 backdrop-blur-lg text-white rounded-xl shadow-2xl border border-slate-700/50 z-[10000] flex flex-col select-none overflow-hidden cursor-grab active:cursor-grabbing transition-[left,top] duration-300 ease-out"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        minWidth: `${MIN_WIDTH}px`,
        minHeight: `${MIN_HEIGHT}px`,
      }}
      onMouseDown={onDragMouseDown}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-2 border-b border-slate-700/60 flex-shrink-0">
        <span className="text-xs font-medium text-slate-300">Voice Call</span>
        <button
          onClick={onExitPip}
          className="text-slate-400 hover:text-white hover:bg-slate-700/50 p-1 rounded-md transition-colors"
          aria-label="Maximize Call"
          title="Maximize Call"
        >
          <FontAwesomeIcon icon={faExpand} size="xs" />
        </button>
      </div>

      {/* Participant Info */}
      <div className="flex-grow flex flex-col items-center justify-center text-center p-2 overflow-hidden my-1 min-h-0">
          <FontAwesomeIcon icon={faUsers} className="text-slate-400 mb-1" size="lg" />
          <p className="text-xl font-semibold text-slate-100">{participantCount}</p>
          <p className="text-[10px] text-slate-400 leading-tight">
            Participant{participantCount === 1 ? '' : 's'}
          </p>
      </div>

      {/* Controls */}
      <div className="flex justify-around items-center p-1.5 border-t border-slate-700/60 flex-shrink-0 bg-slate-800/50">
        <button
          onClick={onToggleAudio}
          className={`p-2 rounded-lg transition-all duration-150 ease-in-out 
                      ${isAudioMuted ? 'text-yellow-400 hover:bg-yellow-500/20' : 'text-green-400 hover:bg-green-500/20'}`}
          aria-label={isAudioMuted ? 'Unmute' : 'Mute'}
          title={isAudioMuted ? 'Unmute' : 'Mute'}
        >
          <FontAwesomeIcon icon={isAudioMuted ? faMicrophoneSlash : faMicrophone} size="sm" />
        </button>
        
        <button
          onClick={handleEndCallWithAnimation} 
          className="p-2 rounded-lg bg-red-500/80 hover:bg-red-600 text-white transition-all duration-150 ease-in-out transform active:scale-90"
          aria-label="End Call"
          title="End Call"
        >
          <FontAwesomeIcon icon={faPhoneSlash} size="sm" />
        </button>

        <button
          onClick={onToggleParticipantList}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors duration-150 ease-in-out"
          aria-label="Show Participants"
          title="Show Participants"
        >
          <FontAwesomeIcon icon={faUsers} size="sm" />
        </button>
      </div>

      {/* Resize Handle Area */}
      <div
        className={handleStyles.container}
        onMouseDown={onResizeMouseDown}
        title="Resize"
      >
        <FontAwesomeIcon 
          icon={faGripLines} 
          size="xs" 
          className={`text-slate-500 group-hover:text-slate-300 transition-colors ${handleStyles.iconMargin} ${handleStyles.iconRotation}`}
        />
      </div>
    </div>
  );
};

export default PipControls; 