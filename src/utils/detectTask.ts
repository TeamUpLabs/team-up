export interface Task {
  text: string;
  is_completed: boolean;
}

export const detectTasks = (markdownText: string): Task[] => {
  if (!markdownText) {
    return [];
  }

  const taskRegex = /^\s*-\s\[([ xX])\]\s+(.*)/gm;
  const tasks: Task[] = [];
  let match;

  while ((match = taskRegex.exec(markdownText)) !== null) {
    tasks.push({
      is_completed: match[1].toLowerCase() === 'x',
      text: match[2].trim(),
    });
  }

  return tasks;
};
