import { Input } from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { useTheme } from "@/contexts/ThemeContext";

interface SignupStep7Props {
  skills: string[];
  setIsComposing: (isComposing: boolean) => void;
  onKeyDown: (
    type: "language" | "skill",
    e: React.KeyboardEvent<HTMLInputElement>
  ) => void;
  skillsInput: string;
  setSkillsInput: (input: string) => void;
  onRemoveSkill: (skillToRemove: string) => void;
}

export default function SignupStep7({
  skills,
  setIsComposing,
  onKeyDown,
  skillsInput,
  setSkillsInput,
  onRemoveSkill,
}: SignupStep7Props) {
  const { isDark } = useTheme();

  return (
    <div className="space-y-6">
      <Input
        id="skills"
        placeholder="기술 스택을 입력해주세요"
        value={skillsInput}
        onChange={(e) => setSkillsInput(e.target.value)}
        onKeyDown={(e) => onKeyDown("skill", e)}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        label="기술 스택 추가"
      />
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <Badge
            key={skill}
            content={skill}
            color="blue"
            isDark={isDark}
            onRemove={() => onRemoveSkill(skill)}
            isEditable
          />
        ))}
      </div>
    </div>
  );
}
