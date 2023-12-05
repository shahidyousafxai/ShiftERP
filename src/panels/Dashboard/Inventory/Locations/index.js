/* eslint-disable react-hooks/exhaustive-deps */
// Library Imports
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Barcode from "react-barcode";
import { Add, Visibility } from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";
// Local Imports
import {
  BreadCrumb,
  Button,
  ModalButton,
  OptionModal,
  SearchBar,
  CustomModal,
  Spinner,
  AlertMessage,
  Table as LocationsTable,
} from "../../../../shared";
import { ManageLocation, allergenPick } from "./Components/utils";
import { Statistics, Status } from "../../../../helpers/TableUtilities";
import * as Selectors from "../../../../redux/locations/selectors";
import { getLocations } from "../../../../redux/locations/actions";
import {
  columnData,
  tableColumnExtensions,
  editColumnData,
} from "./mockupData/mockupData";
import "rsuite/dist/rsuite.min.css";

const Locations = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const companyAdmin = user?.currentUser?.role === "company_admin";
  const facilityAdmin = user?.currentUser?.role === "facility_admin";
  const facilityUser = user?.currentUser?.role === "facility_user";

  const loading = Selectors.GetLocationsLoading();
  const locations = Selectors.GetLocations();
  const [name, setName] = useState("");
  const [columns] = useState(columnData);
  const [columnToShow, setColumnToShow] = useState(columnData);
  const [columnSetting1] = useState(["active"]);
  const [columnSetting2] = useState(["manage"]);
  const [columnSetting3] = useState(["tall"]);
  const [columnSetting4] = useState(["remotePick"]);
  const [columnSetting5] = useState(["allergenPick"]);
  const [selectionIds, setSelectionIds] = useState([]);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [isOpen, setIsopen] = useState(false);
  const [previewBarCode, setPreviewBarCode] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [previewBarCodeObj, setPreviewBarCodeObj] = useState({
    description: "",
    barcodeNum: "",
  });

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
    "Tall Location": [
      {
        title: "Active",
        value: false,
      },
      {
        title: "Inactive",
        value: false,
      },
    ],
    "Remote Pick": [
      {
        title: "Active",
        value: false,
      },
      {
        title: "Inactive",
        value: false,
      },
    ],
    "Allergen Pick": [
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

  //Row Select ----> move to edit screen
  const onRowSelect = (selectedLocation) => {
    const id = selectedLocation?.uuid;
    navigate(`/inventory/edit-location/${id}`, {
      state: { location: selectedLocation?.completeItem },
    });
  };

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
  const dataProviders = [
    {
      columnName: columnSetting1,
      func: (restProps) => Status(restProps?.row?.active, "Active", "Inactive"),
    },
    {
      columnName: columnSetting3,
      func: (restProps) => Statistics(restProps?.row?.tall),
    },
    {
      columnName: columnSetting4,
      func: (restProps) => Statistics(restProps?.row?.remotePick),
    },
    {
      columnName: columnSetting5,
      func: (restProps) => Statistics(restProps?.row?.allergenPick),
    },
    {
      columnName: columnSetting2,
      func: (resetProps) =>
        ManageLocation(
          resetProps,
          facilityUser,
          previewBarcode,
          getlocationListing,
          deleteAlert,
          setDeleteAlert
        ),
    },
  ];

  //Filtr OnChange Start

  const filterOnChange = (from, item, index) => {
    if (from === "clearAll") {
      setFilters(() => {
        let status = filters.Status.slice();
        let tall = filters["Tall Location"].slice();
        let remotePick = filters["Remote Pick"].slice();
        let allergenPick = filters["Allergen Pick"].slice();

        status[0] = { title: status[0].title, value: false };
        status[1] = { title: status[1].title, value: false };

        tall[0] = { title: tall[0].title, value: false };
        tall[1] = { title: tall[1].title, value: false };

        remotePick[0] = { title: remotePick[0].title, value: false };
        remotePick[1] = { title: remotePick[1].title, value: false };

        allergenPick[0] = { title: allergenPick[0].title, value: false };
        allergenPick[1] = { title: allergenPick[1].title, value: false };

        const newObj = {
          Status: status,
          "Tall Location": tall,
          "Remote Pick": remotePick,
          "Allergen Pick": allergenPick,
        };
        return newObj;
      });
    } else if (from === "Status") {
      setFilters(() => {
        let status = filters.Status.slice();
        let tall = filters["Tall Location"].slice();
        let remotePick = filters["Remote Pick"].slice();
        let allergenPick = filters["Allergen Pick"].slice();

        if (index === 0) {
          status[index] = { title: item.title, value: !item.value };
          status[index + 1] = { title: status[index + 1].title, value: false };
        } else {
          status[index] = { title: item.title, value: !item.value };
          status[index - 1] = { title: status[index - 1].title, value: false };
        }

        const newObj = {
          Status: status,
          "Tall Location": tall,
          "Remote Pick": remotePick,
          "Allergen Pick": allergenPick,
        };
        return newObj;
      });
    } else if (from === "Tall Location") {
      setFilters(() => {
        let status = filters.Status.slice();
        let tall = filters["Tall Location"].slice();
        let remotePick = filters["Remote Pick"].slice();
        let allergenPick = filters["Allergen Pick"].slice();

        if (index === 0) {
          tall[index] = { title: item.title, value: !item.value };
          tall[index + 1] = { title: tall[index + 1].title, value: false };
        } else {
          tall[index] = { title: item.title, value: !item.value };
          tall[index - 1] = { title: tall[index - 1].title, value: false };
        }

        const newObj = {
          Status: status,
          "Tall Location": tall,
          "Remote Pick": remotePick,
          "Allergen Pick": allergenPick,
        };
        return newObj;
      });
    } else if (from === "Remote Pick") {
      setFilters(() => {
        let status = filters.Status.slice();
        let tall = filters["Tall Location"].slice();
        let remotePick = filters["Remote Pick"].slice();
        let allergenPick = filters["Allergen Pick"].slice();

        if (index === 0) {
          remotePick[index] = { title: item.title, value: !item.value };
          remotePick[index + 1] = {
            title: remotePick[index + 1].title,
            value: false,
          };
        } else {
          remotePick[index] = { title: item.title, value: !item.value };
          remotePick[index - 1] = {
            title: remotePick[index - 1].title,
            value: false,
          };
        }
        const newObj = {
          Status: status,
          "Tall Location": tall,
          "Remote Pick": remotePick,
          "Allergen Pick": allergenPick,
        };
        return newObj;
      });
    } else if (from === "Allergen Pick") {
      setFilters(() => {
        let status = filters.Status.slice();
        let tall = filters["Tall Location"].slice();
        let remotePick = filters["Remote Pick"].slice();
        let allergenPick = filters["Allergen Pick"].slice();

        if (index === 0) {
          allergenPick[index] = { title: item.title, value: !item.value };
          allergenPick[index + 1] = {
            title: allergenPick[index + 1].title,
            value: false,
          };
        } else {
          allergenPick[index] = { title: item.title, value: !item.value };
          allergenPick[index - 1] = {
            title: allergenPick[index - 1].title,
            value: false,
          };
        }
        const newObj = {
          Status: status,
          "Tall Location": tall,
          "Remote Pick": remotePick,
          "Allergen Pick": allergenPick,
        };
        return newObj;
      });
    }
  };

  //Filter OnChange End

  //Single Preview BarCode Show Function
  const previewBarcode = (item) => {
    setPreviewBarCodeObj({
      description: item?.description,
      barcodeNum: item?.barcode,
    });
    setPreviewBarCode(true);
  };

  //Preview Bar Code Model Close
  const previewBarCodeClose = () => {
    setPreviewBarCodeObj({ description: "", barcodeNum: "" });
    setSelectedLocation([]);
    setSelectionIds([]);
    setPreviewBarCode(false);
    getlocationListing();
  };

  // Print BarCode
  const print = () => {
    var mywindow = window.open("", "PRINT", "");

    mywindow.document.write(
      "<html><head><title>" + document.title + "</title>"
    );
    mywindow.document.write("</head><body >");
    mywindow.document.write(
      document.getElementById("section-to-print").innerHTML
    );
    mywindow.document.write("</body></html>");

    // mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();

    return true;
  };

  const getlocationListing = () => {
    let status = filters.Status[0].value ? 1 : filters.Status[1].value ? 0 : "";
    let tall = filters["Tall Location"][0].value
      ? 1
      : filters["Tall Location"][1].value
      ? 0
      : "";
    let remotePick = filters["Remote Pick"][0].value
      ? 1
      : filters["Remote Pick"][1].value
      ? 0
      : "";
    let allergenPick = filters["Allergen Pick"][0].value
      ? 1
      : filters["Allergen Pick"][1].value
      ? 0
      : "";
    let payload = {
      remote_pick: remotePick,
      allergen_pick: allergenPick,
      tall_location: tall,
      status: status,
      search: name,
    };
    dispatch(getLocations(payload));
  };

  const onLocationSeach = () => {
    getlocationListing();
  };

  // UseEffect For Calling Listing On Name And Filter Change
  useEffect(() => {
    // eslint-disable-next-line no-self-compare
    if (name === "" || filters !== filters) {
      getlocationListing();
      setSelectionIds([]);
    }
  }, [dispatch, name, filters]);

  // UseEffect For Hiding Info Messages
  useEffect(() => {
    if (deleteAlert) {
      setTimeout(() => {
        setDeleteAlert(false);
      }, 2000);
    }
  }, [deleteAlert]);

  return (
    <div className="main-container pl-4">
      {/* To Show Barcode */}
      <CustomModal open={previewBarCode} width={window.innerWidth * 0.4}>
        <div>
          <div className="d-flex flex-row justify-content-between align-items-center">
            <div className="d-flex flex-row justify-content-between align-items-center text-center">
              <div className="pointer">
                <Visibility
                  className="mx-3 mb-1"
                  color="primary"
                  fontSize="small"
                />
              </div>
              Preview Barcode
            </div>
            <div className="pointer mx-3" onClick={previewBarCodeClose}>
              <ClearIcon color="secondary" fontSize="small" />
            </div>
          </div>

          {selectedLocation?.length > 0 ? (
            <div
              id="section-to-print"
              className="h-[400px] m-3 px-3 overflow-y-scroll">
              {selectedLocation?.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="flex flex-col mb-2 justify-content-between align-items-center rounded-lg border-2">
                    <p className="mt-2 px-2">{item.description}</p>
                    <Barcode height="50px" value={item.barcode} />
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              id="section-to-print"
              className="d-flex flex-col m-3 justify-content-between align-items-center rounded-lg border-2">
              <p className="mt-2 px-2">{previewBarCodeObj.description}</p>
              <Barcode height="50px" value={previewBarCodeObj.barcodeNum} />
            </div>
          )}

          <div className="mb-3">
            <div className="d-flex flex-row justify-content-between align-items-center mx-3 mt-4 mb-2">
              <Button
                component="span"
                className="capitalize mr-[10px]"
                variant="outlined"
                color="secondary"
                onClick={previewBarCodeClose}>
                Cancel
              </Button>
              <Button
                startIcon={<Visibility />}
                component="span"
                className="capitalize"
                color="primary"
                variant="contained"
                onClick={() => print()}>
                Print Barcode
              </Button>
            </div>
          </div>
        </div>
      </CustomModal>

      {/* BreadCrums Start */}
      <div className="d-flex flex-row justify-content-between align-items-center py-3">
        <div>
          <BreadCrumb
            routes={[
              { name: "Inventory", route: "/inventory/products", color: true },
              { name: "Locations" },
            ]}
          />
          <div className="text-[15px] font-bold ">Locations</div>
        </div>
        {facilityAdmin || companyAdmin ? (
          <Button
            startIcon={<Add />}
            className="capitalize text-[13px] ml-[10px]"
            onClick={() => navigate("/inventory/locations/add-location")}
            component="span"
            color="primary"
            variant="contained">
            Add New Location
          </Button>
        ) : null}
      </div>
      {/* BreadCrums End */}

      {/* Search Bar Start */}
      <div className="d-flex flex-row justify-between align-items-center mt-2 mb-2">
        <SearchBar
          disabled={false}
          onClear={() => setName("")}
          onSearch={() => onLocationSeach()}
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <div className="d-flex flex-row justify-between align-items-center">
          {/* Filters */}
          <ModalButton
            label={"Filter"}
            option1={filters.Status[0].value || filters.Status[1].value}
            option2={
              filters["Tall Location"][0].value ||
              filters["Tall Location"][1].value
            }
            option3={
              filters["Remote Pick"][0].value || filters["Remote Pick"][1].value
            }
            option4={
              filters["Allergen Pick"][0].value ||
              filters["Allergen Pick"][1].value
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
      {/* Search Bar End */}

      {/* Location Delete Alert */}
      {deleteAlert && (
        <AlertMessage
          severity="error"
          text="Location successfully deleted"
          textColor="red"
        />
      )}

      {loading ? (
        <Spinner />
      ) : (
        <LocationsTable
          locations={true}
          rows={locations ? locations : []}
          columns={columnToShow.length < 8 ? columnToShow : columns}
          tableColumnExtensions={tableColumnExtensions}
          dataProviders={dataProviders}
          selectionIds={selectionIds}
          setSelectionIds={setSelectionIds}
          setDeleteAlert={deleteAlert}
          isOpen={isOpen}
          setIsopen={setIsopen}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          previewBarCode={previewBarCode}
          setPreviewBarCode={setPreviewBarCode}
          onRowSelect={!facilityUser && onRowSelect}
        />
      )}
    </div>
  );
};
export default Locations;
