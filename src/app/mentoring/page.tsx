"use client";

import SearchBar from "@/components/mentoring/SearchBar";
import { useState } from "react";
import Select from "@/components/ui/Select";

export default function MentoringPage() {
  const [searchLookingforQuery, setSearchLookingforQuery] = useState('');
  const [searchAvailableforQuery, setSearchAvailableforQuery] = useState('');
  const [searchExperience, setSearchExperience] = useState<string | string[]>('');
  const [searchTopic, setSearchTopic] = useState<string | string[]>('');
  const [searchLocation, setSearchLocation] = useState<string | string[]>('');
  

  return (
    <div className="w-full flex flex-col gap-4">
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
              { name: 'experience', value: 'junior', label: '신입' },
              { name: 'experience', value: '1-2', label: '1-2년차' },
              { name: 'experience', value: '3-5', label: '3-5년차' },
              { name: 'experience', value: '6-10', label: '6-10년차' },
              { name: 'experience', value: 'senior', label: '고수' },
            ]}
            value={searchExperience}
            onChange={(value) => setSearchExperience(value)}
            className="!bg-transparent !rounded-full !px-2 !py-0.5"
            placeholder="Experience"
            placeholderClassName="!font-medium"
          />

          <Select
            options={[
              { name: 'topic', value: 'web-developer', label: '웹 개발자' },
              { name: 'topic', value: 'frontend-developer', label: '프론트엔드 개발자' },
              { name: 'topic', value: 'backend-developer', label: '백엔드 개발자' },
              { name: 'topic', value: 'fullstack-developer', label: '풀스택 개발자' },
              { name: 'topic', value: 'data-scientist', label: '데이터 과학자' },
              { name: 'topic', value: 'data-engineer', label: '데이터 엔지니어' },
              { name: 'topic', value: 'data-analyst', label: '데이터 분석가' },
              { name: 'topic', value: 'ux-designer', label: 'UX 디자이너' },
              { name: 'topic', value: 'ui-designer', label: 'UI 디자이너' },
              { name: 'topic', value: 'product-manager', label: '프로젝트 매니저' },
              
            ]}
            value={searchTopic}
            onChange={(value) => setSearchTopic(value)}
            className="!bg-transparent !rounded-full !px-2 !py-0.5"
            placeholder="Topics"
            placeholderClassName="!font-medium"
            autoWidth
          />

          <Select
            options={[
              { name: 'location', value: 'online', label: '온라인' },
              { name: 'location', value: 'seoul', label: '서울' },
              { name: 'location', value: 'gyeonggi', label: '경기도' },
              { name: 'location', value: 'incheon', label: '인천' },
              { name: 'location', value: 'daejeon', label: '대전' },
              { name: 'location', value: 'daegwallyeong', label: '대구' },
              { name: 'location', value: 'gwangju', label: '광주' },
              { name: 'location', value: 'ulsan', label: '울산' },
              { name: 'location', value: 'busan', label: '부산' },
              { name: 'location', value: 'jeju', label: '제주도' },
            ]}
            value={searchLocation}
            onChange={(value) => setSearchLocation(value)}
            className="!bg-transparent !rounded-full !px-2 !py-0.5"
            placeholder="Location"
            placeholderClassName="!font-medium"
          />
        </div>
      </div>
    </div>
  )
}