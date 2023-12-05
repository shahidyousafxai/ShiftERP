import React from "react";
import { iconStyling1, iconStyling2 } from "../helpers/GlobalVariables";
import { Navigate, Outlet } from "react-router-dom";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import DonutLargeRoundedIcon from "@mui/icons-material/DonutLargeRounded";
import BuildRoundedIcon from "@mui/icons-material/BuildRounded";
import ProfileSettings from "../panels/Dashboard/ProfileSettings/ProfileSettings.js";
import Carriers from "../panels/Dashboard/SupplyChain/Carriers/index.js";
import Users from "../panels/Dashboard/Administration/Users";
import Facilities from "../panels/Dashboard/Administration/Facilities";
import Customers from "../panels/Dashboard/Customer";
import Products from "../panels/Dashboard/Inventory/Product";
import Integrations from "../panels/Dashboard/Administration/Integrations";
import ManageAccounts from "../panels/ManageAccounts/index";
import Login from "../panels/Auth/Login/Login";
import Dashboard from "../panels/Dashboard/Dashboard/Dashboard";
import Layout from "../panels/Dashboard/Layout/Layout";
import ForgotPassword from "../panels/Auth/Login/ForgotPassword";
import TwoFactorAuthentication from "../panels/Auth/Login/TwoFactorAuthentication";
import SuccessfulRequestSent from "../panels/Auth/Login/SuccessfulRequestSent";
import CreateNewPassword from "../panels/Auth/Login/CreateNewPassword";
import LoginSuccessful from "../panels/Auth/Login/LoginSuccessful";
import AddNewUser from "../panels/Dashboard/Administration/AddNewUser";
import AddNewCustomer from "../panels/Dashboard/Customer/AddNewCustomer";
import AddNewFacility from "../panels/Dashboard/Administration/AddNewFacility";
import EditFacility from "../panels/Dashboard/ProfileSettings/Facilities/EditFacility";
import AddNewProduct from "../panels/Dashboard/Inventory/Product/Components/AddNewProduct";
import AddNewAccount from "../panels/ManageAccounts/Components/AddNewAccount";
import ManageSubscription from "../panels/Dashboard/ManageSubscription/ManageSubscription";
import Kits from "../panels/Dashboard/Inventory/Kits";
import AddKits from "../panels/Dashboard/Inventory/Kits/AddKit";
import Locations from "../panels/Dashboard/Inventory/Locations";
import AddNewLocation from "../panels/Dashboard/Inventory/Locations/AddNewLocation";
import AddNewCarrier from "../panels/Dashboard/SupplyChain/Carriers/AddNewCarrier";
import Vendors from "../panels/Dashboard/SupplyChain/Vendors";
import AddNewVendor from "../panels/Dashboard/SupplyChain/Vendors/AddNewVendor";
import ShipTo from "../panels/Dashboard/SupplyChain/ShipTo/Index";
import AddNewShipTo from "../panels/Dashboard/SupplyChain/ShipTo/AddNewShipTo";
import NeedsReport from "../panels/Dashboard/SupplyChain/NeedsReport";
import AddNewNeedsReport from "../panels/Dashboard/SupplyChain/NeedsReport/AddNewNeedsReport";
import SmartSchedule from "../panels/Dashboard/SmartSchedule";
import AddNewProductionOrder from "../panels/Dashboard/SmartSchedule/AddNewProductionOrder/AddNewProductionOrder";
import AddNewBlendOrder from "../panels/Dashboard/SmartSchedule/AddNewBlendOrder/AddNewBlendOrder";
import AddNewReceivingOrder from "../panels/Dashboard/SmartSchedule/AddNewReceivingOrder/AddNewReceivingOrder";
import AddNewShippingOrder from "../panels/Dashboard/SmartSchedule/AddNewShippingOrder/AddNewShippingOrder";
import ProductionExtra from "../panels/Dashboard/Accounting/ProductionExtra";
import AddNewProductionExtra from "../panels/Dashboard/Accounting/ProductionExtra/AddNewProductionExtra";
import Pricing from "../panels/Dashboard/Accounting/Pricing";
import AddNewPricingRule from "../panels/Dashboard/Accounting/Pricing/AddNewPricingRule";
import PurchaseOrder from "../panels/Dashboard/Accounting/PurchaseOrder";
import RevenueExpenses from "../panels/Dashboard/Accounting/Revenue-Expense";
import AddNewRevenueExpenses from "../panels/Dashboard/Accounting/Revenue-Expense/AddNewRevenueExpenses";
import EditRevenueExpense from "../panels/Dashboard/Accounting/Revenue-Expense/EditRevenueExpense";
import Stocks from "../panels/Dashboard/Inventory/Stocks";
import ViewDetails from "../panels/Dashboard/Inventory/Stocks/Components/viewDetails";
import EditReceivingOrder from "../panels/Dashboard/SmartSchedule/EditOrder/EditReceivingOrder/editReceivingOrder";
import EditProductionOrder from "../panels/Dashboard/SmartSchedule/EditOrder/EditProductionOrder/editProductionOrder";
import EditBlendOrder from "../panels/Dashboard/SmartSchedule/EditOrder/EditBlendOrder/editBlendOrder";
import EditShippingOrder from "../panels/Dashboard/SmartSchedule/EditOrder/EditShippingOrder/editShippingOrder";

