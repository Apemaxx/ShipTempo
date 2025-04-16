import { ReactNode } from "react";

export interface RouteConfig {
  path: string;
  element: ReactNode;
  children?: RouteChildConfig[];
}

export interface RouteChildConfig {
  path?: string; // undefined para rutas index
  element: ReactNode;
}
