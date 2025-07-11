"use client";

import React from 'react';
import { useState, useRef, useEffect, useCallback } from "react";

import { faChevronDown, faXmark, faCheck } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BadgeColor, badgeColors, darkBadgeColors } from "@/components/ui/Badge";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

export interface SelectOption {
  name: string;
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  label?: string;
  isRequired?: boolean;
  isEditable?: boolean;
  EditOnClick?: () => void;
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
  autoWidth?: boolean; // 드롭다운 너비를 옵션 길이에 맞춰 자동 조정
  isDark?: boolean;
  isHoverEffect?: boolean;
  isInputBg?: boolean;
}

export default function Select({
  label,
  isRequired,
  isEditable,
  EditOnClick,
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
  autoWidth = false,
  isDark = false,
  isHoverEffect = true,
  isInputBg = true,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const [dropdownWidth, setDropdownWidth] = useState<number | undefined>(undefined)

  const generatedId = React.useId();
  const inputId = generatedId;

  const selectRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const optionsRef = useRef<HTMLDivElement>(null)
  const hiddenMeasureRef = useRef<HTMLDivElement>(null)

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

  // 드롭다운 너비 계산
  useEffect(() => {
    if (autoWidth && hiddenMeasureRef.current) {
      const measureElement = hiddenMeasureRef.current;
      let maxWidth = 0;
      
      // 모든 옵션의 너비를 측정
      filteredOptions.forEach((option) => {
        measureElement.textContent = option.label;
        const optionWidth = measureElement.offsetWidth;
        maxWidth = Math.max(maxWidth, optionWidth);
      });
      
      // 검색 입력이 있는 경우 검색 입력의 너비도 고려
      if (searchable) {
        measureElement.textContent = "검색...";
        const searchWidth = measureElement.offsetWidth;
        maxWidth = Math.max(maxWidth, searchWidth);
      }
      
      // 패딩과 여백을 고려하여 최종 너비 설정
      const finalWidth = maxWidth + 48; // 좌우 패딩 24px씩
      setDropdownWidth(finalWidth);
    } else {
      setDropdownWidth(undefined);
    }
  }, [autoWidth, filteredOptions, searchable]);

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
        // Check if the click is outside the dropdown as well
        const dropdown = document.getElementById(`select-dropdown-${generatedId}`);
        if (dropdown && !dropdown.contains(event.target as Node)) {
          setIsOpen(false);
          setSearchTerm("");
          setFocusedIndex(-1);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [generatedId]);




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

  // 표시할 값 렌더링
  const renderDisplayValue = () => {
    if (renderValue) {
      return renderValue(multiple ? selectedValues : selectedValues[0] || "")
    }

    if (selectedValues.length === 0) {
      return <span className="text-text-secondary text-xs">{placeholder}</span>
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
    <div className="">
      {/* 숨겨진 측정 요소 */}
      {autoWidth && (
        <div
          ref={hiddenMeasureRef}
          className="absolute invisible whitespace-nowrap text-sm"
          style={{
            position: 'absolute',
            visibility: 'hidden',
            height: 0,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        />
      )}
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
      <div
        ref={selectRef}
        className={`relative
          ${isInputBg ? "bg-input-background" : ""} px-3 py-2 border border-input-border rounded-md transition-all duration-200
          ${isDark ? darkBadgeColors[color as BadgeColor] : badgeColors[color as BadgeColor]} 
          ${isHoverEffect ? "focus:outline-none focus:ring-1 focus:ring-point-color-indigo focus:border-transparent hover:border-input-border-hover" : ""}
          ${className}`
        }
        style={{
          width: autoWidth ? dropdownWidth : '100%',
          minWidth: autoWidth ? dropdownWidth : '100%',
        }}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
      >
        {/* Select 버튼 */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
          w-full focus:outline-none focus:ring-0 text-left
          ${disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"}
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

        <AnimatePresence>
          {isOpen && (
            <motion.div
              id={`select-dropdown-${generatedId}`}
              initial={{ opacity: 0, scaleY: 0.95 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0.95 }}
              transition={{ duration: 0.1, ease: "easeOut" }}
              className={`absolute z-[50] mt-1 bg-component-background border border-component-border rounded-md shadow-lg ${dropDownClassName}`}
              style={{
                top: '100%',
                left: 0,
                width: autoWidth ? dropdownWidth : '100%',
                minWidth: autoWidth ? dropdownWidth : '100%',
              }}
            >
                {searchable && (
                  <div className="p-2 border-b border-component-border">
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="검색..."
                      className="w-full px-2 py-1 border-input-border bg-input-background rounded focus:outline-none focus:ring-1 focus:ring-point-color-indigo"
                    />
                  </div>
                )}

                <div
                  ref={optionsRef}
                  className="overflow-auto"
                  style={{ maxHeight: `${maxHeight}px` }}
                  role="listbox"
                >
                  {filteredOptions.length === 0 ? (
                    <div className="px-3 py-2 text-text-secondary text-center">검색 결과가 없습니다</div>
                  ) : (
                    filteredOptions.map((option, index) => {
                      const isSelected = selectedValues.includes(option.value)
                      const isFocused = index === focusedIndex

                      return (
                        <div
                          key={option.value}
                          onClick={() => handleOptionSelect(option)}
                          className={`
                            px-3 py-2 cursor-pointer text-sm
                            ${option.disabled ? "text-text-secondary cursor-not-allowed" : "hover:bg-component-secondary-background"}
                            ${isSelected ? "bg-component-secondary-background text-text-primary" : "text-text-primary"}
                            ${isFocused ? "bg-component-secondary-background" : ""}
                          `}
                          role="option"
                          aria-selected={isSelected}
                        >
                          {renderOption ? (
                            renderOption(option, isSelected)
                          ) : (
                            <div className="flex items-center gap-2 justify-between">
                              <span>{option.label}</span>
                              {isSelected && <FontAwesomeIcon icon={faCheck} size="sm" />}
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
    </div>
  )
}
