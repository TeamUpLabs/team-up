import React, { useState, useEffect, ReactNode, JSX } from "react";

interface MarkdownHighlighterProps {
  text: string;
  className?: string;
}

// Helper component to render text with markdown formatting
const MarkdownText: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;

  // Process bold, italic, strikethrough, code, and links
  const elements: React.ReactNode[] = [];
  let remainingText = text;
  
  // This regex matches markdown patterns in the order of priority
  const markdownRegex = /(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*|~~[^~]+~~|`[^`]+`|\[([^\]]+)\]\(([^)]+)\)|\n|\[\s*[xX]?\s*\]|^#{1,6}\s|^[-*+]\s|^\d+\.\s)/;
  
  while (remainingText) {
    const match = markdownRegex.exec(remainingText);
    
    if (!match) {
      elements.push(remainingText);
      break;
    }
    
    // Add text before the match
    if (match.index > 0) {
      elements.push(remainingText.substring(0, match.index));
    }
    
    const fullMatch = match[0];
    
    // Handle different markdown patterns
    if (fullMatch.startsWith('***')) {
      // Bold and italic
      const content = fullMatch.slice(3, -3);
      elements.push(<strong key={elements.length}><em>{content}</em></strong>);
    } else if (fullMatch.startsWith('**')) {
      // Bold
      const content = fullMatch.slice(2, -2);
      elements.push(<strong key={elements.length} className="font-bold">{content}</strong>);
    } else if (fullMatch.startsWith('*')) {
      // Italic (single *)
      const content = fullMatch.slice(1, -1);
      elements.push(<em key={elements.length} className="italic">{content}</em>);
    } else if (fullMatch.startsWith('~~')) {
      // Strikethrough
      const content = fullMatch.slice(2, -2);
      elements.push(<s key={elements.length} className="line-through">{content}</s>);
    } else if (fullMatch.startsWith('`')) {
      // Inline code
      const content = fullMatch.slice(1, -1);
      elements.push(
        <code key={elements.length} className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm font-mono">
          {content}
        </code>
      );
    } else if (fullMatch.startsWith('[') && match[2] && match[3]) {
      // Link [text](url)
      elements.push(
        <a 
          key={elements.length} 
          href={match[3]} 
          className="text-blue-600 dark:text-blue-400 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {match[2]}
        </a>
      );
    } else if (fullMatch.startsWith('[') && fullMatch.endsWith(']')) {
      // Task list item - [x] or [ ]
      const isChecked = /\[x\]/i.test(fullMatch);
      elements.push(
        <span key={elements.length} className="inline-flex items-center mr-1">
          <input 
            type="checkbox" 
            checked={isChecked}
            readOnly 
            className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </span>
      );
    } else {
      // If no markdown pattern matched, add the matched text as is
      elements.push(fullMatch);
    }
    
    // Move to the next part of the string
    remainingText = remainingText.substring(match.index + fullMatch.length);
  }
  
  return <>{elements}</>;
};

