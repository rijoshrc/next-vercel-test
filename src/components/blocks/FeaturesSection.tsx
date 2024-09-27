import { BlockSettings } from "@/type/content";
import { Link as LinkType } from "@/type/link";
import { ImageType } from "@/type/media";
import { generateBlockClassNames } from "@/utils/fns";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type FeatureItem = {
  content: {
    contentType: string;
    id: string;
    properties: {
      title: string;
      colour: string;
      redirectUrl: LinkType[];
      picture: ImageType[];
    };
  };
  settings: any | null;
};
interface FeaturesSectionProps {
  contentBlock: {
    content: {
      contentType: string;
      id: string;
      properties: {
        features: {
          items: FeatureItem[];
        };
      };
    };
    settings: BlockSettings;
  };
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ contentBlock }) => {
  const { content, settings } = contentBlock;
  const { features } = content.properties;

  return (
    <section
      id={settings.properties.anchorName}
      className={`section__features ${generateBlockClassNames(
        settings.properties
      )} ${settings.properties.customCssClass}`}
    >
      <div className="container">
        <div className="row featurebar">
          {features.items.map((item) => {
            const { title, colour, redirectUrl, picture } =
              item.content.properties;
            const linkUrl = redirectUrl?.[0]?.route.path;
            const linkTarget = redirectUrl?.[0]?.target;
            const linkTitle = redirectUrl?.[0]?.title;

            return (
              <div key={item.content.id} className="col-lg-3 col-md-6">
                {linkUrl ? (
                  <Link
                    href={linkUrl}
                    target={linkTarget || "_self"}
                    title={linkTitle}
                  >
                    <FeatureItem
                      title={title}
                      colour={colour}
                      picture={picture}
                    />
                  </Link>
                ) : (
                  <FeatureItem
                    title={title}
                    colour={colour}
                    picture={picture}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

interface FeatureItemProps {
  title: string;
  colour: string;
  picture: ImageType[];
}

const FeatureItem: React.FC<FeatureItemProps> = ({
  title,
  colour,
  picture,
}) => {
  return (
    <div className="feature" style={{ backgroundColor: colour }}>
      <div className="feature-icon">
        <Image
          className="lazy imgicon loaded"
          height={90}
          width={228}
          src={picture?.[0].url}
          alt={picture?.[0].name}
          title={title}
        />
      </div>
      {title && (
        <div className="feature-item">
          <div>{title}</div>
        </div>
      )}
    </div>
  );
};

export default FeaturesSection;
