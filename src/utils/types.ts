import { AssignableDrivers, PaymentType } from "@prisma/client";

export interface Driver {
  id: string;
  name: string;
}

export interface CompanyDriver {
  driverId: string;
  spot: number;
  superId: string | null;
}

export interface Company {
  id: string;
  name: string;
  drivers: CompanyDriver[];
  possibleDrivers: AssignableDrivers[];
}

export type LoadModel = {
  id: string;
  superId: string;
  paymentType: PaymentType;
  vin: string;
  pickupAddress: string;
  deliveryAddress: string;
  price: string;
  dispatcherId: string;
  realDriverId: string;
  realCompanyId: string;
  pickupDate: Date | null;
  deliveryDate: Date | null;
  isPaymentReceived: boolean;
  createdAt: Date;
  updatedAt: Date;
  dispatcher?: {
    id: string;
    name: string;
  };
  driver?: {
    id: string;
    name: string;
    vehicle: string;
    phoneNumber: string;
  };
  company?: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };
};

// Keep your existing Load type for use in the UI
export type Load = {
  id: string;
  paymentType: PaymentType;
  vin: string;
  pickupAddress: string;
  deliveryAddress: string;
  price: string;
  pickupDate: Date | null;
  deliveryDate: Date | null;
  isPaymentReceived: boolean;
  createdAt: Date;
  updatedAt: Date;
  dispatcher: {
    id: string;
    name: string;
  };
  driver: {
    id: string;
    name: string;
    vehicle: string;
    phoneNumber: string;
  };
  company?: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };
};
