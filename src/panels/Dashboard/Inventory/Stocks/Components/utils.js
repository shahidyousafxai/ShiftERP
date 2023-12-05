// Library Imports
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Clear } from "@mui/icons-material";
import { useSelector } from "react-redux";

// Local Imports
import {
  Button,
  CustomModal,
  MaterialDropdown as MaterialDropDown,
  TextField,
} from "../../../../../shared";
import { getDependencies } from "../../../../../api/kitsApi.js";
import {
  PopoverEdit,
  PopoverViewDetails,
  SettingsPopover,
} from "../../../../../helpers/TableUtilities";

export const Name = (restProps) => {
  const user = restProps.row;
  let navigate = useNavigate();
  return (
    <div className="d-flex flex-row align-items-center">
      <a
        onClick={() => {
          navigate("/inventory/view-details/{$id}", {
            state: { user: user, from: "Details" },
          });
        }}
        className={`text-capitalize text-[13px] text-primaryColor`}
        href>
        {restProps.row.customer}
      </a>
    </div>
  );
};

export const ManageStocks = (restProps) => {
  console.log("🚀 ~ file: utils.js:37 ~ ManageStocks ~ restProps:", restProps);
  const userData = useSelector((state) => state);
  const user = restProps.row;
  const id = restProps.row.id;
  const [isUpdate, setIsUpdate] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [amountSign, setAmountSign] = useState("");
  const [updatedProduct, setUpdatedProduct] = useState({
    customer: "",
    product: "",
    amount: "",
  });

  let navigate = useNavigate();

  useEffect(() => {
    const customerData = userData?.customer?.customers?.filter((customer) => {
      return customer.status === 1;
    });
    setCustomers(customerData);
  }, [userData?.customer?.customers]);

  const handleChange = async (event) => {
    const { name, value } = event.target;
    if (name === "customer") {
      customers.map((ele) => {
        if (value === ele.uuid) {
          setUpdatedProduct((prevProduct) => ({ ...prevProduct, [name]: ele }));
        }
      });

      try {
        const response = await getDependencies({ customer_id: value });
        setProducts(response?.data?.data?.products);
      } catch (error) {
        console.log(error);
      }
    }

    if (name === "product") {
      products.map((ele) => {
        if (value === ele.uuid) {
          setUpdatedProduct((prevProduct) => ({ ...prevProduct, [name]: ele }));
        }
      });
    }
    if (name === "amount") {
      setUpdatedProduct((prevProduct) => ({ ...prevProduct, [name]: value }));
    }
  };

  const handleRadioChange = (event) => {
    setAmountSign(event.target.value);
  };

  return (
    <React.Fragment>
      <CustomModal
        open={isUpdate}
        close={() => {
          setAmountSign("");
          setIsUpdate(false);
          setUpdatedProduct({
            customer: "",
            product: "",
            amount: "",
          });
        }}
        width={window.innerWidth * 0.4}>
        <div>
          <div className="d-flex flex-row justify-content-between align-items-center">
            <div className="d-flex flex-row justify-content-between align-items-center text-center">
              <div className="pointer">
                <Edit
                  className="mx-3 mb-1"
                  color="secondary"
                  fontSize="small"
                />
              </div>
              Update Product
            </div>
            <div
              className="pointer mx-3"
              onClick={() => {
                setAmountSign("");
                setIsUpdate(false);
                setUpdatedProduct({
                  customer: "",
                  product: "",
                  amount: "",
                });
              }}>
              <Clear color="secondary" fontSize="small" />
            </div>
          </div>
          <div className="my-3">
            <div className="flex flex-col gap-3 mx-3">
              {console.log(updatedProduct?.amount)}
              <MaterialDropDown
                multiple={false}
                options={customers}
                label="Customer"
                name="customer"
                value={updatedProduct?.customer?.uuid || ""}
                userRoleToShow={updatedProduct?.customer?.name}
                withRenderValue
                onChange={handleChange}
                fullWidth
                // error={isEmpty.customerId ? true : false}
              />
              <MaterialDropDown
                multiple={false}
                options={products}
                label="Product"
                name="product"
                value={updatedProduct.product}
                userRoleToShow={updatedProduct?.product?.name}
                withRenderValue
                onChange={handleChange}
                fullWidth
                // error={isEmpty.customerId ? true : false}
                errorMsg={`${
                  !updatedProduct?.customer
                    ? "Note: Please Select The Customer First!"
                    : ""
                }`}
              />
              <div className="flex items-center gap-2 w-full">
                <div className="flex gap-1">
                  <div className="flex items-center justify-center gap-x-5">
                    <input
                      type="radio"
                      id="plus"
                      name="amountsign"
                      value="+"
                      className="peer hidden"
                      onChange={handleRadioChange}
                    />
                    <label
                      htmlFor="plus"
                      className="peer-checked:bg-success peer-checked:text-white w-10 rounded-md px-[2px] h-10 font-primary flex justify-center items-center font-bold text-md border-2 border-success cursor-pointer">
                      +
                    </label>
                  </div>
                  <div className="flex items-center justify-center gap-x-5">
                    <input
                      type="radio"
                      id="minus"
                      name="amountsign"
                      value="-"
                      className="peer hidden"
                      onChange={handleRadioChange}
                    />
                    <label
                      htmlFor="minus"
                      className="peer-checked:bg-danger peer-checked:text-white w-10 rounded-md px-[2px] h-10 font-primary flex justify-center items-center font-bold text-md border-2 border-danger cursor-pointer">
                      -
                    </label>
                  </div>
                </div>
                <TextField
                  className="w-full"
                  type="number"
                  label="Amount"
                  fullWidth={true}
                  size="small"
                  value={updatedProduct.amount}
                  name="amount"
                  onChange={handleChange}
                  // error={values.error}
                />
              </div>
            </div>
            <div className="d-flex flex-row justify-content-end align-items-center mx-3 mt-4 mb-2">
              <Button
                className="capitalize mr-[10px]"
                component="span"
                variant="outlined"
                color="secondary"
                // disabled={deleteLoading}
                onClick={() => {
                  setAmountSign("");
                  setIsUpdate(false);
                  setUpdatedProduct({
                    customer: "",
                    product: "",
                    amount: "",
                  });
                }}>
                Cancel
              </Button>
              <Button
                component="span"
                className="capitalize text-white"
                color="primary"
                variant="contained"
                // disabled={deleteLoading}
                // loading={deleteLoading}
                onClick={() => {}}>
                Update Product
              </Button>
            </div>
          </div>
        </div>
      </CustomModal>

      <SettingsPopover id={id}>
        <PopoverEdit
          onClick={() => {
            navigate("/inventory/view-details/{$id}", {
              state: { user: user, from: "Details" },
            });
          }}
        />
        <PopoverViewDetails
          onClick={() => {
            navigate("/inventory/view-details/{$id}", {
              state: { user: user, from: "Details" },
            });
          }}
          text="View Details"
        />
      </SettingsPopover>
    </React.Fragment>
  );
};
