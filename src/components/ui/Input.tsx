import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  isRequired?: boolean;
  isEditable?: boolean;
  EditOnClick?: () => void;
  error?: string;
  fullWidth?: boolean;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  isPassword?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = '',
      label,
      isRequired,
      isEditable,
      EditOnClick,
      error,
      fullWidth = false,
      startAdornment,
      endAdornment,
      isPassword,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const [showPassword, setShowPassword] = React.useState(false);

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
            ${endAdornment || isPassword ? 'pr-10' : 'pr-3'}
            text-text-primary placeholder:text-text-secondary focus:outline-none
            focus:ring-1 focus:ring-point-color-indigo focus:border-transparent 
            transition-all duration-200 hover:border-input-border-hover
            text-sm sm:leading-6 border border-input-border
            ${error ? 'ring-red-500 focus:ring-red-500' : ''}
            ${className}
            appearance-none
          `}
          {...props}
          type={isPassword ? (showPassword ? 'text' : 'password') : props.type}
        />
        {(endAdornment || isPassword) && (
          <div className={`absolute inset-y-0 right-0 flex items-center pr-3 ${isPassword ? 'pointer-events-auto' : 'pointer-events-none'}`}>
            {endAdornment}
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            )}
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
          <div className="flex items-center gap-2 relative group mb-1">
            <label
              htmlFor={inputId}
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
