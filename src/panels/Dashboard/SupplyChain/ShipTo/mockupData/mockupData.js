// Columns Data For ShipTo Table
export const columnData = [
  { name: "id", title: "Sr#" },
  { name: "shipToName", title: "ShipTo Name" },
  { name: "city", title: "City" },
  { name: "state", title: "State" },
  { name: "customerName", title: "Customer Name" },
  { name: "primaryContact", title: "Primary Contact" },
  { name: "contactEmail", title: "Contact Email" },
  { name: "contactNumber", title: "Contact Number" },
  { name: "status", title: "Status" },
  { name: "manage", title: "Manage" },
];

// Table Extensions For ShipTo Table
export const tableColumnExtensions = [
  { columnName: "id", width: 65 },
  { columnName: "shipToName", width: 180 },
  { columnName: "city", sortingEnabled: false },
  { columnName: "state", sortingEnabled: false },
  { columnName: "customerName", width: 150, sortingEnabled: false },
  { columnName: "primaryContact", width: 200, sortingEnabled: false },
  { columnName: "contactEmail", width: 200, sortingEnabled: false },
  { columnName: "contactNumber", width: 200, sortingEnabled: false },
  // { columnName: "status", width: 120 },
  { columnName: "manage", width: 120, sortingEnabled: false },
];
// Edit Columns Data For ShipTo Table
export const editColumnData = [
  { name: "primaryContact", title: "Primary Contact" },
  { name: "status", title: "Status" },
];
