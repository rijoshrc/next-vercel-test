const domain = process.env.NEXT_PUBLIC_CONTENT_API as string;

const lodginApi = {
  // lodgeList: "https://cms.meerundhus.de/umbraco/api/LodgingApi/Search",
  lodgeList: "/api/LodgingApi/Search",
  getBooking: "/api/LodgingApi/GetBooking",
  searchHouseNumber: "/api/LodgingApi/SearchByText",
  pageSearch: "/api/PageSearchApi/Search",
  filterOptions: "/api/LodgingApi//SearchFilter",
  availableDates: "/api/calendarapi/getavailabledates",
  getCalendar: "/api/calendarapi/GetCalendar",
  getBookingOptions: "/api/calendarapi/GetBookingOptions",
  getBookingItems: "/api/BookingApi/GetItems",
  getBookingForm: "/api/BookingApi/GetBookingForm",
  getCalculatedPrice: "/api/BookingApi/CalculatePrice",
  postBooking: "/api/BookingApi/BookingFormPost",
  validateCoupon: "/api/Marketing/Checker",
  searchHouseWidget: domain + "umbraco/api/WidgetApi/SearchHouseWidget",
};

export default lodginApi;
