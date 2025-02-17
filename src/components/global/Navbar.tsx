import React from "react";
import { ThemeToggle } from "./ThemeToggle";

const Navbar = async () => {
  return (
    <nav className="flex items-center justify-between py-5">
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-5">
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
