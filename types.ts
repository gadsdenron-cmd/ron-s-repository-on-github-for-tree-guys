export enum ServiceType {
  Trim = 'TRIM',
  Cut = 'CUT',
  Grind = 'GRIND',
}

export interface CompanyInfo {
  name: string;
  contactName: string;
  phone: string;
}

export interface CustomerInfo {
  name: string;
  address: string;
}

export interface LineItem {
  id: string; // unique id for mapping
  service: ServiceType;
  dimension: number;
  quantity: number;
  cost: number; // sub-total for this item (dimension * quantity * price_per_unit)
}

export interface Estimate {
  companyInfo: CompanyInfo;
  customerInfo: CustomerInfo;
  lineItems: LineItem[];
  haulAway: {
    included: boolean;
    truckloads: number;
    cost: number;
  };
  subTotal: number;
  finalTotal: number;
  date: string;
  minimumChargeApplied: boolean;
}


export interface Pricing {
  [ServiceType.Trim]: number;
  [ServiceType.Cut]: number;
  [ServiceType.Grind]: number;
  haulAwayPerLoad: number;
}

export const MINIMUM_CHARGE = 150;