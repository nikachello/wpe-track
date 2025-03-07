"use client";
import AddRealCompanyForm from "@/components/forms/admin/AddRealCompanyForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useCompanyContext } from "@/context/RealCompanyContext";
import React from "react";

const AddRealCompanyDrawer: React.FC = () => {
  const { drawerOpen, setDrawerOpen, editData } = useCompanyContext();

  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-center">
            {editData ? "ჩასწორება" : "დაამატე კომპანია"}
          </DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        <Card className="m-auto w-1/2 mx-auto my-5">
          <CardHeader>
            <CardTitle>კომპანიის მონაცემები</CardTitle>
            <CardContent className="w-full p-4">
              <AddRealCompanyForm />
            </CardContent>
          </CardHeader>
        </Card>
      </DrawerContent>
    </Drawer>
  );
};

export default AddRealCompanyDrawer;
