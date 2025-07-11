'use client';

import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  isRequired?: boolean;
  isEditable?: boolean;
  EditOnClick?: () => void;
  error?: string;
  fullWidth?: boolean;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className = '',
      label,
      isRequired,
      isEditable,
      EditOnClick,
      error,
      fullWidth = false,
      id,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;

    const textareaElement = (
      <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
        <textarea
          id={textareaId}
          ref={ref}
          rows={3}
          className={cn(
            'block resize-none w-full text-sm px-3 py-2 rounded-md bg-input-background border border-input-border text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-point-color-indigo focus:border-transparent transition-all duration-200 hover:border-input-border-hover',
            error ? 'ring-red-500 focus:ring-red-500' : '',
            className,
          )}
          {...props}
        />
      </div>
    );

    if (!label && !error) {
      return textareaElement;
    }

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <div className="flex items-center gap-2 relative group mb-1">
            <label
              htmlFor={textareaId}
              className="block text-sm font-medium leading-6 text-text-primary"
            >
              {label}
              {isRequired && <span className="text-point-color-purple ml-1">*</span>}
            </label>
            {isEditable && EditOnClick &&
              <FontAwesomeIcon
                icon={faPencil}
                size="xs"
                className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={EditOnClick}
              />}
          </div>
        )}
        {textareaElement}
        {error && (
          <p className="mt-1 text-sm text-red-600" id={`${textareaId}-error`}>
            {error}
          </p>
        )}
      </div>
    );
  },
);

TextArea.displayName = 'TextArea';

export { TextArea };
