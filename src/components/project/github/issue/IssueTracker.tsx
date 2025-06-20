import IssueCard from "@/components/project/github/issue/IssueCard";
import Select from "@/components/ui/Select";
import { Search } from "flowbite-react-icons/outline";
import { useState } from "react";
import { IssueData } from "@/types/IssueData";

interface IssueTrackerProps {
  issueData: {
    items: IssueData[];
  };
}

export default function IssueTracker({ issueData }: IssueTrackerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("all");

  const filteredIssues = issueData.items.filter((issue) => {
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = selectedState === "all" || issue.state === selectedState;
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
      <div className="flex items-center flex-col md:flex-row gap-2">
        <div className="relative w-full bg-component-background rounded-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="이슈 검색..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full p-2 pl-10 border border-component-border rounded-md focus:outline-none bg-transparent"
          />
        </div>
        <Select
          options={[
            { name: "state", value: "all", label: "모든 상태" },
            { name: "state", value: "open", label: "열림" },
            { name: "state", value: "closed", label: "닫힘" },
          ]}
          value={selectedState}
          onChange={(e) => onSelectState(e as string)}
          className="w-full md:w-1/4 p-2 !rounded-md !bg-component-background !border !border-component-border"
          dropDownClassName="!w-full !rounded-md"
        />
      </div>
      {[...(filteredIssues || [])]
        .sort((a, b) => {
          if (a.state === "open" && b.state !== "open") return -1;
          if (a.state !== "open" && b.state === "open") return 1;
          return 0;
        })
        .map((issue, index) => (
          <IssueCard issueData={issue} key={index} />
        ))}
    </div>
  );
}