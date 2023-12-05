import React from "react";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/material";
import Typography from "../Typography";

const CustomModal = ({
  open = false,
  close = () => {},
  children,
  title,
  icon,
  padding,
  width,
  height,
  hideBackdrop,
}) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "5px",
    outline: "none",
    display: "flex",
    flexDirection: "column",
    gridGap: "15px",
    width: width,
    height: height,
    bgcolor: "background.paper",
    // border: "2px solid #000",
    boxShadow: 24,
    p: padding,
  };

  return (
    <Modal
      open={open}
      onClose={close}
      aria-labelledby="modal-modal-title"
      hideBackdrop={hideBackdrop}
      aria-describedby="modal-modal-description">
      <Box sx={style}>
        <div className="d-flex gap-3 align-items-center">
          {icon}
          <Typography fontSize={15} fontWeight="medium">
            {title}
          </Typography>
        </div>
        {children}
      </Box>
    </Modal>
  );
};

export default CustomModal;
