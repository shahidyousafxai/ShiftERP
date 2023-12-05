// Library Imports
import React, { useState, useEffect } from "react";

// Local Imports
import {
  SearchBar,
  OptionModal,
  Spinner,
  Table as PricingTable,
  ModalButton,
  AlertMessage,
} from "../../../../../shared";

import {
  columnDataHandlingFees,
  editColumnDataHandlingFees,
  tableColumnExtensionsRecurringStorage,
} from "../mockupData/mockupData";
import { ManagePricing } from "../Components/utils";

const HandlingFees = ({
  filters,
  setFilters,
  selectionIds,
  setSelectionIds,
  loading,
  name,
  setName,
  getPricingListing,
  handlingFee,
}) => {
  // const [fromModal, setFromModal] = useState(state?.fromModal);
  //All useStates
  const [columns] = useState(columnDataHandlingFees);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [columnToShow, setColumnToShow] = useState(columnDataHandlingFees);
  const [columnSetting2] = useState(["manage"]);

  //Edit Columns Onchange
  const onChangeEditColumn = (item) => {
    if (item === "clearAll") {
      setColumnToShow(columnDataHandlingFees);
    } else {
      let toShow = [...columnToShow];
      if (toShow.find((el) => el.title === item.title)) {
        toShow.splice(
          toShow.findIndex((el) => el.title === item.title),
          1
        );
      } else {
        toShow = [...columnToShow, item];
      }
      setColumnToShow(toShow);
    }
  };

  //Data Providers
  const dataProviders = [
    {
      columnName: columnSetting2,
      func: (resetProps) =>
        ManagePricing(resetProps, setSelectionIds, setDeleteAlert),
    },
  ];

  //Filters Onchange
  const filterOnChange = (from, item, index) => {
    if (from === "clearAll") {
      setFilters(() => {
        let customers = filters.Customers.slice();
        customers?.map((item) => {
          item.value = false;
        });
        const newObj = {
          Customers: customers,
        };

        return newObj;
      });
    } else if (from === "Customers") {
      setFilters(() => {
        let customers = filters.Customers.slice();

        customers[index].value = !customers[index].value;

        const newObj = {
          Customers: customers,
        };

        return newObj;
      });
    }
  };

  // Search bar
  const onPricingSearch = () => {
    getPricingListing();
  };

  return (
    <div className="main-container pl-4">
      {/* Search Bar Start */}
      <div className="d-flex flex-row justify-between align-items-center mt-2 mb-2">
        <SearchBar
          disabled={false}
          onClear={() => setName("")}
          onSearch={() => onPricingSearch()}
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <div className="d-flex flex-row justify-between align-items-center">
          {/* Filters */}
          <ModalButton
            label={"Filter"}
            option1={
              filters?.Customers?.length > 0
                ? filters?.Customers?.some((item) => {
                    return item?.value === true;
                  })
                  ? true
                  : false
                : false
            }>
            <OptionModal
              options={filters}
              width={"w-48"}
              leftLabel="Filters"
              rightLabel="Clear All"
              onChange={filterOnChange}
            />
          </ModalButton>

          {/* Edit Columns */}
          <ModalButton
            option1={columnToShow.length < 5 ? true : false}
            label={"Edit Columns"}>
            <OptionModal
              options={editColumnDataHandlingFees}
              leftLabel="Columns"
              rightLabel="Reset All"
              onChange={onChangeEditColumn}
              columnToShow={columnToShow}
            />
          </ModalButton>
        </div>
      </div>

      {/* Pricing Delete Alert */}
      {deleteAlert && (
        // </div>
        <AlertMessage
          text="Pricing successfully deleted"
          textColor="red"
          severity="error"
        />
      )}

      {/* Search Bar End */}
      {loading ? (
        <Spinner />
      ) : (
        <PricingTable
          customer={true}
          rows={handlingFee?.length ? handlingFee : []}
          columns={columnToShow.length < 5 ? columnToShow : columns}
          tableColumnExtensions={tableColumnExtensionsRecurringStorage}
          dataProviders={dataProviders}
          selectionIds={selectionIds}
          setSelectionIds={setSelectionIds}
        />
      )}
    </div>
  );
};

export default HandlingFees;
