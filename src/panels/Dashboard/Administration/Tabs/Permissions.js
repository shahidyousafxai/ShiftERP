import React, { useState } from "react";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const Permissions = ({
  userPermissions,
  selectedPermissions,
  setSelectedPermissions,
  fromEdit,
}) => {
  const permissions = userPermissions;
  const [collapse, setCollapse] = useState(false);
  const onChangeInventoryPermission = (event) => {
    let updatedList = [...selectedPermissions];

    if (event.target.checked) {
      updatedList = [...selectedPermissions, event.target.value];
    } else {
      updatedList.splice(selectedPermissions.indexOf(event.target.value), 1);
    }
    setSelectedPermissions(updatedList);
  };
  const onChangePermission = (event, item) => {
    let updatedList = [...selectedPermissions];
    let selectedValue = event.target.value;

    let valueToCheck =
      item[
        item.findIndex((object) => {
          return object.uuid === selectedValue;
        }) === 0
          ? 1
          : 0
      ].uuid;

    if (updatedList.some((el) => el === valueToCheck)) {
      updatedList.splice(selectedPermissions.indexOf(valueToCheck), 1);
      updatedList = [...updatedList, selectedValue];
    } else {
      updatedList = [...selectedPermissions, selectedValue];
    }
    setSelectedPermissions(updatedList);
  };
  const onSelectNone = (item) => {
    let updatedList = [...selectedPermissions];

    if (updatedList.some((el) => el === item[0].uuid)) {
      updatedList.splice(selectedPermissions.indexOf(item[0].uuid), 1);
    } else if (updatedList.some((el) => el === item[1].uuid)) {
      updatedList.splice(selectedPermissions.indexOf(item[1].uuid), 1);
    }
    setSelectedPermissions(updatedList);
  };

  return (
    <div className="flex column justify-between py-[20px] px-[20px] flex-col bg-bgGray">
      <div className="border rounded bg-white pb-0.5">
        <h6 className="px-3 pt-3 pb-1">Permissions</h6>
        {permissions.map((item, index) => {
          return (
            <div
              key={index}
              className={`form-row d-flex align-items-center border-t-[1px] border-lightGray py-[12px] px-[14px] ${
                collapse && index === 1 ? "bg-bgGray" : "bg-white"
              }`}>
              {index === 1 ? (
                <div className="form-row text-[12px] w-[20%]">
                  <div
                    onClick={() => setCollapse(!collapse)}
                    className="form-row pointer mt-1 text-[13px]">
                    {collapse ? (
                      <ArrowDropUpIcon color="secondary" />
                    ) : (
                      <ArrowDropDownIcon color="secondary" />
                    )}
                    {item.name}
                  </div>
                  {collapse && (
                    <div className="ml-1 mt-2">
                      <div className="form-check">
                        <input
                          onChange={onChangeInventoryPermission}
                          className="form-check-input text-[13px]"
                          type="checkbox"
                          value={item.children[2].uuid}
                          id="flexCheckChecked2"
                          checked={
                            selectedPermissions.some(
                              (el) => el === item.children[2].uuid
                            )
                              ? true
                              : false
                          }
                        />
                        <label
                          className="form-check-label "
                          htmlFor="flexCheckChecked2">
                          {item.children[2].name}
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          onChange={onChangeInventoryPermission}
                          className="form-check-input"
                          type="checkbox"
                          value={item.children[3].uuid}
                          id="flexCheckChecked3"
                          checked={
                            selectedPermissions.some(
                              (el) => el === item.children[3].uuid
                            )
                              ? true
                              : false
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexCheckChecked3">
                          {item.children[3].name}
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          onChange={onChangeInventoryPermission}
                          className="form-check-input"
                          type="checkbox"
                          value={item.children[4].uuid}
                          id="flexCheckChecked4"
                          checked={
                            selectedPermissions.some(
                              (el) => el === item.children[4].uuid
                            )
                              ? true
                              : false
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexCheckChecked4">
                          {item.children[4].name}
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-[13px] w-[20%]">{item.name}</div>
              )}
              <div className="container ml-14 self-start">
                <div className="row w-60">
                  <div className="col form-check text-center">
                    <input
                      className="form-check-input text-[14px] mt-[5px] cursor-pointer"
                      type="radio"
                      name={item.name}
                      value=""
                      id={`flexRadioDefault${index + 1}`}
                      onChange={() => onSelectNone(item.children)}
                      checked={
                        selectedPermissions.some(
                          (el) => el === item.children[0].uuid
                        )
                          ? false
                          : selectedPermissions.some(
                              (el) => el === item.children[1].uuid
                            )
                          ? false
                          : true
                      }
                    />
                    <label
                      className="form-check-label text-[13px] cursor-pointer"
                      htmlFor={`flexRadioDefault${index + 1}`}>
                      None
                    </label>
                  </div>
                  <div className="col form-check text-center">
                    <input
                      onChange={(event) =>
                        onChangePermission(event, item.children)
                      }
                      value={item.children[0].uuid}
                      className="form-check-input text-[14px] mt-[5px] cursor-pointer"
                      type="radio"
                      name={item.name}
                      id={`flexRadioDefault${index + 20}`}
                      checked={
                        selectedPermissions.some(
                          (el) => el === item.children[0].uuid
                        )
                          ? true
                          : false
                      }
                    />
                    <label
                      className="form-check-label text-[13px] cursor-pointer"
                      htmlFor={`flexRadioDefault${index + 20}`}>
                      {item.children[0].name}
                    </label>
                  </div>
                  <div className="col form-check text-center">
                    <input
                      onChange={(event) =>
                        onChangePermission(event, item.children)
                      }
                      value={item.children[1].uuid}
                      className="form-check-input text-[14px] mt-[5px] cursor-pointer"
                      type="radio"
                      name={item.name}
                      id={`flexRadioDefault${index + 40}`}
                      checked={
                        selectedPermissions.some(
                          (el) => el === item.children[1].uuid
                        )
                          ? true
                          : false
                      }
                    />
                    <label
                      className="form-check-label text-[13px] cursor-pointer"
                      htmlFor={`flexRadioDefault${index + 40}`}>
                      {item.children[1].name}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Permissions;
