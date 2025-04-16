import { lazy } from "react";
import { RouteConfig } from "./types";

const ThemeSettings = lazy(() => import("../components/settings/ThemeSettings"));
const Notifications = lazy(() => import("../components/settings/Notifications"));
const Profile = lazy(() => import("../components/settings/Profile"));

const settingsRoutes: RouteConfig[] = [
  { path: "/settings/theme", element: <ThemeSettings /> },
  { path: "/settings/notifications", element: <Notifications /> },
  { path: "/settings/profile", element: <Profile /> },
];

export default settingsRoutes;