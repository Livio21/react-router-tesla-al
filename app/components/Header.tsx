import { Link } from "react-router";
import React, {
  useRef,
  useState,
  createContext,
  useContext,
  useEffect,
} from "react";
import { useTranslation } from "react-i18next";

export const HeaderHoverContext = createContext<{
  headerHovered: boolean;
  setHeaderHovered: (v: boolean) => void;
}>({
  headerHovered: false,
  setHeaderHovered: () => {},
});

export const useHeaderHover = () => useContext(HeaderHoverContext);

export default function Header() {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { headerHovered, setHeaderHovered } = useHeaderHover();
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "tesla" | "cars" | "about" | "services" | null
  >(null);
  const { i18n, t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  

  const handleMouseEnter = (
    section: "tesla" | "cars" | "about" | "services"
  ) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setActiveSection(section);
    if (!dialogRef.current?.open) {
      dialogRef.current?.show();
      setHeaderHovered(true); // Set blur when dialog opens
    }
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      dialogRef.current?.close();
      setActiveSection(null);
      setHeaderHovered(false); // Remove blur when dialog closes
    }, 100);
  };

  const renderDialogContent = () => {
    if (activeSection === "tesla") {
      const teslaCars = [
        {
          name: "Model S",
          img: "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Mega-Menu-Vehicles-Model-S.png",
        },
        {
          name: "Model 3",
          img: "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Mega-Menu-Vehicles-Model-3.png",
        },
        {
          name: "Model X",
          img: "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Mega-Menu-Vehicles-Model-X.png",
        },
        {
          name: "Model Y",
          img: "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Mega-Menu-Vehicles-Model-Y.png",
        },
        {
          name: "Cybertruck",
          img: "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Mega-Menu-Vehicles-Cybertruck-1x.png",
        },
      ];

      return (
        <div className="grid grid-cols-12 pb-[16px] h-full">
          <div className="grid grid-cols-4 grid-rows-2 col-start-2 col-end-9 gap-4">
            {teslaCars.map((car, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center p-2 rounded-lg hover:border border-black/10   dark:hover:brightness-125 dark:hover:bg-black hover:bg-white duration-200"
              >
                <Link
                  className="text-center text-[14px] font-[550] hover:underline text-gray-800 dark:text-gray-200"
                  to={`/cars?brand=tesla&model=${encodeURIComponent(
                    car.name.toLowerCase().replace(/\s+/g, "-")
                  )}`}
                  onClick={() => {
                    dialogRef.current?.close();
                    setHeaderHovered(false);
                  }}
                >
                  <img
                    className="max-w-full h-auto"
                    src={car.img}
                    alt={car.name}
                  />
                </Link>
                <div className="flex flex-col items-center justify-center gap-2 mt-2">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    {car.name}
                  </h3>
                  <div className="flex gap-2 underline text-sm text-gray-500 dark:text-gray-400">
                    <Link
                      className="hover:text-black dark:hover:text-white"
                      to={`/info/${car.name.toLowerCase().replace(" ", "-")}`}
                      onClick={() => {
                        dialogRef.current?.close();
                        setHeaderHovered(false);
                      }}
                    >
                      Mëso më shumë
                    </Link>
                    <Link
                      className="hover:text-black dark:hover:text-white"
                      to={`/cars?brand=tesla&model=${encodeURIComponent(
                        car.name.toLowerCase().replace(/\s+/g, "-")
                      )}`}
                      onClick={() => {
                        dialogRef.current?.close();
                        setHeaderHovered(false);
                      }}
                    >
                      Porosit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 duration-200">
              <a href="">
                <img
                  className="max-w-full h-auto"
                  src="https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Mega-Menu-Vehicles-Inventory.png"
                  alt="Te gjitha makinat"
                />
              </a>
              <div className="flex flex-col items-center justify-center gap-2 mt-2">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  Te Gjitha
                </h3>
                <div className="flex gap-2 underline text-sm text-gray-500 dark:text-gray-400">
                  <Link
                    className="hover:text-black dark:hover:text-white"
                    to="/cars/tesla"
                    onClick={() => {
                      dialogRef.current?.close();
                      setHeaderHovered(false);
                    }}
                  >
                    Shiko
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[2px] justify-self-center col-start-9 col-end-10 bg-gray-100 dark:bg-gray-700"></div>
          <div className="col-start-10 col-end-12 text-[14px] font-[550] text-gray-800 dark:text-gray-200">
            <ul className="flex flex-col space-y-2">
              <li>
                <Link
                  to="/help"
                  className="border-b-2 border-transparent hover:border-gray-900 hover:opacity-80 dark:hover:border-gray-100"
                  onClick={() => {
                    dialogRef.current?.close();
                    setHeaderHovered(false);
                  }}
                >
                  Me ndihmo te zgjedh
                </Link>
              </li>
              <li>
                <Link
                  to="/test"
                  className="border-b-2 border-transparent hover:border-gray-900 hover:opacity-80 dark:hover:border-gray-100"
                  onClick={() => {
                    dialogRef.current?.close();
                    setHeaderHovered(false);
                  }}
                >
                  Test
                </Link>
              </li>
            </ul>
          </div>
        </div>
      );
    }

    if (activeSection === "about") {
      return (
        <div className="grid grid-cols-12 h-full">
          <div className="text-[14px] font-[550] col-start-4 col-end-6">
            <div>
              <h3 className="text-zinc-500 dark:text-zinc-400 font-normal text-[16px]">
                One
              </h3>
              <ul className="flex flex-col space-y-2 mt-1">
                <li>
                  <Link
                    className="border-b-2 border-transparent hover:border-gray-900 dark:hover:border-gray-100 hover:opacity-80 text-gray-800 dark:text-gray-200"
                    to="/help"
                    onClick={() => {
                      dialogRef.current?.close();
                      setHeaderHovered(false);
                    }}
                  >
                    Me ndihmo te zgjedh
                  </Link>
                </li>
                <li>
                  <Link
                    className="border-b-2 border-transparent hover:border-gray-900 dark:hover:border-gray-100 hover:opacity-80 text-gray-800 dark:text-gray-200"
                    to="/test"
                    onClick={() => {
                      dialogRef.current?.close();
                      setHeaderHovered(false);
                    }}
                  >
                    Test
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-[14px] font-[550] col-start-6 col-end-8">
            <div>
              <h3 className="text-zinc-500 dark:text-zinc-400 font-normal text-[16px]">
                Two
              </h3>
              <ul className="flex flex-col space-y-2 mt-1">
                <li>
                  <Link
                    className="border-b-2 border-transparent hover:border-gray-900 dark:hover:border-gray-100 hover:opacity-80 text-gray-800 dark:text-gray-200"
                    to="/help"
                    onClick={() => {
                      dialogRef.current?.close();
                      setHeaderHovered(false);
                    }}
                  >
                    Me ndihmo te zgjedh
                  </Link>
                </li>
                <li>
                  <Link
                    className="border-b-2 border-transparent hover:border-gray-900 dark:hover:border-gray-100 hover:opacity-80 text-gray-800 dark:text-gray-200"
                    to="/test"
                    onClick={() => {
                      dialogRef.current?.close();
                      setHeaderHovered(false);
                    }}
                  >
                    Test
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-[14px] font-[550] col-start-8 col-end-10">
            <div>
              <h3 className="text-zinc-500 dark:text-zinc-400 font-normal text-[16px]">
                Three
              </h3>
              <ul className="flex flex-col space-y-2 mt-1">
                <li>
                  <Link
                    className="border-b-2 border-transparent hover:border-gray-900 dark:hover:border-gray-100 hover:opacity-80 text-gray-800 dark:text-gray-200"
                    to="/help"
                    onClick={() => {
                      dialogRef.current?.close();
                      setHeaderHovered(false);
                    }}
                  >
                    Me ndihmo te zgjedh
                  </Link>
                </li>
                <li>
                  <Link
                    className="border-b-2 border-transparent hover:border-gray-900 dark:hover:border-gray-100 hover:opacity-80 text-gray-800 dark:text-gray-200"
                    to="/test"
                    onClick={() => {
                      dialogRef.current?.close();
                      setHeaderHovered(false);
                    }}
                  >
                    Test
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    if (activeSection === "services") {
      return (
        <div className="text-center text-[14px] font-[550] p-4 text-gray-800 dark:text-gray-200">
          <p>Na kontaktoni për më shumë rreth shërbimeve tona.</p>
          <ul className="mt-2 space-y-2">
            <li>
              <Link
                to="/service"
                className="border-b-2 border-transparent hover:border-gray-900 dark:hover:border-gray-100 hover:opacity-80"
                onClick={() => {
                  dialogRef.current?.close();
                  setHeaderHovered(false);
                }}
              >
                Servis
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="border-b-2 border-transparent hover:border-gray-900 dark:hover:border-gray-100 hover:opacity-80"
                onClick={() => {
                  dialogRef.current?.close();
                  setHeaderHovered(false);
                }}
              >
                Kontakt
              </Link>
            </li>
          </ul>
        </div>
      );
    }
    if (activeSection === "cars") {
      const cars = [
        {
          name: "Te gjitha",
          img: "https://www.mobilepitstopvan.com/wp-content/uploads/2020/11/r4.png",
          type: "all",
        },
        {
          name: "Elektrike",
          img: "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Mega-Menu-Vehicles-Inventory.png",
          type: "Electric",
        },
      ];

      return (
        <div className="flex justify-center gap-4 p-4">
          {cars.map((car, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 duration-200"
            >
              <Link
                className="text-center text-[14px] font-[550] hover:underline text-gray-800 dark:text-gray-200"
                to={`/${
                  car.type === "all" ? "cars" : `cars?fuelType=${car.type}`
                }`}
                onClick={() => {
                  dialogRef.current?.close();
                  setHeaderHovered(false);
                }}
              >
                <img
                  className="max-w-[200px] h-auto"
                  src={car.img}
                  alt={car.name}
                />
              </Link>
              <h3 className="text-gray-800 dark:text-gray-200">
                {car.type === "all" ? "Të gjitha" : "Elektrike"}
              </h3>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  // Language codes and display names
  const languages = [
    { code: "al", label: t("albanian", "AL") },
    { code: "en", label: t("english", "EN") },
    { code: "it", label: t("italian", "IT") },
  ];

  return (
    <section
      className="sticky top-0 z-50 bg-white/50 dark:bg-black/40 backdrop-blur-sm border-b border-black/10 dark:border-white/20 dark:text-zinc-200 transition-all duration-300 ease-in-out"
      onMouseLeave={handleMouseLeave}
    >
      <header className="flex items-center justify-between px-8 py-3 font-[550] relative">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-xl font-bold tracking-tight text-gray-900 dark:text-zinc-100 hover:opacity-80 transition bg-zinc-100 dark:bg-zinc-800 lg:bg-white p-2 rounded-lg"
          >
            Permakinat.al
          </Link>
        </div>

        <button
          className="md:hidden flex flex-col items-center justify-center p-2 rounded bg-gray-100 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
          aria-label="Open menu"
          onClick={() => setMobileMenuOpen(true)}
        >
          <span className="block w-6 h-0.5 bg-gray-800 dark:bg-gray-200 mb-1 rounded"></span>
          <span className="block w-6 h-0.5 bg-gray-800 dark:bg-gray-200 mb-1 rounded"></span>
          <span className="block w-6 h-0.5 bg-gray-800 dark:bg-gray-200 rounded"></span>
        </button>

        <ul className="hidden md:flex space-x-4 text-[14px] items-center ">
          <li onMouseEnter={() => handleMouseEnter("tesla")}>
            <Link
              aria-label="Tesla Logo"
              to="/cars?brand=tesla"
              className="relative group px-4 py-[2px] rounded w-[150px] flex items-center justify-center overflow-hidden shine-metal-btn transition-all duration-200 hover:invert"
              style={{
                background:
                  "linear-gradient(120deg, #e5e7eb 0%, #bfc1c6 30%, #f3f4f6 60%, #a3a3a3 100%)",
              }}
            >
              <span className="absolute inset-0 pointer-events-none z-10">
                <span className="shine-metal-anim" />
              </span>
              <svg
                viewBox="0 0 342 35"
                xmlns="http://www.w3.org/2000/svg"
                className="relative z-20 h-7 w-auto"
                style={{
                  filter:
                    "drop-shadow(0 1px 2px #bfc1c6) drop-shadow(0 2px 8px #a3a3a3)",
                }}
              >
                <defs>
                  <linearGradient
                    id="metal-gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#f3f4f6" />
                    <stop offset="20%" stopColor="#e5e7eb" />
                    <stop offset="40%" stopColor="#bfc1c6" />
                    <stop offset="60%" stopColor="#f3f4f6" />
                    <stop offset="100%" stopColor="#a3a3a3" />
                  </linearGradient>
                  <filter
                    id="metal-glow"
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="140%"
                  >
                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <path
                  fill="black"
                  d="M0 .1a9.7 9.7 0 0 0 7 7h11l.5.1v27.6h6.8V7.3L26 7h11a9.8 9.8 0 0 0 7-7H0zm238.6 0h-6.8v34.8H263a9.7 9.7 0 0 0 6-6.8h-30.3V0zm-52.3 6.8c3.6-1 6.6-3.8 7.4-6.9l-38.1.1v20.6h31.1v7.2h-24.4a13.6 13.6 0 0 0-8.7 7h39.9v-21h-31.2v-7zm116.2 28h6.7v-14h24.6v14h6.7v-21h-38zM85.3 7h26a9.6 9.6 0 0 0 7.1-7H78.3a9.6 9.6 0 0 0 7 7m0 13.8h26a9.6 9.6 0 0 0 7.1-7H78.3a9.6 9.6 0 0 0 7 7m0 14.1h26a9.6 9.6 0 0 0 7.1-7H78.3a9.6 9.6 0 0 0 7 7M308.5 7h26a9.6 9.6 0 0 0 7-7h-40a9.6 9.6 0 0 0 7 7"
                ></path>
              </svg>
              <span
                className="absolute left-0 right-0 bottom-1 text-center z-30 font-bold text-[15px] tracking-wide uppercase shine-metal-text select-none pointer-events-none"
                style={{
                  color: "#e5e7eb",
                  textShadow:
                    "0 1px 2px #bfc1c6, 0 2px 8px #a3a3a3, 0 0px 1px #fff",
                  letterSpacing: "0.08em",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  userSelect: "none",
                }}
              ></span>
              <style>
                {`
                  .shine-metal-btn {
                    box-shadow: 0 2px 8px 0 rgba(0,0,0,0.08);
                    position: relative;
                    transition: box-shadow 0.2s, background 0.2s, transform 0.2s;
                  }
                  .shine-metal-anim {
                    display: block;
                    position: absolute;
                    top: 0;
                    left: -60%;
                    width: 60%;
                    height: 100%;
                    background: linear-gradient(
                      120deg,
                      rgba(255,255,255,0) 0%,
                      rgba(255,255,255,0.7) 50%,
                      rgba(255,255,255,0) 100%
                    );
                    transform: skewX(-20deg);
                    animation: shine-metal-loop 2.5s linear infinite;
                    opacity: 0.7;
                  }
                  @keyframes shine-metal-loop {
                    0% {
                      left: -60%;
                      opacity: 0.7;
                    }
                    10% {
                      opacity: 1;
                    }
                    40% {
                      left: 100%;
                      opacity: 1;
                    }
                    60% {
                      left: 100%;
                      opacity: 0.7;
                    }
                    100% {
                      left: -60%;
                      opacity: 0.7;
                    }
                  }
                  .shine-metal-text {
                    color: #e5e7eb;
                    text-shadow: 0 1px 2px #bfc1c6, 0 2px 8px #a3a3a3, 0 0px 1px #fff;
                  }
                  .shine-metal-btn:hover,
                  .shine-metal-btn:focus-visible {
                    box-shadow: 0 4px 16px 0 rgba(0,0,0,0.16);
                    background: linear-gradient(120deg, #f3f4f6 0%, #e5e7eb 30%, #bfc1c6 60%, #a3a3a3 100%);
                    transform: translateY(-2px) scale(1.03);
                  }
                `}
              </style>
            </Link>
          </li>
          <li onMouseEnter={() => handleMouseEnter("cars")}>
            <Link
              to="/cars"
              className="hover:bg-gray-100 dark:hover:bg-zinc-800 transition px-4 py-2 rounded"
            >
              Makina
            </Link>
          </li>
          <li onMouseEnter={() => handleMouseEnter("about")}>
            <Link
              to="/about"
              className="hover:bg-gray-100 dark:hover:bg-zinc-800 transition px-4 py-2 rounded"
            >
              Rreth Nesh
            </Link>
          </li>
          <li onMouseEnter={() => handleMouseEnter("services")}>
            <Link
              to="/contact"
              className="hover:bg-gray-100 dark:hover:bg-zinc-800 transition px-4 py-2 rounded"
            >
              Kontakt
            </Link>
          </li>
        </ul>

        {/* Language + Theme (desktop) */}
        <ul className="hidden md:flex space-x-2 text-[14px] items-center">
          <li>
            <button
              aria-label={t(
                "toggleTheme",
                darkMode ? "Switch to light mode" : "Switch to dark mode"
              )}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
              title={
                darkMode
                  ? t("lightMode", "Switch to light mode")
                  : t("darkMode", "Switch to dark mode")
              }
            >
              {darkMode ? (
                <svg
                  className="w-5 h-5 text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="5" stroke="currentColor" />
                  <path
                    stroke="currentColor"
                    d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 7.07l-1.41-1.41M6.34 6.34L4.93 4.93m12.02 0l-1.41 1.41M6.34 17.66l-1.41 1.41"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-gray-700 dark:text-gray-200"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
                  />
                </svg>
              )}
            </button>
          </li>
          {languages.map((lang) => (
            <li key={lang.code}>
              <button
                className={`px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 transition text-xs font-semibold ${
                  i18n.language === lang.code
                    ? "bg-gray-200 dark:bg-zinc-700 text-black dark:text-white"
                    : ""
                }`}
                onClick={() => i18n.changeLanguage(lang.code)}
                aria-label={t("changeLanguageTo", {
                  lng: lang.code,
                  defaultValue: `Change language to ${lang.label}`,
                })}
                title={t("changeLanguageTo", {
                  lng: lang.code,
                  defaultValue: `Change language to ${lang.label}`,
                })}
                disabled={i18n.language === lang.code}
              >
                {lang.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <nav
            className="fixed top-0 right-0 w-full min-h-fit z-50 backdrop-blur-sm md:hidden bg-white dark:bg-zinc-900 shadow-lg p-6 transition-transform duration-200 transform translate-x-0 overflow-y-auto "
            onClick={(e) => e.stopPropagation()}
            onMouseLeave={() => setMobileMenuOpen(false)}
            aria-label="Mobile menu"
          >
            <button
              className=" float-right p-6 rounded bg-gray-100 dark:bg-zinc-800 relative mb-4"
              aria-label="Close menu"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="absolute top-1/2 right-1/2 translate-x-1/2 w-6 h-0.5 bg-gray-800 dark:bg-gray-200 rounded rotate-45 "></span>
              <span className="absolute top-1/2 right-1/2 translate-x-1/2 w-6 h-0.5 bg-gray-800 dark:bg-gray-200 rounded -rotate-45 "></span>
            </button>
            <ul className="flex flex-col gap-4 float-right clear-right text-[18px] font-semibold">
              <li>
                <Link
                  aria-label="Tesla Logo"
                  to="/cars?brand=tesla"
                  onClick={() => setMobileMenuOpen(false)}
                  className="relative group px-4 py-[2px] rounded w-[150px] flex items-center justify-center overflow-hidden shine-metal-btn transition-all duration-200 hover:invert"
                  style={{
                    background:
                      "linear-gradient(120deg, #e5e7eb 0%, #bfc1c6 30%, #f3f4f6 60%, #a3a3a3 100%)",
                  }}
                >
                  <span className="absolute inset-0 pointer-events-none z-10">
                    <span className="shine-metal-anim" />
                  </span>
                  <svg
                    viewBox="0 0 342 35"
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative z-20 h-7 w-auto"
                    style={{
                      filter:
                        "drop-shadow(0 1px 2px #bfc1c6) drop-shadow(0 2px 8px #a3a3a3)",
                    }}
                  >
                    <defs>
                      <linearGradient
                        id="metal-gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#f3f4f6" />
                        <stop offset="20%" stopColor="#e5e7eb" />
                        <stop offset="40%" stopColor="#bfc1c6" />
                        <stop offset="60%" stopColor="#f3f4f6" />
                        <stop offset="100%" stopColor="#a3a3a3" />
                      </linearGradient>
                      <filter
                        id="metal-glow"
                        x="-20%"
                        y="-20%"
                        width="140%"
                        height="140%"
                      >
                        <feGaussianBlur stdDeviation="1.5" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <path
                      fill="black"
                      d="M0 .1a9.7 9.7 0 0 0 7 7h11l.5.1v27.6h6.8V7.3L26 7h11a9.8 9.8 0 0 0 7-7H0zm238.6 0h-6.8v34.8H263a9.7 9.7 0 0 0 6-6.8h-30.3V0zm-52.3 6.8c3.6-1 6.6-3.8 7.4-6.9l-38.1.1v20.6h31.1v7.2h-24.4a13.6 13.6 0 0 0-8.7 7h39.9v-21h-31.2v-7zm116.2 28h6.7v-14h24.6v14h6.7v-21h-38zM85.3 7h26a9.6 9.6 0 0 0 7.1-7H78.3a9.6 9.6 0 0 0 7 7m0 13.8h26a9.6 9.6 0 0 0 7.1-7H78.3a9.6 9.6 0 0 0 7 7m0 14.1h26a9.6 9.6 0 0 0 7.1-7H78.3a9.6 9.6 0 0 0 7 7M308.5 7h26a9.6 9.6 0 0 0 7-7h-40a9.6 9.6 0 0 0 7 7"
                    ></path>
                  </svg>
                  <span
                    className="absolute left-0 right-0 bottom-1 text-center z-30 font-bold text-[15px] tracking-wide uppercase shine-metal-text select-none pointer-events-none"
                    style={{
                      color: "#e5e7eb",
                      textShadow:
                        "0 1px 2px #bfc1c6, 0 2px 8px #a3a3a3, 0 0px 1px #fff",
                      letterSpacing: "0.08em",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      userSelect: "none",
                    }}
                  ></span>
                  <style>
                    {`
                  .shine-metal-btn {
                    box-shadow: 0 2px 8px 0 rgba(0,0,0,0.08);
                    position: relative;
                    transition: box-shadow 0.2s, background 0.2s, transform 0.2s;
                  }
                  .shine-metal-anim {
                    display: block;
                    position: absolute;
                    top: 0;
                    left: -60%;
                    width: 60%;
                    height: 100%;
                    background: linear-gradient(
                      120deg,
                      rgba(255,255,255,0) 0%,
                      rgba(255,255,255,0.7) 50%,
                      rgba(255,255,255,0) 100%
                    );
                    transform: skewX(-20deg);
                    animation: shine-metal-loop 2.5s linear infinite;
                    opacity: 0.7;
                  }
                  @keyframes shine-metal-loop {
                    0% {
                      left: -60%;
                      opacity: 0.7;
                    }
                    10% {
                      opacity: 1;
                    }
                    40% {
                      left: 100%;
                      opacity: 1;
                    }
                    60% {
                      left: 100%;
                      opacity: 0.7;
                    }
                    100% {
                      left: -60%;
                      opacity: 0.7;
                    }
                  }
                  .shine-metal-text {
                    color: #e5e7eb;
                    text-shadow: 0 1px 2px #bfc1c6, 0 2px 8px #a3a3a3, 0 0px 1px #fff;
                  }
                  .shine-metal-btn:hover,
                  .shine-metal-btn:focus-visible {
                    box-shadow: 0 4px 16px 0 rgba(0,0,0,0.16);
                    background: linear-gradient(120deg, #f3f4f6 0%, #e5e7eb 30%, #bfc1c6 60%, #a3a3a3 100%);
                    transform: translateY(-2px) scale(1.03);
                  }
                `}
                  </style>
                </Link>
              </li>
              <li>
                <Link
                  to="/cars"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 px-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 block"
                >
                  Makina
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 px-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 block"
                >
                  Rreth Nesh
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 px-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 block"
                >
                  Kontakt
                </Link>
              </li>
            </ul>
            <div className="mt-8 flex flex-col gap-2 float-none clear-both">
              <button
                aria-label={t(
                  "toggleTheme",
                  darkMode ? "Switch to light mode" : "Switch to dark mode"
                )}
                className="self-end w-fit p-4 rounded bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition "
                title={
                  darkMode
                    ? t("lightMode", "Switch to light mode")
                    : t("darkMode", "Switch to dark mode")
                }
              >
                {darkMode ? (
                  <svg
                    className="w-5 h-5 text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="5" stroke="currentColor" />
                    <path
                      stroke="currentColor"
                      d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 7.07l-1.41-1.41M6.34 6.34L4.93 4.93m12.02 0l-1.41 1.41M6.34 17.66l-1.41 1.41"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 text-gray-700 dark:text-gray-200"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
                    />
                  </svg>
                )}
              </button>
              <div className="flex gap-2 mt-2 p-2 border border-black/10  rounded ">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className={`px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 transition text-xs font-semibold w-full ${
                      i18n.language === lang.code
                        ? "bg-gray-200 dark:bg-zinc-700 text-black dark:text-white"
                        : ""
                    }`}
                    onClick={() => {
                      i18n.changeLanguage(lang.code);
                    }}
                    aria-label={t("changeLanguageTo", {
                      lng: lang.code,
                      defaultValue: `Change language to ${lang.label}`,
                    })}
                    title={t("changeLanguageTo", {
                      lng: lang.code,
                      defaultValue: `Change language to ${lang.label}`,
                    })}
                    disabled={i18n.language === lang.code}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </nav>
        )}
      </header>

      <dialog
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        onMouseEnter={() =>
          hoverTimeout.current && clearTimeout(hoverTimeout.current)
        }
        onMouseLeave={handleMouseLeave}
        onClose={() => setHeaderHovered(false)}
        className={`fixed z-[100] w-full px-7 pb-8 pt-9 focus:outline-none
        bg-white/90 dark:bg-black/70  border-0
        transition-opacity duration-400 ease-out
        animate-dialog-slide-down`}
        style={{
          borderRadius: 0,
          border: "none",
          boxShadow: "0 8px 16px -8px rgba(0,0,0,0.15)",
        }}
      >
        <style>
          {`
          @keyframes dialog-slide-down {
            from {
              opacity: 0;
              transform: translateY(-24px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-dialog-slide-down {
            animation: dialog-slide-down 0.18s cubic-bezier(.4,0,.2,1);
          }
        `}
        </style>
        {renderDialogContent()}
      </dialog>
    </section>
  );
}
