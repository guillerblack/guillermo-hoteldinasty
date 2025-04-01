import React from "react";
// Logo
import LogoWhite from "../assets/img/logo-white.svg";

const Footer = () => {
  return (
    <footer className="bg-primary py-12">
      <div className="container mx-auto text-white flex justify-between">
        {/* Logo */}
        <a href="/">
          <img src={LogoWhite} alt="" />
        </a>
        2025 proyecto . GUILLERMO MOSQUERA
      </div>
    </footer>
  );
};

export default Footer;
