import React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { black } from "../../../../../../../helpers/GlobalVariables";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {},
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
    fontWeight: "semibold",
    color: black,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    // backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    // border: 1
  },
}));

function createData(
  name,
  description,
  barcode,
  qtyOrder,
  qtyShipped,
  weightNet,
  weightGross,
  price,
  total
) {
  return {
    name,
    description,
    barcode,
    qtyOrder,
    qtyShipped,
    weightNet,
    weightGross,
    price,
    total,
  };
}

const rows = [
  createData(
    "00-000000",
    "Minimum Invoice Up Charge",
    1528510514412,
    "20 CS",
    "20 CS",
    "180 LBS",
    "180 LBS",
    "$6.75 per Lbs",
    "$1,215.00"
  ),
  createData(
    "00-000000",
    "Minimum Invoice Up Charge",
    1528510514412,
    "20 CS",
    "20 CS",
    "180 LBS",
    "180 LBS",
    "$6.75 per Lbs",
    "$1,215.00"
  ),
  createData(
    "00-000000",
    "Minimum Invoice Up Charge",
    1528510514412,
    "20 CS",
    "20 CS",
    "180 LBS",
    "180 LBS",
    "$6.75 per Lbs",
    "$1,215.00"
  ),
];
export const ProductTable = ({ orderDetailsData }) => {
  return (
    <TableContainer component={Paper} className="shadow-none">
      <Table aria-label="customized table">
        {/* Table Head */}
        <TableHead>
          <TableRow>
            <StyledTableCell
              sx={{
                border: "1px solid #ECECED",
                color: darkGray,
                margin: "0px",
                padding: "6px",
                fontSize: 11,
                paddingLeft: "14px",
                borderLeft: "none",
              }}>
              Name
            </StyledTableCell>
            <StyledTableCell
              sx={{
                border: "1px solid #ECECED",
                color: darkGray,
                margin: "0px",
                padding: "6px",
                fontSize: 11,
                paddingLeft: "8px",
              }}>
              Description
            </StyledTableCell>
            <StyledTableCell
              sx={{
                border: "1px solid #ECECED",
                color: darkGray,
                margin: "0px",
                padding: "6px",
                fontSize: 11,
                paddingLeft: "8px",
              }}>
              Barcode
            </StyledTableCell>
            <StyledTableCell
              sx={{
                border: "1px solid #ECECED",
                color: darkGray,
                margin: "0px",
                padding: "6px",
                fontSize: 11,
                paddingLeft: "8px",
              }}>
              QTY Ordered
            </StyledTableCell>
            <StyledTableCell
              sx={{
                border: "1px solid #ECECED",
                color: darkGray,
                margin: "0px",
                padding: "6px",
                fontSize: 11,
                paddingLeft: "8px",
              }}>
              QTY Shipped
            </StyledTableCell>
            <StyledTableCell
              sx={{
                border: "1px solid #ECECED",
                color: darkGray,
                margin: "0px",
                padding: "6px",
                fontSize: 11,
                paddingLeft: "8px",
              }}>
              Weight Net
            </StyledTableCell>
            <StyledTableCell
              sx={{
                border: "1px solid #ECECED",
                color: darkGray,
                margin: "0px",
                padding: "6px",
                fontSize: 11,
                paddingLeft: "8px",
              }}>
              Weight Gross
            </StyledTableCell>
            <StyledTableCell
              sx={{
                border: "1px solid #ECECED",
                color: darkGray,
                margin: "0px",
                padding: "6px",
                fontSize: 11,
                paddingLeft: "8px",
              }}>
              Price
            </StyledTableCell>
            <StyledTableCell
              sx={{
                border: "1px solid #ECECED",
                borderBottom: "none",
                borderRight: "none",
                color: darkGray,
                margin: "0px",
                padding: "6px",
                fontSize: 11,
                paddingLeft: "8px",
              }}>
              Total
            </StyledTableCell>
          </TableRow>
        </TableHead>

        {/* Table Body */}
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell
                component="th"
                scope="row"
                sx={{ borderLeft: "none", paddingLeft: "14px" }}>
                {row.name}
              </StyledTableCell>
              <StyledTableCell
                sx={{ border: "1px solid #ECECED", paddingLeft: "8px" }}>
                {row.description}
              </StyledTableCell>
              <StyledTableCell
                sx={{ border: "1px solid #ECECED", paddingLeft: "8px" }}>
                {row.barcode}
              </StyledTableCell>
              <StyledTableCell
                sx={{ border: "1px solid #ECECED", paddingLeft: "8px" }}>
                {row.qtyOrder}
              </StyledTableCell>
              <StyledTableCell
                sx={{ border: "1px solid #ECECED", paddingLeft: "8px" }}>
                {row.qtyShipped}
              </StyledTableCell>
              <StyledTableCell
                sx={{ border: "1px solid #ECECED", paddingLeft: "8px" }}>
                {row.weightNet}
              </StyledTableCell>
              <StyledTableCell
                sx={{ border: "1px solid #ECECED", paddingLeft: "8px" }}>
                {row.weightGross}
              </StyledTableCell>
              <StyledTableCell
                sx={{ border: "1px solid #ECECED", paddingLeft: "8px" }}>
                {row.price}
              </StyledTableCell>
              <StyledTableCell
                sx={{
                  border: "1px solid #ECECED",
                  borderRight: "none",
                  paddingLeft: "8px",
                }}>
                {row.total}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>

        {/* Total : */}
        <TableHead>
          <StyledTableRow>
            <StyledTableCell
              sx={{
                fontWeight: "bold",
                color: black,
                fontSize: 13,
                border: "none",
              }}>
              Total:
            </StyledTableCell>
            <StyledTableCell
              sx={{
                fontWeight: "bold",
                color: black,
                border: "none",
              }}></StyledTableCell>
            <StyledTableCell
              sx={{
                fontWeight: "bold",
                color: black,
                border: "none",
              }}></StyledTableCell>
            <StyledTableCell
              sx={{
                fontWeight: "bold",
                color: black,
                border: "none",
              }}></StyledTableCell>
            <StyledTableCell
              sx={{
                fontWeight: "bold",
                color: black,
                border: "none",
              }}></StyledTableCell>
            <StyledTableCell
              sx={{
                fontWeight: "bold",
                color: black,
                border: "none",
              }}></StyledTableCell>
            <StyledTableCell
              sx={{
                fontWeight: "bold",
                color: black,
                border: "none",
              }}></StyledTableCell>
            <StyledTableCell
              sx={{
                fontWeight: "bold",
                color: black,
                border: "none",
              }}></StyledTableCell>
            <StyledTableCell
              sx={{
                fontWeight: "bold",
                color: black,
                fontSize: 13,
                border: "none",
                paddingLeft: "11px",
              }}>
              $4,860.00
            </StyledTableCell>
          </StyledTableRow>
        </TableHead>
      </Table>
    </TableContainer>
  );
};
