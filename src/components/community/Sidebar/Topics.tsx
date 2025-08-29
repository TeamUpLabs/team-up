export default function Topics() {
  const topics = [
    { id: 1, name: "React", count: 424 },
    { id: 2, name: "이벤트", count: 23 },
    { id: 3, name: "프로젝트", count: 10 },
  ];
  return (
    <div className="flex flex-col gap-4 bg-component-background border border-component-border p-4 rounded-md">
      <span className="font-semibold text-text-primary text-lg">🔥 지금 핫한 주제</span>
      <div className="flex flex-col gap-2">
        {topics.map((topic) => (
          <div key={topic.id} className="flex flex-col px-2">
            <span className="font-semibold text-text-primary hover:underline cursor-pointer"># {topic.name}</span>
            <span className="text-sm text-text-secondary">{topic.count}개의 새 게시글</span>
          </div>
        ))}
      </div>
    </div>
  );
}