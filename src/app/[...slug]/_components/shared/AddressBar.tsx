import Link from "next/link";
import React from "react";

type Props = {
  address: string;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

const AddressBar = (props: Props) => {
  return (
    <div className="booking__addressbar collapse show" id="collapseAddressbar">
      <div className="container">
        <span>{props.address}</span>

        <Link
          className={`close__addressbar history-back`}
          title="Geh zurück"
          href="#"
          onClick={props.onClick}
        >
          <img src="/images/svg/close-btn.svg" alt="close" />
        </Link>
      </div>
    </div>
  );
};

export default AddressBar;
