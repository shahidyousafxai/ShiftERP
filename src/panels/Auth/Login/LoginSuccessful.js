import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Typography, Button } from "../../../shared";
import AssetsImages from "../../../assets/images";
import { isUserAuthenticated } from "../../../helpers/GlobalMethods";
import "../Auth.css";

const LoginSuccessful = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isUserAuthenticated()) {
      // navigate("/dashboard");
      return;
    }
  }, []);

  const loginButtonClicked = () => {
    navigate("/");
  };
  return (
    <div className="row justify-content-center login-container align-items-center ">
      <div className="col-md-4 p-5 p-md-2">
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
            Success
          </Typography>
        </div>
        <div className="mb-3">
          <Typography
            variant="h1"
            fontSize={13}
            fontWeight="medium"
            color="secondary"
            align="center">
            Your new password has been successfully saved.
          </Typography>
        </div>
        <div className="mb-2">
          <Button
            color="primary"
            variant="contained"
            className="capitalize"
            fullWidth={true}
            onClick={loginButtonClicked}>
            Log In
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginSuccessful;
