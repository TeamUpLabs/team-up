"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Clock, ChevronUp, ChevronDown } from "flowbite-react-icons/outline"

interface TimePickerProps {
  value?: string
  onChange?: (time: string) => void
  format?: "12" | "24"
  showSeconds?: boolean
  disabled?: boolean
  placeholder?: string
  minTime?: string
  maxTime?: string
  step?: number
  className?: string
}

interface TimeState {
  hours: number
  minutes: number
  seconds: number
  period: "AM" | "PM"
}

const TimePicker = ({
  value = "",
  onChange,
  format = "24",
  showSeconds = false,
  disabled = false,
  placeholder = "시간 선택",
  minTime,
  maxTime,
  step = 1,
  className = "",
}: TimePickerProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [timeState, setTimeState] = useState<TimeState>(() => {
    if (value) {
      return parseTime(value, format)
    }
    const now = new Date()
    return {
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds(),
      period: now.getHours() >= 12 ? "PM" : "AM",
    }
  })

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 시간 파싱 함수
  function parseTime(timeStr: string, fmt: "12" | "24"): TimeState {
    const defaultTime = {
      hours: 0,
      minutes: 0,
      seconds: 0,
      period: "AM" as const,
    }

    if (!timeStr) return defaultTime

    try {
      if (fmt === "12") {
        const match = timeStr.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/i)
        if (!match) return defaultTime

        let hours = Number.parseInt(match[1])
        const minutes = Number.parseInt(match[2])
        const seconds = Number.parseInt(match[3] || "0")
        const period = match[4].toUpperCase() as "AM" | "PM"

        if (period === "PM" && hours !== 12) hours += 12
        if (period === "AM" && hours === 12) hours = 0

        return { hours, minutes, seconds, period }
      } else {
        const match = timeStr.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/)
        if (!match) return defaultTime

        const hours = Number.parseInt(match[1])
        const minutes = Number.parseInt(match[2])
        const seconds = Number.parseInt(match[3] || "0")

        return {
          hours,
          minutes,
          seconds,
          period: hours >= 12 ? "PM" : "AM",
        }
      }
    } catch {
      return defaultTime
    }
  }

  // 시간을 분 단위로 변환하는 함수
  const timeToMinutes = useCallback((time: TimeState): number => {
    return time.hours * 60 + time.minutes
  }, [])

  // 시간 포맷팅 함수
  const formatTime = useCallback(
    (time: TimeState): string => {
      if (format === "12") {
        const displayHours = time.hours === 0 ? 12 : time.hours > 12 ? time.hours - 12 : time.hours
        const hoursStr = displayHours.toString().padStart(2, "0")
        const minutesStr = time.minutes.toString().padStart(2, "0")
        const secondsStr = time.seconds.toString().padStart(2, "0")

        if (showSeconds) {
          return `${hoursStr}:${minutesStr}:${secondsStr} ${time.period}`
        }
        return `${hoursStr}:${minutesStr} ${time.period}`
      } else {
        const hoursStr = time.hours.toString().padStart(2, "0")
        const minutesStr = time.minutes.toString().padStart(2, "0")
        const secondsStr = time.seconds.toString().padStart(2, "0")

        if (showSeconds) {
          return `${hoursStr}:${minutesStr}:${secondsStr}`
        }
        return `${hoursStr}:${minutesStr}`
      }
    },
    [format, showSeconds],
  )

  // 시간 유효성 검사
  const isTimeValid = useCallback(
    (time: TimeState): boolean => {
      const currentMinutes = timeToMinutes(time)

      if (minTime) {
        const minTimeState = parseTime(minTime, format)
        const minMinutes = timeToMinutes(minTimeState)
        if (currentMinutes < minMinutes) return false
      }

      if (maxTime) {
        const maxTimeState = parseTime(maxTime, format)
        const maxMinutes = timeToMinutes(maxTimeState)
        if (currentMinutes > maxMinutes) return false
      }

      return true
    },
    [minTime, maxTime, format, timeToMinutes],
  )

  // 시간 업데이트
  const updateTime = useCallback(
    (newTime: TimeState) => {
      if (isTimeValid(newTime)) {
        setTimeState(newTime)
        onChange?.(formatTime(newTime))
      }
    },
    [isTimeValid, formatTime, onChange],
  )

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

  // 키보드 이벤트
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      if (event.key === "Escape") {
        setIsOpen(false)
        inputRef.current?.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  // minTime이 변경될 때 현재 선택된 시간의 유효성 검사
  useEffect(() => {
    if (minTime && value) {
      const currentTimeState = parseTime(value, format)
      if (!isTimeValid(currentTimeState)) {
        // 현재 시간이 유효하지 않으면 minTime으로 설정
        const minTimeState = parseTime(minTime, format)
        setTimeState(minTimeState)
        onChange?.(formatTime(minTimeState))
      }
    }
  }, [minTime, value, format, isTimeValid, formatTime, onChange])

  const displayValue = value || formatTime(timeState)

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div
        className={`flex items-center gap-2 w-full px-3 py-2 border border-input-border rounded-lg cursor-pointer transition-all duration-200 ${
          disabled
            ? "opacity-50 cursor-not-allowed bg-gray-50"
            : isOpen
              ? "ring-1 ring-input-border-hover"
              : "hover:border-input-border-hover"
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <Clock className="flex-shrink-0 w-4 h-4 text-text-secondary" />
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          placeholder={placeholder}
          readOnly
          disabled={disabled}
          className="bg-transparent outline-none cursor-pointer text-text-secondary"
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-component-secondary-background border border-component-border rounded-lg shadow-lg z-50 p-4">
          <TimeSelector
            time={timeState}
            onChange={updateTime}
            format={format}
            showSeconds={showSeconds}
            step={step}
            minTime={minTime}
            maxTime={maxTime}
          />
        </div>
      )}
    </div>
  )
}

// 시간 선택 컴포넌트
interface TimeSelectorProps {
  time: TimeState
  onChange: (time: TimeState) => void
  format: "12" | "24"
  showSeconds: boolean
  step: number
  minTime?: string
  maxTime?: string
}

const TimeSelector = ({ time, onChange, format, showSeconds, step, minTime, maxTime }: TimeSelectorProps) => {
  // 시간을 분 단위로 변환하는 함수
  const timeToMinutes = (timeState: TimeState): number => {
    return timeState.hours * 60 + timeState.minutes
  }

  // 시간 파싱 함수
  const parseTime = (timeStr: string, fmt: "12" | "24"): TimeState => {
    const defaultTime = {
      hours: 0,
      minutes: 0,
      seconds: 0,
      period: "AM" as const,
    }

    if (!timeStr) return defaultTime

    try {
      if (fmt === "12") {
        const match = timeStr.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/i)
        if (!match) return defaultTime

        let hours = Number.parseInt(match[1])
        const minutes = Number.parseInt(match[2])
        const seconds = Number.parseInt(match[3] || "0")
        const period = match[4].toUpperCase() as "AM" | "PM"

        if (period === "PM" && hours !== 12) hours += 12
        if (period === "AM" && hours === 12) hours = 0

        return { hours, minutes, seconds, period }
      } else {
        const match = timeStr.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/)
        if (!match) return defaultTime

        const hours = Number.parseInt(match[1])
        const minutes = Number.parseInt(match[2])
        const seconds = Number.parseInt(match[3] || "0")

        return {
          hours,
          minutes,
          seconds,
          period: hours >= 12 ? "PM" : "AM",
        }
      }
    } catch {
      return defaultTime
    }
  }

  // 시간 유효성 검사
  const isTimeValid = (newTime: TimeState): boolean => {
    const currentMinutes = timeToMinutes(newTime)

    if (minTime) {
      const minTimeState = parseTime(minTime, format)
      const minMinutes = timeToMinutes(minTimeState)
      if (currentMinutes < minMinutes) return false
    }

    if (maxTime) {
      const maxTimeState = parseTime(maxTime, format)
      const maxMinutes = timeToMinutes(maxTimeState)
      if (currentMinutes > maxMinutes) return false
    }

    return true
  }

  const adjustValue = (type: "hours" | "minutes" | "seconds", delta: number) => {
    const newTime = { ...time }

    switch (type) {
      case "hours":
        if (format === "12") {
          newTime.hours = (newTime.hours + delta + 24) % 24
        } else {
          newTime.hours = Math.max(0, Math.min(23, newTime.hours + delta))
        }
        break
      case "minutes":
        newTime.minutes = Math.max(0, Math.min(59, newTime.minutes + delta * step))
        break
      case "seconds":
        newTime.seconds = Math.max(0, Math.min(59, newTime.seconds + delta * step))
        break
    }

    newTime.period = newTime.hours >= 12 ? "PM" : "AM"

    // 유효성 검사 후에만 변경
    if (isTimeValid(newTime)) {
      onChange(newTime)
    }
  }

  const togglePeriod = () => {
    const newTime = { ...time }
    if (newTime.period === "AM") {
      newTime.hours += 12
      newTime.period = "PM"
    } else {
      newTime.hours -= 12
      newTime.period = "AM"
    }

    // 유효성 검사 후에만 변경
    if (isTimeValid(newTime)) {
      onChange(newTime)
    }
  }

  const displayHours =
    format === "12" ? (time.hours === 0 ? 12 : time.hours > 12 ? time.hours - 12 : time.hours) : time.hours

  // 버튼 비활성화 상태 확인
  const isIncrementDisabled = (type: "hours" | "minutes" | "seconds"): boolean => {
    const testTime = { ...time }
    switch (type) {
      case "hours":
        if (format === "12") {
          testTime.hours = (testTime.hours + 1 + 24) % 24
        } else {
          testTime.hours = Math.min(23, testTime.hours + 1)
        }
        break
      case "minutes":
        testTime.minutes = Math.min(59, testTime.minutes + step)
        break
      case "seconds":
        testTime.seconds = Math.min(59, testTime.seconds + step)
        break
    }
    testTime.period = testTime.hours >= 12 ? "PM" : "AM"
    return !isTimeValid(testTime)
  }

  const isDecrementDisabled = (type: "hours" | "minutes" | "seconds"): boolean => {
    const testTime = { ...time }
    switch (type) {
      case "hours":
        if (format === "12") {
          testTime.hours = (testTime.hours - 1 + 24) % 24
        } else {
          testTime.hours = Math.max(0, testTime.hours - 1)
        }
        break
      case "minutes":
        testTime.minutes = Math.max(0, testTime.minutes - step)
        break
      case "seconds":
        testTime.seconds = Math.max(0, testTime.seconds - step)
        break
    }
    testTime.period = testTime.hours >= 12 ? "PM" : "AM"
    return !isTimeValid(testTime)
  }

  const isPeriodToggleDisabled = (): boolean => {
    const testTime = { ...time }
    if (testTime.period === "AM") {
      testTime.hours += 12
      testTime.period = "PM"
    } else {
      testTime.hours -= 12
      testTime.period = "AM"
    }
    return !isTimeValid(testTime)
  }

  return (
    <div className="flex items-center bg-component-secondary-background justify-center space-x-4">
      {/* 시간 */}
      <TimeColumn
        label="시"
        value={displayHours}
        onIncrement={() => adjustValue("hours", 1)}
        onDecrement={() => adjustValue("hours", -1)}
        incrementDisabled={isIncrementDisabled("hours")}
        decrementDisabled={isDecrementDisabled("hours")}
      />

      <div className="text-2xl font-bold text-text-secondary">:</div>

      {/* 분 */}
      <TimeColumn
        label="분"
        value={time.minutes}
        onIncrement={() => adjustValue("minutes", 1)}
        onDecrement={() => adjustValue("minutes", -1)}
        incrementDisabled={isIncrementDisabled("minutes")}
        decrementDisabled={isDecrementDisabled("minutes")}
      />

      {showSeconds && (
        <>
          <div className="text-2xl font-bold text-text-secondary">:</div>
          {/* 초 */}
          <TimeColumn
            label="초"
            value={time.seconds}
            onIncrement={() => adjustValue("seconds", 1)}
            onDecrement={() => adjustValue("seconds", -1)}
            incrementDisabled={isIncrementDisabled("seconds")}
            decrementDisabled={isDecrementDisabled("seconds")}
          />
        </>
      )}

      {format === "12" && (
        <div className="flex flex-col items-center">
          <div className="text-xs text-text-primary-color mb-2">AM/PM</div>
          <button
            type="button"
            onClick={togglePeriod}
            disabled={isPeriodToggleDisabled()}
            className={`px-3 py-2 rounded-lg font-medium transition-colors ${
              isPeriodToggleDisabled()
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-100 hover:bg-blue-200 text-blue-800"
            }`}
          >
            {time.period}
          </button>
        </div>
      )}
    </div>
  )
}

// 시간 컬럼 컴포넌트
interface TimeColumnProps {
  label: string
  value: number
  onIncrement: () => void
  onDecrement: () => void
  incrementDisabled?: boolean
  decrementDisabled?: boolean
}

const TimeColumn = ({
  label,
  value,
  onIncrement,
  onDecrement,
  incrementDisabled = false,
  decrementDisabled = false,
}: TimeColumnProps) => {
  return (
    <div className="flex flex-col items-center">
      <div className="text-xs text-text-primary-color mb-2">{label}</div>
      <div className="flex flex-col items-center space-y-1">
        <button
          type="button"
          onClick={onIncrement}
          disabled={incrementDisabled}
          className={`p-1 rounded transition-colors ${
            incrementDisabled
              ? "text-gray-300 cursor-not-allowed"
              : "hover:bg-component-tertiary-background text-text-primary-color"
          }`}
        >
          <ChevronUp className="w-4 h-4" />
        </button>

        <div className="w-12 h-10 flex items-center justify-center bg-component-tertiary-background rounded-lg font-mono text-lg font-semibold">
          {value.toString().padStart(2, "0")}
        </div>

        <button
          type="button"
          onClick={onDecrement}
          disabled={decrementDisabled}
          className={`p-1 rounded transition-colors ${
            decrementDisabled
              ? "text-gray-300 cursor-not-allowed"
              : "hover:bg-component-tertiary-background text-text-primary-color"
          }`}
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default TimePicker
