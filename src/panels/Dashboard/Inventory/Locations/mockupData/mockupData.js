/***************************** Location Table Starts *************************************/

//Column Data For Locations Table
export const columnData = [
  { name: "location", title: "Location" },
  { name: "tall", title: "Tall Location" },
  { name: "remotePick", title: "Remote Pick" },
  { name: "allergenPick", title: "Allergen Pick" },
  { name: "capacity", title: "Capacity" },
  { name: "barcode", title: "Barcode" },
  { name: "active", title: "Status" },
  { name: "manage", title: "Manage" },
];
//Table Extensions For Locations Table

export const tableColumnExtensions = [
  { columnName: "location", sortingEnabled: true },
  { columnName: "tall", width: "150", sortingEnabled: false },
  { columnName: "remotePick", width: "150", sortingEnabled: false },
  { columnName: "allergenPick", width: "150", sortingEnabled: false },
  { columnName: "capacity", sortingEnabled: true },
  { columnName: "barcode", sortingEnabled: false },
  { columnName: "active", sortingEnabled: false },
  { columnName: "manage", sortingEnabled: false },
];

// Edit Columns For Locations Table

export const editColumnData = [
  { name: "capacity", title: "Capacity" },
  { name: "barcode", title: "Barcode" },
  { name: "active", title: "Status" },
];
/*****************************Location Table Ends *************************************/

/***************************** Inventory Item Table Starts *************************************/
//Column Data For Inventory Item Table
export const columnDataInventoryItem = [
  { name: "id", title: "Sr#" },
  { name: "productName", title: "Product" },
  { name: "customerName", title: "Customer Name" },
  { name: "productAmount", title: "Product Amount" },
];
//Table Extensions For Inventory Item Table
export const tableColumnExtensionsInventoryItem = [
  { name: "id", sortingEnabled: true },
  { name: "productName", sortingEnabled: true },
  { name: "customerName", sortingEnabled: true },
  { name: "productAmount", sortingEnabled: true },
];
// Dummy Rows For Recurring Storage Table
export const rowDataInventoryItem = [
  {
    id: 1,
    uuid: "f1454f9a1d58411aa964c22ab608d675",
    customerName: "Gregory Brown II",
    productName: "Twila Barrows",
    productAmount: "$0.21",
  },
  {
    id: 2,
    uuid: "a1454f9a1d58411aa964c22ab608d672",
    customerName: "Cream Brown",
    productName: "Green Baking Cup",
    productAmount: "$0.35",
  },
  {
    id: 3,
    uuid: "c1454f9a1d58411aa964c22ab608d699",
    customerName: "Cream Puff",
    productName: "Grams Bell",
    productAmount: "$0.35",
  },
  {
    id: 4,
    uuid: "d1454f9a1d58411aa964c22ab608d600",
    customerName: "John Doe",
    productName: "Newton",
    productAmount: "$4.15",
  },
  {
    id: 5,
    uuid: "r1454f9a1d58411aa964c22ab608d644",
    customerName: "Ricky Horns",
    productName: "Grwin",
    productAmount: "$4.15",
  },
];
/***************************** Inventory Item Table End *************************************/
