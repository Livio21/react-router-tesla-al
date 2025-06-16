import React, { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useComparison } from '../context/ComparisonContext';
import { useTranslation } from 'react-i18next';
import imageUrlBuilder from "@sanity/image-url";
import { client } from "~/sanity/client";

const builder = imageUrlBuilder(client);
const urlFor = (source: any) => builder.image(source).width(100).height(100).fit("crop").url();

export default function ComparisonBar() {
  const { cars, removeCar, clearCars } = useComparison();
  const { t } = useTranslation();
  const location = useLocation();
  const [minimized, setMinimized] = useState(false);

  // Only show on /cars, /compare, or /cars/... (details)
  const showBar =
    location.pathname === '/cars' ||
    location.pathname === '/compare' ||
    location.pathname.startsWith('/cars/');

  if (!showBar || cars.length === 0) return null;

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-white dark:text-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shadow-lg rounded-full px-4 py-2 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-zinc-700 transition"
        title="Show comparison bar"
        aria-label="Show comparison bar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 15l7-7 7 7"
          />
        </svg>
        <span className="font-medium text-sm dark:text-white">
          {t("compare")+ " ("+ cars.length+ " "+t("cars")+")"}
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95vw] max-w-screen-lg">
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full relative">
        {/* Minimize button */}
        <button
          onClick={() => setMinimized(true)}
          className="absolute -top-3 -right-3 bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-200 rounded-full w-7 h-7 flex items-center justify-center shadow hover:bg-gray-300 dark:hover:bg-zinc-600 transition"
          title="Minimize"
          aria-label="Minimize"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Car thumbnails (horizontal scroll) */}
        <div className="flex overflow-x-auto gap-2 scrollbar-hide max-w-full">
          {cars.map((car) => {
            const thumb = car.gallery?.[0] ? urlFor(car.gallery[0]) : undefined;
            return (
              <div
                key={car._id}
                className="relative group flex min-w-[200px] sm:min-w-[240px] bg-white dark:bg-zinc-900 rounded-lg p-1 gap-2 border border-gray-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200"
              >
                <img
                  src={thumb}
                  alt={car.name}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex flex-col p-2 overflow-hidden">
                  <p className="text-sm font-medium truncate">{car.name}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {car.currentPrice}
                  </p>
                </div>
                <button
                  onClick={() => removeCar(car._id)}
                  className="absolute top-1/2 -translate-y-1/2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 sm:ml-auto flex-shrink-0">
          <Link
            to="/compare"
            className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg font-medium hover:opacity-90 transition"
          >
            {t("compare")}
          </Link>
          <button
            onClick={clearCars}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm"
          >
            {t("clear")}
          </button>
        </div>
      </div>
    </div>
  );
} 