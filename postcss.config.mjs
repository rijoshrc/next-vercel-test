// postcss.config.js
const purgecss = require("@fullhuman/postcss-purgecss");

module.exports = {
  syntax: "postcss-scss", // Enables SCSS support in PostCSS
  plugins: [
    "postcss-preset-env", // For modern CSS features
    "autoprefixer", // Adds vendor prefixes
    process.env.NODE_ENV === "production"
      ? purgecss({
          content: [
            "./pages/**/*.{js,jsx,ts,tsx}", // Adjust the paths to your project's structure
            "./components/**/*.{js,jsx,ts,tsx}",
            "./app/**/*.{js,jsx,ts,tsx}", // Include this if you're using the app directory in Next.js 13+
            "./layouts/**/*.{js,jsx,ts,tsx}",
            "./public/**/*.html", // Include any public HTML files you may have
          ],
          defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [], // Extracts all CSS classes from the content
        })
      : null,
    "cssnano", // Minifies CSS
  ].filter(Boolean), // Remove null values
};
