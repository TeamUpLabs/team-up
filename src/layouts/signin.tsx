"use client";

import Link from "next/link"
import { useState } from "react";
import { Google, Github } from "flowbite-react-icons/solid";
import { login } from "@/auth/authApi";

export default function SignIn() {
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserEmail(e.target.value);
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await login(userEmail, password);
  };

  const handleGithubLogin = () => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&scope=user:email,repo,admin:org`;
    window.location.href = githubAuthUrl;
  }
    

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-component-background rounded-lg shadow-md p-8 border border-component-border">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary">로그인</h1>
          <p className="text-text-secondary mt-2">계정에 접속하여 팀원을 찾아보세요</p>
        </div>

        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">이메일</label>
            <input
              type="email"
              id="email"
              value={userEmail}
              onChange={handleUsernameChange}
              required
              autoComplete="email"
              className="w-full px-4 py-3 rounded-md bg-input-background border border-input-border text-text-secondary focus:outline-none focus:ring-1 focus:ring-point-color-indigo"
              placeholder="이메일 주소를 입력하세요"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1">비밀번호</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              required
              autoComplete="current-password"
              className="w-full px-4 py-3 rounded-md bg-input-background border border-input-border text-text-secondary focus:outline-none focus:ring-1 focus:ring-point-color-indigo"
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative inline-flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="appearance-none h-5 w-5 border border-input-border rounded bg-input-background checked:border-point-color-indigo focus:outline-none focus:ring-1 focus:ring-point-color-indigo focus:ring-offset-1 focus:ring-offset-input-background transition-colors duration-200 cursor-pointer peer"
                />
                <svg
                  className="absolute w-3 h-3 text-text-secondary left-1 top-1 opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <label htmlFor="remember" className="ml-2 block text-sm text-text-secondary cursor-pointer">로그인 상태 유지</label>
              </div>
            </div>
            <a href="#" className="text-sm text-point-color-purple hover:text-point-color-purple-hover">비밀번호를 잊으셨나요?</a>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-point-color-indigo hover:bg-point-color-indigo-hover text-white font-medium rounded-md shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-point-color-indigo"
            onClick={handleSubmit}
          >
            로그인
          </button>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-component-background text-text-secondary">또는 소셜 계정으로 로그인</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              type="button"
              className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-component-border rounded-md bg-component-secondary-background hover:bg-component-tertiary-background text-sm font-medium text-text-primary transition duration-200 cursor-pointer"
            >
              <Google className="mr-2" />
              Google로 로그인
            </button>
            <button
              type="button"
              onClick={handleGithubLogin}
              className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-component-border rounded-md bg-component-secondary-background hover:bg-component-tertiary-background text-sm font-medium text-text-primary transition duration-200 cursor-pointer"
            >
              <Github className="mr-2" />
              GitHub로 로그인
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm">
          <p className="text-text-secondary">
            계정이 없으신가요?
            <Link href="/signup" className="text-point-color-purple hover:text-point-color-purple-hover ml-1">회원가입</Link>
          </p>
        </div>
      </div>
    </div>
  )
}