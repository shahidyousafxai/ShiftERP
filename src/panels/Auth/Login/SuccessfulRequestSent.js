/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Typography, Button } from "../../../shared";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AssetsImages from "../../../assets/images";
import { isUserAuthenticated } from "../../../helpers/GlobalMethods";
import "../Auth.css";

const SuccessfulRequestSent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const doneButtonClicked = () => {
    navigate("/");
  };

  useEffect(() => {
    if (!location.state?.email) {
      navigate("/");
    }
    if (isUserAuthenticated()) {
      // navigate("/dashboard");
      return;
    }
  }, []);

  return (
    <div className=" row justify-content-center login-container align-items-center ">
      <div className="col-md-4 p-5 text-center p-md-2">
        <div className="logo-wrapper mb-5">
          <Link to="/ ">
            <img alt="shift-erp" src={AssetsImages.Logo} />
          </Link>
        </div>
        <div className="my-3">
          <Typography
            variant="h1"
            fontSize={17}
            fontWeight="medium"
            align="center">
            Request Sent Successfully
          </Typography>
        </div>
        <div className="mb-3">
          <Typography
            variant="h1"
            fontSize={13}
            fontWeight="medium"
            color="secondary"
            align="center">
            We have sent a confirmation email to
            <span className="text-primary"> {location.state?.email}</span>.
            Please check your email.
          </Typography>
        </div>
        <div className="mb-2">
          <Button
            color="primary"
            variant="contained"
            className="capitalize"
            fullWidth={true}
            onClick={doneButtonClicked}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuccessfulRequestSent;
