// Library Imports
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import TripOriginIcon from "@mui/icons-material/TripOrigin";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import PrintIcon from "@mui/icons-material/Print";
import SendIcon from "@mui/icons-material/Send";
import { Add, Link, LocalShipping, ReplyOutlined, TextSnippet, Visibility } from "@mui/icons-material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";
import Popover from "rsuite/Popover";

// Local Imports
import { PopOver as CustomPopoverButton } from "../shared";


// Table Status
export const Status = (status, activeText, inactiveText) => {
  return status ? (
    <div className="flex justify-start">
      <CheckCircleRoundedIcon color="success" className="me-2 fs-5" />
      {activeText}
    </div>
  ) : (
    <div className="flex justify-start">
      <TripOriginIcon className="me-2 fs-5 text-secondaryColor" />
      {inactiveText}
    </div>
  );
};

// Table Statistics
export const Statistics = (state) => {
  return (
    <div className="flex flex-row justify-start">
      <span className="cursor-pointer">
        {state ? (
          <DoneIcon fontSize="small" color="success" />
        ) : (
          <CloseIcon fontSize="small" color="danger" />
        )}
      </span>
    </div>
  );
};

// Table Clickable fields
// Please pass an empty string if no any of the argument is missing
export const Name = (value, src, onClick) => {
  return (
    <div className="flex-row flex items-center cursor-pointer">
      {src ? (
        <img
          src={src}
          className="w-[30px] h-[30px] border-r-[15px] mr-2"
          alt=""
        />
      ) : null}
      <span
        onClick={onClick === "" ? () => {} : onClick}
        className={`capitalize text-[13px] text-primaryColor`}>
        {value}
      </span>
    </div>
  );
};

// =======================   Setting Popover ======================= //
export const SettingsPopover = ({ id, children }) => {
  return (
    <CustomPopoverButton
      classes="w-6"
      icon={true}
      children={
        <div
          className={`cursor-pointer ${
            id && id % 2 === 0 ? "bg-lightGray" : "bg-white"
          }`}>
          <SettingsIcon color="secondary" />
        </div>
      }
      placement="bottomEnd"
      speaker={
        <Popover>
          <div className="flex flex-row justify-between">
            <div className="flex flex-col justify-center items-start gap-y-2 pt-1 pr-4">
              {children}
            </div>
          </div>
        </Popover>
      }
    />
  );
};

// =======================   Popover Icons List Start ======================= //
// Edit Icon
export const PopoverEdit = ({ onClick, iconStyle }) => {
  return (
    <div
      onClick={onClick && onClick}
      className="flex gap-[6px] items-center cursor-pointer text-[14px]">
      <EditIcon className={`text-secondaryColor text-[18px] ${iconStyle}`} />
      <span className="mb-[1px]">Edit</span>
    </div>
  );
};

// Delete Icon
export const PopoverDelete = ({ onClick, text, iconStyle }) => {
  return (
    <div
      onClick={onClick && onClick}
      className="flex gap-[6px] items-center cursor-pointer text-[14px]">
      <DeleteIcon className={`text-secondaryColor text-[18px]  ${iconStyle}`} />
      <span>{text ? text : ""}</span>
    </div>
  );
};

// Login Link Icon
export const PopoverLoginLink = ({ onClick, iconStyle }) => {
  return (
    <div
      onClick={onClick && onClick}
      className="flex gap-[6px] items-center me-4 cursor-pointer text-[14px]">
      <Link
        className={`text-secondaryColor text-[18px] -translate-y-px ${iconStyle}`}
      />
      <span>Login Link</span>
    </div>
  );
};

// Print Icon
export const PopoverPrint = ({ onClick, text, iconStyle }) => {
  return (
    <div
      onClick={onClick && onClick}
      className="flex gap-[6px] items-center cursor-pointer text-[14px]">
      <PrintIcon
        className={`text-secondaryColor text-[18px] -translate-y-px ${iconStyle}`}
      />
      <span>{text ? text : ""}</span>
    </div>
  );
};

