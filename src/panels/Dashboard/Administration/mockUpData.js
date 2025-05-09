//********************* Column Data And Table Column Extensions for Administration => User Module *********************//

// All Column Names
export const columnDataUserList = [
  { name: "id", title: "Sr#" },
  { name: "full_name", title: "User Name" },
  { name: "role", title: "User Role" },
  { name: "email", title: "Email" },
  { name: "phone", title: "Contact Number" },
  { name: "facilities", title: "Facilities" },
  { name: "status", title: "Active" },
  { name: "manage", title: "Manage" },
];
//All Table Extensions
export const tableColumnExtensionsUsers = [
  { columnName: "id", width: 70, sortingEnabled: true },
  { columnName: "fname", width: 200, sortingEnabled: true },
  { columnName: "role", width: 200, sortingEnabled: false },
  { columnName: "email", width: 200, sortingEnabled: false },
  { columnName: "phone", width: 150, sortingEnabled: false },
  { columnName: "facilities", width: 150, sortingEnabled: false },
  { columnName: "status", width: 150, sortingEnabled: false },
  { columnName: "manage", width: 100, sortingEnabled: false },
];

//Column Data And Table Column Extensions for Facilities Module
export const facilityColumnData = [
  { name: "id", title: "ID" },
  { name: "name", title: "Facility Name" },
  { name: "address", title: "Address" },
  { name: "city", title: "City" },
  { name: "state", title: "State" },
  { name: "zip", title: "Zip" },
  { name: "phone", title: "Primary Contact" },
  { name: "office_phone", title: "Office Phone" },
  { name: "status", title: "Active" },
  { name: "manage", title: "Manage" },
];

//****************** Column Data And Table Column Extensions for Administration => Facilities Module ******************//
// All Column Names
export const facilitiesColumnData = [
  { name: "id", title: "Sr#" },
  { name: "name", title: "Facility Name" },
  { name: "created_at", title: "Date of Creation" },
  { name: "address", title: "Address" },
  { name: "city", title: "City" },
  { name: "state", title: "State" },
  { name: "zip", title: "Zip" },
  { name: "primary_contact", title: "Primary Contact" },
  { name: "office_phone", title: "Office Phone" },
  { name: "status", title: "Active" },
  { name: "manage", title: "Manage" },
];

export const tableColumnExtensionsFacilities = [
  { columnName: "id", width: 70, sortingEnabled: true },
  { columnName: "name", width: 200, sortingEnabled: true },
  { columnName: "created_at", width: 200, sortingEnabled: false },
  { columnName: "address", width: 200, sortingEnabled: false },
  { columnName: "primary_contact", width: 150, sortingEnabled: false },
  { columnName: "office_phone", width: 180, sortingEnabled: false },
  { columnName: "manage", width: 100, sortingEnabled: false },
];

//****************Column Data And Table Column Extensions for Facilities Table In Administration => Add New User => Tabs****************//
// All Column Names
export const facilityColumnDataTab = [
  { name: "id", title: "ID" },
  { name: "name", title: "Facility Name" },
  { name: "created_at", title: "Date of Creation" },
  { name: "address", title: "Address" },
  { name: "city", title: "City" },
  { name: "state", title: "State" },
  { name: "zipCode", title: "Zip" },
  { name: "primaryContact", title: "Primary Contact" },
  { name: "officePhone", title: "Office Phone" },
  { name: "manage", title: "Manage" },
];
//All Table Extensions
export const tableColumnExtensionsFacilityTab = [
  { columnName: "id", width: 80, sortingEnabled: true },
  { columnName: "name", width: 150, sortingEnabled: true },
  { columnName: "created_at", width: 150, sortingEnabled: false },
  { columnName: "address", width: 180, sortingEnabled: false },
  { columnName: "city", sortingEnabled: false },
  { columnName: "state", sortingEnabled: false },
  { columnName: "zipCode", sortingEnabled: false },
  { columnName: "primaryContact", width: 180, sortingEnabled: false },
  { columnName: "officePhone", width: 180, sortingEnabled: false },
  { columnName: "manage", sortingEnabled: false },
];

