"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Link } from "@/type/link";
import { NavItem } from "./navbar";
import { Nav } from "@/type/navigation";
import MegaMenu from "./mega-menu";

// Dynamically import components
const FavoriteLabel = dynamic(() => import("./FavoriteLabel"));
const Logo = dynamic(() => import("./Logo"));
const MobileSearchBar = dynamic(() => import("./MobileSearchBar"));
const PhoneLabel = dynamic(() => import("./PhoneLabel"));
const SearchBar = dynamic(() => import("./SearchBar"));
const FavoriteBtn = dynamic(() => import("./mobile-navbar-btns/FavoriteBtn"));
const MenuBtn = dynamic(() => import("./mobile-navbar-btns/MenuBtn"));
const PhoneBtn = dynamic(() => import("./mobile-navbar-btns/PhoneBtn"));
const SearchBtn = dynamic(() => import("./mobile-navbar-btns/SearchBtn"));
// const NavList = dynamic(() => import("./navbar").then((mod) => mod.default));

type HeaderProps = {
  properties: {
    mainMenu: NavItem[];
    favoritePage: Link;
    phone: string;
    nav: Nav[];
  };
};

const Header: React.FC<HeaderProps> = ({ properties }) => {
  const { favoritePage, phone, nav } = properties;

  // mobile search bar display status
  const [showMobileSearchBar, setShowMobileSearchBar] = useState(false);
  // mobile menu section status
  const [showMenu, setShowMenu] = useState(false);

  // Use useCallback to memoize event handlers
  const toggleMobileSearchBar = useCallback(
    () => setShowMobileSearchBar((prev) => !prev),
    []
  );

  return (
    <>
      <div className="header__spacer"></div>
      <header className="no-print">
        <div className="container">
          <div className="row">
            {/* Top bar */}
            <div className="navbar-top">
              <PhoneLabel phone={phone} />
              <FavoriteLabel link={favoritePage} />
              <SearchBar />
            </div>

            <nav className="navbar custom-navbar navbar-expand-lg">
              <Logo />
              {/* Mobile navbar */}
              <div className="navbar__btns">
                <PhoneBtn phone={phone} />
                <SearchBtn onClick={toggleMobileSearchBar} />
                <FavoriteBtn link={favoritePage} />
                <MenuBtn showMenu={showMenu} setShowMenu={setShowMenu} />
              </div>

              <div
                className={`collapse navbar-collapse ${
                  showMobileSearchBar ? "show" : ""
                }`}
                id="searchBarContent"
              >
                <MobileSearchBar />
              </div>

              <div
                className={`collapse navbar-collapse ${showMenu ? "show" : ""}`}
                id="navbarSupportedContent"
              >
                {/* <NavList navItems={mainMenu} /> */}
                <MegaMenu navItems={nav} />
              </div>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
