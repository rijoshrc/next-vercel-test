import { BlockSettings } from "@/type/content";
import {
  generateBlockClassNames,
  getClassName,
  getFontClassName,
  getFontSizeClassName,
} from "@/utils/fns";
import optimizedImage from "@/utils/optimizedImage";
import Image from "next/image";
import Link from "next/link";

export interface SmallTeaserPodsSection {
  contentType: "smallTeaserPodsSection";
  id: string;
  properties: {
    columns: string;
    items: {
      items: Array<{
        content: SmallTeaserPodsItem;
        settings: BlockSettings | null;
      }>;
    };
    heading: string | null;
    bottomText: string | null;
    headingFormat: string | null;
    headingFont: string | null;
    headingFontSize: string | null;
    headingTextAlignment: string | null;
    backgroundColor: Color | null;
  };
}

export interface SmallTeaserPodsItem {
  contentType: "smallTeaserPodsItem";
  id: string;
  properties: {
    image: Media[];
    image2: Media[];
    headline: string;
    subHeading: string;
    text: {
      markup: string;
      blocks: any[];
    };
    link: Link[] | null;
    textPosition: string;
    border: boolean;
    headingFormat: string;
    headlineFont: string;
    textColor: Color | null;
    headlineFontSize: string;
    subHeadingFormat: string;
    subHeadingFont: string;
    subHeadingTextColor: Color | null;
    subHeadingFontSize: string;
    subHeadingOnTop: boolean;
    disableZoomIn: boolean;
    image1Title: string;
    image2Title: string | null;
    textWithInImageVerticalPosition: string | null;
    button: boolean;
    buttonText: string;
    buttonColor: Color | null;
    buttonColorHover: Color | null;
  };
}

interface Media {
  id: string;
  name: string;
  mediaType: "Image" | "File";
  url: string;
  extension: string;
  width: number | null;
  height: number | null;
  bytes: number;
  properties: any;
}

interface Link {
  url: string | null;
  queryString: string | null;
  title: string;
  target: string | null;
  destinationId: string | null;
  destinationType: string | null;
  route: {
    path: string;
    startItem: {
      id: string;
      path: string;
    };
  } | null;
  linkType: "Content" | "External";
}

interface Color {
  contentType: "color";
  name: string;
  createDate: string;
  updateDate: string;
  route: {
    path: string;
    startItem: {
      id: string;
      path: string;
    };
  };
  id: string;
  properties: any;
  colorValue?: string;
}

interface SmallTeaserPodsSectionProps {
  contentBlock: { content: SmallTeaserPodsSection; settings: BlockSettings };
}

interface RenderHeadlineProps {
  item: SmallTeaserPodsItem;
}

interface RenderSubHeadingProps {
  item: SmallTeaserPodsItem;
}

