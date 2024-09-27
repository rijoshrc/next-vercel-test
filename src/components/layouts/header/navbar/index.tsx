import { Link as LinkType } from "@/type/link";
import NavItem from "./NavItem";

export type NavItem = {
  children?: LinkType[];
} & LinkType;

type NavListProps = {
  navItems: NavItem[];
};
const NavList: React.FC<NavListProps> = ({ navItems }) => {
  return (
    <ul className="navbar-nav ml-auto">
      {navItems.map((item) => (
        <NavItem key={item.destinationId} item={item} />
      ))}
    </ul>
  );
};

export default NavList;
