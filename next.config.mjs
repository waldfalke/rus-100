/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Отключаем WebAssembly и используем чистый JavaScript для хеширования
  webpack: (config, { isServer, dev }) => {
    // Отключаем использование WasmHash, который вызывает ошибку
    config.optimization.moduleIds = 'deterministic';
    
    // Отключаем WebAssembly-зависимые хеш-функции
    if (config.optimization && config.optimization.minimizer) {
      for (const minimizer of config.optimization.minimizer) {
        if (minimizer.constructor.name === 'TerserPlugin') {
          minimizer.options.terserOptions = {
            ...minimizer.options.terserOptions,
            format: {
              ...minimizer.options.terserOptions?.format,
              comments: false,
            },
          };
        }
      }
    }
    
    return config;
  },
}

export default nextConfig
