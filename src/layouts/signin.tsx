"use client";

import Link from "next/link"
import { useState } from "react";
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
                            className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-component-border rounded-md bg-component-secondary-background hover:bg-component-tertiary-background text-sm font-medium text-text-primary transition duration-200"
                        >
                            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                            </svg>
                            Google로 로그인
                        </button>
                        <button
                            type="button"
                            className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-component-border rounded-md bg-component-secondary-background hover:bg-component-tertiary-background text-sm font-medium text-text-primary transition duration-200"
                        >
                            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                            </svg>
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