import Badge from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import DatePicker from "@/components/ui/DatePicker";
import { useTheme } from "@/contexts/ThemeContext";

interface SignupStep4Props {
  contactNumber: string;
  birthDate: string;
  languageInput: string;
  languages: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBirthDateChange: (date: Date | undefined) => void;
  handleLanguageInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (
    type: "language",
    e: React.KeyboardEvent<HTMLInputElement>
  ) => void;
  onRemoveLanguage: (languageToRemove: string) => void;
  setIsComposing: (isComposing: boolean) => void;
}

export default function SignupStep4({
  contactNumber,
  birthDate,
  languageInput,
  languages,
  onChange,
  onBirthDateChange,
  handleLanguageInput,
  onKeyDown,
  onRemoveLanguage,
  setIsComposing,
}: SignupStep4Props) {
  const { isDark } = useTheme();
  // Helper to parse YYYY-MM-DD string to Date object (local timezone)
  const parseStringToDate = (dateString: string): Date | undefined => {
    if (!dateString) return undefined;
    const parts = dateString.split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed for Date constructor
      const day = parseInt(parts[2], 10);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        return new Date(year, month, day); // Interprets as local date
      }
    }
    return undefined;
  };

  return (
    <div className="space-y-6">
      <Input
        type="tel"
        id="contactNumber"
        name="contactNumber"
        value={contactNumber}
        onChange={onChange}
        pattern="[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}"
        placeholder="전화번호를 입력하세요"
        label="연락처"
        isRequired
      />

      <DatePicker
        value={birthDate ? parseStringToDate(birthDate) : undefined}
        onChange={onBirthDateChange}
        label="생년월일"
        isRequired
      />

      <Input
        type="text"
        id="language"
        name="language"
        value={languageInput}
        onChange={handleLanguageInput}
        onKeyDown={(e) => onKeyDown("language", e)}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        label="선호 언어"
        placeholder="선호하는 언어를 입력하세요 예) 한국어, 영어"
      />
      <div className="mt-2 flex flex-wrap gap-2">
        {languages.map((language, index) => (
          <Badge
            key={index}
            color="purple"
            content={language}
            isEditable={true}
            onRemove={() => onRemoveLanguage(language)}
            isDark={isDark}
          />
        ))}
      </div>
    </div>
  );
}
