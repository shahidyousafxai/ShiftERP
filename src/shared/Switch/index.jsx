import * as React from "react";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import { primaryColor, white } from "../../helpers/GlobalVariables";

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 22,
  height: 11,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 15,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(12px)",
      color: white,
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor:
          theme.palette.mode === "dark" ? "rgba(0,0,0,.25)" : "rgba(0,0,0,.25)",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 7,
    height: 7,
    borderRadius: 6,
    transition: theme.transitions.create(["width"], {
      duration: 200,
    }),
  },
  "& .MuiSwitch-track": {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: primaryColor,
    boxSizing: "border-box",
  },
}));

const CustomizedSwitches = ({ checked, onClick }) => (
  <AntSwitch
    defaultChecked
    checked={checked}
    inputProps={{ "aria-label": "ant design" }}
    onClick={onClick}
  />
);

export default CustomizedSwitches;
