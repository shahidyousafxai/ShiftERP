import React, { useState } from "react";
import DescriptionIcon from "@mui/icons-material/Description";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TablePagination from "@mui/material/TablePagination";
import { Button } from "../../../../../../../shared";
import Delete from "@mui/icons-material/Delete";

export const ProductTable = ({
  setIsBarcodePreview,
  setPreviewBarCodeObj,
  productRows,
  setProductRows,
  dropdowndata,
  handleCommit,
  setMatchUUID,
  matchUUID,
  productsLoading,
  setDeleteModal,
}) => {
  const tableHeadings = [
    { title: "Item", width: "w-[230px]" },
    { title: "QTY Received", width: "w-[200px]" },
    { title: "Status", width: "w-[150px]" },
    { title: "Weight Net", width: "w-[120px]" },
    { title: "Weight Gross", width: "w-[120px]" },
    { title: "Barcode", width: "w-[200px]" },
    { title: "Location", width: "w-[120px]" },
    { title: "Total1", width: "w-[100px]" },
    { title: "Total2", width: "w-[100px]" },
    { title: "Lot#", width: "w-[100px]" },
    { title: "LotID1", width: "w-[100px]" },
    { title: "LotID2", width: "w-[100px]" },
    { title: "Pallet#", width: "w-[100px]" },
    { title: "ProdDate", width: "w-[150px]" },
    { title: "ExpDate", width: "w-[150px]" },
    { title: "Price", width: "w-[100px]" },
    { title: "Total", width: "w-[100px]" },
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
    <div className="w-full ">
      <div className="w-full max-h-[250px] overflow-auto pb-4">
        <table className="bg-white text-black table-fixed border-separate w-full shadow-none">
          <thead className="sticky top-0 bg-lightGray z-[30]">
            <tr>
              {tableHeadings.map((item, index) => {
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
          <tbody>
            {productRows?.productDetails?.length > 0 ? (
              productRows?.productDetails?.map((item, index) => {
                const isDisabled =
                  !item?.expDate ||
                  !item?.total2 ||
                  !item?.qty_unit?.name ||
                  !item?.qty_received ||
                  !item?.prodDate ||
                  !item?.pallet ||
                  !item?.lotID1 ||
                  !item?.lotID2 ||
                  !item?.lot ||
                  !item?.location?.name;

                return (
                  <>
                    {/* Item Rows */}
                    {item?.commitedStatus ? (
                      <>
                        <tr
                          className={`${
                            index % 2 !== 0 ? "bg-lightGray" : "bg-white"
                          }`}
                          key={index}>
                          <td
                            className={`text-sm text-black py-2 !pl-5 rounded-tl-[0px] rounded-bl-[0px]`}>
                            {item?.itemName}
                          </td>
                          <td
                            className={`text-sm py-2 relative ${
                              item?.qty_updated && "h-[120px]"
                            }`}>
                            <div className="flex gap-3 pl-5">
                              {item?.qty_received + " " + item?.qty_unit?.name}
                            </div>
                            {item?.qty_updated && (
                              <div
                                className={`ml-4 absolute text-[12px] text-darkGray`}>
                                The QTY has been adjusted by <br />
                                <span className="text-primaryColor underline text-[12px]">
                                  {item.qty_updated}
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="text-sm py-2 pl-5">Received</td>
                          <td className="text-sm pl-6 py-2">
                            {item?.weightNet ? item?.weightNet : "-"}
                          </td>
                          <td className="text-sm pl-6 py-2">
                            {item?.weightGross ? item?.weightGross : "-"}
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
                          <td className="text-sm py-2 pl-6">
                            {item?.location?.name ? item?.location?.name : "-"}
                          </td>
                          <td className="text-sm py-2 pl-6">
                            {item?.qty_received ? item?.qty_received : "-"}
                          </td>
                          <td className="text-sm py-2 pl-6">
                            {item?.total2 ? item?.total2 : "-"}{" "}
                          </td>
                          <td className="text-sm py-2 pl-6">
                            {item?.lot ? item?.lot : "-"}
                          </td>
                          <td className="text-sm py-2 pl-6">
                            {item?.lotID1 ? item?.lotID1 : "-"}
                          </td>

                          <td className="text-sm py-2 pl-6">
                            {item?.lotID2 ? item?.lotID2 : "-"}
                          </td>

                          <td className="text-sm py-2 pl-6">
                            {item?.pallet ? item?.pallet : "-"}
                          </td>

                          <td className="text-sm py-2 pl-6">
                            {item?.prodDate ? item?.prodDate : "-"}
                          </td>

                          <td className="text-sm py-2 pl-6">
                            {item?.expDate ? item?.expDate : "-"}
                          </td>
                          <td className="text-sm py-2 pl-6">
                            {item?.price ? item?.price : "-"}
                          </td>
                          <td className="text-sm py-2 pl-6">
                            {item?.total ? item?.total : "-"}
                          </td>
                          <td className="text-sm py-2 ">
                            <Button
                              size="small"
                              className="capitalize w-[150px]"
                              component="span"
                              variant="outlined"
                              color="primary"
                              // onClick={() => navigate("/smart-schedule")}
                            >
                              Committed
                            </Button>
                          </td>
                        </tr>
                      </>
                    ) : (
                      <>
                        <tr
                          className={`${
                            index % 2 !== 0 ? "bg-lightGray" : "bg-white"
                          }`}
                          key={index}>
                          <td
                            className={`text-sm text-black py-2 !pl-5 rounded-tl-[0px] rounded-bl-[0px]`}>
                            {item?.itemName}
                          </td>
                          <td
                            className={`text-sm py-2 relative ${
                              item?.qty_updated && "h-[120px]"
                            }`}>
                            <div className="flex pl-5">
                                {item?.qty_received + " " + item?.qty_unit?.name}
                            </div>
                            {item?.qty_updated && (
                              <div
                                className={`ml-4 absolute text-[12px] text-darkGray`}>
                                The QTY has been adjusted by <br />
                                <span className="text-primaryColor underline text-[12px]">
                                  {item.qty_updated}
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="text-sm py-2 pl-5">
                            Pending Receiving
                            {/* <select
                          className="border-2 rounded pr-1 py-[6px] ml-4 w-40 focus:border-primaryColor focus:outline-none"
                          name="status"
                          id="status"
                          onChange={(e) => {
                            const status = JSON.parse(e.target.value);
                            let data = [...productRows?.productDetails];
                            data[index].status = status;
                            setProductRows({
                              ...productRows,
                              productDetails: data,
                            });
                          }}>
                          <option value="" selected disabled hidden>
                            {item?.status?.name}
                          </option>
                          {dropdowndata?.status?.map((status, index) => {
                            return (
                              <option
                                key={index}
                                value={JSON.stringify(status)}>
                                {status?.name}
                              </option>
                            );
                          })}
                        </select> */}
                          </td>
                          <td className="text-sm pl-6 py-2">
                            {item?.weightNet ? item?.weightNet : "-"}
                          </td>
                          <td className="text-sm pl-6 py-2">
                            {item?.weightGross ? item?.weightGross : "-"}
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
                          <td className="text-sm py-2 pl-4">
                            <select
                              className="border-2 rounded py-[6px] w-[102px] focus:border-primaryColor focus:outline-none"
                              name="location"
                              id="location"
                              onChange={(e) => {
                                const location = JSON.parse(e.target.value);
                                let data = [...productRows?.productDetails];
                                data[index].location = location;
                                setProductRows({
                                  ...productRows,
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
                          <td className="text-sm py-2 pl-6">
                            {item?.qty_received ? item?.qty_received : "-"}
                            {/* <input
                          value={item?.total1}
                          className="border-2 rounded-[6px] bg-white px-2 py-[6px] w-20 focus:border-primaryColor focus:outline-none"
                          onChange={(e) => {
                            e.target.value = e.target.value.replace(
                              /[^\d]/g,
                              ""
                            );
                            let data = [...productRows?.productDetails];
                            data[index].total1 = e.target.value;
                            setProductRows({
                              ...productRows,
                              productDetails: data,
                            });
                          }}
                        /> */}
                          </td>
                          <td className="text-sm py-2 pl-3">
                            <input
                              value={item?.total2}
                              className="border-2 rounded-[6px] bg-white px-2 py-[6px] w-20 focus:border-primaryColor focus:outline-none"
                              onChange={(e) => {
                                e.target.value = e.target.value.replace(
                                  /[^\d]/g,
                                  ""
                                );
                                let data = [...productRows?.productDetails];
                                data[index].total2 = e.target.value;
                                setProductRows({
                                  ...productRows,
                                  productDetails: data,
                                });
                              }}
                            />
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
                                let data = [...productRows?.productDetails];
                                data[index].lot = e.target.value;
                                setProductRows({
                                  ...productRows,
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
                                let data = [...productRows?.productDetails];
                                data[index].lotID1 = e.target.value;
                                setProductRows({
                                  ...productRows,
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
                                let data = [...productRows?.productDetails];
                                data[index].lotID2 = e.target.value;
                                setProductRows({
                                  ...productRows,
                                  productDetails: data,
                                });
                              }}
                            />
                          </td>

                          <td className="text-sm py-2 pl-3">
                            <input
                              value={item?.pallet !== 0 ? item?.pallet : ""}
                              className="border-2 rounded-[6px] bg-white px-2 py-[6px] w-20 focus:border-primaryColor focus:outline-none"
                              onChange={(e) => {
                                e.target.value = e.target.value.replace(
                                  /[^\d]/g,
                                  ""
                                );
                                let data = [...productRows?.productDetails];
                                data[index].pallet = e.target.value;
                                setProductRows({
                                  ...productRows,
                                  productDetails: data,
                                });
                              }}
                            />
                          </td>

                          <td className="text-sm py-2 pl-3">
                            <input
                              value={item?.prodDate}
                              type="date"
                              className="border-2 rounded-[6px] bg-white px-2 py-[6px] w-32 focus:border-primaryColor focus:outline-none"
                              onChange={(e) => {
                                let data = [...productRows?.productDetails];
                                data[index].prodDate = e.target.value;
                                setProductRows({
                                  ...productRows,
                                  productDetails: data,
                                });
                              }}
                            />
                          </td>

                          <td className="text-sm py-2 pl-3">
                            <input
                              value={item?.expDate}
                              type="date"
                              placeholder="Select Date"
                              className="border-2 rounded-[6px] bg-white px-2 py-[6px] w-32 focus:border-primaryColor focus:outline-none"
                              onChange={(e) => {
                                let data = [...productRows?.productDetails];
                                data[index].expDate = e.target.value;
                                setProductRows({
                                  ...productRows,
                                  productDetails: data,
                                });
                              }}
                            />
                          </td>
                          <td className="text-sm py-2 pl-6">
                            {item?.price ? item?.price : "-"}
                          </td>
                          <td className="text-sm py-2 pl-6">
                            {item?.total ? item?.total : "-"}
                          </td>
                          <td className="text-sm py-2 ">
                            <Button
                              size="small"
                              className={`capitalize w-[150px] ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
                              component="span"
                              variant="outlined"
                              color={`${isDisabled ? "secondary" : "primary"}`}
                              // loading={productsLoading}
                              onClick={() => !isDisabled && handleCommit(item)}>
                              {matchUUID === item?.itemUUID && productsLoading
                                ? "Committing..."
                                : `Commit Receiving`}
                            </Button>
                            {productRows?.productDetails?.length > 1 && (
                              <Delete
                                color="secondary"
                                className="cursor-pointer ml-3"
                                onClick={() => {
                                  setDeleteModal(true);
                                  setMatchUUID(item);
                                }}
                              />
                            )}
                          </td>
                        </tr>
                      </>
                    )}
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
      {productRows?.productDetails?.length > 0 && (
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
                // borderTop: "2px solid #e6e6e6",
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
            count={productRows?.productDetails?.length}
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
