import React from "react";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import { lightGray, secondaryColor } from "../../helpers/GlobalVariables";

export const button = ({
  children,
  color,
  variant,
  fullWidth,
  style,
  disabled,
  onClick,
  className,
  startIcon,
  size,
  component,
}) => (
  <Button
    size={size}
    className={className}
    color={color}
    variant={variant}
    fullWidth={fullWidth}
    style={style}
    disabled={disabled}
    onClick={onClick}
    startIcon={startIcon}
    component={component}>
    {children}
  </Button>
);
const Lbutton = ({
  className,
  children,
  color,
  variant,
  fullWidth,
  style,
  disabled,
  onClick,
  loading,
  component,
  startIcon,
  size,
  endIcon,
}) => {
  if (children === "Cancel") {
    var disableColor = {
      color: disabled ? lightGray : secondaryColor,
      cursor: disabled ? "not-allowed" : "pointer",
      border: disabled && "1px solid #E0E0E0",
    };
  }

  const mergedStyle = {
    ...disableColor,
    ...style,
  };

  return (
    <LoadingButton
      className={className}
      startIcon={startIcon}
      color={color}
      variant={variant}
      fullWidth={fullWidth}
      style={mergedStyle}
      disabled={disabled}
      loading={loading}
      onClick={onClick}
      size={size}
      component={component}
      endIcon={endIcon}>
      {children}
    </LoadingButton>
  );
};

export const CustomButton = ({ text, icon, classes, onClick }) => (
  // <Lbutton
  //   startIcon={icon ? icon : null}
  //   onClick={onClick}
  //   color={color}
  // >

  // </Lbutton>
  <div onClick={onClick} className={`h-[50px] ${classes}`}>
    {icon && <div className="mx-1 fs-5">{icon}</div>}
    <div className="mx-1">{text}</div>
  </div>
);
export default Lbutton;
