import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { FormHelperText } from "@mui/material";
import { danger } from "../../helpers/GlobalVariables";

export default function SelectAutoWidth({
  fullWidth,
  label,
  onChange,
  value,
  userRoleToShow,
  name,
  options,
  error,
  withRenderValue,
  errorMsg,
  errorState,
}) {
  return (
    <div className="relative">
      <FormControl fullWidth={fullWidth} size="small">
        <InputLabel
          id="demo-simple-select-autowidth-label"
          sx={{ color: errorState ? danger : "unset" }}>
          {label}
        </InputLabel>
        {withRenderValue && (
          <Select
            className="h-10"
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            value={value}
            defaultValue={true}
            renderValue={() => {
              return userRoleToShow;
            }}
            MenuProps={{
              style: {
                maxHeight: 220,
              },
            }}
            onChange={onChange}
            label={label}
            name={name}
            error={error}>
            {options?.map((option, index) => {
              return (
                <MenuItem key={option.id} value={option.uuid}>
                  {option.name && option.name}
                  {option.shipper_name && option.shipper_name}
                  {option.code && ` - ${option.code}`}
                  {option.title && option.title}
                </MenuItem>
              );
            })}
          </Select>
        )}
        {!withRenderValue && (
          <Select
            className="h-10"
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            MenuProps={{
              style: {
                maxHeight: 220,
              },
            }}
            value={value}
            defaultValue={true}
            onChange={onChange}
            label={label}
            name={name}
            error={error}>
            {options.map((option, index) => {
              return (
                <MenuItem key={index} value={option.full_name}>
                  {option.full_name}
                </MenuItem>
              );
            })}
          </Select>
        )}
        <FormHelperText sx={{ color: danger }}>{errorMsg}</FormHelperText>
      </FormControl>
    </div>
  );
}
