import { Link } from "react-router";
import React, {
  useRef,
  useState,
  createContext,
  useContext,
  useEffect,
} from "react";
import { useTranslation } from "react-i18next";

// Context for header hover state
export const HeaderHoverContext = createContext<{
  headerHovered: boolean;
  setHeaderHovered: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  headerHovered: false,
  setHeaderHovered: () => {},
});

export const useHeaderHover = () => useContext(HeaderHoverContext);

// Tesla Button Component
const TeslaButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Link
      aria-label="Tesla Logo"
      to="/cars?brand=tesla"
      onClick={onClick}
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
        <path
          fill="black"
          d="M0 .1a9.7 9.7 0 0 0 7 7h11l.5.1v27.6h6.8V7.3L26 7h11a9.8 9.8 0 0 0 7-7H0zm238.6 0h-6.8v34.8H263a9.7 9.7 0 0 0 6-6.8h-30.3V0zm-52.3 6.8c3.6-1 6.6-3.8 7.4-6.9l-38.1.1v20.6h31.1v7.2h-24.4a13.6 13.6 0 0 0-8.7 7h39.9v-21h-31.2v-7zm116.2 28h6.7v-14h24.6v14h6.7v-21h-38zM85.3 7h26a9.6 9.6 0 0 0 7.1-7H78.3a9.6 9.6 0 0 0 7 7m0 13.8h26a9.6 9.6 0 0 0 7.1-7H78.3a9.6 9.6 0 0 0 7 7m0 14.1h26a9.6 9.6 0 0 0 7.1-7H78.3a9.6 9.6 0 0 0 7 7M308.5 7h26a9.6 9.6 0 0 0 7-7h-40a9.6 9.6 0 0 0 7 7"
        ></path>
      </svg>
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
            0% { left: -60%; opacity: 0.7; }
            10% { opacity: 1; }
            40% { left: 100%; opacity: 1; }
            60% { left: 100%; opacity: 0.7; }
            100% { left: -60%; opacity: 0.7; }
          }
          .shine-metal-btn:hover {
            box-shadow: 0 4px 16px 0 rgba(0,0,0,0.16);
            background: linear-gradient(120deg, #f3f4f6 0%, #e5e7eb 30%, #bfc1c6 60%, #a3a3a3 100%);
            transform: translateY(-2px) scale(1.03);
          }
        `}
      </style>
    </Link>
  );
};

// Navigation Link Component
const NavLink = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => (
  <Link
    to={to}
    className="hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300 px-4 py-2 rounded-lg text-gray-900 dark:text-white font-medium hover:scale-105 active:scale-95"
  >
    {children}
  </Link>
);

// Theme Toggle Component
const ThemeToggle = ({
  darkMode,
  setDarkMode,
  t,
}: {
  darkMode: boolean;
  setDarkMode: React.Dispatch<boolean>;
  t: (key: string, fallback: string) => string;
}) => (
  <button
    aria-label={t(
      "toggleTheme",
      darkMode ? "Switch to light mode" : "Switch to dark mode"
    )}
    className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300 text-gray-900 dark:text-white hover:scale-105 active:scale-95"
    title={
      darkMode
        ? t("lightMode", "Switch to light mode")
        : t("darkMode", "Switch to dark mode")
    }
    onClick={() => setDarkMode(!darkMode)}
  >
    {darkMode ? (
      <svg
        className="w-5 h-5 text-yellow-400"
        fill="none"
        stroke="currentColor"
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
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
        />
      </svg>
    )}
  </button>
);

// Language Selector Component
const LanguageSelector = ({
  languages,
  i18n,
  t,
}: {
  languages: { code: string; label: string }[];
  i18n: any;
  t: (key: string, fallback: string) => string;
}) => (
  <>
    {languages.map((lang) => (
      <button
        key={lang.code}
        className={`px-2 py-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300 text-xs font-semibold text-gray-900 dark:text-white hover:scale-105 active:scale-95 ${
          i18n.language === lang.code ? "bg-black/10 dark:bg-white/10" : ""
        }`}
        onClick={() => i18n.changeLanguage(lang.code)}
        aria-label={t("changeLanguageTo", `Change language to ${lang.label}`)}
        title={t("changeLanguageTo", `Change language to ${lang.label}`)}
        disabled={i18n.language === lang.code}
      >
        {lang.label}
      </button>
    ))}
  </>
);

// Dialog Content Component
const DialogContent = ({
  activeSection,
  closeDialog,
}: {
  activeSection: "tesla" | "cars" | "about" | "services" | null;
  closeDialog: () => void;
}) => {
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
      <div className="flex">
        <div className="flex-1 grid grid-cols-5 gap-6 p-4">
          {teslaCars.map((car, idx) => (
            <div key={idx} className="group relative">
              <Link
                to={`/cars?brand=tesla&model=${encodeURIComponent(
                  car.name.toLowerCase().replace(/\s+/g, "-")
                )}`}
                onClick={closeDialog}
                className="block"
              >
                <div className="relative h-[280px] overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
                  <img
                    className="absolute inset-0 h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                    src={car.img}
                    alt={car.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <h3 className="text-xl font-semibold">{car.name}</h3>
                    <div className="mt-4 flex gap-3">
                      <Link
                        to={`/info/${car.name.toLowerCase().replace(" ", "-")}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          closeDialog();
                        }}
                        className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-white/20"
                      >
                        Mëso më shumë
                      </Link>
                      <Link
                        to={`/cars?brand=tesla&model=${encodeURIComponent(
                          car.name.toLowerCase().replace(/\s+/g, "-")
                        )}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          closeDialog();
                        }}
                        className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-white/90"
                      >
                        Porosit
                      </Link>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
          <div className="group relative">
            <Link to="/cars/tesla" onClick={closeDialog} className="block">
              <div className="relative h-[280px] overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
                <img
                  className="absolute inset-0 h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  src="https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Mega-Menu-Vehicles-Inventory.png"
                  alt="Te gjitha makinat"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white opacity-0 transition-all duration-300 group-hover:opacity-100">
                  <h3 className="text-xl font-semibold">Te Gjitha</h3>
                  <div className="mt-4">
                    <Link
                      to="/cars/tesla"
                      onClick={(e) => {
                        e.stopPropagation();
                        closeDialog();
                      }}
                      className="inline-block rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-white/90"
                    >
                      Shiko
                    </Link>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
        <div className="w-[1px] bg-gray-200 dark:bg-gray-700" />
        <div className="w-p-4">
          <div className="space-y-1">
            <Link
              to="/help"
              onClick={closeDialog}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-900 dark:text-white transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium">Me ndihmo te zgjedh</span>
            </Link>
            <Link
              to="/compare"
              onClick={closeDialog}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-900 dark:text-white transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <span className="font-medium">Krahaso modelet</span>
            </Link>
            <Link
              to="/inventory"
              onClick={closeDialog}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-900 dark:text-white transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <span className="font-medium">Inventari</span>
            </Link>
            <Link
              to="/financing"
              onClick={closeDialog}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-900 dark:text-white transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium">Financim</span>
            </Link>
          </div>
        </div>
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
              onClick={closeDialog}
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

// Mobile Menu Component
const MobileMenu = ({
  onClose,
  languages,
  i18n,
  t,
  darkMode,
  setDarkMode,
  closeDialog,
}: {
  onClose: () => void;
  languages: { code: string; label: string }[];
  i18n: any;
  t: (key: string, fallback: string) => string;
  darkMode: boolean;
  setDarkMode: React.Dispatch<boolean>;
  closeDialog: () => void;
}) => (
  <nav
    className="fixed top-0 right-0 w-full min-h-fit z-50 backdrop-blur-sm md:hidden bg-white dark:bg-zinc-900 shadow-lg p-6 transition-transform duration-200 transform translate-x-0 overflow-y-auto"
    onClick={(e) => e.stopPropagation()}
    onMouseLeave={onClose}
    aria-label="Mobile menu"
  >
    <button
      className="float-right p-6 rounded bg-gray-100 dark:bg-zinc-800 relative mb-4"
      aria-label="Close menu"
      onClick={onClose}
    >
      <span className="absolute top-1/2 right-1/2 translate-x-1/2 w-6 h-0.5 bg-gray-800 dark:bg-gray-200 rounded rotate-45"></span>
      <span className="absolute top-1/2 right-1/2 translate-x-1/2 w-6 h-0.5 bg-gray-800 dark:bg-gray-200 rounded -rotate-45"></span>
    </button>
    <ul className="flex flex-col gap-4 float-right clear-right text-[18px] font-semibold">
      <li>
        <TeslaButton
          onClick={() => {
            closeDialog();
            onClose();
          }}
        />
      </li>
      <li>
        <Link
          to="/cars"
          onClick={onClose}
          className="py-3 px-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 block"
        >
          Makina
        </Link>
      </li>
      <li>
        <Link
          to="/about"
          onClick={onClose}
          className="py-3 px-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 block"
        >
          Rreth Nesh
        </Link>
      </li>
      <li>
        <Link
          to="/contact"
          onClick={onClose}
          className="py-3 px-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 block"
        >
          Kontakt
        </Link>
      </li>
    </ul>
    <div className="mt-8 flex flex-col gap-2 float-none clear-both">
      <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} t={t} />
      <div className="flex gap-2 mt-2 p-2 border border-black/10 rounded">
        {languages.map((lang) => (
          <button
            key={lang.code}
            className={`px-2 py-1 rounded hover:bg-white/20 transition text-xs font-semibold text-white ${
              i18n.language === lang.code ? "bg-white/20" : ""
            }`}
            onClick={() => i18n.changeLanguage(lang.code)}
            aria-label={t(
              "changeLanguageTo",
              `Change language to ${lang.label}`
            )}
            title={t("changeLanguageTo", `Change language to ${lang.label}`)}
            disabled={i18n.language === lang.code}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  </nav>
);

// Main Header Component
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

  const handleMouseEnter = (section: typeof activeSection) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setActiveSection(section);
    if (!dialogRef.current?.open) {
      dialogRef.current?.show();
      setHeaderHovered(true);
    }
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      dialogRef.current?.close();
      setActiveSection(null);
      setHeaderHovered(false);
    }, 100);
  };

  const closeDialog = () => {
    dialogRef.current?.close();
    setHeaderHovered(false);
  };

  // Language codes and display names
  const languages = [
    { code: "al", label: t("albanian", "AL") },
    { code: "en", label: t("english", "EN") },
    { code: "it", label: t("italian", "IT") },
  ];

  return (
    <section
      className="sticky top-0 z-50 w-full bg-white/40 dark:bg-black/40 backdrop-blur-2xl border-b border-white/20 dark:border-white/10 transition-all duration-300 ease-in-out shadow-lg shadow-black/5 group hover:bg-white/95 dark:hover:bg-black/95"
      onMouseLeave={handleMouseLeave}
    >
      <header className="flex items-center justify-between px-8 py-3 tracking-widest font-medium relative">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-xl font-bold tracking-tight text-gray-900 dark:text-white hover:opacity-80 transition p-2 rounded-lg hover:scale-105 active:scale-95"
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

        <ul className="hidden md:flex space-x-4 text-[14px] items-center">
          <li onMouseEnter={() => handleMouseEnter("tesla")}>
            <TeslaButton onClick={closeDialog} />
          </li>
          <li onMouseEnter={() => handleMouseEnter("cars")}>
            <NavLink to="/cars">{t("header.cars")}</NavLink>
          </li>
          <li onMouseEnter={() => handleMouseEnter("about")}>
            <NavLink to="/about">{t("header.about")}</NavLink>
          </li>
          <li onMouseEnter={() => handleMouseEnter("services")}>
            <NavLink to="/contact">{t("header.contact")}</NavLink>
          </li>
        </ul>

        <div className="hidden md:flex space-x-2 text-[14px] items-center">
          <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} t={t} />
          <LanguageSelector languages={languages} i18n={i18n} t={t} />
        </div>

        {mobileMenuOpen && (
          <MobileMenu
            onClose={() => setMobileMenuOpen(false)}
            languages={languages}
            i18n={i18n}
            t={t}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            closeDialog={closeDialog}
          />
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
        className={`fixed z-50 w-full focus:outline-none
          bg-white/95 dark:bg-black/95 backdrop-blur-2xl border-b border-white/20 dark:border-white/10
          transition-all duration-300 ease-out
          animate-dialog-slide-down shadow-lg shadow-black/5`}
        style={{
          borderRadius: 0,
          border: "none",
          boxShadow: "0 8px 32px -8px rgba(0,0,0,0.15)",
        }}
      >
        <style>
          {`
            @keyframes dialog-slide-down {
              from { opacity: 0; transform: translateY(-12px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-dialog-slide-down {
              animation: dialog-slide-down 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }
          `}
        </style>
        <DialogContent
          activeSection={activeSection}
          closeDialog={closeDialog}
        />
      </dialog>
    </section>
  );
}
