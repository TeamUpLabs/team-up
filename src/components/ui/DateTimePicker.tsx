import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faClock, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { format, isValid } from 'date-fns';
import { ko } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

interface DateTimePickerProps {
  id?: string;
  name: string;
  value: string; // ISO string format
  onChange: (e: { target: { name: string; value: string } }) => void;
  label?: string;
  required?: boolean;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export default function DateTimePicker({
  id,
  name,
  value,
  onChange,
  label,
  required = false,
  className = '',
  placeholder = '날짜와 시간을 선택하세요',
  disabled = false,
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [displayValue, setDisplayValue] = useState('');
  const pickerRef = useRef<HTMLDivElement>(null);
  
  // Initialize with the current value if it exists
  useEffect(() => {
    if (value) {
      try {
        // Parse the ISO string from the value
        // For the format 'YYYY-MM-DDTHH:MM:00.000' without timezone
        if (value.includes('T') && !value.includes('Z') && !value.includes('+')) {
          const [datePart, timePart] = value.split('T');
          const [year, month, day] = datePart.split('-').map(Number);
          const [hours, minutes] = timePart.split(':').map(Number);
          
          const date = new Date(year, month - 1, day, hours, minutes);
          if (isValid(date)) {
            setSelectedDate(date);
            setDisplayValue(format(date, 'yyyy년 MM월 dd일 HH:mm', { locale: ko }));
          }
        } else {
          // Standard ISO string handling with timezone
          const date = new Date(value);
          if (isValid(date)) {
            setSelectedDate(date);
            setDisplayValue(format(date, 'yyyy년 MM월 dd일 HH:mm', { locale: ko }));
          }
        }
      } catch (error) {
        console.error('Error parsing date:', error);
      }
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    
    if (!dateValue) {
      setSelectedDate(null);
      onChange({ target: { name, value: '' } });
      return;
    }
    
    // Create a new date with the selected date and current time
    const newDate = new Date(dateValue);
    
    if (selectedDate) {
      // Keep the time part from the previously selected date
      newDate.setHours(selectedDate.getHours(), selectedDate.getMinutes());
    } else {
      // Set default time to current time
      const now = new Date();
      newDate.setHours(now.getHours(), now.getMinutes());
    }
    
    setSelectedDate(newDate);
    updateDateTime(newDate);
  };

  // Handle time change
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = e.target.value;
    
    if (!timeValue || !selectedDate) {
      return;
    }
    
    // Parse the time string to get hours and minutes
    const [hours, minutes] = timeValue.split(':').map(Number);
    
    // Create a new date with the current date and the selected time
    const newDate = new Date(selectedDate);
    // Make sure we're setting exact hours and minutes without timezone conversions
    newDate.setHours(hours, minutes, 0, 0);
    
    setSelectedDate(newDate);
    updateDateTime(newDate);
  };

  // Update parent component with ISO string
  const updateDateTime = (date: Date) => {
    if (isValid(date)) {
      // Update display value with local time
      setDisplayValue(format(date, 'yyyy년 MM월 dd일 HH:mm', { locale: ko }));
      
      // Create ISO string but ensure that it represents the exact local time selected
      // This prevents timezone offsets from affecting the time
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      // Create an ISO string manually with the local time parts
      const isoString = `${year}-${month}-${day}T${hours}:${minutes}:00`;
      onChange({ target: { name, value: isoString } });
    }
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`relative ${className}`} ref={pickerRef}>
      {label && (
        <label 
          htmlFor={id || name} 
          className="flex items-center text-sm font-medium mb-2 text-text-secondary"
        >
          {label} {required && <span className="text-point-color-purple ml-1">*</span>}
        </label>
      )}
      
      <div 
        className={`relative w-full cursor-pointer ${disabled ? 'opacity-70' : ''}`}
        onClick={toggleDropdown}
      >
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <FontAwesomeIcon icon={faCalendarAlt} className="text-text-tertiary text-sm" />
        </div>
        
        <input
          type="text"
          id={id || name}
          name={name}
          value={displayValue}
          readOnly
          placeholder={placeholder}
          disabled={disabled}
          className="w-full pl-10 pr-10 py-3 rounded-lg bg-input-background border border-input-border text-text-secondary focus:outline-none focus:ring-1 focus:ring-point-color-indigo focus:border-transparent transition-all duration-200 placeholder:text-text-secondary hover:border-input-border-hover cursor-pointer"
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <FontAwesomeIcon 
            icon={faAngleDown} 
            className={`text-text-tertiary text-sm transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} 
          />
        </div>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 mt-1 w-full bg-component-background border border-component-border rounded-lg shadow-lg overflow-hidden"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.2 }}
              className="p-3 space-y-3"
            >
              <motion.div
                initial={{ x: -5, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.2 }}
              >
                <div className="flex items-center text-sm font-medium mb-2 text-text-secondary">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-text-primary-color" />
                  날짜 선택
                </div>
                <input
                  type="date"
                  value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
                  onChange={handleDateChange}
                  className="w-full px-4 py-3 rounded-lg bg-input-background border border-input-border text-text-secondary focus:outline-none focus:ring-1 focus:ring-point-color-indigo focus:border-transparent transition-all duration-200 hover:border-input-border-hover"
                />
              </motion.div>
              
              <motion.div
                initial={{ x: 5, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.2 }}
              >
                <div className="flex items-center text-sm font-medium mb-2 text-text-secondary">
                  <FontAwesomeIcon icon={faClock} className="mr-2 text-text-primary-color" />
                  시간 선택
                </div>
                <input
                  type="time"
                  value={selectedDate ? format(selectedDate, 'HH:mm') : ''}
                  onChange={handleTimeChange}
                  className="w-full px-4 py-3 rounded-lg bg-input-background border border-input-border text-text-secondary focus:outline-none focus:ring-1 focus:ring-point-color-indigo focus:border-transparent transition-all duration-200 hover:border-input-border-hover"
                />
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.2 }}
              className="px-3 py-2 bg-component-secondary-background border-t border-component-border"
            >
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full py-2 text-sm font-medium text-text-primary-color hover:text-text-primary-color-hover transition-colors"
              >
                완료
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
