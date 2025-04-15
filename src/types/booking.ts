export interface OceanExportBooking {
  bookingNumber: string;
  carrierBookingNumber: string;
  preparedBy: string;
  salesBy: string;
  date: string;
  shipper: {
    name: string;
    address: string;
    tel: string;
    fax: string;
    attn: string;
  };
  agent: string;
  consignee: string;
  notifyParty: string;
  vessel: {
    name: string;
    voyageNumber: string;
  };
  carrier: string;
  exportRefNo: string;
  placeOfReceipt: string;
  portOfLoading: string;
  portOfDischarge: string;
  placeOfDelivery: string;
  finalDestination: string;
  etd: string;
  eta: string;
  commodity: string;
  cargo: {
    kgs: number;
    lbs: number;
    cbm: number;
    cft: number;
    packages: number;
    unit: string;
  };
  dangerous: boolean;
  lc: boolean;
  deliveryInfo: {
    to: string;
    portRail: string;
    cutOffDate: string;
    cutOffTime: string;
    warehouse: string;
    sedDoc: string;
    moveType: string;
  };
  containerPickup: {
    location: string;
    tel: string;
    fax: string;
    cntrSize: string;
  };
  cargoPickup: {
    location: string;
    by: string;
    tel: string;
  };
  preQuoted: boolean;
  remarks: string[];
}
