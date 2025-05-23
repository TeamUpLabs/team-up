import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap z-10000">
          {content}
          <div className="absolute left-1/2 -bottom-1 -ml-1 w-2 h-2 bg-black/80 rotate-45"></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip; 