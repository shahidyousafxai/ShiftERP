/***************************************** Recurring Storage Starts***************************************/

// Column Data For Pricing Table
export const columnDataRecurringStorage = [
  { name: "id", title: "Sr#" },
  { name: "customerName", title: "Customer" },
  { name: "pricingName", title: "Pricing Name" },
  { name: "grace", title: "Grace Period" },
  { name: "aniversaryPeriod", title: "Anniversary Period" },
  { name: "price", title: "Price" },
  { name: "uom", title: "UOM" },
  { name: "manage", title: "Manage" },
];
//Table Extensions For Pricing Table
export const tableColumnExtensionsRecurringStorage = [
  { columnName: "id", width: 100, sortingEnabled: true },
  { columnName: "customerName", width: 280, sortingEnabled: true },
  { columnName: "pricingName", width: 280, sortingEnabled: true },
  { columnName: "grace", width: 160, sortingEnabled: false },
  { columnName: "aniversaryPeriod", width: 180, sortingEnabled: false },
  { columnName: "price", width: 100, sortingEnabled: false },
  { columnName: "uom", width: 160, sortingEnabled: false },
  { columnName: "manage", sortingEnabled: false },
];
//Edited Columns For RecurringStorage Table
export const editColumnDataRecurringStorage = [
  { name: "grace", title: "Grace Period" },
  { name: "uom", title: "UOM" },
  { name: "aniversaryPeriod", title: "Anniversary Period" },
];
// Dummy Rows For Recurring Storage Table
export const rowDataRecurringStorage = [
  {
    id: 1,
    uuid: "f1454f9a1d58411aa964c22ab608d675",
    customerName: "Gregory Brown II",
    pricingName: "Twila Barrows",
    uom: "PLT",
    grace: "30 day",
    price: "0.21",
    aniversaryPeriod: "7 day",
    price_per_unit: "0.21",
    completeItem: {
      uuid: "f1454f9a1d58411aa964c22ab608d675",
      name: "Twila Barrows",
      grace_period: "30",
      price: "0.21",
      price_per_unit: "0.21",
      aniversary_Period: "7",
      customer: {
        uuid: "166818b18aa542af8e6a32aac54732dd",
        name: "Gregory Brown II",
        code: "BSA411",
      },
      charge_type: {
        uuid: "5024b614691d40618181ec0046b763c9",
        name: "Recurring Storage",
      },
      unit: {
        uuid: "e0826191ba194ee3806e67588cf606e3",
        name: "PLT",
      },
      status: 1,
    },
  },
  {
    id: 2,
    uuid: "a1454f9a1d58411aa964c22ab608d672",
    customerName: "Cream Brown",
    pricingName: "Green Baking Cup",
    uom: "PLT",
    grace: "30 day",
    price_per_unit: "0.35",
    price: "0.21",
    aniversaryPeriod: "7 day",
    completeItem: {
      uuid: "a1454f9a1d58411aa964c22ab608d672",
      name: "Green Baking Cup",
      grace_period: "30",
      price: "0.21",
      price_per_unit: "0.35",
      aniversary_Period: "7",
      customer: {
        uuid: "326818b18aa542af8e6a32aac54732dd",
        name: "Cream Brown",
        code: "BSA413",
      },
      charge_type: {
        uuid: "5024b614691d40618181ec0046b763c9",
        name: "Recurring Storage",
      },
      unit: {
        uuid: "e0826191ba194ee3806e67588cf606e3",
        name: "PLT",
      },
      status: 1,
    },
  },
  {
    id: 3,
    uuid: "c1454f9a1d58411aa964c22ab608d699",
    customerName: "Cream Puff",
    pricingName: "Grams Bell",
    uom: "PLT",
    grace: "30 day",
    price: "0.21",
    price_per_unit: "0.35",
    aniversaryPeriod: "7 day",
    completeItem: {
      uuid: "c1454f9a1d58411aa964c22ab608d699",
      name: "Grams Bell",
      grace_period: "30",
      price: "0.21",
      price_per_unit: "0.35",
      aniversary_Period: "7",
      customer: {
        uuid: "12a818b18aa542af8e6a32aac54732dd",
        name: "Cream Puff",
        code: "BSA413",
      },
      charge_type: {
        uuid: "5024b614691d40618181ec0046b763c9",
        name: "Recurring Storage",
      },
      unit: {
        uuid: "e0826191ba194ee3806e67588cf606e3",
        name: "PLT",
      },
      status: 1,
    },
  },
  {
    id: 4,
    uuid: "d1454f9a1d58411aa964c22ab608d600",
    customerName: "John Doe",
    pricingName: "Newton",
    uom: "PLT",
    grace: "30 day",
    price: "0.21",
    price_per_unit: "4.15",
    aniversaryPeriod: "7 day",
    completeItem: {
      uuid: "d1454f9a1d58411aa964c22ab608d600",
      name: "Newton",
      grace_period: "30",
      price_per_unit: "4.15",
      price: "0.21",
      aniversary_Period: "7",
      customer: {
        uuid: "12a818b18aa542af8e6a32aac54732dd",
        name: "John Doe",
        code: "BSA413",
      },
      charge_type: {
        uuid: "5024b614691d40618181ec0046b763c9",
        name: "Recurring Storage",
      },
      unit: {
        uuid: "e0826191ba194ee3806e67588cf606e3",
        name: "PLT",
      },
      status: 1,
    },
  },
  {
    id: 5,
    uuid: "r1454f9a1d58411aa964c22ab608d644",
    customerName: "Ricky Horns",
    pricingName: "Grwin",
    uom: "PLT",
    grace: "30 day",
    price: "0.21",
    price_per_unit: "4.15",
    aniversaryPeriod: "7 day",
    completeItem: {
      uuid: "r1454f9a1d58411aa964c22ab608d644",
      name: "Grwin",
      grace_period: "30",
      price_per_unit: "4.15",
      price: "0.21",
      aniversary_Period: "7",
      customer: {
        uuid: "12a818b18aa542af8e6a32aac54732dd",
        name: "Ricky Horns",
        code: "BSA413",
      },
      charge_type: {
        uuid: "5024b614691d40618181ec0046b763c9",
        name: "Recurring Storage",
      },
      unit: {
        uuid: "e0826191ba194ee3806e67588cf606e3",
        name: "PLT",
      },
      status: 1,
    },
  },
];

