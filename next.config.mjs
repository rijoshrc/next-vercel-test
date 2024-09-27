import analyzer from "@next/bundle-analyzer";

/** @type {import('next').NextConfig} */

/**
 * Get the content delivery api from env
 */
const contentDomain = process.env.NEXT_PUBLIC_CONTENT_API;

const withBundleAnalyzer = analyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  /**
   * White list domain
   */
  images: {
    // domains: [contentDomain],

    minimumCacheTTL: 60,
  },
  /**
   * Create proxy for content delivery api media urls
   * @returns
   */
  async rewrites() {
    return [
      {
        source: "/forms/entries/:path",
        destination: `${contentDomain}/umbraco/forms/api/v1/entries/:path`,
      },
      {
        source: "/forms/definitions/:path",
        destination: `${contentDomain}/umbraco/forms/api/v1/definitions/:path`,
      },
      {
        source: "/api/favoriteapi/getallsummary",
        destination: `${contentDomain}/umbraco/api/favoriteapi/getallsummary`,
      },
      {
        source: "/api/BlogPageApi/Search",
        destination: `${contentDomain}/umbraco/api/BlogPageApi/Search`,
      },
      {
        source: "/api/ContentBlockApi/:path*",
        destination: `${contentDomain}/umbraco/api/ContentBlockApi/:path*`,
      },
      {
        source: "/api/PageSearchApi/:path*",
        destination: `${contentDomain}/umbraco/api/PageSearchApi/:path*`,
      },
      {
        source: "/api/LodgingApi/:path*",
        destination: `${contentDomain}/umbraco/api/LodgingApi/:path*`,
      },
      {
        source: "/api/WidgetApi/:path*",
        destination: `${contentDomain}/umbraco/api/WidgetApi/:path*`,
      },
      {
        source: "/api/Marketing/:path*",
        destination: `${contentDomain}/umbraco/api/Marketing/:path*`,
      },
      {
        source: "/api/BookingApi/:path*",
        destination: `${contentDomain}/umbraco/api/BookingApi/:path*`,
      },
      {
        source: "/api/calendarapi/:path*",
        destination: `${contentDomain}/umbraco/api/calendarapi/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${contentDomain}/umbraco/delivery/api/v2/:path*`,
      },
      {
        source: "/media/:path*",
        destination: contentDomain + "media/:path*",
      },
    ];
  },

  reactStrictMode: false,

  experimental: {
    proxyTimeout: 60000,
  },

  swcMinify: true, // Enable SWC minification

  webpack: (config, { isServer, dev }) => {
    if (!dev && !isServer) {
      config.optimization.minimize = true; // Ensure JS and CSS minification is enabled
    }
    return config;
  },
};

export default withBundleAnalyzer(nextConfig);
