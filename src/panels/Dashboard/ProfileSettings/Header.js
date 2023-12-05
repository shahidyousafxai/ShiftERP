import React from "react";
import { Typography } from "../../../shared";
import { dark } from "../../../helpers/GlobalVariables";

const Header = () => {
  return (
    <div className=" bg-white p-3 pb-0">
      <Typography color="primary" fontSize={11}>
        ShiftERP
      </Typography>
      <Typography color={dark} fontSize={17} fontWeight="medium">
        Profile Settings
      </Typography>
    </div>
  );
};

export default Header;
