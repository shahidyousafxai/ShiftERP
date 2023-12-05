// Library Imports
import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import ClearIcon from "@mui/icons-material/Clear";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import GetAppRoundedIcon from "@mui/icons-material/GetAppRounded";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Papa from "papaparse";
import { Box } from "@mui/material";

// Local Imports
import {
  CustomModal,
  Button as Lbutton,
  Typography,
  Alert,
  TextField,
} from "../../../../shared";
import * as Actions from "../../../../redux/customer/actions";
import {
  deleteCustomer,
  getCustomerCSVFormat,
  postCustomerImport,
} from "../../../../api/customerApi";
import { lightGray } from "../../../../helpers/GlobalVariables";
import { headerArray } from "../mockUpData/mockupData";
import { Info, PopoverDelete, PopoverEdit, PopoverLoginLink, SettingsPopover } from "../../../../helpers/TableUtilities";
import { AssignDeleteModal } from "../../../../helpers/AssignDeleteModal";

export const customerFields = (text) => {
  return <div className="text-truncate text-[13px]">{text}</div>;
};

export const ManageCustomer = (
  restProps,
  setDeleteAlert,
  setSelectionIds,
  facilityUser,
  companyAdmin
) => {
  const id = restProps.row.id;
  const user = restProps.row;
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsopen] = useState(false);
  const [isError, setIsError] = useState(false);

  const [isDelete, setIsDelete] = useState(false);
  const [customerCode, setCustomerCode] = useState();
  const [error, setError] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = () => {
    setDeleteLoading(true);
    let payload = {
      code: customerCode,
      uuid: restProps.row.uuid,
    };

    if (restProps.row.code === customerCode) {
      deleteCustomer(payload)
        .then((res) => {
          setSelectionIds([]);
          dispatch(Actions.getCustomers(""));
          setDeleteAlert(true);
          setDeleteLoading(false);
        })
        .catch((error) => {
          setDeleteLoading(false);
          if (error?.response?.data) {
            setIsError(error?.response?.data?.errors?.uuid?.[0]);
          }
        });
    } else {
      setError(true);
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      <AssignDeleteModal
        open={isDelete}
        setOpen={setIsDelete}
        headTitle="Delete Customer"
        warningMsg="This action is irreversible. Are you sure you want to delete this customer?"
        confirmationPrompt={"Before you can delete this customer, please enter the code of customer:"}
        onClose={() => {
                  setIsDelete(false);
                  setIsError("");
                  setCustomerCode("");
                }}
        onDelete={() => handleDelete()}
        loading={deleteLoading}
        errorMsg={isError}
      >
        <div className="form-row mx-4">
          <TextField
            label="Customer Code"
            type={"text"}
            fullWidth
            helperText={error ? "Customer Code not matched" : ""}
            error={error ? true : false}
            value={customerCode}
            name="customerCode"
            onFocus={() => setError(false)}
            onChange={(e) => {
              setCustomerCode(e.target.value);
            }}
          />
        </div>
      </AssignDeleteModal>

      <SettingsPopover id={id}>
        <PopoverLoginLink onClick={() => setIsopen(!isOpen)} />
        {!facilityUser && (
          <>
            <PopoverEdit
              onClick={() =>
                navigate("/customers/edit-customer/{$id}", {
                  state: { user: user, from: "editCustomer" },
                })} />

            {companyAdmin && <PopoverDelete onClick={() => setIsDelete(!isDelete)} text="Delete" />}
          </>
        )}
      </SettingsPopover>
    </div>
  );
};

export const Facilities = (restProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const facilitiesArray = restProps.row.facilities;
  return (
    <>
      <FacilityCustomerUserModal
        restProps={restProps}
        isOpen={isOpen}
        setIsopen={setIsOpen}
        facilitiesArray={facilitiesArray}
      />
      <Info
        count={facilitiesArray ? facilitiesArray?.length : 0}
        onClick={() => setIsOpen(!isOpen)}
      />
    </>
  );
};

export const CustomerUsers = (restProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const customerUserArray =
    restProps?.row?.users === undefined ? [] : restProps?.row?.users;
  return (
    <>
      <FacilityCustomerUserModal
        restProps={restProps}
        isOpen={isOpen}
        setIsopen={setIsOpen}
        customerUserArray={customerUserArray}
      />
      <Info
        count={customerUserArray ? customerUserArray?.length : 0}
        onClick={() => setIsOpen(!isOpen)}
      />
    </>
  );
};

