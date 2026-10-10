/** @type {import('next').NextConfig} */
const nextConfig = {
  // page-flip сам переносит DOM-узлы страниц журнала;
  // двойной запуск эффектов в StrictMode ломает его в режиме разработки
  reactStrictMode: false,
};

export default nextConfig;
