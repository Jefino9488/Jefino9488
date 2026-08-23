/**
 * Routes that flip to the sage light theme.
 * Single source of truth — App shell, desktop nav, and mobile nav all
 * read from here so the chrome always matches the page field.
 */
export const LIGHT_ROUTES = ["/blog", "/certificates"];

export const isLightRoute = (pathname: string) =>
  LIGHT_ROUTES.some((p) => pathname === p || pathname.startsWith(p + "/"));