const FacilityCustomerUserModal = ({
  restProps,
  isOpen,
  setIsopen,
  facilitiesArray,
  customerUserArray,
}) => {
  return (
    <CustomModal
      open={isOpen}
      close={() => {
        setIsopen(!isOpen);
      }}
      width={window.innerWidth * 0.38}>
      <div className="d-flex flex-row justify-content-between align-items-center">
        <div className="mx-3 font-bold">
          {facilitiesArray ? "Facilities" : "Users"}
        </div>
        <div className="pointer mx-3" onClick={() => setIsopen(!isOpen)}>
          <ClearIcon className="text-secondaryColor" fontSize="small" />
        </div>
      </div>

      <div className="px-3 pb-3 max-h-64 overflow-y-scroll ">
        <table
          className="bg-white text-black table-fixed w-full shadow-none"
          width="100%">
          {/* Table Head */}
          <thead className="sticky top-0 bg-white">
            <tr className="border-b-2">
              <th className="text-darkGray text-[13px] font-[500] w-[5%]  truncate ">
                Sr#
              </th>
              <th className="text-darkGray text-[13px] font-[500] w-[25%] truncate !pl-3 ">
                {facilitiesArray ? "Facility Name" : "User Name"}
              </th>
              <th className="text-darkGray text-[13px] font-[500] w-[40%] truncate ">
                Email
              </th>
              <th className="text-darkGray text-[13px] font-[500]  w-[30%] truncate  ">
                Phone Number
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {/* facilitites Array */}
            {facilitiesArray?.length === 0 ? (
              <>
                <div
                  style={{ width: window.innerWidth * 0.35 }}
                  className="flex flex-col items-center mt-3">
                  {/* <DescriptionIcon fontSize="large" color="secondary" /> */}
                  <p className="mt-2 text-black text-[13px]">
                    No Facility added.
                  </p>
                </div>
              </>
            ) : (
              <>
                {facilitiesArray?.map((item, index) => {
                  return (
                    <tr
                      className={`!rounded-[10px] ${index % 2 !== 0 ? "bg-lightGray" : "bg-white"
                        }`}
                      key={index}>
                      <td className="py-2 text-[13px] w-[5%] !pl-1 truncate">
                        {index + 1}
                      </td>
                      <td className="py-2 text-[13px] w-[25%] !pl-3 truncate ">
                        {item?.name}
                      </td>
                      <td className=" py-2 text-[13px] w-[40%] !pl-1 truncate">
                        {item?.primary_contact?.email}
                      </td>
                      <td className=" py-2 text-[13px] w-[30%] !pl-1 truncate">
                        {item?.primary_contact?.phone}
                      </td>
                    </tr>
                  );
                })}
              </>
            )}
            {/* customer User Array */}
            {customerUserArray?.length === 0 ? (
              <>
                <div
                  style={{ width: window.innerWidth * 0.35 }}
                  className="flex flex-col items-center mt-3">
                  {/* <DescriptionIcon fontSize="large" color="secondary" /> */}
                  <p className="mt-2 text-black text-[13px]">
                    No User added.
                  </p>
                </div>
              </>
            ) : (
              <>
                {customerUserArray?.map((item, index) => {
                  return (
                    <tr
                      className={`!rounded-[10px] ${index % 2 !== 0 ? "bg-lightGray" : "bg-white"
                        }`}
                      key={index}>
                      <td className="py-2 text-[13px] w-[5%] !pl-1 truncate">
                        {index + 1}
                      </td>
                      <td className="py-2 text-[13px] w-[25%] !pl-3 truncate ">
                        {`${item?.fname} ${item?.lname}`}
                      </td>
                      <td className=" py-2 text-[13px] w-[40%] !pl-1 truncate">
                        {item?.email}
                      </td>
                      <td className=" py-2 text-[13px] w-[30%] !pl-1 truncate">
                        {item?.phone}
                      </td>
                    </tr>
                  );
                })}
              </>
            )}
          </tbody>
        </table>
      </div>
    </CustomModal>
  );
};

