import React, { useState } from "react";
import { Divider } from "@mui/material";
import { useSelector } from "react-redux";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";


import Service from "./Service";
import AssetsImages from "../../../../assets/images";
import GoogleAuthentication from "./GoogleAuthenticatorModals/ActivateGoogleAuthentication.js";
import SmsAuthentication from "./SmsAuthenticationModals/ActivateSmsAuthentication";
import { success } from "../../../../helpers/GlobalVariables.js";
import { Button, CustomModal, Typography } from "../../../../shared";
import DisableGoogleAuthenticator from "./GoogleAuthenticatorModals/DisableGoogleAuthenticator.js";
import EnableGoogleAuthenticator from "./GoogleAuthenticatorModals/EnableGoogleAuthentication.js";
import ResetGoogleAuthenticator from "./GoogleAuthenticatorModals/ResetGoogleAuthenticator.js";
import DisableSmsAuthenticator from "./SmsAuthenticationModals/DisableSmsAuthenticator.js";
import EnableSmsAuthenticator from "./SmsAuthenticationModals/EnableSmsAuthenticator.js";
import ResetSmsAuthenticator from "./SmsAuthenticationModals/ResetSmsAuthenticator.js";


const AccountSecurity = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [openGoogleAuthenticationModal, setOpenGoogleAuthenticationModal] =
    useState(null);
  const [successModal, setSuccessModal] = useState(null);

  const [openSmsAuthenticationModal, setOpenSmsAuthenticationModal] =
    useState(null);

  // sending type to judge which modal we want to open /: availbel types -> 'start' , 'enable' , 'disabled
  const handleGoogleAuthenticationClick = (type) => {
    setOpenGoogleAuthenticationModal(type);
  };

  const successGoogleAuthenticationModal = () => {
    setOpenGoogleAuthenticationModal(false);
    setSuccessModal("google");
  };

  const handleSmsAuthenticationClick = (type) => {
    setOpenSmsAuthenticationModal(type);
  };

  const successSMSAuthenticationModal = () => {
    setOpenSmsAuthenticationModal(false);
    setSuccessModal("sms");
  };

  return (
    <div className="row">
      <Typography fontWeight="medium" fontSize={15} component="span">
        <h6>Account Settings</h6>

        <div className="mt-3">
          <Service
            onClick={handleGoogleAuthenticationClick}
            serviceLogo={AssetsImages.googleLogo}
            serviceStatus={currentUser.enable_google}
            serviceName={"google"}
            serviceTitle="Google Authentication"
            serviceDescription="Used for log in"
            enableText="Enable Google Authentication"
          />
        </div>
        <Divider className="my-3" />
        <div>
          <Service
            onClick={handleSmsAuthenticationClick}
            serviceLogo={AssetsImages.messageLogo}
            serviceStatus={currentUser.enable_sms}
            serviceName={"sms"}
            serviceTitle="SMS Authentication"
            serviceDescription="Used for log in"
            enableText="Enable SMS Authentication"
          />
        </div>
      </Typography>

      {/* Google Authentication Modal Type: Start*/}
      <CustomModal
        open={openGoogleAuthenticationModal === "start"}
        close={() => setOpenGoogleAuthenticationModal(null)}
        padding={2}
        width={window.innerWidth * 0.4}
        title="Enable Google Authentication">
        <GoogleAuthentication
          closeModal={() => setOpenGoogleAuthenticationModal(null)}
          successGoogleAuthenticationModal={successGoogleAuthenticationModal}
        />
      </CustomModal>
      {/* Google Authentication Modal Type: Disable*/}
      <CustomModal
        open={openGoogleAuthenticationModal === "disable"}
        close={() => setOpenGoogleAuthenticationModal(null)}
        padding={2}
        width={500}
        title="Disable Google Authentication">
        <DisableGoogleAuthenticator
          // activateService={(payload) => activateService("google", payload)}
          closeModal={() => setOpenGoogleAuthenticationModal(null)}
        />
      </CustomModal>

      {/* Google Authentication Modal Type: Enable*/}
      <CustomModal
        open={openGoogleAuthenticationModal === "enable"}
        close={() => setOpenGoogleAuthenticationModal(null)}
        padding={2}
        width={500}
        title="Enable Google Authentication">
        <EnableGoogleAuthenticator
          // activateService={(payload) => activateService("google", payload)}
          closeModal={() => setOpenGoogleAuthenticationModal(null)}
        />
      </CustomModal>
      {/* Google Authentication Modal Type: Reset*/}
      <CustomModal
        open={openGoogleAuthenticationModal === "reset"}
        close={() => setOpenGoogleAuthenticationModal(null)}
        padding={2}
        width={500}
        title="Enable Google Authentication">
        <ResetGoogleAuthenticator
          // activateService={(payload) => activateService("google", payload)}
          closeModal={() => setOpenGoogleAuthenticationModal(null)}
        />
      </CustomModal>

      {/* SMS Authentication Modal Type: Start*/}
      <CustomModal
        open={openSmsAuthenticationModal === "start"}
        close={() => setOpenSmsAuthenticationModal(null)}
        padding={2}
        width={520}
        title="Enable SMS Authentication"
        // icon={<EditIcon color="primary" />}
      >
        <SmsAuthentication
          successSMSAuthenticationModal={successSMSAuthenticationModal}
          onDiscard={() => setOpenSmsAuthenticationModal(false)}
        />
      </CustomModal>

      {/* SMS Authentication Modal Type: Disabled*/}
      <CustomModal
        open={openSmsAuthenticationModal === "disable"}
        close={() => setOpenSmsAuthenticationModal(null)}
        padding={2}
        width={520}
        title="Disable SMS Authentication"
        // icon={<EditIcon color="primary" />}
      >
        <DisableSmsAuthenticator
          closeModal={() => setOpenSmsAuthenticationModal(null)}
        />
      </CustomModal>
      {/* SMS Authentication Modal Type: Enable*/}
      <CustomModal
        open={openSmsAuthenticationModal === "enable"}
        close={() => setOpenSmsAuthenticationModal(null)}
        padding={2}
        width={520}
        title="Enable SMS Authentication"
        // icon={<EditIcon color="primary" />}
      >
        <EnableSmsAuthenticator
          closeModal={() => setOpenSmsAuthenticationModal(null)}
        />
      </CustomModal>
      {/* SMS Authentication Modal Type: Reset*/}
      <CustomModal
        // open={openSmsAuthenticationModal === "reset"}
        open={openSmsAuthenticationModal === "reset"}
        close={() => setOpenSmsAuthenticationModal(null)}
        padding={2}
        width={520}
        title="Reset Authenticator key"
        // icon={<EditIcon color="primary" />}
      >
        <ResetSmsAuthenticator
          closeModal={() => setOpenSmsAuthenticationModal(null)}
        />
      </CustomModal>

      {/* Success Authentication Modal */}
      <CustomModal
        open={successModal}
        close={() => setSuccessModal(null)}
        title={
          successModal === "google"
            ? "Google Authentication"
            : "SMS Authentication"
        }
        padding={4}
        width={600}
        icon={<CheckCircleIcon sx={{ color: success }} />}>
        <>
          <Typography
            id="modal-modal-description"
            sx={{
              fontSize: "14px",
            }}>
            {` You have successfully enabled ${
              successModal === "google" ? "Google " : "SMS"
            } Authentication to protect your
            account.`}
          </Typography>

          <div className="buttons d-flex gap-3 justify-content-end">
            <Button
              className={"shadow-5 py-[5px] px-[15px] border border-secondaryColor text-secondaryColor"}
              onClick={() => setSuccessModal(null)}>
              Close
            </Button>
          </div>
        </>
      </CustomModal>
    </div>
  );
};

export default AccountSecurity;
