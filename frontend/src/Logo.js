import React from "react";
import logo from "./logo.gif";

export const Logo = () => {
  return (
    <>
      <div className="absolute top-8 left-36 p-4">
        <img src={logo} alt="Logo" className="w-32 h-32 object-contain" />
      </div>
      <div className="absolute top-8 right-36 p-4">
        <img src={logo} alt="Logo" className="w-32 h-32 object-contain" />
      </div>
    </>
  );
};
