// types.ts
export interface Facility {
  name: string;
  iconClass: string;
}

export interface Image {
  altText: string;
  url: string;
}

export interface Location {
  name: string;
  mapImageUrl: string;
  label: string;
}

export interface Lodging {
  id: number;
  apiId: number;
  apiName: string | null;
  url: string;
  lodgingName: string;
  name: string;
  address: string;
  priceValue: number;
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
  bookingOptionId: string | null;
  isFavorite: boolean;
  arrivalDeparture: string;
  isFjord: boolean;
  promoCssClass: string;
  arrivalDepature: string;
}

export interface LodgingApiResponse {
  logs: any[];
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  queryEllapsedMilliseconds: number;
  mappingEllapsedMilliseconds: number;
  items: Lodging[];
}
