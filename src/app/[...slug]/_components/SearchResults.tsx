import { useFavorite } from "@/lib/context/FavoriteContext";
import { useLodging } from "@/lib/context/LodgeListingContext";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import MeerMap, { MapLocation } from "./MeerMap";

type SearchResultsProps = {};

const NextArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <button
      className={className}
      style={{ ...style }}
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

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  adaptiveHeight: true,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  className: "searchresult-slider",
};

const SearchResults: React.FC<SearchResultsProps> = () => {
  const [hideMap, setHideMap] = useState(false);
  const [hoveredLocation, setHoveredLocation] = useState<MapLocation | null>(
    null
  );
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const pageRef = useRef<number>(1);

  const { items, loading, fetchData, hasMore } = useLodging();

  const { toggleFavorite, favoriteList } = useFavorite();

  const date = searchParams.get("startdate");
  const duration = searchParams.get("duration");
  const persons = searchParams.get("persons");
  const pets = searchParams.get("pets") || 0;

  // data to set to favorite list
  const splitDate = date?.split(".");
  const favDate = splitDate
    ? splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0] + "T00:00:00"
    : "";
  const favDuration = parseInt(duration || "0");
  const favPerson = parseInt(persons || "0");
  const favPets = parseInt(pets || "0");

  const toggleMap = () => {
    setHideMap(!hideMap);
  };

  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  useEffect(() => {
    const pageString = searchParams.get("page");
    pageRef.current = pageString ? parseInt(pageString) : 1;
    const footer = document.querySelector("footer");

    const handleScroll = () => {
      if (footer) {
        const currentScroll = window.scrollY;
        const threshold = footer.offsetTop - footer.offsetHeight - 500;
        if (currentScroll >= threshold && !loading) {
          fetchMoreData();
        }
      }
    };

    const debouncedHandleScroll = debounce(handleScroll, 200);

    window.addEventListener("scroll", debouncedHandleScroll);
    return () => {
      window.removeEventListener("scroll", debouncedHandleScroll);
    };
  }, [searchParams, hasMore, loading]);

  const fetchMoreData = async () => {
    pageRef.current += 1;
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    params["page"] = pageRef.current.toString();
    const newPath = `${pathname}?${new URLSearchParams(params).toString()}`;
    router.replace(newPath, { scroll: false });
    fetchData(new URLSearchParams(params).toString(), true);
  };

  const mapLocations: MapLocation[] = items.map((result) => ({
    id: result.id,
    lat: parseFloat(result.lat),
    lon: parseFloat(result.lon),
    person: result.person,
    pets: result.pets,
    bedrooms: result.bedrooms,
    bathrooms: result.bathrooms,
    houseArea: parseInt(result.houseArea),
    distToCoast: result.distToCoast,
    isFjord: result.isFjord,
    images: result.images,
    rating: result.rating,
    ratingDisplay: result.ratingDisplay,
    isFavorite: result.isFavorite,
    address: result.address,
    name: result.name,
    promo: result.promo,
    promoCssClass: result.promoCssClass,
    price: result.price,
    url: result.url,
    label: result.location.label,
    mapImageUrl: result.location.mapImageUrl,
  }));

  const renderRating = (rating: number) => {
    return (
      <>
        <div className="rating-gold">
          {[...Array(Math.floor(rating))].map((_, i) => (
            <div key={i} className="rating-star">
              <i className="star"></i>
            </div>
          ))}
        </div>
        <div className="rating-gray">
          {[...Array(5 - Math.floor(rating))].map((_, i) => (
            <div key={i} className="rating-star">
              <i className="star"></i>
            </div>
          ))}
        </div>
      </>
    );
  };

  const handleMouseEnter = useCallback(
    (location: MapLocation | null) => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
      const timeout = setTimeout(() => {
        setHoveredLocation(location);
      }, 500);
      setHoverTimeout(timeout);
    },
    [hoverTimeout]
  );

  const handleMouseLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    setHoveredLocation(null);
  };

  return (
    <section className={`section__search--results ${loading && "loading"}`}>
      <div className="search__content">
        <div className={`search__content--map ${hideMap ? "minimize" : ""}`}>
          <button
            type="button"
            className={`toggle__map ${hideMap && "active"}`}
            onClick={toggleMap}
          >
            <span>&lt;</span>
            <span>Karte</span>
          </button>

          <MeerMap
            locations={mapLocations}
            hoveredLocation={hoveredLocation}
            favDate={favDate}
            favPerson={favPerson}
            favPets={favPets}
            favDuration={favDuration}
          />
        </div>

        <div
          className={`search__content--results ${hideMap ? "maximize" : ""}`}
        >
          {items.map((result) => (
            <div
              key={result.id}
              className="searchresult-object"
              onMouseEnter={() =>
                handleMouseEnter(
                  mapLocations.find((location) => location.id === result.id) ||
                    null
                )
              }
              onMouseLeave={handleMouseLeave}
            >
              <div className="preview-slider">
                <button
                  type="button"
                  className="objectfav"
                  onClick={() =>
                    toggleFavorite({
                      hid: result.id,
                      dur: favDuration,
                      arv: favDate,
                      adu: favPerson,
                      pet: favPets,
                    })
                  }
                >
                  <i
                    className={
                      favoriteList.find((f) => f.hid === result.id)
                        ? "flaticon-valentines-heart-red"
                        : "flaticon-valentines-heart"
                    }
                  ></i>
                </button>
                <div className="searchresult-item">
                  <div className="objectimg">
                    {result.images.length > 0 && (
                      <Slider {...settings}>
                        {result.images.map((image, index) => (
                          <div key={index} className="searchresult-slider-item">
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
                    <div className="labels">
                      {result.noDeposit && (
                        <div className="deposit">keine Kaution</div>
                      )}
                      <div className="flexday">{result.day}</div>
                    </div>
                    {result.hasDiscount && (
                      <div className="objectdiscount">Rabatt</div>
                    )}
                    {result.promo && (
                      <div className={`objectcleaning ${result.promoCssClass}`}>
                        {result.promo}
                      </div>
                    )}
                  </div>

                  <div
                    className="objectdescription"
                    onClick={() => router.push(result.url)}
                  >
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
                            {renderRating(result.rating)}
                          </div>
                        </div>
                        <div className="objectdetail">
                          <span>
                            {result.person}{" "}
                            {result.person === 1 ? "Person" : "Personen"}
                          </span>{" "}
                          ·
                          {result.pets > 0 && (
                            <>
                              <span>
                                {" "}
                                {result.pets}{" "}
                                {result.pets === 1 ? "Tier" : "Tiere"}
                              </span>{" "}
                              ·{" "}
                            </>
                          )}{" "}
                          <span>{result.bedrooms} Schlafzimmer</span> ·{" "}
                          <span>{result.bathrooms} Badezimmer</span> ·{" "}
                          <span>{result.houseArea}m² Wohnfläche</span> ·{" "}
                          <span>
                            {result.distToCoast}m bis zum{" "}
                            {result.isFjord ? "Fjord" : "Meer"}
                          </span>
                          {result.facilities && (
                            <div className="objecticons">
                              {result.facilities.map((facility, index) => (
                                <div key={index} className="icon-wrapper">
                                  <i
                                    title={facility.name}
                                    className={facility.iconClass}
                                  ></i>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <span className="objectarea">
                          {result.location.label}
                          {result.arrivalDepature !== "" && (
                            <span>
                              |{" "}
                              <span className="arrival-depature">
                                {result.arrivalDepature}
                              </span>
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="object__rightcol">
                        <div className="objectrow">
                          {result.location.mapImageUrl && (
                            <Image
                              alt={result.location.name}
                              src={result.location.mapImageUrl}
                              className="objectlocation"
                              width={101}
                              height={100}
                            />
                          )}
                          <div className="objectprice">
                            {result.hasDiscount && (
                              <div className="objectoldprice">
                                {result.normalPrice}
                              </div>
                            )}
                            {result.price}
                          </div>
                          <button type="button" className="button">
                            Zum Angebot
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* {loading && <div className="loading"></div>} */}
        </div>
      </div>
    </section>
  );
};

export default SearchResults;
