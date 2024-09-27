import { Link as LinkType } from "@/type/link";
import Link from "next/link";

type FooterBottomProps = {
  links: LinkType[];
  copyRightText: string;
};

const FooterBottom: React.FC<FooterBottomProps> = ({
  links,
  copyRightText,
}) => {
  if (links.length === 0) {
    return null;
  }

  // replace placeholder with current year
  const cpText = copyRightText?.replace(
    "${year}",
    new Date().getFullYear().toString()
  );

  return (
    <div className="footer__bottom">
      <div className="container">
        <div className="row">
          <div className="col__left">
            <ul>
              {links.map((link) => (
                <li key={link.route?.path + link.title}>
                  <Link
                    href={link.route?.path || ""}
                    title={link.title}
                    target={link.target || "_self"}
                  >
                    {link.title}
                  </Link>
                </li>
              ))}

              <li>
                <Link href="/" id="cookie-settings-btn">
                  Cookie-Einstellungen
                </Link>
              </li>
            </ul>
          </div>
          <div className="col__right">
            <p>{cpText}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterBottom;
