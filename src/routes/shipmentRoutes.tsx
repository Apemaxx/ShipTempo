import { lazy } from "react";
import { RouteConfig } from "./types";

const OceanExport = lazy(() => import("../components/shipments/OceanExport"));
const OceanImportModule = lazy(() => import("../components/ocean/OceanImportModule"));
const AirImport = lazy(() => import("../components/shipments/AirImport"));
const AirExport = lazy(() => import("../components/shipments/AirExport"));
const RoadFreight = lazy(() => import("../components/shipments/RoadFreight"));
const ClaimHandling = lazy(() => import("../components/shipment/ClaimHandling"));
const ShipmentTracking = lazy(() => import("../components/shipment/ShipmentTracking"));
const TruckingShipmentPreparation = lazy(() => import("../components/trucking/TruckingShipmentPreparation"));

const shipmentRoutes: RouteConfig[] = [
  { path: "/shipments/ocean-export", element: <OceanExport /> },
  { path: "/ocean/import", element: <OceanImportModule /> },
  { path: "/shipments/air-import", element: <AirImport /> },
  { path: "/shipments/air-export", element: <AirExport /> },
  { path: "/shipments/road-freight", element: <RoadFreight /> },
  { path: "/claims/:shipmentId", element: <ClaimHandling /> },
  { path: "/tracking/:shipmentId", element: <ShipmentTracking shipmentId={":shipmentId"} /> },
  { path: "/trucking/preparation", element: <TruckingShipmentPreparation /> },
];

export default shipmentRoutes;