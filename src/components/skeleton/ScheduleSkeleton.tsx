const ScheduleSkeleton = ({ isPreview }: { isPreview?: boolean }) => {
  return (
    <div className={isPreview ? 'rounded-lg overflow-hidden bg-component-background p-3 origin-top-left' : 'col-span-1 sm:col-span-2 bg-component-background p-4 sm:p-6 rounded-lg shadow-md border border-component-border'}>
      {/* Title Skeleton */}
      <div className={`flex items-center justify-between mb-2 sm:mb-4 ${isPreview ? 'mb-1' : ''}`}>
        <h2 className={`font-semibold text-text-primary ${isPreview ? 'text-xs' : 'text-lg sm:text-xl'}`}>일정</h2>
      </div>

      {/* Tabs Skeleton */}
      <div className={`flex mb-4 bg-component-secondary-background rounded-lg overflow-hidden w-fit p-1 ${isPreview ? 'mb-1' : ''}`}>
        <div className={`${isPreview ? 'px-2 py-1' : 'px-6 py-2'} rounded-lg ${isPreview ? 'text-[8px]' : 'text-base'} font-semibold text-text-secondary bg-component-tertiary-background_hover w-fit`}>회의 <span className={`ml-1 ${isPreview ? 'text-[8px]' : 'text-xs'} font-bold text-gray-400 animate-pulse`}>N</span></div>
        <div className={`${isPreview ? 'px-2 py-1' : 'px-6 py-2'} rounded-lg ${isPreview ? 'text-[8px]' : 'text-base'} font-semibold text-text-secondary bg-component-tertiary-background_hover w-fit`}>작업 <span className={`ml-1 ${isPreview ? 'text-[8px]' : 'text-xs'} font-bold text-gray-400 animate-pulse`}>N</span></div>
      </div>

      {/* Meeting Items Skeleton (assuming 'meetings' tab is default) */}
      <div className="space-y-4">
        {isPreview ? (
          [...Array(1)].map((_, index) => (
            <div key={index} className={`bg-component-secondary-background border border-component-border rounded-xl flex flex-col gap-3 ${isPreview ? 'p-2' : 'p-4'}`}>
              {/* Meeting Title and Status Skeleton */}
              <div className={`flex items-center justify-between ${isPreview ? 'mb-1' : ''}`}>
                <div className={`${isPreview ? 'h-3' : 'h-5'} bg-gray-300 rounded w-1/2 animate-pulse`}></div>
                <div className={`${isPreview ? 'h-2' : 'h-4'} bg-gray-300 rounded w-1/4 animate-pulse`}></div>
              </div>
              {/* Time Skeleton */}
              <div className={`${isPreview ? 'h-2' : 'h-4'} bg-gray-300 rounded w-1/3 animate-pulse`}></div>
              {/* Platform and Members Skeleton */}
              <div className={`flex items-center justify-between mt-2 ${isPreview ? 'mb-1' : ''}`}>
                <div className="flex items-center gap-2">
                  <div className={`${isPreview ? 'w-3 h-3' : 'w-5 h-5'} bg-gray-300 rounded animate-pulse`}></div>
                  <div className={`${isPreview ? 'h-2 w-10' : 'h-4 w-24'} bg-gray-300 rounded animate-pulse`}></div>
                </div>
                <div className="flex ml-auto gap-1">
                  <div className={`${isPreview ? 'w-5 h-5' : 'w-7 h-7'} bg-gray-300 rounded-full border-2 border-component-border animate-pulse`}></div>
                  <div className={`${isPreview ? 'w-5 h-5' : 'w-7 h-7'} bg-gray-300 rounded-full border-2 border-component-border -ml-2 animate-pulse`}></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          [...Array(2)].map((_, index) => (
            <div key={index} className={`bg-component-secondary-background border border-component-border rounded-xl flex flex-col gap-3 ${isPreview ? 'p-2' : 'p-4'}`}>
              {/* Meeting Title and Status Skeleton */}
              <div className={`flex items-center justify-between ${isPreview ? 'mb-1' : ''}`}>
                <div className={`${isPreview ? 'h-3' : 'h-5'} bg-gray-300 rounded w-1/2 animate-pulse`}></div>
                <div className={`${isPreview ? 'h-2' : 'h-4'} bg-gray-300 rounded w-1/4 animate-pulse`}></div>
              </div>
              {/* Time Skeleton */}
              <div className={`${isPreview ? 'h-2' : 'h-4'} bg-gray-300 rounded w-1/3 animate-pulse`}></div>
              {/* Platform and Members Skeleton */}
              <div className={`flex items-center justify-between mt-2 ${isPreview ? 'mb-1' : ''}`}>
                <div className="flex items-center gap-2">
                  <div className={`${isPreview ? 'w-3 h-3' : 'w-5 h-5'} bg-gray-300 rounded animate-pulse`}></div>
                  <div className={`${isPreview ? 'h-2 w-10' : 'h-4 w-24'} bg-gray-300 rounded animate-pulse`}></div>
                </div>
                <div className="flex ml-auto gap-1">
                  <div className={`${isPreview ? 'w-5 h-5' : 'w-7 h-7'} bg-gray-300 rounded-full border-2 border-component-border animate-pulse`}></div>
                  <div className={`${isPreview ? 'w-5 h-5' : 'w-7 h-7'} bg-gray-300 rounded-full border-2 border-component-border -ml-2 animate-pulse`}></div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ScheduleSkeleton;;