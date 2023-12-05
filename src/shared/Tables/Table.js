/* eslint-disable array-callback-return */
import React, { useState } from "react";
import {
  SelectionState,
  PagingState,
  IntegratedPaging,
  IntegratedSelection,
  DataTypeProvider,
  SortingState,
  IntegratedSorting,
} from "@devexpress/dx-react-grid";
import {
  Grid,
  Table,
  TableHeaderRow,
  TableSelection,
  PagingPanel,
  VirtualTable,
} from "@devexpress/dx-react-grid-material-ui";
import CustomPagination from "./CustomPagination";
import DeleteIcon from "@mui/icons-material/Delete";
import PrintIcon from "@mui/icons-material/Print";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import TripOriginIcon from "@mui/icons-material/TripOrigin";
import { Add, Visibility } from "@mui/icons-material";
import { lightGray } from "../../helpers/GlobalVariables";
import DescriptionIcon from "@mui/icons-material/Description";

// eslint-disable-next-line
export default ({
  id,
  rows,
  columns,
  tableColumnExtensions,
  dataProviders,
  kits,
  selectedKits,
  setSelectedKits,
  selectionIds,
  setSelectionIds,
  isOpen,
  setIsopen,
  selectedUserFacilities,
  setSelectedUserFacilities,
  pagination,
  facilities,
  multiSelection,
  setIsMultiDelete,
  products,
  previewBarCode,
  setPreviewBarCode,
  customer,
  selectedProducts,
  setSelectedProducts,
  setIsDelete,
  locations,
  selectedLocation,
  setSelectedLocation,
  shipTo,
  selectedShipTo,
  setSelectedShipTo,
  isActive,
  setIsActive,
  isDeactive,
  setIsDeactive,
  isAddCustomer,
  setIsAddCustomer,
  needsProductTable,
  revenueExpenses,
  selectedRevenueExpenses,
  setSelectedRevenueExpenses,
  expenses,
  selectedExpenses,
  setSelectedExpenses,
  isNeed,
  onRowSelect,
  facilityUser,
  facilityAdmin,
  companyAdmin,
}) => {
  const [selection, setSelection] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [pageSizes] = useState([20, 40, 60]);

  const tableHeaderComponent = (restProps) => {
    // While Having Multi Selection
    if (selectionIds?.length) {
      //************************* Custom header component for facilities table *******************************/

      if (facilities) {
        if (restProps.column.name === "id") {
          return (
            <Table.Row>
              <div className="d-flex flex-row justify-content-between align-items-center border rounded-[4px]">
                <div className="d-flex flex-row justify-content-between align-items-center  p-1 ps-2">
                  <div
                    onClick={() => {
                      setSelectionIds([]);
                      setSelection([]);
                    }}
                    className="bg-primary pointer w-[18px] h-[18px] rounded-[4px] border border-white text-center">
                    <div className="text-white relative -top-[5px]">-</div>
                  </div>
                  <div className="text-[13px] ml-2.5 text-secondaryColor w-20">
                    {selectionIds?.length} Selected
                  </div>
                </div>
                <div
                  onClick={() => setIsopen(!isOpen)}
                  className="d-flex flex-row pointer justify-content-between align-items-center   p-1 px-3">
                  <Add color="primary" fontSize="small" />
                  <div className="text-[13px] ml-2.5 w-[100px]">
                    Add to Users
                  </div>
                </div>
                {/* <div onClick={() => {
                  deteleMultipleUsers(selectionIds).then((res) => {
                    setDeleteAlert(true);
                    dispatch(Actions.getUsers())
                    setSelectionIds([])
                    setTimeout(() => setDeleteAlert(false), 1200)
                  })

                }} className='d-flex flex-row pointer justify-content-between align-items-center p-1 px-3'>
                  <DeleteIcon color='danger' fontSize='small' />
                  <div className="text-[13px] ml-2.5">Delete</div>
                </div> */}
              </div>
            </Table.Row>
          );
        } else {
          return null;
        }
      }

      //************************* Custom header component for products table *******************************/
      else if (products) {
        if (restProps.column.name === "id") {
          return (
            <Table.Row>
              <div className="d-flex flex-row justify-content-between align-items-center border rounded-[4px] my-2">
                <div className="d-flex flex-row justify-content-between align-items-center   p-1 ps-2">
                  <div
                    onClick={() => {
                      setSelectionIds([]);
                      setSelection([]);
                      setSelectedProducts([]);
                    }}
                    className="bg-primaryColor pointer w-[18px] h-[18px] rounded-[4px] border border-white text-center">
                    <div className="text-white relative -top-[5px]">-</div>
                  </div>
                  <div className="text-[13px] ml-2.5 text-secondaryColor w-20">
                    {selectionIds?.length} Selected
                  </div>
                </div>
                <div
                  onClick={() => setPreviewBarCode(!previewBarCode)}
                  className="d-flex flex-row pointer justify-content-between align-items-center   p-1 px-3">
                  <Visibility color="primary" fontSize="small" />
                  <div className="text-[13px] ml-2.5 w-[120px]">
                    Preview Barcode(s)
                  </div>
                </div>
                <div
                  onClick={() => setIsopen(!isOpen)}
                  className="d-flex flex-row pointer justify-content-between align-items-center   p-1 px-3">
                  <PrintIcon color="primary" fontSize="small" />
                  <div className="text-[13px] ml-2.5 w-[100px]">
                    Print Product(s)
                  </div>
                </div>
                {companyAdmin && (
                  <div
                    onClick={() => {
                      setIsDelete(true);
                    }}
                    className="d-flex flex-row pointer justify-content-between align-items-center p-1 px-3">
                    <DeleteIcon color="danger" fontSize="small" />
                    <div className="text-[13px] ml-2.5">Delete</div>
                  </div>
                )}
              </div>
            </Table.Row>
          );
        } else {
          return null;
        }
      }

      //************************* Custom header component for Kits table *******************************/
      else if (kits) {
        if (restProps.column.name === "kit") {
          return (
            <Table.Row>
              <div className="d-flex flex-row justify-content-between align-items-center border rounded-[4px]">
                <div className="d-flex flex-row justify-content-between align-items-center   p-1 ps-2">
                  <div
                    onClick={() => {
                      setSelectionIds([]);
                      setSelection([]);
                      setSelectedKits([]);
                    }}
                    className="bg-primaryColor pointer w-[18px] h-[18px] rounded-[4px] border text-center">
                    <div className="text-white relative -top-[5px]">-</div>
                  </div>
                  <div className="text-[13px] ml-2.5 text-seondaryColor w-20">
                    {selectionIds?.length} Selected
                  </div>
                </div>
                {companyAdmin && (
                  <div
                    onClick={() => {
                      setIsDelete(true);
                    }}
                    className="d-flex flex-row pointer justify-content-between align-items-center p-1 px-3">
                    <DeleteIcon color="danger" fontSize="small" />
                    <div className="text-[13px] ml-2.5">Delete</div>
                  </div>
                )}
              </div>
            </Table.Row>
          );
        } else {
          return null;
        }
      }
      //************************* Custom header component for Locations table *******************************/
      else if (locations) {
        if (restProps.column.name === "location") {
          return (
            <Table.Row>
              <div className="d-flex flex-row justify-content-between align-items-center border rounded-[4px]">
                <div className="d-flex flex-row justify-content-between align-items-center   p-1 ps-2">
                  <div
                    onClick={() => {
                      setSelectionIds([]);
                      setSelection([]);
                      setSelectedLocation([]);
                    }}
                    className="bg-primaryColor pointer w-[18px] h-[18px] rounded-[4px] border border-white text-center">
                    <div className="text-white relative -top-[5px]">-</div>
                  </div>
                  <div className="text-[13px] ml-2.5 text-secondaryColor w-20">
                    {selectionIds?.length} Selected
                  </div>
                </div>
                <div
                  onClick={() => setPreviewBarCode(!previewBarCode)}
                  className="d-flex flex-row pointer justify-content-between align-items-center   p-1 px-3 whitespace-nowrap">
                  <Visibility color="primary" fontSize="small" />
                  <div className="text-[13px] ml-2.5 w-[114px]">
                    Preview Barcode(s)
                  </div>
                </div>
                <div
                  onClick={() => setIsopen(!isOpen)}
                  className="d-flex flex-row pointer justify-content-between align-items-center   p-1 px-3 whitespace-nowrap">
                  <PrintIcon color="primary" fontSize="small" />
                  <div className="text-[13px] ml-2.5 w-[100px]">
                    Print Location(s)
                  </div>
                </div>
                {/* <div
                  onClick={() => {
                    setIsDelete(true);
                  }}
                  className="d-flex flex-row pointer justify-content-between align-items-center p-1 px-3">
                  <DeleteIcon color="danger" fontSize="small" />
                  <div className="text-[13px] ml-2.5">Delete</div>
                </div> */}
              </div>
            </Table.Row>
          );
        } else {
          return null;
        }
      }

      //************************* Custom header component for ShipTo table *******************************/
      else if (shipTo) {
        if (restProps.column.name === "shipToName") {
          return (
            <Table.Row>
              <div className="d-flex flex-row justify-content-between align-items-center border rounded-[4px]">
                <div className="d-flex flex-row justify-content-between align-items-center   p-1 ps-2">
                  <div
                    onClick={() => {
                      setSelectionIds([]);
                      setSelection([]);
                      setSelectedShipTo([]);
                    }}
                    className="bg-primaryColor pointer w-[18px] h-[18px] rounded-[4px] border border-white text-center">
                    <div className="text-white relative -top-[5px]">-</div>
                  </div>
                  <div className="text-[13px] ml-2.5 text-secondaryColor w-20">
                    {selectionIds?.length} Selected
                  </div>
                </div>
                <div
                  onClick={() => setIsActive(!isActive)}
                  className="d-flex flex-row pointer justify-content-between align-items-center   p-2 px-3 whitespace-nowrap">
                  <CheckCircleRoundedIcon color="success" fontSize="small" />
                  <div className="text-[13px] ml-2.5 w-[70px]">Active</div>
                </div>
                <div
                  onClick={() => setIsDeactive(!isDeactive)}
                  className="d-flex flex-row pointer justify-content-between align-items-center   p-2 px-3 whitespace-nowrap">
                  <TripOriginIcon color="danger" sx={{ fontSize: "18px" }} />
                  <div className="text-[13px] ml-2.5 w-[70px]">Deactive</div>
                </div>
                <div
                  onClick={() => setIsAddCustomer(!isAddCustomer)}
                  className="d-flex flex-row pointer justify-content-between align-items-center p-1 px-3 whitespace-nowrap">
                  <Add color="primary" fontSize="small" />
                  <div className="text-[13px] ml-2.5">Add to Customer</div>
                </div>
              </div>
            </Table.Row>
          );
        } else {
          return null;
        }
      }

      //************************* Custom header component for Revenue table *******************************/
      else if (revenueExpenses) {
        if (restProps.column.name === "revenueType") {
          return (
            <Table.Row>
              <div className="d-flex flex-row justify-content-between align-items-center border rounded-[4px]">
                <div className="d-flex flex-row justify-content-between align-items-center   p-1 ps-2">
                  <div
                    onClick={() => {
                      setSelectionIds([]);
                      setSelection([]);
                      setSelectedRevenueExpenses([]);
                    }}
                    className="bg-primaryColor pointer w-[18px] h-[18px] rounded-[4px] border border-white text-center">
                    <div className="text-white relative -top-[5px]">-</div>
                  </div>
                  <div className="text-[13px] ml-2.5 text-secondaryColor w-20">
                    {selectionIds?.length} Selected
                  </div>
                </div>
                <div
                  onClick={() => {
                    setIsDelete(true);
                  }}
                  className="d-flex flex-row pointer justify-content-between align-items-center p-1 px-3">
                  <DeleteIcon color="danger" fontSize="small" />
                  <div className="text-[13px] ml-2.5">Delete</div>
                </div>
              </div>
            </Table.Row>
          );
        } else {
          return null;
        }
      }

      //************************* Custom header component for Expenses table *******************************/
      else if (expenses) {
        if (restProps.column.name === "id") {
          return (
            <Table.Row>
              <div className="d-flex flex-row justify-content-between align-items-center border rounded-[4px]">
                <div className="d-flex flex-row justify-content-between align-items-center   p-1 ps-2">
                  <div
                    onClick={() => {
                      setSelectionIds([]);
                      setSelection([]);
                      setSelectedExpenses([]);
                    }}
                    className="bg-primaryColor pointer w-[18px] h-[18px] rounded-[4px] border border-white text-center">
                    <div className="text-white relative -top-[5px]">-</div>
                  </div>
                  <div className="text-[13px] ml-2.5 text-secondaryColor w-20">
                    {selectionIds?.length} Selected
                  </div>
                </div>
                <div
                  onClick={() => {
                    setIsDelete(true);
                  }}
                  className="d-flex flex-row pointer justify-content-between align-items-center p-1 px-3">
                  <DeleteIcon color="danger" fontSize="small" />
                  <div className="text-[13px] ml-2.5">Delete</div>
                </div>
              </div>
            </Table.Row>
          );
        } else {
          return null;
        }
      }

      //************************* Custom header component for users table *******************************/
      else {
        if (restProps.column.name === "id") {
          return (
            <Table.Row>
              <div className="d-flex flex-row justify-content-between align-items-center border rounded-[4px]">
                <div className="d-flex flex-row justify-content-between align-items-center   p-1 ps-2">
                  <div
                    onClick={() => {
                      setSelectionIds([]);
                      setSelection([]);
                    }}
                    className="bg-primaryColor pointer w-[18px] h-[18px] rounded-[4px] border border-white text-center">
                    <div className="text-white relative -top-[5px]">-</div>
                  </div>
                  <div className="text-[13px] ml-2.5 text-secondaryColor w-20">
                    {selectionIds?.length} Selected
                  </div>
                </div>
                {!customer && (
                  <>
                    <div
                      onClick={() => setIsopen(!isOpen)}
                      className="d-flex flex-row pointer justify-content-between align-items-center   p-1 px-3">
                      <Add color="primary" fontSize="small" />
                      <div className="text-[13px] ml-2.5 w-[100px]">
                        Add to Facilities
                      </div>
                    </div>
                    <div
                      onClick={() => {
                        setIsMultiDelete(true);
                      }}
                      className="d-flex flex-row pointer justify-content-between align-items-center p-1 px-3">
                      <DeleteIcon color="danger" fontSize="small" />
                      <div className="text-[13px] ml-2.5">Delete</div>
                    </div>
                  </>
                )}
              </div>
            </Table.Row>
          );
        } else {
          return null;
        }
      }
    }
    // While Not Having Multi Selection
    else {
      return (
        <Table.Cell
          {...restProps}
          sx={{
            "& .css-gxs2o2.Content-content": {
              ...(restProps.column.name === "manageKits" && {
                justifyContent: "flex-end !important",
                paddingRight: "20px !important",
              }),
            },
          }}
          className={`${
            isNeed ? "bg-lightGray pt-2 pb-2" : ""
          } text-[13px] text-darkGray font font-semibold`}
        />
      );
    }
  };

  const rowComponent = (restProps) => {
    const odd = !!(restProps.tableRow.rowId % 2);
    return (
      <Table.Row
        {...restProps}
        style={{ background: odd ? lightGray : null }}
      />
    );
  };

  const cellComponent = (restProps) => {
    return (
      <>
        {onRowSelect ? (
          <Table.Cell
            {...restProps}
            style={
              restProps.column.name === "fname"
                ? { border: "0px #000", padding: 10 }
                : restProps.column.name === "id" && !multiSelection
                ? { border: "0px #000", padding: 10, width: "4vw" }
                : restProps.column.name === "manage"
                ? {
                    border: "0px #000",
                    paddingLeft: 10,
                  }
                : {
                    border: "0px #000",
                    fontSize: 14,
                    fontFamily: '"SF UI Text", "SF UI Display"',
                    fontWeight: "500",
                    color: "#222128",
                    cursor:
                      onRowSelect &&
                      restProps.column.name !== "manage" &&
                      restProps.column.name !== "facilities" &&
                      restProps.column.name !== "customerUsers" &&
                      "pointer",
                  }
            }
            onClick={() => {
              onRowSelect &&
                restProps.column.name !== "manage" &&
                restProps.column.name !== "facilities" &&
                restProps.column.name !== "customerUsers" &&
                onRowSelect(restProps.row);
            }}
          />
        ) : (
          <Table.Cell
            {...restProps}
            style={
              restProps.column.name === "fname"
                ? { border: "0px #000", padding: 10 }
                : restProps.column.name === "id" && !multiSelection
                ? { border: "0px #000", padding: 10, width: "4vw" }
                : restProps.column.name === "manage"
                ? { border: "0px #000", paddingLeft: 10 }
                : {
                    border: "0px #000",
                    fontSize: 14,
                    fontFamily: '"SF UI Text", "SF UI Display"',
                    fontWeight: "500",
                    color: "#222128",
                  }
            }
          />
        )}
      </>
    );
  };

  //************************* Table Header Selection Cell Component *******************************/
  const selectionHeaderCellComponent = (restProps) => {
    let array = [];
    let indexArray = [];
    rows?.map((item, index) => {
      indexArray.push(index);
      array.push(item.uuid);
    });
    if (selectionIds?.length) {
      return null;
    } else {
      return (
        <Table.Cell {...restProps}>
          <div
            onClick={() => {
              setSelection(indexArray);
              setSelectionIds(array);
            }}
            className="cursor-pointer w-4 h-4 border rounded-[4px] border-darkGray -ml-3.5"></div>
        </Table.Cell>
      );
    }
  };

  //************************* Product Table Header Selection Cell Component *******************************/
  const selectionProductHeaderCellComponent = (restProps) => {
    let array = [];
    let indexArray = [];
    let items = [];
    rows?.map((item, index) => {
      indexArray.push(index);
      array.push(item?.completeItem?.uuid);
      items.push(item.completeItem);
    });
    if (selectionIds?.length) {
      return null;
    } else {
      return (
        <Table.Cell {...restProps}>
          <div
            onClick={() => {
              setSelection(indexArray);
              setSelectionIds(array);
              setSelectedProducts(items);
            }}
            className="cursor-pointer w-4 h-4 border rounded-[4px] border-bgGray -ml-3.5"></div>
        </Table.Cell>
      );
    }
  };

  //************************* Kits Table Header Selection Cell Component *******************************/
  const selectionKitsHeaderCellComponent = (restProps) => {
    let array = [];
    let indexArray = [];
    let items = [];
    rows?.map((item, index) => {
      indexArray.push(index);
      array.push(item?.completeItem?.uuid);
      items.push(item.completeItem);
    });

    if (selectionIds?.length) {
      return null;
    } else {
      return (
        <Table.Cell {...restProps}>
          <div
            onClick={() => {
              setSelection(indexArray);
              setSelectionIds(array);
              setSelectedKits(items);
            }}
            className="cursor-pointer w-4 h-4 border rounded-[4px] border-bgGray -ml-3.5"></div>
        </Table.Cell>
      );
    }
  };

  //************************* Custom selection component for USER table *******************************/
  const selectionCellUserComponent = (restProps) => {
    let id = restProps.row.uuid;
    let facilityIds = [];
    facilityIds.push({
      userId: id,
      faciltyIds: restProps.row.facilities,
    });
    return (
      <div className="form-check form-check-sm form-check-custom form-check-solid ms-2 mt-3">
        <input
          className={`form-check-input pointer ${
            restProps.selected && "bg-primaryColor"
          }`}
          type="checkbox"
          checked={restProps.selected}
          onChange={() => {
            if (selectionIds.includes(id)) {
              const array = selectionIds.filter(function (ele) {
                return ele !== id;
              });
              setSelectionIds(array);

              const faciltitesArray = selectedUserFacilities.filter(function (
                ele
              ) {
                return ele.userId !== id;
              });
              setSelectedUserFacilities(faciltitesArray);
            } else {
              setSelectionIds([...selectionIds, id]);
              const data = [...selectedUserFacilities, ...facilityIds];
              setSelectedUserFacilities(data);
            }
            restProps.onToggle();
          }}
        />
      </div>
    );
  };

  //************************* Custom selection component for CUSTOMER table *******************************/
  const selectionCellCustomerComponent = (restProps) => {
    let id = restProps.row.uuid;

    return (
      <div className="form-check form-check-sm form-check-custom form-check-solid ms-2 mt-3">
        <input
          className={`form-check-input pointer ${
            restProps.selected && "bg-primaryColor"
          }`}
          type="checkbox"
          checked={restProps.selected}
          onChange={() => {
            if (selectionIds.includes(id)) {
              const array = selectionIds.filter(function (ele) {
                return ele !== id;
              });
              setSelectionIds(array);
            } else {
              setSelectionIds([...selectionIds, id]);
            }
            restProps.onToggle();
          }}
        />
      </div>
    );
  };

  //************************* Custom selection component for FACILITIES table *******************************/
  const selectionCellFacilitiesComponent = (restProps) => {
    let id = restProps.row.uuid;
    return (
      <div className="form-check form-check-sm form-check-custom form-check-solid ms-2 mt-3">
        <input
          className="form-check-input pointer"
          type="checkbox"
          checked={restProps.selected}
          onChange={() => {
            if (selectionIds.includes(id)) {
              const array = selectionIds.filter(function (ele) {
                return ele !== id;
              });
              setSelectionIds(array);
            } else {
              setSelectionIds([...selectionIds, id]);
            }
            restProps.onToggle();
          }}
        />
      </div>
    );
  };

  //************************* Custom selection component for PRODUCT table *******************************/
  const selectionCellProductComponent = (restProps) => {
    let id = restProps.row.completeItem.uuid;
    let products = [];
    products.push(restProps.row.completeItem);

    return (
      <div className="form-check form-check-sm form-check-custom form-check-solid ms-2 mt-3">
        <input
          className={`form-check-input pointer ${
            restProps.selected && "bg-primaryColor"
          }`}
          type="checkbox"
          checked={restProps.selected}
          onChange={() => {
            if (selectionIds.includes(id)) {
              const array = selectionIds.filter(function (ele) {
                return ele !== id;
              });
              setSelectionIds(array);

              const productsArray = selectedProducts.filter(function (ele) {
                return ele.uuid !== id;
              });
              setSelectedProducts(productsArray);
            } else {
              setSelectionIds([...selectionIds, id]);
              const data = [...selectedProducts, ...products];
              setSelectedProducts(data);
            }
            restProps.onToggle();
          }}
        />
      </div>
    );
  };

  //************************* Custom selection component for KITS table *******************************/
  const selectionCellKitsComponent = (restProps) => {
    let id = restProps.row.completeItem.uuid;
    let kits = [];
    kits.push(restProps.row.completeItem);
    return (
      <div className="form-check form-check-sm form-check-custom form-check-solid ms-2 mt-3">
        <input
          className="form-check-input pointer"
          type="checkbox"
          checked={restProps.selected}
          onChange={() => {
            if (selectionIds.includes(id)) {
              const array = selectionIds.filter(function (ele) {
                return ele !== id;
              });
              setSelectionIds(array);

              const kitsArray = selectedKits.filter(function (ele) {
                return ele.uuid !== id;
              });
              setSelectedKits(kitsArray);
            } else {
              setSelectionIds([...selectionIds, id]);
              const data = [...selectedKits, ...kits];
              setSelectedKits(data);
            }
            restProps.onToggle();
          }}
        />
      </div>
    );
  };

  /************************* Locations Cell Header Table  Selection Cell Component *******************************/
  const selectionLocationHeaderCellComponent = (restProps) => {
    let array = [];
    let indexArray = [];
    let items = [];
    rows?.map((item, index) => {
      indexArray.push(index);
      array.push(item?.completeItem?.uuid);
      items.push(item.completeItem);
    });
    if (selectionIds?.length) {
      return null;
    } else {
      return (
        <Table.Cell {...restProps}>
          <div
            onClick={() => {
              setSelection(indexArray);
              setSelectionIds(array);
              setSelectedLocation(items);
            }}
            className="cursor-pointer w-4 h-4 border rounded-[4px] border-bgGray -ml-3.5"></div>
        </Table.Cell>
      );
    }
  };

  //************************* Locations Cell Component Table  Selection Cell Component *******************************/
  const selectionCellLocationComponent = (restProps) => {
    let id = restProps.row.completeItem.uuid;
    let locations = [];
    locations.push(restProps.row.completeItem);

    return (
      <div className="form-check form-check-sm form-check-custom form-check-solid ms-2 mt-3">
        <input
          className={`form-check-input pointer ${
            restProps.selected && "bg-primaryColor"
          }`}
          type="checkbox"
          checked={restProps.selected}
          onChange={() => {
            if (selectionIds.includes(id)) {
              const array = selectionIds.filter(function (ele) {
                return ele !== id;
              });
              setSelectionIds(array);

              const locationsArray = selectedLocation.filter(function (ele) {
                return ele.uuid !== id;
              });
              setSelectedLocation(locationsArray);
            } else {
              setSelectionIds([...selectionIds, id]);
              const data = [...selectedLocation, ...locations];
              setSelectedLocation(data);
            }
            restProps.onToggle();
          }}
        />
      </div>
    );
  };

  /************************* ShipTo Cell Header Table  Selection Cell Component *******************************/
  const selectionShipToHeaderCellComponent = (restProps) => {
    let array = [];
    let indexArray = [];
    let items = [];
    rows?.map((item, index) => {
      indexArray.push(index);
      array.push(item?.completeItem?.uuid);
      items.push(item.completeItem);
    });
    if (selectionIds?.length) {
      return null;
    } else {
      return (
        <Table.Cell {...restProps}>
          <div
            onClick={() => {
              setSelection(indexArray);
              setSelectionIds(array);
              setSelectedShipTo(items);
            }}
            className="cursor-pointer w-4 h-4 border rounded-[4px] border-bgGray -ml-3.5"></div>
        </Table.Cell>
      );
    }
  };

  //************************* ShipTo Cell Component Table  Selection Cell Component *******************************/
  const selectionCellShipToComponent = (restProps) => {
    let id = restProps.row.completeItem.uuid;
    let locations = [];
    locations.push(restProps.row.completeItem);

    return (
      <div className="form-check form-check-sm form-check-custom form-check-solid ms-2 mt-3">
        <input
          className={`form-check-input pointer ${
            restProps.selected && "bg-primaryColor"
          }`}
          type="checkbox"
          checked={restProps.selected}
          onChange={() => {
            if (selectionIds.includes(id)) {
              const array = selectionIds.filter(function (ele) {
                return ele !== id;
              });
              setSelectionIds(array);

              const locationsArray = selectedShipTo.filter(function (ele) {
                return ele.uuid !== id;
              });
              setSelectedShipTo(locationsArray);
            } else {
              setSelectionIds([...selectionIds, id]);
              const data = [...selectedShipTo, ...locations];
              setSelectedShipTo(data);
            }
            restProps.onToggle();
          }}
        />
      </div>
    );
  };

  //************************* Revenue Table Header Selection Cell Component *******************************/
  const selectionRevenueExpensesHeaderCellComponent = (restProps) => {
    let array = [];
    let indexArray = [];
    let items = [];
    rows?.map((item, index) => {
      indexArray.push(index);
      array.push(item?.completeItem?.uuid);
      items.push(item.completeItem);
    });

    if (selectionIds?.length) {
      return null;
    } else {
      return (
        <Table.Cell {...restProps}>
          <div
            onClick={() => {
              setSelection(indexArray);
              setSelectionIds(array);
              setSelectedRevenueExpenses(items);
            }}
            className="cursor-pointer w-4 h-4 border rounded-[4px] border-bgGray -ml-3.5"></div>
        </Table.Cell>
      );
    }
  };

  //************************* Custom selection component for Revenue table *******************************/
  const selectionCellRevenueExpensesComponent = (restProps) => {
    let id = restProps.row.completeItem.uuid;
    let revenueExpenses = [];
    revenueExpenses.push(restProps.row.completeItem);

    return (
      <div className="form-check form-check-sm form-check-custom form-check-solid ms-2 mt-3">
        <input
          className="form-check-input pointer"
          type="checkbox"
          checked={restProps.selected}
          onChange={() => {
            if (selectionIds.includes(id)) {
              const array = selectionIds.filter(function (ele) {
                return ele !== id;
              });
              setSelectionIds(array);

              const revenueArray = selectedRevenueExpenses.filter(function (
                ele
              ) {
                return ele.uuid !== id;
              });
              setSelectedRevenueExpenses(revenueArray);
            } else {
              setSelectionIds([...selectionIds, id]);
              const data = [...selectedRevenueExpenses, ...revenueExpenses];
              setSelectedRevenueExpenses(data);
            }
            restProps.onToggle();
          }}
        />
      </div>
    );
  };

  //************************* Expenses Table Header Selection Cell Component *******************************/
  const selectionExpensesHeaderCellComponent = (restProps) => {
    let array = [];
    let indexArray = [];
    let items = [];
    rows?.map((item, index) => {
      indexArray.push(index);
      array.push(item?.completeItem?.uuid);
      items.push(item.completeItem);
    });

    if (selectionIds?.length) {
      return null;
    } else {
      return (
        <Table.Cell {...restProps}>
          <div
            onClick={() => {
              setSelection(indexArray);
              setSelectionIds(array);
              setSelectedExpenses(items);
            }}
            className="cursor-pointer w-4 h-4 border rounded-[4px] border-bgGray -ml-3.5"></div>
        </Table.Cell>
      );
    }
  };

  //************************* Custom selection component for Expenses table *******************************/
  const selectionCellExpensesComponent = (restProps) => {
    let id = restProps.row.completeItem.uuid;
    let expenses = [];
    expenses.push(restProps.row.completeItem);

    return (
      <div className="form-check form-check-sm form-check-custom form-check-solid ms-2 mt-3">
        <input
          className="form-check-input pointer"
          type="checkbox"
          checked={restProps.selected}
          onChange={() => {
            if (selectionIds.includes(id)) {
              const array = selectionIds.filter(function (ele) {
                return ele !== id;
              });
              setSelectionIds(array);

              const expensesArray = selectedExpenses.filter(function (ele) {
                return ele.uuid !== id;
              });
              setSelectedExpenses(expensesArray);
            } else {
              setSelectionIds([...selectionIds, id]);
              const data = [...selectedExpenses, ...expenses];
              setSelectedExpenses(data);
            }
            restProps.onToggle();
          }}
        />
      </div>
    );
  };

  // Empty Table Component
  const emptyTableComponent = (props) => (
    <Table.NoDataRow {...props}>
      <div className="flex flex-col w-fit absolute items-center mt-3 ml-[35%] ">
        <DescriptionIcon fontSize="large" color="secondary" />
        <p className="mt-2 text-black text-[13px]">
          {needsProductTable
            ? "No data added to the table. Please add product."
            : "No data added to the table."}
        </p>
      </div>
    </Table.NoDataRow>
  );

  return (
    <div
      style={{ minWidth: 300 }}
      className="overflow-x-auto overflow-y-hidden flex h-full">
      <Grid rows={rows} columns={columns}>
        <VirtualTable />
        <PagingState
          currentPage={currentPage}
          onCurrentPageChange={setCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
        />
        {dataProviders?.map((dataProvider, index) => {
          return (
            <DataTypeProvider
              key={index}
              for={dataProvider.columnName}
              formatterComponent={dataProvider.func}
            />
          );
        })}
        {!multiSelection && (
          <SelectionState
            selection={selection}
            onSelectionChange={setSelection}
          />
        )}
        {!pagination && <IntegratedPaging />}
        {!multiSelection && <IntegratedSelection />}
        {/* {sorting ? <SortingState defaultSorting={[{columnName:sorting,direction:'asc'}]} /> : <SortingState defaultSorting={[{columnName:defaultSortingCol,direction:'asc'}]} />} */}
        <SortingState columnExtensions={tableColumnExtensions} />
        <IntegratedSorting />

        {!pagination ? (
          <Table
            // FIXME: Later fix this code
            containerComponent={(props) => {
              return (
                <Table.Container
                  {...props}
                  style={{
                    height: id
                      ? window.innerHeight * 0.55
                      : window.innerHeight * 0.8,
                  }}
                />
              );
            }}
            noDataRowComponent={emptyTableComponent}
            columnExtensions={
              tableColumnExtensions ? tableColumnExtensions : []
            }
            rowComponent={rowComponent}
            cellComponent={cellComponent}
          />
        ) : (
          <Table
            containerComponent={(props) => {
              return (
                <Table.Container
                  {...props}
                  style={{
                    height: needsProductTable
                      ? window.innerHeight * 0.3
                      : window.innerHeight * 0.5,
                  }}
                />
              );
            }}
            noDataRowComponent={emptyTableComponent}
            columnExtensions={
              tableColumnExtensions ? tableColumnExtensions : []
            }
            rowComponent={rowComponent}
            cellComponent={cellComponent}
          />
        )}
        <TableHeaderRow
          cellComponent={tableHeaderComponent}
          showSortingControls
        />
        {!multiSelection && (
          <TableSelection
            showSelectAll
            headerCellComponent={
              products
                ? selectionProductHeaderCellComponent
                : kits
                ? selectionKitsHeaderCellComponent
                : locations
                ? selectionLocationHeaderCellComponent
                : shipTo
                ? selectionShipToHeaderCellComponent
                : revenueExpenses
                ? selectionRevenueExpensesHeaderCellComponent
                : expenses
                ? selectionExpensesHeaderCellComponent
                : selectionHeaderCellComponent
            }
            cellComponent={
              facilities
                ? selectionCellFacilitiesComponent
                : customer
                ? selectionCellCustomerComponent
                : products
                ? selectionCellProductComponent
                : kits
                ? selectionCellKitsComponent
                : locations
                ? selectionCellLocationComponent
                : shipTo
                ? selectionCellShipToComponent
                : revenueExpenses
                ? selectionCellRevenueExpensesComponent
                : expenses
                ? selectionCellExpensesComponent
                : selectionCellUserComponent
            }
          />
        )}
        {!pagination && (
          <PagingPanel
            pageSizes={pageSizes}
            containerComponent={
              rows?.length
                ? CustomPagination
                : () => {
                    return null;
                  }
            }
          />
        )}
      </Grid>
    </div>
  );
};
