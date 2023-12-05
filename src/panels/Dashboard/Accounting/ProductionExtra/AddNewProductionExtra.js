// Library Imports
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Add, Edit, Error, Delete } from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";
// Local Import
import {
  Button,
  BreadCrumb,
  TextField,
  CustomModal,
  MaterialDropdown,
  Spinner,
  Typography,
  MuiSwitch as Switch,
} from "../../../../shared";
import {
  addNewProductionExtra,
  deleteProductionExtra,
  updateProductionExtra,
} from "../../../../api/productionExtraApi";
import { getAllDependenciesAccounting } from "../../../../api/allDependencies";
import { SimpleDeleteModal } from "../../../../helpers/SimpleDeleteModal";

const AddNewProductionExtra = () => {
  const navigate = useNavigate();
  let { id } = useParams();
  const { state } = useLocation();
  const productionExtra = state?.productionExtra;
  //All States
  const [loading, setLoading] = useState(false);
  const [unitLoading, setUnitLoading] = useState(false);
  const [units, setUnits] = useState([]);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isEmpty, setIsEmpty] = useState([]);
  const [customerArray, setCustomerArray] = useState([]);
  const [errorObj, setErrorMsg] = useState({
    type: "",
    title: "",
    msg: "",
  });

  //Form Data
  const [productionExtraData, setProductionExtraData] = useState({
    productionExtraName: id ? productionExtra?.name : "",
    status: id ? productionExtra?.status : 0,
    directMaterial: id ? productionExtra?.direct_material : 0,
    amount: id ? productionExtra?.amount : "",
    uomName: id ? productionExtra?.unit?.name : "",
    uomUUID: id ? productionExtra?.unit?.uuid : "",
    customerName: id ? productionExtra?.customer?.name : "",
    customerUUID: id ? productionExtra?.customer?.uuid : "",
  });

  //Input Validations
  const validateInput = (name, text) => {
    var alphaNum = /^[0-9a-zA-Z\s]*$/;
    var numbers = /^(?!(0))[0-9]{0,15}$/;
    if (name === "productionExtraNames") {
      return alphaNum.test(text);
    } else if (name === "amount" || name === "productionExtraID") {
      return numbers.test(text);
    } else {
      return true;
    }
  };

  //Validating Every input If Empty
  const isProductionExtraDetailsEmpty = () => {
    let isEmpty;
    // Storing values in object if they have empty values
    Object.values(productionExtraData).map((item, index) => {
      if (item === null || item === "") {
        isEmpty = {
          ...isEmpty,
          [Object.keys(productionExtraData)[index]]: true,
        };
      }
    });

    setIsEmpty(isEmpty);
    return isEmpty ? (Object.keys(isEmpty).length === 0 ? false : true) : false;
  };

  //handle change
  const handleChange = (e) => {
    if (validateInput(e.target.name, e.target.value)) {
      if (e.target.name === "uomUUID") {
        let name = "";
        units?.filter((item) => {
          if (item?.uuid === e.target.value) {
            name = item?.name;
            return item?.name;
          }
        });

        setProductionExtraData({
          ...productionExtraData,
          uomName: name,
          [e.target.name]: e.target.value,
        });
      } else if (e.target.name === "customerUUID") {
        let name = "";
        customerArray?.filter((item) => {
          if (item?.uuid === e.target.value) {
            name = item?.name;
            return item?.name;
          }
        });

        setProductionExtraData({
          ...productionExtraData,
          customerName: name,
          [e.target.name]: e.target.value,
        });
      } else {
        setProductionExtraData({
          ...productionExtraData,
          [e.target.name]: e.target.value,
        });
      }
    }
    setIsEmpty({
      ...isEmpty,
      [e.target.name]: false,
    });
  };

  const createPayload = () => {
    let payload = {
      name: productionExtraData.productionExtraName,
      amount: productionExtraData.amount,
      unit_id: productionExtraData.uomUUID,
      customer_id: productionExtraData.customerUUID,
      direct_material: productionExtraData.directMaterial,
      status: productionExtraData.status,
    };
    return payload;
  };

  //On Press Add New ProductionExtra
  const onPressAddNewProductionExtra = () => {
    if (!isProductionExtraDetailsEmpty()) {
      setLoading(true);
      let payload = createPayload();
      addNewProductionExtra(payload)
        .then((res) => {
          navigate("/accounting/production-extras");
        })
        .catch((error) => {
          console.log(error?.response);
          setLoading(false);
          if (error?.response?.data?.message) {
            setError(true);
            setErrorMsg({
              type: "error",
              title: "Error",
              msg:
                // error?.response?.data?.errors?.name[0] ||
                error?.response?.data?.message,
            });
          }
        });
    }
  };

  //OnPress Edit ProductionExtra
  const onPressEditProductionExtra = () => {
    if (!isProductionExtraDetailsEmpty()) {
      setLoading(true);
      let payload = createPayload();
      payload = {
        ...payload,
        uuid: productionExtra?.uuid,
      };
      updateProductionExtra(payload)
        .then((resp) => {
          setLoading(false);
          navigate("/accounting/production-extras");
        })
        .catch((error) => {
          setLoading(false);
          if (error?.response?.data?.message) {
            setError(true);
            setErrorMsg({
              type: "error",
              title: "Error",
              // msg: error?.response?.data?.errors?.name[0],
            });
          }
        });
    }
  };

  //OnPress AddOrEditProductionExtra
  const onPressAddOrEditProductionExtra = () => {
    if (!id) {
      onPressAddNewProductionExtra();
    }
    if (id) {
      onPressEditProductionExtra();
    }
  };

  //handle Delete
  const handleDelete = () => {
    let payload = {
      production_extra_uuid: [productionExtra?.uuid],
    };
    setDeleteLoading(true);
    deleteProductionExtra(payload)
      .then((res) => {
        setIsDelete(false);
        setDeleteLoading(false);
        navigate("/accounting/production-extras");
      })
      .catch((error) => {
        setDeleteLoading(false);
      });
  };

  //handle Cancel Delete
  const handleCancelDelete = () => {
    setIsDelete(false);
  };
  //Get All Accounting Dependencies
  useEffect(() => {
    let payload = {
      name: "production_extra",
    };
    setUnitLoading(true);
    getAllDependenciesAccounting(payload)
      .then((res) => {
        setUnitLoading(false);
        setUnits(res?.data?.data?.units[0]?.units);
        setCustomerArray(res?.data?.data?.customer);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);

  //End Buttons
  const Buttons = () => {
    return (
      <div
        className={`mt-4 py-4 bg-white border-t border-lightGray overflow-auto d-flex ${
          id ? "justify-between" : "justify-end"
        }`}>
        {id && (
          <div className="mx-4">
            <Button
              size="medium"
              className="capitalize mr-[20px]"
              component="span"
              variant="outlined"
              color="danger"
              onClick={() => setIsDelete(!isDelete)}>
              Delete Production Extra
            </Button>
          </div>
        )}
        <div className="buttons d-flex">
          <Button
            size="medium"
            className="capitalize mr-[10px]"
            component="span"
            variant="outlined"
            color="secondary"
            disabled={loading || deleteLoading}
            onClick={() => navigate("/accounting/production-extras")}>
            Cancel
          </Button>
          <Button
            size="medium"
            className="capitalize mr-[20px] w-[130px]"
            component="span"
            color="primary"
            variant="contained"
            loading={loading}
            disabled={loading || deleteLoading}
            onClick={onPressAddOrEditProductionExtra}>
            {id ? "Save" : "Add"}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col justify-between h-[100vh]">
      <div>
        {/* Bread Crums Start*/}
        <div className="flex justify-between items-center p-3 bg-white border-bottom">
          <div>
            <BreadCrumb
              routes={[
                {
                  name: "Accounting",
                  route: "/accounting/production-extras",
                  color: true,
                },
                {
                  name: "Production Extras",
                  route: "/accounting/production-extras",
                  color: true,
                },
                {
                  name: id ? productionExtra?.name : "Add New Production Extra",
                },
              ]}
            />
            {id ? (
              <div>
                <Edit className="mb-1 mr-1" color="primary" />
                Edit : {productionExtra?.name}
              </div>
            ) : (
              <div>
                <Add className="mb-1" color="primary" />
                Add New Production Extras
              </div>
            )}
          </div>
        </div>
        {/* Bread Crums End*/}

        {/* Error Message Alert */}
        <CustomModal
          open={error}
          close={() => setError(!error)}
          width={window.innerWidth * 0.4}>
          <div>
            <div className="d-flex flex-row justify-content-between align-items-center">
              <div className="d-flex flex-row justify-content-between align-items-center text-center">
                <div className="pointer">
                  <Error
                    className="mx-3 mb-1"
                    color="danger"
                    fontSize="small"
                  />
                </div>
                {errorObj?.title}
              </div>
              <div className="pointer mx-3" onClick={() => setError(!error)}>
                <ClearIcon color="secondary" fontSize="small" />
              </div>
            </div>
            <div className="my-3">
              <Typography
                className="d-flex flex-row align-items-center p-3"
                variant="body1"
                fontSize={15}
                color="danger"
                fontWeight="light">
                {errorObj?.msg}
              </Typography>
              <div className="d-flex flex-row justify-content-end align-items-center mx-3 mt-4 mb-2">
                <Button
                  className="capitalize mr-[10px]"
                  component="span"
                  variant="outlined"
                  color="danger"
                  onClick={() => {
                    setError(!error);
                  }}>
                  {"Ok"}
                </Button>
              </div>
            </div>
          </div>
        </CustomModal>

        {/* Delete Modal Start */}
        <SimpleDeleteModal
          states={{
            open: isDelete,
            setOpen: setIsDelete,
            headTitle: "Delete Production Extra",
            deleteName: productionExtra?.name,
            loading: deleteLoading,
            deleteMethod: () => handleDelete(),
          }}
        />
        {/* Delete Modal End */}

        {/* Form */}
        {unitLoading ? (
          <Spinner />
        ) : (
          <div className="flex flex-col pt-[20px]">
            {/* Basic Info */}
            <div className="border rounded bg-white pb-0.5 mx-4">
              <h6 className="px-3 py-3">Production Extra Info</h6>
              <form className="px-3">
                <div className=" row">
                  {/* Left Section */}
                  <div className="form-group col-md-6">
                    <div className="form-row mb-3">
                      <TextField
                        size="small"
                        label="Production Extra Name"
                        type={"text"}
                        name="productionExtraName"
                        value={productionExtraData.productionExtraName}
                        fullWidth
                        onChange={handleChange}
                        helperText={
                          isEmpty?.productionExtraName
                            ? "Production Extra Name is required"
                            : ""
                        }
                        error={isEmpty?.productionExtraName ? true : false}
                      />
                    </div>
                    <div className="form-row mb-3">
                      <TextField
                        size="small"
                        label="Amount"
                        type={"text"}
                        name="amount"
                        value={productionExtraData.amount}
                        fullWidth
                        onChange={handleChange}
                        helperText={isEmpty?.amount ? "Amount is required" : ""}
                        error={isEmpty?.amount ? true : false}
                      />
                    </div>

                    <div className="form-row mb-3">
                      <MaterialDropdown
                        multiple={false}
                        options={units}
                        value={productionExtraData.uomUUID}
                        label={"Unit of Measure"}
                        name="uomUUID"
                        withRenderValue
                        fullWidth
                        onChange={handleChange}
                        userRoleToShow={productionExtraData.uomName}
                        error={isEmpty?.uomUUID ? "UOM is required" : ""}
                        errorMsg={isEmpty?.uomUUID ? "UOM is required" : ""}
                        errorState={isEmpty?.uomUUID}
                      />
                    </div>
                  </div>

                  {/* Right Section */}
                  <div className="form-group col-md-6">
                    <div className="form-row mb-3">
                      <div className="flex items-center justify-between  pl-3 pr-1  w-full text-sm border-borderGray border-[1px] text-dark bg-transparent focus:outline-none focus:ring-0 peer rounded-[4px]">
                        <span color="secondary">
                          {productionExtraData.directMaterial
                            ? "Activity"
                            : "Direct Material"}
                        </span>
                        <Switch
                          checked={
                            productionExtraData.directMaterial === 1
                              ? true
                              : false
                          }
                          aria-label="Status"
                          value={productionExtraData.directMaterial}
                          onChange={(event) =>
                            setProductionExtraData({
                              ...productionExtraData,
                              directMaterial: event.target.checked ? 1 : 0,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="form-row mb-3">
                      <MaterialDropdown
                        multiple={false}
                        options={customerArray}
                        value={productionExtraData?.customerUUID}
                        label={"Customer"}
                        name="customerUUID"
                        withRenderValue
                        fullWidth
                        onChange={handleChange}
                        userRoleToShow={productionExtraData.customerName}
                        error={
                          isEmpty?.customerUUID ? "Customer is required" : ""
                        }
                        errorMsg={
                          isEmpty?.customerUUID ? "Customer is required" : ""
                        }
                        errorState={isEmpty?.customerUUID}
                      />
                    </div>

                    <div className="form-row mb-3 ml-1">
                      <p className=" text-[12px]">Active Status</p>
                      <div className="d-flex items-center mt-[-10px] -ml-3">
                        <Switch
                          checked={
                            productionExtraData.status === 1 ? true : false
                          }
                          aria-label="Status"
                          value={productionExtraData.status}
                          onChange={(event) =>
                            setProductionExtraData({
                              ...productionExtraData,
                              status: event.target.checked ? 1 : 0,
                            })
                          }
                        />
                        <span color="secondary">
                          {productionExtraData.status ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <div>
        <Buttons />
      </div>
    </div>
  );
};
export default AddNewProductionExtra;
