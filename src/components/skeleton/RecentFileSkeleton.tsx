export default function RecentFileSkeleton({ isPreview }: { isPreview?: boolean }) {
  return (
    <div className={`col-span-1 sm:col-span-2 ${isPreview ? 'rounded-lg overflow-hidden bg-component-background p-3 origin-top-left' : 'bg-component-background p-4 sm:p-6 rounded-lg shadow-md overflow-x-auto border border-component-border'}`}>
      <div className="flex items-center justify-between mb-2">
        <h2 className={`font-semibold text-text-primary ${isPreview ? 'text-xs' : 'text-lg sm:text-xl'}`}>최근 파일</h2>
      </div>  
      <div className="space-y-1">
        {[1, 2].map((_, i) => (
          <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center p-1.5 bg-component-secondary-background rounded-lg border border-component-border animate-pulse">
            <div className="p-1 bg-component-skeleton-background rounded mr-2"></div>
            <div className="mt-1 sm:mt-0 ml-0 sm:ml-1 w-full sm:flex-1">
              <div className="h-2 bg-component-skeleton-background rounded w-full mb-1"></div>
              <div className="h-1.5 bg-component-skeleton-background rounded w-12"></div>
            </div>
            <div className="flex items-center space-x-1 mt-1 sm:mt-0">
              <div className="h-2 w-8 bg-component-skeleton-background rounded"></div>
              <div className="h-3 w-3 bg-component-skeleton-background rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}