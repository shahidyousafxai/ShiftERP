import React from "react";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

import { success, secondaryColor, dark } from "../../../../helpers/GlobalVariables";
import { Button, Typography } from "../../../../shared";

const Service = ({
  serviceLogo,
  serviceTitle,
  serviceDescription,
  enableText,
  onClick,
  serviceStatus,
  serviceName,
}) => {
  return (
    <div className="row ">
      <div className="col-md-2">
        <div className="d-flex align-items-center">
          <div className="col-md-2">
            <img src={serviceLogo} height={40} width={40} alt="service-logo" />
          </div>

          <div className="col-md-10 ml-2.5">
            <Typography fontWeight="medium" fontSize={13}>
              {serviceTitle}
            </Typography>
            <Typography color="secondary" fontSize={10} marginTop={0.4}>
              {serviceDescription}
            </Typography>
          </div>
        </div>
      </div>
      <div className="col-md-3 d-flex align-items-center p-md-0">
        {serviceStatus === 1 ? (
          <CheckCircleRoundedIcon
            sx={{ fontSize: 17, color: success, marginRight: 0.5 }}
          />
        ) : (
          <RadioButtonUncheckedIcon
            sx={{
              fontSize: 15,
              color: "transparent",
              border: 4,
              borderRadius: 5,
              borderColor: secondaryColor,
              marginRight: 0.5,
            }}
          />
        )}
        <Typography fontSize={13} color={dark}>
          {serviceStatus === 1 ? "Active" : "Inactive"}
        </Typography>
      </div>
      {serviceStatus === 0 ? (
        <div className="col-md-7 d-flex align-items-center justify-content-end ">
          <Typography
            onClick={() => onClick("start")}
            fontSize={13}
            fontWeight="medium"
            color="primary"
            className="btn p-0">
            {enableText}
          </Typography>
          <span>
            <ArrowRightRoundedIcon color="primary" />
          </span>
        </div>
      ) : (
        <div className="col-md-7 gap-3 d-flex align-items-center justify-content-end ">
            <Button
            className={"shadow-5 py-[5px] px-5 text-danger border border-danger bg-white normal-case"}
            onClick={() => onClick("reset")}>
            {serviceName === "google"
              ? "Reset Authenticator Key "
              : "Lost Your Phone"}
            </Button>

          {serviceStatus === 1 ? (
              <Button
              className={"shadow-5 py-[5px] px-5 text-white border-[3px] border-danger bg-danger normal-case"}
              onClick={() => onClick("disable")}>
              Disable
              </Button>
          ) : (
                <Button
              className={"shadow-5 py-[5px] px-5 text-white border-[3px] border-primaryColor bg-primaryColor normal-case"}
              onClick={() => onClick("enable")}>
              Enable
                </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Service;
