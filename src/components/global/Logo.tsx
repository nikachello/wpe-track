import Link from "next/link";
import React from "react";
import LogoImage from "@/public/logo.png";

type Props = {
  classname?: string;
};

const Logo = ({ classname }: Props) => {
  return (
    <Link href="/" className={`flex items-center gap-2 ${classname}`}>
      <h1 className="text-2xl font-bold">
        WPE<span className="text-primary">Track</span>
      </h1>
    </Link>
  );
};

export default Logo;
