import { useFilterContext } from "@/lib/context/FilterContext";
import { formatToCurrency } from "@/utils/fns";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

type AdvancedFilterProps = {
  show: boolean;
  setShow: (show: boolean | ((prev: boolean) => boolean)) => void;
  showHouseNumberSearch: boolean;
  setShowHouseNumberSearch: (
    show: boolean | ((prev: boolean) => boolean)
  ) => void;
  withFilter: boolean;
};

const AdvancedFilter: React.FC<AdvancedFilterProps> = ({
  show,
  setShow,
  showHouseNumberSearch,
  setShowHouseNumberSearch,
  withFilter,
}) => {
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(show);
  const {
    setFilter,
    selectedAdvancedFilters,
    advancedFilter,
    setState,
    state,
    filterOptions,
    handleSubmit,
  } = useFilterContext();

  const searchParams = useSearchParams();

  const filterQueryValues = useMemo(
    () => ({
      fac: searchParams.has("fac") ? searchParams.get("fac") : "",
      inclusions: searchParams.has("inclusions")
        ? searchParams.get("inclusions")
        : "",
      bedrooms: searchParams.has("bedrooms")
        ? searchParams.get("bedrooms")
        : "1",
      bathrooms: searchParams.has("bathrooms")
        ? searchParams.get("bathrooms")
        : "1",
      sort: searchParams.has("sort") ? searchParams.get("sort") : "default",
      maxprice: searchParams.has("maxprice") ? searchParams.get("maxprice") : 0,
      distcoast: searchParams.has("distcoast")
        ? searchParams.get("distcoast")
        : 0,
    }),
    [searchParams]
  );

  const toggleAdvancedFilter = () => {
    setShowAdvancedFilter((prev) => !prev);
    setShow((prev) => !prev);
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilter(name, value);
  };

  const handleFacilitiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedValue = value.toLowerCase();
    let facList =
      advancedFilter && "fac" in advancedFilter && advancedFilter.fac.trim()
        ? advancedFilter.fac.split(",")
        : [];
    if (facList.includes(updatedValue)) {
      facList.splice(facList.indexOf(updatedValue), 1);
    } else {
      facList.push(updatedValue);
    }
    setFilter(name, facList.join(","));
  };

  const handleInclusionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedValue = value.toLowerCase();
    let inclusions =
      advancedFilter &&
      "inclusions" in advancedFilter &&
      advancedFilter.inclusions.trim()
        ? advancedFilter.inclusions.split(",")
        : [];
    if (inclusions.includes(updatedValue)) {
      inclusions.splice(inclusions.indexOf(updatedValue), 1);
    } else {
      inclusions.push(updatedValue);
    }
    setFilter(name, inclusions.join(","));
  };

  const handleAproxyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFilter(name, checked + "");
  };

  return (
    <>
      <div className="search-toolbar">
        <div className="toolbar-left">
          <div id="search-advanced" className="search-expander">
            <Image
              className="add-icon"
              src="/images/_global/add.webp"
              alt=""
              onClick={toggleAdvancedFilter}
              height={14}
              width={14}
            />
            <Image
              className="minus-icon"
              src="/images/_global/minus.svg"
              alt=""
              onClick={toggleAdvancedFilter}
              height={14}
              width={14}
            />
            <span onClick={toggleAdvancedFilter}>
              {showAdvancedFilter ? "Filter ausblenden" : "Mehr Filter"}
            </span>
            {selectedAdvancedFilters > 0 && (
              <label className="badge-indicator">
                {selectedAdvancedFilters}
              </label>
            )}
          </div>
          <div
            id="search-housenumber"
            className={`search-expander ${showHouseNumberSearch && "d-none"}`}
          >
            <Image
              className="add-icon"
              src="/images/_global/add.webp"
              alt=""
              onClick={() => setShowHouseNumberSearch((prev) => !prev)}
              height={14}
              width={14}
            />
            <span onClick={() => setShowHouseNumberSearch((prev) => !prev)}>
              Hausnummer-Suche
            </span>
          </div>
        </div>

        {withFilter && (
          <div className="toolbar-right">
            <span className="sortby">
              <select
                name="sort"
                className="form-control"
                onChange={(e) => setFilter("sort", e.target.value)}
                value={advancedFilter?.sort || "default"}
              >
                {filterOptions?.sort
                  .filter((option) => !option.disabled)
                  .map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.text}
                    </option>
                  ))}
              </select>
            </span>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showAdvancedFilter && (
          <motion.div
            id="search-options-container"
            style={{ display: "block" }}
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div id="searcher" className="row options-container">
              <div className="close-searcher" onClick={toggleAdvancedFilter}>
                <img src="/images/svg/close-btn-black.svg" alt="close" />
              </div>

              <div className="flex-travel">
                <div className="option">
                  <input
                    id="flexArrival"
                    type="checkbox"
                    className="checkboxstyle"
                    defaultChecked
                    name="aproxy"
                    onChange={handleAproxyChange}
                  />
                  <label htmlFor="flexArrival"></label>
                </div>
                <label htmlFor="flexArrival" className="option-title">
                  Flexible Anreise (+/- 3 Tage)
                </label>
              </div>

              <div className="col-md-3 col-sm-6 option-title">
                Maximaler Abstand Küste:
              </div>
              <div className="col-md-3 col-sm-6 selection option">
                <div id="range">
                  <div className="wrapper-slider">
                    <input
                      type="range"
                      min="0"
                      max="3000"
                      step="50"
                      className="rangeslider"
                      name="distcoast"
                      onChange={handleRangeChange}
                      value={advancedFilter?.distcoast || 0}
                    />
                  </div>
                  <div className="wrapper-label">
                    <span className="rangeresult">
                      {advancedFilter?.distcoast &&
                      parseInt(advancedFilter.distcoast) > 0
                        ? advancedFilter.distcoast + " meter"
                        : "Abstand egal"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="col-md-3 col-sm-6 option-title">
                Maximaler Preis:
              </div>
              <div className="col-md-3 col-sm-6 selection option">
                <div id="pricerange">
                  <div className="wrapper-slider">
                    <input
                      type="range"
                      min="0"
                      max="9000"
                      step="25"
                      className="rangeslider"
                      name="maxprice"
                      onChange={handleRangeChange}
                      value={advancedFilter?.maxprice || 0}
                    />
                  </div>
                  <div className="wrapper-label">
                    <span className="priceresult">
                      {advancedFilter?.maxprice &&
                      parseInt(advancedFilter.maxprice) > 0
                        ? formatToCurrency(parseInt(advancedFilter.maxprice))
                        : "Preis egal"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="col-md-3 col-sm-6 option-title">Schlafzimmer</div>
              <div className="col-md-3 col-sm-6 option">
                <i className="icon flaticon-bed-2"></i>
                <select
                  className="form-control"
                  name="bedrooms"
                  onChange={(e) => setState("bedrooms", e.target.value)}
                  value={state.bedrooms}
                >
                  {filterOptions?.bedrooms
                    .filter((option) => !option.disabled)
                    .map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.text}
                      </option>
                    ))}
                </select>
              </div>

              <div className="col-md-3 col-sm-6 option-title">Badezimmer</div>
              <div className="col-md-3 col-sm-6 option">
                <i className="icon flaticon-bathtub"></i>
                <select
                  className="form-control"
                  name="bathrooms"
                  onChange={(e) => setState("bathrooms", e.target.value)}
                  value={state.bathrooms}
                >
                  {filterOptions?.bathrooms
                    .filter((option) => !option.disabled)
                    .map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.text}
                      </option>
                    ))}
                </select>
              </div>

              <div className="col-sm-12">
                <div id="multiSelection" className="option-list">
                  {filterOptions?.facilities.map((option) => (
                    <div className="option-item" key={option.id}>
                      <input
                        id={option.id}
                        type="checkbox"
                        value={option.id}
                        onChange={handleFacilitiesChange}
                        className="mycheckbox"
                        name="fac"
                        defaultChecked={filterQueryValues.fac
                          ?.split(",")
                          .includes(option.id.toLowerCase())}
                      />
                      <label htmlFor={option.id}>
                        <i className={option.iconClass}></i>
                        {option.title}
                      </label>
                    </div>
                  ))}

                  {filterOptions?.inclusions?.map((option) => (
                    <div className="option-item inclusion" key={option.value}>
                      <input
                        id={option.value}
                        value={option.value}
                        type="checkbox"
                        className="mycheckbox"
                        onChange={handleInclusionsChange}
                        name="inclusions"
                        defaultChecked={filterQueryValues.inclusions
                          ?.split(",")
                          .includes(option.value.toLowerCase())}
                      />
                      <label htmlFor={option.value}>
                        {option.iconCssClass ? (
                          <i className={option.iconCssClass}></i>
                        ) : option.svgCode != null ? (
                          <i
                            className="icon"
                            dangerouslySetInnerHTML={{ __html: option.svgCode }}
                          ></i>
                        ) : null}

                        {option.title}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-md-12">
                <div className="search-button">
                  <Link href="#" className="button" onClick={handleSubmit}>
                    Suchen
                  </Link>
                </div>
              </div>

              <div className="col-md-12">
                <div
                  className="search-expander search-option-close"
                  onClick={toggleAdvancedFilter}
                >
                  <span>Filter ausblenden</span>
                  <Image
                    src="/images/svg/close-btn-black.svg"
                    alt="Close Search Options"
                    height={12}
                    width={12}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdvancedFilter;
