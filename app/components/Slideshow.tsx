import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Link } from "react-router";

export type Service = {
  serviceType:
    | "sales"
    | "diagnostics"
    | "maintenance"
    | "parts"
    | "upgrade"
    | "trade-in";
  title: string;
  description: string;
  img: string;
};


  
type Props = {
  slides: Service[] | any;
  t: (key: string) => string;
};

export default function SlideShow({ slides, t }: Props) {
  return (
    <div className="relative w-full">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        spaceBetween={32}
        slidesPerView={"auto"}
        centeredSlides={true}
        className="!px-4 lg:!px-10 "
      >
        {slides.map((slide: any) => (
          <SwiperSlide
            key={slide.title}
            className="!w-[330px] !h-[520px] lg:!w-[1024px] lg:!h-[580px] snap-center"
          >
            <div className="relative w-full h-full aspect-[330/520] lg:aspect-[1024/580] rounded-lg drop-shadow-lg overflow-hidden">
              <img
                src={slide.img}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover rounded-lg z-0 brightness-80"
              />
              <div className="relative z-10 text-white p-4 lg:p-10 grid grid-rows-3 h-full">
                <h1 className="text-sm lg:text-lg">{slide.serviceType}</h1>
                <div className="row-span-2 flex flex-col justify-end gap-4">
                  <h2 className="font-bold text-xl lg:text-5xl">
                    {slide.title}
                  </h2>
                  <div className="flex gap-2 lg:w-1/2 text-center">
                    <Link
                      to={`/contact?service=${slide.title
                        .toLowerCase()
                        .replace(" ", "-")}`}
                      className="flex-1/2 p-2 lg:p-4 rounded-lg bg-white text-black font-bold border border-white/40 hover:bg-white/10 backdrop-blur-2xl hover:text-white transition active:scale-95"
                    >
                      {t("bookService")}
                    </Link>
                    <Link
                      to={`/info/service?type=${slide.serviceType?.toLowerCase()}`}
                      className="px-6 py-3 rounded-lg bg-white/10 text-white font-medium hover:bg-white/20 backdrop-blur-2xl transition-colors"
                    >
                      {t("learnMore")}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
