import React from "react";
import {
  TextField,
  Autocomplete,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { danger } from "../../helpers/GlobalVariables";

const names = [
  { name: "Humaira Sims", uuid: "1", code: "123" },
  { name: "Santiago Solis", uuid: "2", code: "13" },
  { name: "Dawid Floyd", uuid: "3", code: "11212" },
  { name: "Mateo Barlow", uuid: "4", code: "123111" },
  { name: "Samia Navarro", uuid: "5", code: "12312312" },
];

const nameArray = [
  "Humaira Sims",
  "Santiago Solis",
  "Dawid Floyd",
  "Mateo Barlow",
  "Samia Navarro",
];

export default function MultiDropDown({
  multiple,
  placeholder,
  optionsArray,
  value,
  disabled,
  onChange,
  error,
  errorMsg,
}) {
  return (
    <>
      <Autocomplete
        size="small"
        multiple={multiple}
        fullWidth
        disabled={disabled}
        options={optionsArray}
        disableCloseOnSelect
        value={value}
        onChange={onChange}
        getOptionLabel={(option) => (option?.name ? option?.name : option)}
        sx={
          disabled && {
            backgroundColor: "white",
            border: "1px solid #E0E0E0",
            borderRadius: "5px",
            "& .MuiFormLabel-root": {
              backgroundColor: "white",
              padding: "0px 5px",
            },
          }
        }
        //render input
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label={placeholder}
            error={error}
          />
        )}
        //render option
        renderOption={(props, option, { selected }) => (
          <MenuItem
            {...props}
            key={option.uuid}
            value={option}
            sx={{ justifyContent: "space-between" }}>
            {/* {option?.name ? option?.name : option} */}
            {option.code
              ? `${option?.code} - ${option?.name}`
              : option?.name
              ? option?.name
              : option}
            {selected ? <CheckIcon color="info" /> : null}
          </MenuItem>
        )}
      />
      <FormHelperText sx={{ color: danger }}>{errorMsg}</FormHelperText>
    </>
  );
}
