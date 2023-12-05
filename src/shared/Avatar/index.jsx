import React from "react";
import Avatar from "@mui/material/Avatar";

const ImageAvatars = ({ src, alt, sx, className }) => {
  return <Avatar alt={alt} src={src} sx={sx} className={className} />;
};

export default ImageAvatars;
