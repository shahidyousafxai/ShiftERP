/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-self-compare */
// Library Imports
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Add } from "@mui/icons-material";
import GetAppRoundedIcon from "@mui/icons-material/GetAppRounded";

// Local Imports
import {
  BreadCrumb,
  SearchBar,
  Button,
  Table as VendorsTable,
  OptionModal,
  ModalButton,
  Spinner,
  AlertMessage,
} from "../../../../shared";
import { ManageVendor } from "./Components/utlis";
import { Status } from "../../../../helpers/TableUtilities";
import { getVendors } from "../../../../redux/vendors/actions";
import {
  GetVendorsListing,
  GetVendorsLoading,
} from "../../../../redux/vendors/selectors";
import {
  columnData,
  editColumnData,
  tableColumnExtensions,
} from "./mockupData/mockupData";

const Vendors = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //Vendors Listing And Loading
  const loading = GetVendorsLoading();
  const vendors = GetVendorsListing();

  //All the States
  const [columns] = useState(columnData);
  const [columnToShow, setColumnToShow] = useState(columnData);
  const [name, setName] = useState("");
  const [selectionIds, setSelectionIds] = useState([]);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [columnSetting1] = useState(["status"]);
  const [columnSetting2] = useState(["manage"]);

  //Data Providers
  const dataProviders = [
    {
      columnName: columnSetting1,
      func: (restProps) => Status(restProps?.row?.status, "Active", "Inactive"),
    },
    {
      columnName: columnSetting2,
      func: (resetProps) =>
        ManageVendor(resetProps, setDeleteAlert, setSelectionIds),
    },
  ];
  //filters
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

  //Get Vendors Listing with dependencies
  const getVendorsListing = () => {
    let status = filters.Status[0].value ? 1 : filters.Status[1].value ? 0 : "";
    let payload = {
      status: status,
      search: name,
      vendor_ids: "",
    };

    dispatch(getVendors(payload));
  };

  //On Search Bar
  const onVendorsSearch = () => {
    getVendorsListing();
  };

  //useEffect For Get Listing With Dependencies
  useEffect(() => {
    if (name === "" || filters !== filters) {
      getVendorsListing();
    }
  }, [dispatch, name, filters]);

  //useEffect for Removing Delete Alert
  useEffect(() => {
    setTimeout(() => {
      setDeleteAlert(false);
    }, 2000);
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
              { name: "Vendors" },
            ]}
          />
          <div className="font-bold text-[15px]">Vendors</div>
        </div>
        <div>
          <Button
            startIcon={<GetAppRoundedIcon />}
            className="capitalize font-medium text-[13px] mr-[10px]"
            onClick={() => navigate("#")}
            component="span"
            color="primary"
            variant="outlined">
            Import Vendor
          </Button>
          <Button
            startIcon={<Add />}
            className="capitalize text-[13px]"
            onClick={() => navigate("/supply-chain/vendors/add-vendor")}
            component="span"
            color="primary"
            variant="contained">
            Add New Vendor
          </Button>
        </div>
      </div>
      {/* BreadCrums End */}

      {/* Search Bar Start */}
      <div className="d-flex flex-row justify-between align-items-center mt-2 mb-2">
        <SearchBar
          disabled={false}
          onClear={() => setName("")}
          onSearch={() => onVendorsSearch()}
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
            option1={columnToShow.length < 8 ? true : false}
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

      {/* Carrier Delete Alert Start */}
      {deleteAlert && (
        <AlertMessage
          severity="error"
          text="Vendor successfully deleted"
          textColor="red"
        />
      )}

      {loading ? (
        <Spinner />
      ) : (
        <VendorsTable
          customer={true}
          rows={vendors.length ? vendors : []}
          columns={columnToShow.length < 8 ? columnToShow : columns}
          tableColumnExtensions={tableColumnExtensions}
          dataProviders={dataProviders}
          selectionIds={selectionIds}
          setSelectionIds={setSelectionIds}
        />
      )}
    </div>
  );
};
export default Vendors;
