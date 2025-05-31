import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "export",
    // output: "standalone",
    images: {
        unoptimized: true,
    },
    trailingSlash: true,
};

export default nextConfig;
