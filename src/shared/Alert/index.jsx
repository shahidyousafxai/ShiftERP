import React from "react";
import Alert from "@mui/material/Alert";

const alert = ({ children, severity, icon, action, ...restProps }) => (
  <Alert severity={severity} icon={icon} action={action} {...restProps}>
    {children}
  </Alert>
);

export default alert;
