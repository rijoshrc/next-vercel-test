import { BlockSettingsProperties } from "@/type/content";
import { ImageType } from "@/type/media";
import { generateBlockClassNames } from "@/utils/fns";
import Image from "next/image";

interface TextSectionBlockProps {
  contentBlock: {
    content: {
      properties: {
        mainText: {
          items: any[];
        };
        backgroundcolor: string | null;
      };
    };
    settings: {
      properties: BlockSettingsProperties;
    };
  };
}

type GridObjectWithRTE = {
  rowSpan: number;
  columnSpan: number;
  areaGridColumns: number;
  areas: any[];
  content: any;
  settings: any | null;
};

type GridObjectWithImage = {
  rowSpan: number;
  columnSpan: number;
  areaGridColumns: number;
  areas: any[];
  content: any;
  settings: any | null;
};

const TextSectionBlock: React.FC<TextSectionBlockProps> = ({
  contentBlock,
}) => {
  const content = contentBlock?.content;
  const settings = contentBlock?.settings;
  const backgroundcolor = content?.properties?.backgroundcolor;
  const mainText = content?.properties?.mainText;

  const sectionStyles: { [key: string]: string } = {};

  if (backgroundcolor) {
    sectionStyles.backgroundColor = backgroundcolor;
  }

  return (
    <section
      id={settings?.properties?.anchorName}
      className={`${
        settings?.properties?.customCssClass
      } ${generateBlockClassNames(
        settings?.properties
      )} section__text section__typography`}
      {...(sectionStyles && { style: sectionStyles })}
    >
      <div className="container">
        <div className="row no-gutters">
          <div className="section__text--content">
            <div className="umb-grid">
              <div className="grid-section">
                <div className="container">
                  {mainText?.items?.map((item, itemIndex) => (
                    <TextImageBlock key={itemIndex} item={item} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

type TextImageBlockProps = {
  item: GridObjectWithImage | GridObjectWithRTE;
};

const TextImageBlock: React.FC<TextImageBlockProps> = ({ item }) => {
  const properties = item?.content?.properties;

  if (properties?.richText) {
    return <RichTextControl richText={properties.richText} />;
  }

  if (properties?.image) {
    const images = properties.image as ImageType[];

    return (
      <>
        {images.map((image, index) => (
          <Image
            key={index}
            src={image.url}
            alt={image.name}
            height={1110}
            width={1110}
            style={{
              width: "100%",
              height: "auto",
              objectFit: "cover",
            }}
            fetchPriority={index === 0 ? "high" : "low"}
          />
        ))}
      </>
    );
  }

  return null;
};

interface ControlProps {
  richText: {
    markup: string;
  };
}

const RichTextControl: React.FC<ControlProps> = ({ richText }) => {
  if (!richText?.markup) {
    return null;
  }

  return <div dangerouslySetInnerHTML={{ __html: richText.markup }} />;
};

export default TextSectionBlock;
