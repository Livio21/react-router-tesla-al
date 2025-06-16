import React, { useState } from 'react';
import { Link } from 'react-router';
import { useComparison } from '../context/ComparisonContext';
import { useTranslation } from 'react-i18next';
import imageUrlBuilder from "@sanity/image-url";
import { client } from "~/sanity/client";
import i18n from '~/i18n';
import PaintIcon from '~/components/PaintIcon';

interface Car {
  _id: string;
  name: string;
  slug?: { current: string };
  model?: string;
  brand: string;
  year?: number;
  description?: string;
  range?: number;
  currentPrice: string;
  previousPrice?: string;
  mileage?: number;
  gallery?: any[];
  availability?: boolean;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  location?: string;
  color?: string;
  new?: boolean;
  features?: string[];
}

const builder = imageUrlBuilder(client);
const urlFor = (source: any) => builder.image(source).width(400).height(300).fit("crop").url();

const SPEC_SECTIONS = [
  {
    title: 'Highlights',
    specs: [
      { key: 'currentPrice', label: 'Price' },
      { key: 'year', label: 'Year' },
      { key: 'brand', label: 'Brand' },
      { key: 'model', label: 'Model' },
    ],
  },
  {
    title: 'Details',
    specs: [
      { key: 'fuelType', label: 'Fuel Type' },
      { key: 'transmission', label: 'Transmission' },
      { key: 'bodyType', label: 'Body Type' },
      { key: 'color', label: 'Color' },
      { key: 'mileage', label: 'Mileage' },
    ],
  },
  {
    title: 'Features',
    specs: [
      { key: 'features', label: 'Features' },
    ],
  },
];

