import type { SanityDocument } from "@sanity/client";
import { Link } from "react-router";
import { client } from "~/sanity/client";
import type { Route } from "./+types/HomePage";
import { useTranslation } from "react-i18next";

const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt}`;

export async function loader() {
  return { posts: await client.fetch<SanityDocument[]>(POSTS_QUERY) };
}

export function TawkTo() {
  if (typeof window === "undefined") return null;

  const tawkToScript = document.createElement("script");
  tawkToScript.src = "https://embed.tawk.to/64f0b3c1d5ab8b1d455e2a4f/1h6q7g9qk";
  tawkToScript.async = true;
  tawkToScript.setAttribute("crossorigin", "*");

  document.body.appendChild(tawkToScript);

  (window as any).Tawk_API = (window as any).Tawk_API || {};
  (function () {
    var s1 = document.createElement("script"),
      s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = "https://embed.tawk.to/6849b968aa4c3319118fe6ca/1itfvogin";

    s1.setAttribute("crossorigin", "*");
    if (s0.parentNode) {
      s0.parentNode.insertBefore(s1, s0);
    }
  })();
  return null;
}

export default function IndexPage() {
  const { t } = useTranslation();
  return (
    <main className="container mx-auto min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <TawkTo />
      <div className="w-full max-w-3xl flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-5xl font-extrabold text-center tracking-tight text-black dark:text-zinc-100 mb-2">
            Permakinat.al
          </h1>
          <p className="text-lg text-gray-700 dark:text-zinc-300 text-center max-w-xl">
            {t("homepage.subtitle")}
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <Link
            to="/cars?brand=tesla"
            className="px-8 py-3 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-300 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900   text-black font-bold text-lg shadow hover:brightness-90 hover:dark:brightness-110 transition"
          >
            {t("homepage.browseTeslas")}
          </Link>
          <Link
            to="/cars"
            className="px-8 py-3 rounded bg-gray-900 text-white font-bold text-lg shadow hover:bg-gray-800 transition"
          >
            {t("homepage.browseAllCars")}
          </Link>
        </div>
        <div className="mt-10 w-full flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-4 text-black dark:text-zinc-100">
            {t("homepage.whyTitle")}
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <li className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-6 shadow text-center">
              <span className="text-3xl mb-2 block">⚡</span>
              <span className="font-bold">{t("homepage.electricTitle")}</span>
              <p className="text-gray-600 dark:text-zinc-300 mt-2 text-sm">
                {t("homepage.electricDesc")}
              </p>
            </li>
            <li className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-6 shadow text-center">
              <span className="text-3xl mb-2 block">🔍</span>
              <span className="font-bold">{t("homepage.compareTitle")}</span>
              <p className="text-gray-600 dark:text-zinc-300 mt-2 text-sm">
                {t("homepage.compareDesc")}
              </p>
            </li>
            <li className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-6 shadow text-center">
              <span className="text-3xl mb-2 block">💬</span>
              <span className="font-bold">{t("homepage.supportTitle")}</span>
              <p className="text-gray-600 dark:text-zinc-300 mt-2 text-sm">
                {t("homepage.supportDesc")}
              </p>
            </li>
          </ul>
        </div>
        <div className="mt-12 text-center text-gray-500 text-sm">
          <span>
            {t("homepage.notSure")}{" "}
            <Link to="/help" className="underline hover:text-gray-900">
              {t("homepage.contactForAdvice")}
            </Link>
          </span>
        </div>
      </div>
      <div className="fixed bottom-0 w-full border-t border-black/10 dark:border-white/20 bg-white/50 dark:bg-black/50 p-4 mt-12 text-center text-gray-500 dark:text-zinc-400 backdrop-blur-sm  ">
        <Link
          to="/test-drive"
          className="bg-white dark:bg-zinc-700  border border-black/10 dark:border-white/10 py-2 px-4 rounded  hover:bg-gray-100 dark:hover:bg-zinc-600 transition animate-pulse hover:animate-none"
          title="Kerko Test Drive"
        >
          <img
            src="https://maxus.sa/wp-content/uploads/2024/04/testdrive-icon.png"
            alt=""
            className="inline-block w-6 h-6 mr-2 align-middle dark:invert"
          />
          <span className="text-gray-900 dark:text-zinc-100 font-semibold">
            Kerko Test Drive
          </span>
        </Link>
      </div>
    </main>
  );
}
