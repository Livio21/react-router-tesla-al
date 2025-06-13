import { useRef, useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "~/sanity/client";
import { useTranslation } from "react-i18next";
import ImageCarousel from "~/components/ImageCarousel";

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
        // fallback to static rates if fetch fails
        setRates({ USD: 1.08, ALL: 98, GBP: 0.86 });
      });
  }, []);

  return rates;
};

function parseEuro(price: string) {
  // Extract number from "12,000 €" or "12000€"
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

  // Spinner state for minimum loading time
  const [showSpinner, setShowSpinner] = useState(false);
  const minLoadingTime = 400; // ms

  // Use the currency rates hook
  const rates = useCurrencyRates();

  useEffect(() => {
    let minTimeout: NodeJS.Timeout;
    setShowSpinner(true);

    minTimeout = setTimeout(() => {
      // Spinner will be hidden after minLoadingTime, or when loading is done, whichever is later
      if (!loading) setShowSpinner(false);
    }, minLoadingTime);

    return () => {
      clearTimeout(minTimeout);
    };
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

  if (loading || showSpinner)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="inline-block w-12 h-12 border-4 border-gray-300 border-t-gray-900 dark:border-t-zinc-100 rounded-full animate-spin" />
      </div>
    );
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;
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
    <div className="max-w-full max-h-full bg-white dark:bg-zinc-900 dark:text-zinc-200 text-zinc-800 lg:pr-4">
      <div className="grid grid-cols-1 grid-rows-[0.1fr_1fr] lg:grid-rows-1 lg:grid-cols-[5fr_0.1fr_2fr] h-[calc(100vh-64px)] align-middle">
        {car.gallery && car.gallery.length > 0 ? (
          <ImageCarousel
            images={car.gallery.map((img) => urlFor(img).toString())}
            carName={car.name}
          />
        ) : (          <div className="w-full h-64 flex items-center justify-center text-gray-400">
            {t("noImage")}
          </div>
        )}
        <div className="hidden lg:block w-[1px] my-3 bg-zinc-200 dark:bg-zinc-700 justify-self-center"></div>
        <div className="overflow-y-auto scroll-hide ">
          <style>
            {`
              .currency-tooltip {
                position: relative;
                display: inline-block;
                z-index: 0;
              }
              .currency-tooltip .currency-tooltiptext {
                visibility: hidden;
                width: 220px;
                background-color: #222;
                color: #fff;
                text-align: left;
                border-radius: 6px;
                padding: 8px 12px;
                position: absolute;
                bottom: 125%;
                left: 50%;
                transform: translateX(-50%);
                opacity: 0;
                transition: opacity 0.2s;
                font-size: 12px;
                pointer-events: none;
                box-shadow: 0 2px 8px rgba(0,0,0,0.12);
              }
              .currency-tooltip:hover .currency-tooltiptext,
              .currency-tooltip:focus-within .currency-tooltiptext {
                visibility: visible;
                opacity: 1;
                pointer-events: auto;
              }
              .dark .currency-tooltip .currency-tooltiptext {
                background-color: #fafafa;
                color: #18181b;
              }
              .scroll-hide::-webkit-scrollbar { display: none; }
              .scroll-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}
          </style>
          <div className="w-full max-w-xl mx-auto gap-8 items-center p-4">
            <div className="flex flex-col items-center gap-8 w-full overflow-y-auto scroll-hide ">
              <h1 className="text-4xl font-bold text-center">{car.name} </h1>
              <span
                className={`px-3 py-1 rounded text-xs font-medium  ${
                  car.availability
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {car.availability ? t("available") : t("sold")}
              </span>
              <ol className="flex justify-around text-center gap-1.5 w-full max-w-md mb-4">
                <li className="flex-1 flex flex-col items-center justify-center">
                  <div>
                    <span>{car.range}</span>
                    <span className="text-sm font-light">km</span>
                  </div>
                  <span className="text-sm font-light">{t("range")}</span>
                </li>
                <li className="flex-1 flex flex-col items-center justify-center">
                  <div>
                    <span>{car.year}</span>
                  </div>
                  <span className="text-sm font-light">{t("year")}</span>
                </li>
                <li className="flex-1 flex flex-col items-center justify-center">
                  <div>
                    <span>{car.mileage?.toLocaleString()}</span>
                    <span className="text-sm font-light">km</span>
                  </div>
                  <span className="text-sm font-light">{t("mileage")}</span>
                </li>
              </ol>
              <hr className="w-full h-[1px] text-zinc-400 dark:text-zinc-700 bg-zinc-400 dark:bg-zinc-700" />
              <div className="flex flex-col gap-6 w-full items-center mb-20">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl font-bold flex items-center gap-2">
                    {onSale && previousEuroValue && (
                      <span className="line-through text-red-400 text-lg font-normal mr-2">
                        {previousEuroValue.toLocaleString()} €
                      </span>
                    )}
                    {euroValue.toLocaleString()}{" "}
                    <span className="text-lg">€</span>
                    {onSale && (
                      <span className="ml-2 px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-semibold">
                        {t("onSale")}
                      </span>
                    )}
                  </span>
                  <div className="flex flex-col gap-0.5 mt-1 text-xs opacity-80 text-center z-0">
                    <span className="">
                      {allValue.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}{" "}
                      ALL
                    </span>
                    <span>
                      {usdValue.toLocaleString(undefined, {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                      })}{" "}
                      USD
                    </span>
                    <span>
                      {gbpValue.toLocaleString(undefined, {
                        style: "currency",
                        currency: "GBP",
                        maximumFractionDigits: 0,
                      })}{" "}
                      GBP
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center mt-2">
                    <span className="bg-gray-100 dark:bg-zinc-700 px-3 py-1 rounded text-xs font-medium">
                      {car.brand}
                    </span>
                    {car.model && (
                      <span className="bg-gray-100 dark:bg-zinc-700 px-3 py-1 rounded text-xs font-medium">
                        {car.model}
                      </span>
                    )}
                    {car.bodyType && (
                      <span className="bg-gray-100 dark:bg-zinc-700 px-3 py-1 rounded text-xs font-medium">
                        {car.bodyType}
                      </span>
                    )}
                    {car.fuelType && (
                      <span className="bg-gray-100 dark:bg-zinc-700 px-3 py-1 rounded text-xs font-medium">
                        {car.fuelType}
                      </span>
                    )}
                    {car.transmission && (
                      <span className="bg-gray-100 dark:bg-zinc-700 px-3 py-1 rounded text-xs font-medium">
                        {car.transmission}
                      </span>
                    )}
                    {car.location && (
                      <span className="bg-gray-100 dark:bg-zinc-700 px-3 py-1 rounded text-xs font-medium">
                        {car.location}
                      </span>
                    )}
                  </div>
                </div>
                {car.features && car.features.length > 0 && (
                  <div className="flex flex-col gap-2 w-full items-center">
                    <h3 className="text-lg font-semibold  text-center">
                      {t("options")}
                    </h3>
                    <ul className="flex flex-wrap gap-2 justify-center">
                      {car.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="bg-gray-100 dark:bg-zinc-700 px-3 py-1 rounded text-xs"
                        >
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {car.description && Array.isArray(car.description) && (
                  <div className="flex flex-col gap-2 w-full items-center">
                    <h3 className="text-lg font-semibold  text-center">
                      {t("description")}
                    </h3>
                    <div className="prose prose-sm max-w-none  ">
                      {car.description.map((block, i) =>
                        block.children?.map((child, j) => (
                          <p key={i + "-" + j}>{child.text}</p>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-4 justify-between items-center ">
                <Link
                  to={`/cars?brand=${encodeURIComponent(car.brand || "")}${
                    car.model
                      ? `&model=${encodeURIComponent(
                          car.model.replace(/\s+/g, "-").toLowerCase()
                        )}`
                      : ""
                  }`}
                  className="text-sm border-b-2 border-transparent hover:border-gray-900 hover:opacity-80 "
                >
                  ← {t("backToCars")}
                </Link>
                <Link
                  to="/contact"
                  className="ml-4 px-4 py-2 rounded bg-gray-900 text-white dark:bg-zinc-600  hover:bg-gray-800 text-sm font-medium transition"
                >
                  {t("contactForThisCar")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
