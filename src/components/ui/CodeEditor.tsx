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
import { useCallback } from "react";
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