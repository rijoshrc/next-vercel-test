import { BlockSettingsProperties } from "@/type/content";
import dynamic from "next/dynamic";
const SearchFilter = dynamic(() => import("../compound/search-filter"), {
  ssr: false,
});

type SearchBarSectionProps = {
  contentBlock: {
    content: {};
    settings: {
      properties: BlockSettingsProperties;
    };
  };
};

const SearchBarSection: React.FC<SearchBarSectionProps> = ({
  contentBlock,
}) => {
  const { settings } = contentBlock;
  const { anchorName, customCssClass } = settings.properties;

  return (
    <div>
      <SearchFilter anchorName={anchorName} customCssClass={customCssClass} />
    </div>
  );
};

export default SearchBarSection;
