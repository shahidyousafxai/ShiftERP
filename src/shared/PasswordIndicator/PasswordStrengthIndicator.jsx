import React from "react";
import Typography from "../Typography";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";

const PasswordStrengthIndicator = ({
  validity: { minChar, number, isUpperCase },
}) => {
  return (
    <div className="d-flex mt-1">
      <PasswordStrengthIndicatorItem isValid={minChar} text="8-25 Char" />
      <PasswordStrengthIndicatorItem
        isValid={isUpperCase}
        text="1 upper case"
      />
      <PasswordStrengthIndicatorItem isValid={number} text="1 number" />
    </div>
  );
};

const PasswordStrengthIndicatorItem = ({ isValid, text }) => {
  const highlightForCircleIcon =
    isValid && isValid !== "" ? "success" : "secondary";
  const highlightForWarningIcon =
    isValid === false && isValid !== "" ? "danger" : "secondary";
  return (
    <div className="d-flex align-items-center mx-3">
      {isValid ? (
        <CheckCircleIcon
          sx={{ fontSize: 12, marginRight: 0.5 }}
          color={highlightForCircleIcon}
        />
      ) : (
        <WarningRoundedIcon
          sx={{ fontSize: 12, marginRight: 0.5 }}
          color={highlightForWarningIcon}
        />
      )}
      <Typography fontSize={11}>{text}</Typography>
    </div>
  );
};

export default PasswordStrengthIndicator;
