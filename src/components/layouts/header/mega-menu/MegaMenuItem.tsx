import { Nav } from "@/type/navigation";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  navItem: Nav;
};

const MegaMenuItem = ({ navItem }: Props) => {
  const params = useParams();
  const slugs = (params.slug as string[]) || [];
  const isCurrentNav = slugs.includes(navItem.route.path.replaceAll("/", ""));
  const megaMenuRef = useRef<HTMLDivElement | null>(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    const handleMenuPosition = () => {
      if (megaMenuRef.current) {
        const bounding = megaMenuRef.current.getBoundingClientRect();

        // Adjust horizontal position if out of viewport
        if (bounding.right > window.innerWidth) {
          megaMenuRef.current.style.left = `-${
            bounding.right - window.innerWidth + 20
          }px`;
        } else if (bounding.left < 0) {
          megaMenuRef.current.style.left = `-${bounding.left - 20}px`;
        } else {
          megaMenuRef.current.style.left = "0";
        }

        // Set the maximum height based on the available space
        const availableHeight = window.innerHeight - bounding.top - 20; // Leave 20px padding at the bottom
        megaMenuRef.current.style.maxHeight = `${availableHeight}px`;
        megaMenuRef.current.style.overflowY = "auto";
      }
    };

    const menuItem = megaMenuRef.current?.parentElement;

    if (menuItem) {
      menuItem.addEventListener("mouseenter", handleMenuPosition);
      menuItem.addEventListener("mouseleave", handleMenuPosition);
    }

    return () => {
      if (menuItem) {
        menuItem.removeEventListener("mouseenter", handleMenuPosition);
        menuItem.removeEventListener("mouseleave", handleMenuPosition);
      }
    };
  }, []);

  // Adjust position to keep sub-sub-menu in viewport
  const adjustSubMenuPosition = (ref: HTMLDivElement | null) => {
    if (!ref) return;

    const bounding = ref.getBoundingClientRect();

    // Horizontal adjustments
    if (bounding.right > window.innerWidth) {
      ref.style.left = `-${bounding.right - window.innerWidth + 20}px`;
    }
    if (bounding.left < 0) {
      ref.style.left = `${-bounding.left + 20}px`;
    }

    // Vertical adjustments
    if (bounding.bottom > window.innerHeight) {
      ref.style.maxHeight = `${window.innerHeight - bounding.top - 20}px`; // Adjust height to fit within viewport
      ref.style.overflowY = "auto"; // Add scrolling if needed
    }
  };

  const renderMenuItems = (items: Nav[]) => {
    return items.map((item, index) => {
      const hasChildren = item.children && item.children.length > 0;
      const subSubMenuRef = useRef<HTMLDivElement | null>(null);

      useEffect(() => {
        if (subSubMenuRef.current) {
          adjustSubMenuPosition(subSubMenuRef.current);
        }
      }, [subSubMenuRef.current]);

      return (
        <li
          key={`${item.title}-${index}`}
          className={hasChildren ? "sub-sub-menu-item" : ""}
          onMouseEnter={() => {
            if (subSubMenuRef.current) {
              adjustSubMenuPosition(subSubMenuRef.current);
            }
          }}
        >
          <Link href={item.route?.path} target={item.target || "_self"}>
            {item.title}
          </Link>
          {hasChildren && item.children && (
            <div
              ref={item.level === 2 ? subSubMenuRef : null} // Only apply ref to the sub-sub-menu level
              className={item.level === 1 ? "mega-menu" : "sub-sub-menu"}
            >
              <ul>{renderMenuItems(item.children)}</ul>
            </div>
          )}
        </li>
      );
    });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSubMenu = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderMobileMenuItems = (items: Nav[], parentId: string) => {
    return (
      <ul>
        {items.map((item, index) => {
          const itemId = `${parentId}-${index}`;
          const hasChildren = item.children && item.children.length > 0;

          return (
            <li key={itemId}>
              <div
                className={`${item.level > 1 ? "btn-submenu" : "btn-smenu"}`}
              >
                <Link href={item.route.path} title={item.title}>
                  {item.title}
                </Link>
                {hasChildren && (
                  <button
                    type="button"
                    onClick={() => toggleSubMenu(itemId)}
                    aria-expanded={!!expandedItems[itemId]}
                    data-toggle="collapse"
                    data-target={`#submenu-${itemId}`}
                  ></button>
                )}
              </div>
              {hasChildren && item.children && (
                <AnimatePresence>
                  {expandedItems[itemId] && (
                    <motion.div
                      id={`submenu-${itemId}`}
                      className="sidemenu-content collapse show"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {renderMobileMenuItems(item.children, itemId)}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <li
      className={`nav-item menu-item ${isCurrentNav && "active"} ${
        navItem.children &&
        navItem.children.length > 0 &&
        "custom-menu-dropdown"
      }`}
    >
      <Link
        className="nav-link"
        href={navItem.route.path}
        title={navItem.title}
      >
        {navItem.title}
      </Link>
      {navItem.children && navItem.children.length > 0 && (
        <div className="mega-menu" ref={megaMenuRef}>
          {navItem.children.map((subItem, subIndex) => (
            <div key={subIndex} className="sub-menu">
              <h3>
                <Link
                  href={subItem.route.path}
                  target={subItem.target || "_self"}
                >
                  {subItem.title}
                </Link>
              </h3>
              {subItem.children && <ul>{renderMenuItems(subItem.children)}</ul>}
            </div>
          ))}
        </div>
      )}

      {/* Mobile Menu Button */}
      {navItem.children && navItem.children.length > 0 && (
        <div className="mobile-menu">
          <button
            className="custom-menu-dropdown-mainbtn"
            type="button"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
          ></button>
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                id={`smenu-${navItem.destinationId}`}
                className="sidemenu"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderMobileMenuItems(
                  navItem.children,
                  `smenu-${navItem.destinationId}`
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </li>
  );
};

export default MegaMenuItem;
