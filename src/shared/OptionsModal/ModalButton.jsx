// Library Imports
import "rsuite/dist/rsuite.min.css";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Popover from "rsuite/Popover";

// Local Imports
import CustomPopoverButton from "../PopOver";

const ModalButton = ({
  option1,
  option2,
  option3,
  option4,
  label,
  children,
}) => (
  <CustomPopoverButton
    text={label}
    color="white"
    startIcon={
      label === "Filter" && (
        <FilterAltIcon
          className={`!text-[18px] !mr-[5px] !mb-[1px] ${
            option1 || option2 || option3 || option4
              ? `text-primaryColor`
            : `text-secondaryColor`
          }`}
        />
      )
    }
    active={option1 || option2 || option3 || option4 ? true : false}
    placement="bottomEnd"
    speaker={<Popover className="popoverID">{children}</Popover>}
  />
);
export default ModalButton;
