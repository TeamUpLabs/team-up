import { Input } from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { TechStack } from "@/types/user/User";

interface SignupStep7Props {
  skills: TechStack[];
  setIsComposing: (isComposing: boolean) => void;
  onKeyDown: (
    type: "language" | "skill",
    e: React.KeyboardEvent<HTMLInputElement>
  ) => void;
  skillsInput: string;
  setSkillsInput: (input: string) => void;
  onRemoveSkill: (skillToRemove: string) => void;
  onChangeSkillLevel: (tech: string, level: number) => void;
}

export default function SignupStep7({
  skills,
  setIsComposing,
  onKeyDown,
  skillsInput,
  setSkillsInput,
  onRemoveSkill,
  onChangeSkillLevel,
}: SignupStep7Props) {
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
      <div className="flex flex-wrap gap-4">
        {skills.map((skill) => (
          <div
            key={skill.tech}
            className="relative flex flex-col gap-2 rounded-xl bg-component-secondary-background border border-component-secondary-border p-6 shadow-sm w-full"
          >
            <button
              type="button"
              className="absolute top-4 right-4 text-text-secondary hover:text-text-primary cursor-pointer"
              onClick={() => onRemoveSkill(skill.tech)}
              aria-label="Remove skill"
            >
              &times;
            </button>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-lg font-bold text-text-primary">
                {skill.tech}
              </span>
              <Badge
                content={
                  skill.level === 0
                    ? "초급"
                    : skill.level === 1
                    ? "중급"
                    : "고급"
                }
                color={skill.level === 0 ? "green" : skill.level === 1 ? "blue" : "red"}
              />
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-base font-semibold text-text-secondary">
                Skill Level
              </span>
              <div className="flex gap-2">
                {[0, 1, 2].map((level) => (
                  <Badge
                    key={level}
                    content={level === 0 ? "초급" : level === 1 ? "중급" : "고급"}
                    color={skill.level === level ? level === 0 ? "green" : level === 1 ? "blue" : "red" : "gray"}
                    onClick={() => onChangeSkillLevel(skill.tech, level)}
                    className="cursor-pointer !rounded-full"
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
