import { Link } from "react-router";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="p-4 font-medium text-[12px]  bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border-t border-gray-200 dark:border-zinc-700">      <div className="container mx-auto ">
        <p className="mb-4 text-zinc-600">
          {t("footer.disclaimer")}
        </p>
        <nav>
          <ul className="flex flex-row flex-wrap justify-center items-center gap-[14px] ">
            <p className="">{t("copyright", { year: new Date().getFullYear() })}</p>
            <li>
              <Link to="/" className="hover:underline">
                {t("footer.home")}
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:underline">
                {t("footer.about")}
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:underline">
                {t("footer.contact")}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="text-center mt-4 mb-12">
        <p className="">
          {t("builtBy")}{" "}
          <a href="https://www.linkedin.com/in/livio-macaj/" target="new">
            Livio Macaj.
          </a>
        </p>
      </div>
    </footer>
  );
}
