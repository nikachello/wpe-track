"use client";

import { getDispatcherById } from "@/actions/dispatcherActions";
import { getLoadsByDispatcherId } from "@/actions/loadActions";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import DispatcherDetails from "@/components/global/dispatchers/DispatcherDetails";
import DispatcherActiveLoads from "@/components/global/dispatchers/DispatcherActiveLoads";
import DispatcherCompletedLoads from "@/components/global/dispatchers/DispatcherCompletedLoads";
import DispatchersDriversSection from "@/components/global/dispatchers/DispatchersDriversSection";
import { DateRangePicker } from "@/components/global/DateRangePicker";

const Page = () => {
  const { id } = useParams();
  const dispatcherId =
    typeof id === "string" ? id : Array.isArray(id) ? id[0] : "";

  const {
    data: dispatcher,
    isLoading: isDispatcherLoading,
    error: dispatcherError,
  } = useQuery({
    queryKey: ["dispatcher", dispatcherId],
    queryFn: () => getDispatcherById(dispatcherId),
    enabled: !!dispatcherId,
  });

  const {
    data: loads = [],
    isLoading: isLoadsLoading,
    error: loadsError,
  } = useQuery({
    queryKey: ["loads", dispatcherId],
    queryFn: () => getLoadsByDispatcherId(dispatcherId),
    enabled: !!dispatcherId,
  });

  if (isDispatcherLoading || isLoadsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Skeleton className="h-8 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (dispatcherError || loadsError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md border-destructive">
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              <div className="text-xl font-semibold">შეცდომა</div>
              <div className="mt-2">
                მონაცემების ძიებისას შეცდომა დაფიქსირდა
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!dispatcher) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md border-warning">
          <CardContent className="pt-6">
            <div className="text-center text-warning">
              <div className="text-xl font-semibold">
                დისპეტჩერი არ მოიძებნა
              </div>
              <div className="mt-2">
                მითითებული ID-ით დისპეტჩერი ვერ მოიძებნა
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Group loads by status (assumption: completed if deliveryDate is in the past)
  const currentDate = new Date();
  const activeLoads = loads.filter(
    (load) => !load.deliveryDate || new Date(load.deliveryDate) >= currentDate
  );
  const completedLoads = loads.filter(
    (load) => load.deliveryDate && new Date(load.deliveryDate) < currentDate
  );

  // Calculate payment statistics
  const totalLoads = loads.length;
  const paidLoads = loads.filter((load) => load.isPaymentReceived).length;
  const unpaidLoads = totalLoads - paidLoads;
  const totalRevenue = loads.reduce(
    (sum, load) => sum + parseFloat(load.price || "0"),
    0
  );

  return (
    <div className="container mx-auto space-y-5 px-4 py-8">
      <DateRangePicker />
      {/* Header Section */}
      <DispatcherDetails
        dispatcher={dispatcher}
        totalLoads={totalLoads}
        paidLoads={paidLoads}
        unpaidLoads={unpaidLoads}
        totalRevenue={totalRevenue}
      />
      {/* Active Loads Section */}
      <DispatcherActiveLoads activeLoads={activeLoads} />
      {/* Completed Loads Section */}
      <DispatcherCompletedLoads completedLoads={completedLoads} />
      {/* Drivers Section */}
      {dispatcher.drivers && dispatcher.drivers.length > 0 && (
        <DispatchersDriversSection drivers={dispatcher.drivers} />
      )}
    </div>
  );
};

export default Page;
