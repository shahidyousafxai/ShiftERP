import React from "react";

//Local Imports
import "./radio.module.css";

const Radio = ({ label, checked, onChange, className, labelClassName }) => (
  <label id="radio" className={className}>
    <input type="radio" name="radio" onChange={onChange} checked={checked} />
    <span className={`text-[13px] text-charcoalBlack ${labelClassName}`}>
      {label}
    </span>
  </label>
);

export default Radio;
