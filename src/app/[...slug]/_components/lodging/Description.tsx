import React, { useEffect, useRef, useState } from "react";

interface DescriptionProps {
  descriptionHeading?: string;
  description?: string;
  descriptionOverride?: string;
}

const Description: React.FC<DescriptionProps> = ({
  descriptionHeading,
  description,
  descriptionOverride,
}) => {
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

  const displayDescription = descriptionOverride?.trim()
    ? descriptionOverride
    : description;

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
            Ferienhaus Vorstellung <i className="icon-chevron-down"></i>
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
          {descriptionHeading && (
            <h3 className="subheading">
              {descriptionHeading.replace(/\r?\n/g, "<br />")}
            </h3>
          )}

          {displayDescription && (
            <div
              dangerouslySetInnerHTML={{
                __html: displayDescription.replace(/<a[^>]*>(.*?)<\/a>/g, "$1"),
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Description;
