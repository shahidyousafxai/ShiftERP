// Library Imports
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
// Local Imports
import {
  Typography,
  Button as Lbutton,
  TextField,
  Alert,
} from "../../../shared";
import { isUserAuthenticated } from "../../../helpers/GlobalMethods";
import AssetsImages from "../../../assets/images";
import {
  resendSmsVerificationCode,
  twoFactorAuthenticationApi,
} from "../../../api/authApi";
import { userLogin } from "../../../redux/users/user.actions.js";
import "../Auth.css";

const TIMER = 59;
const TwoFactorAuthentication = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [counter, setCounter] = useState(TIMER);
  const [loading, setloading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (isUserAuthenticated()) {
      // navigate("/dashboard");
      return;
    }
  }, []);

  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  const validateCodeField = () => {
    if (code === "") {
      setMessage("This field cannot be empty.");
      setShowAlert(true);
      setError(true);
      return false;
    }
    return true;
  };
  const verifyButtonClick = async () => {
    try {
      const payload = {
        verify_code: Number(code),
        id: String(location.search.slice(1).split("&")[0].split("=")[1]),
        token: String(location.search.slice(1).split("&")[1].split("=")[1]),
      };

      if (!validateCodeField()) return;
      setloading(true);
      const { data } = await twoFactorAuthenticationApi(payload);
      verifyCodeSuccessfulApiResponse(data);
    } catch (error) {
      setloading(false);
      setMessage("Invalid code. Please try again.");
      setError(true);
      setShowAlert(true);
    }
  };

  const verifyCodeSuccessfulApiResponse = ({ data }) => {
    dispatch(
      userLogin({
        user: data.user,
        token: data.token,
        userInfo: data.user_info,
        ...(data.provision_account && {
          provisionAccount: data.provision_account,
        }),
      })
    );
    setloading(false);
    navigate("/dashboard");
  };

  const handleChange = (e) => {
    setCode(e.target.value);
  };

  const resendButtonClicked = async () => {
    let config = {
      id: String(location.search.slice(1).split("&")[0].split("=")[1]),
      token: String(location.search.slice(1).split("&")[1].split("=")[1]),
    };
    try {
      const { data } = await resendSmsVerificationCode(config);
      navigate(
        `/authenticate?id=${config.id}&token=${config.token}&code=${data.data.code}`
      );
      setMessage(data.message);
      setCounter(TIMER);
      setError(false);
      setShowAlert(true);
    } catch (error) {
      setError(true);
      setShowAlert(true);
    }
  };

  return (
    <div className="row justify-content-center login-container align-items-center ">
      <div className="col-md-4 p-5 p-md-2">
        <div className="logo-wrapper mb-5">
          <img alt="shift-erp" src={AssetsImages.Logo} />
        </div>
        <div className="my-3">
          <Typography
            variant="h1"
            fontSize={17}
            fontWeight="medium"
            align="center">
            Two-factor Authentication Code
          </Typography>
        </div>
        <div className="mb-3">
          <Typography
            variant="h1"
            fontSize={13}
            fontWeight="medium"
            color="secondary"
            align="center">
            Two-factor authentication code (2FA) is enabled for your account.
          </Typography>
        </div>
        <div className="mb-3">
          <Typography
            variant="h1"
            fontSize={13}
            fontWeight="medium"
            color="secondary"
            align="center">
            Please enter a code to log in.
          </Typography>
        </div>
        {showAlert && (
          <div className="mb-3">
            <Alert severity={error ? "error" : "success"} icon={false}>
              <Typography
                variant="h1"
                fontSize={13}
                fontWeight="medium"
                color="success">
                {message}
              </Typography>
            </Alert>
          </div>
        )}
        <div className="mb-3">
          <TextField
            label="Enter SMS verification Code"
            fullWidth={true}
            size="small"
            type="text"
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <Lbutton
            // disabled={error}
            color="primary"
            loading={loading}
            variant="contained"
            fullWidth={true}
            className="capitalize"
            onClick={() => verifyButtonClick()}>
            Verify
          </Lbutton>
        </div>
        <div className="mb-3">
          <Typography
            variant="h1"
            fontSize={13}
            fontWeight="medium"
            color="secondary"
            align="center">
            {counter > 0 ? (
              `Resend in 00:${counter}`
            ) : (
              <Typography
                color="primary"
                variant="h1"
                fontSize={13}
                fontWeight="medium"
                align="center"
                onClick={resendButtonClicked}>
                <div className="pointer">Resend</div>
              </Typography>
            )}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuthentication;
