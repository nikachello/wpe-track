"use client";
import LoadForm from "@/components/forms/loads/LoadForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import React from "react";

interface LoadDrawerProps {
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}

const LoadDrawer: React.FC<LoadDrawerProps> = ({
  drawerOpen,
  setDrawerOpen,
}) => {
  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-center">ტვირთის დამატება</DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        <Card className="m-auto w-1/2 mx-auto my-5">
          <CardHeader>
            <CardTitle>ტვირთის დეტალები</CardTitle>
            <CardContent className="w-full p-4">
              <LoadForm setDrawerOpen={setDrawerOpen} drawerOpen={drawerOpen} />
            </CardContent>
          </CardHeader>
        </Card>
      </DrawerContent>
    </Drawer>
  );
};

export default LoadDrawer;
