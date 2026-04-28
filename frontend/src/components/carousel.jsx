import { useState, useEffect } from "react";
import "./carousel.css";

function Carousel() {
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const images = [
    {
      image:"/image/KurtaSetsWebBanner.avif",
      title:"One",
    },
    {
      image:"/image/CasualShirtsWebBanner.avif",
      title:"Two",
    },
    {
      image:"/image/SlippersWebBanner.avif",
      title:"Three",
    },
  ];
  useEffect(() => {
    let interval;
    if (autoPlay) {
      interval = setInterval(() => {
        setCurrent((prev) =>
          prev === images.length - 1 ? 0 : prev + 1
        );
      }, 2500);
    }
   return () => clearInterval(interval);
  }, [autoPlay, images.length]);
  const slideRight = () => {
    setCurrent(current === images.length - 1 ? 0 : current + 1);
  };
  const slideLeft = () => {
    setCurrent(current === 0 ? images.length - 1 : current - 1);
  };
  return (
    <div
      className="carousel"
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
    >
      <div className="carousel_wrapper">
        {images.map((item, index) => (
          <div
            key={index}
            className={
              index === current
                ? "carousel_card carousel_card-active"
                : "carousel_card"
            }
          >
            <img
              className="card_image"
              src={item.image}
              alt={item.title}
            />
            <div className="card_overlay">
              <h2 className="card_title">{item.title}</h2>
            </div>
          </div>
        ))}
        <div className="carousel_arrow_left" onClick={slideLeft}>
          &#8249;
        </div>
        <div className="carousel_arrow_right" onClick={slideRight}>
          &#8250;
        </div>
        <div className="carousel_pagination">
          {images.map((_, index) => (
            <div
              key={index}
              className={
                index === current
                  ? "pagination_dot pagination_dot-active"
                  : "pagination_dot"
              }
              onClick={() => setCurrent(index)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Carousel;