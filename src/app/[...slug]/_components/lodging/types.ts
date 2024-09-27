import { Option } from "@/lib/context/filterTypes";

export interface MainText {
  markup: string;
  blocks: any[];
}

export interface AdditionalContentProperties {
  title: string;
  mainText: MainText;
  headingTag: string | null;
}

export interface AdditionalContent {
  contentType: string;
  id: string;
  properties: AdditionalContentProperties;
}

export interface LodgingPageProps {
  contentType: string;
  name: string;
  createDate: string;
  updateDate: string;
  route: {
    path: string;
    startItem: {
      id: string;
      path: string;
    };
  };
  id: string;
  nodeId: number;
  bookingAgencyPhone: string;
  bookingAgencyName: string;
  properties: {
    headerScripts: string | null;
    footerScripts: string | null;
    customBodyClass: string | null;
    redirectToPage: string | null;
    metaTitle: string | null;
    metaDescription: string | null;
    metaOgImage: string | null;
    metaNoIndex: boolean | null;
    hideFromSitemap: boolean | null;
    title: string;
    titleOverride: string | null;
    summary: string;
    summaryOverride: string | null;
    descriptionHeading: string | null;
    description: string;
    descriptionOverride: string | null;
    images: Image[];
    rating: string;
    additionalContent: AdditionalContent[] | null;
    hideFromSearch: boolean | null;
    sort: number;
    lodgingName: string;
    apiId: number;
    apiName: string;
    address1: string;
    address2: string | null;
    city: string;
    postalCode: string;
    country: string;
    latitude: string;
    longitude: string;
    maxPets: number;
    bedrooms: number;
    bathrooms: number;
    distToCoast: number;
    locationId: number;
    maxPerson: number;
    houseArea: number;
    location: string;
    facilities: string;
    additionalCostWaterLabel: string | null;
    additionalCostWaterValue: string | null;
    additionalCostElectricityLabel: string | null;
    additionalCostElectricityValue: string | null;
  };
  facilities: Facility[];
  facilitiesFromFilter: FacilitiesFromFilter[];
  cultures: Record<string, unknown>;
  serviceInformationText: string;
  attractions: string[];
  categoryAverageRatings: CategoryAverageRatings;
  categoryRatings: CategoryRating[];
  comments: Comment[];
  youtubeEmbedUrl: string;
  ratingStarValue: number;
  durationId: string;
  personId: string;
  petsId: string;
  startDateValue: string;
  enableInformationSection: boolean;
  enableCalendarSection: boolean;
  phoneNumber: string;
  pets: Option[];
  durations: Option[];
  persons: Option[];
}

export type CategoryAverageRatings = {
  holidayHomeAverageRating: number;
  propertyAverageRating: number;
  ratingValue: number;
  ratingsCount: number;
  vacationAreaAverageRating: number;
};

export type CategoryRating = {
  holidayHomeRatingCount: number;
  propertyRatingCount: number;
  ratingValue: number;
  vacationAreaRatingCount: number;
};

export type Comment = {
  author: string;
  canEdit: boolean;
  comment: string;
  date: string;
  holidayHomeRating: number;
  icon: string;
  id: number;
  lodgeId: string;
  nodeId: number;
  propertyRating: number;
  readableDate: string;
  vacationAreaRating: number;
};

export type FacilitiesFromFilter = {
  iconClassName: string;
  name: string;
};

export interface Image {
  id: string;
  name: string;
  url: string;
  crops: Crop[];
  height: number;
  width: number;
}

export interface Crop {
  alias: string;
  width: number;
  height: number;
}

export interface Facility {
  apiId: number;
  displayValue: string;
  frontendDisplay: string;
  group: string;
  groupApiId: number;
  groupHideOnPrint: boolean;
  groupHideOnWeb: boolean;
  groupSortNumber: number;
  hidden: boolean;
  hideOnPrint: boolean;
  hideOnWeb: boolean;
  sortNumber: number;
  title: string;
  umbracoId: number;
  unitType: string;
  unitTypeDisplay: string;
  value: string;
}

export type BookingFilter = {
  startdate: string;
  duration: string;
  person: string;
  pets: string;
};
