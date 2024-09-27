import { Link as LinkType } from "@/type/link";
import { ImageType } from "@/type/media";
import Image from "next/image";
import Link from "next/link";

export type Column = {
  contentType: string;
  id: string;
  properties: {
    heading: string;
    links: LinkType[];
    image?: ImageType[];
    imageLink: LinkType[];
  };
};

type FooterColProps = {
  column: Column;
};

const FooterCol: React.FC<FooterColProps> = ({ column }) => {
  const image = (
    <figure>
      <picture>
        <Image
          src={column.properties.image?.[0].url || ""}
          alt={column.properties.image?.[0].name || ""}
          height={column.properties.image?.[0].height}
          width={column.properties.image?.[0].width}
          priority
          fetchPriority="high"
        />
      </picture>
    </figure>
  );
  return (
    <div className="col-sm">
      <div className="footer__textgroup">
        <div className="footer__top-heading">{column.properties.heading}</div>

        <ul className="footer__links">
          {column.properties.links?.map((link) => (
            <li key={link.route?.path + link.title}>
              <Link
                href={link.route?.path || link.url || ""}
                title={link.title}
                target={link.target || "_self"}
              >
                {link.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {column.properties.image ? (
        column.properties.imageLink?.length ? (
          <Link
            href={
              column.properties.imageLink[0].route?.path ||
              column.properties.imageLink[0].url ||
              ""
            }
            target={column.properties.imageLink[0].target || "_self"}
            title={column.properties.imageLink[0].title}
          >
            {image}
          </Link>
        ) : (
          image
        )
      ) : null}
    </div>
  );
};

export default FooterCol;
