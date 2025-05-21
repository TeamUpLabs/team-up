export default function ActivitySkeleton({ isPreview = false }: { isPreview?: boolean }) {
  return (
    <div className={isPreview ? 'rounded-lg overflow-hidden bg-component-background p-3 origin-top-left' : 'col-span-1 sm:col-span-2 bg-component-background p-4 sm:p-6 rounded-lg shadow-md border border-component-border'}>
      {/* Header Skeleton: Title and Options Button */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className={`font-semibold text-text-primary ${isPreview ? 'text-xs' : 'text-lg sm:text-xl'}`}>일별 활동량</h2>
      </div>

      {/* Detailed Chart Area Skeleton */}
      <div className={`${isPreview ? 'h-[180px]' : 'h-[300px]'} flex flex-col animate-pulse`}>
        {/* 1. Legend Skeleton (approximates Recharts legend position and size) */}
        <div className={`flex justify-end items-center ${isPreview ? 'h-[20px] pr-[3px] mb-0.5' : 'h-[30px] pr-[5px] mb-1'}`}>
          <div className={`${isPreview ? 'h-2 w-8 mr-2' : 'h-3 w-12 mr-3'} bg-gray-300 rounded`}></div>
          <div className={`${isPreview ? 'h-2 w-10' : 'h-3 w-16'} bg-gray-300 rounded`}></div>
        </div>

        {/* 2. Main Chart Body (Y-Axis, Plot Area) */}
        <div className="flex-grow flex overflow-hidden">
          {/* Y-Axis Tick Placeholders (left side) */}
          <div className={`${isPreview ? 'w-[25px] py-[3px] pr-[3px]' : 'w-[35px] py-[5px] pr-[5px]'} flex flex-col justify-between items-end`}>
            {isPreview ? (
              <>
                <div className="h-2 bg-gray-300 rounded w-3/5"></div>
                <div className="h-2 bg-gray-300 rounded w-4/5"></div>
                <div className="h-2 bg-gray-300 rounded w-1/2"></div>
              </>
            ) : (
              <>
                <div className="h-2.5 bg-gray-300 rounded w-3/5"></div>
                <div className="h-2.5 bg-gray-300 rounded w-4/5"></div>
                <div className="h-2.5 bg-gray-300 rounded w-3/5"></div>
                <div className="h-2.5 bg-gray-300 rounded w-1/2"></div>
                <div className="h-2.5 bg-gray-300 rounded w-4/5"></div>
              </>
            )}
          </div>

          {/* Plot Area with Horizontal Grid Lines Skeleton (center) */}
          <div className="flex-grow relative border-t border-b border-gray-300 opacity-50">
            {/* Horizontal Grid Lines (approximating 3-4 lines in between) */}
            {isPreview ? (
              <div className="absolute w-full h-px bg-gray-300 opacity-70 top-[50%]"></div>
            ) : (
              <>
                <div className="absolute w-full h-px bg-gray-300 opacity-70 top-[25%]"></div>
                <div className="absolute w-full h-px bg-gray-300 opacity-70 top-[50%]"></div>
                <div className="absolute w-full h-px bg-gray-300 opacity-70 top-[75%]"></div>
              </>
            )}
          </div>
        </div>

        {/* 3. X-Axis Tick Placeholders (bottom) */}
        <div className={`${isPreview ? 'h-[20px] pt-[3px] pl-[25px] pr-[3px]' : 'h-[25px] pt-[5px] pl-[35px] pr-[5px]'} flex justify-around items-center`}>
          {isPreview ? (
            <>
              <div className="h-2 bg-gray-300 rounded w-6"></div>
              <div className="h-2 bg-gray-300 rounded w-8"></div>
              <div className="h-2 bg-gray-300 rounded w-6"></div>
            </>
          ) : (
            <>
              <div className="h-2.5 bg-gray-300 rounded w-8"></div>
              <div className="h-2.5 bg-gray-300 rounded w-10"></div>
              <div className="h-2.5 bg-gray-300 rounded w-8"></div>
              <div className="h-2.5 bg-gray-300 rounded w-12"></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
