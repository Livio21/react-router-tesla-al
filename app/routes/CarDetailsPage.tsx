import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "~/sanity/client";
import { useTranslation } from "react-i18next";
import ImageCarousel from "~/components/ImageCarousel";
import { CurrencyInfoIcon } from "~/components/Icons";

interface Car {
  _id: string;
  name: string;
  currentPrice: string;
  previousPrice?: string;
  range: string;
  gallery?: SanityImageSource[];
  description?: Array<{ _type: string; children: { text: string }[] }>;
  brand?: string;
  model?: string;
  year?: number;
  mileage?: number;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  location?: string;
  features?: string[];
  availability?: boolean;
}

const builder = imageUrlBuilder(client);
const urlFor = (source: SanityImageSource) =>
  builder.image(source).width(800).auto("format").url();

const useCurrencyRates = () => {
  const [rates, setRates] = useState<{ USD: number; ALL: number; GBP: number }>(
    {
      USD: 1,
      ALL: 1,
      GBP: 1,
    }
  );
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    fetch(
      "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json"
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.eur) {
          setRates({
            USD: data.eur.usd || 1,
            ALL: data.eur.all || 1,
            GBP: data.eur.gbp || 1,
          });
        }
      })
      .catch(() => {
        setRates({ USD: 1.08, ALL: 98, GBP: 0.86 });
      });
  }, []);

  return rates;
};

function parseEuro(price: string) {
  const num = Number(price.replace(/[^\d]/g, ""));
  return isNaN(num) ? 0 : num;
}

