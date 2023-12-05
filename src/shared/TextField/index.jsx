import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { danger, primaryColor } from "../../helpers/GlobalVariables";

const CustomTextField = ({
  id,
  label,
  variant,
  fullWidth,
  InputProps,
  type,
  size,
  color,
  error,
  disabled,
  onChange,
  name,
  onClick,
  onFocus,
  value,
  defaultValue,
  inputProps,
  sx,
  required,
  helperText,
  style,
  placeholderSize,
  className,
  ...resetProps
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className={`relative ${className}`}>
      <TextField
        style={style}
        helperText={helperText}
        inputProps={inputProps}
        sx={{
          ...sx,
          "& .MuiInputBase-input": {
            ...(disabled && {
              WebkitTextFillColor: "#3333337d",
              backgroundColor: "#d3d3d340",
              cursor: "not-allowed",
              color: "black",
            }),
          },
          "& .MuiFormLabel-root": {
            fontSize: placeholderSize,
          },
          "& .MuiInputBase-root.Mui-disabled": {
            "& > fieldset": {
              borderColor: "#C8C8C8",
            },
          },
          "& .MuiFormHelperText-root.Mui-error": {
            color: danger,
          },
          "& .Mui-error": {
            color: name === "itemAmount" ? "#7a7a7a" : danger,
          },
        }}
        error={error}
        id={id}
        label={label}
        variant={variant}
        fullWidth={fullWidth}
        required={required}
        type={type === "password" ? (showPassword ? "text" : "password") : type}
        color={color}
        InputProps={[
          InputProps,
          {
            classes: {
              notchedOutline: {
                borderColor: error ? danger : primaryColor,
                color: error ? danger : primaryColor,
              },
            },
          },
        ]}
        size={size}
        onChange={onChange}
        onClick={onClick}
        name={name}
        onFocus={onFocus}
        value={value}
        disabled={disabled}
        defaultValue={defaultValue}
        {...resetProps}
      />
      {type === "password" && (
        <span className="absolute cursor-pointer top-[9px] right-[16px]">
          {showPassword ? (
            <i
              className="fa fa-eye-slash"
              aria-hidden="true"
              onClick={() => setShowPassword(false)}></i>
          ) : (
            <i
              className="fa fa-eye"
              aria-hidden="true"
              onClick={() => setShowPassword(true)}></i>
          )}
        </span>
      )}
    </div>
  );
};

export default CustomTextField;
