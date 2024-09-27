import { addYears, format, isSameDay, isToday, subYears } from "date-fns";
import { de, Locale } from "date-fns/locale";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import DatePicker, {
  ReactDatePickerProps,
  registerLocale,
} from "react-datepicker";

type Day = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// Customizing the locale to start the week on Monday and change the week title
const customDe: Locale = {
  ...de,
  options: {
    ...de.options,
    weekStartsOn: 1 as Day, // Monday as the first day of the week
  },
  localize: {
    ...de.localize,
  },
};

registerLocale("customDe", customDe);

type Props = {
  startDate: Date | null;
  handleDateChange: (date: Date | null) => void;
  availableDates: Date[];
};

const DatepickerSearch: React.FC<Props> = ({
  startDate,
  handleDateChange,
  availableDates,
}) => {
  const datePickerRef = useRef<DatePicker>(null);

  const renderDayContents: ReactDatePickerProps["renderDayContents"] = (
    day,
    date
  ) => {
    if (!date) return;

    const isAvailable = availableDates.some((availableDate) =>
      isSameDay(availableDate, date)
    );
    const isCurrentDay = isToday(date);
    let className = "";

    if (isAvailable) {
      className = "possible-arrival";
    }
    if (isCurrentDay) {
      className += " today";
    }

    return <div className={className.trim()}>{day}</div>;
  };

  const filterAvailableDates = (date: Date) => {
    return availableDates.some((availableDate) =>
      isSameDay(availableDate, date)
    );
  };

  const insertLegends = () => {
    const datePicker = document.querySelector(
      ".react-datepicker .react-datepicker__month-container"
    );
    if (datePicker) {
      const legendElement = document.createElement("div");
      legendElement.className = "date-legends";
      legendElement.innerHTML = `
        <ul>
          <li><span class="legend possible-arrival"></span> Möglicher Anreisetag</li>
          <li><span class="legend selected-arrival"></span> Gewählter Anreisetag</li>
          <li><span class="legend chosen-period"></span> Gewählte Periode</li>
        </ul>
      `;
      datePicker.appendChild(legendElement);
    }
  };

  useEffect(() => {
    insertLegends();
  }, [startDate]);

  // Disable navigation before 1 year ago and after 4 years in the future
  const minDate = subYears(new Date(), 1);
  const maxDate = addYears(new Date(), 4);

  return (
    <div id="inputpickerSearch" className="search-item start">
      <div
        className={`date-wrapper ${
          availableDates.length <= 0 ? "loading" : ""
        }`}
      >
        <DatePicker
          portalId="datepicker-portal"
          ref={datePickerRef}
          className="form-control"
          selected={startDate}
          onChange={handleDateChange}
          dateFormat="dd.MM.yyyy"
          showWeekNumbers
          placeholderText="Kein Datum"
          renderDayContents={renderDayContents}
          filterDate={filterAvailableDates}
          onCalendarOpen={insertLegends}
          onCalendarClose={() => setTimeout(insertLegends, 0)}
          locale="customDe"
          minDate={minDate}
          maxDate={maxDate}
          renderCustomHeader={({
            date,
            changeYear,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
          }) => (
            <div className="datepicker__header">
              <button
                type="button"
                onClick={decreaseMonth}
                className="react-datepicker__navigation react-datepicker__navigation--previous"
                aria-label="Previous Month"
              >
                <span className="react-datepicker__navigation-icon react-datepicker__navigation-icon--previous">
                  Previous Month
                </span>
              </button>
              <div className="datepicker__header-title">
                <span>{format(date, "MMMM", { locale: de })}</span>
                <select
                  value={date.getFullYear()}
                  onChange={({ target: { value } }) =>
                    changeYear(Number(value))
                  }
                >
                  {Array.from({ length: 4 }, (_, i) => {
                    const year = new Date().getFullYear() + i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>

              <button
                type="button"
                onClick={increaseMonth}
                className="react-datepicker__navigation react-datepicker__navigation--next"
                aria-label="Next Month"
              >
                <span className="react-datepicker__navigation-icon react-datepicker__navigation-icon--next">
                  Next Month
                </span>
              </button>
            </div>
          )}
        />
        {startDate !== null && (
          <div
            className="clear-date"
            title="Clear Date"
            onClick={() => handleDateChange(null)}
          >
            <Image
              src="/images/svg/close-btn-black.svg"
              alt="clear date"
              height={12}
              width={12}
            />
          </div>
        )}
      </div>
      <span className="input-icon">
        <i className="icon flaticon-calendar-1"></i>
      </span>
    </div>
  );
};

export default DatepickerSearch;
