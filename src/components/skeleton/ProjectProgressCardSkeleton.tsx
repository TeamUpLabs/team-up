export default function ProjectProgressCardSkeleton({ isPreview }: { isPreview?: boolean }) {
    return (
      <div className={isPreview ? 'rounded-lg overflow-hidden bg-component-background p-3 origin-top-left' : 'col-span-1 sm:col-span-2 bg-component-background p-4 sm:p-6 rounded-lg shadow-md border border-component-border'}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`${isPreview ? 'text-xs' : 'text-lg sm:text-xl'} font-semibold text-text-primary`}>프로젝트 진행률</h2>
      </div>
      <div className="space-y-3 sm:space-y-4">
        <div className="flex justify-between items-center">
          <span className={`${isPreview ? 'text-[8px]' : 'text-text-secondary'}`}>전체 진행률</span>
          <div className={`${isPreview ? 'h-2 w-6' : 'h-5 w-12'} bg-component-skeleton-background rounded animate-[pulse_1.5s_ease-in-out_infinite]`}></div>
        </div>
        <div className="relative w-full bg-component-secondary-background rounded-full h-2.5 overflow-hidden">
          <div className={`${isPreview ? 'h-2 w-8' : 'h-2.5 w-3/5'} bg-component-skeleton-background rounded-full animate-[pulse_1.5s_ease-in-out_infinite]`}></div>
        </div>
        <div className={`grid grid-cols-3 ${isPreview ? 'gap-2' : 'gap-4'} mt-3 sm:mt-4`}>
          {['총 작업', '진행중', '완료'].map((label, index) => (
            <div key={index} className={`${isPreview ? 'p-1' : 'p-4'} bg-component-secondary-background rounded-lg text-center border border-component-border`}>
              <p className={`${isPreview ? 'text-[8px]' : 'text-text-secondary'}`}>{label}</p>
              <div className={`${isPreview ? 'h-2 w-6' : 'h-7 w-10'} bg-component-skeleton-background rounded mx-auto mt-2 animate-[pulse_1.5s_ease-in-out_infinite]'}`}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
    );
}
