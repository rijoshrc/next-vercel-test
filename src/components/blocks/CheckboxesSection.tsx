import { BlockSettings } from "@/type/content";
import React from "react";

interface CheckboxesSectionProps {
  contentBlock: {
    content: {
      contentType: string;
      id: string;
      properties: {
        checkedLabels: string[];
        display: string | null;
      };
    };
    settings: BlockSettings;
  };
}

const CheckboxesSection: React.FC<CheckboxesSectionProps> = ({
  contentBlock,
}) => {
  const { content, settings } = contentBlock;
  const { checkedLabels, display } = content.properties;

  if (!checkedLabels || checkedLabels.length === 0) {
    return null;
  }

  const isVertical = display === "Vertical";
  const isDefault =
    !display || display === "Horizontal - Fixed Width (Default)";

  return (
    <section
      id={settings.properties.anchorName}
      className={`section__checkboxes ${settings.properties.customCssClass} ${
        isVertical ? "section__checkboxes--vertical" : ""
      }`}
    >
      <div className="container">
        <div className="row">
          {isDefault
            ? checkedLabels.map((label, index) => (
                <div className="col-lg-3 col-md-6" key={index}>
                  <div className="feature-label">
                    <i className="icon-checkbox"></i>
                    <div>{label}</div>
                  </div>
                </div>
              ))
            : checkedLabels.map((label, index) => (
                <div className="feature-label" key={index}>
                  <i className="icon-checkbox"></i>
                  <div>{label}</div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default CheckboxesSection;
