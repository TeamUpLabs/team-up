import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["vnaetwpgkoexfobnveuv.supabase.co", "avatars.githubusercontent.com"],
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
      {
        source: "/ws/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/ws/:path*`,
      },
    ];
  },
};

export default nextConfig;