import React from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { FormHelperText } from "@mui/material";
import { danger } from "../../helpers/GlobalVariables";

const animatedComponents = makeAnimated();

const DropDown = ({
  options,
  className,
  multiple,
  value,
  onChange,
  defaultValue,
  maxMenuHeight,
  placeholder,
  onFocus,
  error,
  errorMsg,
}) => {
  return (
    <>
      <Select
        value={value}
        onChange={onChange}
        className={className}
        closeMenuOnSelect={false}
        components={animatedComponents}
        isMulti={multiple}
        options={options}
        placeholder={placeholder}
        isClearable={false}
        maxMenuHeight={maxMenuHeight}
        onFocus={onFocus}
        styles={{
          // Custom styles for the error state
          control: (provided, state) => ({
            ...provided,
            borderColor: error ? "red" : provided.borderColor,
          }),
        }}
      />
      <FormHelperText sx={{ color: danger }}>{errorMsg}</FormHelperText>
    </>
  );
};

export default DropDown;
