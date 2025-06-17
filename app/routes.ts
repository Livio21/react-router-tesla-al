import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/HomePage.tsx"),
  route("*", "routes/NotFoundPage.tsx"),
  route("about", "routes/AboutPage.tsx"),
  route("contact", "routes/ContactPage.tsx"),
  route("cars", "routes/CarsPage.tsx"),
  route("cars/:brand/:model/:slug", "routes/CarDetailsPage.tsx"),
  route("compare", "routes/ComparePage.tsx"),
  route("info/:type", "routes/InfoPage.tsx"),
  route("test-drive", "routes/TestDrivePage.tsx"),
] satisfies RouteConfig;