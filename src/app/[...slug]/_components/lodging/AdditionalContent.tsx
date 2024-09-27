import React, { useEffect, useRef, useState } from "react";
import { AdditionalContent as AdditionalContentProps } from "./types";

interface AccordionProps {
  item: AdditionalContentProps;
}

const AdditionalContent: React.FC<AccordionProps> = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);

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

  const handleToggle = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="card" ref={accordionRef}>
      <div className="card-header" role="tab" id="headingOne1">
        <a
          data-toggle="collapse"
          data-parent="#accordionEx"
          href="#collapseOne1"
          aria-expanded={isExpanded}
          aria-controls="collapseOne1"
          onClick={handleToggle}
        >
          <h2 className="card-title mb-0">
            {item.properties.title} <i className="icon-chevron-down"></i>
          </h2>
        </a>
      </div>

      <div
        id="collapseOne1"
        className={`collapse ${isExpanded ? "show" : ""}`}
        role="tabpanel"
        aria-labelledby="headingOne1"
        data-parent="#accordionEx"
      >
        <div className="card-body">
          <div
            dangerouslySetInnerHTML={{
              __html: item.properties.mainText?.markup,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdditionalContent;
