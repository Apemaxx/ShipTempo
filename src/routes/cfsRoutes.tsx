import { lazy } from "react";
import { RouteConfig } from "./types";

const CFSLayout = lazy(() => import("../components/cfs/CFSLayout"));
const Containers = lazy(() => import("../components/cfs/Containers"));
const CFSCargoDetails = lazy(() => import("../components/cfs/CFSCargoDetails"));
const OuturnReports = lazy(() => import("../components/cfs/OuturnReports"));
const CFSFees = lazy(() => import("../components/cfs/CFSFees"));
const Registration = lazy(() => import("../components/cfs/Registration"));
const Integrations = lazy(() => import("../components/cfs/Integrations"));

// Placeholder components for other CFS sections
const CustomsClearance = () => <div>Customs Clearance tracking coming soon</div>;
const FreightRelease = () => <div>Freight Release tracking coming soon</div>;
const LFD = () => <div>LFD tracking coming soon</div>;
const WarehouseReceipts = () => <div>Warehouse Receipts tracking coming soon</div>;
const FreightManipulation = () => <div>Freight Manipulation services tracking coming soon</div>;

const cfsRoutes: RouteConfig[] = [
  {
    path: "/cfs-availability",
    element: <CFSLayout />,
    children: [
      { path: undefined, element: <Containers /> }, // index route
      { path: "containers", element: <Containers /> },
      { path: "containers/job/:jobLotNumber", element: <CFSCargoDetails /> },
      { path: "outturn-reports", element: <OuturnReports /> },
      { path: "fees", element: <CFSFees /> },
      { path: "customs", element: <CustomsClearance /> },
      { path: "freight-release", element: <FreightRelease /> },
      { path: "lfd", element: <LFD /> },
      { path: "warehouse", element: <WarehouseReceipts /> },
      { path: "manipulation", element: <FreightManipulation /> },
      { path: "registration", element: <Registration /> },
    ],
  },
];

export default cfsRoutes;