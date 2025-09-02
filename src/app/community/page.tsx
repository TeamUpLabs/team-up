import Posts from "@/components/community/Posts";

export interface PostsProps {
  user: {
    name: string;
    avatar: string;
    role: string;
  },
  content: string;
  code?: {
    language: string;
    code: string;
  };
  tags: string[];
  reaction: {
    likes: number;
    comments: number;
    views: number;
    shares: number;
  };
  created_at: string;
  updated_at: string;
}

const posts: PostsProps[] = [
  {
    user: {
      name: "김개발",
      avatar: "/DefaultProfile.jpg",
      role: "개발자",
    },
    content: "React 18의 새로운 Concurrent Features를 활용한 성능 최적화 방법을 정리해봤습니다. Suspense와 함께 사용하면 정말 놀라운 결과를 얻을 수 있어요!",
    code: {
      language: "javascript",
      code: `function App() {
  return (
    <Suspense fallback={<Loading />}>
      <UserProfile />
    </Suspense>
  );
}`,
    },
    tags: ["React", "Suspense", "Concurrent Features"],
    reaction: {
      likes: 128,
      comments: 28,
      views: 1520,
      shares: 12,
    },
    created_at: "2025-09-02T12:23:00.000Z",
    updated_at: "2025-09-02T12:23:00.000Z",
  },
  {
    user: {
      name: "이지은",
      avatar: "/DefaultProfile.jpg",
      role: "개발자",
    },
    content: "TypeScript 5.0의 새로운 기능들을 실제 프로젝트에 적용해보고 있습니다. 특히 const assertions와 template literal types의 조합이 정말 강력해요!",
    tags: ["TypeScript", "Frontend", "WebDev"],
    reaction: {
      likes: 89,
      comments: 15,
      views: 980,
      shares: 8,
    },
    created_at: "2025-09-02T12:23:00.000Z",
    updated_at: "2025-09-02T12:23:00.000Z",
  },
  {
    user: {
      name: "박준호",
      avatar: "/DefaultProfile.jpg",
      role: "개발자",
    },
    content: "Node.js에서 메모리 누수를 찾고 해결하는 방법에 대해 정리했습니다. 프로덕션 환경에서 겪었던 실제 사례와 함께 공유드려요.",
    code: {
      language: "javascript",
      code: `// Memory leak detection
const v8 = require('v8');
const heapSnapshot = v8.writeHeapSnapshot();
console.log('Heap snapshot written to:', heapSnapshot);`,
    },
    tags: ["Node.js", "Memory Leak", "Backend", "Performance"],
    reaction: {
      likes: 156,
      comments: 32,
      views: 2340,
      shares: 24,
    },
    created_at: "2025-09-02T12:23:00.000Z",
    updated_at: "2025-09-02T12:23:00.000Z",
  }
];

export default function CommunityPage() {
  return (
    <div className="space-y-4">
      {posts.map((post, index) => (
        <Posts key={index} {...post} />
      ))}
    </div>
  );
}