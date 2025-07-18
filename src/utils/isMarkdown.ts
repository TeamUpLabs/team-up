/**
 * Check if the given text contains Markdown formatting
 * @param text - The text to check
 * @returns boolean - True if the text contains Markdown formatting
 */
export function isMarkdown(text: string): boolean {
  if (typeof text !== 'string' || !text.trim()) {
    return false;
  }

  // Common Markdown patterns
  const markdownPatterns = [
    // Headers: #, ##, ###, etc.
    /^#{1,6}\s+\S+/m,
    // Lists: - item, * item, 1. item, etc.
    /^[\s]*[-*+]\s+\S+/m,
    /^[\s]*\d+\.\s+\S+/m,
    // Links: [text](url)
    /\[.+\]\(.+?\)/,
    // Images: ![alt](url)
    /!\[.*?\]\(.+?\)/,
    // Bold/Italic: **text**, __text__, *text*, _text_
    /(\*\*|__).*?\1|(\*|_).*?\2/,
    // Code blocks: ```code``` or `code`
    /```[\s\S]*?```|`[^`]+`/,
    // Blockquotes: > quote
    /^>\s+\S+/m,
    // Horizontal rule: ---, ***, or ___
    /^[-*_]{3,}\s*$/m,
    // Tables: | Header |
    /^\|.+\|\s*$\n\|[-|\s]+\|/m,
  ];

  // Check if any Markdown pattern matches
  return markdownPatterns.some(pattern => pattern.test(text));
}