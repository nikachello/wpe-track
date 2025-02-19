import React from "react";
import Logo from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between py-5">
      <Logo />

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-5">
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
