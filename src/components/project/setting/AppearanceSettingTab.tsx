import { useState } from "react";

export default function AppearanceSettingTab() {
  const [selectedTheme, setSelectedTheme] = useState<string>("dark");

  const handleApplyTheme = () => {
    // Here you would implement the actual theme application
    console.log(`Applying theme: ${selectedTheme}`);
    // You might want to save the theme preference to localStorage or context
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-100 mb-6">테마 설정</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          className="border-2 border-transparent hover:border-blue-500 rounded-lg p-4 cursor-pointer bg-gray-900"
          onClick={() => setSelectedTheme("dark")}
        >
          <div className="h-24 bg-gray-900 rounded-t-lg flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-gray-800 relative flex items-center justify-center">
              {selectedTheme === "dark" && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
          <div className="mt-2 text-center text-gray-300">다크</div>
        </div>

        <div 
          className="border-2 border-transparent hover:border-blue-500 rounded-lg p-4 cursor-pointer bg-white"
          onClick={() => setSelectedTheme("light")}
        >
          <div className="h-24 bg-white rounded-t-lg flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 relative flex items-center justify-center">
              {selectedTheme === "light" && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
          <div className="mt-2 text-center text-gray-700">라이트</div>
        </div>
      </div>

      <button 
        className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        onClick={handleApplyTheme}
      >
        테마 적용
      </button>
    </div>
  );
}