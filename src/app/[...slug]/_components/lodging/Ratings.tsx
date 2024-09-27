import React, { useEffect, useRef, useState } from "react";
import { CategoryAverageRatings, Comment } from "./types";

interface RatingProps {
  categoryAverageRatings: CategoryAverageRatings;
  // categoryRatings: CategoryRating[];
  comments: Comment[];
  ratingStarValue: number;
}

const Ratings: React.FC<RatingProps> = ({
  categoryAverageRatings,
  comments,
  ratingStarValue,
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

  const getRating = (value: number) => {
    return (
      <>
        {Array.from({ length: 5 }, (_, i) => (
          <div className={i < value ? "rating-gold" : "rating-gray"} key={i}>
            <div className="rating-star">
              <i className="star"></i>
            </div>
          </div>
        ))}
      </>
    );
  };

  const getCategoryRating = (ratingValue: number, value: string = "") => {
    return (
      <div className="rating__lists-item">
        {getRating(ratingValue)}
        <span>{value}</span>
      </div>
    );
  };

  const handleToggle = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsExpanded(!isExpanded);
  };

  const renderCategoryRating = () => {
    return (
      <div className="rating__average">
        <div className="rating__average-title">
          Durchschittsbewertung
          {categoryAverageRatings ? (
            <>
              {getCategoryRating(
                Math.round(categoryAverageRatings.ratingValue),
                categoryAverageRatings.ratingValue.toFixed(1)
              )}
              <span className="rating-count">
                &nbsp;(
                {categoryAverageRatings.ratingsCount +
                  comments.filter((x) => x.canEdit).length}{" "}
                Bewertungen)
              </span>
            </>
          ) : (
            getCategoryRating(ratingStarValue, ratingStarValue + "")
          )}
        </div>
        {categoryAverageRatings && (
          <div className="rating__average-columns">
            <div className="column">
              Ferienhaus
              {getCategoryRating(
                Math.round(
                  categoryAverageRatings?.holidayHomeAverageRating || 0
                ),
                categoryAverageRatings?.holidayHomeAverageRating.toFixed(1)
              )}
            </div>

            <div className="column">
              Grundstück
              {getCategoryRating(
                Math.round(categoryAverageRatings?.propertyAverageRating || 0),
                categoryAverageRatings?.propertyAverageRating.toFixed(1)
              )}
            </div>

            <div className="column">
              Urlaubsgebiet
              {getCategoryRating(
                Math.round(
                  categoryAverageRatings?.vacationAreaAverageRating || 0
                ),
                categoryAverageRatings?.vacationAreaAverageRating.toFixed(1)
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="card" ref={accordionRef}>
      <div className="card-header" role="tab" id="ratingHeading">
        <a
          className="collapsed"
          data-toggle="collapse"
          href="#"
          aria-expanded={isExpanded}
          onClick={handleToggle}
        >
          <h2 className="card-title mb-0">
            Bewertung <i className="icon-chevron-down"></i>
          </h2>
        </a>
      </div>

      <div
        id="ratingBody"
        className={`collapse ${isExpanded ? "show" : ""}`}
        role="tabpanel"
      >
        <div className="card-body">
          <section className="section__ratingsandcomments">
            <div className="container">{renderCategoryRating()}</div>

            <div className="container">
              {comments
                .sort((a, b) => (b.date ? b.date.localeCompare(a.date) : 1))
                .map((comment, index) => {
                  const author = comment.author.startsWith("Gast aus")
                    ? comment.author
                    : "Gast aus Deutschland";

                  return (
                    <div className="rating__item" key={index}>
                      <div className="rating__column">
                        <div className="rating__title">
                          <div>{author}</div>
                          {comment.date && <div>am {comment.readableDate}</div>}
                        </div>

                        {/* Uncomment and adjust the following lines if you need to include the detailed ratings */}
                        {/* <div className="rating__lists">
                          <div className="rating__lists-item">
                            {getRating(comment.holidayHomeRating)}
                            <span>Ferienhaus</span>
                          </div>

                          <div className="rating__lists-item">
                            {getRating(comment.propertyRating)}
                            <span>Grundstück</span>
                          </div>

                          <div className="rating__lists-item">
                            {getRating(comment.vacationAreaRating)}
                            <span>Urlaubsgebiet</span>
                          </div>
                        </div> */}
                      </div>
                      <div className="rating__desc">{comment.comment}</div>
                    </div>
                  );
                })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Ratings;
