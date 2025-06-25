// components/signup/SignupStep4.tsx
import { useRef, useState } from "react";
import Badge from "@/components/ui/Badge";

interface SignupStep4Props {
  role: string;
  contactNumber: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  selectedTimeZone: string;
  workingStartHour: string;
  workingEndHour: string;
  languageInput: string;
  languages: string[];
  specialty: string;
  specialties: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBirthDateChange: (type: "year" | "month" | "day", value: string) => void;
  onWorkingHourChange: (type: "timezone" | "start" | "end", value: string) => void;
  onLanguageInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSpecialtyInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (type: "language" | "specialty", e: React.KeyboardEvent<HTMLInputElement>) => void;
  onRemoveLanguage: (languageToRemove: string) => void;
  onRemoveSpecialty: (specialtyToRemove: string) => void;
  onAddSuggestion: (type: "language" | "specialty", suggestion: string) => void;
  setIsComposing: (isComposing: boolean) => void;
}

export default function SignupStep4({
  role,
  contactNumber,
  birthYear,
  birthMonth,
  birthDay,
  selectedTimeZone,
  workingStartHour,
  workingEndHour,
  languageInput,
  languages,
  specialty,
  specialties,
  onChange,
  onBirthDateChange,
  onWorkingHourChange,
  onLanguageInput,
  onSpecialtyInput,
  onKeyDown,
  onRemoveLanguage,
  onRemoveSpecialty,
  onAddSuggestion,
  setIsComposing
}: SignupStep4Props) {
  const languageInputRef = useRef<HTMLInputElement>(null);
  const specialtyInputRef = useRef<HTMLInputElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showSpecialtySuggestions, setShowSpecialtySuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [filteredSpecialtySuggestions, setFilteredSpecialtySuggestions] = useState<string[]>([]);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const specialtySuggestionsRef = useRef<HTMLDivElement>(null);

  const BIRTHDAY_YEAR_LIST = Array.from(
    { length: new Date().getFullYear() - 1900 + 1 },
    (_, i) => `${i + 1900}년`,
  );
  const BIRTHDAY_MONTH_LIST = Array.from({ length: 12 }, (_, i) => `${i + 1}월`);
  const BIRTHDAY_DAY_LIST = Array.from({ length: 31 }, (_, i) => `${i + 1}일`);

  const TIME_LIST = Array.from({ length: 24 }, (_, i) => {
    const hour = (i + 1).toString().padStart(2, "0");
    return `${hour}:00`;
  });

  const toNumber = (time: string) => parseInt(time.split(":")[0], 10);

  const languageSuggestions = ["한국어", "영어", "일본어", "중국어", "불어", "프랑스어", "스페인어", "독일어", "베트남어", "태국어"];

  // 전문분야 자동완성 데이터
  const specialtySuggestions = {
    개발자: ["React", "Vue", "Angular", "Node.js", "Python", "Java", "Spring", "Django", "Flask", "TypeScript", "JavaScript", "Next.js", "Express", "MongoDB", "MySQL", "PostgreSQL", "AWS", "Docker", "Kubernetes"],
    디자이너: ["UI/UX", "Figma", "Adobe XD", "Sketch", "Photoshop", "Illustrator", "InDesign", "프로토타이핑", "와이어프레임", "인터랙션 디자인", "모션 디자인", "브랜딩", "그래픽 디자인"],
    기획자: ["서비스 기획", "프로젝트 관리", "스크럼", "애자일", "프로덕트 매니지먼트", "비즈니스 분석", "마케팅 기획", "데이터 분석", "사용자 리서치", "프로세스 개선"]
  };

  const handleLanguageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onLanguageInput(e);

    if (value) {
      const filtered = languageSuggestions.filter(
        suggestion => suggestion.toLowerCase().includes(value.toLowerCase()) &&
          !languages.includes(suggestion)
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSpecialtyInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onSpecialtyInput(e);

    if (value) {
      const filtered = specialtySuggestions[role as keyof typeof specialtySuggestions].filter(
        suggestion => suggestion.toLowerCase().includes(value.toLowerCase()) &&
          !specialties.includes(suggestion)
      );
      setFilteredSpecialtySuggestions(filtered);
      setShowSpecialtySuggestions(filtered.length > 0);
    } else {
      setShowSpecialtySuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onAddSuggestion("language", suggestion);

    if (languageInputRef.current) {
      languageInputRef.current.value = '';
      languageInputRef.current.blur();
    }
    setShowSuggestions(false);
  };

  const handleSpecialtySuggestionClick = (suggestion: string) => {
    onAddSuggestion("specialty", suggestion);

    if (specialtyInputRef.current) {
      specialtyInputRef.current.value = '';
      specialtyInputRef.current.blur();
    }
    setShowSpecialtySuggestions(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="contactNumber" className="block text-sm font-medium text-text-secondary mb-1">
          연락처
          <span className="text-point-color-purple ml-1">*</span>
        </label>
        <input
          type="tel"
          id="contactNumber"
          name="contactNumber"
          value={contactNumber}
          onChange={onChange}
          pattern="[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}"
          className="w-full px-4 py-3 rounded-md bg-input-background border border-input-border hover:border-input-border-hover focus:outline-none focus:ring-1 focus:ring-point-color-indigo"
          placeholder="전화번호를 입력하세요"
          required
        />
      </div>

      <div>
        <label htmlFor="birthDate" className="block text-sm font-medium text-text-secondary mb-1">
          생년월일
          <span className="text-point-color-purple ml-1">*</span>
        </label>
        <div className="w-full flex justify-between gap-3">
          <select
            className="w-full px-4 py-3 rounded-md bg-input-background border border-input-border hover:border-input-border-hover focus:outline-none focus:ring-1 focus:ring-point-color-indigo"
            value={birthYear}
            onChange={(e) => onBirthDateChange("year", e.target.value)}
            required
          >
            <option value="">년</option>
            {BIRTHDAY_YEAR_LIST.map((year, index) => (
              <option key={index} value={year}>{year}</option>
            ))}
          </select>

          <select
            className="w-full px-4 py-3 rounded-md bg-input-background border border-input-border hover:border-input-border-hover focus:outline-none focus:ring-1 focus:ring-point-color-indigo"
            value={birthMonth}
            onChange={(e) => onBirthDateChange("month", e.target.value)}
            required
          >
            <option value="">월</option>
            {BIRTHDAY_MONTH_LIST.map((month, index) => (
              <option key={index} value={month}>{month}</option>
            ))}
          </select>

          <select
            className="w-full px-4 py-3 rounded-md bg-input-background border border-input-border hover:border-input-border-hover focus:outline-none focus:ring-1 focus:ring-point-color-indigo"
            value={birthDay}
            onChange={(e) => onBirthDateChange("day", e.target.value)}
            required
          >
            <option value="">일</option>
            {BIRTHDAY_DAY_LIST.map((day, index) => (
              <option key={index} value={day}>{day}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="workingHours" className="block text-sm font-medium text-text-secondary mb-1">
          활동시간
          <span className="text-point-color-purple ml-1">*</span>
        </label>
        <div className="w-full flex justify-between gap-3">
          <select
            name="timezone"
            className="w-full px-4 py-3 rounded-md bg-input-background border border-input-border hover:border-input-border-hover focus:outline-none focus:ring-1 focus:ring-point-color-indigo"
            value={selectedTimeZone}
            onChange={(e) => onWorkingHourChange("timezone", e.target.value)}
            required
          >
            <option value="">지역</option>
            <option value="Asia/Seoul">한국 표준시 (KST)</option>
            <option value="UTC">세계 표준시 (UTC)</option>
            <option value="America/New_York">동부 표준시 (EST)</option>
            <option value="America/Los_Angeles">태평양 표준시 (PST)</option>
          </select>

          <select
            name="start"
            className="w-full px-4 py-3 rounded-md bg-input-background border border-input-border hover:border-input-border-hover focus:outline-none focus:ring-1 focus:ring-point-color-indigo"
            value={workingStartHour}
            onChange={(e) => onWorkingHourChange("start", e.target.value)}
            required
          >
            <option value="">시작 시간</option>
            {TIME_LIST.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>

          <select
            name="end"
            className="w-full px-4 py-3 rounded-md bg-input-background border border-input-border hover:border-input-border-hover focus:outline-none focus:ring-1 focus:ring-point-color-indigo"
            value={workingEndHour}
            onChange={(e) => onWorkingHourChange("end", e.target.value)}
            required
          >
            <option value="">종료 시간</option>
            {TIME_LIST.filter((time) => toNumber(time) > toNumber(workingStartHour)).map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="language" className="block text-sm font-medium text-text-secondary mb-1">선호 언어</label>
        <div className="relative">
          <input
            ref={languageInputRef}
            type="text"
            id="language"
            value={languageInput}
            onChange={handleLanguageInput}
            onKeyDown={(e) => onKeyDown("language", e)}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            className="w-full px-4 py-3 rounded-md bg-input-background border border-input-border hover:border-input-border-hover focus:outline-none focus:ring-1 focus:ring-point-color-indigo"
            placeholder="선호하는 언어를 입력하세요 예) 한국어, 영어"
          />
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute z-10 w-full mt-1 bg-input-background border border-input-border rounded-md shadow-lg max-h-60 overflow-auto"
            >
              {filteredSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-input-background cursor-pointer text-text-secondary"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {languages.map((language, index) => (
            <Badge key={index} color="purple" content={language} isEditable={true} onRemove={() => onRemoveLanguage(language)} />
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="specialty" className="block text-sm font-medium text-text-secondary mb-1">전문 분야</label>
        <div className="relative">
          <input
            ref={specialtyInputRef}
            type="text"
            id="specialty"
            name="specialty"
            value={specialty}
            onChange={handleSpecialtyInput}
            onKeyDown={(e) => onKeyDown("specialty", e)}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            className="w-full px-4 py-3 rounded-md bg-input-background border border-input-border hover:border-input-border-hover focus:outline-none focus:ring-1 focus:ring-point-color-indigo"
            placeholder="전문 분야를 입력하세요 예) 웹 개발, 앱 개발"
          />
          {showSpecialtySuggestions && filteredSpecialtySuggestions.length > 0 && (
            <div
              ref={specialtySuggestionsRef}
              className="absolute z-10 w-full mt-1 bg-input-background border border-input-border rounded-md shadow-lg max-h-60 overflow-auto"
            >
              {filteredSpecialtySuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-input-background cursor-pointer text-text-secondary"
                  onClick={() => handleSpecialtySuggestionClick(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {specialties.map((specialty, index) => (
            <Badge key={index} color="purple" content={specialty} isEditable={true} onRemove={() => onRemoveSpecialty(specialty)} />
          ))}
        </div>
      </div>
    </div>
  );
}