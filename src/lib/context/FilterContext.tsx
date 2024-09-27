"use client";
import lodginApi from "@/constants/lodgingApi"; // Adjust the import path as needed
import { formatDate, isToday, parseDate } from "@/utils/dateHelper";
import { URLEncode } from "@/utils/fns";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import {
  FilterAction,
  FilterContextProps,
  FilterOptions,
  FilterState,
} from "./filterTypes";
import { useLodging } from "./LodgeListingContext";
import { getDay } from "date-fns";

// Default filter state
const defaultParams: FilterState = {
  area: "alle-gebiete",
  startdate: null,
  duration: "7",
  persons: "2",
  page: 1,
  itemsperpage: 10,
  aproxy: "true",
  bedrooms: "1",
  bathrooms: "1",
};

// Create the context
const FilterContext = createContext<FilterContextProps | undefined>(undefined);

// Define the reducer
const filterReducer = (
  state: FilterState,
  action: FilterAction
): FilterState => {
  switch (action.type) {
    case "SET_FILTER":
      return {
        ...state,
        [action.key]: action.value,
      };
    case "RESET_FILTERS":
      return { ...defaultParams };
    default:
      return state;
  }
};

// Create a provider component
export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(filterReducer, defaultParams);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [selectedAdvancedFilters, setSelectedAdvancedFilters] =
    useState<number>(0);
  const [advancedFilter, setAdvancedFilter] =
    useState<Record<string, string>>();
  const [filterOptions, setFilterOptions] = useState<FilterOptions>();

  const [dataInit, setDataInit] = useState<boolean>(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const { fetchData } = useLodging();

  useEffect(() => {
    fetchAvailableDates(state.duration);
  }, [state.duration]);

  useEffect(() => {
    if (pathname === "/ferienhaeuser") {
      syncQueryWithState();
    }
  }, [searchParams]);

  useEffect(() => {
    if (pathname !== "/ferienhaeuser" || availableDates.length <= 0) {
      return;
    }

    // if no params
    // update the query params with the default params
    if (searchParams.size === 0) {
      const nextSaturday = findNextSaturday(availableDates);
      const date = nextSaturday || new Date(availableDates[1]);
      updateQuery({
        ...defaultParams,
        startdate: formatDate(date),
      });
      return;
    }

    // if there is any missing params
    // update it with the default params
    if (searchParams.size < 9) {
      let currentParams = {};
      let missingParms = {};
      for (const key in defaultParams) {
        if (!searchParams.has(key)) {
          // @ts-ignore
          missingParms = { ...missingParms, [key]: defaultParams[key] };
        } else {
          // @ts-ignore
          currentParams = { ...currentParams, [key]: searchParams.get(key) };
        }
      }

      updateQuery({
        ...currentParams,
        ...missingParms,
      });
      return;
    }

    // call if not already called
    if (!dataInit) {
      fetchData(searchParams.toString());
      setDataInit(true);
    }
  }, [searchParams, availableDates]);

  useEffect(() => {
    setAdvancedFilterCount(advancedFilter, state);
  }, [advancedFilter, state]);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = useCallback(async () => {
    const response = await fetch(lodginApi.filterOptions);
    const data = await response.json();
    const filterOptions: FilterOptions = {
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      durations: data.durations,
      persons: data.persons,
      pets: data.pets,
      sort: data.sortList,
      facilities: data.facilities,
      inclusions: data.inclusions,
      areas: data.areas,
    };
    setFilterOptions(filterOptions);
  }, []);

  const fetchAvailableDates = useCallback(async (duration: string) => {
    const response = await fetch(
      lodginApi.availableDates + "?duration=" + duration
    );
    const data = await response.json();
    const dates = data.map((date: string) => new Date(date));

    if (dates.length <= 0) return;

    setAvailableDates(dates);

    const nextSaturday = findNextSaturday(dates);

    if (pathname !== "/ferienhaeuser" || !searchParams.has("startdate")) {
      dispatch({
        type: "SET_FILTER",
        key: "startdate",
        value: nextSaturday || new Date(dates[1]),
      });
    }
  }, []);

  const setState = (key: keyof FilterState, value: any) => {
    dispatch({ type: "SET_FILTER", key, value });

    if (pathname !== "/ferienhaeuser") {
      return;
    }

    let currentParams = {};
    searchParams.forEach((value, key) => {
      // @ts-ignore
      currentParams = { ...currentParams, [key]: value };
    });

    if (key === "startdate") {
      const formattedDate = value ? formatDate(value) : "Kein Datum";
      currentParams = { ...currentParams, startdate: formattedDate };
    } else {
      // @ts-ignore
      currentParams = { ...currentParams, [key]: value };
    }

    updateQuery(currentParams);
  };

  const updateQuery = (params: any) => {
    const newUrlParams = URLEncode(params).toString();
    const newUrl = `${pathname}?${newUrlParams}`;
    router.replace(newUrl);

    fetchData(newUrlParams);
    setDataInit(true);
  };

  const syncQueryWithState = () => {
    const date = searchParams.get("startdate");
    const duration = searchParams.get("duration");
    const persons = searchParams.get("persons");
    const pets = searchParams.get("pets");
    const area = searchParams.get("area");

    if (area) {
      dispatch({
        type: "SET_FILTER",
        key: "area",
        value: area,
      });
    } else {
      dispatch({
        type: "SET_FILTER",
        key: "area",
        value: "",
      });
    }

    if (duration) {
      dispatch({
        type: "SET_FILTER",
        key: "duration",
        value: duration,
      });
    }

    if (persons) {
      dispatch({
        type: "SET_FILTER",
        key: "persons",
        value: persons,
      });
    }

    if (date) {
      const dateObject = parseDate(date);
      dispatch({
        type: "SET_FILTER",
        key: "startdate",
        value: dateObject,
      });
    }

    if (pets) {
      dispatch({
        type: "SET_FILTER",
        key: "pets",
        value: pets,
      });
    }

    if (searchParams.has("bathrooms")) {
      dispatch({
        type: "SET_FILTER",
        key: "bathrooms",
        value: searchParams.get("bathrooms") || "1",
      });
    }
    if (searchParams.has("bedrooms")) {
      dispatch({
        type: "SET_FILTER",
        key: "bedrooms",
        value: searchParams.get("bedrooms") || "1",
      });
    }

    if (searchParams.has("distcoast")) {
      setAdvancedFilter((filter) => ({
        ...filter,
        distcoast: searchParams.get("distcoast") || "0",
      }));
    }
    if (searchParams.has("maxprice")) {
      setAdvancedFilter((filter) => ({
        ...filter,
        maxprice: searchParams.get("maxprice") || "0",
      }));
    }
    if (searchParams.has("fac")) {
      setAdvancedFilter((filter) => ({
        ...filter,
        fac: searchParams.get("fac") || "",
      }));
    }
    if (searchParams.has("inclusions")) {
      setAdvancedFilter((filter) => ({
        ...filter,
        inclusions: searchParams.get("inclusions") || "",
      }));
    }
  };

  const setFilter = (key: string, value: string) => {
    let advFilter = { ...advancedFilter, [key]: value };
    setAdvancedFilter(() => ({ ...advFilter }));

    if (pathname !== "/ferienhaeuser") {
      return;
    }

    let currentParams = {} as any;
    searchParams.forEach((value, key) => {
      currentParams = { ...currentParams, [key]: value };
    });

    const updatedQuery = removeEmptyParams({
      ...currentParams,
      [key]: value,
    });

    updateQuery(updatedQuery);
  };

  const removeEmptyParams = (updatedQuery: any): any => {
    if ("fac" in updatedQuery && updatedQuery.fac.trim() === "") {
      delete updatedQuery.fac;
    }
    if ("inclusions" in updatedQuery && updatedQuery.inclusions.trim() === "") {
      delete updatedQuery.inclusions;
    }
    if ("distcoast" in updatedQuery && updatedQuery.distcoast.trim() === "0") {
      delete updatedQuery.distcoast;
    }
    if ("maxprice" in updatedQuery && updatedQuery.maxprice.trim() === "0") {
      delete updatedQuery.maxprice;
    }
    if ("sort" in updatedQuery && updatedQuery.sort.trim() === "") {
      delete updatedQuery.sort;
    }
    return updatedQuery;
  };

  const setAdvancedFilterCount = (advFilter: any, state: any) => {
    let count = 0;

    if (advFilter && "fac" in advFilter && advFilter.fac.trim() !== "") {
      count += advFilter.fac.split(",").length;
    }
    if (
      advFilter &&
      "inclusions" in advFilter &&
      advFilter.inclusions.trim() !== ""
    ) {
      count += advFilter.inclusions.split(",").length;
    }
    if (
      advFilter &&
      "maxprice" in advFilter &&
      advFilter.maxprice.trim() !== "0"
    ) {
      count += 1;
    }
    if (
      advFilter &&
      "distcoast" in advFilter &&
      advFilter.distcoast.trim() !== "0"
    ) {
      count += 1;
    }

    if ("bedrooms" in state && state.bedrooms.trim() !== "1") {
      count += 1;
    }

    if ("bathrooms" in state && state.bathrooms.trim() !== "1") {
      count += 1;
    }

    setSelectedAdvancedFilters(count);
  };

  const handleSubmit = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const startDateStr = state.startdate
      ? (formatDate(state.startdate) as string)
      : "Kein Datum";

    let queryObj: any = {
      area: state.area,
      startdate: startDateStr,
      duration: state.duration || "7",
      persons: state.persons || "2",
      page: "1",
      itemsperpage: "10",
      aproxy: "true",
      bedrooms: state.bedrooms || "1",
      bathrooms: state.bathrooms || "1",
    };

    if (state.pets) {
      queryObj = {
        ...queryObj,
        pets: state.pets,
      };
    }

    if (advancedFilter) {
      queryObj = {
        ...queryObj,
        ...advancedFilter,
      };
    }

    const searchParams = URLEncode(queryObj);

    router.push(`/ferienhaeuser/?${searchParams}`);
  };

  return (
    <FilterContext.Provider
      value={{
        state,
        setState,
        dispatch,
        availableDates,
        setFilter,
        selectedAdvancedFilters,
        advancedFilter,
        filterOptions,
        handleSubmit,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

// Custom hook to use the Filter context
export const useFilterContext = (): FilterContextProps => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilterContext must be used within a FilterProvider");
  }
  return context;
};

// Custom hook to use available dates
export const useAvailableDates = (): Date[] => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useAvailableDates must be used within a FilterProvider");
  }
  return context.availableDates;
};

const findNextSaturday = (dates: Date[]) => {
  return dates.find((date) => getDay(date) === 6); // 6 is Saturday
};
