import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

interface SubmitBtnProps {
  submitStatus: 'idle' | 'submitting' | 'success' | 'error';
  onClick?: () => void;
  buttonText?: string; // Optional custom text for idle state
  className?: string;
  fit?: boolean;
}

export default function SubmitBtn({ submitStatus, onClick, buttonText = "제출", className, fit }: SubmitBtnProps) {
  return (
    <div className={`${fit ? "w-full" : "w-fit"}`}>
      <button
        type="submit"
        disabled={submitStatus === 'submitting' || submitStatus === 'error'}
        className={`
        w-full py-3 px-6 rounded-md text-base font-medium
        flex items-center justify-center gap-2
        transition-all duration-300 ease-in-out
        focus:outline-none group
        active:scale-95
        ${submitStatus === 'success' 
          ? 'bg-point-color-green hover:bg-point-color-green-hover' 
          : 'bg-point-color-indigo hover:bg-point-color-indigo-hover'}
        text-white
        ${className}
      `}
        onClick={onClick}
      >
        {submitStatus === 'idle' && (
          <>
          {buttonText}
          <span className="overflow-hidden w-4">
            <FontAwesomeIcon 
              icon={faArrowRight} 
              className="transform -translate-x-4 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" 
            />
          </span>
        </>
      )}
      {submitStatus === 'submitting' && (
        <>
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            ></circle>
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          제출중...
        </>
      )}
      {submitStatus === 'success' && (
        <>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5"></path>
          </svg>
          제출 완료
        </>
      )}
      {submitStatus === 'error' && (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          오류 발생
        </>
      )}
      </button>
    </div>
  );
}