const SmallTeaserPodsSection: React.FC<SmallTeaserPodsSectionProps> = ({
  contentBlock: { content, settings },
}) => {
  const {
    columns,
    items,
    heading,
    bottomText,
    headingFont,
    headingFontSize,
    headingTextAlignment,
    backgroundColor,
  } = content.properties;

  const columnsClass = getColumnsClass(columns);
  const columnNumber = parseInt(columns.split(" ")[0]);
  let cropAlias = `Pods Image ${columnNumber} Column`;
  let imageHeight: number | null = null;

  if (columns?.includes("Small")) {
    cropAlias += " Small";
  }

  if (columnNumber >= 3) {
    imageHeight = 200;
  }

  const sectionStyles: { [key: string]: string } = {};

  if (backgroundColor) {
    const bgColor = backgroundColor.colorValue;
    sectionStyles["background"] = bgColor || "";
  }

  const sectionStyle =
    Object.keys(sectionStyles).length > 0 ? sectionStyles : {};

  const renderItem = (item: SmallTeaserPodsItem) => {
    const { link, textPosition, border, disableZoomIn, button } =
      item.properties;

    const noZoomClass = disableZoomIn ? "no-zoom" : "";
    const borderedClass =
      border && !textPosition?.includes("Text within the image")
        ? "pods__item--bordered"
        : "";

    return (
      <li
        className={`pods__item ${noZoomClass} ${borderedClass}`}
        key={item.id}
      >
        {link && !button ? (
          <Link
            href={link[0].url || (link[0].route && link[0].route.path) || ""}
            target={link[0].target || "_self"}
          >
            {renderItemContent(item, cropAlias, imageHeight)}
          </Link>
        ) : (
          renderItemContent(item, cropAlias, imageHeight)
        )}
      </li>
    );
  };

  const renderItemContent = (
    item: SmallTeaserPodsItem,
    cropAlias: string,
    imageHeight: number | null
  ) => {
    const {
      image,
      image2,
      headline,
      text,
      textPosition,
      subHeadingOnTop,
      image1Title,
      image2Title,
      textWithInImageVerticalPosition,
      button,
      buttonText,
      buttonColor,
      buttonColorHover,
      link,
    } = item.properties;

    const textPositionClass =
      textPosition === "Text above the image"
        ? "content__top"
        : textPosition?.includes("Text within the image")
        ? "content__mid"
        : "";

    const onlyHeadlinesWithinTheImage = textPosition?.includes(
      "Headlines within the image"
    );
    const pullLeftClass = textPosition?.includes("Left Align")
      ? "pull-left"
      : "";
    const bottomTextPosition =
      textWithInImageVerticalPosition === "Bottom" ? "bottom-align" : null;

    return (
      <div className={`pods__item--wrapper ${textPositionClass}`}>
        <div className="pods__image">
          <picture>
            <Image
              src={image[0].url}
              alt={image1Title || "Image"}
              style={{
                width: "100%",
                height: "auto",
              }}
              width={image[0].width || 800}
              height={image[0].height || 600}
              placeholder="blur"
              blurDataURL={optimizedImage(image[0].url)}
              loading="eager"
            />
          </picture>

          {onlyHeadlinesWithinTheImage && (
            <div
              className={`pods__image-title ${pullLeftClass} ${bottomTextPosition}`}
            >
              {subHeadingOnTop && <RenderSubHeading item={item} />}
              {headline && <RenderHeadline item={item} />}
              {!subHeadingOnTop && <RenderSubHeading item={item} />}
            </div>
          )}
        </div>

        <div className={`pods__text ${pullLeftClass}`}>
          {!onlyHeadlinesWithinTheImage && (
            <>
              {subHeadingOnTop && <RenderSubHeading item={item} />}
              {headline && <RenderHeadline item={item} />}
              {!subHeadingOnTop && <RenderSubHeading item={item} />}
            </>
          )}

          {image2 && (
            <picture>
              <Image
                src={image2[0].url}
                alt={image2Title || "Secondary Image"}
                style={{
                  width: "100%",
                  height: "auto",
                }}
                width={image2[0].width || 100}
                height={image2[0].height || 100}
                quality={50} // Lower quality for secondary images
                loading="eager"
                placeholder="blur"
                blurDataURL={optimizedImage(image2[0].url)}
              />
            </picture>
          )}

          <div dangerouslySetInnerHTML={{ __html: text?.markup || "" }} />

          {button && link && link.length > 0 && (
            <Link
              href={link[0].url || link[0].route?.path || ""}
              target={link[0].target || "_self"}
              className="button custom-hover-button"
              tabIndex={-1}
              style={{
                background: buttonColor?.colorValue || "",
                boxShadow: `0 2px 0 ${buttonColor?.colorValue}`,
              }}
              id={`custom_button_${item.id.substring(0, 6)}`}
              data-color={buttonColor?.colorValue}
              data-hover={buttonColorHover?.colorValue}
            >
              {buttonText}
            </Link>
          )}
        </div>
      </div>
    );
  };
  const RenderHeadline: React.FC<RenderHeadlineProps> = ({ item }) => {
    const { headline, headlineFont, textColor, headlineFontSize } =
      item.properties;

    const headingStyles = {
      color: textColor?.colorValue || "",
      textShadow: "none",
    };

    const classNames = `heading ${getFontClassName(
      headlineFont
    )} ${getFontSizeClassName(headlineFontSize)}`;
    return (
      <p className={classNames} style={headingStyles}>
        {headline}
      </p>
    );
  };

  const RenderSubHeading: React.FC<RenderSubHeadingProps> = ({ item }) => {
    const {
      subHeading,
      subHeadingFont,
      subHeadingTextColor,
      subHeadingFontSize,
      subHeadingOnTop,
    } = item.properties;

    const subHeadingStyles = subHeadingTextColor
      ? {
          style: {
            color: subHeadingTextColor?.colorValue || "",
            textShadow: "none",
          },
        }
      : {};

    const classNames = `${
      subHeadingOnTop ? "label" : "subheading"
    } ${getFontClassName(subHeadingFont)} ${getFontSizeClassName(
      subHeadingFontSize
    )}`;

    return (
      <p className={classNames} {...subHeadingStyles}>
        {subHeading}
      </p>
    );
  };

  return (
    <section
      id={settings.properties.anchorName}
      className={`section__smallteaserpods ${generateBlockClassNames(
        settings.properties
      )} ${settings.properties.customCssClass}`}
      {...sectionStyle}
    >
      <div className="container">
        <div className="row">
          {heading && (
            <div
              className={`top-heading ${getFontClassName(
                headingFont || ""
              )} ${getFontSizeClassName(headingFontSize || "")} ${getClassName(
                headingTextAlignment || ""
              )}`}
            >
              {heading}
            </div>
          )}

          <ul className={`pods__lists ${columnsClass}`}>
            {items.items.map((item) => renderItem(item.content))}
          </ul>

          {bottomText && (
            <article
              className="container"
              dangerouslySetInnerHTML={{ __html: bottomText }}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default SmallTeaserPodsSection;
const getColumnsClass = (columns: string) => {
  switch (columns) {
    case "1 Column (Big Image)":
      return "pods__lists--1";
    case "1 Column (Small Image)":
      return "pods__lists--1 lists__1--small";
    case "2 Columns (Big Image)":
      return "pods__lists--2";
    case "2 Columns (Small Image)":
      return "pods__lists--2 lists__2--small";
    case "3 Columns":
      return "pods__lists--3";
    case "4 Columns":
      return "pods__lists--4";
    default:
      return "";
  }
};
