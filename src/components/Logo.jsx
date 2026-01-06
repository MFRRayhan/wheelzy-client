import React from "react";
import { Link } from "react-router";
import { GiCarWheel } from "react-icons/gi";

const Logo = () => {
  return (
    <Link className="inline-block" to="/">
      <div className="flex items-center gap-2 text-3xl">
        <GiCarWheel />
        <h3 className="font-bold text-primary">Wheelzy</h3>
      </div>
    </Link>
  );
};

export default Logo;
