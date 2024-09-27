import { BlockSettings } from "@/type/content";
import {
  generateBlockClassNames,
  getFontClassName,
  getFontSizeClassName,
} from "@/utils/fns";

interface JavascriptSectionProps {
  contentBlock: {
    content: {
      contentType: string;
      id: string;
      properties: {
        heading: string;
        javascriptCode: string;
        headingFormat: string;
        headingFont: string;
        headingFontSize: string;
      };
    };
    settings: BlockSettings;
  };
}

const JavascriptSection: React.FC<JavascriptSectionProps> = ({
  contentBlock,
}) => {
  const { content, settings } = contentBlock;
  const { heading, javascriptCode, headingFont, headingFontSize } =
    content.properties;

  const nonceHelper = () => {
    // Implement your logic to get the nonce value
    return "";
  };

  const renderHeading = () => {
    if (!heading) return null;

    const className = `${getFontClassName(headingFont)} ${getFontSizeClassName(
      headingFontSize
    )}`;

    return <h2 className={`heading ${className}`}>{heading}</h2>;
  };

  const renderJavascriptCode = () => {
    const nonceAttribute = `nonce="${nonceHelper()}"`;
    const modifiedJavascriptCode = javascriptCode.replace(
      "[nonce-here]",
      nonceAttribute
    );

    return <div dangerouslySetInnerHTML={{ __html: modifiedJavascriptCode }} />;
  };

  return (
    <section
      id={settings.properties.anchorName}
      className={`section section__javascript ${generateBlockClassNames(
        settings.properties
      )} ${settings.properties.customCssClass}`}
    >
      <div className="container">
        {renderHeading()}
        {renderJavascriptCode()}
      </div>
    </section>
  );
};

export default JavascriptSection;
