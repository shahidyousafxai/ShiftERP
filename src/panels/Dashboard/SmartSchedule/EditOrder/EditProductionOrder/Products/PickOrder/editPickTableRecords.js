import React, { useState } from "react";
import DescriptionIcon from "@mui/icons-material/Description";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TablePagination from "@mui/material/TablePagination";
import SettingsIcon from "@mui/icons-material/Settings";
import { Button } from "../../../../../../../shared";

export const EditPickTableRecords = ({
  setIsBarcodePreview,
  setPreviewBarCodeObj,
  tableRows,
  setTableRows,
  dropdowndata,
  setSelectedProductItem,
  alternativeItem,
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
          </thead>
          {/* Table Body */}
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
                        {+item?.qty_ordered > +item?.qty_available &&
                        item?.is_remote === 0 &&
                        item?.alternative_products ? (
                          <div>
                            <Button
                              size="medium"
                              className="capitalize !w-max"
                              component="span"
                              variant="outlined"
                              color="primary"
                              onClick={() => {
                                let data = [...tableRows?.productDetails];
                                data[index].itemName =
                                  alternativeItem?.alternative_products?.name;
                                data[index].itemUUID =
                                  alternativeItem?.alternative_products?.id;
                                data[index].barcode =
                                  alternativeItem?.alternative_products?.barcode;
                                data[index].qty_available =
                                  alternativeItem?.alternative_products?.total_available_qty;
                                data[index].qty_ordered =
                                  alternativeItem?.alternative_products?.required_qty;
                                setTableRows({
                                  ...tableRows,
                                  productDetails: data,
                                });
                              }}>
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
                            item?.is_remote === 0 ? (
                              <div className="bg-red-200 rounded-md flex items-center px-2 text-[12px] w-fit justify-center h-6 mt-[8px]">
                                Items are Short
                              </div>
                            ) : (
                              <div className="bg-green-300 rounded-md flex items-center px-2 text-[12px] w-fit justify-center h-6">
                                Ready to Pick
                              </div>
                            )
                          ) : (
                            <div className="bg-green-300 rounded-md flex items-center px-2 text-[12px] w-fit justify-center h-6">
                              Ready to Pick
                            </div>
                          )}
                          {+item?.qty_ordered > +item?.qty_available &&
                          item?.is_remote === 0 ? (
                            <div>
                              <Button
                                size="medium"
                                className="capitalize "
                                component="span"
                                variant="outlined"
                                color="primary"
                                onClick={() => {
                                  let data = [...tableRows?.productDetails];
                                  data[index].is_remote = 1;
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

                      <td className="text-sm pl-6 py-2 relative ">
                        {`${item?.qty_ordered} ${item?.qty_ordered_unit?.name}`}
                      </td>
                      <td className="text-sm pl-6 py-2">
                        {`${item?.qty_available} ${item?.qty_available_unit?.name}`}
                      </td>

                      {/* Location Dropdown */}
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
                            setSelectedProductItem(item);
                          }}>
                          <option value="" selected disabled hidden>
                            {item?.location?.name}
                          </option>
                          {dropdowndata?.location?.map((loca, index) => {
                            return (
                              <option key={index} value={JSON.stringify(loca)}>
                                {loca?.name}
                              </option>
                            );
                          })}
                        </select>
                      </td>

                      {/* Lot Numbers */}
                      <td className="text-sm py-2 pl-6">{item?.lot}</td>
                      <td className="text-sm py-2 pl-6">{item?.lotID1}</td>
                      <td className="text-sm py-2 pl-6">{item?.lotID2}</td>
                      {/* BarCode */}
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
        </table>
      </div>

      {/* Table Pagination */}

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
    </div>
  );
};
