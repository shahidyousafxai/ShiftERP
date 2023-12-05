/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import React, { useState, useEffect, Fragment } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { Alert, Box, TextField, Stack, Typography } from "@mui/material";
import {
  DesktopDatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useNavigate } from "react-router-dom";
import GetAppRoundedIcon from "@mui/icons-material/GetAppRounded";
import Papa from "papaparse";
import { useDispatch } from "react-redux";


import RichTextInput from "./richTextEditor";
import { Button, CustomModal } from "../../../../shared";
import { getNotes, postImportData } from "../../../../api/smartSchedule";
import { getOrdersList } from "../../../../redux/smartSchedule/actions";
import "./styles.css";
import { lightGray } from "../../../../helpers/GlobalVariables";

export const AddNoteModal = ({ isNoteOpen, setIsNoteOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //current Date and Time
  var currentdate = new Date();
  var currDate =
    currentdate.getDate() +
    "-" +
    (currentdate.getMonth() + 1) +
    "-" +
    currentdate.getFullYear();

  var currTime =
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds();

  // states
  const [date, setDate] = useState(currDate);
  const [time, setTime] = useState(currTime);
  const [newValue, setNewValue] = useState();
  const [loading, setLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [error, setError] = useState("");

  //Form Data
  const [addNoteData, setAddNoteData] = useState({
    body: "",
  });

  // body input Empty Check
  const notesBodyEmpty = () => {
    if (
      addNoteData?.body === "<p><br></p>" ||
      addNoteData?.body === "" ||
      addNoteData?.body === "<ul><li><br></li></ul>" ||
      addNoteData?.body === "<ol><li><br></li></ol>"
    ) {
      setIsEmpty(true);
      const myElement = document.querySelector(".mantine-RichTextEditor-root");
      myElement.style.borderColor = "red";
      return true;
    } else {
      setIsEmpty(false);
      const myElement = document.querySelector(".mantine-RichTextEditor-root");
      myElement.style.borderColor = "";
    }
  };

  //create payload
  const createPayload = () => {
    let payload = {
      date: date,
      time: time,
      notes: addNoteData?.body,
    };
    return payload;
  };

  //handleTime change
  const handleTimeChange = (newValue) => {
    let changeDate = `${newValue?.$D}-${newValue?.$M + 1}-${newValue?.$y}`;
    const currTime = `${newValue?.$H}:${newValue?.$m}:${newValue?.$s}`;
    setNewValue(newValue);
    setDate(changeDate);
    setTime(currTime);
  };

  const onPressAddNotes = () => {
    if (!notesBodyEmpty()) {
      setLoading(true);
      let payload = createPayload();
      getNotes(payload)
        .then((res) => {
          setLoading(false);
          navigate("/smart-schedule");
          setIsNoteOpen(false);
          setAddNoteData({ body: "" });
          setIsEmpty(false);
          dispatch(getOrdersList({ status: "", date: "", duration: "week" }));
        })
        .catch((error) => {
          setLoading(false);
          if (error?.response?.data?.message) {
            setError(error?.response?.data?.message);
          }
        });
    }
  };

  const Buttons = () => {
    return (
      <div className={`bg-white overflow-auto d-flex justify-end`}>
        <div className="buttons d-flex py-1">
          <Button
            size="medium"
            className="normal-case w-20 mr-2.5"
            component="span"
            variant="outlined"
            color="secondary"
            disabled={loading}
            onClick={() => {
              setIsNoteOpen(false);
              setIsEmpty(false);
              setAddNoteData({ body: "" });
              setError("");
            }}>
            Cancel
          </Button>
          <Button
            size="medium"
            className="normal-case w-20 mr-2.5"
            component="span"
            color="primary"
            variant="contained"
            loading={loading}
            disabled={loading}
            onClick={onPressAddNotes}>
            Save
          </Button>
        </div>
      </div>
    );
  };
  return (
    <div>
      <CustomModal
        open={isNoteOpen}
        width={window.innerWidth * 0.43}
        close={() => setIsNoteOpen(false)}>
        <div className="px-[20px] pb-[20px] pt-2 flex flex-col gap-3">
          <div className="flex justify-between pb-2">
            <div className="d-flex flex-row justify-content-between align-items-center text-center font-bold">
              <div className="pointer">
                <InsertDriveFileIcon
                  className=" mx-2 mb-1"
                  color="primary"
                  fontSize="small"
                />
              </div>
              Add Note
            </div>
            <div
              className=" cursor-pointer"
              onClick={() => {
                setIsNoteOpen(!isNoteOpen);
                setIsEmpty(false);
                setAddNoteData({ body: "" });
                setError("");
              }}>
              <CloseRoundedIcon />
            </div>
          </div>
          <div className="d-flex flex-row justify-content-between align-items-center">
            <div className="form-row w-full">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack spacing={0}>
                  <div className="flex justify-between">
                    <DesktopDatePicker
                      className="w-full"
                      label="Date"
                      inputFormat="DD/MM/YYYY"
                      disablePast={true}
                      value={newValue}
                      onChange={handleTimeChange}
                      renderInput={(params) => (
                        <TextField
                          sx={{
                            width: "500px",
                          }}
                          id="inputDate"
                          {...params}
                        />
                      )}
                    />
                    <TimePicker
                      label="Time"
                      value={newValue}
                      disablePast={true}
                      onChange={handleTimeChange}
                      renderInput={(params) => (
                        <TextField
                          sx={{
                            marginLeft: "10px",
                          }}
                          id="inputDate"
                          {...params}
                        />
                      )}
                    />
                  </div>
                </Stack>
              </LocalizationProvider>
            </div>
          </div>

          {/* Input Field / Text Editor */}
          <RichTextInput
            value={addNoteData?.body}
            setValue={(value) => {
              setAddNoteData({
                ...addNoteData,
                body: value,
              });
              setIsEmpty(false);
              setError("");
              const myElement = document.querySelector(
                ".mantine-RichTextEditor-root"
              );
              myElement.style.borderColor = "";
            }}
          />
          {isEmpty && (
            <div className="text-danger text-sm -mb-4 ml-1">
              "Notes field is required"
            </div>
          )}

          <Typography className="text-danger text-sm -mb-4 ml-7 ">
            {error === "" ? "" : error}
          </Typography>
          <Buttons />
        </div>
      </CustomModal>
    </div>
  );
};

export const ImportDataModal = ({ isImportDataOpen, setIsImportDataOpen }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  // eslint-disable-next-line no-unused-vars
  const [file, setFile] = useState(null);
  const [allFile, setAllFile] = useState();
  const [backendError, setBackEndError] = useState("");
  const [backendErrorAlert, setBackendErrorAlert] = useState(false);
  const [errorFileSize, setErrorFileSize] = useState(false);
  const [headerError, setHeaderError] = useState(false);
  const [fileTypeError, setFileTypeError] = useState(false);
  const [loader, setLoader] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [missHead, setMissHead] = useState([]);
  const [extraHead, setExtraHead] = useState([]);
  const [sameDriverArray, setSameDriverArray] = useState([]);
  const [isEmptyVal, setIsEmptyVal] = useState(false);
  const [finalEmptyArray, setFinalEmptyArray] = useState([]);
  const [orderTypeNotFound, setOrderTypeNotFound] = useState([]);
  const [errList, setErrList] = useState([]);

  const handleDrageLeave = () => {
    const dropzoneArea = document.getElementById("dropzone-area");
    dropzoneArea.style.backgroundColor = "";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    const dropzoneArea = document.getElementById("dropzone-area");
    dropzoneArea.style.backgroundColor = lightGray;
  };

  const handleCSVImport = (selectedFile) => {
    if (selectedFile?.type === "text/csv") {
      if (selectedFile?.size <= 50000000 && selectedFile?.size !== 0) {
        Papa.parse(selectedFile, {
          header: true,
          complete: function (results) {
            const header = results?.meta?.fields.map((string) => {
              if (string.trim() === "") {
                return string;
              } else {
                return string.replace(/\s/g, "");
              }
            });
            let headerArray = [
              "customer_code",
              "type",
              "date",
              "time",
              "po_number",
              "release_number",
              "po_notes",
              "notes",
              "kit_name",
              "quantity",
              "unit_name",
              "is_remote_pick",
              "is_allergen_pick",
              "shipper_name",
              "receive_from",
              "ship_to_name",
              "stack_type_name",
              "charge_type_name",
              "is_customer_called",
              "driver1",
              "driver2",
            ];
            const data = results.data;
            let missingHeader = headerArray.filter(
              (item) => header.indexOf(item) === -1
            );

            let extraHeader = header.filter(
              (item) => headerArray.indexOf(item) === -1
            );

            if (missingHeader.length > 0 || extraHeader.length > 0) {
              setHeaderError(true);
              setMissHead(missingHeader);
              setExtraHead(extraHeader);
            } else {
              let emptyFieldsFound = [];
              let finalEmptyValues = [];
              let checkOrderTypeFound = [];
              let sameDrivers = [];
              data?.map((rowItem, rowIndex) => {
                //Check Empty Values in CSV
                headerArray?.map((colItem, colIndex) => {
                  if (rowItem[colItem] === "") {
                    // console.log(
                    //   `In Row ${
                    //     rowIndex + 1
                    //   } field ${colItem} is empty with order type ${
                    //     rowItem?.["type"]
                    //   }`
                    // );
                    const obj = {
                      rowNumber: rowIndex + 1,
                      fieldName: colItem,
                      orderType: rowItem?.["type"],
                    };
                    emptyFieldsFound.push(obj);
                  }
                });
                //Check Drivers duplication
                if (rowItem?.["driver1"] === rowItem?.["driver2"]) {
                  const obj = {
                    rowNumber: rowIndex + 1,
                  };
                  sameDrivers.push(obj);
                  setSameDriverArray((sameDrivers) => [...sameDrivers, obj]);
                  // console.log(`In Row ${rowIndex + 1} drivers are same`);
                }
              });

              if (emptyFieldsFound.length > 0) {
                emptyFieldsFound.map((item, index) => {
                  if (
                    item?.orderType === "shipping" ||
                    item?.orderType === "Shipping"
                  ) {
                    if (
                      item?.fieldName === "customer_code" ||
                      item?.fieldName === "stack_type_name" ||
                      item?.fieldName === "charge_type_name" ||
                      item?.fieldName === "shipper_name" ||
                      item?.fieldName === "ship_to_name" ||
                      item?.fieldName === "date" ||
                      item?.fieldName === "time" ||
                      item?.fieldName === "driver1" ||
                      item?.fieldName === "driver2"
                    ) {
                      setFinalEmptyArray((oldArray) => [...oldArray, item]);
                      finalEmptyValues.push(item);
                    }
                  } else if (
                    item?.orderType === "blend" ||
                    item?.orderType === "Blend" ||
                    item?.orderType === "production" ||
                    item?.orderType === "Production"
                  ) {
                    if (
                      item?.fieldName === "customer_code" ||
                      item?.fieldName === "kit_name" ||
                      item?.fieldName === "unit_name" ||
                      item?.fieldName === "date" ||
                      item?.fieldName === "time" ||
                      item?.fieldName === "quantity" ||
                      item?.fieldName === "driver1" ||
                      item?.fieldName === "driver2"
                    ) {
                      setFinalEmptyArray((oldArray) => [...oldArray, item]);
                      finalEmptyValues.push(item);
                    }
                  } else if (
                    item?.orderType === "receiving" ||
                    item?.orderType === "Receiving"
                  ) {
                    if (
                      item?.fieldName === "customer_code" ||
                      item?.fieldName === "receive_from" ||
                      item?.fieldName === "unit_name" ||
                      item?.fieldName === "shipper_name" ||
                      item?.fieldName === "quantity" ||
                      item?.fieldName === "date" ||
                      item?.fieldName === "time" ||
                      item?.fieldName === "driver1" ||
                      item?.fieldName === "driver2"
                    ) {
                      setFinalEmptyArray((oldArray) => [...oldArray, item]);
                      finalEmptyValues.push(item);
                    }
                  } else {
                    setOrderTypeNotFound((oldArray) => [...oldArray, item]);
                    checkOrderTypeFound.push(item);
                  }
                });
              }
              if (
                finalEmptyValues?.length > 0 ||
                checkOrderTypeFound?.length > 0 ||
                sameDrivers?.length > 0
              ) {
                setIsEmptyVal(true);
                setAllFile();
              } else if (
                finalEmptyValues?.length === 0 ||
                checkOrderTypeFound?.length === 0 ||
                sameDrivers?.length === 0
              ) {
                setAllFile(selectedFile);
              }
            }
          },
        });
      } else if (selectedFile === undefined) {
      } else {
        setErrorFileSize(true);
      }
    } else {
      setFileTypeError(true);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropzoneArea = document.getElementById("dropzone-area");
    dropzoneArea.style.backgroundColor = "";
    const selectedFile = Object.values(e.dataTransfer.files)[0];
    setBackendErrorAlert(false);
    setBackendErrorAlert(false);
    setOrderTypeNotFound([]);
    setFinalEmptyArray([]);
    setSameDriverArray([]);
    setIsEmptyVal(false);
    handleCSVImport(selectedFile);
  };

  // To Run OnChange Handler Again To Select Same Image
  const onInputClick = (event) => {
    event.target.value = "";
    setErrorFileSize(false);
    setFileTypeError(false);
    setBackendErrorAlert(false);
    setHeaderError(false);
    setIsEmptyVal(false);
    setFinalEmptyArray([]);
    setOrderTypeNotFound([]);
    setSameDriverArray([]);
    setErrList([]);
  };

  const handleFileInputChange = (e) => {
    // Passing file data (event.target.files[0]) to parse using Papa.parse
    let selectedFile = e.target.files[0];
    setBackendErrorAlert(false);
    setOrderTypeNotFound([]);
    setFinalEmptyArray([]);
    setSameDriverArray([]);
    setIsEmptyVal(false);
    handleCSVImport(selectedFile);
  };

  //Handle Upload File
  const handleUploadFile = () => {
    if (allFile) {
      setLoading(true);
      setLoader(true);
      setIsLoader(true);
      const formData = new FormData();
      formData.append("file", allFile);
      postImportData(formData)
        .then((res) => {
          setLoading(false);
          setLoader(false);
          setIsLoader(false);
          setAllFile();
          setIsImportDataOpen(false);
          dispatch(getOrdersList({ status: "", date: "", duration: "week" }));
          setErrList([]);
        })
        .catch((error) => {
          console.log(error?.response);
          setLoading(false);
          setLoader(false);
          setIsLoader(false);
          if (error?.response?.data?.message) {
            setBackendErrorAlert(true);
            setBackEndError(error?.response?.data?.message);
            setErrList(error?.response?.data?.errors);
            console.log(error?.response?.data?.message);
          }
        });
    } else {
      // console.log("false");
    }
  };

  //handle Cancel Verification
  const handleCancelVerification = () => {
    setAllFile();
    setIsImportDataOpen(false);
    setBackendErrorAlert(false);
    setHeaderError(false);
    setIsEmptyVal(false);
    setFinalEmptyArray([]);
    setOrderTypeNotFound([]);
    setSameDriverArray([]);
    setErrList([]);
  };

  // UseEffect For Hiding Error Messages
  useEffect(() => {
    if (errorFileSize || fileTypeError) {
      setTimeout(() => {
        setErrorFileSize(false);
        setFileTypeError(false);
      }, 3000);
    }
  }, [errorFileSize, fileTypeError]);

  const Buttons = () => {
    return (
      <div className={`bg-white overflow-auto d-flex justify-end`}>
        <div className="buttons d-flex py-1">
          <Button
            size="medium"
            className="normal-case w-20 mr-2.5"
            component="span"
            variant="outlined"
            color="secondary"
            disabled={loading}
            onClick={handleCancelVerification}>
            Cancel
          </Button>
          <Button
            size="medium"
            className="normal-case mr-2.5"
            component="span"
            color="primary"
            variant="contained"
            loading={loading}
            disabled={loading}
            onClick={handleUploadFile}>
            Upload for Verification
          </Button>
        </div>
      </div>
    );
  };

  return (
    <CustomModal open={isImportDataOpen} width={window.innerWidth * 0.4}>
      <div className="px-[20px] pb-[20px] pt-2 flex flex-col gap-3">
        <div className="flex justify-between pb-2">
          <div className="d-flex flex-row justify-content-between align-items-center text-center font-bold">
            Import Data
          </div>
          {!loading && (
            <div className=" cursor-pointer" onClick={handleCancelVerification}>
              <CloseRoundedIcon className="text-secondaryColor" />
            </div>
          )}
        </div>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDrageLeave}
          id="dropzone-area"
          onDrop={handleDrop}
          className="rounded-lg w-full h-[132px] max-h-[132px] flex flex-col items-center cursor-pointer border border-darkGray p-4">
          <GetAppRoundedIcon className="text-darkGray" />
          <div className="flex items-center gap-1 text-[14px] py-3">
            <p>Drag and Drop your files here or</p>
            <div className="file-input-container">
              <label
                htmlFor="file-input"
                className="text-primaryColor text-[14px] font-semibold cursor-pointer">
                <span> browse</span>
              </label>
              <input
                type="file"
                id="file-input"
                accept=".csv"
                onChange={handleFileInputChange}
                onClick={onInputClick}
              />
            </div>
          </div>
          <p className="text-darkGray text-[14px]">
            CSV format only. Max size: 50MB
          </p>
        </div>

        {/* Error msg file less than 50mb */}
        {errorFileSize && (
          <div className="d-flex flex-row pr-2 align-items-center">
            <Alert className="w-fit justify-end" severity="error" icon={true}>
              <div className="d-flex flex-row justify-between align-items-center">
                <Typography
                  variant="h1"
                  fontSize={13}
                  fontWeight="medium"
                  color={"red"}>
                  Please select the file Min 50MB
                </Typography>
              </div>
            </Alert>
          </div>
        )}

        {/*Header or length Error msg */}
        {headerError && (
          <div className="max-h-[200px] w-[100%] overflow-y-auto !overflow-x-hidden bg-[#FDEDED] p-3 rounded-md">
            <Typography
              variant="h1"
              fontSize={12}
              fontWeight="medium"
              color={"red"}
              className="!w-[50%] pb-1">
              Please check the file and try again.
              <br />
            </Typography>
            <Box severity="error" icon={true}>
              <div className="d-flex flex-row overflow-x-hidden !justify-between !w-[100%] gap-1">
                {missHead?.[0] !== "" ? (
                  <Typography
                    variant="h1"
                    fontSize={12}
                    fontWeight="medium"
                    color={"red"}
                    className="!w-[50%]">
                    <span className="text-danger font-bold text-xs">
                      Missing Headers are:
                    </span>

                    <br />
                    {missHead?.map((item) => {
                      return (
                        <span className="text-danger">
                          {item} <br />
                        </span>
                      );
                    })}
                  </Typography>
                ) : null}
                {extraHead?.[0] !== "" ? (
                  <Typography
                    // variant="h1"
                    fontSize={12}
                    fontWeight="medium"
                    color={"red"}
                    className="!w-[50%]">
                    <span className="text-danger font-bold text-xs">
                      Extra Headers are:
                    </span>
                    <br />
                    {extraHead?.map((item) => {
                      return (
                        <span className="text-danger">
                          {item}, <br />
                        </span>
                      );
                    })}{" "}
                  </Typography>
                ) : null}
              </div>
            </Box>
          </div>
        )}

        {/* Error than CSV*/}
        {fileTypeError && (
          <div className="d-flex flex-row pr-2 align-items-center">
            <Alert className="w-fit justify-end" severity="error" icon={true}>
              <div className="d-flex flex-row justify-between align-items-center">
                <Typography
                  variant="h1"
                  fontSize={13}
                  fontWeight="medium"
                  color={"red"}>
                  Please select the CSV file only.
                </Typography>
              </div>
            </Alert>
          </div>
        )}
        {finalEmptyArray?.length > 0 ||
        orderTypeNotFound?.length > 0 ||
        sameDriverArray?.length > 0 ? (
          <Fragment>
            <div className="d-flex flex-col gap-2 pr-2 align-items-left max-h-[200px] overflow-y-auto">
              {finalEmptyArray?.map((item, index) => {
                return (
                  <Alert
                    className="w-fit justify-end"
                    severity="error"
                    icon={true}
                    key={index}>
                    <div className="d-flex flex-row justify-between align-items-center">
                      <Typography fontSize={12} color={"red"}>
                        {`In Row "${item?.rowNumber}" "${item?.fieldName}" Is Empty With Order Type "${item?.orderType}"`}
                      </Typography>
                    </div>
                  </Alert>
                );
              })}
              {orderTypeNotFound?.map((item, index) => {
                return (
                  <Alert
                    className="w-fit justify-end"
                    severity="error"
                    icon={true}
                    key={index}>
                    <div className="d-flex flex-row justify-between align-items-center">
                      <Typography fontSize={12} color={"red"}>
                        {`In Row "${item?.rowNumber}" Order Type "${item?.orderType}" Invalid`}
                      </Typography>
                    </div>
                  </Alert>
                );
              })}
              {sameDriverArray?.map((item, index) => {
                return (
                  <Alert
                    className="w-fit justify-end"
                    severity="error"
                    icon={true}
                    key={index}>
                    <div className="d-flex flex-row justify-between align-items-center">
                      <Typography fontSize={12} color={"red"}>
                        {`In Row ${item?.rowNumber} drivers are same`}
                      </Typography>
                    </div>
                  </Alert>
                );
              })}
            </div>
          </Fragment>
        ) : (
          ""
        )}
        {allFile && (
          <>
            <div className="text-black text-[14px] py-1">Selected File:</div>
            <div className="flex flex-col gap-2">
              <div className="w-full border-[2px] border-solid border-gray-100 h-[58px] rounded-lg flex justify-between items-center px-2 py-3">
                <div className="flex gap-2 items-center">
                  <InsertDriveFileIcon className="text-primaryColor" />
                  <div className="flex flex-col justify-center">
                    <p className="text-charcoalBlack text-[13px]">{allFile.name}</p>
                    <span className="text-darkGray text-[11px]">
                      {allFile.size < 1024
                        ? allFile.size + " Bytes"
                        : allFile.size < 1048576
                        ? (allFile.size / 1024).toFixed(2) + " KB"
                        : allFile?.size < 1073741824
                        ? (allFile?.size / 1048576).toFixed(2) + " MB"
                        : ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Error msg from backend */}
        {backendErrorAlert && (
          <React.Fragment>
            <div className="d-flex flex-row pr-2 align-items-center">
              <Alert className="w-fit justify-end" severity="error" icon={true}>
                <div className="d-flex flex-row justify-between align-items-center">
                  <Typography
                    variant="h1"
                    fontSize={13}
                    fontWeight="medium"
                    color={"red"}>
                    {backendError}
                  </Typography>
                </div>
              </Alert>
            </div>
          </React.Fragment>
        )}
        {backendErrorAlert && (
          <React.Fragment>
            <div className="max-h-[200px]  overflow-y-auto">
              <Alert className="w-fit justify-end" severity="error" icon={true}>
                <div className="d-flex flex-col justify-between align-items-left gap-2">
                  {errList?.map((item) => {
                    return (
                      <Typography
                        variant="h1"
                        fontSize={13}
                        fontWeight="medium"
                        color={"red"}>
                        {item[0]}
                      </Typography>
                    );
                  })}
                </div>
              </Alert>
            </div>
          </React.Fragment>
        )}

        {/* Buttons */}
        <Buttons />
      </div>
    </CustomModal>
  );
};
