/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains:["localhost"],  //  バックエンドの画像サーバーを許可
    },
    eslint: {
        ignoreDuringBuilds: true,   // ビルド時のESLintチェックを無視する
    },
    typescript: {
        ignoreBuildErrors: true,    // TypeScriptのエラーも一旦無視してビルドする
    }
};

export default nextConfig;
