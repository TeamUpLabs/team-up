"use client";
import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function RecentFileCard() {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDeleteClick = () => {
    // Implement delete functionality here
    console.log('Delete button clicked');
    setShowDropdown(false);
  };
  return (
    <div className="col-span-1 sm:col-span-2 bg-component-background p-4 sm:p-6 rounded-lg shadow-md border border-component-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-text-primary">최근 파일</h2>
        <div className="relative" ref={dropdownRef}>
          <button 
            className="flex items-center text-text-secondary hover:text-text-primary p-2 rounded-md border border-component-border"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <FontAwesomeIcon icon={faEllipsis} />
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-1 w-36 bg-component-secondary-background border border-component-border rounded-md shadow-lg z-10">
              <ul>
                <li>
                  <button 
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-component-tertiary-background flex items-center rounded-md"
                    onClick={handleDeleteClick}
                  >
                    <FontAwesomeIcon icon={faTrash} className="mr-2" />
                    삭제
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="space-y-2 sm:space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center p-3 bg-component-secondary-background rounded-lg hover:bg-component-tertiary-background border border-component-border transition-colors">
          <div className="p-2 bg-blue-100 rounded">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <div className="mt-2 sm:mt-0 ml-0 sm:ml-3 w-full sm:flex-1">
            <p className="text-text-primary">프로젝트 기획안.pdf</p>
            <p className="text-sm text-text-secondary">2MB · 오늘 수정됨</p>
          </div>
          <div className="flex items-center space-x-2 mt-2 sm:mt-0">
            <div className="text-xs px-2 py-1 bg-blue-500/50 text-text-primary rounded">공유됨</div>
            <button className="p-2 hover:bg-component-secondary-background rounded">
              <svg className="w-4 h-4 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center p-3 bg-component-secondary-background rounded-lg hover:bg-component-tertiary-background border border-component-border transition-colors">
          <div className="p-2 bg-green-100 rounded">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <div className="mt-2 sm:mt-0 ml-0 sm:ml-3 w-full sm:flex-1">
            <p className="text-text-primary">월간 보고서.xlsx</p>
            <p className="text-sm text-text-secondary">1.5MB · 어제 수정됨</p>
          </div>
          <div className="flex items-center space-x-2 mt-2 sm:mt-0">
            <div className="text-xs px-2 py-1 bg-component-secondary-background text-text-secondary rounded">비공개</div>
            <button className="p-2 hover:bg-component-secondary-background rounded">
              <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}