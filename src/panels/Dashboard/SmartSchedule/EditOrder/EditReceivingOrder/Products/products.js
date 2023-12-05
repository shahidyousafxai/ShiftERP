//Library Imports
import React, { useEffect, useState } from "react";
import Barcode from "react-barcode";
import { Clear, Visibility, Delete } from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";

//Local Imports
import {
  AlertMessage,
  Button,
  CustomModal,
  Typography,
} from "../../../../../../shared";
import {
  commitReceivingOrder,
  deleteUncommitedReceivingOrder,
} from "../../../../../../api/editReceivingOrderApi";
import { ProductTable } from "./Components/utils";
import { SimpleDeleteModal } from "../../../../../../helpers/SimpleDeleteModal";

const Products = ({ dependences, orderDetailsData, getSingleDetails, loading }) => {
  // States
  const [isBarcodePreview, setIsBarcodePreview] = useState(false);
  const [previewBarCodeObj, setPreviewBarCodeObj] = useState({
    description: "",
    barcodeNum: "",
  });

  const [dropdowndata, setDropdownData] = useState({
    unit: dependences?.units,
    location: dependences?.locations,
  });

  const [productRows, setProductRows] = useState({
    productDetails: [],
  });

  const [productsLoading, setProductsLoading] = useState(loading);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [matchUUID, setMatchUUID] = useState("");
  const [error, setError] = useState(false);
  const [isError, setIsError] = useState("");
  const [errorObj, setErrorMsg] = useState({
    type: "",
    title: "",
    msg: "",
  });

  // Print BarCode
  const print = () => {
    var mywindow = window.open("", "PRINT", "");

    mywindow.document.write(
      "<html><head><title>" + document.title + "</title>"
    );
    mywindow.document.write("</head><body >");
    mywindow.document.write(
      document.getElementById("section-to-print").innerHTML
    );
    mywindow.document.write("</body></html>");

    // mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();

    return true;
  };
  // Preview BarCode
  const previewBarCodeClose = () => {
    setPreviewBarCodeObj({ description: "", barcodeNum: "" });
    setIsBarcodePreview(false);
  };

  //Handle DeleteProduct Row
  const handleDelteRow = (item) => {
    const payload = {
      order_product_id: item?.orderProductID,
    };
    setDeleteLoading(true);
    deleteUncommitedReceivingOrder(payload)
      .then((response) => {
        console.log("delete API response", response?.data);
        setDeleteLoading(false);
        getSingleDetails();
      })
      .catch((error) => {
        setDeleteLoading(false);
        console.log("error?.response?.data");
        if (error?.response?.data?.message) {
          setIsError(error?.response?.data?.message);
        }
      });
    // Deleting Row Data From State
    // let data = productRows?.productDetails;
    // data.splice(index, 1);
    // Setting State
    // setProductRows({ ...productRows, productDetails: data });
  };

  // Handle Commit
  const handleCommit = (item) => {
    setMatchUUID(item?.itemUUID);
    if (
      item?.qty_received &&
      item?.total2 &&
      item?.location?.uuid &&
      item?.pallet &&
      item?.lot &&
      item?.lotID1 &&
      item?.lotID2 &&
      item?.prodDate &&
      item?.expDate
    ) {
      const payload = {
        order_product_id: item?.orderProductID,
        location_id: item?.location?.uuid,
        product_id: item?.itemUUID,
        // qty_received: item?.qty_received,
        lot_number: item?.lot,
        lot_id1: item?.lotID1,
        lot_id2: item?.lotID2,
        total1: item?.qty_received,
        total2: item?.total2,
        pallet_number: item?.pallet,
        production_date: item?.prodDate,
        expiration_date: item?.expDate,
        // net_weight: item?.weightNet,
        // gross_weight: item?.weightGross,
        // price: item?.price,
        // total: item?.total,
      };
      setProductsLoading(true);
      commitReceivingOrder(payload)
        .then((response) => {
          console.log("update response", response?.data);
          getSingleDetails();
        })
        .catch((error) => {
          setProductsLoading(false);
          console.log("error?.response?.data");
          if (error?.response?.data?.message) {
            setError(true);
            setErrorMsg({
              type: "error",
              title: "Error",
              msg: error?.response?.data?.message,
            });
          }
        });
    }
  };

  //UseEffect For Set Row Data (orderDetailsData)
  useEffect(() => {
    let newData = orderDetailsData?.order_products?.map((item, index) => {
      const obj = {
        itemName: item?.product?.name,
        itemUUID: item?.product?.uuid,
        barcode: item?.product?.barcode,
        location: item?.location,
        qty_received: item?.amount,
        qty_unit: item?.unit,
        qty_updated: item?.qty_updated,
        weightNet: item?.net_weight,
        weightGross: item?.gross_weight,
        prodDate: item?.production_date,
        expDate: item?.expiration_date,
        total2: item?.total2,
        lot: item?.lot_number,
        lotID1: item?.lot_id1,
        lotID2: item?.lot_id2,
        pallet: item?.pallet_number,
        price: item?.price,
        total: item?.total,
        commitedStatus: item?.is_completed === null ? 0 : item?.is_completed,
        orderProductID: item?.uuid,
      };
      return obj;
    });
    setProductRows({ productDetails: newData });
  }, []);

  useEffect(() => {
    setError(false);
  }, [productRows?.productDetails]);

  return (
    <div className="mx-[18px]">
      <div className="border rounded bg-white mt-[20px]  ">
        {/* Preview Bar Code Modal */}
        <CustomModal open={isBarcodePreview} width={window.innerWidth * 0.45}>
          <div>
            <div className="d-flex flex-row justify-content-between align-items-center">
              <div className="d-flex flex-row justify-content-between align-items-center text-center">
                <div className="pointer">
                  <Visibility
                    className="mx-3 mb-1"
                    color="primary"
                    fontSize="small"
                  />
                </div>
                Preview Barcode
              </div>
              <div className="pointer mx-3" onClick={previewBarCodeClose}>
                <Clear color="secondary" fontSize="small" />
              </div>
            </div>

            <div
              id="section-to-print"
              className="d-flex flex-col m-3 justify-content-between align-items-center rounded-lg border-2">
              <p className="mt-2 px-2">{previewBarCodeObj.description}</p>
              <Barcode height="50px" value={previewBarCodeObj.barcodeNum} />
            </div>

            <div className="mb-3">
              <div className="d-flex flex-row justify-content-between align-items-center mx-3 mt-4 mb-2">
                <Button
                  component="span"
                  className="capitalize mr-[10px]"
                  variant="outlined"
                  color="secondary"
                  onClick={previewBarCodeClose}>
                  Cancel
                </Button>
                <Button
                  startIcon={<Visibility />}
                  component="span"
                  className="capitalize"
                  color="primary"
                  variant="contained"
                  onClick={() => print()}>
                  Print Barcode
                </Button>
              </div>
            </div>
          </div>
        </CustomModal>

        {/* Delete Modal */}
        <SimpleDeleteModal
          states={{
            open: deleteModal,
            setOpen: setDeleteModal,
            errorMsg: isError,
            setErrorMsg: setIsError,
            headTitle: "Delete Product",
            deleteName: matchUUID?.itemName,
            loading: deleteLoading,
            deleteMethod: () => handleDelteRow(matchUUID),
          }}
        />

        <div className="flex item center justify-between py-3 pr-1">
          <h6 className="pl-3">Products</h6>

          {/* Error Toastter */}
          {error && (
            <AlertMessage
              severity="error"
              text={errorObj?.msg}
              textColor="red"
              iconColor="warning"
              onClick={() => setError(false)}
            />
          )}
        </div>

        <ProductTable
          setPreviewBarCodeObj={setPreviewBarCodeObj}
          setIsBarcodePreview={setIsBarcodePreview}
          productRows={productRows}
          setProductRows={setProductRows}
          dropdowndata={dropdowndata}
          handleCommit={handleCommit}
          matchUUID={matchUUID}
          setMatchUUID={setMatchUUID}
          productsLoading={productsLoading}
          setDeleteModal={setDeleteModal}
        />
      </div>
    </div>
  );
};

export default Products;
