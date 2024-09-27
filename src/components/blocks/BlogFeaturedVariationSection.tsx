"use client";

import contentApi from "@/constants/contentApi";
import httpClient from "@/services/api/httpClient";
import { BlockSettings } from "@/type/content";
import {
  generateBlockClassNames,
  getFontClassName,
  getFontSizeClassName,
  getTextAlignmentClassName,
} from "@/utils/fns";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const LazyLoadSection = dynamic(() => import("../hoc/LazyLoadSection.server"));
const SectionLoader = dynamic(() => import("../compound/SectionLoader"));

export type ContentBlock = {
  content: {
    contentType: string;
    id: string;
    properties: {
      heading: string;
      buttonText: string;
      link: {
        url: string | null;
        queryString: string | null;
        title: string;
        target: string | null;
        destinationId: string;
        destinationType: string;
        route: {
          path: string;
          startItem: {
            id: string;
            path: string;
          };
        };
        linkType: string;
      }[];
      featuredArticles: any | null;
      tags: any | null;
      latestBlogs: any | null;
      headingTag: string;
      headingFont: string;
      headingFontSize: string;
      buttonTextAlignment: string;
    };
  };
  settings: BlockSettings;
};
interface BlogFeaturedVariationSectionProps {
  contentBlock: ContentBlock;
  parentNodeId: number;
}

interface Blog {
  author: string;
  authorUrl: string;
  category: string;
  categoryUrl: string;
  date: string;
  image: {
    altText: string;
    imageUrl: string;
  };
  summary: string;
  title: string;
  url: string;
  valid: boolean;
}

const BlogFeaturedVariationSection: React.FC<
  BlogFeaturedVariationSectionProps
> = ({ contentBlock, parentNodeId }) => {
  const { content, settings } = contentBlock;

  const {
    heading,
    buttonText,
    link,
    headingFont,
    headingFontSize,
    buttonTextAlignment,
  } = content.properties;

  const { blogData, loading } = useFetchBlogData(parentNodeId, content.id);

  if (!blogData || blogData.length === 0) return null;

  const firstBlog = blogData[0];
  // const itemHeadingFormat = getItemHeadingFormat(headingTag);

  return (
    <section
      id={settings.properties.anchorName}
      className={`section__blogfeaturedvariation ${generateBlockClassNames(
        settings.properties
      )} ${settings.properties.customCssClass} ${loading ? "loading" : ""}`}
    >
      <div className="container">
        {heading && (
          <h2
            className={`main-heading ${getFontClassName(
              headingFont
            )} ${getFontSizeClassName(headingFontSize)}`}
          >
            {heading}
          </h2>
        )}
        <div className="row">
          <div className="columns__wrapper">
            <div className="column">
              <Link href={firstBlog.url || ""} title={firstBlog.title}>
                {/* Recommended Image Size for Big Image: 540px x 375 */}
                <picture>
                  <Image
                    src={firstBlog.image.imageUrl}
                    alt={`${firstBlog.title} Image`}
                    className="blog-featured-big-image"
                    width={540}
                    height={375}
                  />
                </picture>
                <div className="content__desc">
                  <h3 className="column__heading">{firstBlog.title}</h3>
                  <div className="column__desc">{firstBlog.summary}</div>
                </div>
              </Link>
            </div>
            <div className="column">
              <div className="column__group">
                {blogData.slice(1).map((blog) => (
                  <div
                    key={blog.title}
                    className="content__row content__thumbs"
                  >
                    <Link href={blog.url} title={blog.title}>
                      {/* Recommended Image Size for Small Image: 154px x 93px */}
                      <picture>
                        <Image
                          src={firstBlog.image.imageUrl}
                          alt={`${blog.title} Image`}
                          className="blog-featured-small-image"
                          width={154}
                          height={93}
                        />
                      </picture>
                      <div className="content__desc">
                        <h3 className="item-heading">{blog.title}</h3>
                        <p>{blog.summary}</p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
              {link && (
                <div className="show-all">
                  <Link
                    href={link[0].route.path || ""}
                    target={link[0].target || "_self"}
                    title={link[0].title}
                    className={`button ${getTextAlignmentClassName(
                      buttonTextAlignment
                    )}`}
                  >
                    {buttonText}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// export default BlogFeaturedVariationSection;

export const getItemHeadingFormat = (mainHeadingFormat: string): string => {
  if (!mainHeadingFormat) return "H3";

  const formattedHeading = mainHeadingFormat.replace(" - Bold", "");

  switch (formattedHeading) {
    case "H2":
      return "H3";
    case "H3":
      return "H4";
    case "H4":
      return "H5";
    case "H5":
      return "H6";
    case "H6":
      return "P";
    case "P":
      return "P";
    default:
      return "H3";
  }
};

const useFetchBlogData = (parentNodeId: number, blockId: string) => {
  const [data, setData] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await httpClient.get(
        `${contentApi.blog}?blockId=${blockId}&nodeId=${parentNodeId}`
      );
      const blogs = data.blogDetailsPages as Blog[];
      setData(blogs);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  return { blogData: data, loading };
};

export default function WithLazyLoading(
  props: BlogFeaturedVariationSectionProps
) {
  return (
    <LazyLoadSection placeholder={<SectionLoader />}>
      <BlogFeaturedVariationSection {...props} />
    </LazyLoadSection>
  );
}
