import React, { useEffect, useRef, useState } from "react";

interface ServiceInformationProps {
  serviceInformationText: string;
}

const ServiceInformation: React.FC<ServiceInformationProps> = ({
  serviceInformationText,
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

  return (
    <div className="card" ref={accordionRef}>
      <div className="card-header" role="tab" id="headingThree4">
        <a
          className={`collapsed ${isExpanded ? "" : "collapsed"}`}
          data-toggle="collapse"
          data-parent="#accordionEx"
          href="#collapseThree4"
          aria-expanded={isExpanded}
          aria-controls="collapseThree4"
          onClick={handleToggle}
        >
          <h2 className="card-title mb-0">
            Serviceinformation <i className="icon-chevron-down"></i>
          </h2>
        </a>
      </div>

      <div
        id="collapseThree4"
        className={`collapse ${isExpanded ? "show" : ""}`}
        role="tabpanel"
        aria-labelledby="headingThree4"
        data-parent="#accordionEx"
      >
        <div className="card-body">
          <div dangerouslySetInnerHTML={{ __html: serviceInformationText }} />
        </div>
      </div>
    </div>
  );
};

export default ServiceInformation;
