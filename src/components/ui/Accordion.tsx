import React, { useState, useRef, ReactNode, useEffect } from 'react';

interface AccordionProps {
  title: string | ReactNode;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children: ReactNode;
  defaultOpen?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({ title, icon, children, defaultOpen = false }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const IconComponent = icon;

  useEffect(() => {
    if (isOpen && contentRef.current) {
      contentRef.current.style.maxHeight = `${contentRef.current.scrollHeight}px`;
    }
  }, [children, isOpen]);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="rounded-md mb-2">
      <button
        onClick={toggleAccordion}
        className="group w-full flex justify-between items-center pb-2 focus:outline-none transition-colors duration-200 ease-in-out cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 text-text-primary group-hover:underline font-bold">
          <IconComponent />
          {title}
        </div>
        <svg
          className={`w-5 h-5 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        ref={contentRef}
        style={{ maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : '0px' }}
        className={`transition-[max-height] duration-300 ease-in-out border-b border-component-border ${isOpen ? 'overflow-visible' : 'overflow-hidden'}`}
      >
        <div className="pb-4 px-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;
