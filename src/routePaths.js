export const ROUTE_PATHS = Object.freeze({
  home: "/",
  login: "/login",
  register: "/register",
  authCallback: "/auth/callback",
  planner: "/planner",
  recipes: "/recipes",
  createRecipe: "/create-recipe",
  profile: "/profile",
  fallback: "*",
});

export const PUBLIC_ROUTE_PATHS = Object.freeze([
  ROUTE_PATHS.home,
  ROUTE_PATHS.login,
  ROUTE_PATHS.register,
  ROUTE_PATHS.authCallback,
  ROUTE_PATHS.planner,
  ROUTE_PATHS.recipes,
  ROUTE_PATHS.createRecipe,
  ROUTE_PATHS.fallback,
]);
