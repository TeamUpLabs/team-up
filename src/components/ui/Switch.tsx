import { useState, useEffect } from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  className?: string;
  disabled?: boolean;
}

export function Switch({ 
  checked, 
  onChange, 
  label, 
  description, 
  className = '',
  disabled = false 
}: SwitchProps) {
  const [isChecked, setIsChecked] = useState(checked);
  const id = `switch-${Math.random().toString(36).substring(2, 9)}`;

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const toggle = () => {
    if (disabled) return;
    const newValue = !isChecked;
    setIsChecked(newValue);
    onChange(newValue);
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex flex-col">
        <label 
          htmlFor={id}
          className="text-base font-medium text-text-primary mb-1 cursor-pointer"
        >
          {label}
        </label>
        {description && (
          <p className="text-sm text-text-secondary">
            {description}
          </p>
        )}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={isChecked}
        onClick={toggle}
        className={`
          ml-4 relative inline-flex h-6 w-12 items-center rounded-full 
          transition-colors focus:outline-none
          ${disabled 
            ? 'bg-gray-200 cursor-not-allowed' 
            : 'cursor-pointer active:scale-95'}
          ${isChecked && !disabled ? 'bg-black' : 'bg-component-border'}
        `}
        disabled={disabled}
      >
        <span 
          className={`
            inline-block h-5 w-5 transform rounded-full transition-transform
            ${disabled ? 'bg-gray-400' : 'bg-white'}
            ${isChecked ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );
}
