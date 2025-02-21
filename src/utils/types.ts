interface Driver {
  id: string;
  name: string;
}

interface CompanyDriver {
  driverId: string;
  spot: number;
}

interface Company {
  id: string;
  name: string;
  drivers: CompanyDriver[];
}
