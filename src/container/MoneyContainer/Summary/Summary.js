import React from "react";
import classes from "./Summary.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { formatNum } from "../../../hoc/business/refineUI";

const summary = props => {
  let element = null;
  if (!props.error && props.isLoading) {
    element = (
      <>
        <p
          style={{ fontSize: "24px", fontWeight: "700", margin: "10px 0 0 0" }}
        >
          ĐANG TẢI DỮ LIỆU
        </p>
        <p style={{ margin: " 10px auto 5px auto" }}>Vui lòng đợi...</p>
      </>
    );
  } else if (props.error) {
    element = (
      <>
        <p
          style={{ fontSize: "24px", fontWeight: "700", margin: "10px 0 0 0" }}
        >
          {props.error.message.toUpperCase()}
        </p>
        <p style={{ margin: " 10px auto 5px auto" }}>Vui lòng liên hệ nhà cung cấp dịch vụ</p>
      </>
    );
  } else {
    if (props.count > 0) {
      element = (
        <>
          <p
            style={{
              fontSize: "24px",
              fontWeight: "700",
              margin: "10px 0 0 0"
            }}
          >
            SỔ TIẾT KIỆM
          </p>
          <p style={{ margin: " 10px auto 5px auto" }}>
            TỔNG TIỀN: {formatNum(props.total)} ({props.count})
          </p>
        </>
      );
    } else {
      element = (
        <>
          <p
            style={{
              fontSize: "24px",
              fontWeight: "700",
              margin: "10px 0 0 0"
            }}
          >
            CHƯA CÓ SỔ TIẾT KIỆM
          </p>
          <p style={{ margin: " 10px auto 5px auto" }}>
            Hãy tạo mới sổ tiết kiệm bằng cách nhấn nút thêm (+)
          </p>
        </>
      );
    }
  }

  return (
    <div className={classes.Sticky}>
      <button className={classes.NewButton} onClick={props.clicked}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
      <div className={classes.Summary}>{element}</div>
    </div>
  );
};

export default summary;
