import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";

// Core languages - these are required for other languages to work
import "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-javascript";

// Additional languages
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-go";
import "prismjs/components/prism-php";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-swift";
import "prismjs/components/prism-kotlin";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-markdown";
import { useCallback, useEffect } from "react";
import type React from "react";
import Select from "@/components/ui/Select";

interface CodeEditorProps {
  value: string;
  onValueChange: (value: string) => void;
  languageValue: string;
  onLanguageChange: (value: string) => void;
}

export default function CodeEditor({ value, onValueChange, languageValue, onLanguageChange }: CodeEditorProps) {
  const languageOptions = [
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "c", label: "C" },
    { value: "cpp", label: "C++" },
    { value: "csharp", label: "C#" },
    { value: "go", label: "Go" },
    { value: "php", label: "PHP" },
    { value: "ruby", label: "Ruby" },
    { value: "swift", label: "Swift" },
    { value: "kotlin", label: "Kotlin" },
    { value: "rust", label: "Rust" },
    { value: "css", label: "CSS" },
    { value: "markup", label: "HTML" },
    { value: "sql", label: "SQL" },
    { value: "bash", label: "Bash/Shell" },
    { value: "json", label: "JSON" },
    { value: "yaml", label: "YAML" },
    { value: "markdown", label: "Markdown" },
  ];

  const getLanguage = useCallback((language: string) => {
    // Use Prism.languages instead of the destructured 'languages' object
    const lang = Prism.languages[language] || Prism.languages.javascript;
    return lang;
  }, []);

  const hightlightWithLineNumbers = (input: string, language: string) => {
    try {
      // Use Prism.highlight directly
      const highlighted = Prism.highlight(
        input,
        getLanguage(language),
        language
      );
      
      return highlighted
        .split("\n")
        .map((line, i) => `<span class='editorLineNumber'>${i + 1}</span>${line}`)
        .join("\n");
    } catch (error) {
      console.error(`Error highlighting code with language ${language}:`, error);
      return input
        .split("\n")
        .map((line, i) => `<span class='editorLineNumber'>${i + 1}</span>${line}`)
        .join("\n");
    }
  };

  // Insert text at the current cursor position in the textarea
  const insertAtCursor = (
    text: string,
    insertText: string,
    selectionStart: number,
    selectionEnd: number
  ) => {
    return text.slice(0, selectionStart) + insertText + text.slice(selectionEnd);
  };

  const getCurrentLineText = (text: string, cursorIndex: number) => {
    const lineStart = text.lastIndexOf("\n", cursorIndex - 1) + 1; // -1 => returns -1, so +1 -> 0
    const lineEnd = text.indexOf("\n", cursorIndex);
    const endIndex = lineEnd === -1 ? text.length : lineEnd;
    return text.slice(lineStart, endIndex);
  };

  const getLineIndentation = (lineText: string) => {
    const match = lineText.match(/^[\t ]+/);
    return match ? match[0] : "";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    const ta = document.getElementById("codeArea") as HTMLTextAreaElement | null;
    if (!ta) return;
    const { selectionStart, selectionEnd } = ta;

    // Handle Tab key to insert a real tab character
    if (e.key === "Tab") {
      e.preventDefault();
      const newValue = insertAtCursor(value, "\t", selectionStart, selectionEnd);
      onValueChange(newValue);
      // restore caret after state update
      requestAnimationFrame(() => {
        const caret = selectionStart + 1;
        ta.setSelectionRange(caret, caret);
      });
      return;
    }

    // Handle Enter key to auto-indent next line
    if (e.key === "Enter") {
      e.preventDefault();

      const lineText = getCurrentLineText(value, selectionStart);
      const indentation = getLineIndentation(lineText);

      const prevChar = value[selectionStart - 1];
      const needsExtraIndent = prevChar === "{";
      const extraIndent = needsExtraIndent ? "\t" : "";

      const insertText = "\n" + indentation + extraIndent;
      const newValue = insertAtCursor(value, insertText, selectionStart, selectionEnd);
      onValueChange(newValue);

      // place caret at the end of inserted indentation
      requestAnimationFrame(() => {
        const caret = selectionStart + insertText.length;
        ta.setSelectionRange(caret, caret);
      });
      return;
    }
  };

  // Convert consistent leading spaces to tabs for pasted content
  const convertLeadingSpacesToTabs = (text: string) => {
    const lines = text.split("\n");
    const spaceCounts: number[] = [];

    for (const line of lines) {
      if (line.startsWith("\t")) {
        // Already tabs present; skip conversion
        return text;
      }
      const m = line.match(/^( +)/);
      if (m) spaceCounts.push(m[1].length);
    }

    if (spaceCounts.length === 0) return text;

    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const indentUnit = spaceCounts.reduce((acc, n) => gcd(acc, n), spaceCounts[0]);
    if (indentUnit !== 2 && indentUnit !== 4) return text;

    const converted = lines
      .map((line) => {
        const m = line.match(/^( +)/);
        if (!m) return line;
        const count = m[1].length;
        const tabs = "\t".repeat(Math.floor(count / indentUnit));
        const remainder = " ".repeat(count % indentUnit);
        return tabs + remainder + line.slice(count);
      })
      .join("\n");

    return converted;
  };

  useEffect(() => {
    const ta = document.getElementById("codeArea") as HTMLTextAreaElement | null;
    if (!ta) return;

    const onPaste = (e: ClipboardEvent) => {
      const pasted = e.clipboardData?.getData("text");
      if (!pasted) return;
      e.preventDefault();

      const normalized = pasted.replace(/\r\n?|\u2028|\u2029/g, "\n");
      const maybeTabified = convertLeadingSpacesToTabs(normalized);

      const { selectionStart, selectionEnd } = ta;
      const newValue = insertAtCursor(value, maybeTabified, selectionStart, selectionEnd);
      onValueChange(newValue);

      requestAnimationFrame(() => {
        const caret = selectionStart + maybeTabified.length;
        ta.setSelectionRange(caret, caret);
      });
    };

    ta.addEventListener("paste", onPaste);
    return () => ta.removeEventListener("paste", onPaste);
  }, [value, onValueChange]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative group mb-1">
        <label
          htmlFor="code"
          className="block text-sm font-medium leading-6 text-text-secondary"
        >
          코드
        </label>

        <Select
          options={languageOptions.map(lang => ({
            name: "code-language",
            value: lang.value,
            label: lang.label
          }))}
          onChange={(e) => onLanguageChange(e as string)}
          value={languageValue}
          autoWidth
        />
      </div>

      <div className="w-full min-h-[300px] max-h-[300px] overflow-auto border border-component-border bg-input-background rounded-md">
        <Editor
          value={value}
          onValueChange={(code) => onValueChange(code)}
          highlight={code => hightlightWithLineNumbers(code, languageValue)}
          padding={10}
          onKeyDown={handleKeyDown}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 18,
            outline: 0,
          }}
          textareaClassName="focus:outline-none"
          textareaId="codeArea"
        />
      </div>
    </div>
  );
}