export const MarkdownHighlighter: React.FC<MarkdownHighlighterProps> = ({ text, className = '' }) => {
  const [processedElements, setProcessedElements] = useState<Array<ReactNode>>([]);

  useEffect(() => {
    if (!text) {
      setProcessedElements([]);
      return;
    }

    const lines = text.split('\n');
    const elements: Array<ReactNode> = [];
    let currentCodeBlock: string[] = [];
    let inCodeBlock = false;
    let inOrderedList = false;
    let inUnorderedList = false;
    let inTaskList = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Skip empty lines between list items
      if (line.trim() === '') {
        if (inOrderedList || inUnorderedList || inTaskList) {
          inOrderedList = false;
          inUnorderedList = false;
          inTaskList = false;
          // Close the previous list
          elements.push(<br key={`br-${i}`} />);
        }
        continue;
      }

      // Handle code blocks
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          // End of code block
          elements.push(
            <pre key={`code-${i}`} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md my-4 overflow-x-auto">
              <code className="text-sm font-mono">
                {currentCodeBlock.join('\n')}
              </code>
            </pre>
          );
          currentCodeBlock = [];
          inCodeBlock = false;
        } else {
          // Start of code block
          inCodeBlock = true;
        }
        continue;
      }

      if (inCodeBlock) {
        currentCodeBlock.push(line);
        continue;
      }

      // Handle headings
      const headingMatch = line.match(/^(#{1,6})\s(.+)$/);
      if (headingMatch) {
        const level = Math.min(6, headingMatch[1].length);
        const Tag = `h${level}` as keyof JSX.IntrinsicElements;
        const headingText = headingMatch[2].trim();
        elements.push(
          <Tag 
            key={`heading-${i}`} 
            className={`${level === 1 ? 'text-3xl' : level === 2 ? 'text-2xl' : level === 3 ? 'text-xl' : 'text-lg'} font-bold my-4`}
          >
            <MarkdownText text={headingText} />
          </Tag>
        );
        continue;
      }

      // Handle task lists
      const taskMatch = line.match(/^\s*[-*+]\s\[([ xX]?)\]\s(.+)$/);
      if (taskMatch) {
        const isChecked = taskMatch[1].toLowerCase() === 'x';
        const taskItem = (
          <li key={`task-item-${i}`} className="flex items-start">
            <input 
              type="checkbox" 
              checked={isChecked}
              readOnly 
              className="mt-1 mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="flex-1">
              <MarkdownText text={taskMatch[2]} />
            </span>
          </li>
        );
        
        if (!inTaskList) {
          elements.push(
            <ul key={`task-${i}`} className="list-none pl-5 my-2 space-y-1">
              {taskItem}
            </ul>
          );
          inTaskList = true;
        } else {
          // Find the last list and add the item to it
          const lastElement = elements[elements.length - 1];
          if (React.isValidElement<{ children?: ReactNode }>(lastElement) && 
              typeof lastElement.type === 'string' && 
              lastElement.type === 'ul') {
            // Clone the last element with the new item
            const children = React.Children.toArray(lastElement.props?.children || []);
            elements[elements.length - 1] = React.cloneElement(
              lastElement,
              {},
              [...children, taskItem]
            );
          } else {
            elements.push(taskItem);
          }
        }
        continue;
      }

      // Handle unordered lists
      const ulMatch = line.match(/^\s*[-*+]\s(.+)$/);
      if (ulMatch) {
        const listItem = (
          <li key={`ul-item-${i}`}>
            <MarkdownText text={ulMatch[1]} />
          </li>
        );
        
        if (!inUnorderedList) {
          elements.push(
            <ul key={`ul-${i}`} className="list-disc list-inside my-2 pl-5 space-y-1">
              {listItem}
            </ul>
          );
          inUnorderedList = true;
        } else {
          // Find the last list and add the item to it
          const lastElement = elements[elements.length - 1];
          if (React.isValidElement<{ children?: ReactNode }>(lastElement) && 
              typeof lastElement.type === 'string' && 
              lastElement.type === 'ul') {
            // Clone the last element with the new item
            const children = React.Children.toArray(lastElement.props?.children || []);
            elements[elements.length - 1] = React.cloneElement(
              lastElement,
              {},
              [...children, listItem]
            );
          } else {
            elements.push(listItem);
          }
        }
        continue;
      }

      // Handle ordered lists
      const olMatch = line.match(/^\s*\d+\.\s(.+)$/);
      if (olMatch) {
        const listItem = (
          <li key={`ol-item-${i}`}>
            <MarkdownText text={olMatch[1]} />
          </li>
        );
        
        if (!inOrderedList) {
          elements.push(
            <ol key={`ol-${i}`} className="list-decimal list-inside my-2 pl-5 space-y-1">
              {listItem}
            </ol>
          );
          inOrderedList = true;
        } else {
          // Find the last list and add the item to it
          const lastElement = elements[elements.length - 1];
          if (React.isValidElement<{ children?: ReactNode }>(lastElement) && 
              typeof lastElement.type === 'string' && 
              lastElement.type === 'ol') {
            // Clone the last element with the new item
            const children = React.Children.toArray(lastElement.props?.children || []);
            elements[elements.length - 1] = React.cloneElement(
              lastElement,
              {},
              [...children, listItem]
            );
          } else {
            elements.push(listItem);
          }
        }
        continue;
      }

        // Close any open lists when encountering a non-list item
      if (inOrderedList) {
        inOrderedList = false;
      } else if (inUnorderedList) {
        inUnorderedList = false;
      } else if (inTaskList) {
        inTaskList = false;
      }

      // Handle horizontal rule
      if (line.trim() === '---' || line.trim() === '***' || line.trim() === '___') {
        elements.push(<hr key={`hr-${i}`} className="my-4 border-gray-300 dark:border-gray-600" />);
        continue;
      }

      // Handle paragraphs
      elements.push(
        <p key={`p-${i}`} className="my-3 leading-relaxed">
          <MarkdownText text={line} />
        </p>
      );
    }

    // No need to close lists here as they are now properly managed in the list handling logic

    setProcessedElements(elements);
  }, [text]);

  return <div className={`markdown ${className}`}>
    {processedElements.map((element, index) => {
      if (React.isValidElement(element)) {
        return <React.Fragment key={`fragment-${index}`}>{element}</React.Fragment>;
      }
      return <React.Fragment key={`fragment-${index}`}>{String(element)}</React.Fragment>;
    })}
  </div>;
};