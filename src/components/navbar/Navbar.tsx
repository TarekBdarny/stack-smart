import React from "react";
import Logo from "../Logo";

const Navbar = () => {
  return (
    <header
      className="w-full bg-primary/80 h-[50px] flex items-center
    px-4 md:px-6 lg:px-8 justify-around
    "
    >
      <div>
        <Logo />
      </div>
      <nav>
        <ul></ul>
      </nav>
    </header>
  );
};

export default Navbar;
