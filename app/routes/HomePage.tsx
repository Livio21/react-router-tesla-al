import type { SanityDocument } from "@sanity/client";
import { Link } from "react-router";
import { client } from "~/sanity/client";
import type { Route } from "./+types/HomePage";
import { useTranslation } from "react-i18next";
import React, { useEffect, useRef } from "react";

const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt}`;

export async function loader() {
  return { posts: await client.fetch<SanityDocument[]>(POSTS_QUERY) };
}

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

export default function IndexPage() {
  const { t } = useTranslation();
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log("Video autoplay failed:", error);
      });
    }
  }, []);

  return (
    <main className="min-h-screen">
      <TawkTo />
      <section className="relative h-[90vh] overflow-hidden bg-gradient-to-b from-gray-900 to-black dark:from-zinc-900 dark:to-black">
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
      </section>{" "}
      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-zinc-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            {t("homepage.whyTitle")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="group p-8 bg-white dark:bg-zinc-800 rounded-2xl shadow-lg hover:shadow-xl transition duration-300">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300">
                  <span className="text-3xl">⚡</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  {t("homepage.electricTitle")}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  {t("homepage.electricDesc")}
                </p>
              </div>
            </div>

            <div className="group p-8 bg-white dark:bg-zinc-800 rounded-2xl shadow-lg hover:shadow-xl transition duration-300">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300">
                  <span className="text-3xl">🔍</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  {t("homepage.compareTitle")}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  {t("homepage.compareDesc")}
                </p>
              </div>
            </div>

            <div className="group p-8 bg-white dark:bg-zinc-800 rounded-2xl shadow-lg hover:shadow-xl transition duration-300">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300">
                  <span className="text-3xl">💬</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  {t("homepage.supportTitle")}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  {t("homepage.supportDesc")}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 text-center text-gray-500 text-sm">
          <span>
            {t("homepage.notSure")}{" "}
            <Link to="/help" className="underline hover:text-gray-900">
              {t("homepage.contactForAdvice")}
            </Link>
          </span>
        </div>
      </section>
      <div className="fixed bottom-0 w-full border-t border-black/10 dark:border-white/20 bg-white/50 dark:bg-black/50 p-4 mt-12 text-center text-gray-500 dark:text-zinc-400 backdrop-blur-sm  ">
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
