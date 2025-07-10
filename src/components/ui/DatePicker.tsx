"use client"

import React from "react"

import { useState, useEffect, useRef } from "react"
import { CalendarMonth, ChevronLeft, ChevronRight } from "flowbite-react-icons/outline"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

// 타입 정의
interface DatePickerProps {
  label?: string;
  isRequired?: boolean;
  value?: Date
  onChange?: (date: Date | undefined) => void
  isEditable?: boolean;
  EditOnClick?: () => void;
  placeholder?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[]
  locale?: string
  dateFormat?: (date: Date) => string
  className?: string
  calendarPosition?: "top" | "bottom"
}

// 유틸리티 함수들
const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

const isDateDisabled = (date: Date, minDate?: Date, maxDate?: Date, disabledDates?: Date[]): boolean => {
  if (minDate && date < minDate) return true
  if (maxDate && date > maxDate) return true
  if (disabledDates && disabledDates.some((disabledDate) => isSameDay(date, disabledDate))) return true
  return false
}

const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate()
}

const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay()
}

const getMonthName = (month: number, locale = "ko-KR"): string => {
  return new Date(2024, month, 1).toLocaleDateString(locale, { month: "long" })
}

const getDayNames = (locale = "ko-KR"): string[] => {
  const days = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(2024, 0, i) // 2024년 1월 첫 주
    days.push(date.toLocaleDateString(locale, { weekday: "short" }))
  }
  return days
}

// Calendar 컴포넌트
interface CalendarProps {
  currentDate: Date
  selectedDate?: Date
  onDateSelect: (date: Date) => void
  onMonthChange: (year: number, month: number) => void
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[]
  locale?: string
}

const Calendar = ({
  currentDate,
  selectedDate,
  onDateSelect,
  onMonthChange,
  minDate,
  maxDate,
  disabledDates,
  locale = "ko-KR",
}: CalendarProps) => {
  const today = new Date()
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOfMonth = getFirstDayOfMonth(year, month)
  const dayNames = getDayNames(locale)

  // 이전 달 날짜들
  const prevMonth = month === 0 ? 11 : month - 1
  const prevYear = month === 0 ? year - 1 : year
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth)

  const handlePrevMonth = () => {
    const prevMonth = month === 0 ? 11 : month - 1
    const prevYear = month === 0 ? year - 1 : year
    onMonthChange(prevYear, prevMonth)
  }

  const handleNextMonth = () => {
    const nextMonth = month === 11 ? 0 : month + 1
    const nextYear = month === 11 ? year + 1 : year
    onMonthChange(nextYear, nextMonth)
  }

  const renderCalendarDays = () => {
    const days = []

    // 이전 달의 마지막 날짜들
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i
      const date = new Date(Date.UTC(prevYear, prevMonth, day))
      const disabled = isDateDisabled(date, minDate, maxDate, disabledDates)
      days.push(
        <button
          type="button"
          key={`prev-${day}`}
          className={`h-9 w-9 text-sm text-text-secondary hover:bg-component-tertiary-background 
            rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => !disabled && onDateSelect(date)}
          disabled={disabled}
        >
          {day}
        </button>,
      )
    }

    // 현재 달 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(Date.UTC(year, month, day))
      const isToday = isSameDay(date, today)
      const isSelected = selectedDate && isSameDay(date, selectedDate)
      const disabled = isDateDisabled(date, minDate, maxDate, disabledDates)

      days.push(
        <button
          type="button"
          key={day}
          className={`h-9 w-9 text-sm rounded-md transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 ${isSelected
            ? "bg-blue-600 text-white"
            : isToday
              ? "bg-blue-100 text-blue-900 font-medium"
              : "hover:bg-component-tertiary-background"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => !disabled && onDateSelect(date)}
          disabled={disabled}
        >
          {day}
        </button>,
      )
    }

    // 다음 달의 첫 날짜들 (42칸을 채우기 위해)
    const remainingCells = 35 - days.length
    const nextMonth = month === 11 ? 0 : month + 1
    const nextYear = month === 11 ? year + 1 : year

    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(Date.UTC(nextYear, nextMonth, day))
      const disabled = isDateDisabled(date, minDate, maxDate, disabledDates)
      days.push(
        <button
          type="button"
          key={`next-${day}`}
          className={`
          h-9 w-9 text-sm text-text-secondary hover:bg-component-tertiary-background 
          rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
          onClick={() => !disabled && onDateSelect(date)}
          disabled={disabled}
        >
          {day}
        </button>,
      )
    }

    return days
  }

  return (
    <div className="p-3 bg-component-secondary-background border border-component-border rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="h-8 w-8 flex items-center justify-center hover:bg-component-tertiary-background rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="font-semibold text-text-primary">
          {getMonthName(month, locale)} {year}
        </div>

        <button
          type="button"
          onClick={handleNextMonth}
          className="h-8 w-8 flex items-center justify-center hover:bg-component-tertiary-background rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day, index) => (
          <div key={index} className="h-9 flex items-center justify-center text-sm font-medium text-text-primary">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>
    </div>
  )
}

// 메인 DatePicker 컴포넌트
export default function DatePicker({
  label,
  isRequired,
  value,
  isEditable,
  EditOnClick,
  onChange,
  placeholder = "날짜를 선택하세요",
  disabled = false,
  minDate,
  maxDate,
  disabledDates,
  locale = "ko-KR",
  dateFormat,
  className = "",
  calendarPosition = "bottom",
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (value) {
      setCurrentDate(new Date(value.getFullYear(), value.getMonth(), 1))
    }
  }, [value])

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // ESC 키 처리
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false)
        buttonRef.current?.focus()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  const handleDateSelect = (date: Date) => {
    onChange?.(date)
    setIsOpen(false)
    buttonRef.current?.focus()
  }

  const handleMonthChange = (year: number, month: number) => {
    setCurrentDate(new Date(year, month, 1))
  }

  const formatDate = (date: Date): string => {
    if (dateFormat) {
      return dateFormat(date)
    }
    return date.toLocaleDateString(locale)
  }

  const handleButtonClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
    }
  }

  const handleButtonKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      handleButtonClick()
    }
  }

  const generatedId = React.useId();
  const inputId = generatedId;

  return (
    <div className={`relative`} ref={containerRef}>
      {label && (
        <div className="flex items-center gap-2 relative group mb-1">
          <label
            htmlFor={inputId}
            className="block text-sm font-medium leading-6 text-text-secondary"
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
      <button
        type="button"
        ref={buttonRef}
        onClick={handleButtonClick}
        onKeyDown={handleButtonKeyDown}
        disabled={disabled}
        className={`
          w-full flex items-center justify-start bg-input-background px-3 py-2 text-left border border-input-border rounded-md bg-component-background 
          transition-colors focus:outline-none focus:ring-1 focus:ring-point-color-indigo focus:border-transparent cursor-pointer ${className}
          ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : "hover:border-input-border-hover"}
          ${!value ? "text-text-secondary" : "text-text-primary"}`}
      >
        <CalendarMonth className="mr-2 h-5 w-5 text-gray-400" />
        {value ? formatDate(value) : placeholder}
      </button>

      {isOpen && (
        <div
          className={`absolute left-0 z-50 ${calendarPosition === "top" ? "bottom-full mb-2" : "top-full mt-2"}`}
        >
          <Calendar
            currentDate={currentDate}
            selectedDate={value}
            onDateSelect={handleDateSelect}
            onMonthChange={handleMonthChange}
            minDate={minDate}
            maxDate={maxDate}
            disabledDates={disabledDates}
            locale={locale}
          />
        </div>
      )}
    </div>
  )
}
