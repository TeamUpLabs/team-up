import { Check } from "flowbite-react-icons/outline"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Project } from "@/types/Project"

interface CompletionRateCardProps {
  project: Project;
}

// Function to calculate completion rate for last week
const calculateLastWeekCompletionRate = (project: Project | null): number => {
  if (!project?.tasks?.length) return 0;

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  // Get tasks created before last week
  const tasksLastWeek = project.tasks.filter(task => {
    const taskDate = new Date(task.createdAt);
    return taskDate < oneWeekAgo;
  });

  if (!tasksLastWeek.length) return 0;

  const completedLastWeek = tasksLastWeek.filter(task => task.status === 'done').length;
  return Math.round((completedLastWeek / tasksLastWeek.length) * 100);
};

export default function CompletionRateCard({ project }: CompletionRateCardProps) {
  // Calculate completion rate based on completed tasks vs total tasks
  const totalTasks = project.tasks?.length || 0;
  const completedTasks = project.tasks?.filter(task => task.status === 'done').length || 0;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Calculate week-over-week progress
  const weeklyProgress = completionRate - calculateLastWeekCompletionRate(project);

  return (
    <div className="bg-component-background rounded-lg shadow-sm p-6 border border-component-border space-y-2 hover:border-point-color-indigo-hover transition duration-200 ease-in-out">
      <div className="flex items-center justify-between">
        <div className="flex flex-col space-y-2">
          <span className="text-text-primary text-sm font-semibold">진행률</span>
          <span className="text-text-primary text-3xl font-bold">
            {completionRate || 0}%
          </span>
        </div>
        <div className="bg-pink-500/20 rounded-full p-2">
          <Check className="w-4 h-4 text-pink-500" />
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-text-secondary">
        {weeklyProgress !== 0 ? (
          <>
            {weeklyProgress > 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span className={weeklyProgress > 0 ? 'text-green-500' : 'text-red-500'}>
              {weeklyProgress > 0 ? '+' : ''}{weeklyProgress}% this week
            </span>
          </>
        ) : (
          <span className="text-text-secondary">No change this week</span>
        )}
      </div>
    </div >
  )
}