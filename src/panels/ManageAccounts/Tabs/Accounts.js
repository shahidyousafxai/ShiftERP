// Library Imports
import React, { useEffect, useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DescriptionIcon from "@mui/icons-material/Description";
import { styled } from "@mui/material/styles";

// Local Imports
import {
  SearchBar,
  ModalButton,
  OptionModal,
  Table,
  CustomModal,
  Button,
  Spinner,
} from "../../../shared";
import {
  columnData,
  tableColumnExtensions,
  editColumnData,
} from "../mockupData/mockupData";
import { ManageProvision, Status } from "../Components/utils";
import {
  getProvisionAccountsList,
  uploadSOW,
} from "../../../api/provisionAccountsApi";

const Input = styled("input")({
  display: "none",
});

const Accounts = () => {
  // Search Bar States
  const [name, setName] = useState("");

  // Filters States
  const [filters, setFilters] = useState({
    "License Type": [
      {
        title: "Basic License",
        value: false,
      },
      {
        title: "Enterprise License",
        value: false,
      },
    ],
    Status: [
      {
        title: "Active",
        value: false,
      },
      {
        title: "Paused",
        value: false,
      },
      {
        title: "Cancelled",
        value: false,
      },
      {
        title: "In Processing",
        value: false,
      },
    ],
  });

  // Table States
  const [selectionIds, setSelectionIds] = useState([]);
  const [columnToShow, setColumnToShow] = useState(columnData);
  const [previewSow, setPreviewSow] = useState(false);

  const [sowModalData, setSowModalData] = useState([]);
  const [sowModalLoading, setSowModalLoading] = useState(false);
  const [sowSuccessAlert, setSowSuccessAlert] = useState(false);
  const [statusSuccessAlert, setStatusSuccessAlert] = useState(false);
  const [statusSuccessMsg, setStatusSuccessMsg] = useState("");

  const [columns] = useState(columnData);
  const [, setProvisionListing] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ColumnSetting1] = useState(["status"]);
  const [ColumnSetting2] = useState(["manage"]);

  //***** API Call For Listing Start *****//

  useEffect(() => {
    if (name === "") {
      getProvisionAccList();
    }
    // eslint-disable-next-line
  }, [name, filters]);

  useEffect(() => {
    setTimeout(() => {
      setStatusSuccessAlert(false);
      setSowSuccessAlert(false);
    }, 2000);
  }, [sowSuccessAlert, statusSuccessAlert]);

  const camalize = (str) => {
    return str.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
      letter.toUpperCase()
    );
  };

  const creatPayload = () => {
    let status = [];
    // eslint-disable-next-line array-callback-return
    filters.Status.map((item, index) => {
      if (item.value) {
        return index === 0
          ? status.length === 0
            ? (status[0] = "active")
            : status.push("active")
          : index === 1
          ? status.length === 0
            ? (status[0] = "pause")
            : status.push("pause")
          : index === 2
          ? status.length === 0
            ? (status[0] = "cancel")
            : status.push("cancel")
          : index === 3
          ? status.length === 0
            ? (status[0] = "in-processing")
            : status.push("in-processing")
          : "";
      }
    });

    let payload = {
      search: name,
      status: status,
      subscription_ids: filters["License Type"][0].value
        ? [1]
        : filters["License Type"][1].value
        ? [2]
        : "",
    };
    return payload;
  };
  const getProvisionAccList = async () => {
    setLoading(true);
    // calling API
    let provisionListing = await getProvisionAccountsList(creatPayload());
    // Setting Response
    setProvisionListing(provisionListing?.data?.data);
    // Setting Row Data For Table
    setRowsData(provisionListing?.data?.data);
  };
  const setRowsData = (list) => {
    let array = [];
    // eslint-disable-next-line array-callback-return
    list.map((item, index) => {
      if (item) {
        let data = {
          id: index + 1,
          name: camalize(item?.company_name),
          phone: item?.phone,
          address: item?.address,
          contact_name: camalize(
            `${item?.billing_details?.fname} ${item?.billing_details?.lname}`
          ),
          contact_email: item?.billing_details?.email,
          contact_number: item?.billing_details?.contact_number,
          access_level: item?.Subscription_details[0]?.Subscription.name,
          last_billed: `$ ${item?.Subscription_details[0]?.total}`,
          status: item?.Subscription_details[0]?.status,
          // For API Call Purpose
          provisionUUID: item?.uuid,
          sow: item?.Sow,
          subDetailsId: item?.Subscription_details[0]?.uuid,
        };
        return array.length === 0 ? (array[0] = data) : array.push(data);
      }
    });
    setRows(array);
    setLoading(false);
  };

  //***** API Call For Listing Start *****//

  //***** API Call For Uploading PDF Start *****//

  // To Capture User Selected PDF Response
  const handlePDFChange = async (event, uuid) => {
    setSowModalLoading(true);
    let formData = new FormData();
    formData.append("provision_account_id", uuid);
    formData.append("sow", event.target.files[0]);

    await uploadSOW(formData).then((res) => {
      if (res.status === 200) {
        setSowSuccessAlert(true);
        setSowModalLoading(false);
        setPreviewSow(!previewSow);
        getProvisionAccList();
      } else {
        setSowModalLoading(false);
        setPreviewSow(!previewSow);
      }
    });
  };
  // To Run OnChange Handler Again To Select Same PDF
  const onInputClick = (event) => {
    event.target.value = "";
  };

  //***** API Call For Uploading PDF End *****//

  // on Search
  const onProvisionSearch = () => {
    getProvisionAccList();
  };

  // Filters OnChange
  const filterOnChange = (from, item, index) => {
    if (from === "clearAll") {
      setFilters(() => {
        let license = filters["License Type"].slice();
        let status = filters.Status.slice();

        license[0] = { title: license[0].title, value: false };
        license[1] = { title: license[1].title, value: false };

        status[0] = { title: status[0].title, value: false };
        status[1] = { title: status[1].title, value: false };
        status[2] = { title: status[2].title, value: false };
        status[3] = { title: status[3].title, value: false };

        const newObj = { "License Type": license, Status: status };
        return newObj;
      });
    } else if (
      item.title === "Basic License" ||
      item.title === "Enterprise License"
    ) {
      setFilters(() => {
        let license = filters["License Type"].slice();
        let status = filters.Status.slice();

        if (index === 0) {
          license[index] = { title: item.title, value: !item.value };
          license[index + 1] = {
            title: license[index + 1].title,
            value: false,
          };
        } else {
          license[index] = { title: item.title, value: !item.value };
          license[index - 1] = {
            title: license[index - 1].title,
            value: false,
          };
        }

        const newObj = { "License Type": license, Status: status };
        return newObj;
      });
    } else {
      setFilters(() => {
        let license = filters["License Type"].slice();
        let status = filters.Status.slice();

        if (index === 0) {
          status[index] = { title: item.title, value: !item.value };
          status[index + 1] = {
            title: status[index + 1].title,
            value: status[index + 1].value,
          };
          status[index + 2] = {
            title: status[index + 2].title,
            value: status[index + 2].value,
          };
          status[index + 3] = {
            title: status[index + 3].title,
            value: status[index + 3].value,
          };
        } else if (index === 1) {
          status[index] = { title: item.title, value: !item.value };
          status[index - 1] = {
            title: status[index - 1].title,
            value: status[index - 1].value,
          };
          status[index + 1] = {
            title: status[index + 1].title,
            value: status[index + 1].value,
          };
          status[index + 2] = {
            title: status[index + 2].title,
            value: status[index + 2].value,
          };
        } else if (index === 2) {
          status[index] = { title: item.title, value: !item.value };
          status[index - 1] = {
            title: status[index - 1].title,
            value: status[index - 1].value,
          };
          status[index - 2] = {
            title: status[index - 2].title,
            value: status[index - 2].value,
          };
          status[index + 1] = {
            title: status[index + 1].title,
            value: status[index + 1].value,
          };
        } else {
          status[index] = { title: item.title, value: !item.value };
          status[index - 1] = {
            title: status[index - 1].title,
            value: status[index - 1].value,
          };
          status[index - 2] = {
            title: status[index - 2].title,
            value: status[index - 2].value,
          };
          status[index - 3] = {
            title: status[index - 3].title,
            value: status[index - 3].value,
          };
        }

        const newObj = { "License Type": license, Status: status };
        return newObj;
      });
    }
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
      func: Status,
    },
    {
      columnName: ColumnSetting2,
      func: (restProps, index) =>
        ManageProvision(
          restProps,
          previewSow,
          // getProvisionAccList,
          setPreviewSow,
          setSowModalData,
          setStatusSuccessAlert,
          setStatusSuccessMsg
        ),
    },
  ];

  return (
    <div className="main-container overflow-y-hidden pl-5">
      {/* SOW Modal */}
      <CustomModal
        width={window.innerWidth * 0.38}
        open={previewSow}
        close={() => setPreviewSow(!previewSow)}>
        <div className="d-flex flex-row justify-content-between align-items-center">
          <div className="mx-3 mb-1 font-bold">SOW</div>
          <div
            className="pointer mx-3"
            onClick={() => setPreviewSow(!previewSow)}>
            <ClearIcon className="text-xl text-secondaryColor" />
          </div>
        </div>
        <div className="px-3  max-h-64 overflow-y-scroll">
          <table className="bg-white text-black table-fixed w-full shadow-none ">
            <thead>
              <tr className="border-b-2">
                <th className=" text-darkGray xl:text-[14px] font-medium text-[13px] xl:pl-[10px] pl-[10px]">
                  SOW Name
                </th>
                <th className=" text-darkGray xl:text-[14px] font-medium text-[13px] xl:pl-[55px] pl-[42px]">
                  ID
                </th>
                <th className=" text-darkGray xl:text-[14px] font-medium text-[12px] xl:pl-[45px] pl-[20px]">
                  Billing Date
                </th>
                <th className=" text-darkGray xl:text-[14px] font-medium text-[13px] xl:pl-[50px] pl-[20px]">
                  Document
                </th>
              </tr>
            </thead>
            <tbody>
              {sowModalData?.sow?.length === 0 ? (
                <>
                  <div
                    style={{ width: window.innerWidth * 0.35 }}
                    className="flex flex-col items-center mt-3">
                    <DescriptionIcon fontSize="large" color="secondary" />
                    <p className="mt-2 text-black text-[13px]">No SOW added.</p>
                  </div>
                </>
              ) : (
                <>
                  {sowModalData?.sow?.map((item, index) => {
                    return (
                      <tr
                        className={`rounded-lg ${
                          index % 2 !== 0 ? "bg-lightGray" : "bg-white"
                        }`}
                        key={index}>
                        <td className="py-2 xl:text-[14px] text-[12px] xl:pl-[20px] pl-[20px]">
                          {item?.name}
                        </td>
                        <td className="py-2 xl:text-[14px] text-[12px] xl:pl-[60px] pl-[45px]">
                          {index + 1}
                        </td>
                        <td className="py-2 2xl:text-[14px] xl:text-[13px] text-[11px] xl:pl-[45px] pl-[20px]">
                          {item?.billing_date}
                        </td>
                        <td className="py-2 xl:text-[14px] text-[12px] xl:pl-[70px] pl-[40px]">
                          <a
                            className="cursor-pointer"
                            href={item.url}
                            target="_blank"
                            rel="noreferrer">
                            <InsertDriveFileIcon
                              color="primary"
                              className="me-2 fs-5"
                            />
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </>
              )}
            </tbody>
          </table>
        </div>
        <div className="d-flex flex-row justify-end align-items-center mx-3 mb-3 gap-3">
          <Button
            size="medium"
            className="normal-case w-[90px]"
            component="span"
            variant="outlined"
            color="secondary"
            onClick={() => setPreviewSow(false)}>
            Cancel
          </Button>

          <label htmlFor="icon-button-file">
            <Input
              accept=".pdf"
              id="icon-button-file"
              type="file"
              onChange={(e) => handlePDFChange(e, sowModalData?.provisionUUID)}
              onClick={onInputClick}
              disabled={sowModalLoading}
            />
            <Button
              component="span"
              color="primary"
              variant="contained"
              fullWidth={true}
              className="normal-case"
              disabled={false}
              loading={sowModalLoading}>
              Upload SOW
            </Button>
          </label>
        </div>
      </CustomModal>

      {/* Search Bar with Buttons */}
      <div className="d-flex flex-row justify-between align-items-center mt-2 mb-2">
        <SearchBar
          onClear={() => setName("")}
          onSearch={() => onProvisionSearch()}
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <div className="d-flex flex-row justify-between align-items-center">
          {/* Filters */}
          <ModalButton
            option1={
              filters["License Type"][0].value ||
              filters["License Type"][1].value
            }
            option2={
              filters.Status[0].value ||
              filters.Status[1].value ||
              filters.Status[2].value
            }
            label={"Filter"}>
            <OptionModal
              options={filters}
              setOptions={setFilters}
              leftLabel="Filters"
              rightLabel="Clear All"
              onChange={filterOnChange}
            />
          </ModalButton>

          {/* Edit Columns */}
          <ModalButton
            option1={columnToShow.length < 11 ? true : false}
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

      {/* Provision Accounts Listing */}
      <div style={{ height: window.innerHeight * 0.9 }}>
        {/* Status Successfully Uploaded Dialogue */}
        {statusSuccessAlert && (
          <div
            className={` ${
              statusSuccessMsg.includes("Unable")
                ? "text-danger h-10 ml-[80%] py-2 text-center rounded-lg bg-[rgba(255,78,78, .1)]"
                : "text-success h-10 ml-[85%] py-2 text-center rounded-lg bg-[rgba(73, 204, 144, .1)]"
            }`}>
            <span className="text-[13px]">{statusSuccessMsg}</span>
          </div>
        )}

        {/* SOW Successfully Uploaded Dialogue */}
        {sowSuccessAlert && (
          <div className="bg-[rgba(73, 204, 144, .1)] text-success h-10 ml-[85%] py-2 text-center rounded-lg">
            <span className="text-[13px]">
              SOW has been uploaded successfully
            </span>
          </div>
        )}

        {loading ? (
          <Spinner />
        ) : (
          <Table
            customer={true}
            rows={rows.length > 0 ? rows : []}
            columns={columnToShow.length < 11 ? columnToShow : columns}
            tableColumnExtensions={tableColumnExtensions}
            dataProviders={dataProviders}
            pagination={false}
            selectionIds={selectionIds}
            setSelectionIds={setSelectionIds}
          />
        )}
      </div>
    </div>
  );
};

export default Accounts;
