"use client";

import Link from "next/link"
import { useState, useRef, useEffect } from "react"

export default function SignUp() {
    const [role, setRole] = useState<string>("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        yearsOfExperience: "",
        specialty: ""
    });
    const [specialties, setSpecialties] = useState<string[]>([]);
    const [specialtyInput, setSpecialtyInput] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const suggestionsRef = useRef<HTMLDivElement>(null);
    const specialtyInputRef = useRef<HTMLInputElement>(null);
    const [isComposing, setIsComposing] = useState(false);

    // 전문분야 자동완성 데이터
    const specialtySuggestions = {
        developer: ["React", "Vue", "Angular", "Node.js", "Python", "Java", "Spring", "Django", "Flask", "TypeScript", "JavaScript", "Next.js", "Express", "MongoDB", "MySQL", "PostgreSQL", "AWS", "Docker", "Kubernetes"],
        designer: ["UI/UX", "Figma", "Adobe XD", "Sketch", "Photoshop", "Illustrator", "InDesign", "프로토타이핑", "와이어프레임", "인터랙션 디자인", "모션 디자인", "브랜딩", "그래픽 디자인"],
        planner: ["서비스 기획", "프로젝트 관리", "스크럼", "애자일", "프로덕트 매니지먼트", "비즈니스 분석", "마케팅 기획", "데이터 분석", "사용자 리서치", "프로세스 개선"]
    };

    // 경력 연차 옵션
    const yearsOfExperienceOptions = [
        { value: "", label: "경력을 선택하세요" },
        { value: "0", label: "신입" },
        { value: "1", label: "1년" },
        { value: "2", label: "2년" },
        { value: "3", label: "3년" },
        { value: "4", label: "4년" },
        { value: "5", label: "5년 이상" },
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRoleSelect = (selectedRole: string) => {
        setRole(selectedRole);
        setSpecialties([]);
        setSpecialtyInput("");
        if (specialtyInputRef.current) {
            specialtyInputRef.current.focus();
        }
    };

    const handleSpecialtyInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSpecialtyInput(value);
        
        if (value && role) {
            const filtered = specialtySuggestions[role as keyof typeof specialtySuggestions]
                .filter(suggestion => 
                    suggestion.toLowerCase().includes(value.toLowerCase()) &&
                    !specialties.includes(suggestion)
                );
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleAddSpecialty = (specialty: string) => {
        const trimmedSpecialty = specialty.trim();
        if (trimmedSpecialty && !specialties.includes(trimmedSpecialty)) {
            setSpecialties(prev => [...prev, trimmedSpecialty]);
            setSpecialtyInput("");
            setShowSuggestions(false);
            if (specialtyInputRef.current) {
                specialtyInputRef.current.focus();
            }
        }
    };

    const handleRemoveSpecialty = (specialtyToRemove: string) => {
        setSpecialties(specialties.filter(specialty => specialty !== specialtyToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isComposing) {
            e.preventDefault();
            const trimmedInput = specialtyInput.trim();
            if (trimmedInput && !specialties.includes(trimmedInput)) {
                setSpecialties(prev => [...prev, trimmedInput]);
                setSpecialtyInput("");
                setShowSuggestions(false);
            }
        }
    };

    const handleCompositionStart = () => {
        setIsComposing(true);
    };

    const handleCompositionEnd = () => {
        setIsComposing(false);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log({ ...formData, role, specialties });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] p-4">
            <div className="w-full max-w-3xl bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white">회원가입</h1>
                    <p className="text-gray-400 mt-2">Team-Up에서 당신의 역량을 발휘할 준비를 해보세요</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Role selection */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-300 mb-3">역할을 선택해주세요</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button
                                type="button"
                                onClick={() => handleRoleSelect("developer")}
                                className={`p-6 rounded-lg border ${role === "developer" 
                                    ? "border-purple-500 bg-purple-900/30" 
                                    : "border-gray-600 bg-gray-700 hover:bg-gray-600"} 
                                    transition-all duration-200 flex flex-col items-center`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-3 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                </svg>
                                <span className="text-lg font-medium text-white">개발자</span>
                                <span className="text-xs text-gray-400 mt-2 text-center">프로젝트 구현 및 개발</span>
                            </button>
                            
                            <button
                                type="button"
                                onClick={() => handleRoleSelect("designer")}
                                className={`p-6 rounded-lg border ${role === "designer" 
                                    ? "border-purple-500 bg-purple-900/30" 
                                    : "border-gray-600 bg-gray-700 hover:bg-gray-600"} 
                                    transition-all duration-200 flex flex-col items-center`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-3 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                </svg>
                                <span className="text-lg font-medium text-white">디자이너</span>
                                <span className="text-xs text-gray-400 mt-2 text-center">UI/UX 디자인 및 시각화</span>
                            </button>
                            
                            <button
                                type="button"
                                onClick={() => handleRoleSelect("planner")}
                                className={`p-6 rounded-lg border ${role === "planner" 
                                    ? "border-purple-500 bg-purple-900/30" 
                                    : "border-gray-600 bg-gray-700 hover:bg-gray-600"} 
                                    transition-all duration-200 flex flex-col items-center`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-3 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <span className="text-lg font-medium text-white">기획자</span>
                                <span className="text-xs text-gray-400 mt-2 text-center">프로젝트 기획 및 관리</span>
                            </button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic information */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">이름</label>
                            <input 
                                type="text" 
                                id="name" 
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="이름을 입력하세요"
                                required
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">이메일</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="이메일 주소를 입력하세요"
                                required
                            />
                        </div>
                        
                        <div className="relative">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">비밀번호</label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    id="password" 
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 pr-12"
                                    placeholder="비밀번호를 입력하세요"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                        
                        <div className="relative">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">비밀번호 확인</label>
                            <div className="relative">
                                <input 
                                    type={showConfirmPassword ? "text" : "password"} 
                                    id="confirmPassword" 
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 pr-12"
                                    placeholder="비밀번호를 다시 입력하세요"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={toggleConfirmPasswordVisibility}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                    {showConfirmPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                        
                        <div>
                            <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-300 mb-1">경력</label>
                            <select
                                id="yearsOfExperience"
                                name="yearsOfExperience"
                                value={formData.yearsOfExperience}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            >
                                {yearsOfExperienceOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="relative">
                            <label htmlFor="specialty" className="block text-sm font-medium text-gray-300 mb-1">전문 분야</label>
                            <div className="relative">
                                <input 
                                    ref={specialtyInputRef}
                                    type="text" 
                                    id="specialty" 
                                    value={specialtyInput}
                                    onChange={handleSpecialtyInput}
                                    onKeyDown={handleKeyDown}
                                    onCompositionStart={handleCompositionStart}
                                    onCompositionEnd={handleCompositionEnd}
                                    className="w-full px-4 py-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="전문 분야를 입력하세요"
                                    disabled={!role}
                                />
                                {showSuggestions && suggestions.length > 0 && (
                                    <div 
                                        ref={suggestionsRef}
                                        className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto"
                                    >
                                        {suggestions.map((suggestion, index) => (
                                            <div
                                                key={index}
                                                className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white"
                                                onClick={() => handleAddSpecialty(suggestion)}
                                            >
                                                {suggestion}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {specialties.map((specialty, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-1 bg-purple-900/30 text-white px-3 py-1 rounded-full text-sm"
                                    >
                                        {specialty}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSpecialty(specialty)}
                                            className="text-gray-400 hover:text-white"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <button 
                        type="submit" 
                        className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 mt-8"
                        disabled={!role}
                    >
                        가입하기
                    </button>
                </form>
                
                <div className="mt-6 text-center text-sm">
                    <p className="text-gray-400">
                        이미 계정이 있으신가요? 
                        <Link href="/signin" className="text-purple-400 hover:text-purple-300 ml-1">로그인</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}