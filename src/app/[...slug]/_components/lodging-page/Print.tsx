import React from "react";
import { LodgingPageProps } from "../lodging/types";
import { Booking } from "../../_hooks/useFetchBooking";
import { format, addDays } from "date-fns";
import dynamic from "next/dynamic";

const Facilities = dynamic(() => import("../lodging/Facilities"));
const Layout = dynamic(() => import("./Layout"));
const Description = dynamic(() => import("../lodging/Description"));
const ServiceInformation = dynamic(
  () => import("../lodging/ServiceInformation")
);

const LodgingPageForPrint: React.FC<{
  data: LodgingPageProps;
  booking: Booking;
}> = ({ data, booking }) => {
  const {
    properties: {
      lodgingName,
      images,
      address1,
      description,
      descriptionHeading,
      descriptionOverride,
      rating,
      maxPerson,
      maxPets,
      bedrooms,
      bathrooms,
      distToCoast,
      houseArea,
    },
    serviceInformationText,
    bookingAgencyName,
    bookingAgencyPhone,
    facilities,
    facilitiesFromFilter,
    phoneNumber,
    enableCalendarSection,
    enableInformationSection,
  } = data;

  const renderRatingStars = (rating: number) => {
    const roundedRating = Math.round(rating);

    if (isNaN(roundedRating)) return null;

    return (
      <div className="rating">
        <div className="rating-gold">
          {[...Array(roundedRating)].map((_, i) => (
            <div key={i} className="rating-star">
              <img src="/images/star.png" alt="star" />
            </div>
          ))}
        </div>
        <div className="rating-gray">
          {[...Array(5 - roundedRating)].map((_, i) => (
            <div key={i} className="rating-star">
              <img src="/images/star-gray.png" alt="gray star" />
            </div>
          ))}
        </div>
      </div>
    );
  };

  // const renderCalendar = () => {
  //   if (!calendar) return null;

  //   const months = calendar.Dates.filter(
  //     (date) => new Date(date.Date) >= new Date()
  //   ).slice(0, 12);

  //   return (
  //     <section className="calendar-section">
  //       <table className="calendar-table" border={1}>
  //         <thead>
  //           <tr>
  //             <td></td>
  //             {months.map((month, index) => (
  //               <td key={index}>
  //                 {new Date(month.Date).toLocaleString("default", {
  //                   month: "short",
  //                 })}
  //                 <br />
  //                 {new Date(month.Date).getFullYear()}
  //               </td>
  //             ))}
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {[...Array(31)].map((_, day) => (
  //             <tr key={day}>
  //               <td>{day + 1}</td>
  //               {months.map((month, index) => {
  //                 const date = new Date(month.Date);
  //                 const dayDate = new Date(
  //                   date.getFullYear(),
  //                   date.getMonth(),
  //                   day + 1
  //                 );
  //                 const calendarItem = calendar.Dates.find(
  //                   (d) =>
  //                     new Date(d.Date).toDateString() === dayDate.toDateString()
  //                 );

  //                 if (dayDate < new Date()) {
  //                   return <td key={index}></td>;
  //                 }

  //                 if (calendarItem) {
  //                   return (
  //                     <td
  //                       key={index}
  //                       className={`color_${calendarItem.Code} ${
  //                         !calendarItem.CanBook ? "disabled" : ""
  //                       }`}
  //                     >
  //                       {calendarItem.Code}
  //                     </td>
  //                   );
  //                 }

  //                 return <td key={index}>&nbsp;</td>;
  //               })}
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>
  //       <div className="calendar-rate">
  //         <p>Lowest rate based on 1 week stay:</p>
  //         <ul>
  //           {calendar.LowestRates.map((item, index) => (
  //             <li key={index}>
  //               <div className={`legend legend__${getColor(item.Code)}`}>
  //                 &nbsp;
  //               </div>
  //               <div className="rate">
  //                 {item.Code} - {item.Price}
  //               </div>
  //             </li>
  //           ))}
  //           <li>
  //             <div className="legend"></div>
  //             <div className="rate">Not Available</div>
  //           </li>
  //         </ul>
  //       </div>
  //     </section>
  //   );
  // };

  // const getColor = (code: string) => {
  //   switch (code) {
  //     case "A":
  //       return "red";
  //     case "B":
  //       return "yellow";
  //     case "C":
  //       return "bluegreen";
  //     case "D":
  //       return "orange";
  //     case "E":
  //       return "green";
  //     case "F":
  //       return "blue";
  //     default:
  //       return "";
  //   }
  // };

  return (
    <Layout phone={phoneNumber}>
      <section className="section__herogallery">
        <div className="container">
          <div className="preview-grid">
            <div className="col-sm-6 preview preview__slider">
              {images && images.length > 0 && (
                <div className="main-preview preview-box preview__slider-item">
                  <img src={images[0].url} alt={`${lodgingName} Main Image`} />
                </div>
              )}
            </div>
            <div className="col-sm-6 preview-element">
              <div>
                {images.slice(1, 3).map((image, index) => (
                  <div className="preview-img" key={index}>
                    <img
                      src={image.url}
                      alt={`${lodgingName} Image ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
              <div className="preview-wrapper">
                {images.slice(3, 5).map((image, index) => (
                  <div className="preview-img" key={index}>
                    <img
                      src={image.url}
                      alt={`${lodgingName} Image ${index + 3}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section__lodgingcontent">
        <div className="container">
          <div className="row no-gutters" id="house-desc">
            <div className="columns">
              <div className="objectrating">
                <h1 className="label">Ferienhaus {lodgingName}</h1>
                {renderRatingStars(parseFloat(rating))}
                <strong>
                  {!isNaN(parseFloat(rating))
                    ? parseFloat(rating).toFixed(1)
                    : ""}
                </strong>
              </div>

              <p className="heading">{address1}</p>

              <section className="section__accordion">
                <div className="container">
                  <div className="accordion md-accordion" id="accordionEx">
                    <Description
                      description={description}
                      descriptionHeading={descriptionHeading || ""}
                      descriptionOverride={descriptionOverride || ""}
                    />
                    {enableInformationSection && (
                      <ServiceInformation
                        serviceInformationText={serviceInformationText}
                      />
                    )}
                  </div>
                </div>
              </section>
            </div>

            <div className="columns">
              <div className="booking-option-details">
                {booking?.status === "Available" ? (
                  <div className="price price-booking">
                    <div className="price-left">
                      <span className="price-currentprice">
                        <span>{booking.price}</span>
                        <small>Price may vary</small>
                      </span>
                      <div className="icons">
                        <span>
                          {data.personId} <i className="flaticon-group"></i>
                        </span>
                        <span>
                          {data.petsId} <i className="flaticon-pawprint"></i>
                        </span>
                        <span className="mb-date">
                          {new Date(data.startDateValue).toLocaleDateString()}
                          <img
                            src="/images/right-arrow.png"
                            className="right-arrow"
                            alt="arrow"
                          />
                          {new Date(
                            new Date(data.startDateValue).getTime() +
                              parseInt(data.durationId) * 86400000
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="price-breakdown">
                      <label className="price-title">
                        <i
                          title="Weitere Informationen"
                          className="flaticon-info"
                        ></i>
                        Weitere Informationen
                      </label>
                      {booking &&
                        booking.priceBreakdown &&
                        booking?.priceBreakdown.map((breakdown, index) => (
                          <div key={index} className="price-breakdown-info">
                            <span>{breakdown.name}</span>
                            <span>{breakdown.price}</span>
                          </div>
                        ))}
                      <label className="price-title price-title-additionalcost">
                        <i
                          title="zzgl. Nebenkosten"
                          className="flaticon-info"
                        ></i>
                        zzgl. Nebenkosten
                      </label>
                      {booking &&
                        booking.additionalCosts &&
                        booking?.additionalCosts.map((cost, index) => (
                          <div key={index} className="price-breakdown-info">
                            <span>{cost.name}</span>
                            <span>{cost.price}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                ) : booking?.status === "NotAvailable" ? (
                  <div className="price notavailable">House is not free</div>
                ) : booking?.status === "CannotBookToday" ? (
                  <>
                    <div className="price">{booking.price}</div>
                    <div className="price cannot-booktoday">
                      Cannot be book online today
                      <p className="red-text">
                        {`Please contact ${bookingAgencyName} by phone on `}
                        <strong>{bookingAgencyPhone}</strong>
                      </p>
                    </div>
                  </>
                ) : null}
                {booking?.status !== "Available" && (
                  <div className="icons">
                    <span>
                      {data.personId} <i className="flaticon-group"></i>
                    </span>
                    <span>
                      {data.personId} <i className="flaticon-pawprint"></i>
                    </span>
                    <span className="mb-date">
                      {format(new Date(data.startDateValue), "dd.MM.yyyy")}
                      <img
                        src="/images/right-arrow.png"
                        className="right-arrow"
                      />

                      {format(
                        addDays(data.startDateValue, parseInt(data.durationId)),
                        "dd.MM.yyyy"
                      )}
                    </span>
                  </div>
                )}
              </div>
              <Facilities
                maxPerson={maxPerson}
                maxPets={maxPets}
                bedrooms={bedrooms}
                bathrooms={bathrooms}
                distToCoast={distToCoast}
                houseArea={houseArea}
                facilities={facilities}
                facilitiesFromFilter={facilitiesFromFilter}
              />
            </div>
          </div>

          {/* {enableCalendarSection && (
            <div className="row no-gutters">
              <div className="columns full-width">
                <section className="section__accordion">
                  <div className="container">
                    <div className="accordion md-accordion">
                      {renderCalendar()}
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )} */}
        </div>
      </section>
    </Layout>
  );
};

export default LodgingPageForPrint;
