export interface Image {
  imageUrl: string;
  altText: string;
}

export interface Item {
  apiId: number;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
  priceFormmated: string;
  totalPriceFormatted: string;
}

export interface BookingOption {
  id: string;
  apiReference: string;
  lodgingUnitTypeId: number;
  status: string;
  lodgingId: number;
  boardTypeId: number;
  isRegularWeek: boolean;
  languageId: number;
  adults: number;
  children: number;
  infants: number;
  pets: number;
  hasDiscount: boolean;
  discountInternalName: string | null;
  discountTags: string | null;
  tags: string | null;
  partlyWithoutDiscountTags: string | null;
  normalPrice: number;
  price: number;
  currency: string;
  arrival: string;
  departure: string;
  duration: number;
  priority: string;
  isAvailable: boolean;
  winterRuleWarning: boolean;
  itemPrices: any[];
  daysWithDiscount: number;
  daysWithAddition: number;
  noDeposit: boolean;
  inclusions: string;
}

export interface Booking {
  entity: {
    key: string;
    lodgingPageId: number;
    lodgingApiId: number;
    adults: number;
    children: number;
    pets: number;
    duration: number;
    arrival: string;
    departure: string;
    customerNotes: string | null;
    firstName: string;
    lastName: string;
    email: string;
    isoCountry: string;
    city: string;
    street: string;
    postCode: string;
    whereDidYouHearAboutUsAnswer: string | null;
    phone: string;
    bookingOptionJsonData: string;
    requiredItemsJsonData: string;
    selectedItemsJsonData: string;
    selectedInsuranceJsonData: string;
    totalPrice: number;
    isTest: boolean;
    dateCreatedUtc: string;
    emailAdminStatus: boolean;
    emailCustomerStatus: boolean;
    apiStatus: boolean;
    apiResponse: string;
    couponMessages: string[];
    lodgingName: string;
    subscribedToNewsletter: boolean;
    apiUrl: string;
    apiPayloadData: string;
    createdByAdmin: boolean;
    id: number;
  };
  bookingOption: BookingOption;
  extras: any[];
  insurance: any;
  requiredItems: Item[];
  totalPrice: string;
  couponMessages: string[];
  maxPets: number;
  lodgingName: string;
  address1: string;
  address2: string;
  apiName: string;
  lodgingPageUrl: string;
  maxPerson: number;
  images: Image[];
}

export interface Route {
  path: string;
  startItem: {
    id: string;
    path: string;
  };
}

export interface Properties {
  headerScripts: string | null;
  footerScripts: string | null;
  customBodyClass: string | null;
  redirectToPage: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  metaOgImage: string | null;
  metaNoIndex: boolean;
  hideFromSitemap: boolean;
}

export interface Cultures {
  // Add culture properties here if needed
}

export interface ReceiptProps {
  contentType: string;
  nodeId: number;
  booking: Booking;
  bookingAgencyName: string;
  name: string;
  createDate: string;
  updateDate: string;
  route: Route;
  id: string;
  properties: Properties;
  cultures: Cultures;
}