export const superAdminRoutes = [
  {
    text: "Manage Accounts",
    icon: <ManageAccountsIcon fontSize="small" sx={iconStyling1} />,
    iconActive: <ManageAccountsIcon fontSize="small" sx={iconStyling2} />,
    component: <ManageAccounts />,
    path: "/manage-accounts",
    childs: [],
  },
];

export const provisionAccHolderRoutes = [
  {
    text: "Manage Subscription",
    icon: <ManageAccountsIcon fontSize="small" sx={iconStyling1} />,
    iconActive: <ManageAccountsIcon fontSize="small" sx={iconStyling2} />,
    component: <ManageSubscription />,
    path: "/manage-subscription",
    childs: [],
  },
  {
    text: "Dashboard",
    icon: <DashboardRoundedIcon fontSize="small" sx={iconStyling1} />,
    iconActive: <DashboardRoundedIcon fontSize="small" sx={iconStyling2} />,
    component: <Dashboard />,
    path: "/dashboard",
    childs: [],
  },
  {
    text: "Smart Schedule",
    icon: <EventRoundedIcon fontSize="small" sx={iconStyling1} />,
    iconActive: <EventRoundedIcon fontSize="small" sx={iconStyling2} />,
    component: <SmartSchedule />,
    path: "/smart-schedule",
    childs: [],
  },
  {
    text: "Customers",
    icon: <PersonRoundedIcon fontSize="small" sx={iconStyling1} />,
    iconActive: <PersonRoundedIcon fontSize="small" sx={iconStyling2} />,
    component: <Customers />,
    path: "/customers",
    childs: [],
  },
  {
    text: "Inventory",
    icon: <Inventory2RoundedIcon fontSize="small" sx={iconStyling1} />,
    iconActive: <Inventory2RoundedIcon fontSize="small" sx={iconStyling2} />,
    component: <Products />,
    path: "/inventory/products",
    childs: [
      {
        text: "Products",
        component: <Products />,
        path: "/inventory/products",
      },
      {
        text: "Kits",
        component: <Kits />,
        path: "/inventory/kits",
      },
      {
        text: "Locations",
        component: <Locations />,
        path: "/inventory/locations",
      },
      {
        text: "Live Inventory",
        component: <Stocks />,
        path: "/inventory/stocks",
      },
      {
        text: "Reconcile",
        component: <h1>Reconcile</h1>,
        path: "/inventory/reconcile",
      },
    ],
  },
  // done
  {
    text: "Supply Chain",
    icon: <DonutLargeRoundedIcon fontSize="small" sx={iconStyling1} />,
    iconActive: <DonutLargeRoundedIcon fontSize="small" sx={iconStyling2} />,
    component: <Carriers />,
    path: "/supply-chain/carriers",
    childs: [
      {
        text: "Carriers",
        component: <Carriers />,
        path: "/supply-chain/carriers",
      },
      {
        text: "Vendors",
        component: <Vendors />,
        path: "/supply-chain/vendors",
      },
      {
        text: "Ship To",
        component: <ShipTo />,
        path: "/supply-chain/ship-to",
      },
      {
        text: "Needs",
        component: <NeedsReport />,
        path: "/supply-chain/needs",
      },
      {
        text: "Invoices",
        component: <h1>Invoices</h1>,
        path: "/supply-chain/invoices",
      },
    ],
  },
  {
    text: "Accounting",
    icon: <WorkRoundedIcon fontSize="small" sx={iconStyling1} />,
    iconActive: <WorkRoundedIcon fontSize="small" sx={iconStyling2} />,
    component: <ProductionExtra />,
    path: "/accounting/production-extras",
    childs: [
      {
        text: "Production Extras",
        component: <ProductionExtra />,
        path: "/accounting/production-extras",
      },
      {
        text: "Pricing",
        component: <Pricing />,
        path: "/accounting/pricing",
      },
      {
        text: "Revenue/Expense",
        component: <RevenueExpenses />,
        path: "/accounting/revenue-expense",
      },
      {
        text: "Purchase Orders",
        component: <PurchaseOrder />,
        path: "/accounting/purchase-orders",
      },
    ],
  },
  {
    text: "Reporting",
    icon: <BarChartRoundedIcon fontSize="small" sx={iconStyling1} />,
    iconActive: <BarChartRoundedIcon fontSize="small" sx={iconStyling2} />,
    component: <h1>Reporting</h1>,
    path: "/reporting",
    childs: [],
  },
  {
    text: "Administration",
    icon: <BuildRoundedIcon fontSize="small" sx={iconStyling1} />,
    iconActive: <BuildRoundedIcon fontSize="small" sx={iconStyling2} />,
    component: <Users />,
    path: "/administration/users",
    childs: [
      {
        text: "Users",
        component: <Users />,
        path: "/administration/users",
      },
      {
        text: "Facilities",
        component: <Facilities />,
        path: "/administration/facilities",
      },
      {
        text: "Integrations",
        component: <Integrations />,
        path: "/administration/integrations",
      },
    ],
  },
];

