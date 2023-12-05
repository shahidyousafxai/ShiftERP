import React from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { SearchBar, Button } from "../../../../shared";
import "../Styles/customer.css";
const Integrations = () => {
  const settings1 = [
    "Lot Number on BOL / Receipts",
    "Lot Number on BOL / Receipts",
    "Lot Number on BOL / Receipts",
    "Lot Number on BOL / Receipts",
    "Lot Number on BOL / Receipts",
    "Lot Number on BOL / Receipts",
  ];

  const Integration = ({ index }) => {
    return (
      <div
        key={index}
        className=" border rounded bg-white pb-0.5 p-3 m-[14px] w-[23.1%] min-w-[110px]">
        <div className="flex flex-row justify-between">
          <img
            className="h-5 w-16"
            alt="shift-erp"
            src={"https://a.storyblok.com/f/47007/x/187cc6c31c/adjust-logo.svg"}
          />
          <div className="border border-success rounded w-20 min-w-[20px] text-success text-center text-[13px] bg-success/10">
            Connected
          </div>
        </div>
        <div className="mt-2">
          <div className="text-[17px] text-charcoalBlack font-medium">2mee</div>
          <div className="my-2 text-[13px] text-darkGray">A/B Testing</div>
          <div
            className={`text-[13px] text-primaryColor cursor-pointer`}>
            Add Integrations
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col justify-between pt-[20px] px-[20px]">
      <div className="border rounded bg-white pb-0.5">
        <p className="px-3 py-3 text-base font-semibold">Integrations</p>
        <div className="flex flex-row justify-between px-3">
          <SearchBar />
          <div className="flex flex-row justify-end ml-[15px]">
            <div>
              <Button
                startIcon={<FilterAltIcon />}
                component="span"
                variant="outlined"
                color={"secondary"}
                className="normal-case mr-[15px]"
                >
                Filter
              </Button>
            </div>
          </div>
        </div>
        <div className="row px-[16px] py-3">
          {settings1.map((item, index) => {
            return <Integration index={index} />;
          })}
        </div>
      </div>
    </div>
  );
};
export default Integrations;
