/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import classNames from "clsx";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { styled } from "@mui/material/styles";
import { DateNavigator } from "@devexpress/dx-react-scheduler-material-ui";
import { getOrdersList } from "../../../../../redux/smartSchedule/actions";

const PREFIX = "dateNvigator";
const PREFIXS = "Root";
export const classes = {
  button: `${PREFIX}-button`,
  root: `${PREFIXS}-root`,
};

const StyledButton = styled(DateNavigator.NavigationButton)(
  ({ theme: { spacing } }) => ({
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
  })
);

export const navigationButtonComponent = ({
  type,
  navigatorText,
  onClick,
  ...restProps
}) => {
  const handleNavigate = () => {
    if (type === "back") {
      onClick(type);
    } else {
      onClick(type);
    }
  };
  return (
    <div>
      {type === "back" ? (
        <StyledButton
          className={classNames(classes.button)}
          variant="outlined"
          type="back"
          {...restProps}
          color="secondary"
          onClick={(e, restProps) => handleNavigate(e)}
        />
      ) : (
        <StyledButton
          className={classNames(classes.button)}
          variant="outlined"
          {...restProps}
          type="forward"
          color="secondary"
          onClick={(e, restProps) => handleNavigate(e)}
        />
      )}
    </div>
  );
};

const StyledDiv = styled("div")(({ theme: { spacing } }) => ({
  [`&.${classes.root}`]: {
    marginLeft: spacing(0.5),
    "&:first-of-type": {
      marginLeft: 0,
    },
  },
}));

export const RootBase = ({
  navigationButtonComponent: NavigationButton,
  openButtonComponent: OpenButton,
  navigatorText,
  rootRef,
  onVisibilityToggle,
  onNavigate,
  className,
  ...restProps
}) => {
  const dispatch = useDispatch();
  const regex = /^\d{4}-\d{1,2}-\d{2}$/;
  let array = navigatorText?.split(" ");
  let newArray = `${array[array.length - 1]}-${array[0]}`;
  let newArr = `${array[array.length - 1]}-${array[array.length - 2].replace(
    ",",
    ""
  )}-${array[1]}`;

  if (regex.test(newArray)) {
    console.log("newArray matched", newArray);
  } else {
    console.log("newArr does not matched", newArr);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getOrdersListing = () => {
    const payload = {
      status: "",
      date: newArray,
      duration: "week",
    };
    dispatch(getOrdersList(payload));
  };

  const navigateBack = React.useCallback(() => {
    onNavigate("back");
  }, [onNavigate, getOrdersListing]);
  const navigateForward = React.useCallback(
    () => onNavigate("forward"),
    [onNavigate]
  );

  return (
    <StyledDiv
      className={classNames(classes.root, className)}
      ref={rootRef}
      {...restProps}>
      <NavigationButton type="back" onClick={navigateBack} />
      <NavigationButton type="forward" onClick={navigateForward} />
      <OpenButton
        onVisibilityToggle={onVisibilityToggle}
        text={navigatorText}
      />
    </StyledDiv>
  );
};

RootBase.propTypes = {
  // oneOfType is a workaround because withStyles returns react object
  navigationButtonComponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object,
  ]).isRequired,
  openButtonComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
    .isRequired,
  onVisibilityToggle: PropTypes.func.isRequired,
  onNavigate: PropTypes.func.isRequired,
  rootRef: PropTypes.func.isRequired,
  navigatorText: PropTypes.string,
  className: PropTypes.string,
};

RootBase.defaultProps = {
  navigatorText: "",
  className: undefined,
};

export const Root = RootBase;
