import metaApi from "@/constants/metaApi";
import { fetchContent } from "@/services/api";
import { ContentBlock } from "@/type/content";
import { ImageType } from "@/type/media";
import type { Metadata } from "next";

import ContentBlockMapping from "./_components/ContentBlockMapping";

export default async function Home() {
  // Fetch the home content from the CMS API
  const homeContent = await fetchContent(metaApi.home);

  if (!homeContent || !homeContent.properties) {
    return null;
  }

  // Get the content blocks
  const contentBlockItems = homeContent.properties.contentBlocks
    .items as ContentBlock[];

  return (
    <>
      {contentBlockItems
        .filter((contentBlock) => !contentBlock.settings.properties.hideSection)
        .map((contentBlock) => (
          <ContentBlockMapping
            key={contentBlock.content.id}
            contentBlock={contentBlock}
            parentNodeId={homeContent.nodeId}
          />
        ))}
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  // Request the content from the API using the slug path
  const content = await fetchContent(metaApi.home);

  // If the content is null, return empty metadata
  if (!content) {
    return {};
  }

  // Get the og image
  const ogImages = content.properties.metaOgImage as ImageType[];
  // It should be the list of URLs
  const ogImagePathList = ogImages?.map((img) => img.url);

  return {
    title: content.properties.metaTitle,
    description: content.properties.metaDescription,
    openGraph: {
      images: ogImagePathList,
    },
  };
}
