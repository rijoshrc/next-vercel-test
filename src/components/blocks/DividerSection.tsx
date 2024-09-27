import { BlockSettings } from "@/type/content";
import { generateBlockClassNames } from "@/utils/fns";
import React from "react";

interface DividerSectionProps {
  contentBlock: {
    content: {
      contentType: "dividerSection";
      id: string;
      properties: {
        color: string | null;
      };
    };
    settings: BlockSettings;
  };
}

const DividerSection: React.FC<DividerSectionProps> = ({
  contentBlock: { content, settings },
}) => {
  const { color } = content.properties;
  const backgroundColor = color ? { backgroundColor: color } : {};

  return (
    <section
      id={settings.properties.anchorName}
      className={`${
        settings.properties.customCssClass
      } ${generateBlockClassNames(settings.properties)} section__divider`}
    >
      <div className="container">
        <div className="divider" style={backgroundColor} />
      </div>
    </section>
  );
};

export default DividerSection;
