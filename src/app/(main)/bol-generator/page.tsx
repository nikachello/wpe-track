import { getDrivers } from "@/actions/actions";
import { getFakeCompany } from "@/actions/admin-actions";
import BolForm from "@/components/forms/bol/GenerateBolForm";

export default async function Page() {
  const drivers = await getDrivers();
  const fakeCompany = await getFakeCompany();

  if (!fakeCompany) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">BOL გენერატორი</h1>
        <p>სტიკერის კომპანია არ მოიძებნა, მიმართეთ მენეჯერს.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">BOL გენერატორი</h1>
      <BolForm drivers={drivers} fakeCompany={fakeCompany} />
    </div>
  );
}
