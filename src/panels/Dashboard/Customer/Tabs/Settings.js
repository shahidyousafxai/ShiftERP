import React from "react";
import { Switch } from "@mui/material";

const Settings = ({ customerSettings, setCustomerSettings }) => {
  // Handle OnChange Setting
  const settingOnChange = (setting, index, type) => {
    if (type === "left") {
      setCustomerSettings((prevState) => {
        const array = [...prevState];
        array[0] = [...array[0]];
        array[0][index].value = setting.value === 0 ? 1 : 0;
        return array;
      });
    } else {
      setCustomerSettings((prevState) => {
        const array = [...prevState];
        array[1] = [...array[1]];
        array[1][index].value = setting.value === 0 ? 1 : 0;
        return array;
      });
    }
  };

  const SettingsComponent = ({ index, setting, type }) => {
    return (
      <div
        key={index}
        className={`${
          index === customerSettings[0].length - 1 ||
          index === customerSettings[1].length - 1
            ? ""
            : "border-bottom"
        } flex flex-row justify-between items-center`}>
        <p className="text-charcoalBlack text-[13px]">{setting.title}</p>
        <Switch
          className="m-2"
          checked={setting.value === 1 ? true : false}
          value={setting.value}
          onChange={() => settingOnChange(setting, index, type)}
        />
      </div>
    );
  };
  return (
    <div className="flex flex-col justify-between pt-[20px] px-[20px]">
      <div className="border rounded bg-white pb-0.5">
        <p className="px-3 py-3 text-base font-semibold">Settings</p>
        <div className="row justify-between px-[40px] pb-3">
          <div className="border rounded row col-md-6 p-0">
            {customerSettings[0].map((setting, index) => {
              return (
                <SettingsComponent
                  type="left"
                  index={index}
                  setting={setting}
                />
              );
            })}
          </div>
          <div className="border rounded row justify-between col-md-6 p-0">
            {customerSettings[1].map((setting, index) => {
              return (
                <SettingsComponent
                  type="right"
                  index={index}
                  setting={setting}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Settings;
