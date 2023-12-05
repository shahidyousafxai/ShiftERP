/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
// Library Imports
import React, { useEffect, useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { Add } from "@mui/icons-material";
// Local Imports
import {
  SearchBar,
  Button,
  Table as FaciltiesTable,
  CustomModal,
  Select as DropDown,
} from "../../../../shared";
import {
  PrimaryContact,
  AddEditManageFacilities,
  FacilityName,
  dateOfCreation,
} from "../utils";
import {
  facilityColumnDataTab as facilityColumnData,
  tableColumnExtensionsFacilityTab as tableColumnExtensions,
} from "../mockUpData";
import "../administration.module.css";

const Facilities = ({
  userFacilities,
  selectedFacilities,
  setSelectedFacilities,
  setSelectedFacilitiesUUID,
  fromEdit,
}) => {
  const [columns] = useState(facilityColumnData);
  const [rows, setRows] = useState(selectedFacilities);
  const [facilites, setFacilities] = useState(userFacilities);
  const [searchText, setSearchText] = useState("");
  const [searchedFacilities, setSearchedFacilities] = useState([]);
  let addedFacilities = [];

  const [ColumnSetting1] = useState(["created_at"]);
  const [ColumnSetting2] = useState(["primary_contact"]);
  const [ColumnSetting3] = useState(["manage"]);
  const [ColumnSetting4] = useState(["name"]);

  const [selectionIds, setSelectionIds] = useState([]);
  const [isOpen, setIsopen] = useState(false);

  // If User Already Has Facilities. For Removing Those Facilities From Listing
  useEffect(() => {
    removeFacilityFromList();
  }, []);
  const removeFacilityFromList = () => {
    let array = selectedFacilities;
    let remainingArr = [];

    if (array?.length > 0) {
      // Removing Selected Facilities From Facilities Dropdown
      remainingArr = userFacilities.filter(
        ({ uuid: id1 }) => !array.some(({ uuid: id2 }) => id2 === id1)
      );
      // Setting States
      setFacilities(remainingArr);
    }
  };

  const dataProviders = [
    {
      columnName: ColumnSetting1,
      func: dateOfCreation,
    },
    {
      columnName: ColumnSetting2,
      func: PrimaryContact,
    },
    {
      columnName: ColumnSetting3,
      func: (restProps) => AddEditManageFacilities(restProps, onDelete),
    },
    {
      columnName: ColumnSetting4,
      func: FacilityName,
    },
  ];

  // onChange From SearchBar
  const onSearchChange = (event) => {
    setSearchText(event.target.value);
    if (!event.target.value) {
      setSearchedFacilities([]);
    }
  };
  // onSearch Method
  const onSearch = () => {
    let tempArrayFacilities = [];
    tempArrayFacilities = rows.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setSearchedFacilities([...tempArrayFacilities]);
  };
  // On Select Facilities From DropDown
  const handleChange = (selectedOption) => {
    addedFacilities = selectedOption;
  };
  // onSave Facilities After Selection
  const onSave = () => {
    let array = selectedFacilities;
    let currSelectedFacilities = [];
    let remainingArr = [];
    let UUID = [];

    // Assigning Selected Failities to Array By Making Them Unique
    if (addedFacilities?.length > 0) {
      userFacilities?.map((item) => {
        addedFacilities?.map((option) => {
          if (item.uuid === option.value) {
            item.primaryName = item?.primary_contact?.full_name;
            currSelectedFacilities.push(item);
          }
        });
      });

      array = [...array, ...currSelectedFacilities];
      array = [...new Set(array)];
      setSelectedFacilities(array);
      array.map((item) => {
        UUID.push(item.uuid);
      });
      setSelectedFacilitiesUUID(UUID);
    }

    // Setting States Before Saving
    if (array?.length > 0) {
      // Setting States
      setRows(
        [...array].map((item, index) => {
          let obj = {
            id: index + 1,
            uuid: item?.uuid,
            name: item?.name,
            created_at: item?.created_at,
            address: item?.address,
            city: item?.city,
            state: item?.state,
            zipCode: item?.zipCode,
            primaryContact: item?.primaryContact,
            officePhone: item?.officePhone,
          };
          return obj;
        })
      );

      setIsopen(false);
      // Removing Selected Facilities From Facilities Dropdown
      remainingArr = userFacilities.filter(
        ({ uuid: id1 }) => !array.some(({ uuid: id2 }) => id2 === id1)
      );
      // Setting States
      setFacilities(remainingArr);
    }
  };
  // onRemove Facility From Listing
  const onDelete = (id) => {
    let array = selectedFacilities;
    let UUID = [];

    // Setting States Before Saving
    if (array?.length > 0) {
      // Findind Selected Facility To Remove from UUID
      let found = array.findIndex((el) => el.uuid === id);
      array.splice(found, 1);
      // Removing Selected Facilities From Facilities Dropdown
      removeFacilityFromList();
      // Setting States
      setRows(
        [...array].map((item, index) => {
          let obj = {
            id: index + 1,
            uuid: item?.uuid,
            name: item?.name,
            created_at: item?.created_at,
            address: item?.address,
            city: item?.city,
            state: item?.state,
            zipCode: item?.zipCode,
            primaryContact: item?.primaryContact,
            officePhone: item?.primaryContact,
          };
          return obj;
        })
      );
      setSelectedFacilities(array);
      array.map((item) => {
        UUID.push(item.uuid);
      });
      setSelectedFacilitiesUUID(UUID);
    }
  };

  return (
    <div className="mx-[20px] my-[20px] border rounded bg-white">
      <CustomModal
        open={isOpen}
        close={() => {
          setIsopen(false);
        }}
        width={window.innerWidth * 0.4}>
        <div>
          <div className="d-flex flex-row justify-content-between align-items-center">
            <div className="d-flex flex-row justify-content-between align-items-center text-center mx-3 fw-bold">
              Add facilites to user
            </div>
            <div className="pointer mx-3">
              <ClearIcon
                color="secondary"
                fontSize="small"
                onClick={() => setIsopen(false)}
              />
            </div>
          </div>
          <div className="my-3">
            <DropDown
              className="mx-3"
              multiple={true}
              // value={selectedFacilities}
              onChange={handleChange}
              options={facilites?.map((fc) => ({
                value: fc.uuid,
                label: fc.name,
              }))}
            />
            <div className="d-flex flex-row justify-content-end align-items-center mx-3 mt-4 mb-2">
              <Button
                className="capitalize mr-[10px]"
                component="span"
                variant="outlined"
                color="secondary"
                onClick={() => setIsopen(false)}>
                Cancel
              </Button>
              <Button
                component="span"
                className="capitalize"
                color="primary"
                variant="contained"
                onClick={() => onSave()}>
                Save
              </Button>
            </div>
          </div>
        </div>
      </CustomModal>
      <h6 className="px-3 pt-3 pb-1">Facilities</h6>
      <div className="d-flex flex-row justify-between align-items-center px-3 pb-3">
        <SearchBar
          onSearch={onSearch}
          onClear={() => {
            setSearchText("");
            setSearchedFacilities([]);
          }}
          onChange={onSearchChange}
          value={searchText}
        />
        <div className="d-flex flex-row justify-between align-items-center">
          <Button
            startIcon={<Add />}
            className="mx-3 capitalize w-[150px]"
            component="span"
            color="primary"
            variant="outlined"
            onClick={() => setIsopen(!isOpen)}>
            Add Facilities
          </Button>
        </div>
      </div>

      <div className="px-3 pb-3">
        <FaciltiesTable
          rows={searchedFacilities.length > 0 ? searchedFacilities : rows}
          columns={columns}
          tableColumnExtensions={tableColumnExtensions}
          dataProviders={dataProviders}
          isOpen={isOpen}
          setIsopen={setIsopen}
          selectionIds={selectionIds}
          setSelectionIds={setSelectionIds}
          facilities={true}
          pagination={true}
          multiSelection={true}
        />
      </div>
    </div>
  );
};

export default Facilities;
