// Library Imports
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

//Local Imports
import {
  BreadCrumb,
  ModalButton,
  OptionModal,
  SearchBar,
  Table as InventoryStockTable,
} from "../../../../shared";
import {
  columnData,
  tableColumnExtensions,
  editColumnData,
  rowData,
} from "./mockupData/mockupData";
import { ManageStocks, Name } from "./Components/utils";

const Stocks = () => {
  const user = useSelector((state) => state);
  const [selectionIds, setSelectionIds] = useState([]);
  const [columnToShow, setColumnToShow] = useState(columnData);
  const [name, setName] = useState("");
  const [filters, setFilters] = useState({
    Customers: [],
    Locations: [],
  });
  const [columns] = useState(columnData);
  const [ColumnSetting1] = useState(["manage"]);
  const [ColumnSetting2] = useState(["customer"]);

  useEffect(() => {
    // Set Filters Data
    const customersData = user?.customer?.customers?.map((item) => {
      return {
        title: item.name,
        value: false,
      };
    });

    const locationsData = user?.location?.locations?.map((item) => {
      return {
        title: item.location,
        value: false,
      };
    });

    const updatedFilters = {
      ...filters,
      Customers: customersData,
      Locations: locationsData,
    };

    setFilters(updatedFilters);
  }, [user?.customer?.customers, user?.location?.locations]);

  const onProductSearch = () => {
    if (name !== "") {
      console.log("Search...");
    }
  };

  // Handle OnChange Edit Columns
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

  // Data Providers For Table
  const dataProviders = [
    {
      columnName: ColumnSetting1,
      func: (restProps) => ManageStocks(restProps),
    },
    {
      columnName: ColumnSetting2,
      func: (restProps) => Name(restProps, "", ""),
    },
  ];

  // Handle OnChange Setting
  const filterOnChange = (from, item, index) => {
    if (from === "clearAll") {
      setFilters(() => {
        let customers = filters.Customers.slice();
        let locations = filters.Locations.slice();
        customers?.map((item) => {
          item.value = false;
        });

        locations?.map((item) => {
          item.value = false;
        });
        const newObj = {
          Customers: customers,
          Locations: locations,
        };
        return newObj;
      });
    } else if (from === "Customers") {
      setFilters(() => {
        let customers = filters.Customers.slice();
        let locations = filters.Locations;

        customers[index].value = !customers[index]?.value;

        const newObj = {
          Customers: customers,
          Locations: locations,
        };
        return newObj;
      });
    } else if (from === "Locations") {
      setFilters(() => {
        let customers = filters.Customers;
        let locations = filters.Locations.slice();

        locations[index].value = !locations[index]?.value;

        const newObj = {
          Customers: customers,
          Locations: locations,
        };
        return newObj;
      });
    }
  };

  return (
    <div className="main-container pl-4">
      {/* BreaddCrumbs & Add Customer Button */}
      <div className="flex justify-between items-center py-3">
        <div>
          <BreadCrumb
            routes={[
              { name: "Inventory", route: "/inventory/products", color: true },
              { name: "Stocks" },
            ]}
          />
          <div className="text-[15px] font-bold">Stocks</div>
        </div>
      </div>

      {/* Search Bar with Buttons */}
      <div className="d-flex flex-row justify-between align-items-center mt-2 mb-2">
        <SearchBar
          disabled={selectionIds.length > 0 ? true : false}
          onClear={() => setName("")}
          onSearch={() => onProductSearch()}
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <div className="d-flex flex-row justify-between align-items-center">
          {/* Filters */}
          <ModalButton
            option1={
              filters?.Customers?.length > 0
                ? filters?.Customers?.some((item) => {
                    return item?.value === true;
                  })
                  ? true
                  : false
                : false
            }
            option2={
              filters?.Locations?.length > 0
                ? filters?.Locations?.some((item) => {
                    return item?.value === true;
                  })
                  ? true
                  : false
                : false
            }
            label={"Filter"}>
            <OptionModal
              options={filters}
              setOptions={setFilters}
              leftLabel="Filters"
              rightLabel="Clear All"
              onChange={filterOnChange}
            />
          </ModalButton>

          {/* Edit Columns */}
          {console.log(columnToShow.length)}
          <ModalButton
            option1={columnToShow.length < 7 ? true : false}
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

      {/* {loading ? (
                <Spinner />
            ) : ( */}
      <InventoryStockTable
        rows={rowData}
        columns={columnToShow.length < 7 ? columnToShow : columns}
        customer={true}
        tableColumnExtensions={tableColumnExtensions}
        dataProviders={dataProviders}
        selectionIds={selectionIds}
        setSelectionIds={setSelectionIds}
      />
      {/* )} */}
    </div>
  );
};

export default Stocks;
