export interface Image {
  imageUrl: string;
  altText: string;
}

export interface Country {
  disabled: boolean;
  group: null;
  selected: boolean;
  text: string;
  value: string;
}

export interface WhereDidYouHearAboutUs {
  disabled: boolean;
  group: null;
  selected: boolean;
  text: string;
  value: string;
}

export interface Itp {
  iid: number;
  pri: number;
  cur: string;
  ism: boolean;
  min: number;
  max: number;
}

export interface BookingOption {
  api: string;
  unid: number;
  sta: string;
  id: number;
  bid: number;
  irw: boolean;
  lid: number;
  adu: number;
  chi: number;
  inf: number;
  pet: number;
  hd: boolean;
  din: null;
  dts: null;
  tag: null;
  pwdt: null;
  npri: number;
  pri: number;
  cur: string;
  arv: string;
  dpt: string;
  dur: number;
  prio: string;
  avail: boolean;
  wrw: boolean;
  itp: Itp[];
  dwd: number;
  dwa: number;
  nod: boolean;
  inc: number;
}

export interface BookingFormType {
  bookingOption: BookingOption;
  lodgingId: number;
  adults: number;
  children: number;
  pets: number;
  duration: number;
  startDate: string;
  firstName: null;
  lastName: null;
  street: null;
  postCode: null;
  city: null;
  country: null;
  countryList: Country[];
  phone: null;
  email: null;
  whereDidYouHearAboutUs: null;
  whereDidYouHearAboutUsList: WhereDidYouHearAboutUs[];
  subscribedToNewsletter: boolean;
  notes: null;
  acceptTerms: boolean;
  acceptTermsText: string;
  acceptPolicy: boolean;
  acceptPolicyText: string;
  couponIds: null;
  availableDate: null;
  profileName: null;
  profileUrl: null;
  profilePhone: null;
  bookingAgencyName: string;
  images: Image[];
  address1: string;
  maxPerson: number;
  maxPets: number;
}

export interface RequiredItem {
  key: string;
  value: string;
}

export interface Extra {
  apiId: number;
  umbId: number;
  name: string;
  price: string;
  valueType: string;
  unit: string;
  chargeType: string;
  type: string;
  maxQuantity: number;
  minQuantity: number;
}

export interface InsuranceOption {
  apiId: number;
  umbId: number;
  name: string;
  price: string;
  valueType: string;
  unit: string;
  chargeType: string;
  type: string;
  maxQuantity: number;
  minQuantity: number;
}

export interface BookingItems {
  requiredItems: RequiredItem[];
  totalPrice: string;
  extras: Extra[];
  insuranceOptions: InsuranceOption[];
}

// booking form state
export type FormState = {
  Adults: string;
  Children: string;
  Pets: string;
  SubscribedToNewsletter: boolean;
  AcceptTerms: boolean;
  AcceptPolicy: boolean;
  Notes: string;
  rabattcode?: string;
  FirstName: string;
  LastName: string;
  Street: string;
  PostCode: string;
  City: string;
  Country: string;
  Phone: string;
  Email: string;
  WhereDidYouHearAboutUs: string;
  insurance: string;
};
