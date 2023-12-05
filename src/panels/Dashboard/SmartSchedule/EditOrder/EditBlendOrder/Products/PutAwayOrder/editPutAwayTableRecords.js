import React, { useState } from "react";
import DescriptionIcon from "@mui/icons-material/Description";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TablePagination from "@mui/material/TablePagination";

export const EditPutAwayTableRecords = ({
  setIsBarcodePreview,
  setPreviewBarCodeObj,
  putAwayRows,
  setPutAwayRows,
  dropdowndata,
  handleDelteRow,
}) => {
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
    <>
      <div className="w-full h-[100px] overflow-auto">
        <table className="bg-white text-black table-fixed border-separate w-full shadow-none">
          {/* Table Header */}
          <thead className="sticky top-0 bg-lightGray z-[30]">
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
          </thead>

          {/* Table Body */}
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
                              <option key={index} value={JSON.stringify(loca)}>
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
        </table>
      </div>
      {/* Table Pagination */}
      <div className="w-full ">
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
    </>
  );
};
