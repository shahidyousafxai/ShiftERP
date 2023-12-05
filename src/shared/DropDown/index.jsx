// Library Imports
import React, { useState } from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

// Local Imports
import { primaryColor } from "../../helpers/GlobalVariables";

const Dropdown = ({ label, className, children }) => {
  // state for openning and closing dropdown
  const [listOpen, setListOpen] = useState([]);

  // handle dropdown openning and closing
  const handleClickForParent = (obj) => {
    setListOpen({
      ...listOpen,
      [obj]: !listOpen[obj],
    });
  };

  return (
    <div className={`${className}`}>
      <ListItemButton
        onClick={() => handleClickForParent(label)}
        className="!h-[25px] !p-0 !mt-[5px]">
        <ListItemText
          primary={label}
          sx={{ opacity: 1 }}
          primaryTypographyProps={{
            fontSize: 13,
            align: "left",
            color: listOpen[label] ? primaryColor : "black",
          }}
        />
        {listOpen[label] ? (
          <ExpandLessIcon
            sx={{
              color: primaryColor,
              fontSize: 18,
            }}
            className="mr-[-3px]"
          />
        ) : (
          <ExpandMoreIcon
            sx={{
              color: "black",
              fontSize: 18,
            }}
            className="mr-[-3px]"
          />
        )}
      </ListItemButton>
      <Collapse in={listOpen[label]} timeout="auto" unmountOnExit>
        {children}
      </Collapse>
    </div>
  );
};
export default Dropdown;
