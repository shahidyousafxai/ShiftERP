/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-self-compare */
// Library Imports
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import GetAppRoundedIcon from "@mui/icons-material/GetAppRounded";
import { Add, Delete } from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";
// Local Imports
import {
  SearchBar,
  Button,
  Spinner,
  BreadCrumb,
  AlertMessage,
  ModalButton,
  CustomModal,
  OptionModal,
  Typography,
  Table as RevenueExpensesTable,
} from "../../../../shared";
import {
  columnData,
  tableColumnExtensions,
  editColumnData,
} from "./mockupData/mockupData";
import { Amount, ManageRevenueExpenses } from "./Components/utils";
import {
  GetRevenueExpenseListing,
  GetRevenueExpenseLoading,
} from "../../../../redux/revenueExpense/selectors";
import { getRevenueExpense } from "../../../../redux/revenueExpense/action";
import { deleteRevenueExpense } from "../../../../api/revenueExpenseApi";
import { getAllDependenciesAccounting } from "../../../../api/allDependencies";
import { getRevenueItemList } from "../../../../api/revenueItemApi";
import { AssignDeleteModal } from "../../../../helpers/AssignDeleteModal";

const RevenueExpenses = () => {
  //Navigation
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get Revenue/Expenses Listing And Loading
  const loading = GetRevenueExpenseLoading();
  const revenue = GetRevenueExpenseListing();

  //All the States
  const [columns] = useState(columnData);
  const [columnToShow, setColumnToShow] = useState(columnData);
  const [name, setName] = useState("");
  const [selectionIds, setSelectionIds] = useState([]);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [dependanciesLoading, setDependanciesLoading] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [selectedRevenueExpenses, setSelectedRevenueExpenses] = useState([]);

  const [revenueType, setRevenueType] = useState([]);
  const [revenueItem, setRevenueItem] = useState([]);
  const [facility, setFacility] = useState([]);
  const [isError, setIsError] = useState("");
  const [columnSetting1] = useState(["amount"]);
  const [columnSetting2] = useState(["manage"]);

  //  filters State
  const [filters, setFilters] = useState({
    RevenueItem: [],
    Date: [{ title: "Date", value: false, type: "" }],
    RevenueType: [],
    Facility: [],
  });
  //Data Providers
  const dataProviders = [
    {
      columnName: columnSetting1,
      func: Amount,
    },
    {
      columnName: columnSetting2,
      func: (resetProps) =>
        ManageRevenueExpenses(
          resetProps,
          setSelectionIds,
          setSelectedRevenueExpenses,
          setDeleteAlert
        ),
    },
  ];

  //onChange Edit Columns
  const onChangeEditColumn = (item) => {
    if (item === "clearAll") {
      setColumnToShow(columnData);
    } else {
      let toShow = [...columnToShow];
      if (toShow.find((el) => el.title === item.title)) {
        toShow.splice(
          toShow.findIndex((el) => el.title === item.title),
          1
        );
      } else {
        toShow = [...columnToShow, item];
      }
      setColumnToShow(toShow);
    }
  };

  //Filters Onchange
  const filterOnChange = (from, item, index) => {
    if (from === "clearAll") {
      setFilters(() => {
        let revenueItem = filters.RevenueItem.slice();
        let date = filters.Date.slice();
        let revenueType = filters.RevenueType.slice();
        let facility = filters.Facility.slice();
        revenueItem?.map((item) => {
          item.value = false;
        });
        date?.map((item) => {
          item.value = false;
          item.type = "";
        });

        revenueType?.map((item) => {
          item.value = false;
        });

        facility?.map((item) => {
          item.value = false;
        });

        const newObj = {
          RevenueItem: revenueItem,
          Date: date,
          RevenueType: revenueType,
          Facility: facility,
        };

        return newObj;
      });
    } else if (from === "RevenueItem") {
      setFilters(() => {
        let revenueItem = filters.RevenueItem.slice();
        let date = filters.Date;
        let revenueType = filters.RevenueType;
        let facility = filters.Facility;

        revenueItem[index].value = !revenueItem[index].value;

        const newObj = {
          RevenueItem: revenueItem,
          Date: date,
          RevenueType: revenueType,
          Facility: facility,
        };

        return newObj;
      });
    } else if (from === "Date") {
      setFilters(() => {
        let revenueItem = filters.RevenueItem.slice();
        let date = filters.Date;
        let revenueType = filters.RevenueType;
        let facility = filters.Facility;

        date?.map((item) => {
          item.type = index;
          item.value = true;
        });

        const newObj = {
          RevenueItem: revenueItem,
          Date: date,
          RevenueType: revenueType,
          Facility: facility,
        };

        return newObj;
      });
    } else if (from === "RevenueType") {
      setFilters(() => {
        let revenueItem = filters.RevenueItem.slice();
        let date = filters.Date;
        let revenueType = filters.RevenueType;
        let facility = filters.Facility;

        revenueType[index].value = !revenueType[index].value;

        const newObj = {
          RevenueItem: revenueItem,
          Date: date,
          RevenueType: revenueType,
          Facility: facility,
        };

        return newObj;
      });
    } else if (from === "Facility") {
      setFilters(() => {
        let revenueItem = filters.RevenueItem.slice();
        let date = filters.Date;
        let revenueType = filters.RevenueType;
        let facility = filters.Facility;

        facility[index].value = !facility[index].value;

        const newObj = {
          RevenueItem: revenueItem,
          Date: date,
          RevenueType: revenueType,
          Facility: facility,
        };

        return newObj;
      });
    }
  };

  //Get Revenue/Expenses Type Array Filter
  const filtersArray = (from) => {
    if (from === "revenueType") {
      let revenueArray = [];
      filters.RevenueType?.map((item, index) => {
        if (item.value) {
          revenueArray.push(revenueType[index].uuid);
        }
      });

      return revenueArray;
    } else if (from === "facility") {
      let facilityArray = [];
      filters.Facility?.map((item, index) => {
        if (item.value) {
          facilityArray.push(facility[index].uuid);
        }
      });
      return facilityArray;
    } else if (from === "revenueItem") {
      let revenueItemArray = [];
      filters.RevenueItem?.map((item, index) => {
        if (item.value) {
          revenueItemArray.push(revenueItem[index].uuid);
        }
      });
      return revenueItemArray;
    }
  };

  //Get Revenue/Expenses Listing with dependencies
  const getRevenueAllListing = () => {
    let date = filters.Date[0].value
      ? filters.Date[0].type
      : filters.Date[0].value
      ? filters.Date[0].type
      : "";
    let payload = {
      revenue_type_id:
        filtersArray("revenueType")?.length > 0
          ? filtersArray("revenueType")
          : "",
      revenue_item_id:
        filtersArray("revenueItem")?.length > 0
          ? filtersArray("revenueItem")
          : "",
      facility_id:
        filtersArray("facility")?.length > 0 ? filtersArray("facility") : "",
      date: date,
      search: name,
    };
    dispatch(getRevenueExpense(payload));
    // setDependanciesLoading(false);
  };

  //On Search Bar
  const onRevenueSearch = () => {
    getRevenueAllListing();
  };

  //handle multiple delete
  const handleDelete = (uuid, setDeleteLoading) => {
    let UUID = Array.isArray(uuid)
      ? uuid?.map((item) => {
          return item?.uuid;
        })
      : [uuid];

    deleteRevenueExpense({ expense_revenue_uuid: UUID })
      .then((res) => {
        setDeleteLoading(false);
        setIsDelete(false);
        setDeleteAlert(true);
        setSelectionIds([]);
        setSelectedRevenueExpenses([]);
        getRevenueAllListing();
      })
      .catch((error) => {
        setDeleteLoading(false);
        if (error?.response?.data) {
          setIsError(error?.response?.data?.message);
        }
      });
  };

  useEffect(() => {
    if (name === "" || filters !== filters) {
      getRevenueAllListing();
      setSelectionIds([]);
    }
  }, [dispatch, name, filters]);

  //UseEffect for get All Accounting Dependencies
  //UseEffect for get Revenue Item
  useEffect(() => {
    let payload = {
      name: "expense_revenue",
    };
    setDependanciesLoading(true);
    getAllDependenciesAccounting(payload)
      .then((res) => {
        setDependanciesLoading(false);
        let data = res?.data?.data;
        let revenueTypeData = data?.revenue_type?.map((item) => {
          return {
            title: item.name,
            value: false,
          };
        });

        let facilityData = data?.facilities?.map((item) => {
          return {
            title: item.name,
            value: false,
          };
        });

        setFilters((prev) => {
          return {
            ...prev,
            RevenueType: revenueTypeData,
            Facility: facilityData,
          };
        });

        setRevenueType(res?.data?.data?.revenue_type);
        setFacility(res?.data?.data?.facilities);
      })
      .catch((error) => {
        setDependanciesLoading(false);
      });

    getRevenueItemList()
      .then((res) => {
        setDependanciesLoading(false);
        let revenueItemData = res?.data?.data?.map((item) => {
          return {
            title: item.name,
            value: false,
          };
        });
        setFilters((prev) => {
          return {
            ...prev,
            RevenueItem: revenueItemData,
          };
        });
        setRevenueItem(res?.data?.data);
      })
      .catch((error) => {
        setDependanciesLoading(false);
      });
  }, []);

  //useEffect for Removing Delete Alert
  useEffect(() => {
    setTimeout(() => {
      setDeleteAlert(false);
    }, 2000);
  }, [deleteAlert]);

  return (
    <div className="main-container pl-4 ">
      {/* BreadCrums Start */}
      <div className="d-flex flex-row justify-content-between align-items-center py-3">
        <div>
          <BreadCrumb
            routes={[
              {
                name: "Accounting",
                route: "/accounting/production-extras",
                color: true,
              },
              { name: "Revenue/Expense" },
            ]}
          />
          <div className="text-[15px] font-bold">Revenue/Expense</div>
        </div>
        <div>
          <Button
            startIcon={<GetAppRoundedIcon />}
            className="capitalize font-medium text-[13px] ml-[10px]"
            onClick={() => navigate("#")}
            component="span"
            color="primary"
            variant="outlined">
            Import Revenue/Expense
          </Button>
          <Button
            startIcon={<Add />}
            className="capitalize font-medium text-[13px] ml-[10px]"
            onClick={() =>
              navigate("/accounting/revenue-expense/add-new-revenue-expense")
            }
            component="span"
            color="primary"
            variant="contained">
            Add New Revenue/Expense
          </Button>
        </div>
      </div>
      {/* BreadCrums End */}

      {/* Search Bar Start */}
      <div className="d-flex flex-row justify-between align-items-center mt-2 mb-2">
        <SearchBar
          disabled={false}
          onClear={() => setName("")}
          onSearch={() => onRevenueSearch()}
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <div className="d-flex flex-row justify-between align-items-center">
          {/* Filters */}
          <ModalButton
            label={"Filter"}
            option1={
              filters?.RevenueItem?.length > 0
                ? filters?.RevenueItem?.some((item) => {
                    return item?.value === true;
                  })
                  ? true
                  : false
                : false
            }
            option2={filters.Date[0].value}
            option3={
              filters?.RevenueType?.length > 0
                ? filters?.RevenueType?.some((item) => {
                    return item?.value === true;
                  })
                  ? true
                  : false
                : false
            }
            option4={
              filters?.Facility?.length > 0
                ? filters?.Facility?.some((item) => {
                    return item?.value === true;
                  })
                  ? true
                  : false
                : false
            }>
            <OptionModal
              options={filters}
              width={"w-48"}
              leftLabel="Filters"
              rightLabel="Clear All"
              onChange={filterOnChange}
            />
          </ModalButton>

          {/* Edit Columns */}
          <ModalButton
            option1={columnToShow.length < 9 ? true : false}
            label={"Edit Columns"}>
            <OptionModal
              options={editColumnData}
              leftLabel="Columns"
              rightLabel="Reset All"
              onChange={onChangeEditColumn}
              columnToShow={columnToShow}
            />
          </ModalButton>
        </div>
      </div>

      {/* Revenue/Expenses Delete Alert Start */}
      {deleteAlert && (
        <AlertMessage
          severity="error"
          text="Revenue/Expense successfully deleted"
          textColor="red"
        />
      )}
      {/* Revenue/Expenses Delete Alert End */}

      {/* To Mullti Delete Revenue/Expenses */}
      <AssignDeleteModal
        open={isDelete}
        setOpen={setIsDelete}
        headTitle="Delete Revenues/Expenses"
        warningMsg=""
        confirmationPrompt="Are you sure you want to delete following selected Revenues/Expenses?"
        onClose={() => {
          setDeleteLoading(false);
          setIsDelete(false);
          setSelectionIds([]);
          setSelectedRevenueExpenses([]);
          getRevenueAllListing();
          setIsError("");
        }}
        onDelete={() => {
          setDeleteLoading(true);
          handleDelete(selectedRevenueExpenses, setDeleteLoading);
        }}
        loading={deleteLoading}
        errorMsg={isError}
      >
        <div className="max-h-52 overflow-y-scroll">
          {selectedRevenueExpenses?.map((item, index) => {
            return (
              <div key={index} className="flex justify-start mx-4">
                <div className="fw-bold">
                  {index + 1} : {item?.revenue_type?.name}
                </div>
              </div>
            );
          })}
        </div>
      </AssignDeleteModal>

      {loading || dependanciesLoading ? (
        <Spinner />
      ) : (
        <RevenueExpensesTable
          rows={revenue.length ? revenue : []}
          columns={columnToShow.length < 9 ? columnToShow : columns}
          tableColumnExtensions={tableColumnExtensions}
          revenueExpenses={true}
          dataProviders={dataProviders}
          selectionIds={selectionIds}
          setSelectionIds={setSelectionIds}
          setIsDelete={setIsDelete}
          selectedRevenueExpenses={selectedRevenueExpenses}
          setSelectedRevenueExpenses={setSelectedRevenueExpenses}
        />
      )}
    </div>
  );
};
export default RevenueExpenses;
