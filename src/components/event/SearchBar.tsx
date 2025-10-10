import { Search } from "lucide-react";

interface SearchBarProps {
  searchEventQuery: string;
  setSearchEventQuery: (query: string) => void;
}

export default function SearchBar({
  searchEventQuery,
  setSearchEventQuery,
}: SearchBarProps) {
  return (
    <div className="bg-transparent border border-component-border rounded-full p-2 flex items-center justify-between gap-2 hover:border-input-border-hover">
      <div className="flex items-center w-full">
        <div className="w-full px-2">
          <label htmlFor="event" className="relative">
            <input 
              type="text"
              id="event"
              className="w-full peer rounded px-2 py-1 focus:outline-none text-sm"
              value={searchEventQuery}
              onChange={(e) => setSearchEventQuery(e.target.value)}
            />

            <span className={`absolute bg-component-background px-1 inset-y-0 start-2 text-text-secondary transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-7 text-sm font-medium cursor-text ${searchEventQuery == '' ? "translate-y-0" : "-translate-y-7"}`}>Search Events</span>
          </label>
        </div>
      </div>

      <button className="p-3 rounded-full bg-point-color-indigo active:scale-95 cursor-pointer">
        <Search className="text-white size-4" />
      </button>
    </div>
  )
}