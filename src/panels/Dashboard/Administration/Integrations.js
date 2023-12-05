// Library imports
import React from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

// Local Imports
import { SearchBar, Button, BreadCrumb } from "../../../shared";

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
        style={{ width: "23.1%", minWidth: 110 }}
        className=" border rounded bg-white pb-0.5 p-2">
        <div className="flex flex-row justify-between">
          <img
            className="h-5 w-16"
            alt="shift-erp"
            src={"https://a.storyblok.com/f/47007/x/187cc6c31c/adjust-logo.svg"}
          />
          <div
            style={{
              width: 90,
              minWidth: 90,
            }}
            className="border border-success bg-success/10 rounded w-20 text-success text-center text-[13px]">
            Connected
          </div>
        </div>
        <div className="mt-2">
          <div className="text-[17px] text-charcoalBlack font-medium">
            2mee
          </div>
          <div className="my-2 text-[13px] text-darkGray">
            A/B Testing
          </div>
          <div className="text-[13px] text-primaryColor cursor-pointer">
            Add Integrations
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="main-container">
      {/* Header Row with BreadCrumbb And Add Button */}
      <div className="flex flex-row justify-content-between align-items-center p-3">
        <div>
          <BreadCrumb
            routes={[
              {
                name: "Administration",
                route: "/administration/users",
                color: true,
              },
              { name: "Integrations" },
            ]}
          />
          <h6>Integrations</h6>
        </div>
      </div>
      {/* Search Bar Row With Buttons */}
      <div className="flex flex-row justify-between align-items-center px-3 pb-3">
        <SearchBar
        // disabled={selectionIds.length > 0 ? true : false} onSearch={() => onFacilitySearch()} onClear={() => setName('')} onChange={(e) => setName(e.target.value)} value={name}
        />
        <Button
          className="mx-3 normal-case"
          startIcon={<FilterAltIcon />}
          component="span"
          variant="outlined"
          color={"secondary"}
          // onClick={handleClick}
          >
          Filter
        </Button>
      </div>

      <div className="row mx-3 gap-3">
        {settings1.map((item, index) => {
          return <Integration index={index} />;
        })}
      </div>
    </div>
  );
};
export default Integrations;
