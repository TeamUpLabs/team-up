
import { Post } from "@/types/community/Post";
import Posts from "@/components/community/Posts";

interface MyPostsProps {
    posts: Post[];
}

export default function MyPosts({ posts }: MyPostsProps) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-text-primary">{posts.length}개의 게시글</h1>

      {posts.map((post) => (
        <Posts key={post.id} post={post} />
      ))}
    </div>
  );
}