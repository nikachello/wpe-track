import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dispatcher } from "@prisma/client";
import { Mail, Percent } from "lucide-react";
import React from "react";

interface DispatcherDetailsProps {
  dispatcher: Dispatcher;
  totalLoads: number;
  paidLoads: number;
  unpaidLoads: number;
  totalRevenue: number;
}

const DispatcherDetails: React.FC<DispatcherDetailsProps> = ({
  dispatcher,
  totalLoads,
  paidLoads,
  unpaidLoads,
  totalRevenue,
}) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>დისპეტჩერის დეტალები</CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-3xl font-bold text-foreground">
              {dispatcher.name}
            </h2>

            <div className="flex items-center mt-2 text-muted-foreground">
              <Mail className="w-4 h-4 mr-2" />
              <span>{dispatcher.email || "Email არ არის მითითებული"}</span>
            </div>

            {dispatcher.percentage && (
              <div className="flex items-center mt-2 text-muted-foreground">
                <Percent className="w-4 h-4 mr-2" />
                <span>{dispatcher.percentage}</span>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Card className="bg-card text-card-foreground">
              <CardContent className="p-3">
                <div className="text-sm text-muted-foreground">ტვირთები</div>
                <div className="text-2xl font-bold">{totalLoads}</div>
              </CardContent>
            </Card>

            <Card className="bg-card text-card-foreground">
              <CardContent className="p-3">
                <div className="text-sm text-muted-foreground">
                  ანაზღაურებული
                </div>
                <div className="text-2xl font-bold">{paidLoads}</div>
              </CardContent>
            </Card>

            <Card className="bg-card text-card-foreground">
              <CardContent className="p-3">
                <div className="text-sm text-muted-foreground">გადაუხდელი</div>
                <div className="text-2xl font-bold">{unpaidLoads}</div>
              </CardContent>
            </Card>

            <Card className="bg-card text-card-foreground">
              <CardContent className="p-3">
                <div className="text-sm text-muted-foreground">
                  ჯამური შემოსავალი
                </div>
                <div className="text-2xl font-bold">
                  ${totalRevenue.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DispatcherDetails;
