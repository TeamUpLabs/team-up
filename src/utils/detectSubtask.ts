export interface Subtask {
  text: string;
  checked: boolean;
}

export const detectSubtasks = (markdownText: string): Subtask[] => {
  if (!markdownText) {
    return [];
  }

  const subtaskRegex = /^\s*-\s\[([ xX])\]\s+(.*)/gm;
  const subtasks: Subtask[] = [];
  let match;

  while ((match = subtaskRegex.exec(markdownText)) !== null) {
    subtasks.push({
      checked: match[1].toLowerCase() === 'x',
      text: match[2].trim(),
    });
  }

  return subtasks;
};
