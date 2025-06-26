import Image from "next/image"
import { Star } from "flowbite-react-icons/outline"

export default function UserReview() {
  const testimonials = [
    {
      name: "김개발",
      role: "풀스택 개발자",
      company: "스타트업 A",
      content: "TeamUp 덕분에 사이드 프로젝트 관리가 정말 쉬워졌어요. GitHub 연동이 특히 좋습니다!",
      avatar: "/DefaultProfile.jpg",
      rating: 5,
    },
    {
      name: "박디자인",
      role: "UI/UX 디자이너",
      company: "디자인 스튜디오",
      content: "개발자와의 협업이 이렇게 원활할 줄 몰랐어요. 실시간 커뮤니케이션이 게임체인저입니다.",
      avatar: "/DefaultProfile.jpg",
      rating: 5,
    },
    {
      name: "이기획",
      role: "프로덕트 매니저",
      company: "테크 회사",
      content: "프로젝트 진행상황을 한눈에 파악할 수 있어서 관리가 훨씬 수월해졌습니다.",
      avatar: "/DefaultProfile.jpg",
      rating: 5,
    },
  ]

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            사용자 후기
          </span>
        </h2>
        <p className="text-xl text-text-primary">TeamUp과 함께하는 개발자들의 이야기</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-component-background border border-component-border hover:border-point-color-purple p-6 rounded-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center space-x-4 mb-4">
              <Image
                src={testimonial.avatar || "/DefaultProfile.jpg"}
                alt={testimonial.name}
                width={40}
                height={40}
                className="rounded-full border border-component-border"
              />
              <div>
                <div className="font-semibold text-text-primary">{testimonial.name}</div>
                <div className="text-sm text-text-secondary">{testimonial.role}</div>
                <div className="text-xs text-purple-400">{testimonial.company}</div>
              </div>
            </div>
            <div className="flex space-x-1 mb-3">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-sm text-text-secondary">&quot;{testimonial.content}&quot;</p>
          </div>
        ))}
      </div>
    </section>
  )
}