export const rowData = [
  {
    uuid: 1,
    id: 1,
    fname: "Harry",
    roles: "Facility User",
    phone: "+91-252565",
    facilities: [{ id: "Dry Plant", name: "Frozen Plant" }],
    email: "lorem@gmail.com",
    status: true,
    manage: "true",
  },
  {
    uuid: 2,
    id: 2,
    fname: "Harry",
    roles: "Facility User",
    phone: "+91-252565",
    facilities: [{ id: "Dry Plant", name: "Frozen Plant" }],
    email: "lorem@gmail.com",
    status: false,
    manage: "true",
  },
  {
    uuid: 3,
    id: 3,
    fname: "Harry",
    roles: "Facility User",
    phone: "+91-252565",
    facilities: [{ id: "Dry Plant", name: "Frozen Plant" }],
    email: "lorem@gmail.com",
    status: true,
    manage: "true",
  },
  {
    uuid: 4,
    id: 4,
    fname: "Harry",
    roles: "Facility User",
    phone: "+91-252565",
    facilities: [{ id: "Dry Plant", name: "Frozen Plant" }],
    email: "lorem@gmail.com",
    status: true,
    manage: "true",
  },
  {
    uuid: 5,
    id: 5,
    fname: "Harry",
    roles: "Facility User",
    phone: "+91-252565",
    facilities: [{ id: "Dry Plant", name: "Frozen Plant" }],
    email: "lorem@gmail.com",
    status: false,
    manage: "true",
  },
  {
    uuid: 6,
    id: 6,
    fname: "Harry",
    roles: "Facility User",
    phone: "+91-252565",
    facilities: [{ id: "Dry Plant", name: "Frozen Plant" }],
    email: "lorem@gmail.com",
    status: true,
    manage: "true",
  },
  {
    uuid: 7,
    id: 7,
    fname: "Harry",
    roles: "Facility User",
    phone: "+91-252565",
    facilities: [{ id: "Dry Plant", name: "Frozen Plant" }],
    email: "lorem@gmail.com",
    status: true,
    manage: "true",
  },
  {
    uuid: 8,
    id: 8,
    fname: "Harry",
    roles: "Facility User",
    phone: "+91-252565",
    facilities: [{ id: "Dry Plant", name: "Frozen Plant" }],
    email: "lorem@gmail.com",
    status: false,
    manage: "true",
  },
  {
    uuid: 9,
    id: 9,
    fname: "Harry",
    roles: "Facility User",
    phone: "+91-252565",
    facilities: [{ id: "Dry Plant", name: "Frozen Plant" }],
    email: "lorem@gmail.com",
    status: true,
    manage: "true",
  },
  {
    uuid: 10,
    id: 10,
    fname: "Harry",
    roles: "Facility User",
    phone: "+91-252565",
    facilities: [{ id: "Dry Plant", name: "Frozen Plant" }],
    email: "lorem@gmail.com",
    status: false,
    manage: "true",
  },
  {
    uuid: 11,
    id: 11,
    fname: "Harry",
    roles: "Facility User",
    phone: "+91-252565",
    facilities: [{ id: "Dry Plant", name: "Frozen Plant" }],
    email: "lorem@gmail.com",
    status: true,
    manage: "true",
  },
  {
    uuid: 12,
    id: 12,
    fname: "Harry",
    roles: "Facility User",
    phone: "+91-252565",
    facilities: [{ id: "Dry Plant", name: "Frozen Plant" }],
    email: "lorem@gmail.com",
    status: true,
    manage: "true",
  },
  {
    uuid: 13,
    id: 13,
    fname: "Harry",
    roles: "Facility User",
    phone: "+91-252565",
    facilities: [{ id: "Dry Plant", name: "Frozen Plant" }],
    email: "lorem@gmail.com",
    status: true,
    manage: "true",
  },
  {
    uuid: 14,
    id: 14,
    fname: "Harry",
    roles: "Facility User",
    phone: "+91-252565",
    facilities: [{ id: "Dry Plant", name: "Frozen Plant" }],
    email: "lorem@gmail.com",
    status: false,
    manage: "true",
  },
  {
    uuid: 15,
    id: 15,
    fname: "Harry",
    roles: "Facility User",
    phone: "+91-252565",
    facilities: [{ id: "Dry Plant", name: "Frozen Plant" }],
    email: "lorem@gmail.com",
    status: true,
    manage: "true",
  },
  {
    uuid: 16,
    id: 16,
    fname: "Harry",
    roles: "Facility User",
    phone: "+91-252565",
    facilities: [{ id: "Dry Plant", name: "Frozen Plant" }],
    email: "lorem@gmail.com",
    status: true,
    manage: "true",
  },
  {
    uuid: 17,
    id: 17,
    fname: "Harry",
    roles: "Facility User",
    phone: "+91-252565",
    facilities: [{ id: "Dry Plant", name: "Frozen Plant" }],
    email: "lorem@gmail.com",
    status: false,
    manage: "true",
  },
  {
    uuid: 18,
    id: 18,
    fname: "Harry",
    roles: "Facility User",
    phone: "+91-252565",
    facilities: [{ id: "Dry Plant", name: "Frozen Plant" }],
    email: "lorem@gmail.com",
    status: true,
    manage: "true",
  },
  {
    uuid: 19,
    id: 19,
    fname: "Harry",
    roles: "Facility User",
    phone: "+91-252565",
    facilities: [{ id: "Dry Plant", name: "Frozen Plant" }],
    email: "lorem@gmail.com",
    status: true,
    manage: "true",
  },
  {
    uuid: 20,
    id: 20,
    fname: "Harry",
    roles: "Facility User",
    phone: "+91-252565",
    facilities: [{ id: "Dry Plant", name: "Frozen Plant" }],
    email: "lorem@gmail.com",
    status: false,
    manage: "true",
  },
  {
    uuid: 21,
    id: 21,
    fname: "Harry",
    roles: "Facility User",
    phone: "+91-252565",
    facilities: [{ id: "Dry Plant", name: "Frozen Plant" }],
    email: "lorem@gmail.com",
    status: true,
    manage: "true",
  },
  {
    uuid: 22,
    id: 22,
    fname: "Harry",
    roles: "Facility User",
    phone: "+91-252565",
    facilities: [{ id: "Dry Plant", name: "Frozen Plant" }],
    email: "lorem@gmail.com",
    status: false,
    manage: "true",
  },
  {
    uuid: 23,
    id: 23,
    fname: "Harry",
    roles: "Facility User",
    phone: "+91-252565",
    facilities: [{ id: "Dry Plant", name: "Frozen Plant" }],
    email: "lorem@gmail.com",
    status: true,
    manage: "true",
  },
  {
    uuid: 24,
    id: 24,
    fname: "Harry",
    roles: "Facility User",
    phone: "+91-252565",
    facilities: [{ id: "Dry Plant", name: "Frozen Plant" }],
    email: "lorem@gmail.com",
    status: true,
    manage: "true",
  },
];

