/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/upload',
                permanent: true, // 301 리디렉션 (true로 설정하면 영구 리디렉션)
            },
        ];
    },
};

export default nextConfig;