function formatCurrency(amount: number, currency: string) {
  return amount.toLocaleString(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
}

export default function CarDetailsPage() {
  const { t } = useTranslation();
  const { brand, model, slug } = useParams<{
    brand: string;
    model: string;
    slug: string;
  }>();
  if (!brand || !model || !slug) {
    return <div className="text-center py-10 text-xl">Car not found.</div>;
  }
  
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const minLoadingTime = 400;
  const rates = useCurrencyRates();

  useEffect(() => {
    const minTimeout = setTimeout(() => {
      if (!loading) setShowSpinner(false);
    }, minLoadingTime);

    return () => clearTimeout(minTimeout);
  }, [loading]);

  useEffect(() => {
    setLoading(true);
    setShowSpinner(true);
    
    client
      .fetch<Car>(
        `*[_type == "car" && slug.current == $slug][0]{
          _id,
          name,
          currentPrice,
          previousPrice,
          range,
          gallery,
          description,
          brand,
          model,
          year,
          mileage,
          fuelType,
          transmission,
          bodyType,
          location,
          features,
          availability
        }`,
        { slug }
      )
      .then((data) => {
        if (!data) {
          setError("Car not found.");
        } else {
          setCar(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch car details:", err);
        setError("Failed to load car details.");
        setLoading(false);
      });
  }, [slug]);

  if (loading || showSpinner) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="inline-block w-12 h-12 border-4 border-gray-300 border-t-gray-900 dark:border-t-zinc-100 rounded-full animate-spin" />
      </div>
    );
  }
  
  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }
  
  if (!car) return null;

  // --- Currency conversion logic ---
  const euroValue = parseEuro(car.currentPrice);
  const usdValue = euroValue * rates.USD;
  const allValue = euroValue * rates.ALL;
  const gbpValue = euroValue * rates.GBP;
  const previousEuroValue = car.previousPrice
    ? parseEuro(car.previousPrice)
    : undefined;
  const onSale = previousEuroValue && previousEuroValue > euroValue;
  const disclaimer = t("currencyDisclaimer");

  return (
    <div className="bg-white dark:bg-zinc-900 dark:text-zinc-200 text-zinc-800">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Image Gallery - Mobile: 50vh, Desktop: Full height */}
        <div className="lg:w-3/5 h-[50vh] sm:h-[55vh] lg:h-screen lg:sticky lg:top-0 overflow-hidden">
          {car.gallery && car.gallery.length > 0 ? (
            <ImageCarousel
              images={car.gallery.map((img) => urlFor(img).toString())}
              carName={car.name}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100 dark:bg-zinc-800">
              {t("noImage")}
            </div>
          )}
        </div>

        {/* Details Section - Mobile: Scrollable content */}
        <div className="lg:w-2/5 flex flex-col">
          <div className="flex-1 overflow-y-auto scroll-hide p-4 sm:p-5 lg:p-6">
            <div className="max-w-2xl mx-auto">
              {/* Title and Status - Improved mobile spacing */}
              <div className="mb-4 sm:mb-6 text-center">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                  {car.name}
                </h1>
                <span
                  className={`inline-block px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${
                    car.availability
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                  }`}
                >
                  {car.availability ? t("available") : t("sold")}
                </span>
              </div>

              {/* Key Specs - Grid layout for mobile */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-zinc-800 p-3 sm:p-4 rounded-lg text-center">
                  <div className="text-lg sm:text-xl font-semibold">
                    {car.range}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-1">
                    {t("range")} km
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-zinc-800 p-3 sm:p-4 rounded-lg text-center">
                  <div className="text-lg sm:text-xl font-semibold">
                    {car.year}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-1">
                    {t("year")}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-zinc-800 p-3 sm:p-4 rounded-lg text-center col-span-2 sm:col-span-1">
                  <div className="text-lg sm:text-xl font-semibold">
                    {car.mileage?.toLocaleString()}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-1">
                    {t("mileage")} km
                  </div>
                </div>
              </div>

              {/* Pricing - Better mobile spacing */}
              <div className="bg-gray-50 dark:bg-zinc-800 rounded-xl p-4 sm:p-5 mb-6">
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-base sm:text-lg font-semibold">
                    {t("price")}
                  </h2>
                  <div className="relative group">
                    <CurrencyInfoIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-gray-600" />
                    <div className="absolute z-10 left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-56 sm:w-64 p-3 text-xs text-white bg-gray-800 rounded-lg shadow-lg">
                      {disclaimer}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                  <div>
                    <div className="flex items-baseline">
                      <span className="text-xl sm:text-2xl font-bold">
                        {euroValue.toLocaleString()} €
                      </span>
                      {onSale && previousEuroValue && (
                        <span className="ml-2 line-through text-red-500 dark:text-red-400 text-base sm:text-lg">
                          {previousEuroValue.toLocaleString()} €
                        </span>
                      )}
                    </div>

                    <div className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-zinc-400 space-y-1">
                      <div>{allValue.toLocaleString()} ALL</div>
                      <div>
                        {usdValue.toLocaleString(undefined, {
                          style: "currency",
                          currency: "USD",
                          maximumFractionDigits: 0,
                        })}
                      </div>
                      <div>
                        {gbpValue.toLocaleString(undefined, {
                          style: "currency",
                          currency: "GBP",
                          maximumFractionDigits: 0,
                        })}
                      </div>
                    </div>
                  </div>

                  {onSale && (
                    <span className="self-start sm:self-end px-2.5 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 text-xs sm:text-sm font-semibold">
                      {t("onSale")}
                    </span>
                  )}
                </div>
              </div>

              {/* Car Details - Improved grid for mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-6">
                {[
                  { label: t("brand"), value: car.brand },
                  { label: t("model"), value: car.model },
                  { label: t("bodyType"), value: car.bodyType },
                  { label: t("fuelType"), value: car.fuelType },
                  { label: t("transmission"), value: car.transmission },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center p-2.5 sm:p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg"
                  >
                    <span className="text-gray-500 dark:text-zinc-400 text-xs sm:text-sm mr-2">
                      {item.label}:
                    </span>
                    <span className="font-medium text-sm sm:text-base truncate">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Features - Better wrapping */}
              {car.features && car.features.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-2">
                    {t("options")}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {car.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-gray-100 dark:bg-zinc-700 rounded-full text-xs sm:text-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description - Improved text sizing */}
              {car.description && Array.isArray(car.description) && (
                <div className="mb-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-2">
                    {t("description")}
                  </h3>
                  <div className="prose prose-sm max-w-none text-gray-700 dark:text-zinc-300 text-sm sm:text-base">
                    {car.description.map((block, i) =>
                      block.children?.map((child, j) => (
                        <p key={i + "-" + j} className="mb-2 sm:mb-3">
                          {child.text}
                        </p>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Action Bar - Mobile optimized */}
          <div className="sticky bottom-0 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 p-3 sm:p-4">
            <div className="max-w-2xl mx-auto flex justify-between items-center">
              <Link
                to={`/cars?brand=${encodeURIComponent(car.brand || "")}`}
                className="flex items-center text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm sm:text-base"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                {t("backToCars")}
              </Link>
              <Link
                to="/contact"
                className="px-4 py-2.5 sm:px-5 sm:py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-md hover:shadow-lg text-sm sm:text-base"
              >
                {t("contactForThisCar")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}