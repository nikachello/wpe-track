"use server";

import {
  getDispatchers,
  getDriversForDispatchers,
} from "@/actions/dispatcherActions";
import DispatcherCardWrapper from "@/components/global/dispatchers/DispatchersCardsWrapper";
import React from "react";

const Page = async () => {
  const dispatchers = await getDispatchers();
  const drivers = await getDriversForDispatchers();

  return <DispatcherCardWrapper dispatchers={dispatchers} drivers={drivers} />;
};

export default Page;
