import React, { Suspense, useEffect, useRef } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "~/sanity/client";

const TawkTo = React.lazy(() => import("~/components/TwakTo"));
const builder = imageUrlBuilder(client);
const urlFor = (source: any) =>
  builder.image(source).width(400).height(300).fit("crop").url();

type Car = { name: string; bodyType: string; value: number; img: string };

const cars: Car[] = [
  {
    name: "Cybertruck",
    img: "/Cybertruck.jpg",
    bodyType: "Truck",
    value: 80000,
  },
  { name: "Model Y", img: "/Model-Y.jpg", bodyType: "SUV", value: 30000 },
  {
    name: "Model 3",
    img: "/Model-3.jpg",
    bodyType: "Sporty Sedan",
    value: 20000,
  },
  {
    name: "Model S",
    img: "/Model-S.jpg",
    bodyType: "Luxury Sedan",
    value: 30000,
  },
  {
    name: "Model X",
    img: "/Model-X.jpg",
    bodyType: "Luxury SUV",
    value: 40000,
  },
];



export default function HomePage() {
  const { t, i18n } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    videoRef.current?.play().catch(() => {
    });
  }, []);

  // Format price according to locale
  const formatPrice = (val: number) =>
    new Intl.NumberFormat(i18n.language, {
      style: "currency",
      currency: "EUR",
    }).format(val);
  
  const CarSlideshow = ({ cars: [] }) => {
    return (
      <div className="snap-x snap-proximity relative overflow-y flex transition-transform duration-500 ease-in-out gap-4 lg:gap-8 px-4 lg:px-10 overflow-y-auto scrollbar-hide ">
        {cars.map((car, i) => (
          <div
            key={car.name}
            className="slide relative snap-center aspect-[330/520] min-w-[330px] h-[520px] lg:aspect-[1024/580] lg:min-w-[1024px] lg:h-[580px] rounded-lg flex-shrink-0 drop-shadow-lg"
          >
            <img
              src={car.img}
              alt={car.name}
              className="absolute inset-0 w-full h-full object-cover rounded-lg z-0 brightness-90"
            />
            <div className="relative z-10 text-white p-4 lg:p-10 grid grid-rows-3 h-full">
              <h1 className="text-sm lg:text-lg">{car.bodyType}</h1>
              <div className="row-span-2 flex flex-col justify-end gap-2">
                <h2 className="font-bold text-xl lg:text-5xl">{car.name}</h2>
                <p className="font-medium text-base lg:text-2xl">
                  {t("homepage.from")} {formatPrice(car.value)}
                </p>
                <div className="flex gap-2 lg:w-1/2 text-center">
                  <Link
                    to={`/cars?brand=Tesla&model=${car.name
                      .toLowerCase()
                      .replace(" ", "-")}`}
                    className="flex-1/2 p-2 lg:p-4 rounded-lg bg-white text-black font-bold border border-white/40 hover:bg-white/10 backdrop-blur-2xl hover:text-white transition active:scale-95"
                  >
                    {t("order")}
                  </Link>
                  <Link
                    to={`/info?model=${car.name
                      .toLowerCase()
                      .replace(" ", "-")}`}
                    className="flex-1/2 p-2 lg:p-4 rounded-lg bg-black text-white font-bold border border-white/40 hover:bg-white/10 backdrop-blur-2xl transition active:scale-95"
                  >
                    {t("learnMore")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  const TestDriveFooter = () => {
    return (
      <div className="sticky bottom-0 z-30 w-full border-t border-black/10 dark:border-white/20 bg-white/50 dark:bg-black/50 p-2 mt-12 text-center text-gray-500 dark:text-zinc-400 backdrop-blur-sm">
        <Link
          to="/contact"
          className="flex gap-1 align-middle w-fit mx-auto bg-white dark:bg-zinc-700  border border-black/10 dark:border-white/10 py-2 px-4 rounded  hover:bg-gray-100 dark:hover:bg-zinc-600 transition animate-pulse hover:animate-none"
          title="Kerko Test Drive"
        >
          <img
            src="https://maxus.sa/wp-content/uploads/2024/04/testdrive-icon.png"
            alt=""
            className="inline-block w-6 h-6 mr-2 align-middle dark:invert"
          />
          <span className="text-gray-900 dark:text-zinc-100 font-semibold">
            Test Drive
          </span>
        </Link>
      </div>
    );
  }
  const HeroSection = () =>{
    return (
      <section
        id="main-content"
        className="relative h-[95vh] overflow-hidden bg-gradient-to-b from-gray-900 to-black snap-center -translate-y-[68px]"
      >
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-label="Highway at dusk"
          >
            <source src="/background.mp4" type="video/mp4" />
            <source src="/background.webm" type="video/webm" />
          </video>
          <div className="absolute inset-0 bg-black/40 " />
        </div>
        <div className="container mx-auto px-4 h-full flex items-center text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight">
              Permakinat.al
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10">
              {t("homepage.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/cars?brand=tesla"
                className="px-8 py-4 rounded-lg bg-white text-black font-bold text-lg hover:bg-gray-100 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-105 transition shadow-lg"
              >
                {t("homepage.browseTeslas")}
              </Link>
              <Link
                to="/cars"
                className="px-8 py-4 rounded-lg bg-black text-white font-bold text-lg border border-white/20 hover:bg-white/10 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-105 transition"
              >
                {t("homepage.browseAllCars")}
              </Link>
            </div>
            <div className="absolute bottom-8 inset-x-0 flex justify-center">
              <svg
                className="w-6 h-6 animate-bounce text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>
    );
  }
  return (
    <main className="min-h-screen flex flex-col gap-8">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:bg-white focus:text-black p-2"
      >
        {t("skipToContent")}
      </a>
      <Suspense fallback={null}>
        <TawkTo />
      </Suspense>
      <HeroSection/>
      <CarSlideshow cars={cars} />
      <TestDriveFooter />
    </main>
  );
}
