import { BlockSettings } from "@/type/content";
import { Link as LinkType } from "@/type/link";
import { ImageType } from "@/type/media";
import { getFontClassName, getFontSizeClassName } from "@/utils/fns";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface ImageWithTextSectionProps {
  contentBlock: {
    content: {
      contentType: string;
      id: string;
      properties: {
        image: ImageType[];
        imageLabel: string | null;
        youTubeUrl: string | null;
        heading: string;
        subHeading: string;
        description: { markup: string; blocks: any[] };
        link?: LinkType[];
        backgroundColor: any | null;
        textWillContinueAfterImage: boolean;
        headingTag: string;
        headingFont: string;
        headingFontSize: string;
        headingFontColor: any | null;
        subHeadingTag: string;
        subHeadingFont: string;
        subHeadingFontSize: string;
        subHeadingPosition: string;
        subHeadingFontColor: any[];
        imageOnRight: boolean;
        imageTitle: string | null;
      };
    };
    settings: BlockSettings;
  };
}

const ImageWithTextSection: React.FC<ImageWithTextSectionProps> = ({
  contentBlock,
}) => {
  const { content, settings } = contentBlock;
  const {
    image,
    imageLabel,
    youTubeUrl,
    heading,
    subHeading,
    description,
    link,
    backgroundColor,
    textWillContinueAfterImage,
    headingTag,
    headingFont,
    headingFontSize,
    headingFontColor,
    subHeadingTag,
    subHeadingFont,
    subHeadingFontSize,
    subHeadingPosition,
    subHeadingFontColor,
    imageOnRight,
    imageTitle,
  } = content.properties;

  const imageOnLeft = !imageOnRight ? "section__imagetext--flip" : "";
  const sectionStyles = backgroundColor
    ? `background-color: ${backgroundColor.ColorValue?.toString()}`
    : "";

  const renderHeading = () => {
    if (!heading) return null;

    const headingClass =
      headingTag.toLowerCase() === "p" ? "heading s-46px" : "";
    const styles = headingFontColor
      ? { color: headingFontColor.ColorValue?.toString() }
      : {};

    return (
      <Heading
        tag={headingTag}
        className={`${headingClass} ${getFontClassName(
          headingFont
        )} ${getFontSizeClassName(headingFontSize)}`}
        style={styles}
      >
        {heading}
      </Heading>
    );
  };

  const renderSubHeading = () => {
    if (!subHeading) return null;

    const subHeadingClass =
      subHeadingTag?.toLowerCase() === "p" ? "subheading s-24px" : "";

    const styles = subHeadingFontColor
      ? { color: subHeadingFontColor?.toString() }
      : {};

    return (
      <Heading
        tag={subHeadingTag}
        className={`${subHeadingClass} ${getFontClassName(
          subHeadingFont
        )} ${getFontSizeClassName(subHeadingFontSize)}`}
        style={styles}
      >
        <strong>{subHeading}</strong>
      </Heading>
    );
  };

  return (
    <section
      id={settings.properties.anchorName}
      className={`${
        settings.properties.customCssClass
      } section__imagetext ${imageOnLeft} ${
        textWillContinueAfterImage ? "image__float" : ""
      }`}
      style={sectionStyles ? { backgroundColor: sectionStyles } : undefined}
    >
      <div className="container">
        <div className="row">
          <div className="columns__wrapper">
            <div className="column">
              {textWillContinueAfterImage && (
                <div
                  className={`img__wrapper hidden ${
                    imageOnRight ? "float-right" : ""
                  }`}
                >
                  <OptimizeImage
                    image={image[0]}
                    optimize={true}
                    lazyLoad={true}
                    alt={imageLabel}
                    title={imageTitle}
                    height={image[0].height}
                    width={image[0].width}
                  />
                  {imageLabel && <small>{imageLabel}</small>}
                </div>
              )}

              {subHeadingPosition === "Above Heading" ? (
                <>
                  {renderSubHeading()}
                  {renderHeading()}
                </>
              ) : (
                <>
                  {renderHeading()}
                  {renderSubHeading()}
                </>
              )}

              <div dangerouslySetInnerHTML={{ __html: description.markup }} />

              {!!link?.length && (
                <Link
                  href={link[0].route.path}
                  target={link[0].target || "_self"}
                  className="button button--link"
                >
                  {link[0].title}
                </Link>
              )}
            </div>

            <div className="column">
              {youTubeUrl ? (
                <iframe
                  src={youTubeUrl}
                  frameBorder="0"
                  style={{ width: "100%", height: "100%" }}
                ></iframe>
              ) : (
                <div className="img__wrapper">
                  <OptimizeImage
                    image={image[0]}
                    optimize={true}
                    lazyLoad={true}
                    alt={imageLabel}
                    title={imageTitle}
                    height={image[0].height}
                    width={image[0].width}
                  />
                  {imageLabel && <small>{imageLabel}</small>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageWithTextSection;

interface OptimizeImageProps {
  image: ImageType;
  optimize: boolean;
  lazyLoad: boolean;
  alt: string | null;
  title: string | null;
  height: number;
  width: number;
}

const OptimizeImage: React.FC<OptimizeImageProps> = ({
  image,
  optimize,
  alt,
  title,
  height,
  width,
}) => {
  return (
    <picture>
      <Image
        src={image.url}
        alt={alt || ""}
        title={title || ""}
        height={height}
        width={width}
        fetchPriority="high"
        priority
        style={
          optimize
            ? { objectFit: "cover", width: "100%", height: "auto" }
            : undefined
        }
      />
    </picture>
  );
};

interface HeadingProps {
  tag: string;
  className: string;
  style: React.CSSProperties;
  children: React.ReactNode;
}

const Heading: React.FC<HeadingProps> = ({
  tag,
  className,
  style,
  children,
}) => {
  const tagMapping: { [key: string]: keyof JSX.IntrinsicElements } = {
    "P - Bold": "p",
    H2: "h2",
    H3: "h3",
    P: "p",
  };
  const Tag = tagMapping[tag] || "p";
  return (
    <Tag className={className} style={style}>
      {children}
    </Tag>
  );
};
