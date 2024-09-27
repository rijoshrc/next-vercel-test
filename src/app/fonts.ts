// styles/fonts.ts
import localFont from "next/font/local";

// Quattrocento Sans Regular (400)
export const quattrocentoSansRegular = localFont({
  src: [
    {
      path: "./fonts/Quattrocento-Sans/quattrocento-sans-v10-latin-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Quattrocento-Sans/quattrocento-sans-v10-latin-regular.woff",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-quattrocento-sans-regular",
  display: "swap",
});

// Quattrocento Sans Bold (700)
export const quattrocentoSansBold = localFont({
  src: [
    {
      path: "./fonts/Quattrocento-Sans/quattrocento-sans-v10-latin-700.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Quattrocento-Sans/quattrocento-sans-v10-latin-700.woff",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-quattrocento-sans-bold",
  display: "swap",
});

// Caveat Regular (400)
export const caveatRegular = localFont({
  src: [
    {
      path: "./fonts/Caveat/caveat-v4-latin-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Caveat/caveat-v4-latin-regular.woff",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-caveat-regular",
  display: "swap",
});

// Caveat Bold (700)
export const caveatBold = localFont({
  src: [
    {
      path: "./fonts/Caveat/caveat-v4-latin-700.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Caveat/caveat-v4-latin-700.woff",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-caveat-bold",
  display: "swap",
});

// Open Sans Regular (400)
export const openSansRegular = localFont({
  src: [
    {
      path: "./fonts/Open Sans/open-sans-v15-latin-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Open Sans/open-sans-v15-latin-regular.woff",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-open-sans-regular",
  display: "swap",
});

// Open Sans Bold (700)
export const openSansBold = localFont({
  src: [
    {
      path: "./fonts/Open Sans/open-sans-v15-latin-700.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Open Sans/open-sans-v15-latin-700.woff",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-open-sans-bold",
  display: "swap",
});