export const dashboardRoutes = [
  {
    text: "Dashboard",
    icon: <DashboardRoundedIcon fontSize="small" sx={iconStyling1} />,
    iconActive: <DashboardRoundedIcon fontSize="small" sx={iconStyling2} />,
    component: <Dashboard />,
    path: "/dashboard",
    childs: [],
  },
  {
    text: "Smart Schedule",
    icon: <EventRoundedIcon fontSize="small" sx={iconStyling1} />,
    iconActive: <EventRoundedIcon fontSize="small" sx={iconStyling2} />,
    component: <SmartSchedule />,
    path: "/smart-schedule",
    childs: [],
  },
  {
    text: "Customers",
    icon: <PersonRoundedIcon fontSize="small" sx={iconStyling1} />,
    iconActive: <PersonRoundedIcon fontSize="small" sx={iconStyling2} />,
    component: <Customers />,
    path: "/customers",
    childs: [],
  },
  {
    text: "Inventory",
    icon: <Inventory2RoundedIcon fontSize="small" sx={iconStyling1} />,
    iconActive: <Inventory2RoundedIcon fontSize="small" sx={iconStyling2} />,
    component: <Products />,
    path: "/inventory/products",
    childs: [
      {
        text: "Products",
        component: <Products />,
        path: "/inventory/products",
      },
      {
        text: "Kits",
        component: <Kits />,
        path: "/inventory/kits",
      },
      {
        text: "Locations",
        component: <Locations />,
        path: "/inventory/locations",
      },
      {
        text: "Live Inventory",
        component: <Stocks />,
        path: "/inventory/stocks",
      },
      {
        text: "Reconcile",
        component: <h1>Reconcile</h1>,
        path: "/inventory/reconcile",
      },
    ],
  },
  // done
  {
    text: "Supply Chain",
    icon: <DonutLargeRoundedIcon fontSize="small" sx={iconStyling1} />,
    iconActive: <DonutLargeRoundedIcon fontSize="small" sx={iconStyling2} />,
    component: <Carriers />,
    path: "/supply-chain/carriers",
    childs: [
      {
        text: "Carriers",
        component: <Carriers />,
        path: "/supply-chain/carriers",
      },
      {
        text: "Vendors",
        component: <Vendors />,
        path: "/supply-chain/vendors",
      },
      {
        text: "Ship To",
        component: <ShipTo />,
        path: "/supply-chain/ship-to",
      },
      {
        text: "Needs",
        component: <NeedsReport />,
        path: "/supply-chain/needs",
      },
      {
        text: "Invoices",
        component: <h1>Invoices</h1>,
        path: "/supply-chain/invoices",
      },
    ],
  },
  {
    text: "Accounting",
    icon: <WorkRoundedIcon fontSize="small" sx={iconStyling1} />,
    iconActive: <WorkRoundedIcon fontSize="small" sx={iconStyling2} />,
    component: <h1>Production Extras</h1>,
    path: "/accounting/production-extras",
    childs: [
      {
        text: "Production Extras",
        component: <ProductionExtra />,
        path: "/accounting/production-extras",
      },
      {
        text: "Pricing",
        component: <Pricing />,
        path: "/accounting/pricing",
      },
      {
        text: "Revenue/Expense",
        component: <RevenueExpenses />,
        path: "/accounting/revenue-expense",
      },
      {
        text: "Purchase Orders",
        component: <PurchaseOrder />,
        path: "/accounting/purchase-orders",
      },
    ],
  },
  {
    text: "Reporting",
    icon: <BarChartRoundedIcon fontSize="small" sx={iconStyling1} />,
    iconActive: <BarChartRoundedIcon fontSize="small" sx={iconStyling2} />,
    component: <h1>Reporting</h1>,
    path: "/reporting",
    childs: [],
  },
  {
    text: "Administration",
    icon: <BuildRoundedIcon fontSize="small" sx={iconStyling1} />,
    iconActive: <BuildRoundedIcon fontSize="small" sx={iconStyling2} />,
    component: <Users />,
    path: "/administration/users",
    childs: [
      {
        text: "Users",
        component: <Users />,
        path: "/administration/users",
      },
      {
        text: "Facilities",
        component: <Facilities />,
        path: "/administration/facilities",
      },
      {
        text: "Integrations",
        component: <Integrations />,
        path: "/administration/integrations",
      },
    ],
  },
];

