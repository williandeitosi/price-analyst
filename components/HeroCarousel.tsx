"use client";

import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const heroImages = [
  { imgUrl: "assets/images/hero-1.svg", alt: "smartwatch" },
  { imgUrl: "assets/images/hero-2.svg", alt: "bag" },
  { imgUrl: "assets/images/hero-3.svg", alt: "lamp" },
  { imgUrl: "assets/images/hero-4.svg", alt: "air fryer" },
  { imgUrl: "assets/images/hero-5.svg", alt: "chair" },
];

const HeorCarousel = () => {
  return (
    <div className="hero-carousel">
      <Carousel
        showThumbs={false}
        autoPlay
        infiniteLoop
        interval={2000}
        showArrows={false}
        showStatus={false}
      >

        {heroImages.map((item) => (
          <Image
            key={item.alt}
            src={item.imgUrl}
            alt={item.alt}
            width={484}
            height={484}
          />
        ))}
      </Carousel>
    </div>
  );
};

export default HeorCarousel;
