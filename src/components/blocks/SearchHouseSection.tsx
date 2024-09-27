import lodginApi from "@/constants/lodgingApi";
import { BlockSettings } from "@/type/content";
import { generateBlockClassNames } from "@/utils/fns";
import dynamic from "next/dynamic";
import React from "react";
import { SearchHouseResponse } from "../compound/search-house-widget/_type";

const LazyLoadSection = dynamic(() => import("../hoc/LazyLoadSection.server"));
const SectionLoader = dynamic(() => import("../compound/SectionLoader"));
const SearchHouseWidget = dynamic(
  () => import("../compound/search-house-widget"),
  { ssr: false, loading: () => <SectionLoader /> }
);

// Existing props interface
interface SearchHouseSectionProps {
  contentBlock: {
    settings: BlockSettings;
    content: {
      properties: {
        distanceToCoast: any;
        days: number | null;
        heading: string;
        numberOfResults: number;
        keywords: any;
        persons: number | null;
        pets: number | null;
        anchorName: string;
        customCssClass: string;
        startDate: string;
        headingFormat: string;
        headingFont: string;
        headingFontSize: string;
        buttonUrl: string;
        buttonText: string;
        displayButton: boolean;
        moreHousesButtonColor: string;
        moreHousesButtonTextColor: string;
        moreHousesButton: {
          url: string | null;
          title: string;
        }[];
        buttonTextColor: string;
        buttonColor: string;
      };
    };
  };
}

const SearchHouseSection: React.FC<SearchHouseSectionProps> = async ({
  contentBlock,
}) => {
  const { settings, content } = contentBlock;

  const response = await fetch(lodginApi.searchHouseWidget, {
    method: "POST",
    body: JSON.stringify({
      AdditionalClass: settings.properties.customCssClass,
      DistanceToCoast: content.properties.distanceToCoast,
      Duration:
        content.properties.days && content.properties.days > 7
          ? content.properties.days
          : 7,
      ElementId: settings.properties.anchorName,
      Heading: content.properties.heading,
      ItemsPerPage: !content.properties.numberOfResults
        ? 5
        : content.properties.numberOfResults,
      Keywords: content.properties.keywords,
      Persons: content.properties.persons,
      Pets: content.properties.pets,
      StartDate: content.properties.startDate,
      ExceptNodeId: 0,
      HeadingFormat: content.properties.headingFormat,
      HeadingFontSize: content.properties.headingFontSize,
      HeadingFont: content.properties.headingFont,
      DisplayButton: content.properties.displayButton,
      MoreHousesButtonUrl:
        content.properties.moreHousesButton?.length > 0
          ? content.properties.moreHousesButton[0].url
          : "",
      MoreHousesButtonName:
        content.properties.moreHousesButton?.length > 0
          ? content.properties.moreHousesButton[0].title
          : "",
      MoreHousesButtonTextColor: content.properties.buttonTextColor + "",
      MoreHousesButtonColor: content.properties.buttonColor + "",
      LocationIds: [],
      FacilityIds: [],
      DiscountIds: [],
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data: SearchHouseResponse = await response.json();

  return (
    <section
      id={data?.elementId}
      className={`section__searchhouse ${generateBlockClassNames(
        settings.properties
      )} `}
    >
      {data && <SearchHouseWidget data={data} />}
    </section>
  );
};

export default function WithLazyLoading(props: SearchHouseSectionProps) {
  return (
    <LazyLoadSection placeholder={<SectionLoader />}>
      <SearchHouseSection {...props} />
    </LazyLoadSection>
  );
}
