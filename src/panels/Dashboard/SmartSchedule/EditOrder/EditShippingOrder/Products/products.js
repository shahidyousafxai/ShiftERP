import React, { useEffect, useState } from "react";
import Barcode from "react-barcode";
import { Add, Clear, Visibility, Delete, Error } from "@mui/icons-material";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import TripOriginRoundedIcon from "@mui/icons-material/TripOriginRounded";
import PrintIcon from "@mui/icons-material/Print";

import {
  Button,
  CustomModal,
  MaterialDropdown,
  TextField,
} from "../../../../../../shared";
import { getAllDependencyOrder } from "../../../../../../api/smartSchedule";
import { ProductTable } from "./Components/utils";

const Products = ({ dependences, customerUUID }) => {
  const [isBarcodePreview, setIsBarcodePreview] = useState(false);
  const [previewBarCodeObj, setPreviewBarCodeObj] = useState({
    description: "",
    barcodeNum: "",
  });

  const [dropdowndata, setDropdownData] = useState({
    unit: [
      {
        uuid: "c7f994c3ec804b15bc44269ab2eee21a",
        name: "LBS",
      },
      {
        uuid: "1373b0c946184de88ad1f8d8ec02ab30",
        name: "EA",
      },
      {
        uuid: "23f33b3d514e45beb55d10be28e52050",
        name: "CWT",
      },
    ],
    status: [
      {
        uuid: "c7f994c3ec804b15bc44269ab2eee21a",
        name: "Transferred to the Shipper",
      },
      {
        uuid: "1373b0c946184de88ad1f8d8ec02ab30",
        name: "Received",
      },
    ],
    location: [
      {
        uuid: "12344",
        name: "location 1",
      },
      {
        uuid: "12355",
        name: "location 2",
      },
    ],
  });

  const [tableRows, setTableRows] = useState({
    productDetails: [
      {
        id: 1,
        itemName: "123 Allied Awsome Buk",
        qty_ordered: "50",
        qty_ordered_unit: {
          uuid: "23f33b3d514e45beb55d10be28e52050",
          name: "CWT",
        },
        qty_available: "40",
        barcode: "1232140120",
        location: {
          uuid: "12344",
          name: "location 1",
        },
        lot: "",
        lotID1: "",
        lotID2: "",
      },
      {
        id: 2,
        itemName: "123 Allied Favorite Rolls",
        qty_ordered: "50",
        qty_ordered_unit: {
          uuid: "23f33b3d514e45beb55d10be28e52050",
          name: "CWT",
        },
        qty_available: "40",
        barcode: "1232140120",
        location: {
          uuid: "12344",
          name: "location 1",
        },
        lot: "",
        lotID1: "",
        lotID2: "",
      },
      {
        id: 3,
        itemName: "123 Chewy Chipless",

        qty_ordered: "10",
        qty_ordered_unit: {
          uuid: "23f33b3d514e45beb55d10be28e52050",
          name: "CWT",
        },
        qty_available: "40",
        barcode: "1232140120",
        location: {
          uuid: "12344",
          name: "location 1",
        },
        lot: "",
        lotID1: "",
        lotID2: "",
      },
    ],
  });
  const [closeoutTableRows, setCloseoutTableRows] = useState({
    productDetails: [
      {
        id: 1,
        itemName: "123 Allied Awsome Buk",
        status: {
          uuid: "c7f994c3ec804b15bc44269ab2eee21a",
          name: "Transferred to the Shipper",
        },
        barcode: "1232140120",
        location: {
          uuid: "12344",
          name: "location 1",
        },
        lot: "88580",
        lotID1: "863",
        pallet: "925",
        picked1: "10",
        picked2: "",
      },
      {
        id: 2,
        itemName: "123 Allied Favorite Rolls",
        status: {
          uuid: "c7f994c3ec804b15bc44269ab2eee21a",
          name: "Transferred to the Shipper",
        },
        barcode: "1232140120",
        location: {
          uuid: "12344",
          name: "location 1",
        },
        lot: "88580",
        lotID1: "863",
        pallet: "925",
        picked1: "10",
        picked2: "",
      },
      {
        id: 3,
        itemName: "123 Chewy Chipless",
        status: {
          uuid: "c7f994c3ec804b15bc44269ab2eee21a",
          name: "Transferred to the Shipper",
        },
        barcode: "1232140120",
        location: {
          uuid: "12344",
          name: "location 1",
        },
        lot: "88580",
        lotID1: "863",
        pallet: "925",
        picked1: "10",
        picked2: "",
      },
    ],
  });
  const [productDetails, setProductDetails] = useState({
    items: "",
  });
  const [dependencyLoading, setDependencyLoading] = useState(false);
  const [isCloseOut, setIsCloseOut] = useState(false);
  const [showProdDetailsList, setShowProdDetailsList] = useState(false);
  const [showFinalizeButton, setShowFinalizeButton] = useState(false);
  const [addProduct, setAddProduct] = useState(false);
  const [items, setItems] = useState([1]);
  const [itemsDropdownData, setItemsDropdownData] = useState({
    items: [],
    unit: [],
  });

  const [isEmpty, setIsEmpty] = useState({
    itemsEmpty: false,
    items: false,
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

  const previewBarCodeClose = () => {
    setPreviewBarCodeObj({ description: "", barcodeNum: "" });
    setIsBarcodePreview(false);
  };

  const getCustomerProducts = (customerUUID) => {
    setDependencyLoading(true);
    getAllDependencyOrder({
      type: "receiving",
      customer_id: customerUUID,
    })
      .then((res) => {
        let data = res?.data?.data;

        setItemsDropdownData({
          unit: data?.units,
          items: data?.products,
        });
        setDependencyLoading(false);
      })
      .catch((error) => {
        setDependencyLoading(false);
        console.log("🚀 ~ file: AddNewProduct.js ~ line 35 ~ error", error);
      });
  };

  const itemOnChange = (e, itemNum) => {
    if (productDetails?.items) {
      if (`${itemNum}` in productDetails?.items) {
        let existingItem = productDetails?.items?.[itemNum];
        if (e.target.name === "itemNotes") {
          existingItem.notes = e.target.value;
          let data = { ...productDetails?.items, [itemNum]: existingItem };
          setProductDetails({ ...productDetails, items: data });
        }
        if (e.target.name === "item") {
          let selectedItem = itemsDropdownData?.items?.find((el) => {
            if (el.uuid === e.target.value) return el;
          });
          existingItem.item = selectedItem;
          let data = { ...productDetails?.items, [itemNum]: existingItem };
          setProductDetails({ ...productDetails, items: data });
        }
        if (e.target.name === "itemAmount") {
          e.target.value = e.target.value.replace(/[^\d]/g, "");
          e.target.value.charAt(0) === "0"
            ? (e.target.value = "")
            : (e.target.value = e.target.value);
          existingItem.amount = e.target.value;
          let data = { ...productDetails?.items, [itemNum]: existingItem };
          setProductDetails({ ...productDetails, items: data });
        }
        if (e.target.name === "unit") {
          let selectedUnit = itemsDropdownData?.unit?.find((el) => {
            if (el.uuid === e.target.value) return el;
          });
          existingItem.unit = selectedUnit;
          let data = { ...productDetails?.items, [itemNum]: existingItem };
          setProductDetails({ ...productDetails, items: data });
        }
      } else {
        if (e.target.name === "itemNotes") {
          let data = {
            ...productDetails?.items,
            [itemNum]: { notes: e.target.value },
          };
          setProductDetails({ ...productDetails, items: data });
        }
        if (e.target.name === "item") {
          let selectedItem = itemsDropdownData?.items?.find((el) => {
            if (el.uuid === e.target.value) return el;
          });
          let data = {
            ...productDetails?.items,
            [itemNum]: { item: selectedItem },
          };
          setProductDetails({ ...productDetails, items: data });
        }
        if (e.target.name === "itemAmount") {
          e.target.value = e.target.value.replace(/[^\d]/g, "");
          e.target.value.charAt(0) === "0"
            ? (e.target.value = "")
            : (e.target.value = e.target.value);
          let data = {
            ...productDetails?.items,
            [itemNum]: { amount: e.target.value },
          };
          setProductDetails({ ...productDetails, items: data });
        }
        if (e.target.name === "unit") {
          let selectedUnit = itemsDropdownData?.unit?.find((el) => {
            if (el.uuid === e.target.value) return el;
          });
          let data = {
            ...productDetails?.items,
            [itemNum]: { item: selectedUnit },
          };
          setProductDetails({ ...productDetails, items: data });
        }
      }
    } else {
      if (e.target.name === "itemNotes") {
        let data = { [itemNum]: { notes: e.target.value } };
        setProductDetails({ ...productDetails, items: data });
      }
      if (e.target.name === "item") {
        let selectedItem = itemsDropdownData?.items?.find((el) => {
          if (el.uuid === e.target.value) return el;
        });
        let data = { [itemNum]: { item: selectedItem } };
        setProductDetails({ ...productDetails, items: data });
      }
      if (e.target.name === "itemAmount") {
        e.target.value = e.target.value.replace(/[^\d]/g, "");
        e.target.value.charAt(0) === "0"
          ? (e.target.value = "")
          : (e.target.value = e.target.value);
        let data = { [itemNum]: { amount: e.target.value } };
        setProductDetails({ ...productDetails, items: data });
      }
      if (e.target.name === "unit") {
        let selectedUnit = itemsDropdownData?.unit?.find((el) => {
          if (el.uuid === e.target.value) return el;
        });
        let data = { [itemNum]: { unit: selectedUnit } };
        setProductDetails({ ...productDetails, items: data });
      }
    }

    setIsEmpty({
      ...isEmpty,
      itemsEmpty: false,
      items: false,
    });
  };

  const getItemsRowValues = (from, type, itemNum) => {
    if (from === "Notes") {
      return type === "value" &&
        productDetails?.items &&
        productDetails?.items[itemNum]?.notes
        ? productDetails?.items[itemNum]?.notes
        : "";
    }
    if (from === "Item") {
      return type === "value"
        ? productDetails?.items && productDetails?.items[itemNum]?.item?.uuid
          ? productDetails?.items[itemNum]?.item?.uuid
          : ""
        : productDetails?.items && productDetails?.items[itemNum]?.item?.name
        ? `${productDetails?.items[itemNum]?.item?.name} - ${productDetails?.items[itemNum]?.item?.description}`
        : "";
    }
    if (from === "Amount") {
      return type === "value" &&
        productDetails?.items &&
        productDetails?.items[itemNum]?.amount
        ? productDetails?.items[itemNum]?.amount
        : "";
    }
    if (from === "Unit") {
      return type === "value"
        ? productDetails?.items && productDetails?.items[itemNum]?.unit?.uuid
          ? productDetails?.items[itemNum]?.unit?.uuid
          : ""
        : productDetails?.items && productDetails?.items[itemNum]?.unit?.name
        ? productDetails?.items[itemNum]?.unit?.name
        : "";
    }
  };

  const itemOnDelete = (index, item) => {
    setItems(items.filter((_, i) => i !== index).map((_, i) => i + 1));
    // Deleting Row Data From State
    let data = productDetails?.items;
    delete data?.[item];

    // Update the indexing in kitData
    let newData = {};
    Object.keys(data).forEach((key, newIndex) => {
      newData[newIndex + 1] = data[key];
    });
    // Setting State
    setProductDetails({ ...productDetails, items: newData });
  };

  const closeAddProductModal = () => {
    setAddProduct(false);
    setProductDetails({ ...productDetails, items: "" });
    setItems([1]);
    setIsEmpty({
      ...isEmpty,
      items: false,
    });
  };

  const isItemsEmpty = () => {
    if (productDetails.items) {
      if (Object.keys(productDetails.items).length !== 0) {
        let check = Object.values(productDetails?.items).map((item) => {
          if (
            !("notes" in item) ||
            item?.notes === "" ||
            (!("item" in item) && item?.item === "") ||
            !("amount" in item) ||
            item?.amount === "" ||
            (!("unit" in item) && item?.unit === "")
          ) {
            setIsEmpty({ ...isEmpty, items: true });
            return true;
          } else {
            return false;
          }
        });
        return check?.includes(true) ? true : false;
      } else {
        return false;
      }
    }
  };
  const addProductModal = () => {
    if (!isItemsEmpty()) {
      const newItems = Object.values(productDetails?.items).map((item) => {
        const obj = {
          itemName: item?.item?.name,
          barcode:
            Math.floor(Math.random() * 1000000) +
            Math.floor(Math.random() * 100000),
          qty_ordered: "0",
          qty_ordered_unit: {
            uuid: "23f33b3d514e45beb55d10be28e52050",
            name: "CWT",
          },
          qty_available: "60",
          status: {
            uuid: "c7f994c3ec804b15bc44269ab2eee21a",
            name: "Pending receiving",
          },
          location: {
            uuid: "12344",
            name: "location 1",
          },
        };
        return obj;
      });

      setTableRows(() => {
        const oldItems =
          tableRows?.productDetails?.length > 0
            ? tableRows?.productDetails
            : [];
        const itemsArray = [...oldItems, ...newItems];
        const obj = { ...tableRows, productDetails: itemsArray };
        return obj;
      });
      closeAddProductModal();
    }
  };

  const AddProductButtons = () => {
    return (
      <div className={`d-flex overflow-auto justify-end py-3 border-lightGray`}>
        <div className="">
          <Button
            size="medium"
            className="capitalize mr-[10px] w-[100px]"
            component="span"
            variant="outlined"
            color="secondary"
            // disabled={loading }
            onClick={() => closeAddProductModal()}>
            Cancel
          </Button>
          <Button
            size="medium"
            className="capitalize mr-[20px] w-[130px]"
            component="span"
            color="primary"
            variant="contained"
            // loading={loading}
            // disabled={loading}
            onClick={() => addProductModal()}>
            Save
          </Button>
        </div>
      </div>
    );
  };

  const handleDelteRow = (index) => {
    // Deleting Row Data From State
    let data = tableRows?.productDetails;
    data.splice(index, 1);
    // Setting State
    setTableRows({ ...tableRows, productDetails: data });
  };

  const isButtonEnabled = () => {
    for (const item of tableRows?.productDetails) {
      const qtyOrdered = +item?.qty_ordered;
      const qtyAvailable = +item?.qty_available;

      if (qtyOrdered > qtyAvailable) {
        return true; // Enable the button as soon as one item meets the condition
      }
    }
    return false; // Disable the button if no item meets the condition
  };

  //UseEffect For Get Customers, get Units and get drivers
  useEffect(() => {
    getCustomerProducts(customerUUID);
  }, []);

  return (
    <div className="max-h-[90%]">
      <div className="border rounded bg-white py-2 my-[20px] mx-[18px] flex items-center justify-center">
        <div className="text-black text-sm mr-2 flex items-center">
          {" "}
          {!isCloseOut ? (
            <TripOriginRoundedIcon color="primary" className="mx-2" />
          ) : (
            <RadioButtonUncheckedIcon
              color="primary"
              fontSize="small"
              className="mx-2"
            />
          )}{" "}
          Pick Order
        </div>
        -------------
        <div className="text-black text-sm ml-2 flex items-center">
          {isCloseOut ? (
            <TripOriginRoundedIcon color="primary" className="mx-2" />
          ) : (
            <RadioButtonUncheckedIcon color="primary" className="mx-2" />
          )}{" "}
          Closeout
        </div>
      </div>

      <div className="border rounded bg-white mx-[18px] overflow-auto">
        <CustomModal open={isBarcodePreview} width={"500px"}>
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

        {/* Add Item Modal */}
        <CustomModal open={addProduct} width={window.innerWidth * 0.5}>
          <div className="mx-3">
            {/* Header Row */}
            <div className="d-flex flex-row justify-content-between align-items-center ">
              <div className="flex">
                <Add className="mr-1" fontSize="small" color="primary" /> Add
                Product
                {isEmpty?.items && (
                  <div className="ml-3 flex items-center">
                    <Error color="danger" fontSize="small" />
                    <p className="ml-2 text-danger text-sm font-semibold">
                      All fields of items are required.
                    </p>
                  </div>
                )}
              </div>

              <div className="pointer" onClick={() => closeAddProductModal()}>
                <Clear color="secondary" fontSize="small" />
              </div>
            </div>

            <div
              className={`${
                items?.length > 4 && "max-h-44 overflow-y-scroll"
              } `}>
              {items?.length > 0 &&
                items?.map((item, index) => {
                  return (
                    <form key={index} className="mt-4">
                      <div className="flex items-center w-full">
                        <div className="w-[35%] h-[40px]">
                          <MaterialDropdown
                            fullWidth
                            withRenderValue
                            multiple={false}
                            label="Item"
                            name="item"
                            options={itemsDropdownData?.items}
                            value={getItemsRowValues("Item", "value", item)}
                            userRoleToShow={getItemsRowValues("Item", "", item)}
                            onChange={(e) => itemOnChange(e, item)}
                            error={
                              isEmpty.itemsEmpty || isEmpty?.items
                                ? true
                                : false
                            }
                          />
                        </div>

                        <div className="ml-2 w-[15%]">
                          <TextField
                            fullWidth
                            size="small"
                            label="Amount"
                            name="itemAmount"
                            value={getItemsRowValues("Amount", "value", item)}
                            onChange={(e) => itemOnChange(e, item)}
                            error={
                              isEmpty.itemsEmpty || isEmpty?.items
                                ? true
                                : false
                            }
                          />
                        </div>

                        <div className="ml-2 w-[15%]">
                          <MaterialDropdown
                            fullWidth
                            withRenderValue
                            multiple={false}
                            label="Unit"
                            name="unit"
                            options={itemsDropdownData?.unit}
                            value={getItemsRowValues("Unit", "value", item)}
                            userRoleToShow={getItemsRowValues("Unit", "", item)}
                            onChange={(e) => itemOnChange(e, item)}
                            error={
                              isEmpty.itemsEmpty || isEmpty?.items
                                ? true
                                : false
                            }
                          />
                        </div>

                        <div className="ml-2 w-[30%]">
                          <TextField
                            fullWidth
                            size="small"
                            label="Notes"
                            name="itemNotes"
                            value={getItemsRowValues("Notes", "value", item)}
                            onChange={(e) => itemOnChange(e, item)}
                            error={
                              isEmpty.itemsEmpty || isEmpty?.items
                                ? true
                                : false
                            }
                          />
                        </div>

                        {items?.length > 1 && (
                          <div
                            onClick={() => itemOnDelete(index, item)}
                            className="ml-2 w-[5%]">
                            <Delete
                              className="cursor-pointer"
                              color="secondary"
                            />
                          </div>
                        )}
                      </div>
                    </form>
                  );
                })}
            </div>

            <div className="mt-3">
              <Button
                startIcon={<Add color="secondary" />}
                className="capitalize text-black text-[13px] "
                onClick={() => setItems([...items, items.length + 1])}
                component="span"
                color="secondary"
                variant="outlined"
                // disabled={loading}
              >
                Add Product
              </Button>

              <AddProductButtons />
            </div>
          </div>
        </CustomModal>

        <div className="flex item center justify-between p-3">
          <h6 className="">Pick Order</h6>
          {showProdDetailsList ? (
            ""
          ) : showFinalizeButton ? (
            ""
          ) : (
            <Button
              startIcon={<Add color="primary" />}
              size="medium"
              className="capitalize mr-[10px] w-[150px]"
              component="span"
              variant="outlined"
              color="primary"
              onClick={() => setAddProduct(true)}>
              Add Product
            </Button>
          )}
        </div>

        <ProductTable
          dependences={dependences}
          isBarcodePreview={isBarcodePreview}
          setPreviewBarCodeObj={setPreviewBarCodeObj}
          setIsBarcodePreview={setIsBarcodePreview}
          tableRows={tableRows}
          setTableRows={setTableRows}
          closeoutTableRows={closeoutTableRows}
          setCloseoutTableRows={setCloseoutTableRows}
          dropdowndata={dropdowndata}
          handleDelteRow={handleDelteRow}
          showProdDetailsList={showProdDetailsList}
          setShowProdDetailsList={setShowProdDetailsList}
          showFinalizeButton={showFinalizeButton}
        />
      </div>
      {showProdDetailsList ? (
        <div className="flex justify-end item-center py-2">
          <Button
            startIcon={<PrintIcon color="Secondary" />}
            size="medium"
            className="capitalize mr-[10px]"
            component="span"
            variant="outlined"
            color="secondary"
            // onClick={() => setAddProduct(true)}
          >
            Re-Print Pick
          </Button>

          <div
          // className={`${
          //   isButtonEnabled() ? "cursor-not-allowed" : "cursor-pointer"
          // }`}
          >
            <Button
              size="medium"
              className="capitalize mr-[20px] "
              component="span"
              variant="contained"
              color="primary"
              // disabled={isButtonEnabled() === true}
              onClick={() => {
                setIsCloseOut(true);
                setShowProdDetailsList(false);
                setShowFinalizeButton(true);
              }}>
              Continue to Closeout
            </Button>
          </div>
        </div>
      ) : showFinalizeButton ? (
        <div className="flex justify-end item-center py-2">
          <Button
            size="medium"
            className="capitalize mr-[20px]"
            component="span"
            variant="contained"
            color="primary"
            // onClick={() => setAddProduct(true)}
          >
            Finalize & Print
          </Button>
        </div>
      ) : (
        <div className="flex justify-end item-center py-2">
          <Button
            startIcon={<PrintIcon color="Secondary" />}
            size="medium"
            className="capitalize mr-[10px]"
            component="span"
            variant="outlined"
            color="secondary"
            // onClick={() => setAddProduct(true)}
          >
            Print Pick
          </Button>

          <div
            className={`${
              isButtonEnabled() ? "cursor-not-allowed" : "cursor-pointer"
            }`}>
            <Button
              size="medium"
              className="capitalize mr-[20px] "
              component="span"
              variant="contained"
              color="primary"
              disabled={isButtonEnabled() === true}
              onClick={() => setShowProdDetailsList(true)}>
              Pick Order
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
