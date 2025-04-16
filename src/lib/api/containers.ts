import { xanoApiClient } from "./index";
import { CONTAINERS_CODE } from "@/config";
import { XanoContainerResponse } from "@/types/api";

// Container interface (now sourced from Xano API)
export interface STGContainer extends XanoContainerResponse {}

// Fetch container data from Xano API
export async function fetchSTGContainers(): Promise<STGContainer[]> {
  try {
    const data = await xanoApiClient.get("/container", CONTAINERS_CODE);

    // Check if the response contains data
    if (!data || !Array.isArray(data)) {
      console.error("Invalid response format from Xano API:", data);
      return [];
    }

    // Map the API response to our STGContainer interface
    const containers: STGContainer[] = data.map((item: any) => ({
      id:
        item.id ||
        `stg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      containerNumber: item.containerNumber || "",
      jobNumber: item.jobNumber || "",
      location: item.location || "",
      masterBillNumber: item.masterBillNumber || "",
      vesselName: item.vesselName || "",
      customerReference: item.customerReference || "",
      status: item.status || "Unknown",
      stgReferenceNumber: item.stgReferenceNumber,
      vesselETA: item.vesselETA || "",
      availableAtPier: item.availableAtPier || "",
      appointmentDate: item.appointmentDate || "",
      outgatedDate: item.outgatedDate || "",
      dateIn: item.dateIn || "",
      stripDate: item.stripDate || "",
      availableAtSTG: item.availableAtSTG || "",
      returnEmptyDate: item.returnEmptyDate || "",
      goDate: item.goDate || "",
      cfsLotDetails: item.cfsLotDetails || null,
      containerAttachments: item.containerAttachments || [],
      type: item.type || "Unknown",
      carrier: item.carrier || "Unknown",
      pol: item.pol || "Unknown",
      pod: item.pod || "Unknown",
    }));

    // Return all containers
    return containers;
  } catch (error) {
    console.error("Error fetching container data from Xano API:", error);
    return [];
  }
}

// Fetch details for a specific container
export async function fetchContainerDetails(containerNumber: string) {
  try {
    const data = await xanoApiClient.get(
      `/container/${containerNumber}`,
      CONTAINERS_CODE
    );
    return data;
  } catch (error) {
    console.error(
      `Error fetching details for container ${containerNumber}:`,
      error
    );
    throw error;
  }
}

// Fetch CFS Cargo Details by job lot number
export interface CFSCargoDetails {
  cfsStation: string;
  jobNumber: string;
  lotNumber: string;
  container: string;
  masterBillNumber: string;
  amsBillNumber: string;
  houseBillNumber: string;
  customerReference: string;
  trackingNumber: string;
  purchaseOrderNumber: string;
  piecesManifested: string;
  piecesReceived: string;
  palletsReceived: string;
  weightInLBS: string;
  volumeInCBM: string;
  hazmat: string;
  headload: string;
  cargoDescription: string;
  insurance: string;
  totalInsuredValue: string;
  intlTotalInsuredValue: string | null;
  originalCustomer: string;
  cfsType: string;
  stripDate: string;
  freeTimeExpiresDate: string;
  availableAtCFSDate: string;
  originUNLocationCode: string;
  originCity: string;
  originState: string | null;
  originCountry: string | null;
  originISOCountryCode: string;
  cmsLocApiID: string;
  vesselETA: string;
  pickUpRequirements: {
    status: string;
    pickUpNumber: string;
    shippingStatus: string;
    customsReleaseFlag: string;
    customsRelease: string;
    freightRelease: string;
    freighReleaseDate: string;
    deliveryOrder: string;
    deliveryZipcode: string;
    cargoOnHold: string;
    marksHold: string;
    exchangePallet: string;
  };
  shippingInformation: {
    ata: string;
    eta: string;
    pickUpAgent: string;
    pickUpAgentCode: string;
    proNumber: string;
    shipDate: string;
    destination: string;
    itNumber: string;
    loadNumber: string;
    trailerNumber: string;
    releaseNumber: string;
    destinationCFSName: string | null;
    destinationCFSAddress: string | null;
    destinationCFSAddressLine2: string | null;
    destinationCFSCity: string | null;
    destinationCFSState: string | null;
    destinationCFSTelephone: string | null;
    destinationCFSFax: string | null;
    destinationCFSFirmsCode: string | null;
    destinationCFSEmail: string | null;
    destinationTracking: string | null;
  };
  warehouseInformation: {
    cfsCode: string;
    cfsName: string;
    cfsAddress: string;
    cfsCity: string;
    cfsState: string;
    cfsZipcode: string;
    cfsPhone: string;
    cfsEmail: string;
  };
  ipiTrackingInformation: any | null;
  localTrackingInformation: any | null;
  attachments: string[];
  milestones: Array<{
    code: string;
    description: string;
    statusDateTime: string;
    city: string;
    state: string;
  }>;
  doorDeliveryMilestones: {
    apptDate: string;
    dispatchedDate: string;
    deliveredDate: string;
    pickuUpDate: string;
    sentDate204: string;
    receivedDate990: string;
  };
}

export async function fetchCFSCargoDetails(
  jobLotNumber: string
): Promise<CFSCargoDetails | null> {
  try {
    const data = await xanoApiClient.get(
      `/jobLot/${jobLotNumber}`,
      CONTAINERS_CODE
    );
    return data as CFSCargoDetails;
  } catch (error) {
    console.error(
      `Error fetching CFS cargo details for job lot ${jobLotNumber}:`,
      error
    );
    return null;
  }
}
