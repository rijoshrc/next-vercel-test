import React from "react";
import { Nav } from "@/type/navigation";
import MegaMenuItem from "./MegaMenuItem";

type MegaMenuProps = {
  navItems: Nav[];
};

const MegaMenu: React.FC<MegaMenuProps> = ({ navItems }) => {
  return (
    <ul className="navbar-nav ml-auto">
      {navItems.map((navItem, index) => (
        <MegaMenuItem key={`${navItem.title}-${index}`} navItem={navItem} />
      ))}
    </ul>
  );
};

export default MegaMenu;
