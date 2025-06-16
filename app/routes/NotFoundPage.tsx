//generate a not found page

import { useTranslation } from "react-i18next";
import { Link } from "react-router";

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-zinc-900 text-white px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-white/10">404</h1>
        <div className="relative -mt-32">
          <h2 className="text-4xl font-bold mb-4">{t("pageNotFound")}</h2>
          <p className="text-lg text-gray-400 mb-8">
            {t("pageNotFoundDescription")}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 text-white font-medium hover:bg-white/20 backdrop-blur-2xl transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            {t("backToHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
