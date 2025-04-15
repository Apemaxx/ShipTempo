import axios from "axios";
import { supabase } from "../api";
import { ArrivalNoticeData } from "@/components/ocean/ArrivalNotice";

// Interface for STGUSA API response
interface STGUSAResponse {
  success: boolean;
  data: any;
  message?: string;
}

// Interface for arrival notice search parameters
export interface ArrivalNoticeSearchParams {
  containerNumber?: string;
  billOfLading?: string;
  bookingNumber?: string;
  referenceNumber?: string;
  dateFrom?: string;
  dateTo?: string;
}

/**
 * Fetch arrival notices from STGUSA API
 * @param params Search parameters
 * @returns Promise with arrival notice data
 */
export async function fetchArrivalNotices(
  params: ArrivalNoticeSearchParams,
): Promise<ArrivalNoticeData[]> {
  try {
    // In a real implementation, this would be an actual API call to STGUSA
    // For now, we'll simulate the API call with a mock response

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock response with sample data
    const mockResponse: STGUSAResponse = {
      success: true,
      data: [
        {
          referenceNo: "LSI3017990",
          date: "3/25/25 12:00 AM",
          masterBLNo: "EGLV142500313922",
          preparedBy: "Jim Wonkchinda",
          subBLNo: "",
          houseBLNo: "AMIGL250093597A",
          shipper: {
            name: "EX-FREIGHT LOGISTICS CO.,LTD.",
            address: "RM1706, BUILDING 3, NO.19 ZHANG ZHOU ER LU",
            city: "QINGDAO",
            state: "",
            zip: "266073",
            country: "CHINA",
            tel: "+86 532 66775418/ 66775422",
          },
          consignee: {
            name: "EXFREIGHT ZETA INC 1",
            address: "2290-10TH AVE, SUITE 501",
            city: "LAKE WORTH",
            state: "FL",
            zip: "33461",
            country: "USA",
            tel: "877-208-5645",
            fax: "888-286-0772",
          },
          notifyParty: {
            name: "EXFREIGHT ZETA INC 1",
            address: "2290-10TH AVE, SUITE 501",
            city: "LAKE WORTH",
            state: "FL",
            zip: "33461",
            country: "USA-US",
            tel: "877-208-5645",
            fax: "888-286-0772",
            attn: "?",
          },
          vessel: {
            name: "COSCO AFRICA",
            voyage: "092E",
          },
          portOfLoading: "SHANGHAI/SHANG HAI,CHINA",
          etd: "3/17/2025",
          portOfDischarge: "LONG BEACH,CA",
          eta: "3/31/2025",
          placeOfDelivery: "LOS ANGELES,CA",
          finalDestination: "LOS ANGELES,CA",
          freightLocation: {
            name: "ST. GEORGE LOGISTICS",
            tel: "310-764-4395",
          },
          containerReturnLocation: "",
          firmCode: "Y292",
          availableDate: "",
          lastFreeDate: "",
          goDate: "",
          container: {
            containerNo: "BEAU4367270",
            sealNo: "EMCLRN8004",
            type: "40HQ",
          },
          cargo: {
            marks: "TOWNSEND",
            description:
              "100%POLYESTER MEN'S T-SHIRT\n100%POLYESTER WOMEN'S T-SHIRT\n100%POLYESTER BOY'S T-SHIRT\nFILE#: 1741271810",
            packages: 65,
            packageType: "CTNS",
            weight: {
              kg: 783.2,
              lbs: 1726.64,
            },
            measurement: {
              cbm: 3.82,
              cft: 135,
            },
          },
          remarks: "03/27: PLEASE CLEAR CUSTOM ASAP THANK YOU.",
          amsBLNo: "EFZISEL2503019",
          customerRefNo: "",
          broker: "",
          invoiceNo: "LAX3111033",
          invoiceDate: "03-25-2025",
          invoiceAmount: 129.88,
          invoiceCurrency: "USD",
        },
      ],
    };

    // Filter the mock data based on search parameters
    let filteredData = [...mockResponse.data];

    if (params.containerNumber) {
      filteredData = filteredData.filter((notice) =>
        notice.container.containerNo.includes(params.containerNumber!),
      );
    }

    if (params.billOfLading) {
      filteredData = filteredData.filter(
        (notice) =>
          notice.masterBLNo.includes(params.billOfLading!) ||
          notice.houseBLNo.includes(params.billOfLading!),
      );
    }

    if (params.bookingNumber) {
      filteredData = filteredData.filter((notice) =>
        notice.referenceNo.includes(params.bookingNumber!),
      );
    }

    if (params.referenceNumber) {
      filteredData = filteredData.filter(
        (notice) =>
          notice.referenceNo.includes(params.referenceNumber!) ||
          notice.customerRefNo.includes(params.referenceNumber!),
      );
    }

    return filteredData as ArrivalNoticeData[];
  } catch (error) {
    console.error("Error fetching arrival notices:", error);
    throw error;
  }
}

/**
 * Fetch a single arrival notice by reference number
 * @param referenceNo Reference number
 * @returns Promise with arrival notice data
 */
export async function fetchArrivalNoticeByReference(
  referenceNo: string,
): Promise<ArrivalNoticeData | null> {
  try {
    const notices = await fetchArrivalNotices({ referenceNumber: referenceNo });
    return notices.length > 0 ? notices[0] : null;
  } catch (error) {
    console.error(
      `Error fetching arrival notice with reference ${referenceNo}:`,
      error,
    );
    throw error;
  }
}

/**
 * Save arrival notice to database
 * @param arrivalNotice Arrival notice data
 * @returns Promise with success status
 */
export async function saveArrivalNotice(
  arrivalNotice: ArrivalNoticeData,
): Promise<boolean> {
  try {
    // In a real implementation, this would save to Supabase
    // For now, we'll just log the data
    console.log("Saving arrival notice to database:", arrivalNotice);

    // Simulate successful save
    return true;
  } catch (error) {
    console.error("Error saving arrival notice:", error);
    return false;
  }
}

/**
 * Get saved arrival notices from database
 * @returns Promise with arrival notice data
 */
export async function getSavedArrivalNotices(): Promise<ArrivalNoticeData[]> {
  try {
    // In a real implementation, this would fetch from Supabase
    // For now, we'll return an empty array
    return [];
  } catch (error) {
    console.error("Error getting saved arrival notices:", error);
    return [];
  }
}
