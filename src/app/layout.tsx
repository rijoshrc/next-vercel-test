import metaApi from "@/constants/metaApi";
import { fetchContent } from "@/services/api";
import dynamic from "next/dynamic";
import "../styles/scss/doc.scss";
import "react-datepicker/dist/react-datepicker.css";
import {
  caveatBold,
  caveatRegular,
  openSansBold,
  openSansRegular,
  quattrocentoSansBold,
  quattrocentoSansRegular,
} from "./fonts";
import Footer from "@/components/layouts/footer";

// const ScriptAndStyleLoader = dynamic(
//   () => import("./_components/ScriptAndStyleLoader")
// );

const Header = dynamic(() => import("@/components/layouts/header"));
const FavoriteProvider = dynamic(
  () => import("@/lib/context/FavoriteContext"),
  { ssr: false }
);

// const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // get the site settings from content api
  const siteSettings = await fetchContent(metaApi.siteSettings);

  // get the navigation settings
  const navigationSettings = await fetchContent(metaApi.navigationSettings);

  // get the site settings properties
  const properties = siteSettings?.properties || null;

  // get the phone number
  const phone = siteSettings?.properties.phone as string;

  // properties can be null or undefined
  if (!properties || !navigationSettings.properties) {
    return null;
  }

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icons/favicon.png" sizes="any" />
        <meta name="description" content={properties?.siteDescription} />
        <meta name="author" content={properties?.siteName} />
        <meta property="og:locale" content="de-DE" />
        <meta property="og:type" content="website" />
        <meta property="og:description" content={properties?.siteDescription} />
        <meta property="og:url" content={properties?.siteUrl} />
        <meta property="og:site_name" content={properties?.siteName} />
        <link rel="canonical" href={properties?.siteUrl} />
        <link rel="shortcut icon" href="/favicon.png" type="image/x-icon" />
        {/* TODO: remove this header on production */}
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex" />
        {/* <script
          dangerouslySetInnerHTML={{
            __html: stripHtmlTags(properties?.headerScripts),
          }}
        /> */}
      </head>
      <body
        className={`${quattrocentoSansRegular.variable} ${quattrocentoSansBold.variable} ${caveatRegular.variable} ${caveatBold.variable} ${openSansRegular.variable} ${openSansBold.variable}`}
      >
        <FavoriteProvider>
          <Header properties={{ ...navigationSettings.properties, phone }} />
          {/* {properties.overrideCSS && (
            <ScriptAndStyleLoader css={properties.overrideCSS} />
          )} */}
          {children}
          <Footer
            properties={properties}
            navigationProperties={navigationSettings.properties}
          />
        </FavoriteProvider>
      </body>
    </html>
  );
}
