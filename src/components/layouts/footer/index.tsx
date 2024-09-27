import { Link as LinkType } from "@/type/link";
import { Column } from "./FooterCol";
import BackToTop from "@/components/compound/BackToTop";
import FooterBottom from "./FooterBottom";
import FooterCol from "./FooterCol";
import FooterRIghtCol from "./FooterRightCol";

type FooterProps = { properties: any; navigationProperties: any };

const Footer: React.FC<FooterProps> = ({
  properties,
  navigationProperties,
}) => {
  // get the footer column data
  const footerColumns = navigationProperties.footerColumns as Column[];

  // get the bottom section links
  const footerLinks = navigationProperties.footerLinks as LinkType[];

  return (
    <>
      <footer>
        <div className="footer__top">
          <div className="container">
            <div className="row">
              {footerColumns?.map((column) => (
                <FooterCol key={column.id} column={column} />
              ))}
              <FooterRIghtCol
                logos={properties.laughingHouseLogo}
                heading={properties.siteName}
                description={properties.siteDescription}
                address={properties.displayAddress}
                email={properties.defaultEmail}
                phone={properties.phone}
                youtubeUrl={navigationProperties.youTubeChannelUrl}
                twitterUrl={navigationProperties.twitterUrl}
                facebookUrl={navigationProperties.facebookUrl}
                linkedInUrl={navigationProperties.linkedInUrl}
                instagramUrl={navigationProperties.instagramUrl}
              />
            </div>
          </div>
        </div>
        <FooterBottom
          links={footerLinks}
          copyRightText={properties.copyrightText}
        />
      </footer>
      <BackToTop />
      <footer
      // dangerouslySetInnerHTML={{
      //   __html: properties?.footerScripts,
      // }}
      />
    </>
  );
};

export default Footer;
