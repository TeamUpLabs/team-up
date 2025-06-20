import { useState } from "react";
import { PrData } from "@/types/PrData";
import PRCountCard from "@/components/project/github/PRCountCard";
import PRAverageResolutionTimeCard from "@/components/project/github/pr/PRAverageResolutionTimeCard";
import { Input } from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { Search } from "flowbite-react-icons/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import PRCard from "@/components/project/github/pr/PRCard";

interface PRTrackerProps {
  prData: PrData[];
}

export default function PRTracker({ prData }: PRTrackerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("all");

  const filteredPRs = prData.filter((pr) => {
    const matchesSearch = pr.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = selectedState === "all" || pr.state === selectedState;
    return matchesSearch && matchesState;
  });

  const onSelectState = (value: string | string[]) => {
    if (typeof value === "string") {
      setSelectedState(value);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        <PRCountCard prCount={prData.filter((pr) => pr.state === "open").length || 0} state="open" />
        <PRCountCard prCount={prData.filter((pr) => pr.state === "closed").length || 0} state="closed" />
        <PRAverageResolutionTimeCard prs={prData} />
      </div>
      <div className="flex items-center flex-col md:flex-row gap-2 justify-between">
        <Input
          placeholder="PR 검색..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full py-2 !rounded-md !bg-component-background"
          fullWidth
          startAdornment={<Search className="h-5 w-5 text-gray-400" />}
        />
        <div className="flex items-center gap-2 w-full md:w-1/4">
          <Select
            options={[
              { name: "state", value: "all", label: "모든 상태" },
              { name: "state", value: "open", label: "열림" },
              { name: "state", value: "closed", label: "닫힘" },
            ]}
            value={selectedState}
            onChange={(e) => onSelectState(e as string)}
            className="w-full p-2 !rounded-md !bg-component-background !border !border-component-border"
            dropDownClassName="!w-full !rounded-md"
          />
          <button
            className="flex items-center gap-2 rounded-md bg-point-color-indigo text-white px-4 py-2 active:scale-95 whitespace-nowrap cursor-pointer"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span className="font-semibold">새 PR</span>
          </button>
        </div>
      </div>
      {[...(filteredPRs || [])]
        .sort((a, b) => {
          if (a.state === "open" && b.state !== "open") return -1;
          if (a.state !== "open" && b.state === "open") return 1;
          return 0;
        })
        .map((pr, index) => (
          <PRCard prData={pr} key={index} />
        ))}
    </div>
  );
}