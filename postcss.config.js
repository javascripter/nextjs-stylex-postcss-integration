module.exports = {
  plugins: {
    'postcss-react-strict-dom': {
      include: [
        'src/**/*.{js,jsx,ts,tsx}',
        'node_modules/react-strict-dom/dist/**/*.{js,jsx,ts,tsx}',
      ],
      babelConfig: {
        presets: [
          [
            'next/dist/compiled/babel/preset-typescript',
            {
              allowNamespaces: true,
            },
          ],
          ['react-strict-dom/babel-preset', { rootDir: process.cwd() }],
        ],
      },
    },
    autoprefixer: {},
  },
}
