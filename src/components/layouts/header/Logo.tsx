import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link className="navbar-brand" href="/" aria-label="Home Page">
      <Image
        alt="Meer und Hus Logo"
        height="58"
        width="176"
        src="/images/_global/meerundhus-logo.png"
        className="meerundhus-logo d-none d-sm-block"
      />
      <Image
        alt="Meer und Hus Logo"
        height="38"
        width="116"
        src="/images/_global/meerundhus-logo-sm.png"
        className="meerundhus-logo d-block d-sm-none"
      />
    </Link>
  );
};

export default Logo;
