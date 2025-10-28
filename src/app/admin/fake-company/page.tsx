"use server";
import React from "react";
import AddFakeCompanyForm from "@/components/forms/admin/AddFakeCompanyForm";
import { getFakeCompany } from "@/actions/admin-actions";

const Page = async () => {
  const fakeCompany = await getFakeCompany();
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">სტიკერის კომპანია</h1>
      <AddFakeCompanyForm fakeCompany={fakeCompany} />
    </div>
  );
};

export default Page;
