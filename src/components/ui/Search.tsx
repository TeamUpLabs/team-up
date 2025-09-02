import { Input } from "@/components/ui/Input";
import { Search as SearchIcon } from "lucide-react";

interface SearchProps {
  placeholder?: string;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export default function Search({ 
  placeholder = "Search...", 
  searchQuery = "", 
  setSearchQuery = () => {}, 
  inputRef,
}: SearchProps) {
  return (
    <Input
      ref={inputRef}
      placeholder={placeholder}
      value={searchQuery}
      onChange={(e) => {
        const value = e.target.value;
        setSearchQuery(value);

        const searchEvent = new CustomEvent(
          "headerSearch",
          {
            detail: value,
            bubbles: true,
            cancelable: true,
          }
        );
        window.dispatchEvent(searchEvent);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          const searchEvent = new CustomEvent(
            "headerSearch",
            {
              detail: searchQuery,
              bubbles: true,
              cancelable: true,
            }
          );
          window.dispatchEvent(searchEvent);
        }
      }}
      startAdornment={
        <SearchIcon className="w-5 h-5 text-text-secondary flex-shrink-0" />
      }
      endAdornment={
        inputRef && (
          <span className="text-text-secondary p-1 border border-component-border rounded w-6 h-6 flex items-center justify-center flex-shrink-0">/</span>
        )
      }
      className="!py-1.5"
    />
  );
}