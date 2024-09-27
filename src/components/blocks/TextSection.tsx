import { BlockSettingsProperties } from "@/type/content";
import { generateBlockClassNames } from "@/utils/fns";
import GridBlock from "../shared/GridBlock";

interface TextSectionProps {
  contentBlock: {
    content: {
      properties: {
        mainText: any;
        backgroundcolor: string | null;
      };
    };
    settings: {
      properties: BlockSettingsProperties;
    };
  };
}

const TextSection: React.FC<TextSectionProps> = ({ contentBlock }) => {
  const { content, settings } = contentBlock;
  const { backgroundcolor, mainText } = content.properties;
  const { anchorName, customCssClass } = settings.properties;

  const sectionStyles: { [key: string]: string } = {};

  if (backgroundcolor) {
    sectionStyles.backgroundColor = backgroundcolor;
  }

  return (
    <section
      id={anchorName}
      className={`${customCssClass} ${generateBlockClassNames(
        settings.properties
      )} section__text section__typography`}
      {...(sectionStyles && { style: sectionStyles })}
    >
      <div className="container">
        <div className="row no-gutters">
          <div className="section__text--content">
            <GridBlock model={mainText} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TextSection;