export const facilityRowData = [
  {
    id: 54412,
    fname: "Harry",
    doc: "1/05/21",
    address: "1184 Ocwar Pass",
    city: "Baton Rogue",
    state: "Lousiana",
    zip: "70815",
    phone: "Mavis Doug",
    office_phone: "+91-252565",
    manage: "true",
  },
  {
    id: 2,
    fname: "Harry",
    doc: "1/05/21",
    address: "1184 Ocwar Pass",
    city: "Baton Rogue",
    state: "Lousiana",
    zip: "70815",
    phone: "Mavis Doug",
    office_phone: "+91-252565",
    manage: "true",
  },
  {
    id: 3,
    fname: "Harry",
    doc: "1/05/21",
    address: "1184 Ocwar Pass",
    city: "Baton Rogue",
    state: "Lousiana",
    zip: "70815",
    phone: "Mavis Doug",
    office_phone: "+91-252565",
    manage: "true",
  },
  {
    id: 4,
    fname: "Harry",
    doc: "1/05/21",
    address: "1184 Ocwar Pass",
    city: "Baton Rogue",
    state: "Lousiana",
    zip: "70815",
    phone: "Mavis Doug",
    office_phone: "+91-252565",
    manage: "true",
  },
  {
    id: 5,
    fname: "Harry",
    doc: "1/05/21",
    address: "1184 Ocwar Pass",
    city: "Baton Rogue",
    state: "Lousiana",
    zip: "70815",
    phone: "Mavis Doug",
    office_phone: "+91-252565",
    manage: "true",
  },
  {
    id: 6,
    fname: "Harry",
    doc: "1/05/21",
    address: "1184 Ocwar Pass",
    city: "Baton Rogue",
    state: "Lousiana",
    zip: "70815",
    phone: "Mavis Doug",
    office_phone: "+91-252565",
    manage: "true",
  },
  {
    id: 7,
    fname: "Harry",
    doc: "1/05/21",
    address: "1184 Ocwar Pass",
    city: "Baton Rogue",
    state: "Lousiana",
    zip: "70815",
    phone: "Mavis Doug",
    office_phone: "+91-252565",
    manage: "true",
  },
  {
    id: 8,
    fname: "Harry",
    doc: "1/05/21",
    address: "1184 Ocwar Pass",
    city: "Baton Rogue",
    state: "Lousiana",
    zip: "70815",
    phone: "Mavis Doug",
    office_phone: "+91-252565",
    manage: "true",
  },
  {
    id: 9,
    fname: "Harry",
    doc: "1/05/21",
    address: "1184 Ocwar Pass",
    city: "Baton Rogue",
    state: "Lousiana",
    zip: "70815",
    phone: "Mavis Doug",
    office_phone: "+91-252565",
    manage: "true",
  },
  {
    id: 10,
    fname: "Harry",
    doc: "1/05/21",
    address: "1184 Ocwar Pass",
    city: "Baton Rogue",
    state: "Lousiana",
    zip: "70815",
    phone: "Mavis Doug",
    office_phone: "+91-252565",
    manage: "true",
  },
  {
    id: 11,
    fname: "Harry",
    doc: "1/05/21",
    address: "1184 Ocwar Pass",
    city: "Baton Rogue",
    state: "Lousiana",
    zip: "70815",
    phone: "Mavis Doug",
    office_phone: "+91-252565",
    manage: "true",
  },
  {
    id: 12,
    fname: "Harry",
    doc: "1/05/21",
    address: "1184 Ocwar Pass",
    city: "Baton Rogue",
    state: "Lousiana",
    zip: "70815",
    phone: "Mavis Doug",
    office_phone: "+91-252565",
    manage: "true",
  },
  {
    id: 13,
    fname: "Harry",
    doc: "1/05/21",
    address: "1184 Ocwar Pass",
    city: "Baton Rogue",
    state: "Lousiana",
    zip: "70815",
    phone: "Mavis Doug",
    office_phone: "+91-252565",
    manage: "true",
  },
  {
    id: 14,
    fname: "Harry",
    doc: "1/05/21",
    address: "1184 Ocwar Pass",
    city: "Baton Rogue",
    state: "Lousiana",
    zip: "70815",
    phone: "Mavis Doug",
    office_phone: "+91-252565",
    manage: "true",
  },
  {
    id: 15,
    fname: "Harry",
    doc: "1/05/21",
    address: "1184 Ocwar Pass",
    city: "Baton Rogue",
    state: "Lousiana",
    zip: "70815",
    phone: "Mavis Doug",
    office_phone: "+91-252565",
    manage: "true",
  },
  {
    id: 16,
    fname: "Harry",
    doc: "1/05/21",
    address: "1184 Ocwar Pass",
    city: "Baton Rogue",
    state: "Lousiana",
    zip: "70815",
    phone: "Mavis Doug",
    office_phone: "+91-252565",
    manage: "true",
  },
  {
    id: 17,
    fname: "Harry",
    doc: "1/05/21",
    address: "1184 Ocwar Pass",
    city: "Baton Rogue",
    state: "Lousiana",
    zip: "70815",
    phone: "Mavis Doug",
    office_phone: "+91-252565",
    manage: "true",
  },
  {
    id: 18,
    fname: "Harry",
    doc: "1/05/21",
    address: "1184 Ocwar Pass",
    city: "Baton Rogue",
    state: "Lousiana",
    zip: "70815",
    phone: "Mavis Doug",
    office_phone: "+91-252565",
    manage: "true",
  },
  {
    id: 19,
    fname: "Harry",
    doc: "1/05/21",
    address: "1184 Ocwar Pass",
    city: "Baton Rogue",
    state: "Lousiana",
    zip: "70815",
    phone: "Mavis Doug",
    office_phone: "+91-252565",
    manage: "true",
  },
  {
    id: 20,
    fname: "Harry",
    doc: "1/05/21",
    address: "1184 Ocwar Pass",
    city: "Baton Rogue",
    state: "Lousiana",
    zip: "70815",
    phone: "Mavis Doug",
    office_phone: "+91-252565",
    manage: "true",
  },
  {
    id: 21,
    fname: "Harry",
    doc: "1/05/21",
    address: "1184 Ocwar Pass",
    city: "Baton Rogue",
    state: "Lousiana",
    zip: "70815",
    phone: "Mavis Doug",
    office_phone: "+91-252565",
    manage: "true",
  },
  {
    id: 22,
    fname: "Harry",
    doc: "1/05/21",
    address: "1184 Ocwar Pass",
    city: "Baton Rogue",
    state: "Lousiana",
    zip: "70815",
    phone: "Mavis Doug",
    office_phone: "+91-252565",
    manage: "true",
  },
  {
    id: 23,
    fname: "Harry",
    doc: "1/05/21",
    address: "1184 Ocwar Pass",
    city: "Baton Rogue",
    state: "Lousiana",
    zip: "70815",
    phone: "Mavis Doug",
    office_phone: "+91-252565",
    manage: "true",
  },
  {
    id: 24,
    fname: "Harry",
    doc: "1/05/21",
    address: "1184 Ocwar Pass",
    city: "Baton Rogue",
    state: "Lousiana",
    zip: "70815",
    phone: "Mavis Doug",
    office_phone: "+91-252565",
    manage: "true",
  },
];
