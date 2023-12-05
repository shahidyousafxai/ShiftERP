// Column Data For Vendors Table
export const columnData = [
  { name: "id", title: "Sr#" },
  { name: "companyName", title: "Company Name" },
  { name: "address", title: "Address" },
  { name: "primaryContact", title: "Primary Contact" },
  { name: "contactEmail", title: "Contact Email" },
  { name: "contactNumber", title: "Contact Number" },
  { name: "status", title: "Status" },
  { name: "manage", title: "Manage" },
];

// Edit Columns For Vendors Table
export const editColumnData = [
  { name: "contactEmail", title: "Contact Email" },
  { name: "contactNumber", title: "Contact Number" },
  { name: "status", title: "Status" },
];
// Table Extensions For Vendors Table
export const tableColumnExtensions = [
  { columnName: "id", sortingEnabled: true },
  { columnName: "companyName", sortingEnabled: true },
  { columnName: "address", sortingEnabled: true },
  { columnName: "primaryContact", sortingEnabled: true },
  { columnName: "contactEmail", sortingEnabled: true },
  { columnName: "contactNumber", sortingEnabled: false },
  { columnName: "status", sortingEnabled: true },
  { columnName: "manage", sortingEnabled: false },
];
