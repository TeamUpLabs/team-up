interface SearchFilterBarProps {
  searchQuery: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export default function SearchFilterBar({
  searchQuery,
  statusFilter,
  onSearchChange,
  onStatusChange
}: SearchFilterBarProps) {
  return (
    <div className="rounded-lg">
      <div className="flex flex-col sm:flex-row gap-4 lg:items-center justify-between">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="이름, 역할, 작업으로 검색..."
            className="pl-10 pr-4 py-2.5 w-full bg-project-page-title-background text-text-secondary rounded-lg
                      border border-component-border focus:border-point-color-purple-hover focus:ring-1 focus:ring-point-color-purple-hover/20 
                      outline-none transition-all duration-200 placeholder-text-secondary"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-secondary hover:text-text-primary"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="pl-10 pr-8 py-2.5 w-full sm:w-44 appearance-none bg-project-page-title-background text-text-secondary rounded-lg
                      border border-component-border focus:border-point-color-purple-hover focus:ring-1 focus:ring-point-color-purple-hover/20 
                      outline-none transition-all duration-200"
          >
            <option value="all">모든 상태</option>
            <option value="active">활성</option>
            <option value="away">자리비움</option>
            <option value="offline">오프라인</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
