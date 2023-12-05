import React, { useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DescriptionIcon from "@mui/icons-material/Description";
import AddIcon from "@mui/icons-material/Add";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { SearchBar } from "../../../../../shared";
import TablePagination from '@mui/material/TablePagination';
import "../styles.css"

export const GenerateNeedsReport = ({ weekRange }) => {
  console.log("🚀 ~ weekRange:", weekRange);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [needsData, setNeedsData] = useState([
    {
      uuid: "1",
      productName: "02-00124",
      categoryName: "Finished Good",
      description: "Aaron Favorte Rolls",
      uom: "LBS",
      onHand: "29",
      onHold: "271",
      picked: "8",
      inbound: "0",
      producing: "30",
      netAvailable: "40",
      alternativeItem: [
        {
          productName: "04-B-7424",
          categoryName: "Finished Good",
          description: "Aaron Favorte Rolls",
          uom: "LBS",
          onHand: "29",
          onHold: "271",
          picked: "8",
          inbound: "0",
          producing: "30",
          netAvailable: "40",
          uuid: "11",
        },
      ],
    },
    {
      uuid: "2",
      productName: "04-B-7424",
      categoryName: "Finished Good",
      description: "Aaron Favorte Rolls",
      uom: "LBS",
      onHand: "29",
      onHold: "271",
      picked: "8",
      inbound: "0",
      producing: "30",
      netAvailable: "40",
      alternativeItem: [],
    },
    {
      uuid: "3",
      productName: "02-00124",
      categoryName: "Finished Good",
      description: "Aaron Favorte Rolls",
      uom: "LBS",
      onHand: "29",
      onHold: "271",
      picked: "8",
      inbound: "0",
      producing: "30",
      netAvailable: "40",
      alternativeItem: [
        {
          productName: "04-B-7424",
          categoryName: "Finished Good",
          description: "Aaron Favorte Rolls",
          uom: "LBS",
          onHand: "29",
          onHold: "271",
          picked: "8",
          inbound: "0",
          producing: "30",
          netAvailable: "40",
          uuid: "21",
        },
        {
          productName: "04-B-7425",
          categoryName: "Finished Good",
          description: "Aaron Favorte Rolls",
          uom: "LBS",
          onHand: "29",
          onHold: "271",
          picked: "8",
          inbound: "0",
          producing: "30",
          netAvailable: "40",
          uuid: "211",
        },
      ],
    },
    {
      uuid: "4",
      productName: "02-00124",
      categoryName: "Finished Good",
      description: "Aaron Favorte Rolls",
      uom: "LBS",
      onHand: "29",
      onHold: "271",
      picked: "8",
      inbound: "0",
      producing: "30",
      netAvailable: "40",
      alternativeItem: [
        {
          productName: "04-B-7424",
          categoryName: "Finished Good",
          description: "Aaron Favorte Rolls",
          uom: "LBS",
          onHand: "29",
          onHold: "271",
          picked: "8",
          inbound: "0",
          producing: "30",
          netAvailable: "40",
          uuid: "21",
        },
        {
          productName: "04-B-7425",
          categoryName: "Finished Good",
          description: "Aaron Favorte Rolls",
          uom: "LBS",
          onHand: "29",
          onHold: "271",
          picked: "8",
          inbound: "0",
          producing: "30",
          netAvailable: "40",
          uuid: "211",
        },
      ],
    },
    {
      uuid: "5",
      productName: "02-00124",
      categoryName: "Finished Good",
      description: "Aaron Favorte Rolls",
      uom: "LBS",
      onHand: "29",
      onHold: "271",
      picked: "8",
      inbound: "0",
      producing: "30",
      netAvailable: "40",
      alternativeItem: [
        {
          productName: "04-B-7424",
          categoryName: "Finished Good",
          description: "Aaron Favorte Rolls",
          uom: "LBS",
          onHand: "29",
          onHold: "271",
          picked: "8",
          inbound: "0",
          producing: "30",
          netAvailable: "40",
          uuid: "21",
        },
        {
          productName: "04-B-7425",
          categoryName: "Finished Good",
          description: "Aaron Favorte Rolls",
          uom: "LBS",
          onHand: "29",
          onHold: "271",
          picked: "8",
          inbound: "0",
          producing: "30",
          netAvailable: "40",
          uuid: "211",
        },
      ],
    },
    {
      uuid: "6",
      productName: "02-00124",
      categoryName: "Finished Good",
      description: "Aaron Favorte Rolls",
      uom: "LBS",
      onHand: "29",
      onHold: "271",
      picked: "8",
      inbound: "0",
      producing: "30",
      netAvailable: "40",
      alternativeItem: [
        {
          productName: "04-B-7424",
          categoryName: "Finished Good",
          description: "Aaron Favorte Rolls",
          uom: "LBS",
          onHand: "29",
          onHold: "271",
          picked: "8",
          inbound: "0",
          producing: "30",
          netAvailable: "40",
          uuid: "21",
        },
        {
          productName: "04-B-7425",
          categoryName: "Finished Good",
          description: "Aaron Favorte Rolls",
          uom: "LBS",
          onHand: "29",
          onHold: "271",
          picked: "8",
          inbound: "0",
          producing: "30",
          netAvailable: "40",
          uuid: "211",
        },
      ],
    },
    {
      uuid: "7",
      productName: "02-00124",
      categoryName: "Finished Good",
      description: "Aaron Favorte Rolls",
      uom: "LBS",
      onHand: "29",
      onHold: "271",
      picked: "8",
      inbound: "0",
      producing: "30",
      netAvailable: "40",
      alternativeItem: [
        {
          productName: "04-B-7424",
          categoryName: "Finished Good",
          description: "Aaron Favorte Rolls",
          uom: "LBS",
          onHand: "29",
          onHold: "271",
          picked: "8",
          inbound: "0",
          producing: "30",
          netAvailable: "40",
          uuid: "21",
        },
        {
          productName: "04-B-7425",
          categoryName: "Finished Good",
          description: "Aaron Favorte Rolls",
          uom: "LBS",
          onHand: "29",
          onHold: "271",
          picked: "8",
          inbound: "0",
          producing: "30",
          netAvailable: "40",
          uuid: "211",
        },
      ],
    },
    {
      uuid: "8",
      productName: "02-00124",
      categoryName: "Finished Good",
      description: "Aaron Favorte Rolls",
      uom: "LBS",
      onHand: "29",
      onHold: "271",
      picked: "8",
      inbound: "0",
      producing: "30",
      netAvailable: "40",
      alternativeItem: [
        {
          productName: "04-B-7424",
          categoryName: "Finished Good",
          description: "Aaron Favorte Rolls",
          uom: "LBS",
          onHand: "29",
          onHold: "271",
          picked: "8",
          inbound: "0",
          producing: "30",
          netAvailable: "40",
          uuid: "21",
        },
        {
          productName: "04-B-7425",
          categoryName: "Finished Good",
          description: "Aaron Favorte Rolls",
          uom: "LBS",
          onHand: "29",
          onHold: "271",
          picked: "8",
          inbound: "0",
          producing: "30",
          netAvailable: "40",
          uuid: "211",
        },
      ],
    },
  ]);
  const [matchID, setMatchID] = useState("");
  const [isAlternativeItem, setIsAlternativeItem] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  return (
    <div>
      <div className="flex items-center mx-3 gap-4">
        <div className="flex gap-2">
          <div className="h-[35px] w-[35px] border rounded-[6px] cursor-pointer flex items-center justify-center">
            <ChevronLeftIcon color="secondary" fontSize="small" />
          </div>
          <div className="h-[35px] w-[35px] border rounded-[6px] cursor-pointer flex items-center justify-center">
            <ChevronRightIcon color="secondary" fontSize="small" />
          </div>
        </div>
        <div>
          <p className="text-darkGray text-sm">Week 1</p>
          <p className="text-black text-[13px] -mt-1 font-bold">
            Mar 6 - Mar 30, 2023
          </p>
        </div>
        <div className="flex gap-2 w-96">
          <SearchBar
            disabled={false}
            // onClear={() => setName("")}
            // onSearch={() => onProductSearch()}
            // onChange={(e) => setName(e.target.value)}
            // value={name}
          />
        </div>
      </div>
      <div className="w-full mx-auto overflow-auto h-[200px] mt-4">
        <table className=" text-black table-fixed border-separate  w-full shadow-none">
          <thead className="sticky top-0 bg-lightGray">
            <tr>
              <th className="w-8 font-medium !pl-5 border-b-2 py-[6px] text-[12px] text-darkGray"></th>
              <th className="w-36 font-medium !pl-5 border-b-2 py-[6px] text-[12px] text-darkGray">
                Product
              </th>
              <th className="w-32 font-medium border-b-2 py-[6px] text-[12px] text-darkGray">
                Category
              </th>
              <th className="w-52 font-medium border-b-2 py-[6px] text-[12px] text-darkGray">
                Description
              </th>
              <th className="w-20 font-medium border-b-2 py-[6px] text-[12px] text-darkGray">
                UOM
              </th>
              <th className="w-20 font-medium border-b-2 py-[6px] text-[12px] text-darkGray">
                On Hand
              </th>
              <th className=" w-20 font-medium border-b-2 py-[6px] text-[12px] text-darkGray">
                On Hold
              </th>
              <th className="w-20 font-medium  border-b-2 py-[6px] text-[12px] text-darkGray">
                Picked
              </th>
              <th className="w-20 font-medium  border-b-2 py-[6px] text-[12px] text-darkGray">
                In Bound
              </th>
              <th className="w-20 font-medium  border-b-2 py-[6px] text-[12px] text-darkGray">
                Producing
              </th>
              <th className="w-32 font-medium  border-b-2 py-[6px] text-[12px] text-darkGray">
                Net Available
              </th>
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            {needsData?.length > 0 ? (
              needsData?.map((item, index) => {
                return (
                  <>
                    {/* Item Rows */}
                    <tr
                      className={`${
                        index % 2 !== 0 ? "bg-lightGray" : "bg-white"
                      }`}
                      key={index}>
                      <td className="text-sm text-primaryColor py-2 !pl-5 rounded-tl-[6px] ">
                        {item?.alternativeItem?.length > 0 &&
                          (isAlternativeItem && item?.uuid === matchID ? (
                            <ArrowDropUpIcon
                              className="text-secondaryColor cursor-pointer"
                              fontSize="small"
                              onClick={() => {
                                setIsAlternativeItem(false);
                              }}
                            />
                          ) : (
                            <ArrowDropDownIcon
                              className="text-secondaryColor cursor-pointer"
                              fontSize="small"
                              onClick={() => {
                                setIsAlternativeItem(true);
                                setMatchID(item?.uuid);
                              }}
                            />
                          ))}
                      </td>
                      <td
                        className={`text-sm text-primaryColor py-2 !pl-5 rounded-tl-[6px]`}>
                        {item?.productName}
                      </td>
                      <td className="text-sm py-2">{item?.categoryName}</td>
                      <td className="text-sm py-2">{item?.description}</td>
                      <td className="text-sm py-2 ">{item?.uom}</td>
                      <td className="text-sm py-2">{item?.onHand}</td>
                      <td className="text-sm py-2 underline">{item?.onHold}</td>
                      <td className="text-sm py-2 underline">{item?.picked}</td>
                      <td className="text-sm py-2 underline">
                        {item?.inbound}
                      </td>
                      <td className="text-sm py-2 underline">
                        {item?.producing}
                      </td>
                      <td className="text-sm py-2 ">{item?.netAvailable}</td>
                      <td className="">
                        <div className="h-[20px] w-[20px] border rounded-[6px] cursor-pointer flex items-center justify-center -ml-8">
                          <AddIcon color="secondary" className="text-[16px]" />
                        </div>
                      </td>
                    </tr>

                    {/* Alternative Items Rows */}
                    {item?.uuid === matchID &&
                      isAlternativeItem &&
                      item?.alternativeItem?.length > 0 && (
                        <>
                          <tr className="!bg-white">
                            <td className="!bg-white w-fit">
                              <p
                                className={`ml-16 pt-2 text-darkGray text-[13px] w-fit`}>
                                Item
                              </p>
                            </td>
                            {/* Add other header cells here */}
                          </tr>

                          {item?.alternativeItem?.map(
                            (alternativeItem, index) => (
                              <tr className="!bg-white" key={index}>
                                <td></td> {/* Empty cell, adjust if needed */}
                                <td className="text-sm py-2 pl-5">
                                  {alternativeItem?.productName}
                                </td>
                                <td className="text-sm py-2">
                                  {alternativeItem?.categoryName}
                                </td>
                                <td className="text-sm py-2">
                                  {alternativeItem?.description}
                                </td>
                                <td className="text-sm py-2">
                                  {alternativeItem?.uom}
                                </td>
                                <td className="text-sm py-2">
                                  {alternativeItem?.onHand}
                                </td>
                                <td className="text-sm py-2 underline">
                                  {alternativeItem?.onHold}
                                </td>
                                <td className="text-sm py-2 underline">
                                  {alternativeItem?.picked}
                                </td>
                                <td className="text-sm py-2 underline">
                                  {alternativeItem?.inbound}
                                </td>
                                <td className="text-sm py-2 underline">
                                  {alternativeItem?.producing}
                                </td>
                                <td>{alternativeItem?.netAvailable}</td>
                                <td className="">
                                  <div className="h-[20px] w-[20px] border rounded-[6px] cursor-pointer flex items-center justify-center -ml-8">
                                    <AddIcon
                                      color="secondary"
                                      className="text-[16px]"
                                    />
                                  </div>
                                </td>
                              </tr>
                            )
                          )}
                        </>
                      )}
                  </>
                );
              })
            ) : (
              // Empty Table Placeholder
              <div className="flex flex-col w-44 absolute items-center mt-3 ml-[35%] ">
                <DescriptionIcon fontSize="large" color="secondary" />
                <p className="mt-2 text-black text-[13px]">
                  No data added to the table.
                </p>
              </div>
            )}
          </tbody>
        </table>
      </div>
      <div className="w-full">
        <TablePagination
          component="div"
          sx={{
            '& .MuiToolbar-root.MuiToolbar-gutters.MuiToolbar-regular': {
              display: 'flex',
              justifyContent: "flex-start",
              margin: 0,
              padding: 0,
              paddingLeft: "13px",
              borderTop: "2px solid #e6e6e6"
            },
            '& .MuiToolbar-root.MuiToolbar-gutters.MuiToolbar-regular > div:first-of-type': {
              display: 'none',
            },

            '& .MuiToolbar-root.MuiToolbar-gutters.MuiToolbar-regular > div:nth-child(3)': {
              fontSize: "15px",
              marginLeft: "15px"
            },

            '& .MuiToolbar-root.MuiToolbar-gutters.MuiToolbar-regular > p:nth-child(2)': {
              fontSize: "12px",
            },

            '& .MuiToolbar-root.MuiToolbar-gutters.MuiToolbar-regular > p:nth-child(4)': {
              marginLeft: 'auto',
              fontSize: "12px",
            },

            '& .MuiTablePagination-actions button > svg': {
              fontSize: '20px',
            },
          }}
        count={50}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
};
