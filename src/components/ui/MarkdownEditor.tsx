"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import 'highlight.js/styles/github.css'; // 코드 하이라이트 스타일
import { Heading, Bold, Italic, Strikethrough, Code, Link, List, ListOrdered, ListTodo, AtSign, Undo, Redo, Expand, Shrink } from 'lucide-react';
import { MarkdownHighlighter } from '@/components/ui/MarkdownHighlighter';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  height?: number;
  isRequired?: boolean;
  error?: string;
  id?: string;
  mode?: 'write' | 'preview';
  disableModeToggle?: boolean;
}

type HistoryAction = 
  | { type: 'SET_VALUE'; payload: string }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SYNC'; payload: string };

const historyReducer = (state: { history: string[]; currentIndex: number }, action: HistoryAction) => {
  switch (action.type) {
    case 'SET_VALUE': {
      if (action.payload === state.history[state.currentIndex]) {
        return state;
      }
      const newHistory = state.history.slice(0, state.currentIndex + 1);
      newHistory.push(action.payload);
      return {
        history: newHistory,
        currentIndex: newHistory.length - 1,
      };
    }
    case 'SYNC': {
      if (action.payload === state.history[state.currentIndex]) {
        return state;
      }
      const newHistory = [...state.history];
      newHistory[state.currentIndex] = action.payload;
      return { ...state, history: newHistory };
    }
    case 'UNDO': {
      if (state.currentIndex <= 0) return state;
      return { ...state, currentIndex: state.currentIndex - 1 };
    }
    case 'REDO': {
      if (state.currentIndex >= state.history.length - 1) return state;
      return { ...state, currentIndex: state.currentIndex + 1 };
    }
    default:
      return state;
  }
};

