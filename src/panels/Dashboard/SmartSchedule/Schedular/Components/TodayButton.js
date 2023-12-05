import { styled } from "@mui/material/styles";
import classNames from "clsx";
import { Button } from "@mui/material";
import RadioButtonCheckedOutlinedIcon from "@mui/icons-material/RadioButtonCheckedOutlined";

const PREFIX = "TodayButton";
export const classes = {
  button: `${PREFIX}-button`,
};

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

export const buttonComponent = ({
  setCurrentDate,
  getMessage,
  className,
  ...restProps
}) => {
  const handleClick = () => {
    setCurrentDate(new Date());
  };
  return (
    <StyledButton
      className={classNames(classes.button, className)}
      variant="outlined"
      onClick={handleClick}
      {...restProps}
      color="secondary">
      <RadioButtonCheckedOutlinedIcon fontSize="small" color="secondary" />
      {getMessage("today")}
    </StyledButton>
  );
};
