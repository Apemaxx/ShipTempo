import { lazy } from "react";
import { RouteConfig } from "./types";

const LandingPage = lazy(() => import("../components/LandingPage"));
const SignIn = lazy(() => import("../components/auth/SignIn"));
const SignUp = lazy(() => import("../components/auth/SignUp"));

const publicRoutes: RouteConfig[] = [
  { path: "/landing", element: <LandingPage /> },
  { path: "/signin", element: <SignIn /> },
  { path: "/signup", element: <SignUp /> },
];

export default publicRoutes;