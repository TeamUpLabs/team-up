const TaskSkeleton = ({ isPreview }: { isPreview?: boolean }) => {
  return (
    <div className="bg-component-secondary-background p-4 rounded-lg border border-component-border flex flex-col justify-between space-y-4 animate-pulse">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className={`${isPreview ? 'h-3 w-12' : 'h-6 w-20'} bg-gray-200 rounded-md`}></div>
          <div className={`${isPreview ? 'h-2 w-2' : 'h-5 w-5'} bg-gray-200 rounded-md`}></div>
        </div>
        <div className={`${isPreview ? 'h-5 w-3/4' : 'h-5 w-3/4'} bg-gray-200 rounded-md mb-2`}></div>
        <div className={`${isPreview ? 'h-5 w-full' : 'h-10 w-full'} bg-gray-200 rounded-md mb-3`}></div>
      </div>
      <div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        </div>
        <div className="flex items-center">
          <div className="flex -space-x-2">
            <div className={`${isPreview ? 'w-2 h-2' : 'w-6 h-6'} bg-gray-200 rounded-full`}></div>
            <div className={`${isPreview ? 'w-2 h-2' : 'w-6 h-6'} bg-gray-200 rounded-full`}></div>
          </div>
          <div className={`${isPreview ? 'h-2 w-2' : 'h-5 w-10'} bg-gray-200 rounded-md`}></div>
        </div>
      </div>
    </div>
  );
};

export default function RecentTaskSkeleton({ isPreview }: { isPreview?: boolean }) {
  return (
    <div className={isPreview ? 'rounded-lg overflow-hidden bg-component-background p-3 origin-top-left' : 'col-span-1 sm:col-span-2 bg-component-background p-4 sm:p-6 rounded-lg shadow-md border border-component-border'}>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className={`font-semibold text-text-primary ${isPreview ? 'text-xs' : 'text-lg sm:text-xl'}`}>최근 작업</h2>
      </div>
      <div className={`grid grid-cols-1 ${isPreview ? 'md:grid-cols-1 gap-2' : 'md:grid-cols-2 gap-6'}`}>
        {isPreview ? (
          <TaskSkeleton isPreview={isPreview} />
        ) : (
          <>
            <TaskSkeleton />
            <TaskSkeleton />
          </>
        )}
      </div>
    </div>
  )
} 