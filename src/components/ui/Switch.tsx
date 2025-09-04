import { useState, useEffect } from 'react';
import { useTheme } from "@/contexts/ThemeContext";

const SwitchSize = {
  xs: "h-4 w-10",
  sm: "h-5 w-11",
  md: "h-6 w-12",
  lg: "h-7 w-14",
  xl: "h-8 w-16",
}

const SwitchBtnSize = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-7 w-7",
}

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  className?: string;
  labelClassName?: string;
  disabled?: boolean;
  size?: keyof typeof SwitchSize;
}

export function Switch({ 
  checked, 
  onChange, 
  label, 
  description, 
  className = '',
  labelClassName = '',
  disabled = false,
  size = "md"
}: SwitchProps) {
  const [isChecked, setIsChecked] = useState(checked);
  const id = `switch-${Math.random().toString(36).substring(2, 9)}`;
  const { isDark } = useTheme();

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
          className={`text-base font-medium text-text-primary mb-1 cursor-pointer ${labelClassName}`}
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
          ml-4 relative inline-flex ${SwitchSize[size]} items-center rounded-full 
          transition-colors focus:outline-none
          ${disabled 
            ? 'bg-gray-200 cursor-not-allowed' 
            : 'cursor-pointer active:scale-95'}
          ${isChecked && !disabled ? (isDark ? 'bg-white' : 'bg-black') : (isDark ? 'bg-gray-800' : 'bg-gray-200')}
        `}
        disabled={disabled}
      >
        <span 
          className={`
            inline-block ${SwitchBtnSize[size]} transform rounded-full transition-transform
            ${disabled ? (isDark ? 'bg-gray-400' : 'bg-white') : (isDark ? 'bg-black' : 'bg-white')}
            ${isChecked ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );
}
