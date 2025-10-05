"use client";

import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
}

export default function StarRating({
  value,
  onChange,
  maxRating = 5,
  size = "md",
  readonly = false
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  const handleClick = (rating: number) => {
    if (!readonly) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (!readonly) {
      setHoverRating(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }, (_, index) => {
        const rating = index + 1;
        const isFilled = rating <= (hoverRating || value);

        const buttonClasses = `
          ${sizeClasses[size]}
          transition-colors duration-150
          ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}
        `.trim();

        const starClasses = isFilled
          ? 'text-yellow-400 fill-yellow-400'
          : 'text-gray-300 hover:text-yellow-400 hover:fill-yellow-400';

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(rating)}
            onMouseEnter={() => handleMouseEnter(rating)}
            onMouseLeave={handleMouseLeave}
            disabled={readonly}
            className={buttonClasses}
            aria-label={`${rating}점`}
          >
            <Star className={starClasses} />
          </button>
        );
      })}
      <span className="ml-2 text-sm text-text-secondary">
        {value > 0 ? `${value}점` : '별점을 선택해주세요'}
      </span>
    </div>
  );
}
