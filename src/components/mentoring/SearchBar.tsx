import { Search } from "lucide-react";

interface SearchBarProps {
  searchLookingforQuery: string;
  setSearchLookingforQuery: (query: string) => void;
  searchAvailableforQuery: string;
  setSearchAvailableforQuery: (query: string) => void;
}

export default function SearchBar({
  searchLookingforQuery,
  setSearchLookingforQuery,
  searchAvailableforQuery,
  setSearchAvailableforQuery,
}: SearchBarProps) {
  return (
    <div className="bg-transparent border border-component-border rounded-full p-2 flex items-center justify-between gap-2 hover:border-input-border-hover">
      <div className="flex items-center w-full">
        <div className="w-full px-2">
          <label htmlFor="job" className="relative">
            <input 
              type="text"
              id="job"
              className="w-full peer rounded px-2 py-1 focus:outline-none text-sm"
              value={searchLookingforQuery}
              onChange={(e) => setSearchLookingforQuery(e.target.value)}
            />

            <span className={`absolute bg-component-background px-1 inset-y-0 start-2 text-text-secondary transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-7 text-sm font-medium cursor-text ${searchLookingforQuery == '' ? "translate-y-0" : "-translate-y-7"}`}>Looking for</span>
          </label>
        </div>

        <div className="h-6 w-px bg-component-border mx-2"></div>

        <div className="w-full px-2">
          <label htmlFor="location" className="relative">
            <input 
              type="text" 
              id="location" 
              className="w-full peer rounded px-2 py-1 focus:outline-none text-sm" 
              value={searchAvailableforQuery}
              onChange={(e) => setSearchAvailableforQuery(e.target.value)}
            />

            <span className={`absolute bg-component-background px-1 inset-y-0 start-3 text-text-secondary transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-7 text-sm font-medium cursor-text ${searchAvailableforQuery == '' ? "translate-y-0" : "-translate-y-7"}`}>Available for</span>
          </label>
        </div>
      </div>

      <button className="p-3 rounded-full bg-point-color-indigo active:scale-95 cursor-pointer">
        <Search className="text-white size-4" />
      </button>
    </div>
  );
}