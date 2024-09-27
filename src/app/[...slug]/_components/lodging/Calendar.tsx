import lodginApi from "@/constants/lodgingApi";
import useOutsideClick from "@/lib/hooks/useOutsideClick";
import { URLEncode } from "@/utils/fns";
import { format, parseISO } from "date-fns";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import CalendarLegends, {
  CalendarLowestRateItemModel,
} from "./CalendarLegends";

interface CalendarProps {
  nodeId: number;
  pets: string;
  person: string;
}

type DateObj = {
  canBook: boolean;
  code: string;
  date: string;
};

type CalendarData = {
  dates: DateObj[];
  legendView: string;
  lowestRates: CalendarLowestRateItemModel[];
};

type BookingOption = {
  duration: number;
  price: string;
  title: string;
};

const getLegendClass = (code: string | null): string => {
  if (!code) return "";

  code = code.slice(0, 1);

  switch (code) {
    case "A":
      return "legend__red legend__day";
    case "B":
      return "legend__yellow legend__day";
    case "C":
      return "legend__bluegreen legend__day";
    case "D":
      return "legend__orange legend__day";
    case "E":
      return "legend__green legend__day";
    case "F":
      return "legend__blue legend__day";
    default:
      return "";
  }
};

const Calendar: React.FC<CalendarProps> = ({ nodeId, pets, person }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarData, setCalendarData] = useState<Map<string, DateObj>>(
    new Map()
  );
  const [popupPosition, setPopupPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [bookingOptions, setBookingOptions] = useState<BookingOption[]>([]);
  const [bookingOptionsLoading, setBookingOptionsLoading] = useState(false);
  const [lowestRates, setLowestRates] =
    useState<CalendarLowestRateItemModel[]>();

  const accordionRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const bookingOptionRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (isExpanded && accordionRef.current) {
      setTimeout(() => {
        const headerHeight =
          document.querySelector("header")?.offsetHeight || 0;
        if (accordionRef.current) {
          window.scrollTo({
            top:
              accordionRef.current.getBoundingClientRect().top +
              window.scrollY -
              headerHeight,
            behavior: "smooth",
          });
        }
      }, 200);
    }
  }, [isExpanded]);

  useEffect(() => {
    fetchCalendarData(nodeId);
  }, [nodeId]);

  useOutsideClick(bookingOptionRef, () => {
    setBookingOptions([]);
    setBookingOptionsLoading(false);
    setSelectedDate(null);
  });

  const fetchCalendarData = useCallback(async (nodeId: number) => {
    const resp = await fetch(
      lodginApi.getCalendar + `?umbracoNodeId=${nodeId}`
    );
    const data = (await resp.json()) as CalendarData;

    // Create a Map for faster lookup
    const dateMap = new Map<string, DateObj>();
    data.dates.forEach((dateObj) => {
      const formattedDate = format(parseISO(dateObj.date), "yyyy-MM-dd");
      dateMap.set(formattedDate, dateObj);
    });

    setCalendarData(dateMap);
    setLowestRates(data.lowestRates);
  }, []);

  const handleToggle = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsExpanded((prev) => !prev);
  }, []);

  const handleDateChange = useCallback(
    (date: Date, event: React.MouseEvent<HTMLDivElement>) => {
      setSelectedDate(date);

      if (datePickerRef.current) {
        const rect = event.currentTarget.getBoundingClientRect();
        const containerRect = datePickerRef.current.getBoundingClientRect();
        setPopupPosition({
          x: rect.left - containerRect.left,
          y: rect.bottom - containerRect.top,
        });
      }
      const formattedDate = format(date, "dd.MM.yyyy");
      fetchBookingOptions(formattedDate);
    },
    []
  );

  const fetchBookingOptions = async (date: string) => {
    try {
      setBookingOptionsLoading(true);
      const resp = await fetch(
        lodginApi.getBookingOptions +
          `?lodgingId=${nodeId}&date=${date}&pets=${pets}&person=${person}`
      );
      const data = (await resp.json()) as BookingOption[];
      setBookingOptions(data);
    } catch (e) {
    } finally {
      setBookingOptionsLoading(false);
    }
  };

  const isAvailable = useCallback(
    (date: Date) => {
      const formattedDate = format(date, "yyyy-MM-dd");
      const dateObj = calendarData.get(formattedDate);
      return dateObj ? dateObj.canBook : false;
    },
    [calendarData]
  );

  const getDateClassName = useCallback(
    (date: Date) => {
      const formattedDate = format(date, "yyyy-MM-dd");
      const dateObj = calendarData.get(formattedDate);
      return dateObj ? getLegendClass(dateObj.code) : "";
    },
    [calendarData]
  );

  const handleBookingOptionClick = (option: BookingOption, date: Date) => {
    return (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      e.preventDefault();
      console.log(option.duration);

      let currentParams = {} as any;
      searchParams.forEach((value, key) => {
        currentParams = { ...currentParams, [key]: value };
      });

      const newUrlParams = URLEncode({
        ...currentParams,
        duration: option.duration,
        startdate: format(date, "dd.MM.yyyy"),
      }).toString();
      const newUrl = `${pathname}?${newUrlParams}`;
      router.replace(newUrl, { scroll: false });
    };
  };

  return (
    <div className="card" ref={accordionRef}>
      <div className="card-header" role="tab" id="headingThree3">
        <a
          className={`collapsed ${isExpanded ? "" : "collapsed"}`}
          href="#"
          aria-expanded={isExpanded}
          onClick={handleToggle}
        >
          <h2 className="card-title mb-0">
            Saisonkalender <i className="icon-chevron-down"></i>
          </h2>
        </a>
      </div>

      <div className={`collapse ${isExpanded ? "show" : ""}`}>
        <div className="card-body">
          <section className="section__calendar" id="calendar-section">
            <div className="container">
              <div className="calendar__item" ref={datePickerRef}>
                <DatePicker
                  inline
                  selected={selectedDate}
                  onChange={handleDateChange}
                  monthsShown={2}
                  locale="customDe"
                  filterDate={isAvailable}
                  dayClassName={getDateClassName}
                  dateFormat="dd.MM.yyyy"
                />
                {popupPosition && selectedDate && bookingOptions.length > 0 && (
                  <div
                    className="calendar__item-details"
                    ref={bookingOptionRef}
                    style={{
                      position: "absolute",
                      left: `${popupPosition.x}px`,
                      top: `${popupPosition.y}px`,
                      zIndex: 1000,
                    }}
                  >
                    <div
                      className={`arrival ${
                        bookingOptionsLoading && "loading"
                      }`}
                    >
                      <div className="label">Anreise:</div>
                      <div className="value">
                        {format(selectedDate, "dd.MM.yyyy")}
                      </div>
                    </div>
                    <ul>
                      {bookingOptions.map((option) => (
                        <li key={option.title + selectedDate}>
                          <Link
                            href="#"
                            onClick={handleBookingOptionClick(
                              option,
                              selectedDate
                            )}
                          >
                            <div className="label">{option.title}</div>
                            <div className="value">{option.price}</div>
                          </Link>
                        </li>
                      ))}
                      <li>
                        <p className="info-text">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-info-circle"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>
                            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"></path>
                          </svg>
                          Auswahl durch Klicken
                        </p>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              <div className="calendar__rate">
                <CalendarLegends rates={lowestRates || []} />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Calendar);
