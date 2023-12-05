// Library Imports
import React, { useEffect, useState } from "react";
// Local Imports
import {
  SearchBar,
  Spinner,
  Table as ReadyToCloseTable,
  ModalButton,
  OptionModal,
} from "../../../../../shared";
import {
  columnData,
  rowDataReadyToClose,
  tableColumnExtensionsForReadyToClose as tableColumnExtensions,
  editColumnDataReacyToCloseTable as editColumnData,
} from "../mockupData/mockupData";
import { ManageReadyToClose } from "../Components/utils";

const ReadyToClose = () => {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [selectionIds, setSelectionIds] = useState([]);
  const [columns] = useState(columnData);
  const [columnToShow, setColumnToShow] = useState(columnData);

  const [columnSetting] = useState(["manage"]);

  //Data Providers
  const dataProviders = [
    {
      columnName: columnSetting,
      func: (resetProps) => ManageReadyToClose(resetProps, setLoading),
    },
  ];

  //onChange Edit Columns
  const onChangeEditColumn = (item) => {
    if (item === "clearAll") {
      setColumnToShow(columnData);
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

  //useEffect for Removing Delete Alert
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [loading]);

  return (
    <div className="main-container pl-4 ">
      <div className="d-flex flex-row justify-between align-items-center mt-[12px] mb-2">
        <SearchBar
          disabled={false}
          onClear={() => setName("")}
          // onSearch={() => onProductsNotReceivedSearch()}
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <div className="d-flex flex-row justify-between align-items-center">
          {/* Filters */}
          <ModalButton
            label={"Filter"}
            // option1={filters.Status[0].value || filters.Status[1].value}
          >
            {/* <OptionModal
                options={filters}
              width={"w-48"}
              leftLabel="Filters"
              rightLabel="Clear All"
                onChange={filterOnChange}
            /> */}
          </ModalButton>

          {/* Edit Columns */}
          <ModalButton
            option1={columnToShow.length < 11 ? true : false}
            label={"Edit Columns"}>
            <OptionModal
              options={editColumnData}
              leftLabel="Columns"
              rightLabel="Reset All"
              onChange={onChangeEditColumn}
              columnToShow={columnToShow}
            />
          </ModalButton>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <Spinner />
      ) : (
        <ReadyToCloseTable
          customer={true}
          rows={rowDataReadyToClose}
          columns={columnToShow.length < 11 ? columnToShow : columns}
          tableColumnExtensions={tableColumnExtensions}
          dataProviders={dataProviders}
          selectionIds={selectionIds}
          setSelectionIds={setSelectionIds}
        />
      )}
    </div>
  );
};

export default ReadyToClose;
