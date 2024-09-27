import React from "react";

export interface CalendarLowestRateItemModel {
  code: string;
  price: string;
}

interface Props {
  rates: CalendarLowestRateItemModel[];
}

const SeasonalMarkingComponent: React.FC<Props> = ({ rates }) => {
  const getLegendClass = (code: string | null): string => {
    if (!code) {
      return "";
    }

    const firstChar = code.charAt(0);
    switch (firstChar) {
      case "A":
        return "legend__red";
      case "B":
        return "legend__yellow";
      case "C":
        return "legend__bluegreen";
      case "D":
        return "legend__orange";
      case "E":
        return "legend__green";
      case "F":
        return "legend__blue";
      default:
        return "";
    }
  };

  return (
    <div>
      <p>Seasonal Marking:</p>
      <ul style={{ marginBottom: "16px" }}>
        {rates.map((rate, index) => (
          <li key={index}>
            <div className={`legend ${getLegendClass(rate.code)}`}></div>
            <div className="rate">{rate.code}</div>
          </li>
        ))}
        <li style={{ width: "190px" }}>
          <div className="legend"></div>
          <div className="rate">nicht verfügbar (verblasst)</div>
        </li>
      </ul>
      <strong>Preis nach Auswahl in Popup</strong>
    </div>
  );
};

export default SeasonalMarkingComponent;
