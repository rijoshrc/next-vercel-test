import dynamic from "next/dynamic";
import { fetchContent } from "@/services/api";
import { ContentBlock } from "@/type/content";
import { ImageType } from "@/type/media";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { URLEncode } from "@/utils/fns";

const LodgingPage = dynamic(() => import("./_components/LodgingPage"));
const BookingPage = dynamic(() => import("./_components/booking-page"));
const ReceiptPage = dynamic(() => import("./_components/receipt-page"));
const FavoritePage = dynamic(() => import("./_components/favorite-page"));
const BlogListPage = dynamic(() => import("./_components/blog-list-page"));
const BlogDetailsPage = dynamic(
  () => import("./_components/blog-details-page")
);
const ContentBlockMapping = dynamic(
  () => import("../_components/ContentBlockMapping")
);
const LodgingListPage = dynamic(() => import("./_components/lodgingListPage"));

type Props = {
  params: { slug: string[] };
  searchParams: URLSearchParams;
};

const SlugPage = async ({ params, searchParams }: Props) => {
  // Generate the slug path from the slug array
  const slugPath = params.slug.join("/");

  // Request the content from the API using the slug path and query string
  const content = await fetchContent(
    slugPath + "?" + URLEncode(searchParams as any)
  );

  // If the content is null, return 404
  if (content === null) {
    return notFound();
  }

  // Get the content blocks (can be null)
  const contentBlockItems =
    content.properties.contentBlocks?.items || ([] as ContentBlock[]);

  const topBlockItems =
    content.properties.topBlocks?.items || ([] as ContentBlock[]);

  switch (content.contentType) {
    // Handle content pages
    case "contentWithMenuPage":
    case "contentPage":
      return (
        <>
          {[...topBlockItems, ...contentBlockItems]
            .filter(
              (contentBlock: any) =>
                !contentBlock.settings.properties.hideSection
            )
            .map((contentBlock: any) => (
              <ContentBlockMapping
                key={contentBlock.content.id}
                contentBlock={contentBlock}
                parentNodeId={content.nodeId}
              />
            ))}
        </>
      );

    // Handle lodging list page
    case "lodgingListPage":
      return <LodgingListPage />;
    case "lodgingPage":
      return <LodgingPage data={content} />;
    case "bookingPage":
      return <BookingPage data={content} />;
    case "receiptPage":
      return <ReceiptPage data={content} />;
    case "favoritesPage":
      return <FavoritePage data={content} />;
    case "blogListPage":
      return <BlogListPage data={content} />;
    case "blogDetailsPage":
      return <BlogDetailsPage data={content} />;
    default:
      console.log(content);
      return null;
  }
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Generate the slug path from the slug array
  const slugPath = params.slug.join("/");

  // Request the content from the API using the slug path
  const content = await fetchContent(slugPath);

  // If the content is null, return empty metadata
  if (!content) {
    return {};
  }

  // Get the og image
  const ogImages = content.properties.metaOgImage as ImageType[];
  // It should be the list of URLs
  const ogImagePathList = ogImages?.map((img) => img.url);

  return {
    title: content.properties.metaTitle || "Ferienhäuser | Meer Und Hus",
    description: content.properties.metaDescription,
    openGraph: {
      images: ogImagePathList,
    },
  };
}

export default SlugPage;
