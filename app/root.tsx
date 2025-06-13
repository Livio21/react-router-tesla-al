import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation
} from "react-router";
import { useState, useEffect } from "react";
import type { Route } from "./+types/root";
import "./app.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { HeaderHoverContext } from "./components/Header";
import { AnimatePresence, motion } from "framer-motion";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [headerHovered, setHeaderHovered] = useState(false);
  const hideFooter = /^\/cars\/[^/]+\/[^/]+\/[^/]+$/.test(location.pathname);
  return (
    <>
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
        </head>
        <body>
          <HeaderHoverContext.Provider
            value={{ headerHovered, setHeaderHovered }}
          >
            <I18nextProvider i18n={i18n}>
              <main className="bg-white dark:bg-zinc-900 ">
                <Header />
                <div
                  className={`transition-all duration-200 min-h-full${
                    headerHovered
                      ? "filter blur-xs pointer-events-none select-none "
                      : ""
                  }`}
                >
                  {children}
                </div>
                {!hideFooter && (
                  <div
                    className={
                      headerHovered
                        ? "filter bldur-xs pointer-events-none select-none transition-all duration-200"
                        : ""
                    }
                  >
                    <Footer />
                  </div>
                )}
              </main>
            </I18nextProvider>
          </HeaderHoverContext.Provider>
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    </>
  );
}

export default function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const minLoadingTime = 350; // ms

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let minTimeout: NodeJS.Timeout;
    setLoading(true);
    setShowSpinner(false);

    // Show spinner only if loading takes more than 100ms (prevents flicker)
    timeout = setTimeout(() => setShowSpinner(true), 100);

    // Always show spinner for at least minLoadingTime ms
    minTimeout = setTimeout(() => {
      setLoading(false);
      setShowSpinner(false);
    }, minLoadingTime);

    return () => {
      clearTimeout(timeout);
      clearTimeout(minTimeout);
    };
  }, [location.pathname]);

  return (
    <>
      {showSpinner && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/10 pointer-events-none">
          <span className="inline-block w-12 h-12 border-4 border-gray-300 border-t-gray-900 dark:border-t-zinc-100 rounded-full animate-spin" />
        </div>
      )}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
          className=""
        >
          
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
