import BolForm from "@/components/forms/bol/GenerateBolForm";

export default function Page() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">BOL გენერატორი</h1>
      <BolForm />
    </div>
  );
}
