import Slider from "react-slick";
import { Image as ImageType } from "../../_types/booking";
import Image from "next/image";

type Props = {
  images: ImageType[];
};

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

const settings = {
  dots: false,
  infinite: true,
  autoplay: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  adaptiveHeight: true,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  className: "searchresult-slider",
};

const ImageSlider = ({ images }: Props) => {
  return (
    <div className="widget__item widget__slider">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div className="widget__slider-item" key={index}>
            <div className="bg-image">
              <Image
                src={image.imageUrl}
                alt={image.altText}
                width={635}
                height={477}
              />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageSlider;
