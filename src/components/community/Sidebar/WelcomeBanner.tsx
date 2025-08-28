import Image from "next/image";
import { useAuthStore } from "@/auth/authStore";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale/ko";

export default function WelcomeBanner() {
  const user = useAuthStore((state) => state.user);
  const [day, setDay] = useState<number | null>(null);

  useEffect(() => {
    const currentDay = new Date().getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
    setDay(currentDay);
  }, []);

  const messages = {
    // 일요일
    0: [
      "지난 한 주를 돌아보고 스스로를 칭찬해보세요 🌈",
      "내일의 시작을 위해 오늘은 차분히 준비해요 📖"
    ],
    // 월요일
    1: [
      "한 주의 시작, 새로운 기회가 기다리고 있어요 🌱",
      "작은 목표부터 차근차근 시작해봐요 🚶"
    ],
    // 화요일
    2: [
      "오늘은 어제보다 한 걸음 더 나아가는 날이에요 ✨",
      "꾸준함이 결국 큰 힘이 됩니다 💪"
    ],
    // 수요일
    3: [
      "벌써 절반! 잘해오고 있다는 증거예요 🙌",
      "오늘도 멋진 성취가 기다리고 있어요 🌟"
    ],
    // 목요일
    4: [
      "노력은 결코 배신하지 않아요 🌿",
      "성장하는 당신을 응원합니다 🚀"
    ],
    // 금요일
    5: [
      "이번 주도 고생 많으셨어요 👏",
      "주말이 다가와요! 조금만 더 힘내요 🌞"
    ],
    // 토요일
    6: [
      "오늘은 잠시 쉬어가도 좋아요 ☕",
      "마음의 여유가 또 다른 힘이 됩니다 🌸"
    ]
  };

  return (
    <div className="flex flex-col gap-4 bg-component-background border border-component-border p-4 rounded-md">
      <div className="flex items-center gap-4">
        <Image
          src={user?.profile_image || '/DefaultProfile.jpg'}
          alt="Profile"
          width={40}
          height={40}
          className="object-cover rounded-full ring-2 ring-offset-2 ring-red-500"
        />
        <div className="flex flex-col">
          <span className="font-semibold">반가워요! {user?.name}님</span>
          <span className="text-xs text-text-secondary">
            TeamUp과 함께한 지 {user?.created_at ? formatDistanceToNow(new Date(user.created_at), { locale: ko }) + " ❤️" : "새로운 계정이에요 🥰"}
          </span>
        </div>
      </div>
      {day !== null && (
        <div className="bg-component-tertiary-background rounded-md px-2 py-0.5 text-center">
          <span className="text-xs font-semibold text-text-primary">
            &quot;{messages[day as keyof typeof messages][Math.floor(Math.random() * 2)]}&quot;
          </span>
        </div>
      )}
    </div>
  )
}