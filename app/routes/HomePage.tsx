import type { SanityDocument } from "@sanity/client";
import { Link } from "react-router";
import { client } from "~/sanity/client";
import type { Route } from "./+types/HomePage";
import { useTranslation } from "react-i18next";
import imageUrlBuilder from "@sanity/image-url";
import React, { useEffect, useRef, useState } from "react";



const builder = imageUrlBuilder(client);
const urlFor = (source: any) =>
  builder.image(source).width(400).height(300).fit("crop").url();
export function TawkTo() {
  if (typeof window === "undefined") return null;

  const tawkToScript = document.createElement("script");
  tawkToScript.src = "https://embed.tawk.to/64f0b3c1d5ab8b1d455e2a4f/1h6q7g9qk";
  tawkToScript.async = true;
  tawkToScript.setAttribute("crossorigin", "*");

  document.body.appendChild(tawkToScript);

  (window as any).Tawk_API = (window as any).Tawk_API || {};
  (function () {
    var s1 = document.createElement("script"),
      s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = "https://embed.tawk.to/6849b968aa4c3319118fe6ca/1itfvogin";

    s1.setAttribute("crossorigin", "*");
    if (s0.parentNode) {
      s0.parentNode.insertBefore(s1, s0);
    }
  })();
  return null;
}

export default function HomePage() {
  const { t } = useTranslation();
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const cars = [
    {
      name: "Model S",
      img: "/Model-S.jpg",
      bodyType: "Luxury Sedan",
      value: "30000",
    },
    {
      name: "Model 3",
      img: "/Model-3.jpg",
      bodyType: "Sporty Sedan",
      value: "20000",
    },
    {
      name: "Model Y",
      img: "/Model-Y.jpg",
      bodyType: "SUV",
      value: "30000",
    },
    {
      name: "Cybertruck",
      img: "/Cybertruck.jpg",
      bodyType: "Truck",
      value: "80000",
    },
  ];

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log("Video autoplay failed:", error);
      });
    }
  }, []);

  return (
    <main className="min-h-screen snap-y">
      <TawkTo />
      <section className="relative h-[90vh] overflow-hidden bg-gradient-to-b from-gray-900 to-black dark:from-zinc-900 dark:to-black snap-center">
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            loop={true}
            muted
            playsInline
            preload="auto"
            onEnded={() => {
              if (videoRef.current) {
                videoRef.current.play();
              }
            }}
          >
            <source src="/background.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight">
              Permakinat.al
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">
              {t("homepage.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/cars?brand=tesla"
                className="px-8 py-4 rounded-lg bg-white text-black font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition duration-200 shadow-lg"
              >
                {t("homepage.browseTeslas")}
              </Link>
              <Link
                to="/cars"
                className="px-8 py-4 rounded-lg bg-black text-white font-bold text-lg border-2 border-white/20 hover:bg-white/10 transform hover:scale-105 transition duration-200"
              >
                {t("homepage.browseAllCars")}
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="flex gap-4 lg:gap-8 p-4 lg:p-10 overflow-auto snap-x scrollbar-hide ">
        {cars.map((car) => (
          <div className="relative snap-center aspect-{330/520} min-w-[330px] h-[520px] lg:aspect-[1024/580]  lg:min-w-[1024px] lg:h-[580px] rounded-lg ">
            <img
              src={car.img}
              alt=""
              className="absolute inset-0 rounded-lg w-full h-full object-cover z-0 brightness-90"
            />
            <div className="relative z-20 grid grid-rows-3 p-4 lg:p-10 h-full w-full text-white rounded-lg">
              <h1 className="lg:text-lg">{car.bodyType}</h1>
              <div className="row-span-2 justify-end flex flex-col gap-2">
                <h1 className="font-bold lg:text-5xl">{car.name}</h1>
                <div className="flex gap-4 items-center">
                  <span className="font-medium lg:text-2xl text-white ">
                    {t("homepage.from")} {car.value} €
                  </span>
                </div>
                <div className="flex lg:w-1/2 gap-2 text-center font-medium">
                  <Link
                    to={`/cars?brand=tesla&model=${car.name.toLowerCase()}`}
                    className="basis-1/2 p-2 lg:p-4 rounded-lg bg-white text-black font-bold border-2 border-black/20 hover:bg-white/10 backdrop-blur-2xl hover:invert transform transition duration-200"
                  >
                    {t("order")}
                  </Link>
                  <Link
                    to={"/cars"}
                    className="basis-1/2 p-2 lg:p-4 rounded-lg bg-black text-white font-bold border-2 border-white/20 hover:bg-white/10 backdrop-blur-2xl transform transition duration-200"
                  >
                    {t("learnMore")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
      <div className="fixed bottom-0 z-30  w-full border-t border-black/10 dark:border-white/20 bg-white/50 dark:bg-black/50 p-4 mt-12 text-center text-gray-500 dark:text-zinc-400 backdrop-blur-sm">
        <Link
          to="/contact"
          className="bg-white dark:bg-zinc-700  border border-black/10 dark:border-white/10 py-2 px-4 rounded  hover:bg-gray-100 dark:hover:bg-zinc-600 transition animate-pulse hover:animate-none"
          title="Kerko Test Drive"
        >
          <img
            src="https://maxus.sa/wp-content/uploads/2024/04/testdrive-icon.png"
            alt=""
            className="inline-block w-6 h-6 mr-2 align-middle dark:invert"
          />
          <span className="text-gray-900 dark:text-zinc-100 font-semibold">
            Kerko Test Drive
          </span>
        </Link>
      </div>
    </main>
  );
}
