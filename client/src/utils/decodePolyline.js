import polyline from "polyline";

export const decodeRoutes = (routes) => {
  return routes.map((route) => ({
    ...route,
    coordinates: polyline.decode(route.geometry),
  }));
};