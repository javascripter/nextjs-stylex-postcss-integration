/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['react-strict-dom'],
  experimental: {
    turbo: {
      rules: {
        './**/*.{js,jsx,ts,tsx}': {
          // as: "*.tsx", // tells turbopack to process file as tsx
          loaders: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  [
                    'next/dist/compiled/babel/preset-typescript',
                    {
                      allowNamespaces: true,
                    },
                  ],
                  [
                    'react-strict-dom/babel-preset',
                    {
                      debug: true,
                      dev: false,
                      rootDir: process.cwd(),
                    },
                  ],
                ],
              },
            },
          ],
        },
      },
    },
  },
}

export default nextConfig
