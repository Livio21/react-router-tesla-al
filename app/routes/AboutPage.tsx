import React from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen px-6 py-12 max-w-4xl mx-auto text-gray-800 dark:text-gray-200">
      <section className="mb-10">
        <h1 className="text-4xl font-bold mb-6">{t("about.title")}</h1>
        <p className="mb-4 text-lg">{t("about.intro1")}</p>
        <p className="mb-4 text-lg">{t("about.intro2")}</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          {t("about.servicesTitle")}
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>{t("about.services.sale")}</li>
          <li>{t("about.services.parts")}</li>
          <li>{t("about.services.maintenance")}</li>
          <li>{t("about.services.rental")}</li>
        </ul>

        <p className="mt-8 text-lg">{t("about.contactInfo")}</p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {t("about.socialsTitle")}
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <a
              href="https://www.facebook.com/permakinat"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {t("about.socials.facebook")}
            </a>
          </li>
          <li>
            <a
              href="https://www.instagram.com/permakinat.al"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {t("about.socials.instagram")}
            </a>
          </li>
          <li>
            <a
              href="https://www.tiktok.com/@permakinat.al"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {t("about.socials.tiktok")}
            </a>
          </li>
        </ul>
      </section>

      <div className="text-center mt-10">
        <Link
          to="/cars"
          className="inline-block px-6 py-3 rounded-lg bg-black text-white font-bold border border-white/20 hover:bg-white hover:text-black transition"
        >
          {t("about.browseCars")}
        </Link>
      </div>
    </main>
  );
}
