import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/HomePage.tsx"),
  route(":slug", "routes/post.tsx"),
] satisfies RouteConfig;