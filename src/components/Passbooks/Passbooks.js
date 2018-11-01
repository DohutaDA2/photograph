import React from "react";
import Passbook from "./Passbook/Passbook";
import classes from "./Passbooks.css";
import {formatNum} from '../../hoc/business/refineUI';

const Passbooks = props => {
  const calculateTotal = () => {
    let c = 0;
    props.passbooks.forEach(element => {
      c += element.balance;
    });
    return c;
  };

  return (
    <div className={classes.Background}>
      <p className={classes.GroupName}>
        {props.groupName.toUpperCase()} (
        {formatNum(calculateTotal())}
        đ)
      </p>
      {props.passbooks.map((passbook, index) => (
        <Passbook
          key={passbook.id}
          passbookName={
            passbook.bankShortname.toUpperCase() + "_" + passbook.passbookName
          }
          openDate={passbook.opendate}
          interestRate={passbook.interestRate}
          termDes={passbook.termDes}
          balance={formatNum(passbook.balance)}
          moreClicked={()=>props.moreHandler(passbook.id)}
        />
      ))}
    </div>
  );
};

export default Passbooks;
