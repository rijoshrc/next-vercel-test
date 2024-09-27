"use client";

import { useFavorite } from "@/lib/context/FavoriteContext";
import { getFontClassName, getFontSizeClassName } from "@/utils/fns";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { SearchHouseResponse } from "./_type";
import dynamic from "next/dynamic";
import optimizedImage from "@/utils/optimizedImage";

const Slider = dynamic(() => import("react-slick"), { ssr: false });

const NextArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <button
      className={className}
      style={{ ...style, right: "30px" }}
      onClick={onClick}
      aria-label="Next"
    >
      Next
    </button>
  );
};

const PrevArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <button
      className={className}
      style={{ ...style }}
      onClick={onClick}
      aria-label="Prev"
    >
      Prev
    </button>
  );
};

const imageSliderSettings = {
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  adaptiveHeight: true,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  draggable: true,
  dots: false,
  arrows: true,
  className: "cottage-card-wrapper",
};

const houseSliderSettings = {
  draggable: true,
  dots: false,
  arrows: true,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 2,
  variableWidth: true,
  responsive: [
    {
      breakpoint: 580,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
  className: "lists__slider",
};

type SearchHouseWidgetProps = {
  data: SearchHouseResponse;
};

const SearchHouseWidget = (props: SearchHouseWidgetProps) => {
  const {
    heading,
    headingFormat,
    headingFont,
    headingFontSize,
    buttonUrl,
    buttonText,
    displayButton,
    moreHousesButtonColor,
    moreHousesButtonTextColor,
    houses,
  } = props.data;

  const { toggleFavorite, favoriteList } = useFavorite();

  const className = `heading a-left ${getFontClassName(
    headingFont
  )} ${getFontSizeClassName(headingFontSize)}`;

  const HeadingTag = React.createElement(
    headingFormat?.toLowerCase() || "div",
    { className },
    heading
  );

  return (
    <div className="container">
      <div className="searchhouse__header">
        {heading && heading.trim() !== "" && HeadingTag}
        {displayButton && (
          <Link
            href={buttonUrl}
            style={{
              backgroundColor: moreHousesButtonColor || "",
              color: moreHousesButtonTextColor || "",
            }}
            className="button__arrow"
          >
            <span>{buttonText || "Weitere Ferienhäuser"}</span>
          </Link>
        )}
      </div>

      <div className="searchhouse__lists">
        <Slider {...houseSliderSettings}>
          {houses?.map((house) => (
            <div key={house.id} className="">
              <button
                type="button"
                className={`objectfav fav-btn ${
                  favoriteList.find((f) => f.hid === house.id) ? "active" : ""
                }`}
                onClick={() =>
                  toggleFavorite({
                    hid: house.id,
                    dur: 0,
                    arv: "0001-01-01T00:00:00",
                    adu: 0,
                    pet: 0,
                  })
                }
              >
                <i
                  title="zu Favoriten hinzufügen"
                  className="flaticon-valentines-heart"
                ></i>
              </button>

              {house.discount && <div className="label-red">Rabatt</div>}
              {house.promo && (
                <div className={`label-green ${house.promoCssClass}`}>
                  {house.promo}
                </div>
              )}

              <Slider {...imageSliderSettings}>
                {house.images.map((image, index) => (
                  <div key={index} className="cottage-card-item">
                    <Link href={house.url}>
                      <div className="cottage-teaserimg">
                        <div>
                          <picture>
                            <Image
                              height={300}
                              width={254}
                              src={image.url}
                              alt={image.altText}
                              className="lazy"
                              style={{
                                width: "100%",
                                height: "auto",
                              }}
                              quality={75}
                              placeholder="blur"
                              loading="eager"
                              blurDataURL={optimizedImage(
                                image.url,
                                254,
                                10,
                                true
                              )}
                            />
                          </picture>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </Slider>

              <Link href={house.url} className="cottage-card">
                <div className="cottage-teaserinfo">
                  <div>
                    <small>FERIENHAUS {house.lodgingName}</small>
                    <div className="c-title">{house.address}</div>
                    <span className="info">{house.locationName}</span>
                    <div className="objectrating">
                      {house.rating}/5
                      <div className="rating-gold">
                        {Array.from({ length: house.rating }, (_, index) => (
                          <div key={index} className="rating-star">
                            <i className="star"></i>
                          </div>
                        ))}
                      </div>
                      <div className="rating-gray">
                        {Array.from(
                          { length: 5 - house.rating },
                          (_, index) => (
                            <div key={index} className="rating-star">
                              <i className="star"></i>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                    <div className="objectdetail">
                      <div className="teaser-details">
                        <span>
                          <i title="Personen" className="flaticon-group"></i>
                          {house.person}
                        </span>
                        {house.pets > 0 && (
                          <span>
                            <i
                              title="Haustier erlaubt"
                              className="flaticon-pawprint"
                            ></i>
                            {house.pets}
                          </span>
                        )}
                        <span>
                          <i
                            title="Abstand Küste"
                            className="flaticon-swimming"
                          ></i>
                          {house.distToCoast} m
                        </span>
                        {house.facilities.map((facility, index) => (
                          <span key={index}>
                            <i
                              title={facility.name}
                              className={facility.iconClass}
                            ></i>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="teaser-pricecontent">
                    <div>
                      <div className="teaser-arrivaldeparture">
                        {house.arrivalDepature}
                      </div>
                      {house.hasDiscount && (
                        <div className="teaser-oldprice">
                          {house.normalPrice}
                        </div>
                      )}
                      <div className="teaser-price">{house.price}</div>
                    </div>
                    <div className="teaser-place">{house.location.label}</div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default SearchHouseWidget;
