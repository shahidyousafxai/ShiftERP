// Column Data For Production Extra Table
export const columnData = [
  { name: "id", title: "ID" },
  { name: "extraName", title: "Extra Name" },
  { name: "amount", title: "Amount" },
  { name: "uom", title: "UOM" },
  { name: "dm", title: "DM" },
  { name: "status", title: "Status" },
  { name: "manage", title: "Manage" },
];
//Table Extensions For Production Extra Table
export const tableColumnExtensions = [
  { columnName: "id", width: 100, sortingEnabled: true },
  { columnName: "extraName", width: 200, sortingEnabled: true },
  { columnName: "amount", sortingEnabled: false },
  { columnName: "uom", sortingEnabled: false },
  { columnName: "dm", sortingEnabled: false },
  { columnName: "status", sortingEnabled: true },
  { columnName: "manage", sortingEnabled: false },
];
// Edit Column Data For Production Extra Table
export const editColumnData = [
  { name: "uom", title: "UOM" },
  { name: "amount", title: "Amount" },
];
