"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";
import { useFavorite } from "@/lib/context/FavoriteContext";
import contentApi from "@/constants/contentApi";
import httpClient from "@/services/api/httpClient";
import { useRouter } from "next/navigation";

interface Image {
  url: string;
  altText: string;
}

interface Facility {
  name: string;
  iconClass: string;
}

interface Location {
  label: string;
  mapImageUrl: string;
}

interface FavoriteResult {
  id: number;
  url: string;
  lodgingName: string;
  name: string;
  address: string;
  price: string;
  normalPrice: string;
  date: string;
  person: number;
  duration: number;
  pets: number;
  bedrooms: number;
  bathrooms: number;
  houseArea: string;
  distToCoast: number;
  facilities: Facility[];
  location: Location;
  discount: string;
  promo: string;
  ratingDisplay: string;
  images: Image[];
  hasDiscount: boolean;
  day: string;
  noDeposit: boolean;
  isFjord: boolean;
}

interface FavoritesPageProps {
  data: {
    name: string;
    properties: {
      informationText: {
        markup: string;
      };
    };
  };
}

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  adaptiveHeight: true,
};

const FavoritesComponent: React.FC<FavoritesPageProps> = ({
  data: { name, properties },
}) => {
  const [results, setResults] = useState<FavoriteResult[] | null>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { clearFavorites, favoriteList, removeFavorite } = useFavorite();

  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await httpClient.post(`${contentApi.favorite}`, {
        body: favoriteList,
        headers: {
          "Content-Type": "application/json",
        },
      });
      setResults(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const renderRating = (rating: string) => {
    const stars = [];
    for (let i = 0; i < Math.floor(Number(rating)); i++) {
      stars.push(<i key={i} className="star"></i>);
    }
    return stars;
  };

  const renderGrayRating = (rating: string) => {
    const stars = [];
    for (let i = 0; i < 5 - Math.floor(Number(rating)); i++) {
      stars.push(<i key={i} className="star"></i>);
    }
    return stars;
  };

  const removeFromList = (id: number) => {
    setResults((prev) => prev?.filter((f) => f.id !== id) || []);
    removeFavorite(id);
  };

  return (
    <>
      <section className="section__caption section__favourites section__caption--green">
        <div className="container">
          <div className="caption caption-with-btn">
            <h1 className="heading">{name}</h1>
            <Link
              href="#"
              className="button__arrow history-back"
              onClick={router.back}
            >
              <span>Favoriten schliessen</span>
            </Link>
          </div>
        </div>
      </section>

      <section className={`section__favourites ${isLoading && "loading"}`}>
        <div className="container">
          {properties.informationText && (
            <div className="d-flex justify-content-end information-text">
              <div className="d-flex align-items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-info-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                </svg>
                <span
                  dangerouslySetInnerHTML={{
                    __html: properties.informationText.markup,
                  }}
                />
              </div>
            </div>
          )}

          {results?.map((result) => (
            <div key={result.id} className="favourites-object">
              <div className="preview-slider">
                <div className="favourites-item">
                  <button
                    type="button"
                    className="button__icon button__remove"
                    onClick={() => removeFromList(result.id)}
                  >
                    <span>Entfernen</span>
                    <span>
                      <img
                        className="icon"
                        src="/images/svg/close-btn-black.svg"
                        alt="Remove"
                      />
                    </span>
                  </button>

                  <div className="objectimg">
                    <div className="favourites-slider">
                      {result.images.length > 0 && (
                        <Slider {...settings}>
                          {result.images.map((image, index) => (
                            <div key={index} className="favourites-slider-item">
                              <div className="bg-image">
                                <Image
                                  alt={image.altText}
                                  src={image.url}
                                  width={474}
                                  height={227}
                                />
                              </div>
                            </div>
                          ))}
                        </Slider>
                      )}
                    </div>

                    <div className="labels">
                      {result.noDeposit && (
                        <div className="deposit">kein Kaution</div>
                      )}
                      <div className="flexday">{result.day}</div>
                    </div>

                    {result.hasDiscount && (
                      <div className="objectdiscount">Rabatt</div>
                    )}
                    {result.promo && (
                      <div className="objectcleaning">{result.promo}</div>
                    )}
                  </div>

                  <div className="objectdescription">
                    <div className="objectinfo">
                      <div className="object__leftcol">
                        <div className="objectname">
                          <div className="text-overflow">
                            <span className="objectnumber">{result.name}</span>
                          </div>
                          <span className="objectnickname">
                            {result.address}
                          </span>

                          <div className="objectrating">
                            {result.ratingDisplay}/5
                            <div className="rating-gold">
                              {renderRating(result.ratingDisplay)}
                            </div>
                            <div className="rating-gray">
                              {renderGrayRating(result.ratingDisplay)}
                            </div>
                          </div>

                          <div className="objectdetail">
                            <div className="objectdetail-item">
                              <span>
                                {result.person}{" "}
                                {result.person === 1 ? "Person" : "Personen"}
                              </span>
                            </div>
                            {result.pets > 0 && (
                              <span>
                                {result.pets}{" "}
                                {result.pets === 1 ? "Tier" : "Tiere"}
                              </span>
                            )}
                            <div className="objectdetail-item">
                              <span>{result.bedrooms} Schlafzimmer</span>
                            </div>
                            <div className="objectdetail-item">
                              <span>{result.bathrooms} Badezimmer</span>
                            </div>
                            <div className="objectdetail-item">
                              <span>{result.houseArea}m² Wohnfläche</span>
                            </div>
                            <div className="objectdetail-item">
                              <span>
                                {result.distToCoast}m bis zum{" "}
                                {result.isFjord ? "Fjord" : "Meer"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {result.facilities && (
                          <div className="objecticons">
                            {result.facilities.map((facility, idx) => (
                              <div key={idx} className="icon-wrapper">
                                <i
                                  title={facility.name}
                                  className={facility.iconClass}
                                ></i>
                              </div>
                            ))}
                          </div>
                        )}

                        <span className="objectarea">
                          {result.location.label}
                        </span>
                      </div>

                      <div className="object__rightcol">
                        <div className="objectrow">
                          <div className="button-top">
                            <button
                              type="button"
                              className="button__icon button__remove"
                              onClick={() => removeFromList(result.id)}
                            >
                              <span>Entfernens</span>
                              <span>
                                <img
                                  className="icon"
                                  src="/images/svg/close-btn-black.svg"
                                  alt="Remove"
                                />
                              </span>
                            </button>
                          </div>

                          {result.location && result.location.mapImageUrl && (
                            <img
                              alt={result.location.label}
                              src={result.location.mapImageUrl}
                              className="objectlocation"
                            />
                          )}

                          <Link href={result.url} className="button">
                            ZUM ANGEBOT
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default FavoritesComponent;
