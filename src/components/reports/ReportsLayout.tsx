import React from "react";
import { Outlet } from "react-router-dom";

const ReportsLayout = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Reports & Analytics</h1>
      <div className="bg-background rounded-lg shadow-sm">
        <Outlet />
      </div>
    </div>
  );
};

export default ReportsLayout;
