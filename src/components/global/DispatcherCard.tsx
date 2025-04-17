// DispatcherCard.tsx
"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { User, Truck, Plus } from "lucide-react";
import { Dispatcher, RealDriver } from "@prisma/client";
import Link from "next/link";

interface DispatcherCardProps {
  dispatcher?: Dispatcher;
  drivers?: RealDriver[];
  type?: "view" | "add";
  onAddClick?: () => void;
}

const DispatcherCard: React.FC<DispatcherCardProps> = ({
  dispatcher,
  drivers = [],
  type = "view",
  onAddClick,
}) => {
  if (type === "add") {
    return (
      <Card
        onClick={onAddClick}
        className="rounded-2xl shadow-md p-4 w-full max-w-md flex items-center justify-center 
                   cursor-pointer hover:bg-gray-100 transition-all duration-300 border-2 border-dashed border-gray-300 min-h-[150px]"
      >
        <div className="flex flex-col items-center text-gray-500">
          <Plus className="w-8 h-8" />
          <p className="mt-2 text-sm font-medium">ახალი დისპეჩერის დამატება</p>
        </div>
      </Card>
    );
  }

  return (
    <Link href={`/admin/dispatchers/${dispatcher!.id}`}>
      <Card className="rounded-2xl shadow-md cursor-pointer p-4 w-full max-w-md transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg hover:brightness-105">
        <CardContent className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <User className="w-5 h-5 text-gray-500" /> {dispatcher?.name}
            </h2>
            <p className="text-sm text-gray-600">{dispatcher?.email}</p>
            <p className="text-sm text-gray-600">
              დისპეჩერის ანაზღაურება {dispatcher?.percentage}%
            </p>
          </div>

          {drivers.length > 0 ? (
            <div>
              <h3 className="font-medium text-gray-800">
                მძღოლები ({drivers.length})
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {drivers.map((driver) => (
                  <div
                    key={driver.id}
                    className="px-3 py-1 text-sm bg-gray-100 rounded-full text-gray-800 hover:bg-gray-500 hover:scale-[1.02] transition-all duration-300"
                  >
                    <Truck className="inline-block w-4 h-4 mr-1" />
                    {`${driver.name} | ${driver.vehicle} ${driver.trailerSize} ft`}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500 italic">
              მძღოლები არ არის მიბმული
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default DispatcherCard;
