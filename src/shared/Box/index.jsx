import React from "react";
import Box from "@mui/material/Box";

export default function box({ children, sx, className, ...props }) {
  return (
    <Box sx={sx} className={className} {...props}>
      {children}
    </Box>
  );
}
