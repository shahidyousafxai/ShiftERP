// Columns Name For Revenue/Expense
export const columnData = [
  { name: "id", title: "Sr#" },
  { name: "facility", title: "Facility/Company" },
  { name: "customer", title: "Customer" },
  { name: "revenueType", title: "Revenue Type" },
  { name: "revenueItem", title: "Revenue Item" },
  { name: "date", title: "Date" },
  { name: "amount", title: "Amount" },
  { name: "notes", title: "Notes / Identifier" },
  { name: "manage", title: "Manage" },
];
//Table Column Extensions For Revenue/Expense
export const tableColumnExtensions = [
  { columnName: "id", width: 80, sortingEnabled: true },
  { columnName: "facility", width: 160, sortingEnabled: false },
  { columnName: "customer", width: 160, sortingEnabled: false },
  { columnName: "revenueType", width: 160, sortingEnabled: false },
  { columnName: "revenueItem", width: 160, sortingEnabled: false },
  { columnName: "date", width: 140, sortingEnabled: false },
  { columnName: "amount", sortingEnabled: true },
  { columnName: "notes", width: 200, sortingEnabled: false },
  { columnName: "manage", sortingEnabled: false },
];
//Edit Columns Data For Revenue/Expense
export const editColumnData = [
  { name: "notes", title: "Notes / Identifier" },
  { name: "amount", title: "Amount" },
];
