/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ubwtxzctltznagmdjwdn.supabase.co',
            }
        ]
    }
};

export default nextConfig;
