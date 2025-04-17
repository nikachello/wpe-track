import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Load } from "@/utils/types";
import { format } from "date-fns";
import {
  Calendar,
  CheckCircle,
  DollarSign,
  MapPin,
  Package,
  Truck,
  XCircle,
} from "lucide-react";
import React from "react";

type DispatcherActiveLoadsProps = {
  activeLoads: Omit<Load, "dispatcher">[];
};

const DispatcherActiveLoads: React.FC<DispatcherActiveLoadsProps> = ({
  activeLoads,
}) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>აქტიური ტვირთები ({activeLoads.length})</CardTitle>
      </CardHeader>

      <div className="overflow-x-auto">
        {activeLoads.length > 0 ? (
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  აყვანა/ჩამოგდება
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  მძღოლი
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  კომპანია
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  თარიღები
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  ფასი
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  გადახდის სტატუსი
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {activeLoads.map((load) => (
                <tr key={load.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-primary" />
                      <span className="font-medium">{load.pickupAddress}</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <MapPin className="w-4 h-4 mr-2 text-destructive" />
                      <span>{load.deliveryAddress}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{load.driver?.name}</div>
                    <div className="text-sm text-muted-foreground flex items-center mt-1">
                      <Truck className="w-3 h-3 mr-1" />
                      {load.driver?.vehicle}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>{load.company?.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1 text-primary" />
                      {load.pickupDate
                        ? format(new Date(load.pickupDate), "MMM d, yyyy")
                        : "N/A"}
                    </div>
                    <div className="flex items-center mt-1">
                      <Calendar className="w-4 h-4 mr-1 text-accent" />
                      {load.deliveryDate
                        ? format(new Date(load.deliveryDate), "MMM d, yyyy")
                        : "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {load.price}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {load.isPaymentReceived ? (
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <CheckCircle className="w-3 h-3" />
                        გადახდილია
                      </Badge>
                    ) : (
                      <Badge
                        variant="destructive"
                        className="flex items-center gap-1"
                      >
                        <XCircle className="w-3 h-3" />
                        გადასახდელია
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-6 text-center text-muted-foreground">
            <Package className="w-12 h-12 mx-auto text-muted" />
            <p className="mt-2">აქტიური ტვირთები არ მოიძებნა</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default DispatcherActiveLoads;
