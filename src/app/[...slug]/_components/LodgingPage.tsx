"use client";

import { SearchHouseResponse } from "@/components/compound/search-house-widget/_type";
import lodginApi from "@/constants/lodgingApi";
import { useFavorite } from "@/lib/context/FavoriteContext";
import { formatDate } from "@/utils/dateHelper";
import { getDay } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import useFetchBooking, { Upgrade } from "../_hooks/useFetchBooking";
import { BookingFilter, LodgingPageProps } from "./lodging/types";
import Video from "./lodging/Video";

import "../../../styles/scss/utilities/print.css";

const DatePicker = dynamic(() => import("../_components/lodging/DatePicker"));
const SearchHouseWidget = dynamic(
  () => import("@/components/compound/search-house-widget")
);
const LodgingPageForPrint = dynamic(() => import("./lodging-page/Print"));
const AdditionalContent = dynamic(() => import("./lodging/AdditionalContent"));
const Calendar = dynamic(() => import("./lodging/Calendar"));
const Description = dynamic(() => import("./lodging/Description"));
const Facilities = dynamic(() => import("./lodging/Facilities"));
const HeroImages = dynamic(() => import("./lodging/HeroImages"));
const Map = dynamic(() => import("./lodging/Map"));
const Ratings = dynamic(() => import("./lodging/Ratings"));
const ServiceInformation = dynamic(
  () => import("./lodging/ServiceInformation")
);
const SocialShareModal = dynamic(() => import("./lodging/SocialShareModal"));

const slideVariants = {
  hidden: { height: 0, opacity: 0, overflow: "hidden" }, // Starting state (collapsed)
  visible: { height: "auto", opacity: 1, overflow: "hidden" }, // Expanded state
  exit: { height: 0, opacity: 0, overflow: "hidden" }, // Exiting state (collapsing)
};

const parseDate = (dateStr: string) => {
  const [day, month, year] = dateStr.split(".").map(Number);
  const date = new Date(year, month - 1, day);
  return date instanceof Date && !isNaN(date.getTime()) ? date : null;
};

