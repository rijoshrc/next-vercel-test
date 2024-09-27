import {
  GoogleMap,
  InfoWindow,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import { mapStyles } from "../_data/mapStyle";
import { useFavorite } from "@/lib/context/FavoriteContext";

export interface MapLocation {
  id: number;
  lat: number;
  lon: number;
  person: number;
  pets: number;
  bedrooms: number;
  bathrooms: number;
  houseArea: number;
  distToCoast: number;
  isFjord: boolean;
  images: Image[];
  rating: number;
  ratingDisplay: string;
  isFavorite: boolean;
  address: string;
  name: string;
  promo: string;
  promoCssClass: string;
  price: string;
  url: string;
  label: string;
  mapImageUrl: string;
}

interface Image {
  altText: string;
  url: string;
}

interface MapProps {
  locations: MapLocation[];
  hoveredLocation: MapLocation | null;
  favDate: string;
  favDuration: number;
  favPerson: number;
  favPets: number;
}

const containerStyle = {
  width: "100%",
  height: "100%",
};

// const center = {
//   lat: 55.51915051495868,
//   lng: 10.32886146250001,
// };

const NextArrow: React.FC<any> = (props) => {
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

const PrevArrow: React.FC<any> = (props) => {
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

const MeerMap: React.FC<MapProps> = ({
  locations,
  hoveredLocation,
  favDate,
  favDuration,
  favPerson,
  favPets,
}) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(
    null
  );
  const [mapCenter, setMapCenter] = useState({
    lat: 55.51915051495868,
    lng: 10.32886146250001,
  });

  const { toggleFavorite, favoriteList } = useFavorite();

  const mapRef = useRef<google.maps.Map | null>(null);
  const boundsRef = useRef<google.maps.LatLngBounds | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    // Clear previous markers
    if (markersRef.current.length > 0) {
      markersRef.current.forEach((marker) => marker.setMap(null)); // Remove marker from the map
      markersRef.current = []; // Clear the markers array
    }

    if (locations.length === 0) {
      // If there are no locations, close the InfoWindow
      setSelectedLocation(null);
    }

    if (mapRef.current && locations.length > 0) {
      boundsRef.current = new google.maps.LatLngBounds();
      locations.forEach((loc) => {
        if (loc.lat !== 0 && loc.lon !== 0) {
          const marker = new google.maps.Marker({
            position: new google.maps.LatLng(loc.lat, loc.lon),
            icon: "/images/svg/tick-marker.svg",
            map: mapRef.current,
          });

          marker.addListener("click", () => handleMarkerClick(loc));
          boundsRef.current?.extend(marker.getPosition() as google.maps.LatLng);
          markersRef.current.push(marker); // Store marker reference
        }
      });
      // Fit map bounds if there are valid locations
      // if (boundsRef.current && locations.length > 0) {
      //   mapRef.current.fitBounds(boundsRef.current);
      // }
    }
  }, [locations]);

  useEffect(() => {
    if (hoveredLocation && mapRef.current) {
      // const latLng = new google.maps.LatLng(
      //   hoveredLocation.lat,
      //   hoveredLocation.lon
      // );
      // mapRef.current.panTo(latLng);
      if (hoveredLocation) {
        setSelectedLocation(hoveredLocation);
        setMapCenter({ lat: hoveredLocation.lat, lng: hoveredLocation.lon });
      }
    }
  }, [hoveredLocation]);

  const handleMarkerClick = (location: MapLocation) => {
    setSelectedLocation(location);
  };

  const handleCloseClick = () => {
    setSelectedLocation(null);
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div id="map__container">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={7.5}
        options={{ styles: mapStyles }}
        onLoad={(map) => {
          mapRef.current = map;
        }}
      >
        {locations.map((loc) => (
          <Marker
            key={loc.id}
            position={{ lat: loc.lat, lng: loc.lon }}
            onClick={() => handleMarkerClick(loc)}
            icon="/images/svg/tick-marker.svg"
          />
        ))}

        {selectedLocation && (
          <InfoWindow
            position={{ lat: selectedLocation.lat, lng: selectedLocation.lon }}
            onCloseClick={handleCloseClick}
          >
            <div id="infowindow">
              <button
                type="button"
                className="objectfav"
                id="objectFavBtn"
                onClick={() =>
                  toggleFavorite({
                    hid: selectedLocation.id,
                    dur: favDuration,
                    arv: favDate,
                    adu: favPerson,
                    pet: favPets,
                  })
                }
              >
                <i
                  className={
                    favoriteList.find((f) => f.hid === selectedLocation.id)
                      ? "flaticon-valentines-heart-red"
                      : "flaticon-valentines-heart"
                  }
                ></i>
              </button>

              <Slider {...settings} className="infowindow__slider">
                {selectedLocation.images.map((image, index) => (
                  <div key={index} className="infowindow__slider-item">
                    <img src={image.url} alt={image.altText} />
                  </div>
                ))}
              </Slider>

              <div className="infowindow__content">
                <div className="infowindow__objectnumber">
                  {selectedLocation.address}
                </div>
                <div className="infowindow__objectname">
                  {selectedLocation.name}
                </div>
                <div className="infowindow__objectrating">
                  {selectedLocation.ratingDisplay}/5
                  <div className="rating-gold">
                    {[...Array(Math.floor(selectedLocation.rating))].map(
                      (_, i) => (
                        <div key={i} className="rating-star">
                          <i className="star"></i>
                        </div>
                      )
                    )}
                  </div>
                  <div className="rating-gray">
                    {[...Array(5 - Math.floor(selectedLocation.rating))].map(
                      (_, i) => (
                        <div key={i} className="rating-star">
                          <i className="star"></i>
                        </div>
                      )
                    )}
                  </div>
                </div>
                <div className="infowindow__objectdetail">
                  <span>{selectedLocation.person} Personen</span> ·
                  {selectedLocation.pets > 0 && (
                    <span>{selectedLocation.pets} Tiere</span>
                  )}{" "}
                  ·<span>{selectedLocation.bedrooms} Schlafzimmer</span> ·
                  <span>{selectedLocation.bathrooms} Badezimmer</span> ·
                  <span>{selectedLocation.houseArea}m² Wohnfläche</span> ·
                  <span>
                    {selectedLocation.distToCoast}m bis zum{" "}
                    {selectedLocation.isFjord ? "Fjord" : "Meer"}
                  </span>
                </div>
                <div className="infowindow__objectprice">
                  {selectedLocation.price}
                </div>
                <Link className="button" href={selectedLocation.url}>
                  Zum angebot
                </Link>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default MeerMap;
