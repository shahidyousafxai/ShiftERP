// Library Imports
import React, { useState, useEffect } from "react";
import Step from "@mui/material/Step";
import Stepper from "@mui/material/Stepper";
import StepButton from "@mui/material/StepButton";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import Popover from "@mui/material/Popover";
import QRCode from "react-qr-code";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch } from "react-redux";

// Local Imports
import { Box, Button, Typography, TextField, Alert } from "../../../../../shared";
import "../../profile-settings.css";
import AssetsImages from "../../../../../assets/images";
// import qrCode from "../../../../assets/images/qr-code.png";
import { danger, primaryColor } from "../../../../../helpers/GlobalVariables";
import {
  googleCodeVerify,
  fetchQrCode,
  googleAuthActivator,
} from "../../../../../api/googleAuthenticatorApi.js";
import { userRefreshStart } from "../../../../../redux/users/user.actions.js";

const steps = ["Download App", "Scan QR Code", "Backup Key", "Enable"];

const AuthenticationSteps = ({
  successGoogleAuthenticationModal,
  closeModal,
}) => {
  // PopOver
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  //Popover
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const [verificationCode, setVerificationCode] = useState("");
  const [step2Data, setStep2Data] = useState({
    img: "",
    secret: "",
  });
  const [step3Data, setStep3Data] = useState({
    secret: "",
  });
  const [loading2, setloading2] = useState(false);
  const [loading3, setloading3] = useState(false);

  useEffect(() => {
    if (activeStep === 1) {
      setloading2(true);
      fetchQrCode()
        .then((result) => {
          if (result.data.data) {
            setStep2Data(result.data.data);
          }
          setloading2(false);
        })
        .catch((error) => {
          setloading2(false);
        });
    }
  }, [activeStep]);

  const checkQrEntery = async () => {
    let success = false;
    try {
      setloading3(true);
      var formdata = new FormData();
      formdata.append("secret", step2Data.secret);
      let result = await googleCodeVerify(formdata);
      if (result.data.success && result.data.data) {
        setStep3Data({ secret: result.data.data.google_key });
        success = true;
        setloading3(false);
      }
      return success;
    } catch (error) {
      setloading3(false);
      return false;
    }
  };
  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = async () => {
    if (activeStep === 1) {
      let result = await checkQrEntery();
      if (!result) return;
    }
    if (isLastStep()) {
      var formdata = new FormData();
      formdata.append("verify_code", verificationCode);
      googleAuthActivator(formdata)
        .then((res) => {
          if (res.data.success && res.data.data.enable_google === 1) {
            dispatch(userRefreshStart());

            successGoogleAuthenticationModal();
          } else {
            setError(!error);
          }
        })
        .catch((err) => setError(!error));
      // if (error) {
      // }
      return;
    }
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  // const handleComplete = () => {
  //   const newCompleted = completed;
  //   newCompleted[activeStep] = true;
  //   setCompleted(newCompleted);
  //   handleNext();
  // };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  const handleCancle = () => {
    closeModal();
  };

  const getStepsUi = () => {
    if (activeStep === 0) {
      return (
        <>
          <div className="text-center mt-5">
            <Typography fontWeight="medium" fontSize={13}>
              Step {activeStep + 1}
            </Typography>
            <Typography fontSize={13} className="mt-2">
              Download and install the Google Authenticator App
            </Typography>
          </div>
          <div className="row justify-content-center my-4">
            <div className="d-flex w-[140px] mr-5 align-items-center download-icon justify-content-center">
              <img
                src={AssetsImages.AppStoreLogo}
                className="h-[22px] w-[22px]"
                alt="apple-store"
              />
              <div className="ml-[5px]">
                <Typography
                  fontSize={9}
                  className="relative top-[5px]">
                  Download on the
                </Typography>
                <Typography fontSize={14} fontWeight="bold">
                  App Store
                </Typography>
              </div>
            </div>
            <div className="d-flex w-[140px] align-items-center download-icon justify-content-center">
              <img
                src={AssetsImages.GooglePlayLogo}
                className="h-[30px] w-[30px]"
                alt="play-store"
              />
              <div className="ml-[5px]">
                <Typography
                  fontSize={9}
                  className="relative top-[5px]">
                  Get it on
                </Typography>
                <Typography fontSize={14} fontWeight="bold">
                  Google Play
                </Typography>
              </div>
            </div>
          </div>
        </>
      );
    } else if (activeStep === 1) {
      return (
        <>
          <div className="text-center mt-5">
            <Typography fontWeight="medium" fontSize={13}>
              Step {activeStep + 1}
            </Typography>
            <Typography fontSize={13} className="mt-2">
              Scan this QR code in the Google Authenticator App
            </Typography>
          </div>
          {loading2 ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: "50px",
              }}>
              <CircularProgress />
            </Box>
          ) : (
            <div className="row justify-content-center gap-4 p-1 align-items-center">
              <div className="col-md-1 google-auth-qr-code">
                <QRCode size={"110"} value={step2Data.img} />
              </div>
              <div className="col-md-6 ml-14">
                <div className="row flex-column">
                  <div className="col-md-12 p-0">
                    <Typography fontSize={13}>
                      if you are unable to scan the QR code, please enter this
                      code manually into the App.
                    </Typography>
                  </div>
                  <div className="stepper-bg rounded py-2  text-center mt- max-w-max ">
                    <Typography fontSize={12}>{step2Data.secret}</Typography>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      );
    } else if (activeStep === 2) {
      return (
        <>
          <div className="text-center mt-5">
            <Typography fontWeight="medium" fontSize={13}>
              Step {activeStep + 1}
            </Typography>
            <div className="row justify-content-center">
              <div className="col-md-8">
                <Typography fontSize={13} className="mt-2">
                  Please save this Key. This key will allow you to recover your
                  Google Authenticator in case of phone loss.
                </Typography>
              </div>
            </div>
          </div>
          <div className="row justify-content-center align-items-center">
            <div className="col-md-5 d-flex justify-content-center">
              <div className="stepper-bg rounded py-2 px-2  mt-2 d-flex align-items-center justify-content-center">
                <ContentCopyRoundedIcon
                  fontSize="12"
                  className="mr-[5px] text-lightGray cursor-pointer"
                  onClick={async (e) => {
                    handlePopoverOpen(e);
                    navigator.clipboard
                      .writeText(step3Data.secret)
                      .then(() => console.log("Copied To Clipboard Successful"))
                      .catch(() => console.log("Copied To Clipboard Failed"));
                    console.log("step3Data.secret", step3Data.secret);
                    setTimeout(() => {
                      handlePopoverClose(e);
                    }, 500);
                  }}
                />
                <Typography fontSize={12}>{step3Data.secret}</Typography>
                <Popover
                  id="mouse-over-popover"
                  sx={{
                    pointerEvents: "none",
                  }}
                  open={open}
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  onClose={handlePopoverClose}
                  disableRestoreFocus>
                  <p
                  className="p-[5px] mb-0 text-[10px]">
                    {" "}
                    Copied
                  </p>
                </Popover>
              </div>
            </div>
          </div>
        </>
      );
    } else if (activeStep === 3) {
      return (
        <>
          <div className="text-center mt-5">
            <Typography fontWeight="medium" fontSize={13}>
              Step {activeStep + 1}
            </Typography>
            <div className="row justify-content-center">
              <div className="col-md-8">
                <Typography fontSize={13} className="mt-2">
                  Enable Google Authentication
                </Typography>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <div className="row justify-content-center">
              <div className="col-md-7">
                {error && (
                  <div className="mb-3">
                    <Alert severity="error" icon={false}>
                      <Typography fontSize={13} color={danger}>
                        Invalid code. Please try again.
                      </Typography>
                    </Alert>
                  </div>
                )}
                <TextField
                  label="Verification Code"
                  size="small"
                  value={verificationCode}
                  error={error}
                  onFocus={() => setError(false)}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  fullWidth={true}
                />
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-md-7 text-center mt-3 btn">
                {/* <Typography color="primary" fontSize={11}>
                  Loss access to verification?
                </Typography> */}
              </div>
            </div>
          </div>
        </>
      );
    }

    return;
  };

  return (
    <Box sx={{ width: "100%" }}>
      <div className="stepper-bg rounded p-2 ">
        <Stepper
          activeStep={activeStep}
          sx={{
            "& .MuiStepConnector-line": {
              borderStyle: "dashed",
              borderTopWidth: 2,
            },
            "& .Mui-active .MuiStepConnector-line": {
              borderStyle: "solid",
              borderTopWidth: 2,
              borderColor: primaryColor,
            },
            "& .Mui-completed .MuiStepConnector-line": {
              borderStyle: "solid",
              borderTopWidth: 2,
              borderColor: primaryColor,
            },
          }}>
          {steps.map((label, index) => (
            <Step key={label} completed={completed[index]}>
              <StepButton color="inherit" onClick={handleStep(index)}>
                <Typography fontSize={13}>{label}</Typography>
              </StepButton>
            </Step>
          ))}
        </Stepper>
      </div>
      <div>
        {allStepsCompleted() ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className="container-fluid">
              {getStepsUi(
                <>
                  <div className="text-center mt-5">
                    <Typography fontWeight="medium" fontSize={13}>
                      Step {activeStep + 1}
                    </Typography>
                    <Typography fontSize={13} className="mt-2">
                      Download and install the Google Authenticator App
                    </Typography>
                  </div>
                  <div className="row justify-content-center my-4">
                    <div className="d-flex w-[140px] mr-5 align-items-center download-icon justify-content-center">
                      <img
                        src={AssetsImages.AppStoreLogo}
                        className="h-[22px] w-[22px]"
                        alt="apple-store"
                      />
                      <div className="ml-[5px]">
                        <Typography
                          fontSize={9}
                         className="relative top-[5px]">
                          Download on the
                        </Typography>
                        <Typography fontSize={14} fontWeight="bold">
                          App Store
                        </Typography>
                      </div>
                    </div>
                    <div className="d-flex w-[140px] align-items-center download-icon justify-content-center">
                      <img
                        src={AssetsImages.GooglePlayLogo}
                        className="h-[30px] w-[30px]"
                        alt="play-store"
                      />
                      <div className="ml-[5px]">
                        <Typography
                          fontSize={9}
                         className="relative top-[5px]">
                          Get it on
                        </Typography>
                        <Typography fontSize={14} fontWeight="bold">
                          Google Play
                        </Typography>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              {activeStep > 0 && (
                <Button
                  size="small"
                  className="py-2 rounded normal-case"
                  variant="outlined"
                  disabled={activeStep === 0}
                  onClick={handleBack}>
                  Previous Step
                </Button>
              )}
              <Box sx={{ flex: "1 1 auto" }} />

              <Button
                size="small"
                className=" py-2 px-3 rounded normal-case mr-2"
                onClick={handleCancle}
                color="secondary"
                variant="outlined">
                Cancel
              </Button>
                <Button
                size="small"
                className="px-4 py-2 rounded normal-case"
                onClick={handleNext}
                loading={loading3 && activeStep === 1}
                variant="contained">
                {isLastStep() ? "Verify" : "Next Step"}
                </Button>
            </Box>
          </React.Fragment>
        )}
      </div>
    </Box>
  );
};

export default AuthenticationSteps;
