/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ClearIcon from "@mui/icons-material/Clear";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PrintIcon from "@mui/icons-material/Print";
import { Add, Edit } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import {
  columnData,
  tableColumnExtensions,
} from "./DummyData/dummyDataProduct";
import { getUniversalModalData } from "../../../../api/universalModelData";
import { getProducts } from "../../../../redux/product/actions";
import {
  GetProducts,
  GetProductsLoading,
} from "../../../../redux/product/selectors";
import {
  Button,
  MaterialDropdown,
  Typography,
  CustomModal,
  BreadCrumb,
  SearchBar,
  CheckBox,
} from "../../../../shared";
import EventIcon from "@mui/icons-material/Event";
import MultiDropDown from "../../../../shared/MultiDropDown";
import { Datepicker } from "@mobiscroll/react";
import "./styles.css";
import { Product } from "./Components/addUtils";
import { format, startOfMonth, endOfMonth } from "date-fns";

import { GenerateNeedsReport } from "./Components/GenerateNeedsReport";
import ProductTable from "./Components/productTable/productTable";
import Error from "@mui/icons-material/Error";

const AddNewNeedsReport = () => {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  let { id } = useParams();
  const { state } = useLocation();
  const needs = state?.needs;
  const products = GetProducts();
  const loading = GetProductsLoading();

  //states
  const [activeCutomers, setActiveCustomers] = useState([]);
  const [name, setName] = useState("");
  const [tableRow, setTableRow] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);

  const [weeksRange, setWeekRange] = useState([]);
  const [monthRange, setMonthRange] = useState([]);
  const [weeks, setWeeks] = useState([]);

  const [monthsNames, setMonthsNames] = useState([]);
  const [columnSetting1] = useState(["name"]);
  const [columnSetting2] = useState(["Week1"]);

  // Error Modal States
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // eslint-disable-next-line no-unused-vars
  const [allProducts, setAllProducts] = useState([]);
  const [showSelectedProduct, setShowSelectedProduct] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [generateNeedsReport, setGenerateNeedsReport] = useState(false);
  const [frequencyArray, setFrequencyArray] = useState([
    { name: "Weekly", uuid: "2" },
    { name: "Monthly", uuid: "3" },
  ]);
  const [needsReportData, setNeedsReportData] = useState({
    customers: [],
    frequencyName: "Weekly",
    frequencyUUID: "2",
    date: null,
  });
  const [weekDataArray, setWeekDataArray] = useState([]);
  //Column data and column extenstion data

  const checkColumn = () => {
    if (needsReportData?.frequencyName === "Weekly") {
      let newWeekColumn = columnData.concat(weeksRange);
      return newWeekColumn;
    } else if (needsReportData?.frequencyName === "Monthly") {
      let newMonthColumn = columnData.concat(monthRange);
      return newMonthColumn;
    }
  };

  const columnExtensionsData = () => {
    if (needsReportData?.frequencyName === "Weekly") {
      let newWeekColumnExtension = tableColumnExtensions.concat(
        weeksRange.map((item) => {
          return { columnName: item?.name, width: 178, sortingEnabled: false };
        })
      );
      return newWeekColumnExtension;
    } else if (needsReportData?.frequencyName === "Monthly") {
      let newMonthColumnExtension = tableColumnExtensions.concat(
        monthRange.map((item) => {
          return { columnName: item?.name, width: 178, sortingEnabled: false };
        })
      );
      return newMonthColumnExtension;
    }
  };

  //useEffect for get Customer and Product
  useEffect(() => {
    if (name === "") {
      getProductsList();
    }
  }, [name]);

  useEffect(() => {
    const payloadCustomers = {
      module_name: "customer",
      fields: ["name", "code", "uuid", "status"],
    };
    const payloadProducts = {
      module_name: "product",
      fields: ["uuid", "name", "status"],
    };

    //customer payload
    getUniversalModalData(payloadCustomers).then((res) => {
      let data = res?.data?.data;
      let obj = data.filter((o) => o.status === 1);
      setActiveCustomers(obj);
    })
    .catch((error) => {
      if(error?.response){
        setError(true);
        setErrorMsg(error?.response?.data?.message);
      } else {
        setError(true);
        setErrorMsg("Oops! Something went wrong.");
      }
    })

    //Products payload
    getUniversalModalData(payloadProducts)
      .then((res) => {
        let data = res?.data?.data;
        let obj = data.filter((o) => o.status === 1);
        setAllProducts(obj);
      })
      .catch((error) => {
        console.log(
          "🚀 ~ file: AddNewNeedsReport.js ~ line 35 ~ error",
          error?.message
        );
      });
  }, []);

  //getproduct listing
  const getProductsList = () => {
    let payload = {
      search: name,
      status: "",
      high_risk: "",
      costed: "",
      order: "",
    };
    dispatch(getProducts(payload));
  };

  //handle checked box of product
  const handleChecked = (e, product) => {
    if (e.target.checked) {
      products?.map((item) => {
        if (item.uuid === product?.uuid) {
          setShowSelectedProduct([
            ...showSelectedProduct,
            {
              name: product?.name,
              uuid: product?.uuid,
            },
          ]);
        }
      });
    } else {
      setShowSelectedProduct(
        showSelectedProduct.filter((cur) => cur?.uuid !== product?.uuid)
      );
    }
  };

  const handleAddProd = () => {
    const staticVal = {
      UOM: 300,
      On_Hand: 300,
      Picked: 100,
      Ordered: 700,
      Producing: 700,
      Net_Avail: 400,
      Par_Level: "-",
      Needed_Par: 400,
    };

    const array = showSelectedProduct?.map((item) => {
      const obj = {
        name: item?.name,
        uuid: item?.uuid,
        ...staticVal,
      };
      return obj;
    });
    setTableRow(array);
    setIsOpen(!isOpen);
  };

  const handleCancel = () => {
    setIsOpen(!isOpen);
    setShowSelectedProduct([]);
  };

  const [singleRowData, setSingleRowData] = useState([]);

  //Data Providers
  const dataProviders = [
    {
      columnName: columnSetting1,
      func: (restProps) => Product(restProps),
    },
    {
      columnName: weeks.slice(0, 13),
      func: (restProps) => ManageWeeks(restProps),
    },
    {
      columnName: monthsNames.slice(0, 4),
      func: (restProps) => ManageWeeks(restProps),
    },
  ];

  function ManageWeeks(restProps) {
    const rowUuid = restProps?.row?.uuid;
    const rowData = singleRowData.find((data) => data.rowId === rowUuid);
    const values = rowData ? rowData?.values : {};
    const lastData = singleRowData[singleRowData.length - 1];
    const lastValue = lastData?.values;
    const handleInputOnChange = (event) => {
      const name = event.target.name;
      const value = event.target.value;

      // Find the index of the existing object for the current row
      const rowIndex = singleRowData.findIndex(
        (data) => data?.rowId === rowUuid
      );
      if (rowIndex !== -1) {
        // If the row exists in singleRowData, update its values
        const updatedRow = {
          ...singleRowData[rowIndex],
          values: {
            ...singleRowData[rowIndex].values,
            [name]: value,
          },
        };

        // Update the singleRowData array
        const updatedData = [...singleRowData];
        updatedData[rowIndex] = updatedRow;

        setSingleRowData(updatedData);
      } else {
        // If the row doesn't exist in singleRowData, create a new entry
        setSingleRowData((oldData) => [
          ...oldData,
          {
            rowId: rowUuid,
            values: {
              ...restProps.row.values, // Include any existing values
              [name]: value,
            },
          },
        ]);
      }
      event.target.focus();
    };

    return (
      <div className="d-flex flex-row align-items-center">
        <div className="w-20 h-10">
          <input
            className="!h-8 !w-24 outline-none border border-[#E0E0E0] rounded-md px-2"
            // name={restProps?.column?.name}
            // value={values[restProps?.column?.name] || ""}
            // onChange={handleInputOnChange}
          />
        </div>
      </div>
    );
  }

  const onProductSearch = () => {
    getProductsList();
  };

  //handle multi change customers
  const handleMultiChange = (event, newValue) => {
    setNeedsReportData({ ...needsReportData, customers: newValue });
  };

  //handle frequency change
  const handleOnChange = (e) => {
    if (e.target.name === "frequencyUUID") {
      let name = "";
      frequencyArray?.filter((item) => {
        if (item?.uuid === e.target.value) {
          name = item?.name;
          return item?.name;
        }
      });
      setSelectedDates([]);
      setGenerateNeedsReport(false);
      setWeekRange([]);
      setMonthRange([]);
      setWeeks([]);
      setMonthsNames([]);
      setNeedsReportData({
        ...needsReportData,
        frequencyName: name,
        [e.target.name]: e.target.value,
      });
    }
  };

  //handle date range change
  const handleDateChange = (event, inst) => {
    // Get selected dates
    const [startDate, endDate] = inst.getVal();

    // Number of milliseconds in a week and a month
    const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;

    // Calculate the difference between start and end dates in milliseconds
    const dateDifference = endDate - startDate;

    // Calculate the number of weeks and months
    const numberOfWeeks = Math.ceil(dateDifference / millisecondsPerWeek);

    setSelectedDates(inst.getVal());

    // Create arrays to store the formatted week and month ranges
    const formattedWeekRanges = [];
    const weeksNameArray = [];
    const formattedMonthRanges = [];

    // Iterate through the weeks and generate the formatted week ranges
    for (let i = 0; i < numberOfWeeks; i++) {
      const weekStart = new Date(startDate.getTime() + i * millisecondsPerWeek);
      const weekEnd = new Date(weekStart.getTime() + millisecondsPerWeek - 1);
      const formattedRange = `${weekStart.toLocaleString("default", {
        month: "short",
      })} ${weekStart.getDate()} - ${weekEnd.toLocaleString("default", {
        month: "short",
      })} ${weekEnd.getDate()}, ${weekStart.getFullYear()}`;
      weeks.push("Week" + (i + 1));
      formattedWeekRanges.push({
        name: "Week" + (i + 1),
        title: (
          <>
            <div className="text-[12px]">{"Week " + (i + 1)}</div>
            <div className="text-black font-bold text-[12px] -mt-2">
              {formattedRange}
            </div>
          </>
        ),
      });
      weeksNameArray.push({ ["Week" + (i + 1)]: "" });
    }

    // Iterate through the months and generate the formatted month ranges
    let currentDate = startOfMonth(startDate);
    const lastDate = endOfMonth(endDate);

    let monthCounter = 1;

    while (currentDate <= lastDate) {
      const formattedStart = format(currentDate, "MMM d");
      const formattedEnd = format(endOfMonth(currentDate), "MMM d, yyyy");

      const formattedMonthRange = `${formattedStart} - ${formattedEnd}`;
      monthsNames.push("Month " + monthCounter);
      formattedMonthRanges.push({
        name: `Month ${monthCounter}`,
        title: (
          <>
            <div className="text-[12px]">{`Month ${monthCounter}`}</div>
            <div className="text-black font-bold text-[12px] -mt-2">
              {formattedMonthRange}
            </div>
          </>
        ),
      });

      currentDate = startOfMonth(
        new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
      );
      monthCounter++;
    }

    if (needsReportData?.frequencyName === "Weekly") {
      const newWeeksRange = formattedWeekRanges.slice(0, 13);
      const weeksName = weeksNameArray.slice(0, 13);
      setWeekRange(newWeeksRange);
      setWeekDataArray(weeksName);
    } else if (needsReportData?.frequencyName === "Monthly") {
      const newMonthRange = formattedMonthRanges.slice(0, 4);
      setMonthRange(newMonthRange);
    }
  };

  return (
    <>
    <div className="flex flex-col justify-between h-[100vh]">
      {/* Bread Crums Start*/}
      <div>
        <div className="flex justify-between items-center p-3 bg-white border-bottom">
          <div>
            <BreadCrumb
              routes={[
                {
                  name: "Supply Chain",
                  route: "/supply-chain/carriers",
                  color: true,
                },
                {
                  name: "Needs Report",
                  route: "/supply-chain/needs",
                  color: true,
                },
                { name: id ? needs?.name : "New Needs Report" },
              ]}
            />
            {id ? (
              <div>
                <Edit className="mb-1 mr-1" color="primary" />
                Edit : {needs?.name}
              </div>
            ) : (
              <div className="font-bold ">
                <Add className="mb-1" color="primary" />
                New Needs Report
              </div>
            )}
          </div>

          {/* Save, Export, Print button */}
          <div className="">
            <Button
              className="capitalize !w-[10px]"
              onClick={() => navigate("#")}
              component="span"
              variant="outlined">
              <PrintIcon />
            </Button>

            <Button
              startIcon={<InsertDriveFileIcon />}
              className="capitalize text-[13px]  ml-[10px]"
              onClick={() => navigate("#")}
              component="span"
              variant="outlined">
              Export CSV
            </Button>
            <Button
              className="capitalize text-[13px]  ml-[10px]"
              onClick={() => {}}
              component="span"
              variant="contained">
              Save Needs Report
            </Button>
          </div>
        </div>

        {/* Product list Modal */}
        <CustomModal open={isOpen} width={window.innerWidth * 0.3}>
          <div>
            <div className="d-flex flex-row justify-content-between align-items-center mx-3">
              <div className="d-flex my-1 flex-row justify-content-between align-items-center text-center">
                <div className="pointer">
                  <Add
                    className="mr-1 -ml-[0.25px]"
                    color="primary"
                    fontSize="small"
                  />
                </div>
                <b>Add Product(s)</b>
              </div>
              <div className="pointer " onClick={() => handleCancel()}>
                <ClearIcon color="secondary" fontSize="small" />
              </div>
            </div>

            {/* Search Bar Start */}
            <div className="d-flex mx-3 flex-row justify-between align-items-center mt-2  ">
              <SearchBar
                disabled={false}
                onClear={() => setName("")}
                onSearch={() => onProductSearch()}
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>

            {/*Selected Product Show */}
            <div className="flex gap-[3px] ml-4 flex-wrap">
              {showSelectedProduct?.map((item, index) => {
                return (
                  <span
                    key={index}
                    className="bg-lightGray text-black cursor-pointer px-[5px] mt-3 rounded-md text-[13px] mx-1">
                    {item?.name}
                  </span>
                );
              })}
              {showSelectedProduct.length > 0 && (
                <span
                  onClick={() => setShowSelectedProduct([])}
                  className="bg-lightGray text-white px-[5px] cursor-pointer py-0 mt-3 rounded-md text-[13px] flex items-center justify-center">
                  Clear All{" "}
                  <ClearIcon
                    fontSize="2"
                    className="text-white ml-1 -mt-[0.15px]"
                  />
                </span>
              )}
            </div>

            {/* Buttons add and cancel*/}
            <div className="mb-3 -mt-2 mx-4 ml-2"></div>
            <div className="mb-3 ml-1">
              <div className="form-row ml-4 max-h-40 overflow-y-scroll">
                {loading
                  ? "Loading..."
                  : products?.map((product, index) => {
                      return (
                        <div className="flex flex-col" key={index}>
                          <CheckBox
                            size="small"
                            color={"#000"}
                            fontWeight={500}
                            label={product?.name}
                            checked={
                              showSelectedProduct.some(
                                (el) => el.uuid === product?.uuid
                              )
                                ? true
                                : false
                            }
                            onChange={(e) => handleChecked(e, product)}
                          />
                        </div>
                      );
                    })}
              </div>
              <div className="d-flex flex-row justify-content-end align-items-center mx-3 mt-4 mb-2">
                <Button
                  component="span"
                  color="secondary"
                  className="capitalize mr-0.5"
                  variant="outlined"
                  onClick={() => handleCancel()}>
                  Cancel
                </Button>
                <Button
                 className="normal-case text-[13px] font-medium ml-2.5"
                  onClick={() => handleAddProd()}
                  component="span"
                  color="primary"
                  variant="contained">
                  Add Product (s)
                </Button>
              </div>
            </div>
          </div>
        </CustomModal>
        <div className="mx-3">
          {/* customer fields start */}
          <div className="mt-3 flex flex-row w-full gap-2 ">
            <div className="w-7/12">
              <MultiDropDown
                multiple={true}
                placeholder={"Choose Customers"}
                optionsArray={activeCutomers}
                value={needsReportData?.customers}
                onChange={handleMultiChange}
              />
            </div>
            <div className="w-2/12">
              <MaterialDropdown
                multiple={false}
                options={frequencyArray}
                value={needsReportData?.frequencyUUID}
                label={"Frequency"}
                name="frequencyUUID"
                withRenderValue
                fullWidth
                onChange={handleOnChange}
                userRoleToShow={needsReportData?.frequencyName}
              />
            </div>

            <div className="ml-2 w-3/12 ">
              <Datepicker
                controls={["calendar"]}
                select="range"
                dateFormat="MMM D , YYYY"
                endIcon={
                  <EventIcon className="mt-[1px] h-5 opacity-90 cursor-pointer" />
                }
                getWeekNumber={true}
                // defaultValue={[selectedDates[0], selectedDates[1]]}
                // label="Date"
                touchUi={false}
                inputProps={{
                  placeholder: "Date",
                  style: {
                    outline: "none",
                    top: "-2px",
                    position: "relative",
                    color: "#000",
                  },
                }}
                theme="material"
                themeVariant="light"
                value={selectedDates}
                onChange={handleDateChange}
              />
            </div>
          </div>
          {/* customer fields end */}

          {/* Product Table start */}
          {/* Basic Info */}
          <div className="border rounded bg-white pb-0.5 h-fit mt-[20px]">
            <div className="flex justify-between items-center">
              <Typography className="pl-4 py-3 font-semibold text-sm">
                Editor
              </Typography>

              <Button
                startIcon={<Add />}
                className="capitalize text-[12px] mr-4 w-[90px] h-8"
                onClick={() => setIsOpen(true)}
                component="span"
                variant="outlined">
                Product
              </Button>
            </div>
            <div className={""}>
              <ProductTable tableHead={checkColumn()} tableRow={tableRow} />
            </div>
          </div>

          {tableRow?.length > 0 &&
            (weeksRange?.length > 0 || monthRange?.length > 0) && (
              <div className="flex justify-end my-2">
                <Button
                  startIcon={<Add />}
                  className="capitalize text-[12px]"
                  onClick={() => setGenerateNeedsReport(true)}
                  component="span"
                  variant="outlined">
                  Generate Needs
                </Button>
              </div>
            )}
          {/* Needs Report */}

          {generateNeedsReport && (
            <div className="border rounded bg-white pb-0.5 h-fit mb-5">
              <Typography className="pl-4 py-3 font-semibold text-sm">
                Needs Report
              </Typography>

              <div className={"h-fit"}>
                <GenerateNeedsReport weekRange={weeksRange} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

    <CustomModal
      open={error ? true : false}
      close={() => {
        setError(!error);
        setErrorMsg("");
      }}
      width={window.innerWidth * 0.4}>
      <div>
        <div className="d-flex flex-row justify-content-between align-items-center">
          <div className="flex flex-row justify-between items-center text-center">
            <div className="pointer">
              <Error
                className="mx-3"
                color="danger"
                fontSize="small"
              />
            </div>
            <span>
              Error
            </span>
          </div>
          <div
            className="pointer mx-3"
            onClick={() => {
             setError(!error);
              setErrorMsg("");
            }}>
            <ClearIcon color="secondary" fontSize="small" />
          </div>
        </div>
        <div className="mb-3 mx-3">
          <Typography
            className="d-flex flex-row align-items-center"
            variant="body1"
            fontSize={15}
            marginBottom={1}
            marginTop={3}
            fontWeight="light">
            {errorMsg ? errorMsg : ""}
          </Typography>
          <div className="d-flex flex-row justify-content-end align-items-center mb-2">
            <Button
              className="capitalize mr-2.5"
              component="span"
              variant="outlined"
              color="secondary"
              onClick={() => {
                setError(!error);
                setErrorMsg("");
              }}
            >
              {"OK"}
            </Button>
          </div>
        </div>
      </div>
    </CustomModal>
    </>
  );
};

export default AddNewNeedsReport;
