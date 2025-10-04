"use client";

import SearchBar from "@/components/mentoring/SearchBar";
import { useState } from "react";
import Select from "@/components/ui/Select";
import MentorCard from "@/components/mentoring/MentorCard";
import MentorList from "@/components/mentoring/MentorList";
import TabSlider from "@/components/ui/TabSlider";
import { GalleryHorizontal, List } from "lucide-react";
import { useMentoring } from "@/contexts/MentoringContext";

export default function MentoringPage() {
  const { mentors } = useMentoring();
  const [searchLookingforQuery, setSearchLookingforQuery] = useState('');
  const [searchAvailableforQuery, setSearchAvailableforQuery] = useState('');
  const [searchExperience, setSearchExperience] = useState<string>('');
  const [searchTopic, setSearchTopic] = useState<string | string[]>('');
  const [searchLocation, setSearchLocation] = useState<string | string[]>('');
  const [tab, setTab] = useState('card');

  const filteredMentors = mentors.filter((mentor) => {
    // If no search queries, show all mentors
    if (!searchLookingforQuery && !searchAvailableforQuery && !searchExperience && !searchTopic && !searchLocation) {
      return true;
    }

    // Search in topic, job, and bio for the "looking for" query
    const matchesLookingFor = !searchLookingforQuery || (
      mentor.topic.some(topic => topic.toLowerCase().includes(searchLookingforQuery.toLowerCase())) ||
      mentor.user.job.toLowerCase().includes(searchLookingforQuery.toLowerCase()) ||
      mentor.bio.toLowerCase().includes(searchLookingforQuery.toLowerCase())
    );

    // Search in availablefor for the "available for" query
    const matchesAvailableFor = !searchAvailableforQuery || (
      mentor.availablefor.some(af => af.toLowerCase().includes(searchAvailableforQuery.toLowerCase()))
    );

    // Enhanced experience filtering
    const matchesExperience = !searchExperience || (() => {
      if (!searchExperience) return true;
      
      const mentorExp = mentor.experience || 0;
      
      switch(searchExperience.toLowerCase()) {
        case 'junior':
          return mentorExp < 1; // Less than 1 year
        case '1-2':
          return mentorExp >= 1 && mentorExp <= 2;
        case '3-5':
          return mentorExp >= 3 && mentorExp <= 5;
        case '6-10':
          return mentorExp >= 6 && mentorExp <= 10;
        case 'senior':
          return mentorExp > 10 || String(mentor.experience || '').toLowerCase().includes('+');
        default:
          return true;
      }
    })();

    // Enhanced topic filtering
    const matchesTopic = !searchTopic || (() => {
      if (!searchTopic) return true;
      const searchTerm = searchTopic.toString().toLowerCase();
      
      // Check if any of the mentor's topics match the search term
      return mentor.topic.some(topic => {
        const topicLower = topic.toLowerCase();
        return topicLower.includes(searchTerm);
      });
    })();

    // Filter by location if specified
    const matchesLocation = !searchLocation || (
      (typeof searchLocation === 'string' && mentor.location.some(location => location.toLowerCase().includes(searchLocation.toLowerCase()))) ||
      (Array.isArray(searchLocation) && searchLocation.some(searchTerm => mentor.location.some(location => location.toLowerCase().includes(searchTerm.toLowerCase()))))
    );

    return matchesLookingFor && matchesAvailableFor && matchesExperience && matchesTopic && matchesLocation;
  });

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">Discover Professionals</h1>
        <p className="text-text-secondary">Find the right mentor for your career goals</p>
      </div>

      <div className="w-full flex flex-col gap-2">
        <SearchBar 
          searchLookingforQuery={searchLookingforQuery}
          setSearchLookingforQuery={setSearchLookingforQuery}
          searchAvailableforQuery={searchAvailableforQuery}
          setSearchAvailableforQuery={setSearchAvailableforQuery}
        />
        <div className="w-full flex gap-2">
          <Select
            options={[
              { name: 'experience', value: '', label: '경력 전체' },
              { name: 'experience', value: 'junior', label: '신입' },
              { name: 'experience', value: '1-2', label: '1-2년차' },
              { name: 'experience', value: '3-5', label: '3-5년차' },
              { name: 'experience', value: '6-10', label: '6-10년차' },
              { name: 'experience', value: 'senior', label: '10년차 이상' },
            ]}
            value={searchExperience}
            onChange={(value) => setSearchExperience(value as string)}
            className="!bg-transparent !rounded-full !px-2 !py-0.5 min-w-[120px]"
            placeholder="Experience"
            placeholderClassName="!font-medium"
          />

          <Select
            options={[
              { name: 'topic', value: '', label: '분야 전체' },
              { name: 'topic', value: 'UX Design', label: 'UX Design' },
              { name: 'topic', value: 'UI/UX Research', label: 'UI/UX Research' },
              { name: 'topic', value: 'Prototyping', label: 'Prototyping' },
              { name: 'topic', value: 'React', label: 'React' },
              { name: 'topic', value: 'Node.js', label: 'Node.js' },
              { name: 'topic', value: 'TypeScript', label: 'TypeScript' },
              { name: 'topic', value: 'Machine Learning', label: 'Machine Learning' },
              { name: 'topic', value: 'Python', label: 'Python' },
              { name: 'topic', value: 'Data Analysis', label: 'Data Analysis' },
              { name: 'topic', value: 'AWS', label: 'AWS' },
              { name: 'topic', value: 'Docker', label: 'Docker' },
              { name: 'topic', value: 'Kubernetes', label: 'Kubernetes' },
              { name: 'topic', value: 'Product Strategy', label: 'Product Strategy' },
              { name: 'topic', value: 'Agile', label: 'Agile' },
              { name: 'topic', value: 'User Research', label: 'User Research' },
              { name: 'topic', value: 'React Native', label: 'React Native' },
              { name: 'topic', value: 'iOS', label: 'iOS' },
              { name: 'topic', value: 'Android', label: 'Android' },
              { name: 'topic', value: 'Next.js', label: 'Next.js' },
              { name: 'topic', value: 'Solidity', label: 'Solidity' },
              { name: 'topic', value: 'Ethereum', label: 'Ethereum' },
              { name: 'topic', value: 'Smart Contracts', label: 'Smart Contracts' },
              { name: 'topic', value: 'Usability Testing', label: 'Usability Testing' },
              { name: 'topic', value: 'UX Strategy', label: 'UX Strategy' },
              { name: 'topic', value: 'Microservices', label: 'Microservices' },
              { name: 'topic', value: 'UI Design', label: 'UI Design' },
              { name: 'topic', value: 'Design Systems', label: 'Design Systems' },
              { name: 'topic', value: 'Figma', label: 'Figma' },
              { name: 'topic', value: 'Security', label: 'Security' },
              { name: 'topic', value: 'Penetration Testing', label: 'Penetration Testing' },
              { name: 'topic', value: 'Compliance', label: 'Compliance' },
            ]}
            value={searchTopic}
            onChange={(value) => setSearchTopic(value as string)}
            className="!bg-transparent !rounded-full !px-2 !py-0.5 min-w-[160px]"
            placeholder="Topics"
            placeholderClassName="!font-medium"
            autoWidth
          />

          <Select
            options={[
              { name: 'location', value: '', label: '위치 전체' },
              { name: 'location', value: '온라인', label: '온라인' },
              { name: 'location', value: '서울', label: '서울' },
              { name: 'location', value: '경기도', label: '경기도' },
              { name: 'location', value: '인천', label: '인천' },
              { name: 'location', value: '대전', label: '대전' },
              { name: 'location', value: '대구', label: '대구' },
              { name: 'location', value: '광주', label: '광주' },
              { name: 'location', value: '울산', label: '울산' },
              { name: 'location', value: '부산', label: '부산' },
              { name: 'location', value: '제주도', label: '제주도' },
            ]}
            value={searchLocation}
            onChange={(value) => setSearchLocation(value as string)}
            className="!bg-transparent !rounded-full !px-2 !py-0.5"
            placeholder="Location"
            placeholderClassName="!font-medium"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <h2 className="text-xl font-bold">{filteredMentors.length} {searchLookingforQuery || "Mentors"} available {searchAvailableforQuery && `for ${searchAvailableforQuery}`}</h2>
          <TabSlider
            tabs={{
              'card': {
                'label': <GalleryHorizontal className="w-4 h-4" />,
              },
              'list': {
                'label': <List className="w-4 h-4" />,
              },
            }}
            selectedTab={tab}
            onTabChange={setTab}
          />
        </div>
        {tab === "card" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMentors.map((mentor, idx) => {
              return <MentorCard key={idx} mentor={mentor} />
            })}
          </div>
        )}

        {tab === "list" && (
          <div className="divide-y divide-component-border">
            {filteredMentors.map((mentor, idx) => {
              return <MentorList key={idx} mentor={mentor} />
            })}
          </div>
        )}
      </div>
    </div>
  )
}