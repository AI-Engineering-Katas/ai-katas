/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENROUTER_API_BASE: 'https://openrouter.ai/api/v1',
    CHROMA_API_URL: process.env.CHROMA_API_URL || 'http://localhost:8000'
  }
};

module.exports = nextConfig; 