//import customer
export const ImportCustomerModal = ({
  isImportCustomerOpen,
  setIsImportCustomerOpen,
}) => {
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
  // const [sameDriverArray, setSameDriverArray] = useState([]);
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
              // if (string.trim() === "") {
              return string;
              // } else {
              // return string.replace(/\s/g, "");
              // }
            });

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
              });

              if (emptyFieldsFound.length > 0) {
                emptyFieldsFound.map((item, index) => {
                  setFinalEmptyArray((oldArray) => [...oldArray, item]);
                  finalEmptyValues.push(item);
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
    setOrderTypeNotFound([]);
    setFinalEmptyArray([]);
    setIsEmptyVal(false);
    handleCSVImport(selectedFile);
  };

  // To Run OnChange Handler Again To Select Same Image
  const onInputClick = (event) => {
    event.target.value = "";
    setAllFile();
    setErrorFileSize(false);
    setFileTypeError(false);
    setBackendErrorAlert(false);
    setHeaderError(false);
    setIsEmptyVal(false);
    setFinalEmptyArray([]);
    setOrderTypeNotFound([]);
    setErrList([]);
  };

  const handleFileInputChange = (e) => {
    // Passing file data (event.target.files[0]) to parse using Papa.parse
    let selectedFile = e.target.files[0];
    setBackendErrorAlert(false);
    setOrderTypeNotFound([]);
    setFinalEmptyArray([]);
    setIsEmptyVal(false);
    handleCSVImport(selectedFile);
  };

  //Handle Upload File
  const handleUploadFile = () => {
    if (allFile) {
      setLoading(true);
      setIsLoader(true);
      const formData = new FormData();
      formData.append("file", allFile);
      postCustomerImport(formData)
        .then((res) => {
          setLoading(false);
          setIsLoader(false);
          setAllFile();
          setIsImportCustomerOpen(false);
          dispatch(Actions.getCustomers(""));
          setErrList([]);
        })
        .catch((error) => {
          console.log(error?.response);
          setLoading(false);
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
    setIsImportCustomerOpen(false);
    setBackendErrorAlert(false);
    setHeaderError(false);
    setIsEmptyVal(false);
    setFinalEmptyArray([]);
    setOrderTypeNotFound([]);
    setErrList([]);
  };

  const handleCSVFileTemplate = () => {
    setLoader(true);
    getCustomerCSVFormat()
      .then((res) => {
        setLoader(false);
        const fileLink = res?.data?.data;
        window.open(fileLink, "_blank");
        // console.log(res?.data?.data);
        setAllFile();
        setBackendErrorAlert(false);
        setHeaderError(false);
        setIsEmptyVal(false);
        setFinalEmptyArray([]);
        setOrderTypeNotFound([]);
        setErrList([]);
      })
      .catch((error) => {
        setLoader(false);
        console.log(error);
      });
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
      <div className={`bg-white overflow-auto d-flex justify-between`}>
        <div className="buttons d-flex py-1">
          <Lbutton
            size="medium"
            className="capitalize mr-[5px]"
            component="span"
            color="primary"
            variant="outlined"
            loading={loader}
            disabled={loader}
            onClick={handleCSVFileTemplate}>
            Template File
          </Lbutton>
        </div>
        <div className="buttons d-flex py-1">
          <Lbutton
            size="medium"
            className="capitalize w-20 mr-[10px]"
            component="span"
            variant="outlined"
            color="secondary"
            disabled={loading}
            onClick={handleCancelVerification}>
            Cancel
          </Lbutton>
          <Lbutton
            size="medium"
            className="capitalize mr-[5px]"
            component="span"
            color="primary"
            variant="contained"
            loading={loading}
            disabled={loading}
            onClick={handleUploadFile}>
            Upload
          </Lbutton>
        </div>
      </div>
    );
  };

  const handleShowDoc = () => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const rows = content.split("\n");
      const tableHtml = `
      <table border="1" style="border-collapse: collapse; width: 100%;">
        <thead style="border-collapse: collapse;">
          <tr>
            ${rows[0]
          .split(",")
          .map(
            (cell) =>
              `<th style="text-align: center; padding: 3px;">${cell}</th>`
          )
          .join("")}
          </tr>
        </thead>
        <tbody>
          ${rows
          .slice(1)
          .map(
            (row) =>
              `<tr>${row
                .split(",")
                .map(
                  (cell) =>
                    `<td style="text-align: center; padding: 3px;">${cell}</td>`
                )
                .join("")}</tr>`
          )
          .join("")}
        </tbody>
      </table>
    `;
      const newWindow = window.open();
      newWindow.document.write(`<pre>${tableHtml}</pre>`);
    };
    reader.readAsText(allFile);
  };

  return (
    <CustomModal open={isImportCustomerOpen} width={window.innerWidth * 0.4}>
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
          className="rounded-lg w-full h-[132px] max-h-[132px] flex flex-col items-center cursor-pointer border border-dashed border-darkGray p-4">
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
        {finalEmptyArray?.length > 0 ? (
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
                        {`In Row "${item?.rowNumber}" "${item?.fieldName}" Is Empty "`}
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
                <div className="cursor-pointer mr-2" onClick={handleShowDoc}>
                  <VisibilityIcon className="text-secondaryColor text-[20px]" />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Error msg from backend */}
        {/* {backendErrorAlert && (
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
        )} */}
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
