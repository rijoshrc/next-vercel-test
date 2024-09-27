"use client";

import { BlockSettings } from "@/type/content";
import { Link as LinkType } from "@/type/link";
import { ImageType } from "@/type/media";
import {
  generateBlockClassNames,
  getFontClassName,
  getFontSizeClassName,
} from "@/utils/fns";
import optimizedImage from "@/utils/optimizedImage";
import dynamic from "next/dynamic";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

// Dynamically import the Slider to avoid server-side rendering
const Slider = dynamic(() => import("react-slick"), { ssr: false });

interface HeroCarouselItem {
  content: {
    contentType: string;
    id: string;
    properties: {
      settings?: any;
      startDate: string | null;
      endDate: string | null;
      textColor: string | null;
      backgroundColor: string | null;
      backgroundImage: ImageType[];
      heading: string;
      subHeading: string;
      headingFont: string;
      headingFontSize: string;
      font: string;
      subHeadingFontSize: string;
      redirectPage?: LinkType[];
    };
  };
}

interface HeroCarouselSectionProps {
  contentBlock: {
    content: {
      properties: {
        items: { items: HeroCarouselItem[] };
      };
    };

    settings: BlockSettings;
  };
}

const HeroCarouselSection: React.FC<HeroCarouselSectionProps> = ({
  contentBlock,
}) => {
  const { content } = contentBlock;
  const { items } = content.properties.items;
  const { anchorName, customCssClass } = contentBlock.settings.properties;
  const now = new Date();

  // Track the current slide for accessibility
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    customPaging: function (i: number) {
      return (
        <button
          type="button"
          role="tab"
          aria-label={`${i + 1} of ${items.length || 0}`}
          tabIndex={currentSlide === i ? 0 : -1}
          aria-selected={currentSlide === i}
        >
          {i + 1}
        </button>
      );
    },
    beforeChange: (current: number, next: number) => {
      setCurrentSlide(next);
    },
  };

  // Render only the first image initially
  const firstItem = items.find((item) => {
    const startDate = item.content.properties.startDate
      ? new Date(item.content.properties.startDate)
      : null;
    const endDate = item.content.properties.endDate
      ? new Date(item.content.properties.endDate)
      : null;

    return (!startDate || startDate <= now) && (!endDate || now <= endDate);
  });

  return (
    <>
      <Head>
        {firstItem &&
          firstItem.content.properties.backgroundImage?.[0]?.url && (
            <link
              rel="preload"
              as="image"
              href={firstItem.content.properties.backgroundImage[0].url}
            />
          )}
      </Head>
      <section
        id={anchorName}
        className={`${customCssClass} ${generateBlockClassNames(
          contentBlock.settings.properties
        )} section__hero--carousel`}
      >
        <div className="hero__wrapper">
          <Slider {...sliderSettings}>
            {items.map((item, index) => {
              const isAvailable =
                (!item.content.properties.startDate ||
                  new Date(item.content.properties.startDate) <= now) &&
                (!item.content.properties.endDate ||
                  now <= new Date(item.content.properties.endDate));

              if (!isAvailable) return null;

              const imageUrl =
                item.content.properties.backgroundImage?.[0]?.url || "";
              const blurImageUrl = optimizedImage(imageUrl);

              return (
                <Link
                  key={index}
                  href={
                    item.content.properties.redirectPage?.[0].route.path || ""
                  }
                  title={item.content.properties.redirectPage?.[0].title || ""}
                >
                  <div className="hero__wrapper-item">
                    <Image
                      src={imageUrl}
                      alt={item.content.properties.heading || "Hero image"}
                      loading={index === 0 ? "eager" : "lazy"}
                      priority={index === 0}
                      fetchPriority={index === 0 ? "high" : "low"}
                      placeholder="blur"
                      blurDataURL={blurImageUrl}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes={
                        index === 0
                          ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          : ""
                      }
                    />
                    <div className="container">
                      {item.content.properties.heading && (
                        <p
                          className={`heading ${getFontClassName(
                            item.content.properties.headingFont
                          )} ${getFontSizeClassName(
                            item.content.properties.headingFontSize
                          )}`}
                        >
                          {item.content.properties.heading}
                        </p>
                      )}
                      {item.content.properties.subHeading && (
                        <p
                          className={`subheading ${getFontClassName(
                            item.content.properties.font
                          )} ${getFontSizeClassName(
                            item.content.properties.subHeadingFontSize
                          )}`}
                        >
                          {item.content.properties.subHeading}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </Slider>
        </div>
      </section>
    </>
  );
};

export default HeroCarouselSection;
