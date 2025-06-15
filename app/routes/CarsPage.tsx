import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "~/sanity/client";
import { div } from "framer-motion/client";

interface Car {
  _id: string;
  slug?: { current: string };
  model?: string;
  name: string;
  brand: string;
  year: number;
  description?: string;
  range?: number; // Added for range filter
  currentPrice: string;
  previousPrice?: string;
  mileage: number;
  gallery?: any[];
  availability?: boolean;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  location?: string;
  color?: string; // Added for color filter
  new?: boolean; // Added for new/used filter
  features?: string[]; // Added for features
}

const builder = imageUrlBuilder(client);
const urlFor = (source: any) =>
  builder.image(source).width(400).height(300).fit("crop").url();

export default function CarsPage() {
  const { t } = useTranslation();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Parse query params
  const params = new URLSearchParams(location.search);
  const brandFilter = params.get("brand") || "";
  const modelFilter = params.get("model") || "";
  const yearFilter = params.get("year") || "";
  const minPrice = params.get("minPrice") || "";
  const maxPrice = params.get("maxPrice") || "";
  const minMileage = params.get("minMileage") || "";
  const maxMileage = params.get("maxMileage") || "";
  const fuelType = params.get("fuelType") || "";

  // Fetch all cars for dropdowns and filtering
  useEffect(() => {
    setLoading(true);
    setError(null);
    client
      .fetch<Car[]>(
        `*[_type == "car"]{ _id,
        name,
        slug,
        currentPrice,
        previousPrice,
        range,
        gallery,
        description,
        color,
        new,
        brand,
        model,
        year,
        mileage,
        fuelType,
        transmission,
        bodyType,
        location,
        features,
        availability } `
      )
      .then((data) => {
        setCars(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load car listings.");
        setLoading(false);
      });
  }, []);

  // Get unique brands/models/years for dropdowns
  const brands = Array.from(new Set(cars.map((car) => car.brand)))
    .filter(Boolean)
    .sort();
  const models = Array.from(
    new Set(
      cars
        .filter((car) =>
          brandFilter
            ? car.brand && car.brand.toLowerCase() === brandFilter.toLowerCase()
            : true
        )
        .map((car) => car.model)
        .filter(
          (model): model is string => typeof model === "string" && !!model
        )
    )
  ).sort();
  const years = Array.from(new Set(cars.map((car) => car.year))).sort(
    (a, b) => b - a
  );

  // Get unique values for new filters
  const fuelTypes = Array.from(
    new Set(cars.map((car) => car.fuelType).filter(Boolean))
  ).sort();
  const transmissions = Array.from(
    new Set(cars.map((car) => car.transmission).filter(Boolean))
  ).sort();
  const bodyTypes = Array.from(
    new Set(cars.map((car) => car.bodyType).filter(Boolean))
  ).sort();
  const colors = Array.from(
    new Set(cars.map((car) => car.color).filter(Boolean))
  ).sort();

  // Add new filters from query params
  const fuelTypeFilter = params.get("fuelType") || "";
  const transmissionFilter = params.get("transmission") || "";
  const bodyTypeFilter = params.get("bodyType") || "";
  const colorFilter = params.get("color") || "";
  const newFilter = params.get("new") || "";
  const availabilityFilter = params.get("availability") || "";
  // Get sort option from params
  const sortOption = params.get("sort") || "";

  // Filter and sort cars
  let filteredCars = cars.filter((car) => {
    if (brandFilter && car.brand.toLowerCase() !== brandFilter.toLowerCase()) {
      return false;
    }
    if (
      modelFilter &&
      (!car.model ||
        car.model.replace(/\s+/g, "-").toLowerCase() !== modelFilter)
    ) {
      return false;
    }
    if (yearFilter && car.year !== Number(yearFilter)) {
      return false;
    }
    if (
      minPrice &&
      Number(car.currentPrice.replace(/[^\d]/g, "")) < Number(minPrice)
    ) {
      return false;
    }
    if (
      maxPrice &&
      Number(car.currentPrice.replace(/[^\d]/g, "")) > Number(maxPrice)
    ) {
      return false;
    }
    if (minMileage && car.mileage < Number(minMileage)) {
      return false;
    }
    if (maxMileage && car.mileage > Number(maxMileage)) {
      return false;
    }
    if (fuelTypeFilter && car.fuelType !== fuelTypeFilter) {
      return false;
    }
    if (transmissionFilter && car.transmission !== transmissionFilter) {
      return false;
    }
    if (bodyTypeFilter && car.bodyType !== bodyTypeFilter) {
      return false;
    }
    if (colorFilter && car.color !== colorFilter) {
      return false;
    }
    if (newFilter) {
      if (newFilter === "true" && car.new !== true) return false;
      if (newFilter === "false" && car.new !== false) return false;
    }

    if (availabilityFilter) {
      if (availabilityFilter === "true" && car.availability === false)
        return false;
      if (availabilityFilter === "false" && car.availability !== false)
        return false;
    }    return true;
  });

  // Sort the filtered cars based on the selected option
  if (sortOption) {
    filteredCars.sort((a, b) => {
      const priceA = Number(a.currentPrice.replace(/[^\d]/g, ""));
      const priceB = Number(b.currentPrice.replace(/[^\d]/g, ""));

      switch (sortOption) {
        case "priceAsc":
          return priceA - priceB;
        case "priceDesc":
          return priceB - priceA;
        case "yearDesc":
          return b.year - a.year;
        case "yearAsc":
          return a.year - b.year;
        case "mileageAsc":
          return a.mileage - b.mileage;
        case "mileageDesc":
          return b.mileage - a.mileage;
        default:
          return 0;
      }
    });
  }
  // Helper for showing applied filters
  function getAppliedFilters() {
    const filters: string[] = [];
    const sortOption = params.get("sort");
    if (sortOption) {
      filters.push(`${t("sortBy")}: ${t(`sortOptions.${sortOption}`)}`);
    }if (brandFilter)
      filters.push(
        `${t("brand")}: ${brandFilter.charAt(0).toUpperCase() + brandFilter.slice(1)}`
      );
    if (modelFilter) filters.push(`${t("model")}: ${modelFilter.replace(/-/g, " ")}`);
    if (yearFilter) filters.push(`${t("year")}: ${yearFilter}`);
    if (minPrice)
      filters.push(`${t("price")} ≥ ${Number(minPrice).toLocaleString()} €`);
    if (maxPrice)
      filters.push(`${t("price")} ≤ ${Number(maxPrice).toLocaleString()} €`);
    if (minMileage)
      filters.push(`${t("mileage")} ≥ ${Number(minMileage).toLocaleString()} km`);
    if (maxMileage)
      filters.push(`${t("mileage")} ≤ ${Number(maxMileage).toLocaleString()} km`);
    if (fuelTypeFilter) filters.push(`${t("fuelType")}: ${fuelTypeFilter}`);
    if (transmissionFilter) filters.push(`${t("transmission")}: ${transmissionFilter}`);
    if (bodyTypeFilter) filters.push(`${t("bodyType")}: ${bodyTypeFilter}`);
    if (colorFilter) filters.push(`${t("color")}: ${colorFilter}`);
    if (newFilter) filters.push(newFilter === "true" ? t("newCar") : t("usedCar"));
    if (availabilityFilter)
      filters.push(availabilityFilter === "true" ? t("available") : t("sold"));
    return filters;
  }

  // Handlers for filter changes
  function handleFilterChange(key: string, value: string) {
    const newParams = new URLSearchParams(location.search);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    navigate(`${location.pathname}?${newParams.toString()}`, { replace: true });
  }

  if (loading) {
    return <div className="text-center py-10 text-xl">{t("loading")}</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">{t("errorLoading")}</div>
    );
  }

  const colorClassMap: Record<string, string> = {
    blue: "border-blue-300 from-blue-300 to-blue-700",
    red: "border-red-300 from-red-300 to-red-700 to-65%",
    green: "border-green-300 from-green-400 to-green-700",
    yellow: "border-yellow-300 from-yellow-400 to-yellow-700",
    black: "border-gray-700 from-gray-700 to-black",
    white: "border-gray-300 from-white to-gray-200",
    gray: "border-gray-400 from-gray-400 to-gray-700",
    silver: "border-gray-400 from-gray-300 to-gray-500",
  };

  const CarPaint: React.FC<{ color: string }> = ({ color }) => {
    const gradient =
      colorClassMap[color.toLowerCase()] || "from-gray-400 to-gray-700";
    return (
      <div
        className={`size-4 rounded-full border bg-radial-[at_40%_15%] ${gradient} `}
      ></div>
    );
  };

  return (
    <div className=" mx-auto px-4 py-8 dark:text-zinc-200 ">
      <h1 className="text-3xl font-bold p-4">{t("inventory", "Makinat")}</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-72 px-4">
          <button
            className="float-right mb-4 px-4 py-2 rounded bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-sm font-medium border border-gray-200 dark:border-zinc-700 transition lg:hidden"
            onClick={() => setFilterOpen((v) => !v)}
          >
            {filterOpen ? t("hideFilters") : t("showFilters")}
          </button>
          <div
            className={`${
              filterOpen ? "block" : "hidden"
            } sticky top-[84px] lg:block clear-both transition-all duration-200`}
          >
            <div className="bg-inherit rounded-xl shadow-none p-0 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <svg
                  className="w-5 h-5 text-gray-500 dark:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm3 4h12M7 8v8m10-8v8"
                  />
                </svg>
                <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {t("filters")}
                </span>
              </div>
              <form
                className="flex flex-col gap-4 dark:text-gray-100"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="flex flex-col gap-4">
                  <button
                    type="button"
                    id="new"
                    aria-pressed={newFilter === "true"}
                    onClick={() =>
                      handleFilterChange(
                        "new",
                        newFilter === "true" ? "" : "true"
                      )
                    }
                    className="relative h-[40px] bg-zinc-200 dark:bg-zinc-800 transition-colors focus:outline-none rounded"
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 flex w-full z-50 items-center justify-around px-2 py-1 font-medium">
                      <span className="basis-1/2">{t("newCar")}</span>
                      <span className="basis-1/2">{t("usedCar")}</span>
                    </div>
                    <span
                      className={`absolute top-0 left-0 z-10 p-4 w-1/2 m-1 transform bg-white dark:bg-zinc-700 shadow rounded transition-transform ${
                        newFilter === "true" ? "" : "translate-x-full -ml-1"
                      }`}
                    />
                  </button>
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="availability"
                      className="text-xs text-gray-600 dark:text-gray-300 select-none cursor-pointer"
                    >
                      {t("availability")}
                    </label>
                    <button
                      type="button"
                      id="availability"
                      aria-pressed={availabilityFilter === "true"}
                      onClick={() =>
                        handleFilterChange(
                          "availability",
                          availabilityFilter === "true" ? "" : "true"
                        )
                      }
                      className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none ${
                        availabilityFilter === "true"
                          ? "bg-green-600"
                          : "bg-gray-200 dark:bg-zinc-700"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          availabilityFilter === "true"
                            ? "translate-x-[21px]"
                            : "translate-x-[3px]"
                        }`}
                      />
                    </button>
                  </div>
                </div>
                <details className="group" open>
                  <summary className="font-bold mb-4 flex items-center justify-between gap-2 cursor-pointer hover:text-black/80">
                    {t("brand")}
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
                  <fieldset className="flex flex-col gap-2 p-1 font-medium">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="brand-all"
                        name="brand"
                        value=""
                        checked={brandFilter === ""}
                        onChange={() => handleFilterChange("brand", "")}
                        className="accent-black size-4"
                      />
                      <label htmlFor="brand-all">{t("all")}</label>
                    </div>
                    {brands.map((brand) => (
                      <div className="flex items-center gap-2" key={brand}>
                        <input
                          type="radio"
                          id={`brand-${brand}`}
                          name="brand"
                          value={brand}
                          checked={brandFilter === brand}
                          onChange={() => handleFilterChange("brand", brand)}
                          className="accent-black size-4"
                        />
                        <label htmlFor={`brand-${brand}`}>{brand}</label>
                      </div>
                    ))}
                  </fieldset>
                </details>

                {/* Repeat for other filters - same dark mode pattern */}
                {/* Model */}

                <details className="group">
                  <summary className="font-bold mb-4 flex items-center justify-between gap-2 cursor-pointer hover:text-black/80">
                    {t("model")}
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
                  <fieldset
                    disabled={!brandFilter}
                    className="flex flex-col gap-2 p-1 font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="all"
                        name="model"
                        value=""
                        checked={modelFilter === ""}
                        onChange={() => handleFilterChange("model", "")}
                        className="accent-black size-4"
                      />
                      <label htmlFor="all">All</label>
                    </div>
                    {models.map((model) => {
                      const value =
                        typeof model === "string"
                          ? model.replace(/\s+/g, "-").toLowerCase()
                          : "";
                      return (
                        <div className="flex items-center gap-2" key={model}>
                          <input
                            type="radio"
                            id={value}
                            name="model"
                            value={value}
                            checked={modelFilter === value}
                            onChange={() => handleFilterChange("model", value)}
                            className="accent-black size-4"
                          />
                          <label htmlFor={value}>{model}</label>
                        </div>
                      );
                    })}
                  </fieldset>
                </details>
                {/* Year */}
                <details className="group">
                  <summary className="font-bold mb-4 flex items-center justify-between gap-2 cursor-pointer hover:text-black/80">
                    {t("year")}
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
                  <fieldset className="flex flex-col gap-2 p-1 font-medium">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="year-all"
                        name="year"
                        value=""
                        checked={yearFilter === ""}
                        onChange={() => handleFilterChange("year", "")}
                        className="accent-black size-4"
                      />
                      <label htmlFor="year-all">{t("all")}</label>
                    </div>
                    {years.map((year) => (
                      <div className="flex items-center gap-2" key={year}>
                        <input
                          type="radio"
                          id={`year-${year}`}
                          name="year"
                          value={year}
                          checked={yearFilter === String(year)}
                          onChange={() =>
                            handleFilterChange("year", String(year))
                          }
                          className="accent-black size-4"
                        />
                        <label htmlFor={`year-${year}`}>{year}</label>
                      </div>
                    ))}
                  </fieldset>
                </details>
                {/* Price */}
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">
                    {t("price")}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      value={minPrice}
                      onChange={(e) =>
                        handleFilterChange("minPrice", e.target.value)
                      }
                      className="w-20 border border-gray-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-100 rounded px-2 py-1 text-xs"
                      placeholder={t("min")}
                    />
                    <span className="text-gray-400 dark:text-gray-500">-</span>
                    <input
                      type="number"
                      min={0}
                      value={maxPrice}
                      onChange={(e) =>
                        handleFilterChange("maxPrice", e.target.value)
                      }
                      className="w-20 border border-gray-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-100 rounded px-2 py-1 text-xs"
                      placeholder={t("max")}
                    />
                  </div>
                </div>

                {/* Mileage */}
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">
                    {t("mileage")}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      value={minMileage}
                      onChange={(e) =>
                        handleFilterChange("minMileage", e.target.value)
                      }
                      className="w-20 border border-gray-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-100 rounded px-2 py-1 text-xs"
                      placeholder={t("min")}
                    />
                    <span className="text-gray-400 dark:text-gray-500">-</span>
                    <input
                      type="number"
                      min={0}
                      value={maxMileage}
                      onChange={(e) =>
                        handleFilterChange("maxMileage", e.target.value)
                      }
                      className="w-20 border border-gray-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-100 rounded px-2 py-1 text-xs"
                      placeholder={t("max")}
                    />
                  </div>
                </div>

                {/* Fuel */}
                <details className="group">
                  <summary className="font-bold mb-4 flex items-center justify-between gap-2 cursor-pointer hover:text-black/80">
                    {t("fuelType")}
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
                  <fieldset className="flex flex-col gap-2 p-1 font-medium">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="fuel-all"
                        name="fuelType"
                        value=""
                        checked={fuelTypeFilter === ""}
                        onChange={() => handleFilterChange("fuelType", "")}
                        className="accent-black size-4"
                      />
                      <label htmlFor="fuel-all">All</label>
                    </div>
                    {fuelTypes.map((fuel) => (
                      <div className="flex items-center gap-2" key={fuel}>
                        <input
                          type="radio"
                          id={`fuel-${fuel}`}
                          name="fuelType"
                          value={fuel}
                          checked={fuelTypeFilter === fuel}
                          onChange={() => handleFilterChange("fuelType", fuel ?? "")}
                          className="accent-black size-4"
                        />
                        <label htmlFor={`fuel-${fuel}`}>{fuel}</label>
                      </div>
                    ))}
                  </fieldset>
                </details>

                {/* Transmission */}
                <details className="group">
                  <summary className="font-bold mb-4 flex items-center justify-between gap-2 cursor-pointer hover:text-black/80">
                    {t("transmission")}
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
                  <fieldset className="flex flex-col gap-2 p-1 font-medium">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="trans-all"
                        name="transmission"
                        value=""
                        checked={transmissionFilter === ""}
                        onChange={() => handleFilterChange("transmission", "")}
                        className="accent-black size-4"
                      />
                      <label htmlFor="trans-all">{t("all")}</label>
                    </div>
                    {transmissions.map((trans) => (
                      <div className="flex items-center gap-2" key={trans}>
                        <input
                          type="radio"
                          id={`trans-${trans}`}
                          name="transmission"
                          value={trans}
                          checked={transmissionFilter === trans}
                          onChange={() =>
                            handleFilterChange("transmission", trans ?? "")
                          }
                          className="accent-black size-4"
                        />
                        <label htmlFor={`trans-${trans}`}>{trans}</label>
                      </div>
                    ))}
                  </fieldset>
                </details>

                {/* Body Type */}
                <details className="group">
                  <summary className="font-bold mb-4 flex items-center justify-between gap-2 cursor-pointer hover:text-black/80">
                    {t("bodyType")}
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
                  <fieldset className="flex flex-col gap-2 p-1 font-medium">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="body-all"
                        name="bodyType"
                        value=""
                        checked={bodyTypeFilter === ""}
                        onChange={() => handleFilterChange("bodyType", "")}
                        className="accent-black size-4"
                      />
                      <label htmlFor="body-all">{t("all")}</label>
                    </div>
                    {bodyTypes.map((body) => (
                      <div className="flex items-center gap-2" key={body}>
                        <input
                          type="radio"
                          id={`body-${body}`}
                          name="bodyType"
                          value={body}
                          checked={bodyTypeFilter === body}
                          onChange={() => handleFilterChange("bodyType", body ?? "")}
                          className="accent-black size-4"
                        />
                        <label htmlFor={`body-${body}`}>{body}</label>
                      </div>
                    ))}
                  </fieldset>
                </details>

                {/* Color */}
                <details className="group">
                  <summary className="font-bold mb-4 flex items-center justify-between gap-2 cursor-pointer hover:text-black/80">
                    {t("paint")}
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
                  <fieldset className="flex flex-col gap-2 p-1 font-medium">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="color-all"
                        name="color"
                        value=""
                        checked={colorFilter === ""}
                        onChange={() => handleFilterChange("color", "")}
                        className="accent-black size-4"
                      />
                      <label htmlFor="color-all">{t("all")}</label>
                    </div>
                    {colors.map((color) => (
                      <div className="flex items-center gap-2" key={color}>
                        <input
                          type="radio"
                          id={`color-${color}`}
                          name="color"
                          value={color}
                          checked={colorFilter === color}
                          onChange={() => handleFilterChange("color", color ?? "")}
                          className="accent-black size-4"
                        />
                        <label htmlFor={`color-${color}`}>
                          {(color ?? "").charAt(0).toUpperCase() +
                            (color ?? "").slice(1)}
                        </label>
                      </div>
                    ))}
                  </fieldset>
                </details>

                <button
                  type="button"
                  className="mt-2 px-3 py-2 rounded bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-sm font-medium border border-gray-200 dark:border-zinc-700 transition"
                  onClick={() => navigate(location.pathname)}
                >
                  {t("clearFilters")}
                </button>
              </form>
            </div>

            {brandFilter && modelFilter && (
              <div className="mt-4">
                <Link
                  to={`/cars?brand=${encodeURIComponent(brandFilter)}`}
                  className="border-b-2 border-transparent hover:border-gray-900 hover:opacity-80 text-sm text-gray-700 dark:text-gray-300"
                >
                  {t("seeAllTeslas")}
                </Link>
              </div>
            )}
          </div>
        </aside>
        <main className="flex-1">          
          <div className="flex justify-between items-center mb-4">            
            <div className="hidden lg:block text-xs text-black dark:text-zinc-400">
              {getAppliedFilters().length > 0 ? (
                <span className="block">
                  {t("activeFilters")}{" "}
                  {getAppliedFilters().map((f, i) => (
                    <span key={i} className="mr-2">
                      {f}
                    </span>
                  ))}
                </span>
              ) : (
                <span className="block">{t("noActiveFilters")}</span>
              )}
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <label htmlFor="sort" className="text-sm font-medium">
                {t("sortBy")}:
              </label>
              <select
                id="sort"
                className="border border-gray-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-100 rounded px-2 py-1 text-sm"
                value={params.get("sort") || ""}
                onChange={(e) => handleFilterChange("sort", e.target.value)}
              >
                <option value="">{t("all")}</option>
                <option value="priceAsc">{t("sortOptions.priceAsc")}</option>
                <option value="priceDesc">{t("sortOptions.priceDesc")}</option>
                <option value="yearDesc">{t("sortOptions.yearDesc")}</option>
                <option value="yearAsc">{t("sortOptions.yearAsc")}</option>
                <option value="mileageAsc">{t("sortOptions.mileageAsc")}</option>
                <option value="mileageDesc">{t("sortOptions.mileageDesc")}</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredCars.length > 0 ?  filteredCars.map((car, idx) => {
              const thumb =
                car.gallery && car.gallery.length > 0
                  ? urlFor(car.gallery[0])
                  : undefined;
              const euroValue = Number(car.currentPrice.replace(/[^\d]/g, ""));
              const previousEuroValue = car.previousPrice
                ? Number(car.previousPrice.replace(/[^\d]/g, ""))
                : undefined;
              const onSale = previousEuroValue && previousEuroValue > euroValue;
              // Fix: Use encodeURIComponent for brand and model in URL
              const detailsUrl = `/cars/${encodeURIComponent(
                car.brand.toLowerCase()
              )}/${
                car.model
                  ? encodeURIComponent(
                      car.model.replace(/\s+/g, "-").toLowerCase()
                    )
                  : "unknown"
              }/${car.slug?.current}`;
              return (
                <div
                  className={
                    "relative aspect-[500/450] bg-white dark:bg-inherit flex flex-col items-center transition  border border-black/20 dark:border-white/20 cursor-pointer rounded-lg  " +
                    (car.availability ? "" : "opacity-60 pointer-events-none")
                  }
                  onClick={() => navigate(detailsUrl)}
                  tabIndex={0}
                  role="button"
                  aria-label={t("viewDetailsFor", { car: car.name })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      navigate(detailsUrl);
                  }}
                >
                  {!car.availability && (
                    <span className="absolute top-3 left-3 z-10 px-3 py-1 text-xl rounded bg-red-600 text-white font-bold shadow">
                      {t("sold")}
                    </span>
                  )}
                  {onSale && (
                    <span className="absolute top-3 left-3 z-10 px-3 py-1 text-xl rounded bg-red-500 text-white  font-bold shadow border border-red-700">
                      {t("onSale")}
                    </span>
                  )}
                  {car.new && (
                    <span className="absolute top-3 left-3 z-10 px-3 py-1 text-xl rounded bg-blue-500 text-white font-bold shadow border border-blue-700">
                      {t("new")}
                    </span>
                  )}
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={car.name || "Car thumbnail"}
                      className="object-cover h-2/3 min-w-full rounded-t-lg hover:brightness-110"
                    />
                  ) : (
                    <div className="w-full h-28 flex items-center justify-center text-gray-400">
                      {t("noImage")}
                    </div>
                  )}
                  <div className="w-full p-5">
                    <div className="flex flex-col gap-1 text-black dark:text-zinc-100">
                      <div className="text-lg font-semibold  group-hover:underline p-1">
                        <span>{car.brand + " " + car.model}</span>
                        <span className="text-sm  ml-4 border border-black/20 dark:border-white/30 rounded p-1">
                          {car.year}
                        </span>
                      </div>
                      <div className="flex gap-4 items-center p-">
                        <span className=" font-extrabold text-black dark:text-zinc-100">
                          € {euroValue.toLocaleString()}
                        </span>
                        {onSale && previousEuroValue && (
                          <span className="line-through text-red-500 text-sm font-medium p-1">
                            € {previousEuroValue.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <span className="p-1">
                        {" "}
                        {car.new
                          ? t("newVehicle")
                          : `${t(
                              "usedCarWith"
                            )}  ${car.mileage.toLocaleString()} Km`}
                      </span>
                      <span className="p-1">
                        {car.fuelType == "Electric"
                          ? `${car.fuelType} ${t("withRange")} ${car.range}Km  `
                          : car.fuelType}
                      </span>
                      <div className="relative group hover:bg-zinc-200 w-fit p-1 rounded-md">
                        <CarPaint color={car.color ?? ""} />
                        {car.features && car.features.length > 0 && (
                          <div className="absolute left-0 top-full mt-4 z-20 min-w-[180px] bg-white dark:bg-zinc-800 rounded-lg shadow-xl p-3 text-xs text-black dark:text-gray-100 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity">
                            <ul className="flex gap-1 flex-wrap">
                              {car.features.map(
                                (feature: string, i: number) => (
                                  <li
                                    key={i}
                                    className=" border border-black/20 h-fit min-w-fit p-1 rounded-md"
                                  >
                                    {feature}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }): (<div className="text-center text-lg font-bold">
              {t("noCarsAvailable")} ☹️
            </div>)}
          </div>
        </main>
      </div>
    </div>
  );
}
