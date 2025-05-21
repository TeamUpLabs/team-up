export default function MilestoneCardSkeleton({ isPreview = false }: { isPreview?: boolean }) {
  return (
    <div className={`col-span-1 sm:col-span-2 ${isPreview ? 'rounded-lg overflow-hidden bg-component-background p-3 origin-top-left' : 'bg-component-background p-4 sm:p-6 rounded-lg shadow-md overflow-x-auto border border-component-border'}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`font-semibold text-text-primary ${isPreview ? 'text-xs' : 'text-lg sm:text-xl'}`}>다가오는 마일스톤</h2>
      </div>
      <div className="space-y-4">
        <div className="bg-component-secondary-background p-3 rounded-lg border border-component-border">
          <div className={`${isPreview ? 'h-2' : 'h-4'} bg-component-skeleton-background rounded w-2/3 animate-[pulse_1.5s_ease-in-out_infinite] mt-2`}></div>
          <div className="mt-4 flex items-center">
            <div className={`w-full bg-component-skeleton-background rounded-full h-1.5 ${isPreview ? 'w-12' : 'w-24'}`}>
              <div className="bg-component-skeleton-background h-1.5 rounded-full w-[60%] animate-[pulse_1.5s_ease-in-out_infinite]"></div>
            </div>
            <div className={`ml-2 ${isPreview ? 'h-2' : 'h-4'} bg-component-skeleton-background rounded ${isPreview ? 'w-12' : 'w-24'} animate-[pulse_1.5s_ease-in-out_infinite]`}></div>
          </div>
          <div className="flex flex-col gap-2 mt-3">
            <div className="flex items-center">
              <span className={`${isPreview ? 'text-xs' : 'text-sm'} text-text-secondary mr-2`}>시작일:</span>
              <div className={`${isPreview ? 'h-2' : 'h-4'} bg-component-skeleton-background rounded ${isPreview ? 'w-12' : 'w-24'} animate-[pulse_1.5s_ease-in-out_infinite]`}></div>
            </div>
            <div className="flex items-center">
              <span className={`${isPreview ? 'text-xs' : 'text-sm' } text-text-secondary mr-2`}>종료일:</span>
              <div className={`${isPreview ? 'h-2' : 'h-4'} bg-component-skeleton-background rounded ${isPreview ? 'w-12' : 'w-24'} animate-[pulse_1.5s_ease-in-out_infinite]`}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}