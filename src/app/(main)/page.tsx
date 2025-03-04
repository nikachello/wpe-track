import { DriversTable } from "@/components/global/drivers-table/DriversTable";
import { auth } from "@/utils/auth";
import { requireUser } from "@/utils/requireUser";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await requireUser("/login");

  return (
    <div>
      <DriversTable user={user!} />
    </div>
  );
}
