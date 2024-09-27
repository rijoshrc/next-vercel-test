import CheckboxesSection from "@/components/blocks/CheckboxesSection";
import DividerSection from "@/components/blocks/DividerSection";
import FeaturesSection from "@/components/blocks/FeaturesSection";
import HeroImageSection from "@/components/blocks/HeroImageSection";
import ImageWithTextSection from "@/components/blocks/ImageWithTextSection";
import JavascriptSection from "@/components/blocks/JavascriptSection";
import PromoCardsSection from "@/components/blocks/PromoCardsSection";
import SearchBarSection from "@/components/blocks/SearchBarSection";
import SmallTeaserPodsSection from "@/components/blocks/SmallTeaserPodsSection";
import TextSection from "@/components/blocks/TextSection";
import SectionLoader from "@/components/compound/SectionLoader";

import dynamic from "next/dynamic";

const AccordionSection = dynamic(
  () => import("@/components/blocks/AccordionSection"),
  { ssr: false, loading: () => <SectionLoader /> }
);
const BlogFeaturedVariationSection = dynamic(
  () => import("@/components/blocks/BlogFeaturedVariationSection"),
  { ssr: false, loading: () => <SectionLoader /> }
);

const HeroCarousalSection = dynamic(
  () => import("@/components/blocks/HeroCarousalSection"),
  { ssr: false, loading: () => <SectionLoader /> }
);

const SearchHouseSection = dynamic(
  () => import("@/components/blocks/SearchHouseSection"),
  { ssr: false }
);

const FormSection = dynamic(() => import("@/components/blocks/FormSection"), {
  ssr: false,
});

// const TextSectionBlock = dynamic(
//   () => import("@/components/blocks/TextSectionBlock")
// );

import { ContentBlock } from "@/type/content";

type ContentBlockMappingProps = {
  contentBlock: ContentBlock;
  parentNodeId: number;
};

type MapObj = {
  [key: string]: any;
};

const NullComp = () => <></>;

const blockMapObj: MapObj = {
  heroCarouselSection: HeroCarousalSection,
  heroImageSection: HeroImageSection,
  searchBarSection: SearchBarSection,
  // textSectionBlock: TextSectionBlock,
  smallTeaserPodsSection: SmallTeaserPodsSection,
  searchHouseSection: SearchHouseSection,
  imageWithTextSection: ImageWithTextSection,
  dividerSection: DividerSection,
  blogFeaturedVariationSection: BlogFeaturedVariationSection,
  featuresSection: FeaturesSection,
  javascriptSection: JavascriptSection,
  accordionSection: AccordionSection,
  promoCardsSection: PromoCardsSection,
  checkboxesSection: CheckboxesSection,
  formSection: FormSection,
  textSection: TextSection,
};

const ContentBlockMapping: React.FC<ContentBlockMappingProps> = ({
  contentBlock,
  parentNodeId,
}) => {
  const contentType = contentBlock?.content?.contentType;
  const Component = blockMapObj[contentType] || NullComp;
  return <Component contentBlock={contentBlock} parentNodeId={parentNodeId} />;
};

export default ContentBlockMapping;
