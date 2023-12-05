import React from "react";
import { useNavigate } from "react-router-dom";
import { BreadCrumb } from "../../../shared";
import {
  DateRangeButton,
  FilterButton,
  QuickActionButton,
  TodayButton,
} from "./Components/Buttons";
import { useSelector } from "react-redux";
const Dashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  return user?.currentUser?.role === "super-admin" ? (
    ""
  ) : (
    <div className="main-container pl-4 border-b-[1px] border-solid border-lightGray">
      {/* BreadCrums Start */}
      <div className="d-flex flex-row justify-content-between align-items-center py-3">
        <div>
          <BreadCrumb
            routes={[{ name: "ShiftERP", route: "/dashboard", color: true }]}
          />
          <div className="text-[15px] font-bold">Dashboard</div>
        </div>
        <div>
          <TodayButton />
          <DateRangeButton />
          <FilterButton />
          <QuickActionButton />
        </div>
      </div>
      {/* BreadCrums End */}
    </div>
  );
};

export default Dashboard;
