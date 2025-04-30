/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'
const isGithubPages = process.env.GITHUB_PAGES === 'true'

const nextConfig = {
  output: 'export',
  // Условно устанавливаем basePath только для GitHub Pages
  basePath: isGithubPages ? '/rus-100' : '',
  // Условно устанавливаем assetPrefix только для GitHub Pages
  assetPrefix: isGithubPages ? '/rus-100/' : undefined,
  // Добавляем поддержку изображений
  images: {
    unoptimized: true,
    domains: ['github.com', 'raw.githubusercontent.com'],
  },
  // Отключаем trailingSlash для лучшей совместимости
  trailingSlash: false,
  // Обновляем экспериментальные настройки
  experimental: {
    // Удаляем appDir, так как он больше не является экспериментальным
    // Обновляем serverActions на объект с enabled: true
    serverActions: {
      enabled: true
    }
  },
  // Настройки для правильной работы с GitHub Pages
  env: {
    NEXT_PUBLIC_BASE_PATH: isGithubPages ? '/rus-100' : '',
  },
  // Отключаем строгий режим для отладки
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Включаем обратно проверку ошибок типов
    ignoreBuildErrors: false,
  },
}

export default nextConfig
