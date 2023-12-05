import React from "react";

const CustomCheckbox = ({ label, value, onChange }) => (
  <label className="form-check form-check-sm form-check-custom form-check-solid hover:bg-[#f7f7f7]">
    <input
      id={label}
      className={`form-check-input pointer mt-1 ${value && `bg-primaryColor`}`}
      type="checkbox"
      checked={value}
      onChange={onChange}
    />
    {label}
  </label>
);

export default CustomCheckbox;
