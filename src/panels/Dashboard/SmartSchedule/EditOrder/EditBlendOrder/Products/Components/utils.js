import React, { useState } from "react";
import DescriptionIcon from "@mui/icons-material/Description";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TablePagination from "@mui/material/TablePagination";
import SettingsIcon from "@mui/icons-material/Settings";

import Delete from "@mui/icons-material/Delete";
import { Button, CustomModal, TextField } from "../../../../../../../shared";
import { Add, Clear } from "@mui/icons-material";
import { Typography } from "@mui/material";

export const ProductTable = ({
  setIsBarcodePreview,
  setPreviewBarCodeObj,
  tableRows,
  setTableRows,
  putAwayRows,
  setPutAwayRows,
  dropdowndata,
  handleDelteRow,
  showProdDetailsList,
  setShowProdDetailsList,
  showPutAwayButton,
  readyPutAwayButton,
  setReadyPutAwayButton,
  showCommitButton,
}) => {
  const tableHeadings = [
    { title: "Item", width: "w-[320px]" },
    { title: "Status", width: "w-[250px]" },
    { title: "QTY Ordered", width: "w-[200px]" },
    { title: "QTY Available", width: "w-[200px]" },
    { title: "Location", width: "w-[120px]" },
    { title: "Lot#", width: "w-[100px]" },
    { title: "LotID1", width: "w-[100px]" },
    { title: "LotID2", width: "w-[100px]" },
    { title: "Barcode", width: "w-[150px]" },
    { title: "Manage", width: "w-[200px]" },
  ];

  const putAwayRowsTableHeadings = [
    { title: "Item", width: "w-[250px]" },
    { title: "Status", width: "w-[250px]" },
    { title: "Location", width: "w-[120px]" },
    { title: "Lot#", width: "w-[100px]" },
    { title: "LotID1", width: "w-[100px]" },
    { title: "LotID2", width: "w-[100px]" },
    { title: "Barcode", width: "w-[150px]" },
  ];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="w-full">
      <div className="w-full overflow-auto">
        <table className="bg-white text-black table-fixed border-separate w-full shadow-none">
          {/* Table Header */}
          <thead className="sticky top-0 bg-lightGray z-[30]">
            {showProdDetailsList ? (
              <tr>
                {tableHeadings?.map((item, index) => {
                  return item?.title === "Manage" ? (
                    ""
                  ) : (
                    <th
                      className={`${item.width} font-medium !pl-5 border-b-2 py-2 text-[12px] text-darkGray`}
                      key={index}>
                      {item.title}
                    </th>
                  );
                })}
              </tr>
            ) : showPutAwayButton || readyPutAwayButton ? (
              <tr>
                {putAwayRowsTableHeadings?.map((item, index) => {
                  return (
                    <th
                      className={`${item.width} font-medium !pl-5 border-b-2 py-2 text-[12px] text-darkGray`}
                      key={index}>
                      {item.title}
                    </th>
                  );
                })}
              </tr>
            ) : showCommitButton ? (
              ""
            ) : (
              <tr>
                {tableHeadings?.map((item, index) => {
                  return (
                    <th
                      className={`${item.width} font-medium !pl-5 border-b-2 py-2 text-[12px] text-darkGray`}
                      key={index}>
                      {item.title}
                    </th>
                  );
                })}
              </tr>
            )}
          </thead>

          {/* Table Body */}

          {showProdDetailsList ? (
            <tbody>
              {tableRows?.productDetails?.length > 0 ? (
                tableRows?.productDetails?.map((item, index) => {
                  return (
                    <>
                      {/* Item Rows */}
                      <tr
                        className={`${
                          index % 2 !== 0 ? "bg-lightGray" : "bg-white"
                        }`}
                        key={index}>
                        <td
                          className={`text-sm text-black py-2 !pl-5 rounded-tl-[6px] rounded-bl-[6px]`}>
                          {item?.itemName}
                        </td>

                        <td className="text-sm py-2 relative ">
                          <div className="bg-green-300 rounded-md flex items-center px-2 text-[12px] w-fit justify-center h-6 ml-4">
                            Picked
                          </div>
                        </td>

                        <td className="text-sm pl-8 py-2 relative ">
                          {item?.qty_ordered} {item?.qty_ordered_unit?.name}
                        </td>
                        <td className="text-sm pl-8 py-2">
                          {item?.qty_available} LBS
                        </td>

                        <td className="text-sm py-2 pl-3">
                          {item?.location?.name}
                        </td>
                        <td className="text-sm py-2 pl-3">{item?.lot}</td>
                        <td className="text-sm py-2 pl-3">{item?.lotID1}</td>

                        <td className="text-sm py-2 pl-3">{item?.lotID2}</td>

                        <td className="text-sm pl-6 py-2">
                          <div className="flex gap-2 mr-2">
                            <VisibilityIcon
                              fontSize="small"
                              color="secondary"
                              className="cursor-pointer"
                              onClick={() => {
                                setIsBarcodePreview(true);
                                setPreviewBarCodeObj({
                                  description: item?.itemName,
                                  barcodeNum: item?.barcode,
                                });
                              }}
                            />
                            {item?.barcode}
                          </div>
                        </td>
                      </tr>
                    </>
                  );
                })
              ) : (
                // Empty Table Placeholder
                <tr className="flex items-center justify-center w-[80vw]">
                  <div className="flex flex-col items-center mt-3">
                    <DescriptionIcon fontSize="large" color="secondary" />
                    <p className="mt-2 text-black text-[13px]">
                      No data added to the table.
                    </p>
                  </div>
                </tr>
              )}
            </tbody>
          ) : showPutAwayButton ? (
            <tbody>
              {putAwayRows?.productDetails?.length > 0 ? (
                putAwayRows?.productDetails?.map((item, index) => {
                  return (
                    <>
                      {/* Item Rows */}
                      <tr
                        className={`${
                          index % 2 !== 0 ? "bg-lightGray" : "bg-white"
                        }`}
                        key={index}>
                        <td
                          className={`text-sm text-black py-2 !pl-5 rounded-tl-[6px] rounded-bl-[6px]`}>
                          {item?.itemName}
                        </td>

                        <td className="text-sm py-2 pl-3 relative ">
                          {item?.status}
                        </td>

                        <td className="text-sm py-2 pl-3">
                          <select
                            className="border-2 rounded py-[6px] w-[102px] focus:border-primaryColor focus:outline-none"
                            name="location"
                            id="location"
                            onChange={(e) => {
                              const location = JSON.parse(e.target.value);
                              let data = [...putAwayRows?.productDetails];
                              data[index].location = location;
                              setPutAwayRows({
                                ...putAwayRows,
                                productDetails: data,
                              });
                            }}>
                            <option value="" selected disabled hidden>
                              {item?.location?.name}
                            </option>
                            {dropdowndata?.location?.map((loca, index) => {
                              return (
                                <option
                                  key={index}
                                  value={JSON.stringify(loca)}>
                                  {loca?.name}
                                </option>
                              );
                            })}
                          </select>
                        </td>

                        <td className="text-sm py-2 pl-3">
                          <input
                            value={item?.lot}
                            className="border-2 rounded-[6px] bg-white px-2 py-[6px] w-20 focus:border-primaryColor focus:outline-none"
                            onChange={(e) => {
                              e.target.value = e.target.value.replace(
                                /[^\d]/g,
                                ""
                              );
                              let data = [...putAwayRows?.productDetails];
                              data[index].lot = e.target.value;
                              setPutAwayRows({
                                ...putAwayRows,
                                productDetails: data,
                              });
                            }}
                          />
                        </td>
                        <td className="text-sm py-2 pl-5">
                          <input
                            value={item?.lotID1}
                            className="border-2 rounded-[6px] bg-white px-2 py-[6px] w-20 focus:border-primaryColor focus:outline-none"
                            onChange={(e) => {
                              e.target.value = e.target.value.replace(
                                /[^\d]/g,
                                ""
                              );
                              let data = [...putAwayRows?.productDetails];
                              data[index].lotID1 = e.target.value;
                              setPutAwayRows({
                                ...putAwayRows,
                                productDetails: data,
                              });
                            }}
                          />
                        </td>
                        <td className="text-sm py-2 pl-5">
                          <input
                            value={item?.lotID2}
                            className="border-2 rounded-[6px] bg-white px-2 py-[6px] w-20 focus:border-primaryColor focus:outline-none"
                            onChange={(e) => {
                              e.target.value = e.target.value.replace(
                                /[^\d]/g,
                                ""
                              );
                              let data = [...putAwayRows?.productDetails];
                              data[index].lotID2 = e.target.value;
                              setPutAwayRows({
                                ...putAwayRows,
                                productDetails: data,
                              });
                            }}
                          />
                        </td>

                        <td className="text-sm pl-6 py-2">
                          <div className="flex gap-2 mr-2">
                            <VisibilityIcon
                              fontSize="small"
                              color="secondary"
                              className="cursor-pointer"
                              onClick={() => {
                                setIsBarcodePreview(true);
                                setPreviewBarCodeObj({
                                  description: item?.itemName,
                                  barcodeNum: item?.barcode,
                                });
                              }}
                            />
                            {item?.barcode}
                          </div>
                        </td>
                      </tr>
                    </>
                  );
                })
              ) : (
                // Empty Table Placeholder
                <tr className="flex items-center justify-center w-[80vw]">
                  <div className="flex flex-col items-center mt-3">
                    <DescriptionIcon fontSize="large" color="secondary" />
                    <p className="mt-2 text-black text-[13px]">
                      No data added to the table.
                    </p>
                  </div>
                </tr>
              )}
            </tbody>
          ) : readyPutAwayButton ? (
            <tbody>
              {putAwayRows?.productDetails?.length > 0 ? (
                putAwayRows?.productDetails?.map((item, index) => {
                  return (
                    <>
                      {/* Item Rows */}
                      <tr
                        className={`${
                          index % 2 !== 0 ? "bg-lightGray" : "bg-white"
                        }`}
                        key={index}>
                        <td className="text-sm text-black py-2 !pl-5 rounded-tl-[6px] rounded-bl-[6px]">
                          {item?.itemName}
                        </td>
                        <td className="text-sm py-2 pl-4">
                          {/* {item?.status} */} Stored
                        </td>
                        <td className="text-sm py-2 pl-4">
                          {item?.location?.name}
                        </td>
                        <td className="text-sm py-2 pl-6">{item?.lot}</td>
                        <td className="text-sm py-2 pl-6">{item?.lotID1}</td>
                        <td className="text-sm py-2 pl-6">{item?.lotID2}</td>

                        <td className="text-sm pl-6 py-2">
                          <div className="flex gap-2 mr-2">
                            <VisibilityIcon
                              fontSize="small"
                              color="secondary"
                              className="cursor-pointer"
                              onClick={() => {
                                setIsBarcodePreview(true);
                                setPreviewBarCodeObj({
                                  description: item?.itemName,
                                  barcodeNum: item?.barcode,
                                });
                              }}
                            />
                            {item?.barcode}
                          </div>
                        </td>
                      </tr>
                    </>
                  );
                })
              ) : (
                // Empty Table Placeholder
                <tr className="flex items-center justify-center w-[80vw]">
                  <div className="flex flex-col items-center mt-3">
                    <DescriptionIcon fontSize="large" color="secondary" />
                    <p className="mt-2 text-black text-[13px]">
                      No data added to the table.
                    </p>
                  </div>
                </tr>
              )}
            </tbody>
          ) : showCommitButton ? (
            ""
          ) : (
            <tbody>
              {tableRows?.productDetails?.length > 0 ? (
                tableRows?.productDetails?.map((item, index) => {
                  return (
                    <>
                      {/* Item Rows */}
                      <tr
                        className={`${
                          index % 2 !== 0 ? "bg-lightGray" : "bg-white"
                        }`}
                        key={index}>
                        <td
                          className={`text-sm text-black py-2 !pl-5 rounded-tl-[6px]  rounded-bl-[6px] flex justify-between`}>
                          <span className="mt-2"> {item?.itemName}</span>
                          {+item?.qty_ordered > +item?.qty_available ? (
                            <div>
                              <Button
                                size="medium"
                                className="capitalize !w-max"
                                component="span"
                                variant="outlined"
                                color="primary"
                                // onClick={() => {
                                //   let data = [...tableRows?.productDetails];
                                //   data[index].qty_ordered = 0;
                                //   setTableRows({
                                //     ...tableRows,
                                //     productDetails: data,
                                //   });
                                // }}
                              >
                                Add Alternative
                              </Button>
                            </div>
                          ) : (
                            ""
                          )}
                        </td>

                        <td className="text-sm py-2 relative ">
                          <div className="flex gap-3 pl-4">
                            {+item?.qty_ordered > +item?.qty_available ? (
                              <div className="bg-red-200 rounded-md flex items-center px-2 text-[12px] w-fit justify-center h-6 mt-[8px]">
                                Items are Short
                              </div>
                            ) : (
                              <div className="bg-green-300 rounded-md flex items-center px-2 text-[12px] w-fit justify-center h-6">
                                Ready to Pick
                              </div>
                            )}
                            {+item?.qty_ordered > +item?.qty_available ? (
                              <div>
                                <Button
                                  size="medium"
                                  className="capitalize "
                                  component="span"
                                  variant="outlined"
                                  color="primary"
                                  onClick={() => {
                                    let data = [...tableRows?.productDetails];
                                    data[index].qty_ordered = 0;
                                    setTableRows({
                                      ...tableRows,
                                      productDetails: data,
                                    });
                                  }}>
                                  Remote
                                </Button>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </td>

                        <td className="text-sm py-2 relative ">
                          <div className="flex gap-3 pl-4">
                            <input
                              value={item?.qty_ordered}
                              className="border-2 rounded-[6px] bg-white px-2 py-[6px] w-20 focus:border-primaryColor focus:outline-none"
                              onChange={(e) => {
                                e.target.value = e.target.value.replace(
                                  /[^\d]/g,
                                  ""
                                );
                                let data = [...tableRows?.productDetails];
                                data[index].qty_ordered = e.target.value;
                                setTableRows({
                                  ...tableRows,
                                  productDetails: data,
                                });
                              }}
                            />
                            <select
                              className="border-2 rounded pr-2 w-20 focus:border-primaryColor focus:outline-none"
                              name="unit"
                              id="unit"
                              onChange={(e) => {
                                const unit = JSON.parse(e.target.value);
                                let data = [...tableRows?.productDetails];
                                data[index].unit = unit;
                                setTableRows({
                                  ...tableRows,
                                  productDetails: data,
                                });
                              }}>
                              <option value="" selected disabled hidden>
                                {item?.qty_ordered_unit?.name}
                              </option>
                              {dropdowndata?.unit?.map((unit, index) => {
                                return (
                                  <option
                                    key={index}
                                    value={JSON.stringify(unit)}>
                                    {unit?.name}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </td>
                        <td className="text-sm pl-10 py-2">
                          {item?.qty_available} LBS
                        </td>

                        <td className="text-sm py-2 pl-3">
                          <select
                            className="border-2 rounded py-[6px] w-[102px] focus:border-primaryColor focus:outline-none"
                            name="location"
                            id="location"
                            onChange={(e) => {
                              const location = JSON.parse(e.target.value);
                              let data = [...tableRows?.productDetails];
                              data[index].location = location;
                              setTableRows({
                                ...tableRows,
                                productDetails: data,
                              });
                            }}>
                            <option value="" selected disabled hidden>
                              {item?.location?.name}
                            </option>
                            {dropdowndata?.location?.map((loca, index) => {
                              return (
                                <option
                                  key={index}
                                  value={JSON.stringify(loca)}>
                                  {loca?.name}
                                </option>
                              );
                            })}
                          </select>
                        </td>
                        <td className="text-sm py-2 pl-3">
                          <input
                            value={item?.lot}
                            className="border-2 rounded-[6px] bg-white px-2 py-[6px] w-20 focus:border-primaryColor focus:outline-none"
                            onChange={(e) => {
                              e.target.value = e.target.value.replace(
                                /[^\d]/g,
                                ""
                              );
                              let data = [...tableRows?.productDetails];
                              data[index].lot = e.target.value;
                              setTableRows({
                                ...tableRows,
                                productDetails: data,
                              });
                            }}
                          />
                        </td>
                        <td className="text-sm py-2 pl-3">
                          <input
                            value={item?.lotID1}
                            className="border-2 rounded-[6px] bg-white px-2 py-[6px] w-20 focus:border-primaryColor focus:outline-none"
                            onChange={(e) => {
                              e.target.value = e.target.value.replace(
                                /[^\d]/g,
                                ""
                              );
                              let data = [...tableRows?.productDetails];
                              data[index].lotID1 = e.target.value;
                              setTableRows({
                                ...tableRows,
                                productDetails: data,
                              });
                            }}
                          />
                        </td>

                        <td className="text-sm py-2 pl-3">
                          <input
                            value={item?.lotID2}
                            className="border-2 rounded-[6px] bg-white px-2 py-[6px] w-20 focus:border-primaryColor focus:outline-none"
                            onChange={(e) => {
                              e.target.value = e.target.value.replace(
                                /[^\d]/g,
                                ""
                              );
                              let data = [...tableRows?.productDetails];
                              data[index].lotID2 = e.target.value;
                              setTableRows({
                                ...tableRows,
                                productDetails: data,
                              });
                            }}
                          />
                        </td>

                        <td className="text-sm pl-6 py-2">
                          <div className="flex gap-2 mr-2">
                            <VisibilityIcon
                              fontSize="small"
                              color="secondary"
                              className="cursor-pointer"
                              onClick={() => {
                                setIsBarcodePreview(true);
                                setPreviewBarCodeObj({
                                  description: item?.itemName,
                                  barcodeNum: item?.barcode,
                                });
                              }}
                            />
                            {item?.barcode}
                          </div>
                        </td>

                        <td className="rounded-t rounded-b pl-6">
                          <SettingsIcon
                            color="secondary"
                            className="cursor-pointer"
                          />
                        </td>
                      </tr>
                    </>
                  );
                })
              ) : (
                // Empty Table Placeholder
                <tr className="flex items-center justify-center w-[80vw]">
                  <div className="flex flex-col items-center mt-3">
                    <DescriptionIcon fontSize="large" color="secondary" />
                    <p className="mt-2 text-black text-[13px]">
                      No data added to the table.
                    </p>
                  </div>
                </tr>
              )}
            </tbody>
          )}
        </table>
        {showCommitButton && (
          <>
            <div className="py-2 px-1 bg-lightGray mx-4">
              <p className="font-bold">Verify Production Information</p>
            </div>
            <div className="flex w-full">
              <div class="flex flex-col flex-auto px-4 py-2 w-3/5">
                <div className="bg-lightGray w-fit px-2 py-1 font-bold">
                  <span> Production Order Details</span>
                </div>
                <dl class="divide-y divide-lightGray text-sm w-full m-0">
                  <div class="grid gap-1 py-1 sm:grid-cols-2 sm:gap-4">
                    <dt class="font-medium text-gray-900 flex flex-auto">
                      Order Id
                    </dt>
                    <dd class="text-gray-900 !m-0 flex flex-auto">
                      23156456-651613
                    </dd>
                  </div>

                  <div class="grid gap-1 py-1 sm:grid-cols-2 sm:gap-4">
                    <dt class="font-medium text-gray-900">Customer</dt>
                    <dd class="text-gray-900 !m-0">Production Order</dd>
                  </div>

                  <div class="grid gap-1 py-1 sm:grid-cols-2 sm:gap-4">
                    <dt class="font-medium text-gray-900">Product</dt>
                    <dd class="text-gray-900 !m-0">Colin Francis</dd>
                  </div>

                  <div class="grid gap-1 py-1 sm:grid-cols-2 sm:gap-4">
                    <dt class="font-medium text-gray-900">Description</dt>
                    <dd class="text-gray-900 !m-0">Est Possimus Quae</dd>
                  </div>
                  <div class="grid gap-1 py-1 sm:grid-cols-2 sm:gap-4">
                    <dt class="font-medium text-gray-900">Date</dt>
                    <dd class="text-gray-900 !m-0">10/03/23</dd>
                  </div>
                  <div class="grid gap-1 py-1 sm:grid-cols-2 sm:gap-4">
                    <dt class="font-medium text-gray-900">Ordered</dt>
                    <dd class="text-gray-900 !m-0">12 LBS</dd>
                  </div>
                  <div class="grid gap-1 py-1 sm:grid-cols-2 sm:gap-4">
                    <dt class="font-medium text-gray-900">Finished</dt>
                    <dd class="text-gray-900 !m-0">
                      0 EA{" "}
                      <span className="text-gray-400">(0.0% of order)</span>
                    </dd>
                  </div>
                  <div class="grid gap-1 py-1 sm:grid-cols-2 sm:gap-4">
                    <dt class="font-medium text-gray-900">Cost</dt>
                    <dd class="text-gray-900 !m-0">
                      $0 <span className="text-gray-400">($0.000 per EA)</span>
                    </dd>
                  </div>
                  <div class="grid gap-1 py-1 sm:grid-cols-2 sm:gap-4">
                    <dt class="font-medium text-gray-900">Base Price</dt>
                    <dd class="text-gray-900 !m-0">
                      $0.00{" "}
                      <span className="text-gray-400">
                        ($123.00000000 per EA)
                      </span>
                    </dd>
                  </div>
                  <div class="grid gap-1 py-1 sm:grid-cols-2 sm:gap-4">
                    <dt class="font-medium text-gray-900">Production Notes</dt>
                    <dd class="text-gray-900 !m-0">1213123</dd>
                  </div>
                </dl>
                <div className="bg-lightGray px-3">
                  <p className="font-bold text-sm">
                    <span>Total Invoice:</span> <span>$0.00</span>
                  </p>
                </div>
              </div>
              <div class="flex flex-auto w-2/5 pt-5">
                <div class="md:pr-10 md:py-6">
                  <div class="mb-2">
                    <h4 class="font-semibold text-sm text-gray-900">
                      Order Qty
                    </h4>
                    <p class="text-xs">
                      Amount calculated for 12 LBS of production
                    </p>
                  </div>
                  <div class="mb-2">
                    <h2 class="font-semibold text-sm text-gray-900">
                      Calculated Qty
                    </h2>
                    <p class="text-xs">AMount calculated for 0 of production</p>
                  </div>
                  <div class="mb-2">
                    <h2 class="font-semibold text-sm text-gray-900">
                      Actual Usage
                    </h2>
                    <p class="text-xs">
                      Total AMount actualy removed from inventory
                    </p>
                  </div>
                  <div class="mb-2">
                    <h2 class="font-semibold text-sm text-gray-900">Waste</h2>
                    <p class="text-xs">
                      Total AMount of waste reported by the production crew
                    </p>
                  </div>
                  <div class="mb-2">
                    <h2 class="font-semibold text-sm text-gray-900">
                      Base Price
                    </h2>
                    <p class="text-xs">
                      Price per BRL multiplied by finished BRl count
                    </p>
                  </div>
                  <div class="mb-2">
                    <h2 class="font-semibold text-sm text-gray-900">
                      Extra Charges after Base Price
                    </h2>
                    <p class="text-xs">Extra Charges for work order</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full px-4 py-2">
              <div className="bg-lightGray w-fit px-2 py-1 font-bold">
                <span> Products Used in Production</span>
              </div>
              <table class="border-collapse border !border-lightGray w-full">
                <thead>
                  <tr>
                    <th class="border border-gray-300 font-bold text-center bg-lightGray">
                      Kit Item
                    </th>
                    <th class="border border-gray-300 font-bold text-center bg-lightGray">
                      UOM
                    </th>
                    <th class="border border-gray-300 font-bold text-center bg-lightGray">
                      Ordered
                    </th>
                    <th class="border border-gray-300 font-bold text-center bg-lightGray">
                      Calculated
                    </th>
                    <th class="border border-gray-300 font-bold text-center bg-lightGray">
                      Actual
                    </th>
                    <th class="border border-gray-300 font-bold text-center bg-lightGray">
                      Waste
                    </th>
                    <th class="border border-gray-300 font-bold text-center bg-lightGray">
                      Waste%
                    </th>
                    <th class="border border-gray-300 font-bold text-center bg-lightGray">
                      InputWaste
                    </th>
                    <th class="border border-gray-300 font-bold text-center bg-lightGray">
                      InputWaste%
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="border border-lightGray text-right">
                      Kit Parent
                    </td>
                    <td class="border border-lightGray text-right">LBS</td>
                    <td class="border border-lightGray text-right"></td>
                    <td class="border border-lightGray text-right"></td>
                    <td class="border border-lightGray text-right">12</td>
                    <td class="border border-lightGray text-right">12</td>
                    <td class="border border-lightGray text-right">100.00%</td>
                    <td class="border border-lightGray text-right"></td>
                    <td class="border border-lightGray text-right"></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="w-full px-4 py-2">
              <div className="bg-lightGray w-fit px-2 py-1 font-bold">
                <span> Product Finished Locations </span>
              </div>
              <table class="border-collapse border !border-lightGray w-full">
                <thead>
                  <tr>
                    <th class="border border-lightGray font-bold text-center bg-lightGray">
                      Location
                    </th>
                    <th class="border border-lightGray font-bold text-center bg-lightGray">
                      Qty1
                    </th>
                    <th class="border border-lightGray font-bold text-center bg-lightGray">
                      Qty2
                    </th>
                    <th class="border border-lightGray font-bold text-center bg-lightGray">
                      Lot #
                    </th>
                    <th class="border border-lightGray font-bold text-center bg-lightGray">
                      Prod Date
                    </th>
                    <th class="border border-lightGray font-bold text-center bg-lightGray">
                      Exp Date
                    </th>
                    <th class="border border-lightGray font-bold text-center bg-lightGray">
                      LotD1
                    </th>
                    <th class="border border-lightGray font-bold text-center bg-lightGray">
                      LotD2
                    </th>
                    <th class="border border-lightGray font-bold text-center bg-lightGray">
                      Pallet #
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr></tr>
                </tbody>
              </table>
            </div>

            <div className="w-full px-4 py-2">
              <div className="bg-lightGray w-fit px-2 py-1 font-bold">
                <span>Direct Material Usage</span>
              </div>
              <table class="border-collapse border !border-lightGray w-full">
                <thead>
                  <tr>
                    <th class="border border-lightGray font-bold text-center bg-lightGray">
                      Item
                    </th>
                    <th class="border border-lightGray font-bold text-center bg-lightGray">
                      Unit Cost
                    </th>
                    <th class="border border-lightGray font-bold text-center bg-lightGray">
                      Quantity
                    </th>
                    <th class="border border-lightGray font-bold text-center bg-lightGray">
                      Cost
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="border border-lightGray text-right">
                      20in Stretch Film (Machine Wrap) WCP
                    </td>
                    <td class="border border-lightGray text-right">
                      $77.19 / roll
                    </td>
                    <td class="border border-lightGray text-right">2</td>
                    <td class="border border-lightGray text-right">$15.38</td>
                  </tr>
                  <tr>
                    <td class="border border-lightGray text-right">
                      18x1500 80GA Stretch Film (Hand Wrap)
                    </td>
                    <td class="border border-lightGray text-right">
                      $7.76 / roll
                    </td>
                    <td class="border border-lightGray text-right">3</td>
                    <td class="border border-lightGray text-right">23.28</td>
                  </tr>
                </tbody>
              </table>
              <div className="bg-lightGray px-3 flex justify-end">
                <p className="font-bold text-sm">
                  <span>Total Invoice:</span> <span>$177.56</span>
                </p>
              </div>
            </div>

            <div className="w-full px-4 py-2">
              <div className="bg-lightGray w-fit px-2 py-1 font-bold">
                <span>Kit Item Usage by Location</span>
              </div>
              <table class="border-collapse border !border-gray-400 w-full">
                <thead>
                  <tr>
                    <th class="border border-lightGray font-bold text-center bg-lightGray">
                      Location
                    </th>
                    <th class="border border-lightGray font-bold text-center bg-lightGray">
                      Item
                    </th>
                    <th class="border border-lightGray font-bold text-center bg-lightGray">
                      Description
                    </th>
                    <th class="border border-lightGray font-bold text-center bg-lightGray">
                      Lot#
                    </th>
                    <th class="border border-lightGray font-bold text-center bg-lightGray">
                      LotD1
                    </th>
                    <th class="border border-lightGray font-bold text-center bg-lightGray">
                      LotD2
                    </th>
                    <th class="border border-lightGray font-bold text-center bg-lightGray">
                      Used
                    </th>
                    <th class="border border-lightGray font-bold text-center bg-lightGray">
                      Cost
                    </th>
                    <th class="border border-lightGray font-bold text-center bg-lightGray">
                      UOM
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="border border-lightGray text-right">AS1998</td>
                    <td class="border border-lightGray text-right">
                      Kit Parent
                    </td>
                    <td class="border border-lightGray text-right">
                      Testing Kit Parent
                    </td>
                    <td class="border border-lightGray text-right">400</td>
                    <td class="border border-lightGray text-right"></td>
                    <td class="border border-lightGray text-right"></td>
                    <td class="border border-lightGray text-right">-12.00</td>
                    <td class="border border-lightGray text-right">0.0000</td>
                    <td class="border border-lightGray text-right">LBS</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Table Pagination */}
      {showPutAwayButton || readyPutAwayButton ? (
        <div className="w-full mt-4">
          <TablePagination
            component="div"
            sx={{
              "& .MuiToolbar-root.MuiToolbar-gutters.MuiToolbar-regular": {
                display: "flex",
                justifyContent: "flex-start",
                margin: 0,
                padding: 0,
                paddingLeft: "13px",
                borderTop: "1px solid #e6e6e6",
              },
              "& .MuiToolbar-root.MuiToolbar-gutters.MuiToolbar-regular > div:first-of-type":
                {
                  display: "none",
                },

              "& .MuiToolbar-root.MuiToolbar-gutters.MuiToolbar-regular > div:nth-child(3)":
                {
                  fontSize: "15px",
                  marginLeft: "15px",
                },

              "& .MuiToolbar-root.MuiToolbar-gutters.MuiToolbar-regular > p:nth-child(2)":
                {
                  fontSize: "12px",
                },

              "& .MuiToolbar-root.MuiToolbar-gutters.MuiToolbar-regular > p:nth-child(4)":
                {
                  marginLeft: "auto",
                  fontSize: "12px",
                },

              "& .MuiTablePagination-actions button > svg": {
                fontSize: "20px",
              },
            }}
            count={putAwayRows?.productDetails?.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      ) : showCommitButton ? (
        " "
      ) : (
        <div className="w-full">
          <TablePagination
            component="div"
            sx={{
              "& .MuiToolbar-root.MuiToolbar-gutters.MuiToolbar-regular": {
                display: "flex",
                justifyContent: "flex-start",
                margin: 0,
                padding: 0,
                paddingLeft: "13px",
                borderTop: "1px solid #e6e6e6",
              },
              "& .MuiToolbar-root.MuiToolbar-gutters.MuiToolbar-regular > div:first-of-type":
                {
                  display: "none",
                },

              "& .MuiToolbar-root.MuiToolbar-gutters.MuiToolbar-regular > div:nth-child(3)":
                {
                  fontSize: "15px",
                  marginLeft: "15px",
                },

              "& .MuiToolbar-root.MuiToolbar-gutters.MuiToolbar-regular > p:nth-child(2)":
                {
                  fontSize: "12px",
                },

              "& .MuiToolbar-root.MuiToolbar-gutters.MuiToolbar-regular > p:nth-child(4)":
                {
                  marginLeft: "auto",
                  fontSize: "12px",
                },

              "& .MuiTablePagination-actions button > svg": {
                fontSize: "20px",
              },
            }}
            count={tableRows?.productDetails?.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      )}
    </div>
  );
};

export const DirectMaterialModal = ({
  isOpenDirectMaterial,
  setIsOpenDirectMaterial,
}) => {
  return (
    <CustomModal open={isOpenDirectMaterial} width={window.innerWidth * 0.4}>
      <div className="mx-3">
        {/* Header Row */}
        <div className="d-flex flex-row justify-content-between align-items-center ">
          <div className="flex">
            <Add className="mr-1" fontSize="small" color="primary" />
            Add Shipping Info
          </div>

          <div
            className="pointer"
            onClick={() => setIsOpenDirectMaterial(false)}>
            <Clear color="secondary" fontSize="small" />
          </div>
        </div>{" "}
        <div className="flex flex-col gap-3 mt-4 mb-4">
          <TextField
            fullWidth
            size="small"
            label="Pallet Count"
            name="palletCount"
          />
          <TextField
            fullWidth
            size="small"
            label="Pallet Weight"
            name="palletWeight"
          />
          <TextField
            fullWidth
            size="small"
            label="Tracking Number"
            name="trackingNumber"
          />
          <TextField
            fullWidth
            size="small"
            label="Customer Notes"
            name="customerNotes"
          />
        </div>
        <div className="mt-4 mb-4 flex items-center gap-2 justify-end">
          <Button
            className="capitalize "
            component="span"
            color="secondary"
            variant="outlined"
            // disabled={loading}
            onClick={() => setIsOpenDirectMaterial(false)}>
            Cancel
          </Button>
          <Button
            startIcon={<Add />}
            className="capitalize "
            component="span"
            color="primary"
            variant="contained"
            // disabled={loading}
          >
            Add Shipping Info
          </Button>
        </div>
      </div>
    </CustomModal>
  );
};

export const ProductionExtraModal = ({
  isOpenProductionExtra,
  setIsOpenProductionExtra,
}) => {
  return (
    <CustomModal open={isOpenProductionExtra} width={window.innerWidth * 0.4}>
      <div className="mx-3">
        {/* Header Row */}
        <div className="d-flex flex-row justify-content-between align-items-center ">
          <div className="flex">
            <Add className="mr-1" fontSize="small" color="primary" />
            Add Direct Material
          </div>

          <div
            className="pointer"
            onClick={() => setIsOpenProductionExtra(false)}>
            <Clear color="secondary" fontSize="small" />
          </div>
        </div>{" "}
        <div className="flex flex-col gap-3 mt-4 mb-4">
          <TextField
            fullWidth
            size="small"
            label="Pallet Count"
            name="palletCount"
          />
        </div>
        <div className="mt-4 mb-4 flex items-center gap-2 justify-end">
          <Button
            className="capitalize "
            component="span"
            color="secondary"
            variant="outlined"
            // disabled={loading}
            onClick={() => setIsOpenProductionExtra(false)}>
            Cancel
          </Button>
          <Button
            startIcon={<Add />}
            className="capitalize "
            component="span"
            color="primary"
            variant="contained"
            // disabled={loading}
          >
            Add Direct Material
          </Button>
        </div>
      </div>
    </CustomModal>
  );
};
