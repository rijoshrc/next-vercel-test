type MenuBtnProps = {
  showMenu: boolean;
  setShowMenu: (show: boolean | ((prev: boolean) => boolean)) => void;
};

const MenuBtn: React.FC<MenuBtnProps> = ({ setShowMenu, showMenu }) => {
  return (
    <button
      className={`navbar-toggler second-button ${
        showMenu ? "showtoggle" : "collapsed"
      }`}
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded={showMenu}
      aria-label="Toggle navigation"
      onClick={() => setShowMenu((show) => !show)}
    >
      <div className="animated-icon2">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </button>
  );
};

export default MenuBtn;
