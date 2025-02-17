import React from "react";
import Navbar from "@/components/global/Navbar";

type Props = {
  children: React.ReactNode;
};

const Layout = (props: Props) => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
      <Navbar />
      {props.children}
    </div>
  );
};

export default Layout;
