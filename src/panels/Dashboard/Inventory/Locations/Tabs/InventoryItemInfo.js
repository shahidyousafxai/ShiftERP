import React, { useState } from "react";
import { SearchBar, Table as InventoryItemTable } from "../../../../../shared";
import {
  columnDataInventoryItem,
  tableColumnExtensionsInventoryItem,
} from "../mockupData/mockupData";

const InventoryItemInfo = ({ location }) => {
  const inventoryItem = location?.inventories?.map((item, index) => {
    const obj = {
      id: index + 1,
      uuid: item.uuid,
      customerName: item?.customer?.name,
      productName: item?.product?.name,
      productAmount: `$${item.product_amount}`,
    };
    return obj;
  });

  //All useStates
  const [columns] = useState(columnDataInventoryItem);
  const [name, setName] = useState("");
  const [columnToShow, setColumnToShow] = useState(columnDataInventoryItem);
  const [rows, setRows] = useState(inventoryItem);
  const [selectionIds, setSelectionIds] = useState([]);
  const [searchedUsers, setSearchedUsers] = useState([]);

  // Search bar
  const onInventoryItemSearch = () => {
    let serachArray = [];

    serachArray = rows?.filter((item) =>
      item.productName.toLowerCase().includes(name.toLowerCase())
    );
    setSearchedUsers([...serachArray]);
  };

  return (
    <div className="main-container pl-4 h-[80vh]">
      {/* Search Bar Start */}
      <div className="d-flex flex-row justify-between align-items-center mt-2 mb-2">
        <SearchBar
          disabled={false}
          onClear={() => {
            setName("");
            setSearchedUsers([]);
          }}
          onSearch={onInventoryItemSearch}
          onChange={(e) => {
            setName(e.target.value);
            if (!e.target.value) {
              setSearchedUsers([]);
            }
          }}
          value={name}
        />
      </div>

      <InventoryItemTable
        customer={true}
        rows={searchedUsers.length > 0 ? searchedUsers : rows}
        columns={columnToShow.length < 7 ? columnToShow : columns}
        tableColumnExtensions={tableColumnExtensionsInventoryItem}
        selectionIds={selectionIds}
        setSelectionIds={setSelectionIds}
        multiSelection={true}
      />
    </div>
  );
};

export default InventoryItemInfo;
