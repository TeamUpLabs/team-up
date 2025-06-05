"use client"

import { useState, useEffect, useRef } from "react"
import { format, isValid } from "date-fns"
import { ko } from "date-fns/locale"
import { motion, AnimatePresence } from "framer-motion"
import { CalendarMonth, Clock, ChevronDown } from "flowbite-react-icons/outline"
import DatePicker from "@/components/ui/DatePicker"
import TimePicker from "@/components/ui/TimePicker"

interface DateTimePickerProps {
  id?: string
  name: string
  value: string // ISO string format
  onChange: (e: { target: { name: string; value: string } }) => void
  label?: string
  required?: boolean
  className?: string
  placeholder?: string
  disabled?: boolean
  minDate?: string
  minTime?: string
}

export default function DateTimePicker({
  id,
  name,
  value,
  onChange,
  label,
  required = false,
  className = "",
  placeholder = "날짜와 시간을 선택하세요",
  disabled = false,
  minDate,
  minTime,
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [displayValue, setDisplayValue] = useState("")
  const [effectiveMinTime, setEffectiveMinTime] = useState<string | undefined>(minTime)
  const pickerRef = useRef<HTMLDivElement>(null)

  // Initialize with the current value if it exists
  useEffect(() => {
    if (value) {
      try {
        // Parse the ISO string from the value
        // For the format 'YYYY-MM-DDTHH:MM:00.000' without timezone
        if (value.includes("T") && !value.includes("Z") && !value.includes("+")) {
          const [datePart, timePart] = value.split("T")
          const [year, month, day] = datePart.split("-").map(Number)
          const [hours, minutes] = timePart.split(":").map(Number)

          const date = new Date(year, month - 1, day, hours, minutes)
          if (isValid(date)) {
            setSelectedDate(date)
            // 12시간 형식으로 오전/오후 표시
            setDisplayValue(format(date, "yyyy년 MM월 dd일 a h:mm", { locale: ko }))
          }
        } else {
          // Standard ISO string handling with timezone
          const date = new Date(value)
          if (isValid(date)) {
            setSelectedDate(date)
            // 12시간 형식으로 오전/오후 표시
            setDisplayValue(format(date, "yyyy년 MM월 dd일 a h:mm", { locale: ko }))
          }
        }
      } catch (error) {
        console.error("Error parsing date:", error)
      }
    }
  }, [value])

  // minDate와 minTime이 변경될 때 effectiveMinTime 업데이트
  useEffect(() => {
    // 선택된 날짜가 minDate와 같은 날짜인 경우에만 minTime 적용
    if (selectedDate && minDate && minTime) {
      const minDateObj = new Date(minDate)

      // 날짜 부분만 비교 (시간 제외)
      const selectedDateOnly = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())

      const minDateOnly = new Date(minDateObj.getFullYear(), minDateObj.getMonth(), minDateObj.getDate())

      // 선택된 날짜가 minDate와 같은 날짜인 경우에만 minTime 적용
      if (selectedDateOnly.getTime() === minDateOnly.getTime()) {
        setEffectiveMinTime(minTime)
      } else if (selectedDateOnly.getTime() > minDateOnly.getTime()) {
        // 선택된 날짜가 minDate보다 이후인 경우 minTime 제한 없음
        setEffectiveMinTime(undefined)
      } else {
        // 선택된 날짜가 minDate보다 이전인 경우 (이 경우는 발생하지 않아야 함)
        setEffectiveMinTime(undefined)
      }
    } else {
      setEffectiveMinTime(minTime)
    }
  }, [selectedDate, minDate, minTime])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle date change
  const handleDateChange = (date: Date) => {
    const dateValue = date.toISOString()

    if (!dateValue) {
      setSelectedDate(null)
      onChange({ target: { name, value: "" } })
      return
    }

    // Create a new date with the selected date and current time
    const newDate = new Date(dateValue)

    if (selectedDate) {
      // Keep the time part from the previously selected date
      newDate.setHours(selectedDate.getHours(), selectedDate.getMinutes())
    } else {
      // Set default time to current time
      const now = new Date()
      newDate.setHours(now.getHours(), now.getMinutes())
    }

    setSelectedDate(newDate)
    updateDateTime(newDate)
  }

  // Handle time change - 12시간 형식 처리
  const handleTimeChange = (timeValue: string) => {
    if (!timeValue || !selectedDate) {
      return
    }

    // 12시간 형식 파싱 (예: "02:30 PM")
    const timeMatch = timeValue.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
    if (!timeMatch) {
      return
    }

    let hours = Number.parseInt(timeMatch[1], 10)
    const minutes = Number.parseInt(timeMatch[2], 10)
    const period = timeMatch[3].toUpperCase()

    // 12시간 형식을 24시간 형식으로 변환
    if (period === "PM" && hours !== 12) {
      hours += 12
    } else if (period === "AM" && hours === 12) {
      hours = 0
    }

    if (isNaN(hours) || isNaN(minutes)) {
      return
    }

    // Create a new date with the current date and the selected time
    const newDate = new Date(selectedDate)
    // Make sure we're setting exact hours and minutes without timezone conversions
    newDate.setHours(hours, minutes, 0, 0)

    setSelectedDate(newDate)
    updateDateTime(newDate)
  }

  // Update parent component with ISO string
  const updateDateTime = (date: Date) => {
    if (isValid(date)) {
      // Update display value with 12-hour format including AM/PM
      setDisplayValue(format(date, "yyyy년 MM월 dd일 a h:mm", { locale: ko }))

      // Create ISO string but ensure that it represents the exact local time selected
      // This prevents timezone offsets from affecting the time
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const day = String(date.getDate()).padStart(2, "0")
      const hours = String(date.getHours()).padStart(2, "0")
      const minutes = String(date.getMinutes()).padStart(2, "0")

      // Create an ISO string manually with the local time parts
      const isoString = `${year}-${month}-${day}T${hours}:${minutes}:00`
      onChange({ target: { name, value: isoString } })
    }
  }

  // Toggle dropdown
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
    }
  }

  return (
    <div className={`relative ${className}`} ref={pickerRef}>
      {label && (
        <label htmlFor={id || name} className="flex items-center text-sm font-medium mb-2 text-text-secondary">
          {label} {required && <span className="text-purple-600 ml-1">*</span>}
        </label>
      )}

      <div className={`relative w-full cursor-pointer ${disabled ? "opacity-70" : ""}`} onClick={toggleDropdown}>
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <CalendarMonth className="text-text-secondary text-sm" />
        </div>

        <input
          type="text"
          id={id || name}
          name={name}
          value={displayValue}
          readOnly
          placeholder={placeholder}
          disabled={disabled}
          className="w-full pl-10 pr-10 py-3 text-text-secondary rounded-lg bg-input-background border border-input-border hover:border-input-border-hover focus:outline-none focus:ring-1 focus:ring-point-color-indigo focus:border-transparent transition-all duration-200 cursor-pointer"
        />

        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDown
            className={`text-text-secondary text-sm transition-transform duration-200 ${
              isOpen ? "transform rotate-180" : ""
            }`}
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
            className="absolute z-10 mt-1 w-full bg-component-background border border-component-border rounded-lg shadow-lg"
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
                  <CalendarMonth className="mr-2 text-point-color-indigo h-4 w-4" />
                  날짜 선택
                </div>
                <DatePicker
                  value={selectedDate ? new Date(selectedDate) : undefined}
                  onChange={(date: Date | undefined) => {
                    if (date) {
                      handleDateChange(date)
                    }
                  }}
                  minDate={minDate ? new Date(minDate) : undefined}
                  className="w-full rounded-lg text-text-secondary"
                />
              </motion.div>

              <motion.div
                initial={{ x: 5, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.2 }}
              >
                <div className="flex items-center text-sm font-medium mb-2 text-text-secondary">
                  <Clock className="mr-2 text-point-color-indigo h-4 w-4" />
                  시간 선택
                </div>
                <TimePicker
                  value={selectedDate ? format(selectedDate, "hh:mm a", { locale: ko }) : ""}
                  onChange={handleTimeChange}
                  format="12"
                  showSeconds={false}
                  minTime={effectiveMinTime}
                  className="w-full rounded-lg border-input-border text-text-secondary focus:outline-none focus:ring-point-color-indigo hover:border-input-border-hover"
                />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.2 }}
              className="px-3 py-2 bg-component-secondary-background border-t border-component-border rounded-b-lg"
            >
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                완료
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
