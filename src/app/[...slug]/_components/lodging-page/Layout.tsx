import Image from "next/image";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  phone?: string;
  logoUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaAuthor?: string;
  metaPageUrl?: string;
  siteName?: string;
  customBodyClass?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, phone }) => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <td>
              <header style={{ position: "static" }}>
                <div className="container">
                  <div className="row">
                    <nav
                      className="navbar custom-navbar navbar-expand-lg"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <a className="navbar-brand" href="/">
                        <Image
                          src="/images/_global/meerundhus-logo@2x.png"
                          alt="Meerundhus Logo"
                          className="meerundhus-logo"
                          style={{
                            width: "auto",
                            height: "auto",
                            objectFit: "contain",
                          }}
                        />
                      </a>

                      {phone && (
                        <div
                          className="navbar-top"
                          style={{ position: "relative" }}
                        >
                          <label>
                            Persönlich für Sie da!{" "}
                            <a href={`tel:${phone.replace(/\s/g, "")}`}>
                              <strong>{phone}</strong>
                            </a>
                          </label>
                        </div>
                      )}
                    </nav>
                  </div>
                </div>
              </header>
            </td>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>{children}</td>
          </tr>
        </tbody>

        <tfoot>
          <tr>
            <td className="footer">
              <label>www.meerundhus.de</label>
              <picture>
                <Image
                  src="/images/_global/happy.png"
                  alt="Laughing House Logo"
                  width={133}
                  height={56}
                />
              </picture>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default Layout;