const LodgingPage: React.FC<{
  data: LodgingPageProps;
}> = (props) => {
  const { data } = props;

  const {
    properties: {
      description,
      descriptionHeading,
      descriptionOverride,
      images,
      rating,
      address1,
      city,
      additionalContent,
      latitude,
      longitude,
      maxPerson,
      maxPets,
      bedrooms,
      bathrooms,
      distToCoast,
      houseArea,
    },
    bookingAgencyName,
    bookingAgencyPhone,
    facilities,
    facilitiesFromFilter,
    serviceInformationText,
    nodeId,
    attractions,
    categoryAverageRatings,
    comments,
    youtubeEmbedUrl,
    ratingStarValue,
    pets: petsOptions,
    persons: personsOptions,
    durations: durationOptions,
  } = data;

  const {
    booking,
    bookingFilter,
    availableDates,
    setBookingFilter,
    setDuration,
    loading,
  } = useFetchBooking(data.nodeId);

  const router = useRouter();
  const searchParams = useSearchParams();

  const [showBookingUpgrades, setShowBookingUpgrades] = useState(false);
  const [showPriceInfo, setShowPriceInfo] = useState(false);
  const [showAdditionalCost, setShowAdditionalCost] = useState(false);
  const [showBookingInfo, setShowBookingInfo] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);

  const { toggleFavorite, favoriteList } = useFavorite();

  const bookingPageUrl = "/booking/";

  const date = searchParams.get("startdate");
  const duration = searchParams.get("duration");
  const person = searchParams.get("person");
  const pets = searchParams.get("pets") || 0;

  // data to set to favorite list
  const splitDate = date?.split(".");
  const favDate = splitDate
    ? splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0] + "T00:00:00"
    : "";
  const favDuration = parseInt(duration || "0");
  const favPerson = parseInt(person || "0");
  const favPets = parseInt(pets || "0");

  const rt = rating ? Math.round(parseFloat(rating)) : 0;

  const displayRating = isNaN(rt) ? null : (
    <>
      <div className="rating-gold">
        {[...Array(rt)].map((_, i) => (
          <div key={i} className="rating-star">
            <i className="star"></i>
          </div>
        ))}
      </div>
      <div className="rating-gray">
        {[...Array(5 - rt)].map((_, i) => (
          <div key={i} className="rating-star">
            <i className="star"></i>
          </div>
        ))}
      </div>
    </>
  );

  const handleInputChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const key = name as keyof BookingFilter;
    setBookingFilter(key, value);
  };

  const handleDateChange = (date: Date | null) => {
    if (!date) setBookingFilter("startdate", date);
    else setBookingFilter("startdate", formatDate(date));
  };

  const handleUpgrde = (item: Upgrade) => {
    setDuration(item.duration + "");
  };

  const handlePrintPageClick = () => {
    window.print();
  };

  const [searchHouseData, setSearchHouseData] =
    useState<SearchHouseResponse | null>(null);
  const [searchHouseLoading, setSearchHouseLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setSearchHouseLoading(true);
        const response = await fetch(lodginApi.searchHouseWidget, {
          method: "POST",
          body: JSON.stringify({
            AdditionalClass: "",
            Duration: parseInt(data.durationId),
            ElementId: "",
            Heading: "Andere Ferienhäuser in Dänemark entdecken",
            ItemsPerPage: 5,
            Keywords: "",
            Persons: parseInt(data.personId),
            Pets: parseInt(data.petsId),
            StartDate: data.startDateValue,
            ExceptNodeId: data.nodeId,
            HeadingFormat: "h2",
            HeadingFontSize: "Size 24px",
            HeadingFont: "Quattrocento",
            DisplayButton: true,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result: SearchHouseResponse = await response.json();
        setSearchHouseData(result);
        setSearchHouseLoading(false);
      } catch (err) {
        setSearchHouseLoading(false);
      }
    };

    fetchData();
  }, []);

  const isFavorite = favoriteList.find((f) => f.hid === data.nodeId);

  const filteredAvailableDates = useMemo(() => {
    if (getDay(data.startDateValue) !== 6) {
      return availableDates;
    }

    return availableDates.filter((date) => getDay(date) === 6);
  }, [data.startDateValue, availableDates]);

  return (
    <>
      <div id="no-print">
        <HeroImages images={images} />
        <section className="section__lodgingcontent">
          <div className="container">
            <div className="row no-gutters button__row">
              <div className="columns">
                <a
                  href="#"
                  className="button__arrow history-back"
                  onClick={router.back}
                >
                  <span>Zurück zur Übersicht</span>
                </a>
              </div>

              <div className="columns columns--buttons">
                <button
                  type="button"
                  className="button__icon"
                  data-toggle="modal"
                  data-target="#sharePopup"
                  onClick={() => setShareModalOpen(true)}
                >
                  <span>TEILEN</span>
                  <span>
                    <img
                      className="icon"
                      src="/images/svg/share-icon.svg"
                      alt="Share"
                    />
                  </span>
                </button>
                <button
                  type="button"
                  className={`button__icon favorite-btn ${
                    isFavorite && "active"
                  }`}
                  onClick={() =>
                    toggleFavorite({
                      hid: data.nodeId,
                      dur: favDuration,
                      arv: favDate,
                      adu: favPerson,
                      pet: favPets,
                    })
                  }
                >
                  <span data-savedtext="Saved" data-savetext="Save">
                    MERKEN
                  </span>
                  <span>
                    <svg
                      className="icon"
                      xmlns="http://www.w3.org/2000/svg"
                      width="20.931"
                      height="18.502"
                      viewBox="0 0 20.931 18.502"
                    >
                      <path
                        fill="#fff"
                        stroke="#212529"
                        strokeWidth="1.5px"
                        d="M17.542-15.089a5.189 5.189 0 0 0-7.081.516l-.748.77-.748-.77a5.189 5.189 0 0 0-7.081-.516A5.449 5.449 0 0 0 1.51-7.2L8.853.382a1.19 1.19 0 0 0 1.719 0L17.914-7.2a5.445 5.445 0 0 0-.372-7.889z"
                        transform="translate(0.751 17.004)"
                      />
                    </svg>
                  </span>
                </button>
                <button
                  type="button"
                  className="button__icon"
                  id="printPage"
                  onClick={handlePrintPageClick}
                >
                  <span>DRUCKEN</span>
                  <span>
                    <img
                      className="icon"
                      src="/images/svg/print-icon.svg"
                      alt="Print"
                    />
                  </span>
                </button>
              </div>
            </div>
            {/* done */}
            <div className="row no-gutters" id="house-desc">
              <div className="columns">
                <div className="objectrating">
                  <h1 className="label">
                    Ferienhaus {data.properties.lodgingName}
                  </h1>
                  {displayRating}
                  <strong>
                    {!isNaN(parseFloat(rating))
                      ? parseFloat(rating).toFixed(1)
                      : ""}
                  </strong>
                </div>
                <p className="heading">{address1}</p>
                {city && <p className="subheading">{city}</p>}

                <div className="columns--buttons d-sm-block d-md-none">
                  <button
                    type="button"
                    className="button__icon"
                    data-toggle="modal"
                    data-target="#sharePopup"
                    onClick={() => setShareModalOpen(true)}
                  >
                    <span>TEILEN</span>
                    <span>
                      <img
                        className="icon"
                        src="/images/svg/share-icon.svg"
                        alt="Share"
                      />
                    </span>
                  </button>
                  <button
                    type="button"
                    className={`button__icon favorite-btn ${
                      isFavorite && "active"
                    }`}
                    data-houseid={data.id}
                    onClick={() =>
                      toggleFavorite({
                        hid: data.nodeId,
                        dur: favDuration,
                        arv: favDate,
                        adu: favPerson,
                        pet: favPets,
                      })
                    }
                  >
                    <span data-savedtext="Saved" data-savetext="Save">
                      MERKEN
                    </span>
                    <span>
                      <svg
                        className="icon"
                        xmlns="http://www.w3.org/2000/svg"
                        width="20.931"
                        height="18.502"
                        viewBox="0 0 20.931 18.502"
                      >
                        <path
                          fill="#fff"
                          stroke="#212529"
                          strokeWidth="1.5px"
                          d="M17.542-15.089a5.189 5.189 0 0 0-7.081.516l-.748.77-.748-.77a5.189 5.189 0 0 0-7.081-.516A5.449 5.449 0 0 0 1.51-7.2L8.853.382a1.19 1.19 0 0 0 1.719 0L17.914-7.2a5.445 5.445 0 0 0-.372-7.889z"
                          transform="translate(0.751 17.004)"
                        />
                      </svg>
                    </span>
                  </button>
                  <button
                    type="button"
                    className="button__icon"
                    id="printPage"
                    onClick={handlePrintPageClick}
                  >
                    <span>DRUCKEN</span>
                    <span>
                      <img
                        className="icon"
                        src="/images/svg/print-icon.svg"
                        alt="Print"
                      />
                    </span>
                  </button>
                </div>

                <section className="section__divider section__divider--fullwidth">
                  <div className="container">
                    <div className="divider"></div>
                  </div>
                </section>

                {/* facilities */}
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

                <section className="section__divider section__divider--fullwidth">
                  <div className="container">
                    <div className="divider"></div>
                  </div>
                </section>

                <section className="section__accordion">
                  <div className="container">
                    <div
                      className="accordion md-accordion"
                      id="accordionEx"
                      role="tablist"
                      aria-multiselectable="true"
                    >
                      <Description
                        description={description}
                        descriptionHeading={descriptionHeading || ""}
                        descriptionOverride={descriptionOverride || ""}
                      />
                      <Video youtubeEmbedUrl={youtubeEmbedUrl} />
                      <Map
                        latitude={parseFloat(latitude)}
                        longitude={parseFloat(longitude)}
                        attractions={attractions}
                      />
                      <Calendar
                        nodeId={nodeId}
                        pets={bookingFilter.pets}
                        person={bookingFilter.person}
                      />
                      <Ratings
                        categoryAverageRatings={categoryAverageRatings}
                        comments={comments}
                        ratingStarValue={ratingStarValue}
                      />
                      <ServiceInformation
                        serviceInformationText={serviceInformationText}
                      />
                      {additionalContent &&
                        additionalContent.length &&
                        additionalContent.map((content) => (
                          <AdditionalContent key={content.id} item={content} />
                        ))}
                    </div>
                  </div>
                </section>
              </div>

              <div className="columns">
                <div
                  className={`booking-side ${loading && "loading"}`}
                  id="bookingmenu"
                >
                  <div>
                    <div className="ol-close" id="overlay-close">
                      <a>
                        <i className="flaticon-close"></i>
                      </a>
                    </div>

                    <AnimatePresence>
                      {showPriceInfo && (
                        <motion.div
                          id="priceinfo"
                          className="collapse show"
                          key="priceinfo"
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          variants={slideVariants}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                        >
                          <div className="bookingpircelist">
                            {booking?.priceBreakdown?.map(
                              (item: any, index: number) => (
                                <div className="booking-register" key={index}>
                                  <div className="service">{item.name}</div>
                                  <div className="price">{item.price}</div>
                                </div>
                              )
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="wrapper">
                      <button
                        type="button"
                        id="myButton"
                        className="collapsed"
                        onClick={() => setShowPriceInfo(!showPriceInfo)}
                      >
                        {booking?.priceBreakdown &&
                          booking?.priceBreakdown.length > 0 && (
                            <i
                              title="Weitere Informationen"
                              className="flaticon-info"
                            ></i>
                          )}
                      </button>
                      <label htmlFor="myButton" className="finalsum">
                        {booking?.price}
                      </label>
                    </div>

                    <div className="bookingpircelist">
                      <button
                        type="button"
                        className="collapsed"
                        style={{
                          display:
                            booking?.additionalCosts &&
                            booking.additionalCosts.length > 0
                              ? "block"
                              : "none",
                        }}
                        onClick={() =>
                          setShowAdditionalCost(!showAdditionalCost)
                        }
                      >
                        <i
                          title="Weitere Informationen"
                          className="flaticon-info"
                        ></i>
                        zzgl. Nebenkosten
                      </button>

                      <AnimatePresence>
                        {showAdditionalCost && (
                          <motion.div
                            id="additionalcosts"
                            className={`additionalcosts collapse show`}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={slideVariants}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                          >
                            <div className="price brd-top"></div>
                            {booking?.additionalCosts?.map(
                              (item: any, index: number) => (
                                <div className="booking-register" key={index}>
                                  <div className="service">{item.name}</div>
                                  <div className="price">{item.price}</div>
                                </div>
                              )
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="bookingdates">
                      {booking && booking?.status === "Available" && (
                        <div className="booking-title">
                          Aufenthalt {booking?.arrival} – {booking.departure}
                        </div>
                      )}

                      <div className="row spacing-top">
                        <div className="col-sm-7 snug-r">
                          {filteredAvailableDates &&
                            filteredAvailableDates.length > 0 && (
                              <DatePicker
                                startDate={
                                  bookingFilter.startdate
                                    ? parseDate(bookingFilter.startdate)
                                    : null
                                }
                                handleDateChange={handleDateChange}
                                availableDates={filteredAvailableDates}
                              />
                            )}
                        </div>

                        <div className="col-sm-5 snug-l">
                          <div className="bookingtime">
                            <select
                              name="duration"
                              value={bookingFilter.duration}
                              onChange={handleInputChange}
                            >
                              {durationOptions.map((duration, index) => (
                                <option key={index} value={duration.value}>
                                  {duration.text}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-7 snug-r">
                          <select
                            name="person"
                            value={bookingFilter.person}
                            onChange={handleInputChange}
                          >
                            {personsOptions.map((person, index) => (
                              <option key={index} value={person.value}>
                                {person.text}
                              </option>
                            ))}
                          </select>
                        </div>

                        {petsOptions.length > 0 && (
                          <div className="col-5 snug-l">
                            <select
                              name="pets"
                              value={bookingFilter.pets}
                              onChange={handleInputChange}
                            >
                              {petsOptions.map((pet, index) => (
                                <option key={index} value={pet.value}>
                                  {pet.text}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>

                    {booking?.status === "Available" && (
                      <div className="bookingbtnarea">
                        <Link
                          href={`${bookingPageUrl}?houseid=${nodeId}&startdate=${bookingFilter.startdate}&duration=${bookingFilter.duration}&person=${bookingFilter.person}&pets=${bookingFilter.pets}`}
                          className="btn-default-l bookingaccept"
                        >
                          Buchen
                        </Link>

                        {booking?.upgrades && booking.upgrades.length > 0 && (
                          <button
                            type="button"
                            className="btn-default-l collapsed booking-upgrade"
                            data-toggle="collapse"
                            data-target="#upgrade"
                            onClick={() =>
                              setShowBookingUpgrades((show) => !show)
                            }
                          >
                            <i className="flaticon-plus"></i>
                          </button>
                        )}
                      </div>
                    )}

                    {booking?.status === "NotAvailable" && (
                      <div className="bookingbtnarea-disabled">
                        <button className="button__disabled">
                          {/* Replace with a method or helper to get dictionary values */}
                          Haus leider nicht frei.
                        </button>
                      </div>
                    )}

                    {booking?.status === "CannotBookToday" && (
                      <div className="bookingbtnarea-disabled">
                        <button className="button__disabled">
                          {/* Replace with a method or helper to get dictionary values */}
                          Cannot be booked online today
                        </button>

                        <p className="red-text">
                          {`Please contact ${bookingAgencyName} by phone on `}
                          <strong>{bookingAgencyPhone}</strong>
                        </p>
                      </div>
                    )}

                    {booking?.status === "Available" &&
                      booking &&
                      booking?.upgrades &&
                      booking?.upgrades.length > 0 && (
                        <AnimatePresence>
                          {showBookingUpgrades && (
                            <motion.div
                              id="upgrade"
                              className={`collapse show`}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              variants={slideVariants}
                              transition={{ duration: 0.4, ease: "easeInOut" }}
                            >
                              <div className="upgrade-vacation">
                                Oder upgrade Ferien
                              </div>
                              <ul>
                                {booking.upgrades?.map(
                                  (item: Upgrade, index: number) => (
                                    <li key={index}>
                                      <button
                                        className="add-additionals"
                                        onClick={() => handleUpgrde(item)}
                                      >
                                        <div className="additionaldays">
                                          <p>{item.durationText}</p>
                                        </div>
                                        <div className="additionalprice">
                                          {item.price}
                                        </div>
                                      </button>
                                    </li>
                                  )
                                )}
                              </ul>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`booking-container-sm ${loading && "loading"}`}>
            <div id="mbMask" className="mb-booking">
              <div className="mb-banner">
                <div className="mb-wrapper">
                  <div className="ol-close" id="overlay-close">
                    <a>
                      <i className="flaticon-close"></i>
                    </a>
                  </div>

                  <div style={{ minHeight: "50px" }}>
                    <div className="mb-price">
                      {/* Button for toggling price breakdown */}
                      {booking?.priceBreakdown &&
                        booking?.priceBreakdown?.length > 0 && (
                          <button
                            type="button"
                            id="mbPriceSm"
                            className="collapsed"
                            onClick={() => setShowPriceInfo(!showPriceInfo)}
                            data-toggle="collapse"
                            aria-expanded={showPriceInfo}
                          >
                            <i
                              className="flaticon-info"
                              title="Weitere Informationen"
                            ></i>
                          </button>
                        )}

                      {/* Price or availability message */}
                      {(booking?.status === "Available" ||
                        booking?.status === "CannotBookToday") && (
                        <label
                          htmlFor="mbPriceSm"
                          className={
                            booking?.priceBreakdown?.length ? "witharrow" : ""
                          }
                        >
                          {booking?.price}
                        </label>
                      )}

                      {booking?.status === "NotAvailable" && (
                        <label>
                          <strong>Haus leider nicht frei</strong>
                        </label>
                      )}

                      {booking?.status === "CannotBookToday" && (
                        <div>
                          <p>
                            <strong>Cannot be booked online today</strong>
                            <br />
                            Please contact {bookingAgencyName} by phone on{" "}
                            <strong>{bookingAgencyPhone}</strong>
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Price Breakdown */}
                    {booking?.priceBreakdown &&
                      booking?.priceBreakdown?.length > 0 && (
                        <AnimatePresence>
                          {showPriceInfo && (
                            <motion.div
                              id="priceinfoSm"
                              className={`collapse show`}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              variants={slideVariants}
                              transition={{ duration: 0.4, ease: "easeInOut" }}
                            >
                              <div className="bookingpircelist">
                                {booking.priceBreakdown.map((item, index) => (
                                  <div key={index} className="booking-register">
                                    <div className="service">{item.name}</div>
                                    <div className="price">{item.price}</div>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      )}

                    {/* Additional Costs */}
                    {booking?.additionalCosts &&
                      booking?.additionalCosts?.length > 0 && (
                        <button
                          type="button"
                          className="collapsed"
                          data-toggle="collapse"
                          data-target="#additionalcostsSm"
                          aria-expanded={showAdditionalCost}
                          onClick={() =>
                            setShowAdditionalCost(!showAdditionalCost)
                          }
                        >
                          <i
                            className="flaticon-info"
                            title="Weitere Informationen"
                          ></i>{" "}
                          zzgl. Nebenkosten
                        </button>
                      )}

                    {booking?.additionalCosts &&
                      booking?.additionalCosts?.length > 0 && (
                        <AnimatePresence>
                          {showAdditionalCost && (
                            <motion.div
                              id="additionalcostsSm"
                              className={`collapse show `}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              variants={slideVariants}
                              transition={{ duration: 0.4, ease: "easeInOut" }}
                            >
                              <div className="bookingpircelist">
                                {booking?.additionalCosts.map((item, index) => (
                                  <div key={index} className="booking-register">
                                    <div className="service">{item.name}</div>
                                    <div className="price">{item.price}</div>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      )}

                    {/* Book Button */}
                    {booking?.status === "Available" && (
                      <Link
                        href={`${bookingPageUrl}?houseid=${nodeId}&startdate=${bookingFilter.startdate}&duration=${bookingFilter.duration}&person=${bookingFilter.person}&pets=${bookingFilter.pets}`}
                        className="button booking-pos"
                      >
                        Buchen
                      </Link>
                    )}
                  </div>

                  {/* Booking Summary */}
                  <div
                    data-toggle="collapse"
                    data-target="#bookingSm"
                    className="pt-3"
                    onClick={() => setShowBookingInfo(!showBookingInfo)}
                  >
                    <span>
                      {bookingFilter.person} <i className="flaticon-group"></i>
                    </span>
                    <span>
                      {" "}
                      {bookingFilter.pets} <i className="flaticon-pawprint"></i>
                    </span>
                    <div className="mb-date">
                      <i className="icon-edit"></i> {booking?.arrival}
                      <i className="icon-right-arrow"></i> {booking?.departure}
                    </div>
                  </div>
                </div>
                <div className="mb-close"></div>
              </div>
              {/* Booking Sidebar */}

              <AnimatePresence>
                {showBookingInfo && (
                  <motion.div
                    id="bookingSm"
                    className={`booking-side collapse show `}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={slideVariants}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="bookingdates">
                      <div className="close-bookingsm">
                        <i
                          className="icon-close p-1"
                          onClick={() => setShowBookingInfo(false)}
                        ></i>
                      </div>
                      <div className="row">
                        <div className="col-sm-6 datepicker-sm">
                          <label>Anreise</label>

                          {filteredAvailableDates &&
                            filteredAvailableDates.length > 0 && (
                              <DatePicker
                                startDate={
                                  bookingFilter.startdate
                                    ? parseDate(bookingFilter.startdate)
                                    : null
                                }
                                handleDateChange={handleDateChange}
                                availableDates={filteredAvailableDates}
                              />
                            )}
                        </div>
                        <div className="col-sm-6">
                          <label>Dauer</label>
                          <select
                            name="duration"
                            value={bookingFilter.duration}
                            onChange={(e) =>
                              setBookingFilter("duration", e.target.value)
                            }
                            className="form-control"
                          >
                            {durationOptions.map((option, index) => (
                              <option key={index} value={option.value}>
                                {option.text}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-6">
                          <label>Personen</label>
                          <select
                            name="person"
                            value={bookingFilter.person}
                            onChange={(e) =>
                              setBookingFilter("person", e.target.value)
                            }
                            className="form-control"
                          >
                            {personsOptions.map((option, index) => (
                              <option key={index} value={option.value}>
                                {option.text}
                              </option>
                            ))}
                          </select>
                        </div>
                        {bookingFilter.pets !== "0" && (
                          <div className="col-6">
                            <label>Haustiere</label>
                            <select
                              name="pets"
                              value={bookingFilter.pets}
                              onChange={(e) =>
                                setBookingFilter("pets", e.target.value)
                              }
                              className="form-control"
                            >
                              {petsOptions.map((option, index) => (
                                <option key={index} value={option.value}>
                                  {option.text}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>
        <section className="section__divider section__divider--fullwidth">
          <div className="container">
            <div className="divider"></div>
          </div>
        </section>

        <section
          id="lodgingPage"
          className={`section__searchhouse  ${searchHouseLoading && "loading"}`}
        >
          {searchHouseData && <SearchHouseWidget data={searchHouseData} />}
        </section>

        <SocialShareModal
          firstImageUrl={data.properties.images[0].url}
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
        />
      </div>
      {booking && (
        <div id="print-view">
          <LodgingPageForPrint data={data} booking={booking} />
        </div>
      )}
    </>
  );
};

export default LodgingPage;
