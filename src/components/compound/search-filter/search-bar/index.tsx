import {
  useAvailableDates,
  useFilterContext,
} from "@/lib/context/FilterContext"; // Adjust the import path as needed
import dynamic from "next/dynamic";
import { ChangeEvent } from "react";

const Area = dynamic(() => import("./Area"));
const DatepickerSearch = dynamic(() => import("./DatepickerSearch"));

type SearchBarProps = {
  withFilter?: boolean;
};

const SearchBar: React.FC<SearchBarProps> = ({ withFilter }) => {
  const {
    state: queryParams,
    setState,
    filterOptions,
    handleSubmit,
  } = useFilterContext();

  const availableDates = useAvailableDates();

  const handleInputChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setState(name as keyof typeof queryParams, value);
  };

  const handleDateChange = (date: Date | null) => {
    setState("startdate", date);
  };

  const handleAreaChange = (value: string) => {
    setState("area", value);
  };

  const isLoading = !filterOptions || !availableDates?.length;

  return (
    <div className="searchbar">
      <form className={isLoading ? "loading-state" : ""}>
        <Area
          areas={filterOptions?.areas || []}
          onChange={handleAreaChange}
          initialSelected={queryParams.area}
        />

        <DatepickerSearch
          startDate={queryParams.startdate || null}
          handleDateChange={handleDateChange}
          availableDates={availableDates}
        />

        <div className="search-item duration">
          <select
            className="form-control"
            name="duration"
            value={queryParams.duration}
            onChange={handleInputChange}
          >
            {filterOptions?.durations.map((duration) => (
              <option key={duration.value} value={duration.value}>
                {duration.text}
              </option>
            ))}
          </select>
          <span className="input-icon">
            <i className="icon flaticon-calendar-1"></i>
          </span>
        </div>

        <div className="search-item guests">
          <select
            className="form-control"
            name="persons"
            value={queryParams.persons}
            onChange={handleInputChange}
          >
            {filterOptions?.persons.map((person) => (
              <option key={person.value} value={person.value}>
                {person.text}
              </option>
            ))}
          </select>
          <span className="input-icon">
            <i className="icon flaticon-group"></i>
          </span>
        </div>

        <div className="search-item pet">
          <select
            className="form-control"
            name="pets"
            value={queryParams.pets || "egal"}
            onChange={handleInputChange}
          >
            {filterOptions?.pets.map((pet) => (
              <option key={pet.value} value={pet.value}>
                {pet.text}
              </option>
            ))}
          </select>
          <span className="input-icon">
            <i className="icon flaticon-pawprint"></i>
          </span>
        </div>

        {!withFilter && (
          <div className="search-item submit">
            <a href="/" className="default-btn" onClick={handleSubmit}>
              Suchen
            </a>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
