"use client";

import { FilterProvider } from "@/lib/context/FilterContext";
import React, { useMemo, useState } from "react";
import { useLodging } from "@/lib/context/LodgeListingContext";
import { useSearchParams } from "next/navigation";
import { parseDate } from "@/utils/dateHelper";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import dynamic from "next/dynamic";

const AdvancedFilter = dynamic(() => import("./AdvancedFilter"));
const HouseNumberSearch = dynamic(() => import("./HouseNumberSearch"));
const SearchBar = dynamic(() => import("./search-bar"));

type SeachFilterProps = {
  anchorName?: string;
  customCssClass?: string;
  withFilter?: boolean;
};

const SearchFilter: React.FC<SeachFilterProps> = ({
  anchorName,
  customCssClass,
  withFilter,
}) => {
  // advanced filter display status
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  // house number search display status
  const [showHouseNumberSearch, setShowHouseNumberSearch] = useState(false);

  const searchParams = useSearchParams();

  const { totalItems } = useLodging();

  const duration = searchParams.get("duration") || "";

  const startDate = searchParams.get("startdate") || "";

  const date = useMemo(() => {
    const date = parseDate(startDate);
    if (!date) return "";
    return format(date, "dd. MMM yyyy", { locale: de });
  }, [startDate]);

  return (
    <FilterProvider>
      <div
        className={`${customCssClass || ""} cottage-search ${
          withFilter && "with-filter"
        }  ${showAdvancedFilter ? "extended" : ""}`}
        id={anchorName || ""}
      >
        <div className="container">
          <div id="service" className="collapse">
            <div className={`resultbar ${!withFilter && "d-none"}`}>
              <div>
                {totalItems || ""} FERIENHÄUSER
                <span className="small">
                  {duration} Tage mit Anreise am {date}
                </span>
              </div>
            </div>

            <SearchBar withFilter={withFilter || false} />
            <AdvancedFilter
              show={showAdvancedFilter}
              setShow={setShowAdvancedFilter}
              showHouseNumberSearch={showHouseNumberSearch}
              setShowHouseNumberSearch={setShowHouseNumberSearch}
              withFilter={withFilter || false}
            />
          </div>
        </div>
      </div>
      <HouseNumberSearch
        show={showHouseNumberSearch}
        setShow={setShowHouseNumberSearch}
      />
    </FilterProvider>
  );
};

export default SearchFilter;
