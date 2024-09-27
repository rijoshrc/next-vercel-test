import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import React, { useEffect, useRef, useState } from "react";

interface MapProps {
  latitude: number;
  longitude: number;
  attractions: string[];
}

const containerStyle = {
  width: "100%",
  height: "400px",
};

const Map: React.FC<MapProps> = ({ latitude, longitude, attractions }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const accordionRef = useRef<HTMLDivElement>(null);
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
    if (isLoaded && mapRef.current) {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(new google.maps.LatLng(latitude, longitude));
      mapRef.current.fitBounds(bounds);
    }
  }, [isLoaded, latitude, longitude]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const handleToggle = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="card" ref={accordionRef}>
      <div className="card-header" role="tab" id="headingTwo2">
        <a
          className={`collapsed`}
          data-toggle="collapse"
          data-parent="#accordionEx"
          href=""
          aria-expanded={isExpanded}
          aria-controls="collapseTwo2"
          onClick={handleToggle}
        >
          <h2 className="card-title mb-0">
            Lage und Umgebung <i className="icon-chevron-down"></i>
          </h2>
        </a>
      </div>

      <div
        id="collapseTwo2"
        className={`collapse ${isExpanded ? "show" : ""}`}
        role="tabpanel"
        aria-labelledby="headingTwo2"
        data-parent="#accordionEx"
      >
        <div className="card-body">
          <section className="section__map">
            <div className="container">
              <div
                className="map__container"
                style={{ width: "100%", height: "400px" }}
              >
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={{ lat: latitude, lng: longitude }}
                  zoom={12}
                  onLoad={(map) => {
                    mapRef.current = map;
                  }}
                >
                  <Marker position={{ lat: latitude, lng: longitude }} />
                </GoogleMap>
              </div>

              <ul className="distance__list">
                {attractions.map((attraction, index) => (
                  <li key={index}>
                    <span>{attraction}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Map;
