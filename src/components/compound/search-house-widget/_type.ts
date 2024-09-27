export interface Facility {
  name: string;
  iconClass: string;
}

export interface Location {
  name: string;
  mapImageUrl: string;
  label: string;
}

export interface Image {
  altText: string;
  url: string;
}

export interface House {
  id: number;
  url: string;
  lodgingName: string;
  name: string;
  address: string;
  price: string;
  normalPrice: string;
  date: string;
  person: number;
  duration: number;
  pets: number;
  bedrooms: number;
  bathrooms: number;
  houseArea: string;
  distToCoast: number;
  facilities: Facility[];
  location: Location;
  discount: string;
  promo: string;
  rating: number;
  ratingDisplay: string;
  lat: string;
  lon: string;
  images: Image[];
  hasDiscount: boolean;
  day: string;
  noDeposit: boolean;
  locationName: string;
  bookingOptionId: null;
  isFavorite: boolean;
  arrivalDepature: string;
  isFjord: boolean;
  promoCssClass: string;
}

export interface SearchHouseResponse {
  elementId: string;
  additionalClass: string;
  heading: string;
  headingFormat: string;
  headingFont: string;
  headingFontSize: string;
  buttonUrl: string;
  buttonText: string | null;
  displayButton: boolean;
  moreHousesButtonUrl: string;
  moreHousesButtonName: string;
  moreHousesButtonColor: string;
  moreHousesButtonTextColor: string;
  houses: House[];
}
