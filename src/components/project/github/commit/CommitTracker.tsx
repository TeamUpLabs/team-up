import { useState } from "react";
import { CommitData } from "@/types/CommitData";
import CommitCountCard from "@/components/project/github/CommitCountCard";
import ContributorCountCard from "@/components/project/github/commit/ContributorCountCard";
import LineCountCard from "@/components/project/github/commit/LineCountCard";
import ChangedFileCountCard from "@/components/project/github/commit/ChangedFileCountCard";
import CommitCard from "@/components/project/github/commit/CommitCard";
import { Input } from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { Search } from "flowbite-react-icons/outline";

interface CommitTrackerProps {
  commits: CommitData[];
}

export default function CommitTracker({ commits }: CommitTrackerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("all");

  const filteredCommits = commits.filter((commit) => {
    const matchesSearch = commit.commit?.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchAuthor = selectedAuthor === "all" || commit.author?.login === selectedAuthor;
    return matchesSearch && matchAuthor;
  });
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2">
        <CommitCountCard commitData={commits} />
        <LineCountCard
          lineCount={commits.reduce((total, commit) => total + (commit.commitDetail?.stats?.additions || 0), 0)}
          state="additions"
        />
        <LineCountCard
          lineCount={commits.reduce((total, commit) => total + (commit.commitDetail?.stats?.deletions || 0), 0)}
          state="deletions"
        />
        <ChangedFileCountCard changedFileCount={commits.reduce((total, commit) => total + (commit.commitDetail?.files.length || 0), 0)} />
        <ContributorCountCard contributorCount={new Set(commits.map(commit => commit.author?.login).filter(Boolean)).size} />
      </div>
      <div className="flex items-center flex-col md:flex-row gap-2 justify-between">
        <Input
          placeholder="커밋 검색..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full py-2 !rounded-md !bg-component-background"
          fullWidth
          startAdornment={<Search className="h-5 w-5 text-gray-400" />}
        />
        <div className="flex items-center gap-2 w-full md:w-1/4">
          <Select
            options={[
              { name: "author", value: "all", label: "전체 작성자" },
              ...new Set(commits.map(commit => commit.author?.login).filter(Boolean)).values().map(login => ({ name: "author", value: login, label: login })),
            ]}
            value={selectedAuthor}
            onChange={(e) => setSelectedAuthor(e as string)}
            className="w-full p-2 !rounded-md !bg-component-background !border !border-component-border"
            dropDownClassName="!w-full !rounded-md"
          />
        </div>
      </div>
      {[...(filteredCommits || [])]
        .sort((a, b) => {
          if (a.commit?.author?.date > b.commit?.author?.date) return -1;
          if (a.commit?.author?.date < b.commit?.author?.date) return 1;
          return 0;
        })
        .map((commit, index) => (
          <CommitCard commitData={commit} key={index} />
        ))}
    </div>
  );
}