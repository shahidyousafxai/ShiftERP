// Library Imports
import React from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CustomCheckbox from "../CustomCheckbox";

// Local Imports
import Dropdown from "../DropDown";

const OptionModal = ({
  options,
  onChange,
  width,
  hasSearch,
  searchText,
  searchOnChange,
  leftLabel,
  rightLabel,
  columnToShow,
  searchArray,
}) => {
  const handleCloseWhisper = () => {
    const whisper = document.querySelector(".popoverID");
    if (whisper) {
      whisper.style.display = "none";
    }
  };

  return (
    <div className={`${width ? width : "w-40"}`}>
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row items-center">
          {leftLabel === "Filters" && (
            <FilterAltIcon className="text-lg" color="primary" />
          )}
          <p className="text-[15px]">{leftLabel}</p>
        </div>
        <label
          className="pointer mt-[3px] text-[13px] text-primaryColor"
          onClick={() => {
            onChange("clearAll");
            handleCloseWhisper();
          }}>
          {rightLabel}
        </label>
      </div>

      {Object.values(options).map((item, index) => {
        if (Array.isArray(item) && item.length === 0) {
          return (
            <div className="text-[13px] text-black ml-1 mt-1">
              {Object.keys(options)[index].replace(/([A-Z])/g, " $1")}
            </div>
          );
        } else {
          if (item.length > 0) {
            return (
              <Dropdown
                key={index}
                className="mx-1 "
                label={Object.keys(options)
                  [index].replace(/([A-Z])/g, " $1")
                  .trim()}>
                <div>
                  <div className={`${hasSearch && ""}`}>
                    {searchArray && searchArray?.length > 0 ? (
                      <>
                        {searchArray.map((child, index2) => {
                          return (
                            <div key={index2} className="text-[13px]">
                              <CustomCheckbox
                                onChange={() => {
                                  onChange(
                                    Object.keys(options)[index],
                                    child,
                                    index2
                                  );
                                }}
                                label={child.title}
                                value={child.value}
                              />
                            </div>
                          );
                        })}
                      </>
                    ) : (
                      <div className="max-h-[125px] overflow-y-auto overflow-x-hidden">
                        {item.map((child, index2) => {
                          if (child.title !== "Date") {
                            return (
                              <div
                                key={index2}
                                className="pl-[2.7px] text-[13px]">
                                <CustomCheckbox
                                  onChange={() => {
                                    onChange(
                                      Object.keys(options)[index],
                                      child,
                                      index2
                                    );
                                  }}
                                  label={child.title}
                                  value={child.value}
                                />
                              </div>
                            );
                          } else {
                            return (
                              <React.Fragment>
                                <div className="relative my-2">
                                  <input
                                    date
                                    type={"date"}
                                    className="block pl-3 pr-2 py-[10px] w-full text-sm border-borderGray border-[1px] text-black bg-transparent focus:outline-none focus:ring-0 peer rounded-[4px] disabled:bg-lightGray disabled:cursor-not-allowed"
                                    name={child.title}
                                    value={child.type}
                                    readOnly={false}
                                    onChange={(e) => {
                                      onChange("Date", child, e.target.value);
                                    }}
                                  />
                                  <label className="text-darkGray absolute ml-[3px] origin-[0] top-[7px] scale-75 -translate-y-4 bg-gradient-to-t from-slate-100 px-1 to-white border-t-white peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:bg-transparent  peer-focus:bg-white peer-disabled:cursor-not-allowed left-1 cursor-text text-sm">
                                    Date
                                  </label>
                                </div>
                              </React.Fragment>
                            );
                          }
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </Dropdown>
            );
          } else {
            return (
              <div key={index} className="text-[13px]">
                <CustomCheckbox
                  onChange={() => {
                    onChange(item);
                  }}
                  label={item.title}
                  value={
                    columnToShow?.find((el) => el.title === item.title)
                      ? true
                      : false
                  }
                />
              </div>
            );
          }
        }
      })}
    </div>
  );
};
export default OptionModal;
