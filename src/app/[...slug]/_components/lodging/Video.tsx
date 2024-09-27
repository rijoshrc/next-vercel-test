import React, { useEffect, useRef, useState } from "react";

interface VideoProps {
  youtubeEmbedUrl?: string;
}

const Video: React.FC<VideoProps> = ({ youtubeEmbedUrl }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!youtubeEmbedUrl) {
    return null;
  }

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
      <div className="card-header" role="tab" id="videoSection_header">
        <a
          className={`collapsed ${isExpanded ? "" : "collapsed"}`}
          href="#"
          aria-expanded={isExpanded}
          onClick={handleToggle}
        >
          <h2 className="card-title mb-0">
            Video <i className="icon-chevron-down"></i>
          </h2>
        </a>
      </div>

      <div
        id="videoSection_body"
        className={`collapse ${isExpanded ? "show" : ""}`}
        role="tabpanel"
        aria-labelledby="videoSection_header"
        data-parent="#accordionEx"
      >
        <div className="card-body">
          <div className="card-video">
            <iframe
              src={youtubeEmbedUrl}
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Video"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Video;
