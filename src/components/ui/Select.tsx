"use client";

import type React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { faChevronDown, faXmark, faCheck } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface SelectOption {
  name: string;
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  color?: BadgeColor;
  placeholder?: string;
  multiple?: boolean;
  searchable?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  className?: string;
  dropDownClassName?: string;
  maxHeight?: number;
  renderOption?: (option: SelectOption, isSelected: boolean) => React.ReactNode;
  renderValue?: (value: string | string[]) => React.ReactNode;
  dropdownAlign?: "start" | "center" | "end";
}

type BadgeColor = "gray" | "red" | "green" | "blue" | "yellow" | "purple" | "orange" | "pink" | "zinc" | "teal" | "stone" | "neutral" | "emerald";

export default function Select({
  options,
  value,
  onChange,
  color = "gray",
  placeholder = "옵션을 선택하세요",
  multiple = false,
  searchable = false,
  disabled = false,
  clearable = false,
  className = "",
  dropDownClassName = "",
  maxHeight = 200,
  renderOption,
  renderValue,
  dropdownAlign = "center",
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [focusedIndex, setFocusedIndex] = useState(-1)

  const selectRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const optionsRef = useRef<HTMLDivElement>(null)

  // 필터된 옵션들
  const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()))

  // 선택된 값들을 배열로 정규화
  const [selectedValues, setSelectedValues] = useState<string[]>(() => {
    return Array.isArray(value) ? value : value ? [value as string] : []
  })

  // Effect to synchronize selectedValues with the value prop when it changes externally
  useEffect(() => {
    setSelectedValues(Array.isArray(value) ? value : value ? [value as string] : []);
  }, [value]);

  // 옵션 선택 처리
  const handleOptionSelect = useCallback((option: SelectOption) => {
    if (option.disabled) return

    if (multiple) {
      const newValue = selectedValues.includes(option.value)
        ? selectedValues.filter((v) => v !== option.value)
        : [...selectedValues, option.value]
      onChange(newValue)
    } else {
      onChange(option.value)
      setIsOpen(false)
    }
  }, [multiple, selectedValues, onChange])

  // 외부 클릭 감지
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm("")
        setFocusedIndex(-1)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // 드롭다운이 열릴 때 검색 입력에 포커스
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen, searchable])

  // 키보드 네비게이션
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return

      switch (e.key) {
        case "Enter":
          e.preventDefault()
          if (!isOpen) {
            setIsOpen(true)
          } else if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
            const option = filteredOptions[focusedIndex]
            if (!option.disabled) {
              handleOptionSelect(option)
            }
          }
          break

        case "Escape":
          setIsOpen(false)
          setSearchTerm("")
          setFocusedIndex(-1)
          break

        case "ArrowDown":
          e.preventDefault()
          if (!isOpen) {
            setIsOpen(true)
          } else {
            setFocusedIndex((prev) => {
              const nextIndex = prev < filteredOptions.length - 1 ? prev + 1 : 0
              return nextIndex
            })
          }
          break

        case "ArrowUp":
          e.preventDefault()
          if (isOpen) {
            setFocusedIndex((prev) => {
              const nextIndex = prev > 0 ? prev - 1 : filteredOptions.length - 1
              return nextIndex
            })
          }
          break

        case "Tab":
          if (isOpen) {
            setIsOpen(false)
            setSearchTerm("")
            setFocusedIndex(-1)
          }
          break
      }
    },
    [isOpen, focusedIndex, filteredOptions, disabled, handleOptionSelect],
  )

  // 전체 선택 해제
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(multiple ? [] : "")
    setIsOpen(false)
    setSearchTerm("")
    setFocusedIndex(-1)
  }

  // 개별 태그 제거 (다중 선택)
  const handleRemoveTag = (valueToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (multiple) {
      const newValue = selectedValues.filter((v) => v !== valueToRemove)
      onChange(newValue)
    }
  }

  const badgeColors = {
    gray: "bg-gray-100 text-gray-800",
    red: "bg-red-100 text-red-800",
    green: "bg-green-100 text-green-800",
    blue: "bg-blue-100 text-blue-800",
    yellow: "bg-yellow-100 text-yellow-800",
    purple: "bg-purple-100 text-purple-800",
    orange: "bg-orange-100 text-orange-800",
    pink: "bg-pink-100 text-pink-800",
    zinc: "bg-zinc-100 text-zinc-800",
    teal: "bg-teal-100 text-teal-800",
    stone: "bg-stone-100 text-stone-800",
    neutral: "bg-neutral-100 text-neutral-800",
    emerald: "bg-emerald-100 text-emerald-800",
  };

  // 표시할 값 렌더링
  const renderDisplayValue = () => {
    if (renderValue) {
      return renderValue(multiple ? selectedValues : selectedValues[0] || "")
    }

    if (selectedValues.length === 0) {
      return <span className="text-text-secondary">{placeholder}</span>
    }

    if (multiple) {
      return (
        <div className="flex flex-wrap gap-1">
          {selectedValues.map((val) => {
            const option = options.find((opt) => opt.value === val)
            return option ? (
              <span
                key={val}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
              >
                {option.label}
                <button
                  type="button"
                  onClick={(e) => handleRemoveTag(val, e)}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </span>
            ) : null
          })}
        </div>
      )
    }

    const selectedOption = options.find((opt) => opt.value === selectedValues[0])
    return selectedOption ? selectedOption.label : placeholder
  }

  return (
    <div ref={selectRef} className={`relative ${badgeColors[color]} ${className}`} onKeyDown={handleKeyDown} tabIndex={disabled ? -1 : 0}>
      {/* Select 버튼 */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full focus:outline-none focus:ring-0 text-left text-text-secondary
          ${disabled ? "bg-gray-100 cursor-not-allowed" : "hover:border-gray-400 cursor-pointer"}
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0 text-sm">{renderDisplayValue()}</div>
          <div className="flex items-center gap-2">
            {clearable && selectedValues.length > 0 && (
              <button type="button" onClick={handleClear} className="hover:bg-component-background rounded-full p-1">
                <FontAwesomeIcon icon={faXmark} />
              </button>
            )}
            <FontAwesomeIcon icon={faChevronDown} size="sm" className={`ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </div>
        </div>
      </button>

      {/* 드롭다운 옵션들 */}
      <AnimatePresence>
        {isOpen && (
        <motion.div
           initial={{ opacity: 0, scaleY: 0.95, y: -4 }}
           animate={{ opacity: 1, scaleY: 1, y: 0 }}
           exit={{ opacity: 0, scaleY: 0.95, y: -4 }}
           transition={{ duration: 0.1, ease: "easeOut" }}
           className={`absolute z-50 w-max mt-3 bg-component-background border border-component-border rounded-md shadow-lg ${(() => {
            if (dropdownAlign === 'center') return 'left-1/2 -translate-x-1/2';
            if (dropdownAlign === 'end') return 'right-0';
            return 'left-0';
          })()} ${dropDownClassName}`}
          style={{ maxHeight: `${maxHeight}px` }}
        >
          {searchable && (
            <div className="p-2 border-b border-component-border">
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="검색..."
                className="w-full px-2 py-1 border border-component-border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div
            ref={optionsRef}
            className="max-h-60 overflow-auto divide-y divide-component-border"
            style={{ maxHeight: `${maxHeight}px` }}
            role="listbox"
          >
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-text-secondary text-center">검색 결과가 없습니다</div>
            ) : (
              filteredOptions.map((option, index) => {
                const isSelected = selectedValues.includes(option.value)
                const isFocused = index === focusedIndex

                let itemRoundedClass = "";
                if (filteredOptions.length > 0) {
                  if (filteredOptions.length === 1) {
                    itemRoundedClass = "rounded-md";
                  } else {
                    if (index === 0) {
                      itemRoundedClass = "rounded-t-md";
                    } else if (index === filteredOptions.length - 1) {
                      itemRoundedClass = "rounded-b-md";
                    }
                  }
                }

                return (
                  <div
                    key={option.value}
                    onClick={() => handleOptionSelect(option)}
                    className={`
                      px-3 py-2 cursor-pointer text-sm
                      ${option.disabled ? "text-text-secondary cursor-not-allowed" : "hover:bg-component-secondary-background"}
                      ${isSelected ? "bg-component-secondary-background text-text-primary" : "bg-transparent text-text-primary"}
                      ${isFocused ? "bg-component-secondary-background" : ""}
                      ${itemRoundedClass}
                    `}
                    role="option"
                    aria-selected={isSelected}
                  >
                    {renderOption ? (
                      renderOption(option, isSelected)
                    ) : (
                      <div className="flex items-center gap-2 justify-between">
                        <span className="text-text-primary">{option.label}</span>
                        {isSelected && <FontAwesomeIcon icon={faCheck} />}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </motion.div>
       )}
      </AnimatePresence>
    </div>
  )
}
