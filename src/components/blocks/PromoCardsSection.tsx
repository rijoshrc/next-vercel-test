import { BlockSettings } from "@/type/content";
import { Link as LinkType } from "@/type/link";
import { ImageType } from "@/type/media";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface PromoCard {
  content: {
    contentType: string;
    id: string;
    properties: {
      image: ImageType[] | null;
      heading: string | null;
      mainText?: {
        markup: string;
        blocks: any[];
      };
      link: LinkType[] | null;
      button: boolean;
      buttonText: string | null;
      buttonColor: string | null;
      buttonColorHover: string | null;
      imageTitle: string | null;
      label: string | null;
    };
  };
}

interface PromoCardsSectionProps {
  contentBlock: {
    content: {
      contentType: string;
      id: string;
      properties: {
        items: { items: PromoCard[] };
        heading: string | null;
        headingFont: string;
        headingFontSize: string;
        smallLayout: boolean;
      };
    };
    settings: BlockSettings;
  };
}

const PromoCardsSection: React.FC<PromoCardsSectionProps> = ({
  contentBlock,
}) => {
  const { content, settings } = contentBlock;
  const { items, heading, headingFont, headingFontSize, smallLayout } =
    content.properties;

  const renderImage = (promoCard: PromoCard) => {
    if (!promoCard.content.properties.image) return null;

    return (
      <div className="offer-img">
        <picture>
          <Image
            src={promoCard.content.properties.image[0].url}
            alt={promoCard.content.properties.heading + " Image"}
            title={promoCard.content.properties.imageTitle || ""}
            height={promoCard.content.properties.image[0].height}
            // style={{ width: "100%" }}
            width={promoCard.content.properties.image[0].width}
          />
        </picture>
      </div>
    );
  };

  const renderButton = (promoCard: PromoCard, additionalClass = "") => {
    if (
      !promoCard.content.properties.button ||
      !promoCard.content.properties.link
    )
      return null;

    const buttonStyle = {
      backgroundColor: promoCard.content.properties.buttonColor || "",
      boxShadow: promoCard.content.properties.buttonColor
        ? `0 2px 0 ${promoCard.content.properties.buttonColor}`
        : "",
    };

    return (
      <Link
        href={promoCard.content.properties.link[0].route.path || ""}
        target={promoCard.content.properties.link[0].target}
        className={`button d-inline-block ${additionalClass} custom-hover-button`}
        style={buttonStyle}
        data-color={promoCard.content.properties.buttonColor}
        data-hover={promoCard.content.properties.buttonColorHover}
      >
        {promoCard.content.properties.buttonText}
      </Link>
    );
  };

  return (
    <section
      id={settings.properties.anchorName}
      className={`section__promocards ${
        smallLayout
          ? "section__promocards--small section__promocards--centeredTitle"
          : ""
      } ${settings.properties.customCssClass}`}
    >
      <div className="container">
        {heading && (
          <h2 className={`${headingFont} ${headingFontSize}`}>{heading}</h2>
        )}
        <div className="offer-row row">
          {items.items.map((item, index) => (
            <div
              key={index}
              className="col-sm-6 col-md-4 title-spacing text-center"
            >
              <div className="offer-wrapper">
                {renderImage(item)}
                <div className="offer-title">
                  {item.content.properties.label && (
                    <span>{item.content.properties.label}</span>
                  )}
                  {item.content.properties.heading && (
                    <h3>{item.content.properties.heading}</h3>
                  )}
                  {item.content.properties.mainText && (
                    <div
                      className="main_text"
                      dangerouslySetInnerHTML={{
                        __html: item.content.properties.mainText?.markup,
                      }}
                    />
                  )}
                </div>
                {renderButton(item, "mt-3")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoCardsSection;