const routes = (currentUser, userType) => [
  { path: "*", element: <Navigate to="/dashboard" /> },
  // Dashboard Routes
  {
    path: "/",
    element: currentUser ? (
      <Layout propsUser={currentUser} />
    ) : (
      <Navigate to="/login" />
    ),
    children: [
      { path: "*", element: <Navigate to="/dashboard" /> },
      // Dashboard
      { path: "dashboard", element: <Dashboard /> },
      ...(currentUser?.role === "super-admin"
        ? // Super Admin View
          [
            {
              path: "manage-accounts",
              element: <Outlet />,
              children: [
                {
                  path: "",
                  element: <ManageAccounts />,
                },
                {
                  path: "add",
                  element: <AddNewAccount />,
                },
              ],
            },
          ]
        : currentUser?.role === "company_admin" &&
          currentUser?.provision_account_id > 0
        ? // Provision Account Holder View
          [
            // Manage Subscription
            {
              path: "manage-subscription",
              element: <ManageSubscription />,
            },
            // Smart Schedule
            {
              element: <Outlet />,
              path: "smart-schedule",
              children: [
                {
                  path: "",
                  element: <SmartSchedule />,
                },
                {
                  path: "add-new-production-order",
                  element: <AddNewProductionOrder />,
                },
                {
                  path: "add-new-blend-order",
                  element: <AddNewBlendOrder />,
                },
                {
                  path: "add-new-receiving-order",
                  element: <AddNewReceivingOrder />,
                },
                {
                  path: "add-new-shipping-order",
                  element: <AddNewShippingOrder />,
                },
                {
                  path: "edit-receiving-order/:id",
                  element: <EditReceivingOrder />,
                },
                {
                  path: "edit-production-order/:id",
                  element: <EditProductionOrder />,
                },
                {
                  path: "edit-blend-order/:id",
                  element: <EditBlendOrder />,
                },
                {
                  path: "edit-shipping-order/:id",
                  element: <EditShippingOrder />,
                },
              ],
            },

            // Administration
            {
              element: <Outlet />,
              path: "administration",
              children: [
                {
                  element: <Users />,
                  path: "users",
                },
                {
                  element: <AddNewUser />,
                  path: "add-user",
                },
                {
                  element: <Outlet />,
                  path: "edit-user",
                  children: [
                    {
                      path: ":id",
                      element: <AddNewUser />,
                    },
                  ],
                },
                {
                  element: <Facilities />,
                  path: "facilities",
                },

                {
                  element: <AddNewFacility />,
                  path: "add-facility",
                },
                {
                  element: <Outlet />,
                  path: "edit-facility",
                  children: [
                    {
                      path: ":id",
                      element: <AddNewFacility />,
                    },
                  ],
                },
                {
                  element: <Integrations />,
                  path: "integrations",
                },
              ],
            },
            // Profile
            {
              element: <Outlet />,
              path: "profile",
              children: [
                {
                  element: <ProfileSettings />,
                  path: "",
                },
                {
                  element: <Outlet />,
                  path: "edit-facility",
                  children: [
                    {
                      path: ":id",
                      element: <EditFacility />,
                    },
                  ],
                },
              ],
            },
            // Customers
            {
              element: <Outlet />,
              path: "customers",
              children: [
                {
                  path: "",
                  element: <Customers />,
                },
                {
                  path: "add",
                  element: <AddNewCustomer />,
                },
                {
                  path: "edit-customer",
                  element: <Outlet />,
                  children: [
                    {
                      path: ":id",
                      element: <AddNewCustomer />,
                    },
                  ],
                },
              ],
            },
            // Inventory
            {
              element: <Outlet />,
              path: "inventory",
              children: [
                {
                  path: "products",
                  element: <Products />,
                },
                {
                  path: "add-product",
                  element: <AddNewProduct />,
                },
                {
                  path: "edit-product",
                  element: <Outlet />,
                  children: [
                    {
                      path: ":id",
                      element: <AddNewProduct />,
                    },
                  ],
                },
                {
                  path: "kits",
                  element: <Kits />,
                },
                {
                  path: "add-kit",
                  element: <AddKits />,
                },
                {
                  path: "edit-kit",
                  element: <Outlet />,
                  children: [
                    {
                      path: ":id",
                      element: <AddKits />,
                    },
                  ],
                },
                {
                  path: "locations",
                  element: <Locations />,
                },
                {
                  path: "locations/add-location",
                  element: <AddNewLocation />,
                },
                {
                  path: "edit-location",
                  element: <Outlet />,
                  children: [
                    {
                      path: ":id",
                      element: <AddNewLocation />,
                    },
                  ],
                },
                {
                  path: "stocks",
                  element: <Stocks />,
                },
                {
                  path: "view-details",
                  element: <Outlet />,
                  children: [
                    {
                      path: ":id",
                      element: <ViewDetails />,
                    },
                  ],
                },
                {
                  path: "reconcile",
                  element: <h1>This feature is coming soon.</h1>,
                },
              ],
            },
            // Supply Chain
            {
              element: <Outlet />,
              path: "supply-chain",
              children: [
                {
                  path: "carriers",
                  element: <Carriers />,
                },
                {
                  path: "carriers/add-carrier",
                  element: <AddNewCarrier />,
                },
                {
                  path: "edit-carrier",
                  element: <Outlet />,
                  children: [
                    {
                      path: ":id",
                      element: <AddNewCarrier />,
                    },
                  ],
                },
                {
                  path: "vendors",
                  element: <Vendors />,
                },
                {
                  path: "vendors/add-vendor",
                  element: <AddNewVendor />,
                },
                {
                  path: "edit-vendor",
                  element: <Outlet />,
                  children: [
                    {
                      path: ":id",
                      element: <AddNewVendor />,
                    },
                  ],
                },
                {
                  path: "ship-to",
                  element: <ShipTo />,
                },
                {
                  path: "ship-to/add-shipto",
                  element: <AddNewShipTo />,
                },
                {
                  path: "edit-shipto",
                  element: <Outlet />,
                  children: [
                    {
                      path: ":id",
                      element: <AddNewShipTo />,
                    },
                  ],
                },
                {
                  path: "needs",
                  element: <NeedsReport />,
                },
                {
                  path: "needs/add-needs",
                  element: <AddNewNeedsReport />,
                },
                {
                  path: "edit-needs",
                  element: <Outlet />,
                  children: [
                    {
                      path: ":id",
                      element: <AddNewNeedsReport />,
                    },
                  ],
                },
                {
                  path: "Invoices",
                  element: <h1>This feature is coming soon.</h1>,
                },
              ],
            },
            // Accounting
            {
              element: <Outlet />,
              path: "accounting",
              children: [
                {
                  path: "production-extras",
                  element: <ProductionExtra />,
                },
                {
                  path: "production-extras/add-production-extras",
                  element: <AddNewProductionExtra />,
                },
                {
                  path: "edit-production-extras",
                  element: <Outlet />,
                  children: [
                    {
                      path: ":id",
                      element: <AddNewProductionExtra />,
                    },
                  ],
                },

                {
                  path: "pricing",
                  element: <Pricing />,
                },
                {
                  path: "pricing/add-new-pricing-rule",
                  element: <AddNewPricingRule />,
                },
                {
                  path: "edit-pricing-rule",
                  element: <Outlet />,
                  children: [
                    {
                      path: ":id",
                      element: <AddNewPricingRule />,
                    },
                  ],
                },

                {
                  path: "revenue-expense",
                  element: <RevenueExpenses />,
                },
                {
                  path: "revenue-expense/add-new-revenue-expense",
                  element: <AddNewRevenueExpenses />,
                },
                {
                  path: "edit-revenue-expense",
                  element: <Outlet />,
                  children: [
                    {
                      path: ":id",
                      element: <EditRevenueExpense />,
                    },
                  ],
                },

                {
                  path: "purchase-orders",
                  element: <PurchaseOrder />,
                },
              ],
            },
            // Reporting
            {
              path: "reporting",
              element: <h1>This feature is coming soon.</h1>,
            },
          ]
        : // Dashboard View
          [
            // Smart Schedule
            {
              element: <Outlet />,
              path: "smart-schedule",
              children: [
                {
                  path: "",
                  element: <SmartSchedule />,
                },
                {
                  path: "add-new-production-order",
                  element: <AddNewProductionOrder />,
                },
                {
                  path: "add-new-blend-order",
                  element: <AddNewBlendOrder />,
                },
                {
                  path: "add-new-receiving-order",
                  element: <AddNewReceivingOrder />,
                },
                {
                  path: "add-new-shipping-order",
                  element: <AddNewShippingOrder />,
                },
                {
                  path: "edit-receiving-order/:id",
                  element: <EditReceivingOrder />,
                },
                {
                  path: "edit-production-order/:id",
                  element: <EditProductionOrder />,
                },
                {
                  path: "edit-blend-order/:id",
                  element: <EditBlendOrder />,
                },
                {
                  path: "edit-shipping-order/:id",
                  element: <EditShippingOrder />,
                },
              ],
            },

            // Administration
            {
              element: <Outlet />,
              path: "administration",
              children: [
                {
                  element: <Users />,
                  path: "users",
                },
                {
                  element: <AddNewUser />,
                  path: "add-user",
                },
                {
                  element: <Outlet />,
                  path: "edit-user",
                  children: [
                    {
                      path: ":id",
                      element: <AddNewUser />,
                    },
                  ],
                },
                {
                  element: <Facilities />,
                  path: "facilities",
                },

                {
                  element: <AddNewFacility />,
                  path: "add-facility",
                },
                {
                  element: <Outlet />,
                  path: "edit-facility",
                  children: [
                    {
                      path: ":id",
                      element: <AddNewFacility />,
                    },
                  ],
                },
                {
                  element: <Integrations />,
                  path: "integrations",
                },
              ],
            },
            // Profile
            {
              element: <Outlet />,
              path: "profile",
              children: [
                {
                  element: <ProfileSettings />,
                  path: "",
                },
                {
                  element: <Outlet />,
                  path: "edit-facility",
                  children: [
                    {
                      path: ":id",
                      element: <EditFacility />,
                    },
                  ],
                },
              ],
            },
            // Customers
            {
              element: <Outlet />,
              path: "customers",
              children: [
                {
                  path: "",
                  element: <Customers />,
                },
                {
                  path: "add",
                  element: <AddNewCustomer />,
                },
                {
                  path: "edit-customer",
                  element: <Outlet />,
                  children: [
                    {
                      path: ":id",
                      element: <AddNewCustomer />,
                    },
                  ],
                },
              ],
            },
            // Inventory
            {
              element: <Outlet />,
              path: "inventory",
              children: [
                {
                  path: "products",
                  element: <Products />,
                },
                {
                  path: "add-product",
                  element: <AddNewProduct />,
                },
                {
                  path: "edit-product",
                  element: <Outlet />,
                  children: [
                    {
                      path: ":id",
                      element: <AddNewProduct />,
                    },
                  ],
                },
                {
                  path: "kits",
                  element: <Kits />,
                },
                {
                  path: "add-kit",
                  element: <AddKits />,
                },
                {
                  path: "edit-kit",
                  element: <Outlet />,
                  children: [
                    {
                      path: ":id",
                      element: <AddKits />,
                    },
                  ],
                },
                {
                  path: "locations",
                  element: <Locations />,
                },
                {
                  path: "locations/add-location",
                  element: <AddNewLocation />,
                },
                {
                  path: "edit-location",
                  element: <Outlet />,
                  children: [
                    {
                      path: ":id",
                      element: <AddNewLocation />,
                    },
                  ],
                },
                {
                  path: "stocks",
                  element: <Stocks />,
                },
                {
                  path: "view-details",
                  element: <Outlet />,
                  children: [
                    {
                      path: ":id",
                      element: <ViewDetails />,
                    },
                  ],
                },
                {
                  path: "reconcile",
                  element: <h1>This feature is coming soon.</h1>,
                },
              ],
            },
            // Supply Chain
            {
              element: <Outlet />,
              path: "supply-chain",
              children: [
                {
                  path: "carriers",
                  element: <Carriers />,
                },
                {
                  path: "carriers/add-carrier",
                  element: <AddNewCarrier />,
                },
                {
                  path: "edit-carrier",
                  element: <Outlet />,
                  children: [
                    {
                      path: ":id",
                      element: <AddNewCarrier />,
                    },
                  ],
                },
                {
                  path: "vendors",
                  element: <Vendors />,
                },
                {
                  path: "vendors/add-vendor",
                  element: <AddNewVendor />,
                },
                {
                  path: "edit-vendor",
                  element: <Outlet />,
                  children: [
                    {
                      path: ":id",
                      element: <AddNewVendor />,
                    },
                  ],
                },
                {
                  path: "ship-to",
                  element: <ShipTo />,
                },
                {
                  path: "ship-to/add-shipto",
                  element: <AddNewShipTo />,
                },
                {
                  path: "edit-shipto",
                  element: <Outlet />,
                  children: [
                    {
                      path: ":id",
                      element: <AddNewShipTo />,
                    },
                  ],
                },
                {
                  path: "needs",
                  element: <NeedsReport />,
                },
                {
                  path: "needs/add-needs",
                  element: <AddNewNeedsReport />,
                },
                {
                  path: "edit-needs",
                  element: <Outlet />,
                  children: [
                    {
                      path: ":id",
                      element: <AddNewNeedsReport />,
                    },
                  ],
                },
                {
                  path: "Invoices",
                  element: <h1>This feature is coming soon.</h1>,
                },
              ],
            },
            // Accounting
            {
              element: <Outlet />,
              path: "accounting",
              children: [
                {
                  path: "production-extras",
                  element: <ProductionExtra />,
                },
                {
                  path: "production-extras/add-production-extras",
                  element: <AddNewProductionExtra />,
                },
                {
                  path: "edit-production-extras",
                  element: <Outlet />,
                  children: [
                    {
                      path: ":id",
                      element: <AddNewProductionExtra />,
                    },
                  ],
                },

                {
                  path: "pricing",
                  element: <Pricing />,
                },
                {
                  path: "pricing/add-new-pricing-rule",
                  element: <AddNewPricingRule />,
                },
                {
                  path: "edit-pricing-rule",
                  element: <Outlet />,
                  children: [
                    {
                      path: ":id",
                      element: <AddNewPricingRule />,
                    },
                  ],
                },

                {
                  path: "revenue-expense",
                  element: <RevenueExpenses />,
                },
                {
                  path: "revenue-expense/add-new-revenue-expense",
                  element: <AddNewRevenueExpenses />,
                },
                {
                  path: "edit-revenue-expense",
                  element: <Outlet />,
                  children: [
                    {
                      path: ":id",
                      element: <EditRevenueExpense />,
                    },
                  ],
                },

                {
                  path: "purchase-orders",
                  element: <PurchaseOrder />,
                },
              ],
            },
            // Reporting
            {
              path: "reporting",
              element: <h1>This feature is coming soon.</h1>,
            },
          ]),
    ],
  },
  // Auth Routes
  {
    path: "/",
    element: !currentUser ? <Outlet /> : <Navigate to="/dashboard" />,
    children: [
      { path: "login", element: <Login /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password", element: <CreateNewPassword /> },
      { path: "request-sent", element: <SuccessfulRequestSent /> },
      { path: "reset-successfully", element: <LoginSuccessful /> },
      { path: "authenticate", element: <TwoFactorAuthentication /> },
      { path: "", element: <Navigate to={"/login"} /> },
    ],
  },
];

export default routes;
