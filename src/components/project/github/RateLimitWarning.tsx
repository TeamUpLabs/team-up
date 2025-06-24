"use client";

import { useEffect, useState } from "react";
import { Ban } from "flowbite-react-icons/outline";

interface RateLimit {
  limit: number;
  remaining: number;
  used: number;
  reset: number;
}

interface Props {
  token: string;
  threshold?: number;
  className?: string;
}

export default function RateLimitWarning({ token, threshold = 100, className = "" }: Props) {
  const [rate, setRate] = useState<RateLimit | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch("/api/github/getRateLimit", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setRate(data.rateLimit.rate);
        else setError(data.error || "API 호출 실패");
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    fetchRate();
  }, [token]);

  if (error) {
    return <p className="text-red-500">🚨 {error}</p>;
  }

  if (!rate) return null;

  if (rate.remaining < threshold) {
    return (
      <div className={`w-full max-w-md rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700 shadow-sm ${className}`}>
        <div className="flex items-start gap-3">
          <Ban className="text-red-500" />
          <div>
            <p className="font-medium">GitHub API 사용량 경고</p>
            <p className="mt-1 text-sm">
              남은 요청 수: <span className="font-semibold">{rate.remaining}/{rate.limit}</span>
              <br />
              리셋 시간: <span className="font-semibold">{new Date(rate.reset * 1000).toLocaleString("ko-KR")}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}