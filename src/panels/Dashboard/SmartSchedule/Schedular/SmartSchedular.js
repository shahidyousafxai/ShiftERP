/* eslint-disable react-hooks/exhaustive-deps */
// Library Imports
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  DayView,
  Appointments,
  WeekView,
  Toolbar,
  TodayButton,
  DateNavigator,
} from "@devexpress/dx-react-scheduler-material-ui";
import ButtonGroup from "@mui/material/ButtonGroup";
//Local Imports
import { Button, Box, Spinner } from "../../../../shared";
import { Appointment } from "./Components/Appointments";
import { buttonComponent } from "./Components/TodayButton";
import { navigationButtonComponent } from "./Components/DateNavigater";
import { flexibalComponent } from "./Components/Toolbar";
import {
  weeklyDayScaleCellComponent,
  dayScaleCellComponent,
} from "./Components/DayScaleView";
import { getOrdersList } from "../../../../redux/smartSchedule/actions";
import {
  GetOrdersLoading,
  GetOrdersList,
} from "../../../../redux/smartSchedule/selectors";

const SmartSchedular = () => {
  //States
  const dispatch = useDispatch();
  const loading = GetOrdersLoading();
  const ordersData = GetOrdersList();
  const [currentViewName, setCurrentViewName] = useState("Week");

  // External Day Or Week Switcher
  const ExternalViewSwitcher = () => (
    <ButtonGroup variant="outlined" aria-label="outlined button group">
      <Button
        onClick={() => setCurrentViewName("Day")}
        variant={currentViewName === "Day" ? "contained" : "outlined"}>
        Day
      </Button>
      <Button
        onClick={() => setCurrentViewName("Week")}
        variant={currentViewName === "Week" ? "contained" : "outlined"}>
        Week
      </Button>
    </ButtonGroup>
  );
  //Appointment Card Component
  const myAppointmentComponent = (restProps) => {
    return <Appointment {...restProps} currentViewName={currentViewName} />;
  };

  useEffect(() => {
    const payload = {
      status: "",
      date: "",
      duration: "week",
    };
    dispatch(getOrdersList(payload));
  }, []);

  return (
    <React.Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Scheduler data={ordersData}>
          <ViewState
            currentViewName={currentViewName}
            defaultCurrentViewName="week"
          />
          <Box className="bottom-[55px] relative">
            <ExternalViewSwitcher currentViewName={currentViewName} />
          </Box>
          <WeekView
            // startDayHour={6}
            // endDayHour={19}
            cellDuration={60}
            dayScaleCellComponent={weeklyDayScaleCellComponent}
          />
          <DayView
            // startDayHour={6}
            // endDayHour={19}
            cellDuration={60}
            dayScaleCellComponent={dayScaleCellComponent}
          />
          <Toolbar flexibleSpaceComponent={flexibalComponent} />
          <DateNavigator
            navigationButtonComponent={(type, onClick, ...restProps) =>
              navigationButtonComponent(type, onClick, ...restProps)
            }
          />
          <TodayButton buttonComponent={buttonComponent} />
          <Appointments appointmentComponent={myAppointmentComponent} />
        </Scheduler>
      )}
    </React.Fragment>
  );
};
export default SmartSchedular;
