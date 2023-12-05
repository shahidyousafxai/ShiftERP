import React from "react";
import Alert from "../Alert";
import Typography from "../Typography";
import { Cancel } from "@mui/icons-material";

const AlertMessage = ({ severity, text, textColor, onClick, iconColor }) => {
  return (
    <React.Fragment>
      <div className="d-flex flex-row justify-end align-items-center">
        <Alert
          className="mx-3 w-max justify-center"
          severity={severity}
          icon={true}>
          <div className="d-flex flex-row justify-between align-items-center">
            <Typography
              variant="h1"
              fontSize={13}
              fontWeight="medium"
              color={textColor}>
              {text}
            </Typography>
            {iconColor && (
              <div onClick={onClick} className="ms-5 pointer">
                <Cancel color={iconColor} />
              </div>
            )}
          </div>
        </Alert>
      </div>
    </React.Fragment>
  );
};
export default AlertMessage;
