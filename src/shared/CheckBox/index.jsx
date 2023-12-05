import React from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "../Typography";

const checkbox = ({
  label,
  size,
  checked,
  color,
  colorCode,
  fontWeight,
  onChange,
}) => (
  <FormControlLabel
    control={
      <Checkbox
        size={size}
        onChange={onChange}
        checked={checked}
        style={{
          color: colorCode,
        }}
      />
    }
    label={
      <Typography fontSize={13} color={color} fontWeight={fontWeight}>
        {label}
      </Typography>
    }
    size={size}
    color={color}
  />
);

export default checkbox;
