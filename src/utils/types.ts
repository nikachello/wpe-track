export interface Driver {
  id: string;
  name: string;
}

export interface CompanyDriver {
  driverId: string;
  spot: number;
}

export interface Company {
  id: string;
  name: string;
  drivers: CompanyDriver[];
}
