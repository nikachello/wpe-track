import Pusher from "pusher-js";
import React, { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

const SocketClient = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const pusher = new Pusher("9865990faeec082b3f3f", {
      cluster: "eu",
    });

    const channel = pusher.subscribe("drivers");

    channel.bind("driverAssigned", () => {
      // ------------------------- ^
      // ------------------------- | data ecera frcxhilebshi da ts error iko
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    });

    return () => {
      pusher.unsubscribe("drivers");
    };
  }, []);

  return <div></div>;
};

export default SocketClient;
