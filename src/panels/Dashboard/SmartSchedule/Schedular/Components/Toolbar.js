/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import classNames from "clsx";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { Toolbar } from "@devexpress/dx-react-scheduler-material-ui";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import { SearchBar } from "../../../../../shared";

const PREFIX = "toolbar";
export const classes = {
  root: `${PREFIX}-root`,
  button: `${PREFIX}-button`,
};

const StyledRootComponent = styled(Toolbar.Root)(({ theme: { spacing } }) => ({
  [`&.${classes.root}`]: {
    borderBottom: 0,
    marginLeft: `auto`,
    padding: 0,
    width: `max-content`,
  },
}));

const StyledButton = styled(Button)(({ theme: { spacing } }) => ({
  [`&.${classes.button}`]: {
    padding: spacing(0.8, 2),
    marginLeft: spacing(0.5),
    borderRadius: `6px`,
    border: `1px solid #ECECED`,
    color: `#6A6D78`,
    display: `flex`,
    gap: `5px`,
    aliginItems: "center",
    textTransform: "capitalize",
    "&:first-of-type": {
      marginLeft: 0,
    },
  },
}));

export const flexibalComponent = ({ ...restProps }) => {
  const [name, setName] = useState("");
  return (
    <StyledRootComponent className={classNames(classes.root)}>
      <div className=" flex  gap-2 flex-row-reverse">
        <StyledButton
          variant="outlined"
          color="secondary"
          startIcon={<InsertDriveFileRoundedIcon />}
          className={classNames(classes.button)}>
          Export CSV
        </StyledButton>
        <StyledButton
          variant="outlined"
          color="secondary"
          startIcon={<FilterAltIcon />}
          className={classNames(classes.button)}>
          Filter
        </StyledButton>
        <SearchBar
          disabled={false}
          onClear={() => setName("")}
          // onSearch={() => onVendorsSearch()}
          onChange={(e) => setName(e.target.value)}
          value={name}
          width={"max-content"}
        />
      </div>
    </StyledRootComponent>
  );
};