/***************************************** Recurring Storage End***************************************/

/***************************************** Handling Fees Starts***************************************/

// Column Data For Handling Fee Table
export const columnDataHandlingFees = [
  { name: "id", title: "Sr#" },
  { name: "customerName", title: "Customer" },
  { name: "pricingName", title: "Pricing Name" },
  { name: "price", title: "Price" },
  { name: "manage", title: "Manage" },
];
//Table Extensions For Handling Fee Table
export const tableColumnExtensionsHandlingFees = [
  { columnName: "id", width: 100, sortingEnabled: true },
  { columnName: "customerName", width: 200, sortingEnabled: true },
  { columnName: "pricingName", width: 280, sortingEnabled: true },
  { columnName: "price", sortingEnabled: false },
  { columnName: "manage", sortingEnabled: false },
];
//Edited Columns For Handling Fee Table
export const editColumnDataHandlingFees = [{ name: "price", title: "Price" }];
// Dummy Rows For Handling Fee Table
export const rowDataHandlingFees = [
  {
    id: 1,
    uuid: "90824f9a1d58411aa964c22ab608d675",
    customerName: "Gregory Green 1",
    pricingName: "shawn Micheal",
    price: "$3",
    completeItem: {
      uuid: "90824f9a1d58411aa964c22ab608d675",
      name: "shawn Micheal",
      price: "3",
      customer: {
        uuid: "166818b18aa542af8e6a32aac54732dd",
        name: "Gregory Green 1",
        code: "BSA411",
      },
      charge_type: {
        uuid: "3224b614691d40618181ec0046b763c9",
        name: "Handling Fee",
      },
      status: 1,
    },
  },
  {
    id: 2,
    uuid: "a1454f9a1d58411aa964c22ab608d645",
    customerName: "Cream Red",
    pricingName: "Green Tea Cup",
    price: "$2",
    completeItem: {
      uuid: "a1454f9a1d58411aa964c22ab608d645",
      name: "Green Tea Cup",
      price: "2",
      customer: {
        uuid: "116818b18aa542af8e6a32aac54732dd",
        name: "Cream Red",
        code: "BSA413",
      },
      charge_type: {
        uuid: "3224b614691d40618181ec0046b763c9",
        name: "Handling Fee",
      },
      status: 1,
    },
  },
  {
    id: 3,
    uuid: "c1454f9a1d58411aa964c22ab608d6aa",
    customerName: "Cream Stock",
    pricingName: "KiloGrams Bells",
    price: "$3",
    completeItem: {
      uuid: "c1454f9a1d58411aa964c22ab608d6aa",
      name: "KiloGrams Bells",
      price: "3",
      customer: {
        uuid: "12a818b18aa542af8e6a32aac5473266",
        name: "Cream Stock",
        code: "BSA413",
      },
      charge_type: {
        uuid: "3224b614691d40618181ec0046b763c9",
        name: "Handling Fee",
      },
      status: 1,
    },
  },
  {
    id: 4,
    uuid: "d2454f9a1d58411aa964c22ab608d600",
    customerName: "John Doe",
    pricingName: "Newton",
    price: "$3",
    aniversaryPeriod: "7 day",
    completeItem: {
      uuid: "d2454f9a1d58411aa964c22ab608d600",
      name: "Newton",
      handlingPrice: "3",
      customer: {
        uuid: "12a818b18aa542af8e6a32aac54732dd",
        name: "John Doe",
        code: "BSA413",
      },
      charge_type: {
        uuid: "3224b614691d40618181ec0046b763c9",
        name: "Handling Fee",
      },
      status: 1,
    },
  },
  {
    id: 5,
    uuid: "aa454f9a1d58411aa964c22ab608d644",
    customerName: "Ricky Horns",
    pricingName: "Grwin",
    price: "$4",
    completeItem: {
      uuid: "aa454f9a1d58411aa964c22ab608d644",
      name: "Grwin",
      price: "4",
      customer: {
        uuid: "12a818b18aa542af8e6a32aac54732dd",
        name: "Ricky Horns",
        code: "BSA413",
      },
      charge_type: {
        uuid: "3224b614691d40618181ec0046b763c9",
        name: "Handling Fee",
      },
      status: 1,
    },
  },
];

/***************************************** Handling Fees Ends***************************************/
