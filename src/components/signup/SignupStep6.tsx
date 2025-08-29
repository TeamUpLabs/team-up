import Badge from "@/components/ui/Badge";
import {
  Zap,
  Palette,
  Briefcase,
  Heart,
  Gamepad2,
  BookOpen,
} from "lucide-react";
import { Interest } from "@/types/User";

interface SignupStep6Props {
  interests: Interest[];
  setInterests: (interests: Interest[]) => void;
  addInterest: (category: string, interest: string) => void;
  removeInterest: (category: string, interest: string) => void;
}

const interestCategories = [
  {
    category: "Technology",
    icon: Zap,
    color: "bg-blue-100 text-blue-800",
    interests: [
      "AI/ML",
      "Blockchain",
      "IoT",
      "Cloud Computing",
      "Cybersecurity",
      "DevOps",
      "AR/VR",
      "Quantum Computing",
    ],
  },
  {
    category: "Design",
    icon: Palette,
    color: "bg-purple-100 text-purple-800",
    interests: [
      "UI/UX Design",
      "Graphic Design",
      "3D Modeling",
      "Animation",
      "Typography",
      "Branding",
      "Illustration",
    ],
  },
  {
    category: "Business",
    icon: Briefcase,
    color: "bg-green-100 text-green-800",
    interests: [
      "Entrepreneurship",
      "Marketing",
      "Finance",
      "Strategy",
      "Operations",
      "Sales",
      "Consulting",
    ],
  },
  {
    category: "Creative",
    icon: Heart,
    color: "bg-pink-100 text-pink-800",
    interests: [
      "Photography",
      "Video Production",
      "Music",
      "Writing",
      "Art",
      "Content Creation",
      "Storytelling",
    ],
  },
  {
    category: "Gaming",
    icon: Gamepad2,
    color: "bg-orange-100 text-orange-800",
    interests: [
      "Game Development",
      "Game Design",
      "Esports",
      "Mobile Gaming",
      "VR Gaming",
      "Indie Games",
    ],
  },
  {
    category: "Education",
    icon: BookOpen,
    color: "bg-indigo-100 text-indigo-800",
    interests: [
      "Online Learning",
      "EdTech",
      "Training",
      "Mentoring",
      "Course Creation",
      "Research",
    ],
  },
];

export default function SignupStep6({
  interests,
  setInterests,
  addInterest,
  removeInterest,
}: SignupStep6Props) {
  return (
    <div className="space-y-6">
      {/* Selected Interests */}
      {interests.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-text-secondary">
            Selected Interests
          </p>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest, index) => (
              <Badge
                key={index}
                className="flex items-center gap-1 px-3 py-1"
                color={"blue"}
                content={interest.interest_name}
                onRemove={() => {
                  setInterests(
                    interests.filter(
                      (i) =>
                        i.interest_category !== interest.interest_category ||
                        i.interest_name !== interest.interest_name
                    )
                  );
                }}
                isEditable
              />
            ))}
          </div>
        </div>
      )}

      {/* Interest Categories */}
      <div className="space-y-4">
        {interestCategories.map((category) => {
          const IconComponent = category.icon;
          return (
            <div key={category.category} className="space-y-3">
              <div className="flex items-center gap-2">
                <IconComponent className="h-5 w-5 text-text-secondary" />
                <label className="font-medium text-text-secondary">
                  {category.category}
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.interests.map((interest) => {
                  const isSelected = interests.some(
                    (item) =>
                      item.interest_category === category.category &&
                      item.interest_name === interest
                  );
                  return (
                    <Badge
                      key={interest}
                      className="flex items-center gap-1 px-3 py-1 cursor-pointer"
                      color={isSelected ? "blue" : "gray"}
                      content={interest}
                      onClick={() =>
                        isSelected
                          ? removeInterest(category.category, interest)
                          : addInterest(category.category, interest)
                      }
                      isHover
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
