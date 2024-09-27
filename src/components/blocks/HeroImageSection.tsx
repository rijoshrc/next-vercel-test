import { BlockSettings } from "@/type/content";
import { ImageType } from "@/type/media";
import { generateBlockClassNames } from "@/utils/fns";
import Image from "next/image";
import React, { CSSProperties } from "react";

interface HeroImageSection {
  contentType: string;
  id: string;
  properties: {
    heading: string | null;
    image: ImageType[];
    font: string | null;
    headingFontSize: string | null;
    textColor: string | null;
  };
}

interface HeroImageSectionProps {
  contentBlock: {
    content: HeroImageSection;
    settings: BlockSettings;
  };
}

const HeroImageSection: React.FC<HeroImageSectionProps> = ({
  contentBlock,
}) => {
  const { content, settings } = contentBlock;
  const { heading, image, font, headingFontSize, textColor } =
    content.properties;
  const backgroundImageUrl = image.length > 0 ? image[0].url : "";
  const colorStyle: CSSProperties = textColor ? { color: textColor } : {};

  return (
    <section
      id={settings.properties.anchorName}
      className={`${
        settings.properties.customCssClass
      } ${generateBlockClassNames(
        contentBlock.settings.properties
      )} section__hero`}
    >
      <div
        className="hero__wrapper"
        // style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      >
        <Image
          src={backgroundImageUrl}
          alt={"Hero image"}
          fill
          priority
          fetchPriority="high"
          style={{ objectFit: "cover" }}
        />
        {heading && (
          <div className="container">
            <p
              className={`heading ${font ? `font-${font}` : ""} ${
                headingFontSize ? `font-size-${headingFontSize}` : ""
              }`}
              style={colorStyle}
            >
              {heading}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroImageSection;
