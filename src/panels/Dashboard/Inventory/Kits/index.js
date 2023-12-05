/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-self-compare */
// Library Imports
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ClearIcon from "@mui/icons-material/Clear";
import { Add } from "@mui/icons-material";
import Delete from "@mui/icons-material/Delete";
// Local Imports
import {
  CustomModal,
  Button,
  BreadCrumb,
  Table as KitsTable,
  Spinner,
  SearchBar,
  OptionModal,
  ModalButton,
  AlertMessage,
  Typography,
} from "../../../../shared";
import * as Actions from "../../../../redux/kits/actions";
import * as Selectors from "../../../../redux/kits/selectors";
import { ManageKit } from "./Components/utils";
import { Name } from "../../../../helpers/TableUtilities";
import { deleteKit } from "../../../../api/kitsApi";
import {
  columnData,
  tableColumnExtensions,
  editColumnData,
} from "./mockupData/mockupData";
import "rsuite/dist/rsuite.min.css";
import { AssignDeleteModal } from "../../../../helpers/AssignDeleteModal";

const Kits = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const companyAdmin = user?.currentUser?.role === "company_admin";
  const facilityUser = user?.currentUser?.role === "facility_user";

  //************************* Table States And Methods Start *******************************/
  const loading = Selectors.GetKitsLoading();
  const kits = Selectors.GetKits();
  const [columns] = useState(columnData);
  const [columnToShow, setColumnToShow] = useState(columnData);
  const [ColumnSetting1] = useState(["kit"]);
  const [ColumnSetting2] = useState(["manage"]);

  // Selection States
  const [selectionIds, setSelectionIds] = useState([]);
  const [selectedKits, setSelectedKits] = useState([]);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const [name, setName] = useState("");
  const [filters, setFilters] = useState({ Kits: [] });
  const [kitsClearAll, setKitsClearAll] = useState([]);
  // Inside Filter Search
  const [searchText, setSearchText] = useState("");
  const [searchArray, setSearchArray] = useState([]);

  const onRowSelect = (selectedKits) => {
    const kit = selectedKits?.completeItem;
    navigate("/inventory/edit-kit/${id}", {
      state: { kit, from: "editKits" },
    });
  };

  // Handle OnChange Edit Columns
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
  // Data Provider
  const dataProviders = [
    {
      columnName: ColumnSetting1,
      // Please pass an empty string if no any of the argument is missing
      func: (restProps) => Name(restProps.row.kit, "", ""),
    },
    {
      columnName: ColumnSetting2,
      func: (restProps) =>
        ManageKit(
          restProps,
          setDeleteAlert,
          setSelectionIds,
          setSelectedKits,
          getKitsList,
          companyAdmin
        ),
    },
  ];

  const [deleteAlert, setDeleteAlert] = useState(false);
  // UseEffect For Hiding Info Messages
  useEffect(() => {
    if (deleteAlert) {
      setTimeout(() => {
        setDeleteAlert(false);
      }, 2000);
    }
  }, [deleteAlert]);
  // From Manage Options Delete Kit
  const handleDelete = (uuid, setDeleteLoading) => {
    let UUID = Array.isArray(uuid)
      ? uuid?.map((item) => {
          return item?.uuid;
        })
      : [uuid];

    deleteKit({ ids: UUID })
      .then((res) => {
        setDeleteLoading(false);
        setIsDelete(false);
        setDeleteAlert(true);
        setSelectionIds([]);
        setSelectedKits([]);
        getKitsList();
      })
      .catch((error) => {
        setDeleteLoading(false);
        if (error?.response?.data) {
          setIsError(error?.response?.data?.message);
        }
      });
  };

  // onSearch
  const onKitSearch = () => {
    if (name !== "") {
      getKitsList();
    }
  };
  // Calling Dependency API for Customer Code
  const getDependencyList = (from) => {
    if (from === "clearAll") {
      if (kitsClearAll?.length > 0) {
        const kitsArr = kitsClearAll?.map((item) => {
          const obj = {
            title: item?.kit,
            uuid: item?.completeItem?.uuid,
            value: false,
          };
          return obj;
        });
        setFilters({ Kits: kitsArr });
      }
    } else {
      if (kits?.length > 0) {
        const kitsArr = kits?.map((item) => {
          const obj = {
            title: item?.kit,
            uuid: item?.completeItem?.uuid,
            value: false,
          };
          return obj;
        });
        setFilters({ Kits: kitsArr });
        setKitsClearAll(kits);
      }
    }
  };

  // Handle OnChange Setting
  const filterOnChange = (from, item, index) => {
    if (from === "clearAll") {
      setSearchText("");
      setSearchArray([]);
      getDependencyList("clearAll");
    } else {
      setFilters(() => {
        let kits = filters.Kits.slice();

        kits[index].value = !kits[index].value;

        const newObj = { Kits: kits };
        return newObj;
      });
    }
  };
  // Search OnChange
  const searchOnChange = (e) => {
    setSearchText(e.target.value);
    createSearchArray(e.target.value);
  };
  // Create Search Array
  const createSearchArray = (text) => {
    let tempArr = [];
    tempArr =
      filters?.Kits?.length > 0 &&
      filters?.Kits?.map((item) => {
        if (item?.title?.toLowerCase().includes(text.toLowerCase())) {
          return item;
        }
      }).filter((element) => {
        return element !== undefined;
      });
    setSearchArray(tempArr);
  };

  // UseEffect For Calling Dependency Array
  useEffect(() => {
    getDependencyList();
  }, []);

  // UseEffect For Calling Listing On Name And Filter Change
  useEffect(() => {
    if (name === "" || filters !== filters) {
      getKitsList();
    }
  }, [name, filters]);

  // Fetching the Listing
  const getKitsList = () => {
    const kitUUID =
      Array.isArray(filters?.Kits) &&
      filters?.Kits?.length > 0 &&
      filters?.Kits?.map((item) => {
        if (item?.value) {
          return item?.uuid;
        }
      }).filter((element) => {
        return element !== undefined;
      });
    const payload = {
      search: name,
      kit_id: !kitUUID ? [] : kitUUID,
    };
    dispatch(Actions.getKits(payload));
  };
  //************************* Listing States And Methods End *******************************/

  return (
    <div className="main-container pl-4">
      {/* To Mullti Delete Kits */}
      <AssignDeleteModal
        open={isDelete}
        setOpen={setIsDelete}
        headTitle="Delete Kits"
        warningMsg=""
        confirmationPrompt={"Are you sure you want to delete following selected kits?"}
        onClose={() => {
          setDeleteLoading(false);
          setIsDelete(false);
          setSelectionIds([]);
          setSelectedKits([]);
          getKitsList();
          setIsError("");
        }}
        onDelete={() => {
          setDeleteLoading(true);
          handleDelete(selectedKits, setDeleteLoading);
        }}
        loading={deleteLoading}
        errorMsg={isError}
      >
        <div className="max-h-52 overflow-y-scroll">
          {selectedKits?.map((item, index) => {
            return (
              <div key={index} className="flex justify-start mx-4">
                <div className="fw-bold">
                  {index + 1}: {item?.name}
                </div>
              </div>
            );
          })}
        </div>
      </AssignDeleteModal>

      {/* BreaddCrumbs & Add Kits Button */}
      <div className="d-flex flex-row justify-content-between align-items-center py-3">
        <div>
          <BreadCrumb
            routes={[
              { name: "Inventory", route: "/inventory/products", color: true },
              { name: "Kits" },
            ]}
          />
          <div className="text-[15px] font-bold">Kits</div>
        </div>
        {!facilityUser && (
          <Button
            startIcon={<Add />}
            className="capitalize text-[13px] font-medium mr-[10px"
            onClick={() =>
              navigate("/inventory/add-kit", {
                state: { from: "addKits" },
              })
            }
            component="span"
            color="primary"
            variant="contained"
            disabled={loading}>
            Add New Kits
          </Button>
        )}
      </div>

      {/* Search Bar with Buttons */}
      <div className="d-flex flex-row justify-between align-items-center mt-2 mb-2">
        <SearchBar
          disabled={
            filters?.Kits?.length > 0
              ? () => {
                  return filters?.Kits?.some((item) => item?.value === true)
                    ? true
                    : false;
                }
              : false
          }
          onClear={() => setName("")}
          onSearch={() => onKitSearch()}
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <div className="d-flex flex-row justify-between align-items-center">
          {/* Filters */}
          <ModalButton
            option1={
              filters?.Kits?.length > 0
                ? filters?.Kits?.some((item) => {
                    return item?.value === true;
                  })
                  ? true
                  : false
                : false
            }
            label={"Filter"}>
            <OptionModal
              options={filters}
              hasSearch
              searchText={searchText}
              searchOnChange={searchOnChange}
              searchArray={searchArray}
              width={"w-48"}
              leftLabel="Filters"
              rightLabel="Clear All"
              onChange={filterOnChange}
            />
          </ModalButton>

          {/* Edit Columns */}
          <ModalButton
            option1={columnToShow.length < 5 ? true : false}
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

      {/* Kit Delete Alert */}
      {deleteAlert && (
        <AlertMessage
          severity="error"
          text="Kit successfully deleted"
          textColor="red"
        />
      )}

      {/* Table View */}
      {loading ? (
        <Spinner />
      ) : (
        <KitsTable
          rows={kits?.length ? kits : []}
          columns={columnToShow.length < 5 ? columnToShow : columns}
          tableColumnExtensions={tableColumnExtensions}
          dataProviders={dataProviders}
          selectionIds={selectionIds}
          setSelectionIds={setSelectionIds}
          kits={true}
          companyAdmin={companyAdmin ? true : false}
          setIsDelete={setIsDelete}
          selectedKits={selectedKits}
          setSelectedKits={setSelectedKits}
          onRowSelect={onRowSelect}
        />
      )}
    </div>
  );
};

export default Kits;
