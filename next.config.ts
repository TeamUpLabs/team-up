import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["vnaetwpgkoexfobnveuv.supabase.co", "avatars.githubusercontent.com"],
  },
  async rewrites() {
    return [
      {
        source: "/ws/:path*",
        destination: "http://localhost:8000/ws/:path*",
      },
    ];
  },
};

export default nextConfig;