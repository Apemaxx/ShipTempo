import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { RouteConfig } from "./types";

// Layouts
import MainLayout from "../components/layout/MainLayout";

// Eager-loaded components
import Home from "../components/home";
import { LoadingScreen } from "../components/common/LoadingScreen";

// Route configurations - Imported from dedicated files
import publicRoutes from "./publicRoutes";
import settingsRoutes from "./settingsRoutes";
import cfsRoutes from "./cfsRoutes";
import financeRoutes from "./financeRoutes";
import reportsRoutes from "./reportsRoutes";
import shipmentRoutes from "./shipmentRoutes";
import quoteRoutes from "./quoteRoutes";
import tempoRoutes from "../lib/tempo-routes";

/**
 * Protected route component - ensures user is authenticated
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    // Redirect to signin page but save the location they were trying to access
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Helper function for handling child routes
const renderChildRoutes = (route: RouteConfig) => {
  if (!route.children) return null;
  
  return route.children.map((childRoute) => (
    <Route
      key={childRoute.path || 'index'}
      index={!childRoute.path}
      path={childRoute.path}
      element={childRoute.element}
    />
  ));
};

/**
 * Main routing component
 */
export const AppRoutes = () => {
  // Integrations component with proper lazy loading
  const IntegrationsComponent = lazy(() => import("../components/cfs/Integrations"));
  
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Public Routes */}
        {publicRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}

        {/* Protected Routes - With MainLayout */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route path="/" element={<Home />} />

          {/* Settings Routes */}
          {settingsRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {/* Quote Routes */}
          {quoteRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {/* CFS Availability Routes */}
          {cfsRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element}>
              {renderChildRoutes(route)}
            </Route>
          ))}

          {/* Finance/Accounting Routes */}
          {financeRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element}>
              {renderChildRoutes(route)}
            </Route>
          ))}

          {/* Reports Routes */}
          {reportsRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element}>
              {renderChildRoutes(route)}
            </Route>
          ))}

          {/* Shipment Routes */}
          {shipmentRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {/* Integrations Route */}
          <Route path="/integrations" element={<IntegrationsComponent />} />
        </Route>

        {/* Tempo routes */}
        <Route path="/tempobook/*" element={<TempoRoutes />} />

        {/* Catch all route - redirect to signin */}
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </Suspense>
  );
};

/**
 * Wrapper for Tempo routes
 */
const TempoRoutes = () => {
  const TempoRouter = lazy(() => import("./TempoRouter"));
  return (
    <Suspense fallback={<LoadingScreen />}>
      <TempoRouter routes={tempoRoutes} />
    </Suspense>
  );
};

export default AppRoutes;