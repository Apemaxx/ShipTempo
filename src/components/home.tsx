import React from "react";
import ShipmentLifecyclePanel from "./shipment/ShipmentLifecyclePanel";
import DocumentManager from "./shipment/DocumentManager";
import CommunicationHub from "./shipment/CommunicationHub";
import EventLogger from "./shipment/EventLogger";

const Home = () => {
  return (
    <div className="bg-gray-100">
      {/* Main Content */}
      <div className="overflow-auto">
        <div className="max-w-7xl mx-auto">
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Shipment Lifecycle Control Panel
            </h1>
            <p className="text-gray-500 mt-1">
              Manage your shipment through its entire lifecycle from quote to
              delivery
            </p>
          </header>

          {/* Main Shipment Lifecycle Panel */}
          <div className="mb-8">
            <ShipmentLifecyclePanel
              shipmentId="SHP-2023-0042"
              initialStatus="documentation"
            />
          </div>

          {/* Document Manager and Communication Hub */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <DocumentManager
              shipmentId="SHP-2023-0042"
              currentStatus="Documentation"
            />
            <CommunicationHub shipmentId="SHP-2023-0042" />
          </div>

          {/* Event Logger */}
          <div className="mb-6">
            <EventLogger shipmentId="SHP-2023-0042" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
