import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h2 className="text-4xl font-bold mb-4">404 Not Found</h2>
      <p className="text-lg mb-6">요청하신 페이지를 찾을 수 없습니다.</p>
      <Link
        href="/"
        className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        메인페이지로 돌아가기
      </Link>
    </div>
  );
}
