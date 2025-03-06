import AddRealCompanyForm from "@/components/forms/admin/AddRealCompanyForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import React, { useState } from "react";

const AddRealCompanyDrawer = () => {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button onClick={() => setOpen(true)}>კომპანიის დამატება</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-center">დაამატე კომპანია</DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        <Card className="m-auto w-1/2 mx-auto my-5">
          <CardHeader>
            <CardTitle>კომპანიის მონაცემები</CardTitle>
            <CardContent className="w-full p-4">
              <AddRealCompanyForm closeDrawer={() => setOpen(false)} />
            </CardContent>
          </CardHeader>
        </Card>
      </DrawerContent>
    </Drawer>
  );
};

export default AddRealCompanyDrawer;
