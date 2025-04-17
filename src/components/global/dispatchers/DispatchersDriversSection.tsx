import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RealDriver } from "@prisma/client";
import { Package, Percent, Phone, Truck } from "lucide-react";
import React from "react";

type DispatchersDriversSectionProps = {
  drivers: RealDriver[];
};

const DispatchersDriversSection: React.FC<DispatchersDriversSectionProps> = ({
  drivers,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>მძღოლები ({drivers.length})</CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {drivers.map((driver) => (
            <Card key={driver.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <h3 className="font-bold text-lg">{driver.name}</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center text-muted-foreground">
                    <Truck className="w-4 h-4 mr-2" />
                    <span>{driver.vehicle}</span>
                  </div>

                  {driver.trailerSize && (
                    <div className="flex items-center text-muted-foreground">
                      <Package className="w-4 h-4 mr-2" />
                      <span>{driver.trailerSize}</span>
                    </div>
                  )}

                  <div className="flex items-center text-muted-foreground">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>{driver.phoneNumber}</span>
                  </div>

                  {driver.percentage && (
                    <div className="flex items-center text-muted-foreground">
                      <Percent className="w-4 h-4 mr-2" />
                      <span>{driver.percentage}%</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DispatchersDriversSection;
