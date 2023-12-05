/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-self-compare */
// Library Imports
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Add } from "@mui/icons-material";
//Local Imports
import {
  BreadCrumb,
  Button,
  ModalButton,
  OptionModal,
  SearchBar,
  Spinner,
  AlertMessage,
  Table as CarriersTable,
} from "../../../../shared";
import { Status } from "../../../../helpers/TableUtilities";
import { ManageCarrier } from "./Components/utils";
import { getCarriers } from "../../../../redux/carriers/actions";
import {
  GetCarriersListing,
  GetCarriersLoading,
} from "../../../../redux/carriers/selectors";
import {
  columnData,
  tableColumnExtensions,
  editColumnData,
} from "./modkupData/mockupData";

const Carriers = () => {
  //Navigations
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const carriers = GetCarriersListing();
  const loading = GetCarriersLoading();
  //All useStates
  const [columns] = useState(columnData);
  const [name, setName] = useState("");
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [columnToShow, setColumnToShow] = useState(columnData);
  const [selectionIds, setSelectionIds] = useState([]);
  const [columnSetting1] = useState(["status"]);
  const [columnSetting2] = useState(["manage"]);

  const [filters, setFilters] = useState({
    Status: [
      {
        title: "Active",
        value: false,
      },
      {
        title: "Inactive",
        value: false,
      },
    ],
  });

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
  //Data Providers
  const dataProviders = [
    {
      columnName: columnSetting1,
      func: (restProps) => Status(restProps?.row?.status, "Active", "inactive"),
    },
    {
      columnName: columnSetting2,
      func: (resetProps) =>
        ManageCarrier(resetProps, setDeleteAlert, setSelectionIds),
    },
  ];

  //Filters Onchange
  const filterOnChange = (from, item, index) => {
    if (from === "clearAll") {
      setFilters(() => {
        let status = filters.Status.slice();

        status[0] = { title: status[0].title, value: false };
        status[1] = { title: status[1].title, value: false };

        const newObj = { Status: status };
        return newObj;
      });
    } else if (from === "Status") {
      setFilters(() => {
        let status = filters.Status.slice();

        if (index === 0) {
          status[index] = { title: item.title, value: !item.value };
          status[index + 1] = { title: status[index + 1].title, value: false };
        } else {
          status[index] = { title: item.title, value: !item.value };
          status[index - 1] = { title: status[index - 1].title, value: false };
        }

        const newObj = {
          Status: status,
        };
        return newObj;
      });
    }
  };
  //Get Listing With Dependencies
  const getCarriersListing = () => {
    let status = filters.Status[0].value ? 1 : filters.Status[1].value ? 0 : "";

    let payload = {
      status: status,
      search: name,
      external_id: "",
    };
    dispatch(getCarriers(payload));
  };

  // OnSearch Click
  const onCarrierSearch = () => {
    getCarriersListing();
  };

  //useEffect
  useEffect(() => {
    if (name === "" || filters !== filters) {
      getCarriersListing();
      setSelectionIds([]);
    }
  }, [dispatch, name, filters]);

  //Delete Alert
  useEffect(() => {
    if (deleteAlert) {
      setTimeout(() => {
        setDeleteAlert(false);
      }, 2000);
    }
  }, [deleteAlert]);

  return (
    <div className="main-container pl-4">
      {/* BreadCrums Start */}
      <div className="d-flex flex-row justify-content-between align-items-center py-3">
        <div>
          <BreadCrumb
            routes={[
              {
                name: "Supply Chain",
                route: "/supply-chain/carriers",
                color: true,
              },
              { name: "Carriers" },
            ]}
          />
          <div className="text-[14px] font-bold">Carriers</div>
        </div>
        <Button
          startIcon={<Add />}
          className="capitalize text-[13px] font-medium"
          onClick={() => navigate("/supply-chain/carriers/add-carrier")}
          component="span"
          color="primary"
          variant="contained">
          Add New Shipper
        </Button>
      </div>
      {/* BreadCrums End */}

      {/* Search Bar Start */}
      <div className="d-flex flex-row justify-between align-items-center mt-2 mb-2">
        <SearchBar
          disabled={false}
          onClear={() => setName("")}
          onSearch={() => onCarrierSearch()}
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <div className="d-flex flex-row justify-between align-items-center">
          {/* Filters */}
          <ModalButton
            label={"Filter"}
            option1={filters.Status[0].value || filters.Status[1].value}>
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

      {/* Carrier Delete Alert */}
      {deleteAlert && (
        <AlertMessage
          text="Carrier successfully deleted"
          textColor="red"
          severity="error"
        />
      )}

      {/* Search Bar End */}
      {loading ? (
        <Spinner />
      ) : (
        <CarriersTable
          customer={true}
          rows={carriers?.length ? carriers : []}
          columns={columnToShow.length < 10 ? columnToShow : columns}
          tableColumnExtensions={tableColumnExtensions}
          dataProviders={dataProviders}
          selectionIds={selectionIds}
          setSelectionIds={setSelectionIds}
        />
      )}
    </div>
  );
};
export default Carriers;
