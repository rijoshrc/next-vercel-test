import Image from "next/image";
import React, { useState } from "react";
import { Facility } from "./types";

interface FacilitiesProps {
  maxPerson: number;
  bedrooms: number;
  bathrooms: number;
  maxPets: number;
  distToCoast: number;
  // distToShopping?: number;
  houseArea: number;
  area?: number;
  facilitiesFromFilter: Array<{
    iconClassName: string;
    name: string;
  }>;
  facilities: Facility[];
}

const Facilities: React.FC<FacilitiesProps> = ({
  maxPerson,
  bedrooms,
  bathrooms,
  maxPets,
  distToCoast,
  // distToShopping,
  houseArea,
  area,
  facilitiesFromFilter,
  facilities,
}) => {
  const [isOverviewVisible, setIsOverviewVisible] = useState(false);

  const facilityGroups = facilities
    .filter((x) => !x.hidden && x.title)
    .sort((a, b) =>
      a.groupApiId > 0
        ? a.groupSortNumber - b.groupSortNumber
        : Number.MAX_VALUE - a.groupSortNumber || a.sortNumber - b.sortNumber
    )
    .reduce((groups, facility) => {
      const group = facility.group || "Others";
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(facility);
      return groups;
    }, {} as Record<string, Facility[]>);

  return (
    <div>
      <div className="facility__label">Einrichtung</div>

      <div className="overview">
        <div className="overview__header">Überblick</div>

        <div className="overview__lists">
          <span>
            <i className="flaticon-group"></i>
            {maxPerson} Personen
          </span>

          {bedrooms > 0 && (
            <span>
              <i className="flaticon-bed-1"></i>
              {bedrooms} Schlafzimmer
            </span>
          )}

          {bathrooms > 0 && (
            <span>
              <i className="flaticon-bathtub"></i>
              {bathrooms} Badezimmer
            </span>
          )}

          {maxPets > 0 && (
            <span>
              <i className="flaticon-pawprint"></i>
              {maxPets} Haustier
            </span>
          )}

          <span>
            <i className="flaticon-ferry"></i>
            {distToCoast}m zur Küste
          </span>
          {/* <span>
            <i className="flaticon-shopping-cart"></i>
            {distToShopping}m zum Einkaufen
          </span> */}
          <span>
            <i className="flaticon-house"></i>
            {houseArea}m² Ferienhaus
          </span>

          {area && area > 0 && (
            <span>
              <i className="flaticon-field"></i>
              {area}m² Areal
            </span>
          )}

          {facilitiesFromFilter.map((facility, index) => (
            <span key={index}>
              <i className={facility.iconClassName}></i>
              {facility.name}
            </span>
          ))}
        </div>
      </div>

      {Object.keys(facilityGroups).length > 0 && (
        <div
          id="overview__hidden"
          className={`overview__hidden collapse ${
            isOverviewVisible ? "show" : ""
          }`}
        >
          {Object.entries(facilityGroups).map(
            ([groupName, facilities], index) => (
              <div key={index}>
                <section
                  className={`section__divider section__divider--fullwidth ${
                    facilities[0].groupHideOnPrint ? "hide-on-print" : ""
                  }`}
                >
                  <div className="container">
                    <div className="divider"></div>
                  </div>
                </section>

                <div
                  className={`overview ${
                    facilities[0].groupHideOnPrint ? "hide-on-print" : ""
                  }`}
                >
                  <div className="overview__header">{groupName}</div>
                  <div className="overview__lists">
                    {facilities.map((facility, idx) => (
                      <span
                        key={idx}
                        className={facility.hideOnPrint ? "hide-on-print" : ""}
                      >
                        {facility.frontendDisplay}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}

      <button
        type="button"
        className="button__icon"
        id="show-facilities"
        onClick={() => setIsOverviewVisible(!isOverviewVisible)}
        aria-expanded={isOverviewVisible}
        aria-controls="overview__hidden"
      >
        <span>ALLE ANZEIGEN</span>
        <span>
          <Image
            className="icon"
            src="/images/svg/chevron-down.svg"
            alt="Icon"
            width={16}
            height={16}
          />
        </span>
      </button>
    </div>
  );
};

export default Facilities;