const useHistory = (initialValue: string) => {
  const [state, dispatch] = React.useReducer(historyReducer, {
    history: [initialValue],
    currentIndex: 0,
  });

  const { history, currentIndex } = state;

  const setValue = useCallback((newValue: string) => {
    dispatch({ type: 'SET_VALUE', payload: newValue });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, []);
  
  const sync = useCallback((value: string) => {
    dispatch({ type: 'SYNC', payload: value });
  }, []);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;
  const currentValue = history[currentIndex];

  return { setValue, undo, redo, sync, canUndo, canRedo, currentValue };
};

const MarkdownEditor = ({ 
  value,
  onChange,
  label,
  placeholder = 'Add a description',
  height = 300,
  isRequired,
  error,
  id,
  mode: initialMode,
  disableModeToggle = false,
}: MarkdownEditorProps) => {
  const [internalMode, setInternalMode] = useState<'write' | 'preview'>(initialMode || 'write');
  const mode = initialMode || internalMode;
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { setValue, undo, redo, sync, canUndo, canRedo, currentValue } = useHistory(value);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const prevValueRef = useRef(value);
  const generatedId = React.useId();
  const editorId = id || generatedId;

  // Only sync when the value prop changes from outside the component
  useEffect(() => {
    if (prevValueRef.current !== value) {
      sync(value);
      prevValueRef.current = value;
    }
  }, [value, sync]);

  // Only update parent when currentValue changes from user input
  useEffect(() => {
    if (prevValueRef.current !== currentValue) {
      onChange(currentValue);
      prevValueRef.current = currentValue;
    }
  }, [currentValue, onChange]);

  const handleToolbarClick = useCallback((syntax: 'h2' | 'bold' | 'italic' | 'strikethrough' | 'code' | 'link' | 'ul' | 'ol' | 'task') => {
    if (!textAreaRef.current) return;
    const textarea = textAreaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = currentValue.substring(start, end);
    let newText;

    switch (syntax) {
      case 'h2': newText = `## ${selectedText}`; break;
      case 'bold': newText = `**${selectedText}**`; break;
      case 'italic': newText = `*${selectedText}*`; break;
      case 'strikethrough': newText = `~~${selectedText}~~`; break;
      case 'code': newText = "`" + selectedText + "`"; break;
      case 'link': newText = `[${selectedText}](url)`; break;
      case 'ul': newText = `- ${selectedText}`; break;
      case 'ol': newText = `1. ${selectedText}`; break;
      case 'task': newText = `- [ ] ${selectedText}`; break;
      default: newText = selectedText;
    }

    const finalValue = currentValue.substring(0, start) + newText + currentValue.substring(end);
    setValue(finalValue);

    textarea.focus();
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + newText.length;
    }, 0);
  }, [currentValue, setValue]);
  
  // Handle keyboard events for markdown shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle key events if not in write mode
      if (mode !== 'write') return;
      const textarea = textAreaRef.current;
      if (!textarea) return;

      const isMac = window.navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const metaKey = isMac ? e.metaKey : e.ctrlKey;

      if (metaKey) {
        let handled = false;
        switch (e.key.toLowerCase()) {
          case 'b': handleToolbarClick('bold'); handled = true; break;
          case 'i': handleToolbarClick('italic'); handled = true; break;
          case 'h': handleToolbarClick('h2'); handled = true; break;
          case 'k': handleToolbarClick('link'); handled = true; break;
        }
        if (handled) {
          e.preventDefault();
          return;
        }
      }

      if (e.key === 'Tab') {
        e.preventDefault();
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newValue = currentValue.substring(0, start) + '  ' + currentValue.substring(end);
        setValue(newValue);
        setTimeout(() => { textarea.selectionStart = textarea.selectionEnd = start + 2; }, 0);
        return;
      }

      if (e.key === 'Enter') {
        const start = textarea.selectionStart;
        const lineStart = currentValue.lastIndexOf('\n', start - 1) + 1;
        const currentLine = currentValue.substring(lineStart, start);
        const listMatch = currentLine.match(/^(\s*)((?:- |\* |\+ )|(\d+)\. )/);

        if (listMatch) {
          e.preventDefault();
          const indent = listMatch[1];
          let marker = listMatch[2];
          if (listMatch[3]) { // Ordered list
            const num = parseInt(listMatch[3], 10) + 1;
            marker = `${num}. `;
          }
          const newLine = '\n' + indent + marker;
          const newValue = currentValue.substring(0, start) + newLine + currentValue.substring(start);
          setValue(newValue);
          setTimeout(() => { textarea.selectionStart = textarea.selectionEnd = start + newLine.length; }, 0);
        }
      }
    };

    const editor = textAreaRef.current;
    editor?.addEventListener('keydown', handleKeyDown);

    return () => {
      editor?.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleToolbarClick, currentValue, setValue, mode]);

  const ToolbarButton = ({ onClick, icon: Icon, 'aria-label': ariaLabel, title, disabled }: { onClick: () => void; icon: React.ElementType; 'aria-label': string; title: string; disabled?: boolean }) => (
    <button type="button" onClick={onClick} className="p-1.5 text-text-secondary hover:bg-input-border rounded disabled:opacity-50 disabled:cursor-not-allowed" aria-label={ariaLabel} title={title} disabled={disabled}>
      <Icon size={18} />
    </button>
  );

  const editorHeight = isFullScreen ? 'calc(100vh - 120px)' : `${height}px`;

  const editorContent = (
    <div className={`${isFullScreen ? 'fixed inset-0 z-50' : 'relative'}`}>
      <div className={`
        flex flex-col w-full rounded-md bg-input-background text-text-primary
        border border-input-border
        focus:ring-1 focus:ring-point-color-indigo focus:border-transparent
        transition-all duration-200 hover:border-input-border-hover
        ${error ? 'border-red-500 focus:ring-red-500' : ''}
        ${isFullScreen ? 'h-full' : ''}
      `}>
        
        <div className="flex items-center justify-between border-b border-input-border p-2">
          {!disableModeToggle && (
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setInternalMode('write')} 
                className={`px-3 py-1 text-sm rounded ${mode === 'write' ? 'bg-component-tertiary-background' : ''}`}
                disabled={disableModeToggle}
              >
                Write
              </button>
              <button 
                onClick={() => setInternalMode('preview')} 
                className={`px-3 py-1 text-sm rounded ${mode === 'preview' ? 'bg-component-tertiary-background' : ''}`}
                disabled={disableModeToggle}
              >
                Preview
              </button>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <ToolbarButton onClick={undo} icon={Undo} aria-label="Undo" title="Undo" disabled={!canUndo} />
            <ToolbarButton onClick={redo} icon={Redo} aria-label="Redo" title="Redo" disabled={!canRedo} />
            <ToolbarButton onClick={() => setIsFullScreen(!isFullScreen)} icon={isFullScreen ? Shrink : Expand} aria-label="Toggle Fullscreen" title="Toggle Fullscreen" />
          </div>
        </div>

        {mode === 'write' && (
          <div className="flex items-center space-x-1 border-b border-input-border p-2 overflow-x-auto">
            <ToolbarButton onClick={() => handleToolbarClick('h2')} icon={Heading} aria-label="Heading" title="Heading (Ctrl+H)" />
            <ToolbarButton onClick={() => handleToolbarClick('bold')} icon={Bold} aria-label="Bold" title="Bold (Ctrl+B)" />
            <ToolbarButton onClick={() => handleToolbarClick('italic')} icon={Italic} aria-label="Italic" title="Italic (Ctrl+I)" />
            <ToolbarButton onClick={() => handleToolbarClick('strikethrough')} icon={Strikethrough} aria-label="Strikethrough" title="Strikethrough" />
            <ToolbarButton onClick={() => handleToolbarClick('code')} icon={Code} aria-label="Code" title="Code" />
            <ToolbarButton onClick={() => handleToolbarClick('link')} icon={Link} aria-label="Link" title="Link (Ctrl+K)" />
            <ToolbarButton onClick={() => handleToolbarClick('ul')} icon={List} aria-label="Unordered List" title="Unordered List" />
            <ToolbarButton onClick={() => handleToolbarClick('ol')} icon={ListOrdered} aria-label="Ordered List" title="Ordered List" />
            <ToolbarButton onClick={() => handleToolbarClick('task')} icon={ListTodo} aria-label="Task List" title="Task List" />
            <ToolbarButton onClick={() => {}} icon={AtSign} aria-label="Mention" title="Mention user" />
          </div>
        )}

        <div className="flex-grow">
          {mode === 'write' ? (
            <textarea
              id={editorId}
              ref={textAreaRef}
              value={currentValue}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              className="w-full h-full bg-transparent p-3 text-text-primary placeholder:text-text-secondary focus:outline-none resize-none"
              style={{ height: editorHeight }}
            />
          ) : (
            <div className="p-3 prose prose-invert max-w-none overflow-y-auto" style={{ height: editorHeight }}>
              <MarkdownHighlighter text={currentValue} />
            </div>
          )}
        </div>
        
        <div className="border-t border-input-border px-3 py-1 text-right text-xs text-text-secondary">
          {currentValue.length} characters
        </div>
      </div>
    </div>
  );

  if (!label && !error) {
    return editorContent;
  }

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={editorId}
          className="block text-sm font-medium leading-6 text-text-primary mb-1"
        >
          {label}
          {isRequired && <span className="text-point-color-purple ml-1">*</span>}
        </label>
      )}
      {editorContent}
      {error && (
        <p className="mt-1 text-sm text-red-600" id={`${editorId}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};

export default MarkdownEditor;
