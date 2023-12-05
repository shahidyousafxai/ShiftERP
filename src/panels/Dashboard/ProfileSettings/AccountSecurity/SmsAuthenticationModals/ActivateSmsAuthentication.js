/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import MuiPhoneNumber from "material-ui-phone-number";
import { useDispatch } from "react-redux";
import { phone as phonevalidator } from "phone";


import { Button, Typography, TextField, Alert } from "../../../../../shared";
import {
  sendSMSForAuth,
  verifySMSForAuth,
} from "../../../../../api/smsAuthenticationApi.js";
import { userRefreshStart } from "../../../../../redux/users/user.actions.js";

const SmsAuthenticationStart = ({
  successSMSAuthenticationModal,
  onDiscard,
}) => {
  const [phone, setphone] = useState("");
  const [countryCode, setcountryCode] = useState("");
  const [code, setcode] = useState(null);
  const [codeSend, setcodeSend] = useState(false);
  const [errors, seterrors] = useState({
    phone: "",
    code: "",
  });
  const [loading, setloading] = useState(false);
  const [loading2, setloading2] = useState(false);
  const dispatch = useDispatch();
  const handleGetCodeClick = async () => {
    seterrors({
      phone: "",
      code: "",
    });
    let isValid = phonevalidator(phone).isValid;
    if (!isValid) {
      seterrors({
        ...errors,
        phone: "Please enter a valid phone number.",
      });
      return;
    }
    try {
      setloading(true);
      let { data } = await sendSMSForAuth({
        phone_number: countryCode + phone,
      });

      if (data.success) {
        setcodeSend(true);
        setcode(data.data.verify);
      }
      setloading(false);
    } catch (error) {
      setloading(false);
      if (error.response.status === 422 || error.response.status === 400) {
        seterrors({
          ...errors,
          phone: "Please enter a valid phone number.",
        });
      }
    }
  };
  const handleVerifyClick = async () => {
    try {
      setloading2(true);
      let { data } = await verifySMSForAuth({
        phone_number: countryCode + phone,
        verify_code: code,
      });
      if (data.success) {
        dispatch(userRefreshStart());
        successSMSAuthenticationModal();
      }
      setloading2(false);
    } catch (error) {
      if (error.response.status === 403) {
        seterrors({
          ...errors,
          code: "Invalid code. Please try again",
        });
      }
      setloading2(false);
    }
  };
  const handleCountryCode = (e) => {
    const regex = /^[+][\d]*$/;
    if (e.target.value === "") {
      setcountryCode("");
      return;
    }
    if (e.target.value.slice(0, 1) !== "+") {
      e.target.value = "+" + e.target.value;
    }
    if (e.target.value.length > 3) {
      return;
    }
    if (regex.test(e.target.value)) {
      setcountryCode(e.target.value);
    }
  };
  return (
    <>
      <Typography fontSize={13} fontWeight="medium">
        What phone number do you want to use?
      </Typography>
      <div className="row flex justify-between">
        {errors.phone && (
          <div className="mb-3 mt-3">
            <Alert severity="error" icon={false}>
              <Typography
                variant="h1"
                fontSize={13}
                fontWeight="medium"
                color={"error"}>
                {errors.phone}
              </Typography>
            </Alert>
          </div>
        )}
        <div className="flex justify-between">
          <div className="col-md-10">
            <MuiPhoneNumber
              defaultCountry="us"
              variant="outlined"
              label="Phone no"
              // autoFormat={false}
              error={errors.phone}
              disableAreaCodes
              sx={{
                width: "96%",
              }}
              value={phone}
              onChange={(e) => {
                // const regex = /^[\d]*$/;
                // if (!regex.test(e.target.value)) return;
                // if (e.target.value.length > 12) return;
                setcodeSend(false);
                setphone(e);
              }}
            />
            {/* <TextField
            label="Country"
            fullWidth={true}
            size="small"
            value={countryCode}
            onChange={handleCountryCode}
          /> */}
          </div>
          {/* <div className="col-md-6 p-0">
          <TextField
            label="Phone Number"
            type="text"
            fullWidth={true}
            error={errors.phone}
            size="small"
            value={phone}
            onChange={(e) => {
              const regex = /^[\d]*$/;
              if (!regex.test(e.target.value)) return;
              if (e.target.value.length > 12) return;
              setcodeSend(false);
              setphone(e.target.value);
            }}
          />
        </div> */}
          <div className="col-md-2 d-flex">
            <Button
              variant="contained"
              fullWidth={true}
              className="normal-case bg-success p-[7px]"
              disabled={false}
              loading={loading}
              onClick={handleGetCodeClick}>
              Get Code
            </Button>
          </div>
        </div>
      </div>
      {codeSend && (
        <>
          <Typography fontSize={13} fontWeight="medium" className="my-1">
            Verification code has been send to your phone number.
          </Typography>
          <div className="row">
            {errors.code && (
              <div className="mb-3 mt-3">
                <Alert severity="error" icon={false}>
                  <Typography
                    variant="h1"
                    fontSize={13}
                    fontWeight="medium"
                    color={"error"}>
                    {errors.code}
                  </Typography>
                </Alert>
              </div>
            )}
            <div className="col-md-12">
              <TextField
                label="SMS Verification Code"
                fullWidth={true}
                size="small"
                value={code}
                error={errors.code}
                onChange={(e) => setcode(e.target.value)}
              />
            </div>
          </div>
          <div className="row justify-content-end">
            <div className="col-md-2 p-0">
              <Button
                variant="outlined"
                fullWidth={true}
                onClick={onDiscard}
                className="normal-case rounded-[7px]">
                Discard
              </Button>
            </div>
            <div className="col-md-3">
              <Button
                variant="contained"
                fullWidth={true}
                className="normal-case rounded-[7px]"
                disabled={false}
                loading={loading2}
                onClick={handleVerifyClick}>
                Verify
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SmsAuthenticationStart;
