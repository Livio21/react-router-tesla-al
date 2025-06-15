import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { HeartIcon } from "@heroicons/react/24/solid";

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white dark:bg-[#0f0f0f] border-t border-gray-200 dark:border-zinc-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand/Logo Section */}
          <div className="flex flex-col items-center md:items-start">
            <Link
              to="/"
              className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100"
            >
              Permakinat.al
            </Link>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 max-w-xs text-center md:text-left">
              {t("footer.disclaimer")}
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
            <Link
              to="/"
              className="text-sm font-medium text-zinc-700 hover:text-blue-600 dark:text-zinc-300 dark:hover:text-blue-400 transition-colors"
            >
              {t("footer.home")}
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium text-zinc-700 hover:text-blue-600 dark:text-zinc-300 dark:hover:text-blue-400 transition-colors"
            >
              {t("footer.about")}
            </Link>
            <Link
              to="/contact"
              className="text-sm font-medium text-zinc-700 hover:text-blue-600 dark:text-zinc-300 dark:hover:text-blue-400 transition-colors"
            >
              {t("footer.contact")}
            </Link>
            <Link
              to="/privacy"
              className="text-sm font-medium text-zinc-700 hover:text-blue-600 dark:text-zinc-300 dark:hover:text-blue-400 transition-colors"
            >
              {t("footer.privacy")}
            </Link>
            <Link
              to="/terms"
              className="text-sm font-medium text-zinc-700 hover:text-blue-600 dark:text-zinc-300 dark:hover:text-blue-400 transition-colors"
            >
              {t("footer.terms")}
            </Link>
          </nav>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-zinc-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {t("copyright", { year: currentYear })}
            </p>

            <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400">
              <span>{t("builtBy")}</span>
              <a
                href="https://www.linkedin.com/in/livio-macaj/"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors flex items-center group"
              >
                Livio Macaj
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
