/* eslint-disable react-hooks/exhaustive-deps */
// Library Imports
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Typography,
  Button,
  Alert,
  CheckBox,
  TextField,
} from "../../../shared";
// Local Imports
import { dark, danger } from "../../../helpers/GlobalVariables";
import {
  isUserAuthenticated,
  validateUsernameOrEmail,
} from "../../../helpers/GlobalMethods";
import AssetsImages from "../../../assets/images";
import { loginApi } from "../../../api/authApi";
import {
  userImageSuccess,
  userLogin,
} from "../../../redux/users/user.actions.js";
import "../Auth.css";

const Login = () => {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    password: "",
    username: "",
    showPassword: false,
    error: false,
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (isUserAuthenticated()) {
      navigate("/dashboard");
      return;
    }
    setCookieData();
  }, []);

  const handleChange = (e) => {
    setValues({ ...values, error: false, [e.target.name]: e.target.value });
    setMessage("");
  };

  const validateLoginFields = () => {
    if (validateUsernameOrEmail(values.username.trim())) {
      setMessage("The username is not correct.");
      setLoading(false);
      return false;
    }
    if (values.password === "" || values.username === "") {
      setMessage(
        "The username and password cannot be empty. Please double-check and try again."
      );
      setLoading(false);
      return false;
    }
    return true;
  };

  const loginButtonClicked = async () => {
    setLoading(true);
    setValues({ ...values, error: false });
    const payload = {
      username: values.username.trim(),
      password: values.password,
    };
    try {
      if (!validateLoginFields()) {
        setValues({
          ...values,
          error: true,
        });
        return;
      }
      rememberMeButtonChecked();
      const { data } = await loginApi(payload);
      successfulLoginApiResponse(data);
    } catch (error) {
      setLoading(false);
      setValues({
        ...values,
        error: true,
      });
      setMessage(
        error?.response
          ? error?.response?.data?.message
          : `${error?.message}! Please check your network`
      );
    }
  };

  const successfulLoginApiResponse = async (response) => {
    if (response.data && response.data.enable_sms === 1) {
      navigate({
        pathname: `/authenticate?id=${response.data.user_id}&token=${response.data.verify_token}&code=${response.data.code}`,
      });
      setLoading(false);
    } else if (response.success === true && response.data.user) {
      dispatch(
        userLogin({
          user: response?.data?.user,
          token: response?.data?.token,
          userInfo: response?.data?.user_info,
          ...(response?.data?.provision_account && {
            provisionAccount: response?.data?.provision_account,
          }),
        })
      );
      dispatch(
        userImageSuccess(response?.data?.user_info?.profile_pic[0]?.url)
      );
      setLoading(false);
      navigate("/dashboard");
    }
  };

  const setCookieData = () => {
    let username = getCookie("myUsername");
    let password = getCookie("myPassword");
    setValues({
      ...values,
      username,
      password,
    });
    if (username && password) {
      setRemember(true);
    } else {
      setRemember(false);
    }
  };

  const rememberMeButtonChecked = () => {
    if (remember) {
      document.cookie = `myUsername=${values.username};path=http://http://shift-erp.maqware.com/`;
      document.cookie = `myPassword=${values.password};path=http://http://shift-erp.maqware.com/`;
    } else {
      document.cookie = `myUsername=${""};path=http://http://shift-erp.maqware.com/`;
      document.cookie = `myPassword=${""};path=http://http://shift-erp.maqware.com/`;
    }
  };

  const getCookie = (key) => {
    var name = key + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  };

  useEffect(() => {
    const listener = (event) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        loginButtonClicked();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [values]);

  return (
    <div className=" row justify-content-center login-container align-items-center ">
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
            Log In
          </Typography>
        </div>
        <div className="mb-3">
          <Typography
            variant="h1"
            fontSize={13}
            fontWeight="medium"
            color="secondary"
            align="center">
            Please log in to your account.
          </Typography>
        </div>
        {values.error && (
          <div className="mb-3">
            <Alert severity="error" icon={false}>
              <Typography
                variant="h1"
                fontSize={13}
                fontWeight="medium"
                color={danger}>
                {message}
              </Typography>
            </Alert>
          </div>
        )}
        <div className="mb-3">
          <TextField
            label="Username/Email"
            fullWidth={true}
            size="small"
            value={values.username}
            name="username"
            onChange={handleChange}
            error={values.error}
          />
        </div>
        <div className="mb-3">
          <TextField
            label="Password"
            fullWidth={true}
            size="small"
            error={values.error}
            name="password"
            value={values.password}
            type={"password"}
            onChange={handleChange}
          />
        </div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <CheckBox
            label="Remember Me"
            size="small"
            color={dark}
            fontWeight="medium"
            checked={remember}
            onChange={() => setRemember(!remember)}
          />
          <Link to="/forgot-password">
            <Typography fontSize={13} color="primary">
              Forgot Password?
            </Typography>
          </Link>
        </div>
        <Button
          color="primary"
          variant="contained"
          className="capitalize"
          fullWidth={true}
          disabled={false}
          loading={loading}
          onClick={loginButtonClicked}>
          Log In
        </Button>
      </div>
    </div>
  );
};

export default Login;
