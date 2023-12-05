import React from "react";
import { Switch } from "@mui/material";

const MuiSwitch = ({ checked, value, onChange, ...restProps }) => {
  return (
    <React.Fragment>
      <Switch
        checked={checked}
        value={value}
        onChange={onChange}
        {...restProps}
      />
    </React.Fragment>
  );
};
export default MuiSwitch;
