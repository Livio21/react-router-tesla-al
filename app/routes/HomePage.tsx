import React, { Suspense, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "~/sanity/client";
import { ArrowDownIcon } from "~/components/Icons";
import Slideshow from "~/components/Slideshow";

const TawkTo = React.lazy(() => import("~/components/TwakTo"));
const builder = imageUrlBuilder(client);
const urlFor = (source: any) =>
  builder.image(source).width(1200).height(800).fit("crop").url();

type Car = { name: string; bodyType: string; value: number; img: string };

const cars: Car[] = [
  {
    name: "Cybertruck",
    img: "/Cybertruck.webp",
    bodyType: "Truck",
    value: 80000,
  },
  { name: "Model Y", img: "/Model-Y.jpg", bodyType: "SUV", value: 30000 },
  {
    name: "Model 3",
    img: "/Model-3.webp",
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
];const servicesOffered = [
  {
    serviceType: "sales",
    title: "Pre‑owned Tesla Sales",
    description:
      "Curated and fully inspected used Teslas, EU‑compliant and ready to drive.",
    img: "/bodyshop-hero-tesla.jpg",
  },
  {
    serviceType: "diagnostics",
    title: "Battery Health & Diagnostics",
    description:
      "Full battery diagnostics, charge‑cycle reporting, and range assessments.",
    img: "/teslabatterydiagnostics.jpg",
  },
  {
    serviceType: "maintenance",
    title: "Tesla Service & Maintenance",
    description:
      "Certified service for brakes, HVAC, software updates, and full system checks.",
    img: "/tesla-service.webp",
  },
  {
    serviceType: "parts",
    title: "Battery Pack Repair & Replacement",
    description:
      "High‑voltage pack repair, module swaps, or full replacement/upgrades.",
    img: "/Tesla-High-Voltage-Battery-reconditioning.jpg",
  },
  {
    serviceType: "parts",
    title: "OEM & Aftermarket Parts Service",
    description:
      "Genuine and certified aftermarket components—screens, sensors, drive units.",
    img: "/poster.jpg",
  },
  {
    serviceType: "trade-in",
    title: "Trade‑In & Resale Support",
    description:
      "Sell or trade your Tesla—we handle inspections, valuations, and listings.",
    img: "https://images.pexels.com/photos/97075/pexels-photo-97075.jpeg?auto=compress&cs=tinysrgb&w=1024&h=640",
  },
];

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Format price according to locale
  const formatPrice = (val: number) =>
    new Intl.NumberFormat(i18n.language, {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(val);

  // Auto-play video
  useEffect(() => {
    const playVideo = async () => {
      try {
        await videoRef.current?.play();
        setIsVideoPlaying(true);
      } catch (err) {
        console.log("Autoplay prevented, showing fallback");
      }
    };

    playVideo();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev === cars.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Hero Section
  const HeroSection = () => (
    <section
      id="main-content"
      className="relative h-screen min-h-[800px] overflow-hidden bg-gradient-to-b from-gray-900 to-black snap-center"
    >
      <div className="absolute inset-0 z-0">
        {isVideoPlaying ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            aria-label="Highway at dusk"
            onCanPlay={() => setIsVideoPlaying(true)}
            onError={() => setIsVideoPlaying(false)}
          >
            <source src="/background.mp4" type="video/mp4" />
          </video>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-900 to-indigo-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30" />
      </div>

      <div className="container mx-auto px-4 h-full flex items-center text-center relative z-10">
        <div className="max-w-4xl mx-auto animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight">
            <span className="bg-clip-text text-transparent bg-white/80 font-[]">
              {t("homepage.title")}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto">
            {t("homepage.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/cars?brand=tesla"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-lg hover:from-blue-700/70 hover:to-cyan-600/70 focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transform hover:scale-[1.03] transition duration-300 shadow-lg shadow-blue-500/20"
            >
              {t("homepage.browseTeslas")}
            </Link>
            <Link
              to="/cars"
              className="px-8 py-4 rounded-xl bg-transparent text-white font-bold text-lg border-2 border-white/30 hover:bg-white/10 focus:ring-2 focus:ring-offset-2 focus:ring-white transform hover:scale-[1.03] transition duration-300"
            >
              {t("homepage.browseAllCars")}
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 inset-x-0 flex justify-center animate-bounce">
        <a href="#car-showcase" className="text-white">
          <ArrowDownIcon className="w-8 h-8" />
        </a>
      </div>
    </section>
  );

  // Car Slideshow
  const CarSlideshow = () => {
    const handleSlideChange = (index: number) => {
      setActiveSlide(index);
    };

    return (
      <section
        id="car-showcase"
        className="py-16 lg:py-24 "
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold dark:text-white mb-4">
              {t("homepage.featuredCars")}
            </h2>
            <p className="dark:text-gray-300 max-w-2xl mx-auto">
              {t("homepage.featuredCarsDesc")}
            </p>
          </div>

          <div className="relative overflow-hidden rounded-2xl shadow-2xl max-w-6xl mx-auto">
            {/* Slides */}
            <div className="relative h-[500px] md:h-[600px]">
              {cars.map((car, index) => (
                <div
                  key={car.name}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    index === activeSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
                  <img
                    src={car.img}
                    alt={car.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-10 text-white">
                    <div className="max-w-4xl mx-auto">
                      <h3 className="text-sm md:text-base font-medium text-blue-300 mb-1">
                        {car.bodyType}
                      </h3>
                      <h2 className="text-2xl md:text-4xl font-bold mb-2">
                        {car.name}
                      </h2>
                      <p className="text-lg md:text-xl font-medium mb-6">
                        {t("homepage.from")} {formatPrice(car.value)}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <Link
                          to={`/cars?brand=Tesla&model=${car.name
                            .toLowerCase()
                            .replace(" ", "-")}`}
                          className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 backdrop-blur-2xl transition-colors"
                        >
                          {t("order")}
                        </Link>
                        <Link
                          to={`/info?model=${car.name
                            .toLowerCase()
                            .replace(" ", "-")}`}
                          className="px-6 py-3 rounded-lg bg-white/10 text-white font-medium hover:bg-white/20 backdrop-blur-2xl transition-colors"
                        >
                          {t("learnMore")}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute  hidden bottom-6 left-0 right-0 z-20 lg:flex justify-center gap-2">
              {cars.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleSlideChange(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === activeSlide
                      ? "bg-blue-500 scale-125"
                      : "bg-white/30 hover:bg-white/50"
                  }`}
                  aria-label={`View ${cars[index].name}`}
                />
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={() =>
                setActiveSlide(
                  activeSlide === 0 ? cars.length - 1 : activeSlide - 1
                )
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 flex items-center justify-center text-white hover:bg-black/50 transition-colors"
              aria-label="Previous car"
            >
              &larr;
            </button>
            <button
              onClick={() =>
                setActiveSlide(
                  activeSlide === cars.length - 1 ? 0 : activeSlide + 1
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 flex items-center justify-center text-white hover:bg-black/50 transition-colors"
              aria-label="Next car"
            >
              &rarr;
            </button>
          </div>
        </div>
      </section>
    );
  };

  // Test Drive Footer
  const TestDriveFooter = () => (
    <div className="sticky bottom-0 left-0 right-0 z-30 border-t border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/70 p-3 text-center backdrop-blur-md mt-10">
      <Link
        to="/contact?view=test-drive"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-500 transition-all transform hover:scale-105 active:scale-100 shadow-lg shadow-blue-500/50"
        title={t("requestTestDrive")}
      >
        <img
          src="https://maxus.sa/wp-content/uploads/2024/04/testdrive-icon.png"
          alt=""
          className="w-6 h-6 invert"
        />
        <span className="text-white font-medium ">{t("requestTestDrive")}</span>
      </Link>
    </div>
  );
  return (
    <main className="flex flex-col bg-gradient-to-b dark:from-black dark:to-gray-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:bg-white focus:text-black p-2 rounded"
      >
        {t("skipToContent")}
      </a>

      <Suspense fallback={null}>
        <TawkTo />
      </Suspense>

      <HeroSection />
      <CarSlideshow />
      <div className="text-center mb-12 mx-auto w-full">
        <h2 className="text-3xl md:text-4xl font-bold dark:text-white mb-4 ">
          {t("homepage.servicesOffered")}
        </h2>
      </div>
      <Slideshow slides={servicesOffered} t={t} />
      <TestDriveFooter />
    </main>
  );
}
