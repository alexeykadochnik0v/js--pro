module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          browsers: ["> 1%", "last 2 versions"],
        },
        modules: false, // Позволяет webpack обрабатывать ES6 модули для tree shaking
        useBuiltIns: "usage", // Автоматически добавляет polyfills при необходимости
        corejs: 3, // Версия core-js для polyfills
      },
    ],
    [
      "@babel/preset-react",
      {
        runtime: "automatic", // Использует новый JSX runtime из React 17+
        development: process.env.NODE_ENV === "development",
      },
    ],
    "@babel/preset-typescript",
  ],
  plugins: [
    "@babel/plugin-transform-class-properties",
    "@babel/plugin-transform-object-rest-spread",
    "@babel/plugin-syntax-dynamic-import",
    [
      "@babel/plugin-transform-runtime",
      {
        corejs: false,
        helpers: true,
        regenerator: true,
        useESModules: false,
      },
    ],
  ],
  env: {
    development: {
      plugins: [
        // Плагины только для development режима
      ],
    },
    production: {
      plugins: [
        // Плагины только для production режима
      ],
    },
  },
};
