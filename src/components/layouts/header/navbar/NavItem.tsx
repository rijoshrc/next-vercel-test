import Link from "next/link";
import { Link as LinkType } from "@/type/link";
import { useParams } from "next/navigation";

export type Item = {
  children?: LinkType[];
} & LinkType;

type NavItemProps = {
  item: Item;
};

const NavItem: React.FC<NavItemProps> = ({ item }) => {
  // get the params
  const params = useParams();

  // get the slug array
  const slugs = (params.slug as string[]) || [];

  // if the current nav is the current page
  const isCurrentNav = slugs.includes(item.route.path.replaceAll("/", ""));

  return (
    <li className={`nav-item custom-menu-dropdown ${isCurrentNav && "active"}`}>
      <Link className="nav-link" href={item.route.path} title={item.title}>
        {item.title}
      </Link>

      {item.children && item.children.length > 0 && (
        <ul className="dropdown-menu">
          {item.children.map((child, childIndex) => (
            <li key={childIndex}>
              <Link className="dropdown-item" href={child.url || ""}>
                {child.title}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* <button
            className="custom-menu-dropdown-mainbtn"
            type="button"
            data-toggle="collapse"
          />
          <div id="smenu-43673" className="sidemenu collapse show">
            <ul>
              <li>
                <div className="btn-smenu">
                  <a href="/erlebnisse/aktivitaeten/">Aktivitäten</a>
                  <button
                    type="button"
                    className=""
                    data-toggle="collapse"
                    data-target="#smenu-43674"
                    aria-expanded="false"
                  ></button>
                </div>
                <div id="smenu-43674" className="sidemenu-content collapse ">
                  <ul>
                    <li>
                      <div className="btn-submenu">
                        <a href="/erlebnisse/aktivitaeten/nordseegebietelimfjord/">
                          Nordseegebiete/Limfjord
                        </a>
                        <button
                          type="button"
                          className=""
                          data-toggle="collapse"
                          data-target="#smenu-43675"
                          aria-expanded="false"
                        ></button>
                      </div>
                      <div id="smenu-43675" className="submenu collapse ">
                        <ul>
                          <li>
                            <div className="btn-submenu">
                              <a href="/erlebnisse/aktivitaeten/nordseegebietelimfjord/angeln/">
                                Angeln
                              </a>
                              <button
                                type="button"
                                className=""
                                data-toggle="collapse"
                                data-target="#smenu-64128"
                                aria-expanded="false"
                              ></button>
                            </div>
                            <div id="smenu-64128" className="submenu collapse ">
                              <ul>
                                <li>
                                  <a
                                    href="/erlebnisse/aktivitaeten/nordseegebietelimfjord/angeln/angelplaetze/"
                                    className=""
                                    title="Angelplätze"
                                  >
                                    Angelplätze
                                  </a>
                                </li>
                                <li>
                                  <a
                                    href="/erlebnisse/aktivitaeten/nordseegebietelimfjord/angeln/angelschein/"
                                    className=""
                                    title="Angelschein"
                                  >
                                    Angelschein
                                  </a>
                                </li>
                                <li>
                                  <a
                                    href="/erlebnisse/aktivitaeten/nordseegebietelimfjord/angeln/brandungsangeln/"
                                    className=""
                                    title="Brandungsangeln"
                                  >
                                    Brandungsangeln
                                  </a>
                                </li>
                                <li>
                                  <a
                                    href="/erlebnisse/aktivitaeten/nordseegebietelimfjord/angeln/hochseeangeln/"
                                    className=""
                                    title="Hochseeangeln"
                                  >
                                    Hochseeangeln
                                  </a>
                                </li>
                                <li>
                                  <a
                                    href="/erlebnisse/aktivitaeten/nordseegebietelimfjord/angeln/put-take/"
                                    className=""
                                    title="Put &amp; Take"
                                  >
                                    Put &amp; Take
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </li>
                          <li>
                            <a
                              href="/erlebnisse/aktivitaeten/nordseegebietelimfjord/bernstein-suchen/"
                              className=""
                              title="Bernstein suchen"
                            >
                              Bernstein suchen
                            </a>
                          </li>
                          <li>
                            <a
                              href="/erlebnisse/aktivitaeten/nordseegebietelimfjord/bowling-lemvig/"
                              className=""
                              title="Bowling Lemvig"
                            >
                              Bowling Lemvig
                            </a>
                          </li>
                          <li>
                            <a
                              href="/erlebnisse/aktivitaeten/nordseegebietelimfjord/bunker-thyboroen/"
                              className=""
                              title="Bunker Thyborøn"
                            >
                              Bunker Thyborøn
                            </a>
                          </li>
                          <li>
                            <a
                              href="/erlebnisse/aktivitaeten/nordseegebietelimfjord/fitness-harbooere-center/"
                              className=""
                              title="Fitness Harboøre Center"
                            >
                              Fitness Harboøre Center
                            </a>
                          </li>
                          <li>
                            <a
                              href="/erlebnisse/aktivitaeten/nordseegebietelimfjord/fussballgolf/"
                              className=""
                              title="Fußballgolf"
                            >
                              Fußballgolf
                            </a>
                          </li>
                          <li>
                            <a
                              href="/erlebnisse/aktivitaeten/nordseegebietelimfjord/gammelgaard-glas/"
                              className=""
                              title="Gammelgård Glas"
                            >
                              Gammelgård Glas
                            </a>
                          </li>
                          <li>
                            <a
                              href="/erlebnisse/aktivitaeten/nordseegebietelimfjord/golf/"
                              className=""
                              title="Golf"
                            >
                              Golf
                            </a>
                          </li>
                          <li>
                            <a
                              href="/erlebnisse/aktivitaeten/nordseegebietelimfjord/kerzen-gestalten/"
                              className=""
                              title="Kerzen gestalten"
                            >
                              Kerzen gestalten
                            </a>
                          </li>
                          <li>
                            <a
                              href="/erlebnisse/aktivitaeten/nordseegebietelimfjord/kiten-sup/"
                              className=""
                              title="Kiten, SUP"
                            >
                              Kiten, SUP
                            </a>
                          </li>
                          <li>
                            <a
                              href="/erlebnisse/aktivitaeten/nordseegebietelimfjord/lemvig-badeland/"
                              className=""
                              title="Lemvig Badeland"
                            >
                              Lemvig Badeland
                            </a>
                          </li>
                          <li>
                            <a
                              href="/erlebnisse/aktivitaeten/nordseegebietelimfjord/lemvig-bahn/"
                              className=""
                              title="Lemvig Bahn"
                            >
                              Lemvig Bahn
                            </a>
                          </li>
                          <li>
                            <a
                              href="/erlebnisse/aktivitaeten/nordseegebietelimfjord/radfahren/"
                              className=""
                              title="Radfahren"
                            >
                              Radfahren
                            </a>
                          </li>
                          <li>
                            <a
                              href="/erlebnisse/aktivitaeten/nordseegebietelimfjord/paragliding/"
                              className=""
                              title="Paragliding"
                            >
                              Paragliding
                            </a>
                          </li>
                          <li>
                            <a
                              href="/erlebnisse/aktivitaeten/nordseegebietelimfjord/reiten/"
                              className=""
                              title="Reiten"
                            >
                              Reiten
                            </a>
                          </li>
                          <li>
                            <a
                              href="/erlebnisse/aktivitaeten/nordseegebietelimfjord/surfen/"
                              className=""
                              title="Surfen"
                            >
                              Surfen
                            </a>
                          </li>
                          <li>
                            <a
                              href="/erlebnisse/aktivitaeten/nordseegebietelimfjord/waldspielplatz/"
                              className=""
                              title="Waldspielplatz"
                            >
                              Waldspielplatz
                            </a>
                          </li>
                          <li>
                            <a
                              href="/erlebnisse/aktivitaeten/nordseegebietelimfjord/wandern/"
                              className=""
                              title="Wandern"
                            >
                              Wandern
                            </a>
                          </li>
                          <li>
                            <a
                              href="/erlebnisse/aktivitaeten/nordseegebietelimfjord/winteraktivitaeten/"
                              className=""
                              title="Winteraktivitäten"
                            >
                              Winteraktivitäten
                            </a>
                          </li>
                        </ul>
                      </div>
                    </li>
                    <li>
                      <div className="btn-submenu">
                        <a href="/erlebnisse/aktivitaeten/ostseegebiete/">
                          Ostseegebiete
                        </a>
                        <button
                          type="button"
                          className=""
                          data-toggle="collapse"
                          data-target="#smenu-43676"
                          aria-expanded="false"
                        ></button>
                      </div>
                      <div id="smenu-43676" className="submenu collapse ">
                        <ul>
                          <li>
                            <a
                              href="/erlebnisse/aktivitaeten/ostseegebiete/angeln/"
                              className=""
                              title="Angeln"
                            >
                              Angeln
                            </a>
                          </li>
                          <li>
                            <a
                              href="/erlebnisse/aktivitaeten/ostseegebiete/golf/"
                              className=""
                              title="Golf"
                            >
                              Golf
                            </a>
                          </li>
                          <li>
                            <a
                              href="/erlebnisse/aktivitaeten/ostseegebiete/gokart/"
                              className=""
                              title="Gokart"
                            >
                              Gokart
                            </a>
                          </li>
                          <li>
                            <a
                              href="/erlebnisse/aktivitaeten/ostseegebiete/radfahren/"
                              className=""
                              title="Radfahren"
                            >
                              Radfahren
                            </a>
                          </li>
                          <li>
                            <a
                              href="/erlebnisse/aktivitaeten/ostseegebiete/fussballgolf/"
                              className=""
                              title="Fußballgolf"
                            >
                              Fußballgolf
                            </a>
                          </li>
                        </ul>
                      </div>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div> */}
    </li>
  );
};

export default NavItem;
