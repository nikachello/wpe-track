"use client";

import React from "react";
import { Dispatcher, RealDriver } from "@prisma/client";
import DispatcherCard from "@/components/global/DispatcherCard";

interface Props {
  dispatchers: Dispatcher[];
  drivers: RealDriver[];
}

const DispatcherCardWrapper: React.FC<Props> = ({ dispatchers, drivers }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {dispatchers.map((dispatcher) => {
        const dispatcherDrivers = drivers.filter(
          (driver) => driver.dispatcherId === dispatcher.id
        );

        return (
          <DispatcherCard
            key={dispatcher.id}
            dispatcher={dispatcher}
            drivers={dispatcherDrivers}
          />
        );
      })}
    </div>
  );
};

export default DispatcherCardWrapper;
