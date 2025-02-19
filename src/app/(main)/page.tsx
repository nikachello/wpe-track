import { getCompanies, getDrivers } from "@/actions/actions";
import DriversTable from "@/components/global/DriversTable";

export default async function Home() {
  return (
    <div>
      <DriversTable />
    </div>
  );
}
