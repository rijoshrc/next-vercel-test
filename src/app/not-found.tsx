import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <section id="" className=" section__text section__typography">
      <div className="container">
        <div className="row no-gutters">
          <div className="section__text--content">
            <div className="umb-grid">
              <div className="grid-section">
                <div>
                  <div className="container">
                    <div className="row clearfix">
                      <div className="col-md-12 column">
                        <div>
                          <h1 style={{ textAlign: "center" }}>
                            <span className="H1-sc">Ooooopsi!</span>&nbsp;
                          </h1>
                          <p style={{ textAlign: "center" }}>
                            <span className="s-18px">
                              Diese gewünschte Seite gibt es leider nicht. Es
                              hat vielleicht mit einem Fehler in der URL-Adresse
                              zu tun, überprüfen sie diese und aktualisieren
                              Ihren Browser.
                            </span>
                          </p>
                          <p style={{ textAlign: "center" }}>
                            <span className="s-18px">
                              Alternativ können Sie zur{" "}
                              <Link href="/" title="DE">
                                Startseite
                              </Link>
                              , zur&nbsp;
                              <Link href="/ferienhaeuser/" title="Ferienhauser">
                                Suchseite
                              </Link>
                              , oder zu unseren{" "}
                              <Link href="/angebote/" title="Angebote">
                                Ferienhaus-Angeboten{" "}
                              </Link>
                              weiter klicken.
                            </span>
                          </p>
                          <h1>
                            <Image
                              src="/images/_global/happy.png"
                              alt="Husi"
                              width="252"
                              height="106"
                              style={{ display: "block", margin: "0 auto" }}
                            />
                          </h1>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
