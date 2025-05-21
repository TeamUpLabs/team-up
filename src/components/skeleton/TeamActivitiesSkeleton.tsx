export default function TeamActivitiesSkeleton({ isPreview }: { isPreview?: boolean }) {
  return (
    <div className={`col-span-1 sm:col-span-2 ${isPreview ? 'rounded-lg overflow-hidden bg-component-background p-3 origin-top-left' : 'bg-component-background p-4 sm:p-6 rounded-lg shadow-md border border-component-border'}`}>
      <div className="flex items-center justify-between mb-2 sm:mb-4">
        <h2 className={`${isPreview ? 'text-xs' : 'text-lg sm:text-xl'} font-semibold text-text-primary`}>팀원 활동</h2>
      </div>
      <div className="max-h-[300px] overflow-y-auto divide-y divide-component-border">
        {Array(3).fill(0).map((_, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b border-component-border animate-pulse">
            <div className="flex items-center space-x-3">
              <div className={`${isPreview ? 'w-8 h-8' : 'w-10 h-10'} bg-component-skeleton-background rounded-full flex items-center justify-center`}>
                <div className={`${isPreview ? 'w-4 h-4' : 'w-6 h-6'} bg-component-skeleton-background rounded-sm`}></div>
              </div>
              <div className="space-y-2">
                <div className={`${isPreview ? 'h-2 w-12' : 'h-4 w-24'} bg-component-skeleton-background rounded`}></div>
                <div className={`${isPreview ? 'h-2 w-10' : 'h-3 w-20'} bg-component-skeleton-background rounded`}></div>
                <div className="flex items-center">
                  <span className={`${isPreview ? 'h-2 w-12' : 'h-2.5 w-[100px]'} bg-component-skeleton-background rounded`}></span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <div className="flex items-center space-x-2">
                <div className={`${isPreview ? 'w-2 h-2' : 'w-3 h-3'} bg-component-skeleton-background rounded-full`}></div>
                <div className={`${isPreview ? 'h-2 w-4' : 'h-3 w-12'} bg-component-skeleton-background rounded`}></div>
              </div>
              <div className={`${isPreview ? 'h-2 w-8' : 'h-2 w-16'} bg-component-skeleton-background rounded`}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}