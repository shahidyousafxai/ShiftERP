// Library Imports
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Add } from "@mui/icons-material";
// Local Imports
import {
  BreadCrumb,
  SearchBar,
  ModalButton,
  Button as Button,
  Spinner,
  OptionModal,
  AlertMessage,
  Table as ProductionExtraTable,
} from "../../../../shared";
import {
  ManageProductionExtra,
  directMaterial,
} from "./Components/utils";
import { Status } from "../../../../helpers/TableUtilities";
import { getProductionExtra } from "../../../../redux/productionExtra/actions";
import {
  GetProductionExtraListing,
  GetProductionExtraLoading,
} from "../../../../redux/productionExtra/selectors";
import {
  columnData,
  tableColumnExtensions,
  editColumnData,
} from "./mockupData/mockupData";

const ProductionExtra = () => {
  //Navigations
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = GetProductionExtraLoading();
  const productionExtraList = GetProductionExtraListing();
  //All useStates
  const [columns] = useState(columnData);
  const [name, setName] = useState("");
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [columnToShow, setColumnToShow] = useState(columnData);
  const [selectionIds, setSelectionIds] = useState([]);
  const [columnSetting1] = useState(["status"]);
  const [columnSetting2] = useState(["manage"]);
  const [columnSetting3] = useState(["dm"]);

  //filterState
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
    DM: [
      {
        title: "Activity",
        value: false,
      },
      {
        title: "Direct Material",
        value: false,
      },
    ],
  });

  //Edit Column Change Handler
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
      func: (restProps) => Status(restProps?.row?.status, "Active", "Inactive"),
    },
    {
      columnName: columnSetting3,
      func: directMaterial,
    },
    {
      columnName: columnSetting2,
      func: (resetProps) =>
        ManageProductionExtra(resetProps, setDeleteAlert, setSelectionIds),
    },
  ];

  //Filter OnChange Handler
  const filterOnChange = (from, item, index) => {
    if (from === "clearAll") {
      setFilters(() => {
        let status = filters.Status.slice();
        let dm = filters.DM.slice();

        status[0] = { title: status[0].title, value: false };
        status[1] = { title: status[1].title, value: false };

        dm[0] = { title: dm[0].title, value: false };
        dm[1] = { title: dm[1].title, value: false };

        const newObj = {
          Status: status,
          DM: dm,
        };
        return newObj;
      });
    } else if (from === "Status") {
      setFilters(() => {
        let status = filters.Status.slice();
        let dm = filters.DM.slice();

        if (index === 0) {
          status[index] = { title: item.title, value: !item.value };
          status[index + 1] = { title: status[index + 1].title, value: false };
        } else {
          status[index] = { title: item.title, value: !item.value };
          status[index - 1] = { title: status[index - 1].title, value: false };
        }

        const newObj = {
          Status: status,
          DM: dm,
        };
        return newObj;
      });
    } else if (from === "DM") {
      setFilters(() => {
        let status = filters.Status.slice();
        let dm = filters.DM.slice();

        if (index === 0) {
          dm[index] = { title: item.title, value: !item.value };
          dm[index + 1] = { title: dm[index + 1].title, value: false };
        } else {
          dm[index] = { title: item.title, value: !item.value };
          dm[index - 1] = { title: dm[index - 1].title, value: false };
        }
        const newObj = {
          Status: status,
          DM: dm,
        };
        return newObj;
      });
    }
  };

  //Get Listing With Dependencies
  const getProductionExtraListing = () => {
    let status = filters.Status[0].value ? 1 : filters.Status[1].value ? 0 : "";
    let directMaterial = filters.DM[0].value ? 1 : filters.DM[1].value ? 0 : "";
    let payload = {
      status: status,
      search: name,
      direct_material: directMaterial,
    };
    dispatch(getProductionExtra(payload));
  };

  //Search bar
  const onProductionExtraSearch = () => {
    getProductionExtraListing();
  };

  //UseEffect for Listing
  useEffect(() => {
    if (name === "" || filters !== filters) {
      getProductionExtraListing();
      setSelectionIds([]);
    }
  }, [dispatch, name, filters]);

  //  UseEffect for Delete Alert
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
                name: "Accounting",
                route: "/accounting/production-extras",
                color: true,
              },
              { name: "Production Extras" },
            ]}
          />
          <div className="text-[15px] font-bold">Production Extras</div>
        </div>
        <Button
          startIcon={<Add />}
          className="capitalize text-[13px] font-medium "
          onClick={() =>
            navigate("/accounting/production-extras/add-production-extras")
          }
          component="span"
          color="primary"
          variant="contained">
          Add New Production Extras
        </Button>
      </div>
      {/* BreadCrums End */}

      {/* Search Bar Start */}
      <div className="d-flex flex-row justify-between align-items-center mt-2 mb-2">
        <SearchBar
          disabled={false}
          onClear={() => setName("")}
          onSearch={() => onProductionExtraSearch()}
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <div className="d-flex flex-row justify-between align-items-center">
          {/* Filters */}
          <ModalButton
            label={"Filter"}
            option1={filters.Status[0].value || filters.Status[1].value}
            option2={filters.DM[0].value || filters.DM[1].value}>
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
            option1={columnToShow.length < 7 ? true : false}
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

      {/* Production Extra Delete Alert */}
      {deleteAlert && (
        <AlertMessage
          text="Production Extra successfully deleted"
          severity="error"
          textColor="red"
        />
      )}

      {loading ? (
        <Spinner />
      ) : (
        <ProductionExtraTable
          customer={true}
          rows={productionExtraList?.length ? productionExtraList : []}
          columns={columnToShow.length < 7 ? columnToShow : columns}
          tableColumnExtensions={tableColumnExtensions}
          dataProviders={dataProviders}
          selectionIds={selectionIds}
          setSelectionIds={setSelectionIds}
        />
      )}
    </div>
  );
};

export default ProductionExtra;
