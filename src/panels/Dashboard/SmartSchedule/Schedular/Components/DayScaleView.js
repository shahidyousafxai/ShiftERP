/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useRef } from "react";
import { Popover, Whisper } from "rsuite";
import PropTypes from "prop-types";
import classNames from "clsx";
import { styled, TableCell } from "@mui/material";
import { WEEK_DAY_OPTIONS, DAY_OPTIONS } from "@devexpress/dx-scheduler-core";
import LocalPrintshopRoundedIcon from "@mui/icons-material/LocalPrintshopRounded";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";

const PREFIX = "Cell";

export const classes = {
  cell: `${PREFIX}-cell`,
  dayOfWeek: `${PREFIX}-dayOfWeek`,
  dayOfMonth: `${PREFIX}-dayOfMonth`,
  highlightedText: `${PREFIX}-highlightedText`,
  dayView: `${PREFIX}-dayView`,
  brightRightBorder: `${PREFIX}-brightRightBorder`,
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${classes.cell}`]: {
    userSelect: "none",
    paddingBottom: theme.spacing(0.5),
    textAlign: "center",
    paddingRight: "10px",
    paddingLeft: "10px",
    boxSizing: "border-box",
    border: `1px solid rgba(224, 224, 224, 1)`,
    borderLeft: 0,
    borderTop: 0,
    borderBottom: 0,
    "&:only-child": {
      textAlign: "left",
      paddingLeft: theme.spacing(2),
      border: `none`,
    },
    "&:last-child": {
      border: `none`,
    },
    paddingTop: theme.spacing(0.5),
  },
  [`& .${classes.dayOfWeek}`]: {
    ...theme.typography.caption,
    margin: 0,
    color: theme.palette.text.secondary,
    lineHeight: 1.17,
    fontSize: "14px",
  },
  [`& .${classes.dayOfMonth}`]: {
    ...theme.typography.h4,
    color: theme.palette.text.secondary,
    lineHeight: 1.2,
    fontSize: "14px",
  },
  [`& .${classes.highlightedText}`]: {
    color: theme.palette.primary.main,
    fontWeight: "bold",
  },
  [`& .${classes.dayView}`]: {
    paddingTop: `10px`,
    paddingBottom: `10px`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `space-between`,
    gap: `3px`,
    "td:only-child &": {
      textAlign: "center",
      width: "auto",
      display: "inline-block",
    },
  },
}));

export const weeklyDayScaleCellComponent = React.forwardRef(
  ({
    data,
    cellsData,
    schedulerData,
    className,
    startDate,
    endDate,
    today,
    formatDate,
    endOfGroup,
    groupingInfo,
    // @deprecated
    hasRightBorder,
    currentViewName,
    ...restProps
  }) => {
    let day = formatDate(startDate, WEEK_DAY_OPTIONS);

    const triggerRef = useRef(null);

    const PercentageFeature = () => {
      return (
        <React.Fragment>
          <div className="p-[10px] text-white">
            <div>
              <span className="text=[10px] text-secondaryColor">Planned :</span>
              <p className="text-[13px]">79,388 CS ~ 297,202 LBS</p>
            </div>
            <div>
              <span className="text=[10px] text-secondaryColor">Done :</span>
              <p className="text-[13px]">51,022 CS ~ 280,114 LBS</p>
            </div>
            <div>
              <span className="text=[10px] text-secondaryColor">Waste :</span>
              <p className="text-[13px]">1,022 CS ~ 10,114 LBS</p>
            </div>
          </div>
        </React.Fragment>
      );
    };

    const handleClose = () => {
      if (triggerRef.current && triggerRef.current.close) {
        triggerRef.current.close();
      }
    };

    useEffect(() => {
      window.addEventListener("scroll", handleClose);
      return () => {
        window.removeEventListener("scroll", handleClose);
      };
    }, []);

    return (
      <StyledTableCell
        className={classNames(
          {
            [classes.cell]: true,
            [classes.brightRightBorder]: endOfGroup || hasRightBorder,
          },
          className
        )}
        {...restProps}>
        <div className={classes.dayView}>
          <div className="w-[45px]">
            <Whisper
              trigger="click"
              ref={triggerRef}
              placement={day === "Sun" ? "bottomStart" : "bottomEnd"}
              speaker={
                <Popover
                  visible
                  id={day === "Sun" ? "custom-tooltip-sun" : "custom-tooltip"}
                  className="bg-dark p-[5px] ml-[5px] rounded-lg">
                  <PercentageFeature />
                </Popover>
              }>
              <span className="flex items-center bg-success cursor-pointer py-[2px] px-[4px] pl-[5px] text-white rounded-md h-[20px]">
                <p className="text-[12px]">72</p>
                <ArrowDropDownRoundedIcon sx={{ padding: 0 }} />
              </span>
            </Whisper>
          </div>
          <div className="flex gap-[3px]">
            <p
              className={classNames({
                [classes.dayOfWeek]: true,
                [classes.highlightedText]: today,
              })}>
              {formatDate(startDate, WEEK_DAY_OPTIONS)}
            </p>
            <div
              className={classNames({
                [classes.dayOfMonth]: true,
                [classes.highlightedText]: today,
              })}>
              {formatDate(startDate, DAY_OPTIONS)}
            </div>
          </div>
          <div>
            <LocalPrintshopRoundedIcon
              color="secondary"
              className="cursor-pointer text-[18px]"
            />
          </div>
        </div>
      </StyledTableCell>
    );
  }
);

weeklyDayScaleCellComponent.propTypes = {
  formatDate: PropTypes.func.isRequired,
  startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
    .isRequired,
  endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  className: PropTypes.string,
  today: PropTypes.bool,
  endOfGroup: PropTypes.bool,
  hasRightBorder: PropTypes.bool,
  groupingInfo: PropTypes.arrayOf(PropTypes.object),
};

weeklyDayScaleCellComponent.defaultProps = {
  className: undefined,
  endDate: undefined,
  today: false,
  endOfGroup: false,
  hasRightBorder: false,
  groupingInfo: undefined,
};

export const dayScaleCellComponent = ({
  data,
  cellsData,
  schedulerData,
  className,
  startDate,
  endDate,
  today,
  formatDate,
  endOfGroup,
  groupingInfo,
  // @deprecated
  hasRightBorder,
  ...restProps
}) => {
  const triggerRef = React.useRef(null);

  const PercentageFeature = ({ data }) => {
    return (
      <React.Fragment>
        <div className="p-[10px] text-white">
          <div>
            <span className="text=[10px] text-secondaryColor">Planned :</span>
            <p className="text-[13px]">79,388 CS ~ 297,202 LBS</p>
          </div>
          <div>
            <span className="text=[10px] text-secondaryColor">Done :</span>
            <p className="text-[13px]">51,022 CS ~ 280,114 LBS</p>
          </div>
          <div>
            <span className="text=[10px] text-secondaryColor">Waste :</span>
            <p className="text-[13px]">1,022 CS ~ 10,114 LBS</p>
          </div>
        </div>
      </React.Fragment>
    );
  };

  const handleClose = () => {
    if (triggerRef.current && triggerRef.current.close) {
      triggerRef.current.close();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleClose);
    return () => {
      window.removeEventListener("scroll", handleClose);
    };
  }, []);
  return (
    <StyledTableCell
      className={classNames(
        {
          [classes.cell]: true,
          [classes.brightRightBorder]: endOfGroup || hasRightBorder,
        },
        className
      )}
      {...restProps}>
      <div className={classes.dayView}>
        <div className="w-[45px]">
          <Whisper
            trigger="click"
            placement="bottomStart"
            ref={triggerRef}
            speaker={
              <Popover
                visible
                id="custom-tooltip-sun"
                className="bg-dark p-[5px] ml-[5px] rounded-lg">
                <PercentageFeature />
              </Popover>
            }>
            <span className="flex items-center bg-success cursor-pointer py-[2px] px-[4px] pl-[5px] text-white rounded-md h-[20px]">
              <p className="text-[12px]">72</p>
              <ArrowDropDownRoundedIcon sx={{ padding: 0 }} />
            </span>
          </Whisper>
        </div>
        <div className="flex gap-[3px]">
          <p
            className={classNames({
              [classes.dayOfWeek]: true,
              [classes.highlightedText]: today,
            })}>
            {formatDate(startDate, WEEK_DAY_OPTIONS)}
          </p>
          <div
            className={classNames({
              [classes.dayOfMonth]: true,
              [classes.highlightedText]: today,
            })}>
            {formatDate(startDate, DAY_OPTIONS)}
          </div>
        </div>
        <div>
          <LocalPrintshopRoundedIcon
            color="secondary"
            sx={{ cursor: "pointer", fontSize: "18px" }}
          />
        </div>
      </div>
    </StyledTableCell>
  );
};

weeklyDayScaleCellComponent.propTypes = {
  formatDate: PropTypes.func.isRequired,
  startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
    .isRequired,
  endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  className: PropTypes.string,
  today: PropTypes.bool,
  endOfGroup: PropTypes.bool,
  hasRightBorder: PropTypes.bool,
  groupingInfo: PropTypes.arrayOf(PropTypes.object),
};

weeklyDayScaleCellComponent.defaultProps = {
  className: undefined,
  endDate: undefined,
  today: false,
  endOfGroup: false,
  hasRightBorder: false,
  groupingInfo: undefined,
};
