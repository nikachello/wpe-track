import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";

interface GenericDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  editMode?: boolean;
  children: React.ReactNode;
  cardClassName?: string;
}

export const GenericDrawer: React.FC<GenericDrawerProps> = ({
  isOpen,
  onOpenChange,
  title,
  editMode = false,
  children,
  cardClassName = "m-auto w-1/2 mx-auto my-5",
}) => {
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-center">
            {editMode ? "ჩასწორება" : title}
          </DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        <Card className={cardClassName}>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent className="w-full p-4">{children}</CardContent>
        </Card>
      </DrawerContent>
    </Drawer>
  );
};
