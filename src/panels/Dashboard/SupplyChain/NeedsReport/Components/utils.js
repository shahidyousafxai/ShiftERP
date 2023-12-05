import React, { useState } from "react";
import CreateIcon from "@mui/icons-material/Create";
import { primaryColor } from "../../../../../helpers/GlobalVariables";
import { PopoverDelete, PopoverPrint, SettingsPopover } from "../../../../../helpers/TableUtilities";
import { SimpleDeleteModal } from "../../../../../helpers/SimpleDeleteModal";

export const TitleName = (restProps) => {
  return (
    <div className="d-flex flex-row align-items-center">
      <a className="text-capitalize text-[13px] text-primaryColor" href>
        {restProps.row.title}
      </a>
    </div>
  );
};

//Visibility Modal
export const VisibilityShow = (
  restProps,
  setIsVisible,
  isVisible,
  setVisibilityData,
  visibilityData
) => {
  const text = restProps.row.visibility;
  const count = restProps.row.count;
  const onClick = () => {
    setVisibilityData({
      ...visibilityData,
      visibleName: text,
      visibileVal:
        text === "Only me"
          ? "69876512345"
          : text === "Everyone"
          ? "41234598765"
          : text === "Facilities"
          ? "1123456789"
          : "9087654321",
    });
    setIsVisible(!isVisible);
  };
  return (
    <>
      <div className="d-flex justify-content-start" onClick={onClick}>
        <div
          className={`d-flex pointer justify-center p-1 rounded-[4px] text-light items-center gap-1 h-[25px] text-xs w-max ${
            text === "Only me"
              ? "bg-danger"
              : text === "Everyone"
              ? "bg-success"
              : "bg-primaryColor"
          }`}>
          <CreateIcon className="w-3.5 h-3.5 text-center text-xs" />
          {text}
          {count !== "0" && ": " + count}
        </div>
      </div>
    </>
  );
};

export const ManageNeedsReport = (restProps, setDeleteAlert) => {
  const id = restProps.row.id;

  const [isDelete, setIsDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = () => {
    setDeleteLoading(true);
    setDeleteAlert(true);
  };

  return (
    <div>

      <SimpleDeleteModal
        states={{
          open: isDelete,
          setOpen: setIsDelete,
          headTitle: "Delete Needs",
          deleteName: restProps.row.title,
          loading: deleteLoading,
          deleteMethod: () => handleDelete(),
        }}
      />


      <SettingsPopover id={id}>
        <PopoverPrint text="Print"/>
        <PopoverPrint text="Export CSV"/>
        <PopoverDelete onClick={() => setIsDelete(!isDelete)} text="Delete" />
      </SettingsPopover>
    </div>
  );
};

export function InputComponent({
  id,
  type,
  name,
  value,
  placeholder,
  input_classes,
  label,
  label_classes,
  disabled,
  readonly,
  defaultValue,
  onChange,
}) {
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={`block pl-3 pr-1 py-[9px] w-full text-sm border-borderGray border-[1px] text-black bg-transparent focus:outline-[${primaryColor}] focus:ring-0 peer rounded-[4px] disabled:bg-lightGray disabled:cursor-not-allowed ${input_classes}`}
        disabled={disabled}
        readOnly={readonly}
        onChange={onChange}
      />
      <label
        htmlFor={id}
        className={`!text-darkGray outline-none absolute ml-[3px] duration-200 origin-[0] top-[4px] scale-75 -translate-y-4 bg-gradient-to-t from-white px-1 to-white border-t-white peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-placeholder-shown: peer-focus:px-2 peer-focus:top-[6px] peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:bg-white peer-disabled:cursor-not-allowed left-1 cursor-text ${label_classes}`}>
        {label}
      </label>
    </div>
  );
}
