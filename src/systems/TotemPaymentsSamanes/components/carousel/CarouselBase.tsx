import styles from "./carouselBase.module.css";
import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import error_img from "../../../../assets/error/no_image.svg";
import arrow from "../../../../assets/arrow.svg";

interface CarruselBaseProps {
  images: string[];
  size: string;
  relationImg: string;
  quantity: number
}

const CarruselBase: React.FC<CarruselBaseProps> = ({
  images,
  size,
  relationImg,
  quantity
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    dragFree: true,
    containScroll: false,
  });
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();
  const scrollTo = (index: number) => emblaApi && emblaApi.scrollTo(index);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className={styles.embla} style={{ maxWidth: `${size}rem` }}>
      <div className={styles.embla__viewport} ref={emblaRef}>
        <div className={styles.embla__container}>
          {images.map((img, index) => (
            <div className={styles.embla__slide} style={{ flex: `0 0 calc(100% / ${quantity ? quantity : 3})` }} key={index}>
              <img
                style={{ aspectRatio: relationImg }}
                src={img}
                alt={`Slide ${index + 1}`}
                onError={(e) => {
                  const imgEl = e.currentTarget as HTMLImageElement;
                  imgEl.onerror = null;
                  imgEl.src = error_img;
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <>
          {/* arrows */}
          <div className={styles.embla__buttons}>
            <button className={styles.embla__prev} onClick={scrollPrev}>
              <img src={arrow} />
            </button>
            <button className={styles.embla__next} onClick={scrollNext}>
              <img src={arrow} />
            </button>
          </div>
          {/* dots */}
          <div className={styles.embla__dots}>
            {images.map((_, index) => (
              <button
                key={index}
                className={`${styles.embla__dot} ${
                  index === selectedIndex ? styles.isSelected : ""
                }`}
                onClick={() => scrollTo(index)}
              ></button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CarruselBase;
