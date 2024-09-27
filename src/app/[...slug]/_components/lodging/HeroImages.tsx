import Link from "next/link";
import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Image as ImageType } from "./types";

interface LodgingHeroGalleryProps {
  images: ImageType[];
}

const LodgingHeroGallery: React.FC<LodgingHeroGalleryProps> = ({ images }) => {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const mainImage = images[0];
  const otherFourImages = images.slice(1, 5);
  const totalImages = images.length;
  const remainingNumberOfImages = totalImages - 5;
  const moreImages = images.slice(5);

  const handleImageClick = (index: number) => {
    setCurrentIndex(index);
    setOpen(true);
  };

  const slides = images.map((image) => ({
    src: image.url,
    alt: image.name || "House Details Image",
  }));

  const settings = {
    dots: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    className: "searchresult-slider",
  };

  return (
    <section className="section__herogallery">
      {/* Mobile Slider */}
      <div className="hidden-desktop">
        <Slider {...settings}>
          {images.slice(0, 5).map((image, index) => (
            <div key={image.id} onClick={() => handleImageClick(index)}>
              <img
                src={
                  image.url +
                  "?anchor=center&mode=crop&width=1800&height=1200&rnd=132773638790500000&"
                }
                alt={image.name || "House Details Image"}
              />
            </div>
          ))}
        </Slider>
        <div className="preview-menu-m">
          <div
            className="show-more-m"
            onClick={() => handleImageClick(5)}
            style={{ cursor: "pointer" }}
          >
            {remainingNumberOfImages} Weitere Fotos
          </div>
        </div>
      </div>

      {/* Desktop Grid */}
      <div className="preview-grid visible-desktop">
        <div className="col-sm-6 preview preview__slider">
          {!!mainImage && (
            <div
              className="main-preview preview-box preview__slider-item"
              onClick={() => handleImageClick(0)}
              style={{ cursor: "pointer" }}
            >
              <picture>
                <img
                  src={
                    mainImage.url +
                    "?anchor=center&mode=crop&width=1800&height=1200&rnd=132773638790500000&"
                  }
                  alt={mainImage.name || "House Details Image"}
                />
              </picture>
            </div>
          )}

          {otherFourImages.length > 0 &&
            otherFourImages.map((image, index) => (
              <div
                className="preview-img preview__slider-item"
                key={image.id}
                onClick={() => handleImageClick(index + 1)}
                style={{ cursor: "pointer" }}
              >
                <picture>
                  <img
                    src={
                      image.url +
                      "?anchor=center&mode=crop&width=1800&height=1200&rnd=132773638790500000&"
                    }
                    alt={image.name || "House Details Image (Mobile)"}
                  />
                </picture>
              </div>
            ))}
        </div>

        <div className="col-sm-6 preview-element">
          <div>
            {otherFourImages.slice(0, 2).map((image, index) => (
              <div
                className="preview-img"
                key={image.id}
                onClick={() => handleImageClick(index + 1)}
                style={{ cursor: "pointer" }}
              >
                <picture>
                  <img
                    src={
                      image.url +
                      "?anchor=center&mode=crop&width=1800&height=1200&rnd=132773638790500000&"
                    }
                    alt="House Details Image"
                  />
                </picture>
              </div>
            ))}
          </div>
          <div className="preview-wrapper">
            {otherFourImages.length > 0 &&
              otherFourImages.slice(2, 4).map((image, index) => (
                <div
                  className="preview-img"
                  key={image.id}
                  onClick={() => handleImageClick(index + 3)}
                  style={{ cursor: "pointer" }}
                >
                  <picture>
                    <img
                      src={
                        image.url +
                        "?anchor=center&mode=crop&width=1800&height=1200&rnd=132773638790500000&"
                      }
                      alt="House Details Image"
                    />
                  </picture>
                </div>
              ))}
          </div>
        </div>

        {remainingNumberOfImages > 0 && moreImages[0] && (
          <>
            <div className="preview-menu-m">
              <div
                className="show-more-m"
                onClick={() => handleImageClick(5)}
                style={{ cursor: "pointer" }}
              >
                {remainingNumberOfImages} Weitere Fotos
              </div>

              {moreImages.slice(1).map((image, index) => (
                <div
                  className="hidden-desktop"
                  key={image.id}
                  onClick={() => handleImageClick(index + 6)}
                  style={{ cursor: "pointer" }}
                ></div>
              ))}
            </div>

            <div className="preview-menu">
              <div className="favobject">
                <i className="flaticon-heart-1 favicon"></i>
              </div>

              <Link
                className="show-more"
                href="#"
                data-toggle="lightbox"
                data-gallery="gallery"
                onClick={(e) => {
                  e.preventDefault();
                  handleImageClick(5);
                }}
              >
                + {remainingNumberOfImages}
              </Link>

              {moreImages.slice(1).map((image) => (
                <Link
                  key={image.id}
                  className="hidden"
                  href={`${image.url}?width=1800`}
                  data-toggle="lightbox"
                  data-gallery="gallery"
                />
              ))}
            </div>
          </>
        )}
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        index={currentIndex}
        styles={{
          container: { backgroundColor: "rgba(0, 0, 0, .5)" },
          button: { color: "white", outline: "none" },
        }}
      />
    </section>
  );
};

export default LodgingHeroGallery;

const NextArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <button
      className={className}
      style={{ ...style }}
      onClick={onClick}
      aria-label="Next"
    >
      Next
    </button>
  );
};

const PrevArrow = (props: any) => {
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
