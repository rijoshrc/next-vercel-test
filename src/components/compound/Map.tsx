"use client";

import React, { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface Location {
  lat: number;
  lng: number;
  name: string;
}

interface MapComponentProps {
  locations: Location[];
  defaultLocation: Location;
}

const customMarkerIcon = L.icon({
  iconUrl: "/icons/placeholder.png",
  iconSize: [32, 48], // Adjust the size of the icon
  iconAnchor: [16, 48], // Adjust the anchor point of the icon
});

const ZOOM = 5;

// TODO:
// example props
// pass these to the components
// const locations = [
//   { lat: 51.505, lng: -0.09, name: "London" },
//   { lat: 48.856614, lng: 2.352222, name: "Paris" },
//   { lat: 41.9028, lng: 12.4964, name: "Rome" },
// ];

// const defaultLocation = { lat: 51.505, lng: -0.09, name: "London" };

const MapComponent: React.FC<MapComponentProps> = ({
  locations,
  defaultLocation,
}) => {
  const [map, setMap] = useState<L.Map | null>(null);
  const [center, setCenter] = useState<Location>(defaultLocation);

  useEffect(() => {
    if (map) {
      const bounds = locations.reduce(
        (bounds, location) => bounds.extend([location.lat, location.lng]),
        map.getBounds()
      );
      map.fitBounds(bounds);
    }
  }, [map, locations]);

  const markerEventHandlers = useMemo(
    () => ({
      click(e: L.LeafletMouseEvent) {
        const center = { ...e.latlng, name: "" } as Location;
        setCenter(center);
      },
    }),
    []
  );

  return (
    <>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={ZOOM}
        style={{ height: "500px", width: "100%" }}
        // @ts-ignore
        whenCreated={setMap}
      >
        <ChangeView center={center} zoom={ZOOM} />
        <TileLayer
          attribution="&copy;"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((location, index) => (
          <Marker
            key={index}
            position={[location.lat, location.lng]}
            icon={customMarkerIcon}
            eventHandlers={markerEventHandlers}
          >
            <Popup>{location.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
      <div>
        <ul className="flex flex-col gap-2 w-max mt-4 cursor-pointer">
          {locations.map((location) => (
            <li
              className="p-4 bg-red-200"
              key={location.lat}
              onMouseEnter={() => setCenter(location)}
            >
              {location.name}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default MapComponent;

function ChangeView({ center, zoom }: { center: Location; zoom: number }) {
  const map = useMap();
  map.setView(center, zoom, {
    animate: true,
  });
  return null;
}
