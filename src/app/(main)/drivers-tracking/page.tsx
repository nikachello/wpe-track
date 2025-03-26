import { DriversTable } from "@/components/global/drivers-table/DriversTable";

export default async function Home() {
  return (
    <div className="w-max m-auto justify-center items-center">
      <DriversTable />
    </div>
  );
}
