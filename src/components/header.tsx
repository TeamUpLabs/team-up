import { useEffect, useState } from 'react';
import Link from "next/link"
import { Logo } from "@/components/logo"
import { useAuthStore } from "@/auth/authStore"
import UserDropdown from "@/components/platform/UserDropdown"
import Badge from "@/components/ui/Badge"


export default function Header() {
  const [isMounted, setIsMounted] = useState(false);
  const alertServicePreparing = () => {
    useAuthStore.getState().setAlert("서비스 준비중입니다.", "info");
  }
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const renderAuthContent = () => {
    if (!isMounted) {
      return (
        <div className="h-8 w-24"></div>
      );
    }

    return isAuthenticated() ? (
      <UserDropdown />
    ) : (
      <Link href="/signin" className="flex group">
        <Badge
          content={
            <span className="flex items-center gap-2 font-semibold">
              로그인
            </span>
          }
          color="purple"
          className="!px-3 !py-1 flex"
          isHover
        />
      </Link>
    );
  };

  return (
    <header className="fixed w-full backdrop-blur-md bg-background/70 z-40 border-b border-component-border">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/">
          <Logo />
        </Link>
        <nav className="md:flex space-x-5 sm:space-x-10 text-sm font-medium">
          <Link href="/platform" className="hover:text-point-color-purple transition-colors duration-200">플랫폼</Link>
          <Link href="/community" className="hover:text-point-color-purple transition-colors duration-200">커뮤니티</Link>
          <Link href="#" className="hover:text-point-color-purple transition-colors duration-200" onClick={alertServicePreparing}>멘토링</Link>
          <Link href="#" className="hover:text-point-color-purple transition-colors duration-200" onClick={alertServicePreparing}>이벤트</Link>
        </nav>
        {renderAuthContent()}
      </div>
    </header>
  )
}