export interface FilterState {
  area: string;
  startdate: Date | null;
  duration: string;
  persons?: string;
  page?: number;
  itemsperpage?: number;
  aproxy?: string;
  bedrooms?: string;
  bathrooms?: string;
  pets?: any;
  selectedAdvancedFilters?: string;
}

export type FilterAction =
  | { type: "SET_FILTER"; key: keyof FilterState; value: any }
  | { type: "RESET_FILTERS" };

export interface FilterContextProps {
  state: FilterState;
  setState: (key: keyof FilterState, value: any) => void;
  setFilter: (key: string, value: string) => void;
  dispatch: React.Dispatch<FilterAction>;
  availableDates: Date[];
  selectedAdvancedFilters: number;
  advancedFilter: Record<string, string> | undefined;
  filterOptions: FilterOptions | undefined;
  handleSubmit: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export type Option = {
  disabled: boolean;
  group: string | null;
  selected: boolean;
  text: string;
  value: string;
};

export type FacilityOption = {
  iconClass: string;
  id: string;
  title: string;
  value: string;
};

export type InclusionOption = {
  iconCssClass: string;
  svgCode: string;
  title: string;
  value: string;
};

export interface AreaData {
  id: string;
  title: string;
  parentId: string | null;
  children: AreaData[] | null;
}

export type FilterOptions = {
  bathrooms: Option[];
  bedrooms: Option[];
  durations: Option[];
  persons: Option[];
  pets: Option[];
  sort: Option[];
  facilities: FacilityOption[];
  inclusions: InclusionOption[];
  areas: AreaData[];
};