// View Details Icon
export const PopoverViewDetails = ({ onClick, text, iconStyle }) => {
  return (
    <div
      onClick={onClick && onClick}
      className="flex gap-[6px] items-center cursor-pointer text-[14px]">
      <Visibility className={`text-secondaryColor text-[18px] ${iconStyle}`} />
      <span>{text ? text : ""}</span>
    </div>
  );
};

// Send Icon
export const PopoverSend = ({ onClick, iconStyle }) => {
  return (
    <div
      onClick={onClick && onClick}
      className="flex gap-[6px] items-center cursor-pointer text-[14px]">
      <SendIcon
        className={`text-secondaryColor text-[18px] -translate-y-0.5 -rotate-[45deg] ${iconStyle}`}
      />
      <span>Send Bill</span>
    </div>
  );
};

// Shipping Icon
export const PopoverShipping = ({ onClick, iconStyle }) => {
  return (
    <div
      onClick={onClick && onClick}
      className="flex gap-[6px] items-center cursor-pointer text-[14px]">
      <LocalShipping
        className={`text-secondaryColor text-[18px] -translate-y-0.5 ${iconStyle}`}
      />
      <span>Print PO Receiving Document</span>
    </div>
  );
};

// Closeout Icon
export const PopoverCloseout = ({ onClick, iconStyle }) => {
  return (
    <div
      onClick={onClick && onClick}
      className="flex gap-[6px] items-center cursor-pointer text-[14px]">
      <CheckCircleIcon
        className={`text-secondaryColor text-[18px] -translate-y-0.5 ${iconStyle}`}
      />
      <span>Closeout PO</span>
    </div>
  );
};

// Reply Icon
export const PopoverReply = ({ onClick, iconStyle }) => {
  return (
    <div
      onClick={onClick && onClick}
      className="flex gap-[6px] items-center cursor-pointer text-[14px]">
      <ReplyOutlined
        className={`text-secondaryColor text-[18px] -translate-y-0.5 ${iconStyle}`}
      />
      <span>Share</span>
    </div>
  );
};

// Create IIF Icon
export const PopoverText = ({ onClick, iconStyle }) => {
  return (
    <div
      onClick={onClick && onClick}
      className="flex gap-[6px] items-center cursor-pointer text-[14px]">
      <TextSnippet
        className={`text-secondaryColor text-[18px] -translate-y-0.5 ${iconStyle}`}
      />
      <span>Create IIF</span>
    </div>
  );
};

// Add Alternative Icon
export const PopoverAdd = ({ onClick, text, iconStyle }) => {
  return (
    <div
      onClick={onClick && onClick}
      className="flex  items-center cursor-pointer text-[14px]">
      <Add
        className={`text-secondaryColor text-[24px] -translate-y-px -translate-x-px ${iconStyle}`}
      />
      <span>{text ? text : ""}</span>
    </div>
  );
};

// Add Alternative Icon
export const PopoverAlternative = ({ onClick, iconStyle }) => {
  return (
    <div
      onClick={onClick && onClick}
      className="flex gap-x-2 items-center cursor-pointer text-[14px]">
      <LibraryAddCheckIcon
        className={`text-secondaryColor text-[18px] -translate-y-0.5 ${iconStyle}`}
      />
      <span>Add Alternative</span>
    </div>
  );
};
// ======================= Popover Icons List End ======================= //

// =======================  Info ======================= //
export const Info = ({ onClick, count }) => {
  return (
    <div
      onClick={onClick && onClick}
      className={`w-[40px] h-[20px] text-[13px] flex cursor-pointer justify-between items-center p-1 rounded text-light bg-primaryColor`}>
      {count ? count : 0}
      <div className="bg-light text-dark rounded-full w-[14px] h-[14px] text-[12px] text-center">
        i
      </div>
    </div>
  );
};