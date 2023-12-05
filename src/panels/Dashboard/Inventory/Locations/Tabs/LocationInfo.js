// Library Imports
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Delete, Error } from "@mui/icons-material";
import Barcode from "react-barcode";
import ClearIcon from "@mui/icons-material/Clear";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import PrintIcon from "@mui/icons-material/Print";
import Select from "@mui/material/Select";
// Local Imports
import {
  Button,
  TextField,
  CustomModal,
  Typography,
  MuiSwitch as Switch,
  MultiDropDown,
} from "../../../../../shared";
import {
  addLocation,
  deleteLocations,
  updateLocation,
} from "../../../../../api/locationsApi";
import * as Action from "../../../../../redux/locations/selectors";
import { getAllFacilitiesList } from "../../../../../api/customerApi";
import InsideSpinner from "../../../../../shared/Spinner";
import { primaryColor } from "../../../../../helpers/GlobalVariables";
import { AssignDeleteModal } from "../../../../../helpers/AssignDeleteModal";

const LocationInfo = ({ id, location }) => {
  const navigate = useNavigate();
  let locations = Action.GetLocations();

  const [loading, setLoading] = useState(false);
  const [facilityLoading, setFacilityLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [assignLocation, setAssignLocation] = useState("");
  const [isEmtpyAssingLocation, setIsEmptyAssingLocation] = useState(false);
  const [alertModal, setAlertModal] = useState(false);
  const [error, setError] = useState(false);
  const [isDisabled, setIsDisabled] = useState(id ? true : false);
  const [facilities, setFacilities] = useState([]);

  // locations Data
  const [locationData, setLocationData] = useState({
    location: id ? location.name : "",
    customCapacity: id ? location.custom_capacity : "",
    remotePick: id ? location.is_remote_pick : 0,
    barCode: id ? location.barcode : "",
    allergenPick: id ? location.is_allergen_pick : 0,
    tallLocation: id ? location.is_tall_location : 0,
    status: id ? location.status : 0,
    facilities: id ? location.facilities : [],
  });
  const [errorObj, setErrorMsg] = useState({
    type: "",
    title: "",
    msg: "",
    error: "",
  });
  const [showDeleteError, setShowDeleteError] = useState("");
  const [isEmpty, setIsEmpty] = useState({
    location: false,
    customCapacity: false,
    barCode: false,
    assingLocation: false,
    facilities: false,
  });

  //Input Character Validations Regex
  const validateInput = (name, text) => {
    let characters = /^[A-Za-z\s]*$/;
    let numbers = /^(?!(0))[0-9]{0,9}$/;
    let alphaNum = /^[0-9A-Z]{0,15}$/;

    if (name === "location") {
      return characters.test(text);
    } else if (name === "barCode") {
      return alphaNum.test(text);
    } else if (name === "customCapacity") {
      return numbers.test(text);
    } else {
      return true;
    }
  };

  //Handle Input OnChange

  const handleOnChange = (e) => {
    if (validateInput(e.target.name, e.target.value)) {
      setLocationData({
        ...locationData,
        [e.target.name]: e.target.value,
      });
      setIsEmpty({
        location: false,
        customCapacity: false,
        barCode: false,
      });
      setIsDisabled(false);
    }
  };
  // Payload
  const createPayload = () => {
    let facilitiesArray = locationData?.facilities?.map((item) => {
      return item.uuid;
    });
    const payload = {
      name: locationData.location,
      barcode: locationData.barCode,
      custom_capacity: locationData.customCapacity,
      remote_pick: locationData.remotePick,
      allergen_pick: locationData.allergenPick,
      tall_location: locationData.tallLocation,
      status: locationData.status,
      facility_ids: facilitiesArray,
    };
    return payload;
  };

  //Input Form Validations
  const isLocationDataEmpty = () => {
    if (locationData.location === "") {
      setIsEmpty({ ...isEmpty, location: true });
      return true;
    } else if (locationData.barCode === "") {
      setIsEmpty({ ...isEmpty, barCode: true });
      return true;
    } else if (locationData.customCapacity === "") {
      setIsEmpty({ ...isEmpty, customCapacity: true });
      return true;
    } else if (locationData.facilities.length === 0) {
      setIsEmpty({ ...isEmpty, facilities: true });
      return true;
    } else {
      return false;
    }
  };

  //Assign Location Validation
  const validateAssingLocation = () => {
    if (assignLocation === "") {
      setIsEmptyAssingLocation(true);
      return true;
    } else {
      return false;
    }
  };

  //Hanlde Submit Location Button
  const onPressAddLocation = () => {
    setLoading(true);
    if (!isLocationDataEmpty()) {
      let payload = createPayload();
      addLocation(payload)
        .then((res) => {
          console.log(res);
          navigate("/inventory/locations");
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          if (err?.response?.data?.errors) {
            setError(true);
          }
          const locationName = err?.response?.data?.errors?.name;
          const barCode = err?.response?.data?.errors?.barcode;
          setErrorMsg({
            type: "error",
            title: "Error",
            msg: err?.response?.data?.message,
            error: barCode,
          });
        });
    } else {
      setLoading(false);
    }
  };

  // Submit Handle Edit Location
  const onPressEditLocation = () => {
    setLoading(true);

    if (!isLocationDataEmpty()) {
      let payload = createPayload();
      payload = {
        ...payload,
        uuid: location?.uuid,
      };
      updateLocation(payload)
        .then((res) => {
          console.log(res);
          navigate("/inventory/locations");
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          if (err?.response?.data?.errors) {
            setError(true);
          }
          const locationName = err?.response?.data?.errors?.name;
          const barCode = err?.response?.data?.errors?.barcode;
          const errorArray = [locationName, barCode];
          setErrorMsg({
            type: "error",
            title: "Error",
            msg: errorArray,
          });
          console.log(err?.response?.data?.errors);
        });
    } else {
      setLoading(false);
    }
  };

  //Submit Button Edit Or Add Location
  const onPressAddOrEditLocation = () => {
    if (!id) {
      setLoading(true);
      console.log(
        "%cFrom Add Location",
        "color: green; font-family:sans-serif; font-size: 20px; font-weight: 700"
      );
      onPressAddLocation();
    }
    if (id) {
      setLoading(true);
      console.log(
        "%cFrom Edit Location",
        "color: green; font-family:sans-serif; font-size: 20px; font-weight: 700"
      );
      onPressEditLocation();
    }
  };

  //Handle Delete Location OnChange
  const handleDeleteOnChange = (event) => {
    if (event.target.name === "assingLocation") {
      setAssignLocation(event.target.value);
      setIsEmptyAssingLocation(false);
      setShowDeleteError("");
    }
  };

  //Handle Delete Location
  const handleDeleteLocation = (uuid) => {
    let payload = {
      location_id: location?.uuid,
      location_reassign_id: assignLocation,
    };
    setDeleteLoading(true);
    if (!validateAssingLocation()) {
      deleteLocations(payload)
        .then((res) => {
          setDeleteLoading(false);
          navigate("/inventory/locations");
        })
        .catch((error) => {
          setDeleteLoading(false);
          setShowDeleteError(error?.response?.data?.message);
          console.log("error", error?.response?.data?.message);
        });
    } else {
      setDeleteLoading(false);
    }
  };

  //Remove Specific Location form Delete Listing
  locations = locations?.filter((item) => item?.uuid !== location?.uuid);

  // Print BarCode
  const print = () => {
    var mywindow = window.open("", "PRINT", "");

    mywindow.document.write(
      "<html><head><title>" + document.title + "</title>"
    );
    mywindow.document.write("</head><body >");
    mywindow.document.write(
      document.getElementById("section-to-print-add").innerHTML
    );
    mywindow.document.write("</body></html>");

    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();

    return true;
  };

  //handle multiple facilities
  const handleMultiChange = (e, newValue) => {
    setLocationData({
      ...locationData,
      facilities: newValue,
    });
    setIsEmpty({
      ...isEmpty,
      facilities: false,
    });
    setIsDisabled(false);
  };

  //End Buttons
  const Buttons = () => {
    return (
      <div
        className={`mt-4 py-4 bg-white overflow-auto flex border-t border-lightGray ${
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
              onClick={() => setAlertModal(true)}>
              Delete Location
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
            onClick={() => navigate("/inventory/locations")}>
            Cancel
          </Button>
          <div
            className={`mr-[20px] ${
              isDisabled ? "cursor-not-allowed" : "cursor-pointer"
            }`}>
            <Button
              size="medium"
              className="capitalize mr-[20px]"
              component="span"
              color="primary"
              variant="contained"
              loading={loading}
              disabled={isDisabled}
              onClick={onPressAddOrEditLocation}>
              {id ? "Save Location" : "Add Location"}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const getFacilitiesList = () => {
    setFacilityLoading(true);
    getAllFacilitiesList()
      .then((response) => {
        setFacilities(response?.data?.data?.facilities);
        setFacilityLoading(false);
      })
      .catch((error) => {
        setFacilityLoading(false);
        console.log(error);
      });
  };

  useEffect(() => {
    getFacilitiesList();
  }, []);

  return (
    <div
      className={`flex flex-col justify-between ${
        id ? "h-[87vh]" : "h-[90vh] border-t"
      } bg-bgGray`}>
      <div>
        {/* Delete Location Modal */}
        <AssignDeleteModal
          open={alertModal}
          setOpen={setAlertModal}
          headTitle="Delete Location"
          warningMsg=""
          confirmationPrompt={<span>Before you delete <b>"{location?.name}"</b>, you must first reassign the location on schedule items:</span>}
          onClose={() => {
            setAlertModal(!alertModal);
            setIsEmptyAssingLocation(false);
            setAssignLocation("");
            setShowDeleteError("");
          }}
          onDelete={() => handleDeleteLocation(location?.uuid)}
          loading={deleteLoading}
          errorMsg={showDeleteError}
        >
          <div className="my-3 mx-4">
            <div className="form-row mt-2">
              <FormControl fullWidth>
                <InputLabel
                  id="demo-simple-select-label"
                  className={`${isEmtpyAssingLocation ? "text-danger" : primaryColor
                    }`}>
                  Assign Location
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={assignLocation}
                  label="Assign Location"
                  name="assingLocation"
                  color={isEmtpyAssingLocation ? "danger" : "primary"}
                  onChange={handleDeleteOnChange}
                  error={
                    isEmtpyAssingLocation
                      ? "Assign a Location is required."
                      : ""
                  }>
                  {locations?.map((item, index) => {
                    return (
                      <MenuItem key={index} value={item?.uuid}>{item?.location}</MenuItem>
                    );
                  })}
                </Select>
                <FormHelperText className="text-danger">
                  {isEmtpyAssingLocation && "Assign a Location is required"}
                </FormHelperText>
              </FormControl>
            </div>
          </div>
        </AssignDeleteModal>

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
                className="d-flex flex-row align-items-center pl-4"
                variant="body1"
                fontSize={15}
                color="danger"
                fontWeight="light">
                {errorObj?.msg}
              </Typography>
              <Typography
                className="d-flex flex-row align-items-center pl-4"
                variant="body1"
                fontSize={15}
                color="danger"
                fontWeight="light">
                {errorObj?.error}
              </Typography>

              <div className="d-flex flex-row justify-content-end align-items-center mx-3 mt-4 mb-2">
                <Button
                  className="capitalize mr-[10px]"
                  component="span"
                  variant="outlined"
                  color="danger"
                  onClick={() => setError(!error)}>
                  {"OK"}
                </Button>
              </div>
            </div>
          </div>
        </CustomModal>

        {/* Form */}
        <div className="flex flex-col pt-[20px]">
          {facilityLoading ? (
            <InsideSpinner />
          ) : (
            <div className="border rounded bg-white pb-0.5 mx-4">
              <h6 className="px-3 py-3">Location Info.</h6>
              <form className="px-3">
                <div className=" row">
                  {/* Left Section */}
                  <div className="form-group col-md-6">
                    <div className="form-row mb-3">
                      <TextField
                        size="small"
                        label="Location"
                        type={"text"}
                        name="location"
                        value={locationData.location}
                        fullWidth
                        onChange={handleOnChange}
                        helperText={
                          isEmpty.location ? "Location Name is required" : ""
                        }
                        error={isEmpty.location ? true : false}
                      />
                    </div>
                    <div className="form-row mb-3">
                      <div className="border rounded col-12 row ml-0">
                        <div className="border-bottom flex flex-row justify-between h-10">
                          <p className="mt-2">Remote Pick</p>
                          <Switch
                            checked={
                              locationData.remotePick === 1 ? true : false
                            }
                            value={locationData.remotePick}
                            onChange={(event) => {
                              setLocationData({
                                ...locationData,
                                remotePick: event.target.checked ? 1 : 0,
                              });
                              setIsDisabled(false);
                            }}
                          />
                        </div>
                        <div className="border-bottom flex flex-row justify-between h-10">
                          <p className="mt-2">Allergen Pick</p>
                          <Switch
                            checked={
                              locationData.allergenPick === 1 ? true : false
                            }
                            value={locationData.allergenPick}
                            onChange={(event) => {
                              setLocationData({
                                ...locationData,
                                allergenPick: event.target.checked ? 1 : 0,
                              });
                              setIsDisabled(false);
                            }}
                          />
                        </div>
                        <div className="flex flex-row justify-between h-10">
                          <p className="mt-2">Tall Location</p>
                          <Switch
                            checked={
                              locationData.tallLocation === 1 ? true : false
                            }
                            value={locationData.tallLocation}
                            onChange={(event) => {
                              setLocationData({
                                ...locationData,
                                tallLocation: event.target.checked ? 1 : 0,
                              });
                              setIsDisabled(false);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-row mb-3">
                      <div
                        className={`justify-between gap-4 ${
                          id ? "flex" : "block"
                        }`}>
                        <div className="flex-[2]">
                          <TextField
                            size="small"
                            label="Barcode"
                            width="100%"
                            name="barCode"
                            type="text"
                            fullWidth
                            value={locationData.barCode}
                            onChange={handleOnChange}
                            helperText={
                              isEmpty.barCode ? "Barcode is required" : ""
                            }
                            error={isEmpty.barCode ? true : false}
                          />
                        </div>
                        <div className="flex-1">
                          {id && (
                            <div className="d-flex items-center gap-[10px] justify-center ">
                              <span className="-mt-2  p-[2px]">
                                <Barcode
                                  value={location?.barcode}
                                  height={20}
                                />
                              </span>
                              <span
                                className="self-start"
                                onClick={() => print()}>
                                <PrintIcon
                                  className="cursor-pointer"
                                  color="secondary"
                                  fontSize="large"
                                />
                              </span>
                              <span
                                id="section-to-print-add"
                                className="hidden">
                                <Barcode
                                  value={location?.barcode}
                                  height={50}
                                />
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Section */}
                  <div className="form-group col-md-6">
                    <div className="form-row mb-3">
                      <TextField
                        size="small"
                        label="Custom Capacity"
                        type="text"
                        fullWidth
                        name="customCapacity"
                        value={locationData.customCapacity}
                        onChange={handleOnChange}
                        helperText={
                          isEmpty.customCapacity
                            ? "Custom Capacity is required"
                            : ""
                        }
                        error={isEmpty.customCapacity ? true : false}
                      />
                    </div>

                    <div className="form-row mb-3">
                      <MultiDropDown
                        multiple={true}
                        placeholder={"Facilities"}
                        optionsArray={facilities}
                        value={locationData?.facilities}
                        // disabled={facilityUser ? true : false}
                        onChange={handleMultiChange}
                        error={isEmpty.facilities ? true : false}
                        errorMsg={
                          isEmpty.facilities && "Facilities is required"
                        }
                      />
                    </div>

                    <div className="form-row mb-3">
                      <p className="">Status</p>
                      <div className="flex items-center">
                        <Switch
                          checked={locationData.status === 1 ? true : false}
                          value={locationData.status}
                          onChange={(event) => {
                            setLocationData({
                              ...locationData,
                              status: event.target.checked ? 1 : 0,
                            });
                            setIsDisabled(false);
                          }}
                        />
                        <span color="secondary">
                          {locationData.status ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      <div>
        <Buttons />
      </div>
    </div>
  );
};
export default LocationInfo;
