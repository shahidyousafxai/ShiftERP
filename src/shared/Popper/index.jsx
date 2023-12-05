import React from "react";
import Popper from "@mui/material/Popper";
import PopupState, { bindToggle, bindPopper } from "material-ui-popup-state";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import SettingsIcon from "@mui/icons-material/Settings";

const PopperBox = ({ children, id }) => {
  return (
    <PopupState variant="popper" popupId="demo-popup-popper">
      {(popupState) => (
        <div>
          <div className="pointer" {...bindToggle(popupState)}>
            <SettingsIcon color={popupState.isOpen ? "" : "secondary"} />
          </div>
          <Popper {...bindPopper(popupState)} transition>
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Paper>{children}</Paper>
              </Fade>
            )}
          </Popper>
        </div>
      )}
    </PopupState>
  );
};
export default PopperBox;
