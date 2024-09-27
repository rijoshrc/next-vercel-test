import React from "react";

type Props = {
  message: string;
  show: boolean;
  setShow: (show: boolean) => void;
};

const Modal = (props: Props) => {
  return (
    <div
      className={`modal fade ${props.show ? "show" : ""}`}
      tabIndex={-1}
      role="dialog"
      id="error-modal"
      style={
        props.show
          ? {
              display: "block",
              paddingRight: "15px",
              backgroundColor: "#0000007d",
            }
          : {}
      }
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content pb-0">
          <div
            className="modal-body p-1"
            dangerouslySetInnerHTML={{ __html: props.message }}
          ></div>
          <div className="pt-0 px-2 pb-3 d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
              onClick={() => {
                document.body.classList.remove("modal-open");
                props.setShow(false);
              }}
            >
              ok
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
