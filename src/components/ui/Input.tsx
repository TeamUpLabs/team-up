import React from 'react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  isRequired?: boolean;
  error?: string;
  fullWidth?: boolean;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = '',
      label,
      isRequired,
      error,
      fullWidth = false,
      startAdornment,
      endAdornment,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    const inputElement = (
      <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
        {startAdornment && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {startAdornment}
          </div>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`
            block w-full rounded-md bg-input-background py-2
            ${startAdornment ? 'pl-10' : 'pl-3'}
            ${endAdornment ? 'pr-10' : 'pr-3'}
            text-text-primary placeholder:text-text-secondary focus:outline-none
            focus:ring-1 focus:ring-point-color-indigo focus:border-transparent 
            transition-all duration-200 hover:border-input-border-hover
            sm:text-sm sm:leading-6 border border-input-border
            ${error ? 'ring-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {endAdornment && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            {endAdornment}
          </div>
        )}
      </div>
    );

    if (!label && !error) {
      return inputElement;
    }

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium leading-6 text-text-primary mb-1"
          >
            {label}
            {isRequired && <span className="text-point-color-purple ml-1">*</span>}
          </label>
        )}
        {inputElement}
        {error && (
          <p className="mt-1 text-sm text-red-600" id={`${inputId}-error`}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