export default function ComparePage() {
  const { cars, clearCars, removeCar } = useComparison();
  const { t } = useTranslation();
  const [hideSimilar, setHideSimilar] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
   const formatPrice = (val: any) =>
     new Intl.NumberFormat(i18n.language, {
       style: "currency",
       currency: "EUR",
     }).format(val);
  

  if (cars.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">{t("noCarsToCompare")}</h1>
        <Link
          to="/cars"
          className="inline-block bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
        >
          {t("browseCars")}
        </Link>
      </div>
    );
  }

  const CarCard = ({ car, onRemove }: { car: Car; onRemove?: () => void }) => (
    <div className="relative bg-white dark:bg-zinc-800 rounded-2xl shadow-md border border-gray-200 dark:border-zinc-700 flex flex-col min-w-[300px] max-w-[300px]">
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/40 dark:invert hover:invert-0 dark:hover:bg-red-500 text-2xl font-bold text-zinc-100 transition cursor-pointer"
          aria-label="Remove car"
        >
          ×
        </button>
      )}
      <div className="w-full flex items-center justify-center overflow-hidden rounded-t-2xl bg-white dark:bg-zinc-800">
        <img
          src={urlFor(car.gallery?.[0])}
          alt={car.name}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex-1 flex flex-col gap-2 p-6 pb-4">
        <Link
          to={`/cars/${encodeURIComponent(car.brand)}/${encodeURIComponent(
            car.model ?? ""
          )}/${car.slug?.current}`}
          className="underline text-lg font-bold text-black dark:text-white hover:text-blue-700 dark:hover:text-blue-400 transition"
        >
          {car.name}
        </Link>
        <div className="text-2xl font-bold text-black dark:text-white">
          {formatPrice(car.currentPrice)}
        </div>
      </div>
      <Link
        to={`/cars?brand=${encodeURIComponent(car.brand)}`}
        className="p-4 text-sm font-medium text-zinc-700 dark:text-zinc-400 underline hover:opacity-80 transition"
      >
        {`${t("seeAll")} ${car.brand} →`}
      </Link>
    </div>
  );

  const AddCarCard = ({ onAdd }: { onAdd?: () => void }) => (
    <Link to="/cars" className="relative border  border-gray-300 dark:border-zinc-700 rounded-lg min-h-[420px] bg-gray-50 dark:bg-zinc-900 w-full min-w-[300px] max-w-[300px]">
      <div className="absolute inset-0 flex items-center justify-center z-10 backdrop-blur-sm rounded-lg">
        <button
          onClick={onAdd}
          className=" p-2 lg:p-4 max-h-fit rounded-lg bg-black text-white font-bold border border-white/40 hover:bg-white/10 backdrop-blur-sm transition active:scale-95 cursor-pointer"
        >
          Add new car
        </button>
      </div>
      <div className="absolute inset-0 z-0 bg-[url('/Model-3.jpg')] bg-cover bg-center rounded-2xl "></div>
    </Link>
  );

  // Helper to check if all cars have the same value for a spec
  function isSimilar(specKey: string) {
    const first = (cars[0] as any)?.[specKey];
    return cars.every(car => {
      if (Array.isArray((car as any)[specKey]) && Array.isArray(first)) {
        return JSON.stringify((car as any)[specKey]) === JSON.stringify(first);
      }
      return (car as any)[specKey] === first;
    });
  }

  // Toggle section open/close
  function toggleSection(title: string) {
    setOpenSections(prev => ({ ...prev, [title]: !prev[title] }));
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white dark:bg-zinc-900 ">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold dark:text-zinc-100">
            {t("compare")}
          </h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-zinc-400">
          {t("compareDescription")}
        </p>
      </div>
      <div className="cars-container flex gap-4 mb-8 p-1 scrollbar-hide overflow-x-auto ">
        {cars.map((car) => (
          <CarCard
            key={car._id}
            car={car}
            onRemove={() => {
              removeCar(car._id);
            }}
          />
        ))}
        {cars.length < 5 && <AddCarCard />}
      </div>
    
      <div className="bg-white dark:bg-zinc-900 p-1">
        {SPEC_SECTIONS.map((section, index) => {
          const visibleSpecs = hideSimilar
            ? section.specs.filter((spec) => !isSimilar(spec.key))
            : section.specs;
          if (visibleSpecs.length === 0) return null;
          const open = openSections[section.title] ?? true;
          return (
            <details className="group " open={index === 0}>
              <summary className="font-bold text-xl p-4 flex items-center justify-between gap-2 cursor-pointer hover:text-black/80 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all border-b-[1px] border-gray-200 dark:border-zinc-700 mb-2 bg-white dark:bg-zinc-900 dark:text-zinc-100">
                {section.title}
                <span className="ml-1 transition-transform rotate-90 duration-200 group-open:-rotate-90">
                  <svg
                    className="w-4 h-4 inline-block"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L11.586 9 7.293 4.707a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </summary>
              <div className="flex gap-4 w-full overflow-x-auto">
                {cars.map((car) => {
                  return (
                    <div className="relative flex flex-col gap-2 w-full min-w-[300px] max-w-[300px] ">
                      {visibleSpecs.map((spec) => (
                        <div
                          key={spec.key}
                          className="flex flex-col pl-4 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg p-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700"
                        >
                          <div className="font-medium text-lg dark:text-zinc-100">
                            {spec.key === "features" ? (
                              <ul className="flex flex-wrap gap-2">
                                {(car as any)[spec.key]?.map(
                                  (feature: string, index: number) => (
                                    <li
                                      key={index}
                                      className="text-sm bg-zinc-100 dark:bg-zinc-700 rounded-lg p-2 mb-2 w-fit dark:text-zinc-100"
                                    >
                                      {feature}
                                    </li>
                                  )
                                )}
                              </ul>
                            ) : spec.key === "currentPrice" ? (
                              formatPrice((car as any)[spec.key])
                            ) : spec.key === "color" ? (
                              <>
                                <PaintIcon
                                  color={(car as any)[spec.key] ?? ""}
                                />
                              </>
                            ) : (
                              (car as any)[spec.key]
                            )}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {spec.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
} 