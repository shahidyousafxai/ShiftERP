/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
// Library Imports
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import ClearIcon from "@mui/icons-material/Clear";
import { Add, Error } from "@mui/icons-material";
import Delete from "@mui/icons-material/Delete";
// Local Imports
import {
  Button as Lbutton,
  TextField,
  CustomModal,
  Typography,
  Alert,
  Select as DropDown,
  Button,
} from "../../../shared";
import {
  deleteFacility,
  deteleMultipleUsers,
  getFacilityUsers,
  addUsersInFacilities,
  userDetails,
  facilityDetails,
} from "../../../api/administratorApi.js";
import * as Selectors from "../../../redux/administration/selectors";
import * as Actions from "../../../redux/administration/actions";
import AssetsImages from "../../../assets/images";
import {
  Info,
  Name,
  PopoverAdd,
  PopoverDelete,
  PopoverEdit,
  SettingsPopover,
} from "../../../helpers/TableUtilities";
import { SimpleDeleteModal } from "../../../helpers/SimpleDeleteModal";
import { AssignDeleteModal } from "../../../helpers/AssignDeleteModal";

export const ErrorModal = (props) => {
  const { error, setError, errorMsg, setErrorMsg } = props;

  return (
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
              <Error className="mx-3" color="danger" fontSize="small" />
            </div>
            <span>Error</span>
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
              }}>
              {"OK"}
            </Button>
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export const UserName = (restProps) => {
  let navigate = useNavigate();
  const user = restProps.row;
  const [nameError, setNameError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const getDetailsAndNavigate = async () => {
    userDetails({ uuid: restProps.row?.uuid })
      .then((res) => {
        // eslint-disable-next-line no-template-curly-in-string
        navigate("/administration/edit-user/${id}", {
          state: { user: res.data.data },
        });
      })
      .catch((err) => {
        setNameError(true);
        if (err?.response) {
          setErrorMsg(err?.response?.data?.message);
        } else {
          setErrorMsg("Oops! Something went wrong.");
        }
      });
  };

  const pic = user?.profile_pic
    ? user?.profile_pic?.url
    : AssetsImages.profileImg;

  return (
    <>
      {Name(restProps.row.username, pic, getDetailsAndNavigate)}
      <ErrorModal
        error={nameError}
        setError={setNameError}
        errorMsg={errorMsg}
        setErrorMsg={setErrorMsg}
      />
    </>
  );
};

export const CreatedAt = (restProps) => {
  const date = new Date(restProps.row.date_of_creation).toLocaleDateString();

  return <div className="d-flex flex-row align-items-center">{date}</div>;
};

export const dateOfCreation = (restProps) => {
  const newDate = new Date(restProps.row.created_at).toLocaleDateString();
  return <div className="d-flex flex-row align-items-center">{newDate}</div>;
};

export const Email = (restProps) => {
  const email = `${restProps.row.email}`;

  return (
    <div className="d-flex flex-row align-items-center">
      <a
        href={`mailto:${email}`}
        target="_blank"
        rel="noreferrer"
        className={`lowercase truncate text-[13px] text-primaryColor`}>
        {email}
      </a>
    </div>
  );
};

export const FacilityName = (restProps) => {
  const id = restProps.row.uuid;
  const text = restProps.row.name;
  const facility = restProps.row;
  const pic = restProps.row.profile_pic
    ? restProps.row.profile_pic
    : AssetsImages.profileImg;

  let navigate = useNavigate();
  const [nameError, setNameError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const getDetailsAndNavigate = () => {
    facilityDetails({ uuid: restProps.row?.uuid })
      .then((res) => {
        console.log("response", res);
        navigate(`/administration/edit-facility/${id}`, {
          state: { facility: res?.data?.data?.facility, id: facility?.id },
        });
      })
      .catch((err) => {
        setNameError(true);
        if (err?.response) {
          setErrorMsg(err?.response?.data?.message);
        } else {
          setErrorMsg("Oops! Something went wrong.");
        }
      });
  };

  return (
    <>
      {/* Please pass an empty string if no any of the argument is missing */}
      {Name(text, "", getDetailsAndNavigate)}
      <ErrorModal
        error={nameError}
        setError={setNameError}
        errorMsg={errorMsg}
        setErrorMsg={setErrorMsg}
      />
    </>
  );
};

export const UserRole = (restProps) => {
  const text = restProps.row.role;
  return (
    <div className="text-truncate text-[13px]">
      {text?.length ? text : "No Role"}
    </div>
  );
};

export const PrimaryContact = (restProps) => {
  const text = restProps.row?.primary_contact?.name;
  return (
    <div className={`text-truncate text-[13px] text-primaryColor`}>{text}</div>
  );
};

export const Manage = (
  restProps,
  setSelectionIds,
  setDeleteAlert,
  setAddUserAlert,
  setErrorAlert,
  setErrorAlertMsg
) => {
  const user = restProps.row;

  const [isOpen, setIsopen] = useState(false);
  const [childModalOpen, setChildModalOpen] = useState(false);
  const [data, setData] = useState(restProps.row.facilities);
  const [selectedFacilities, setSelectedFacilities] = useState([]);

  let navigate = useNavigate();
  const [isDelete, setIsDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = () => {
    setDeleteLoading(true);
    deteleMultipleUsers([restProps.row.uuid])
      .then((res) => {
        setDeleteLoading(false);
        setSelectionIds([]);
        setDeleteAlert(true);
      })
      .catch((error) => {
        setDeleteLoading(false);
        if (error?.response) {
          setIsDelete(false);
          setErrorAlert(true);
          setErrorAlertMsg(error?.response?.data?.message);
        }
      });
  };

  return (
    <>
      <FacilityModal
        setAddUserAlert={setAddUserAlert}
        restProps={restProps}
        setIsopen={setIsopen}
        selectedFacilities={selectedFacilities}
        isOpen={isOpen}
        data={data}
        setChildModalOpen={setChildModalOpen}
        childModalOpen={childModalOpen}
        setData={setData}
        setSelectedFacilities={setSelectedFacilities}
      />

      <SimpleDeleteModal
        states={{
          open: isDelete,
          setOpen: setIsDelete,
          headTitle: "Delete User",
          deleteName: restProps.row.username,
          loading: deleteLoading,
          deleteMethod: () => handleDelete(),
        }}
      />

      <SettingsPopover id={restProps.row.id}>
        <PopoverAdd
          onClick={() => setIsopen(!isOpen)}
          text="Add to Facilities"
        />
        <PopoverEdit
          onClick={() =>
            navigate("/administration/edit-user/${id}", {
              state: { user: user },
            })
          }
        />
        <PopoverDelete onClick={() => setIsDelete(!isDelete)} text="Delete" />
      </SettingsPopover>
    </>
  );
};
export const AdminManageFacility = (
  restProps,
  setSelectionIds,
  setDeleteAlert,
  setAddUserAlert
) => {
  const id = restProps.row.uuid;
  const facility = restProps.row;

  const [isOpen, setIsopen] = useState(false);
  const [childModalOpen, setChildModalOpen] = useState(false);
  const [data, setData] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [facilityName, setFacilityName] = useState();
  const [facilityNameErr, setFacilityNameErr] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showError, setShowError] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [errorModalMsg, setErrorModalMsg] = useState("");

  const dispatch = useDispatch();

  let navigate = useNavigate();
  const [isDelete, setIsDelete] = useState(false);

  const handleDelete = () => {
    setDeleteLoading(true);
    if (restProps.row.name === facilityName) {
      deleteFacility(restProps.row.uuid)
        .then((res) => {
          dispatch(Actions.getFacilities("", "", ""));
          setSelectionIds([]);
          setDeleteLoading(false);
          setDeleteAlert(true);
        })
        .catch((err) => {
          setDeleteLoading(false);
          setShowError(err?.response?.data?.message);
        });
    } else {
      setFacilityNameErr(true);
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      getFacilityUsers(id)
        .then((res) => {
          setData(res.data.data.users);
        })
        .catch((err) => {
          setIsopen(false);
          if (err?.response) {
            setErrorModal(true);
            setErrorModalMsg(err?.response?.data?.message);
          } else {
            setErrorModal(true);
            setErrorModalMsg("Oops! Something went wrong.");
          }
        });
    }
  }, [isOpen]);

  return (
    <>
      {/* Add Users TO Facility Modal */}
      <UsersModal
        restProps={restProps}
        setIsopen={setIsopen}
        selectedUsers={selectedUsers}
        isOpen={isOpen}
        data={data}
        setChildModalOpen={setChildModalOpen}
        childModalOpen={childModalOpen}
        setData={setData}
        setSelectedUsers={setSelectedUsers}
        setAddUserAlert={setAddUserAlert}
      />
      {/* Delete User Modal */}
      <AssignDeleteModal
        open={isDelete}
        setOpen={setIsDelete}
        headTitle="Delete Facility"
        warningMsg="This action is irreversible. Are you sure you want to delete this facility?"
        confirmationPrompt="Before you can delete facility, please enter the name of facility below:"
        onClose={() => {
          setIsDelete(false);
          setShowError("");
          setFacilityName("");
        }}
        onDelete={() => handleDelete()}
        loading={deleteLoading}
        errorMsg={showError}
      >
        <div className="form-row mx-4">
          <TextField
            label="Facility Name"
            type={"text"}
            fullWidth
            helperText={facilityNameErr ? "Facility Name not matched" : ""}
            error={facilityNameErr ? true : false}
            value={facilityName}
            name="facilityName"
            onFocus={() => setFacilityNameErr(false)}
            onChange={(e) => {
              setFacilityName(e.target.value);
            }}
          />
        </div>
      </AssignDeleteModal>

      <SettingsPopover id={restProps.row.id}>
        <PopoverAdd onClick={() => setIsopen(!isOpen)} text="Add Users" />
        <PopoverEdit
          onClick={() =>
            navigate(`/administration/edit-facility/${id}`, {
              state: { facility: facility, user: data },
            })
          }
        />
        <PopoverDelete onClick={() => setIsDelete(!isDelete)} text="Delete" />
      </SettingsPopover>

      <ErrorModal
        error={errorModal}
        setError={setErrorModal}
        errorMsg={errorModalMsg}
        setErrorMsg={setErrorModalMsg}
      />
    </>
  );
};

export const ManageFacilities = (restProps) => {
  const facility = restProps.row;
  let navigate = useNavigate();

  return (
    <div className="flex justify-between">
      <SettingsPopover id={facility?.id}>
        <PopoverEdit
          onClick={() =>
            navigate("/administration/edit-facility/${id}", {
              state: { facility: facility },
            })
          }
        />
      </SettingsPopover>
    </div>
  );
};
export const AddEditManageFacilities = (restProps, onDelete) => {
  const id = restProps.row.uuid;

  return (
    <SettingsPopover id={restProps.row.id}>
      <PopoverDelete
        onClick={() => onDelete(restProps.row.uuid)}
        text="Remove"
      />
    </SettingsPopover>
  );
};

export const Facility = (restProps, setAddUserAlert) => {
  const [isOpen, setIsopen] = useState(false);
  const [childModalOpen, setChildModalOpen] = useState(false);
  const [data, setData] = useState(restProps.row.facilities);
  const [selectedFacilities, setSelectedFacilities] = useState([]);

  return (
    <>
      <FacilityModal
        setAddUserAlert={setAddUserAlert}
        restProps={restProps}
        setIsopen={setIsopen}
        selectedFacilities={selectedFacilities}
        isOpen={isOpen}
        data={data}
        setChildModalOpen={setChildModalOpen}
        childModalOpen={childModalOpen}
        setData={setData}
        setSelectedFacilities={setSelectedFacilities}
      />
      <Info
        count={
          restProps?.row?.facilities ? restProps?.row?.facilities?.length : 0
        }
        onClick={() => setIsopen(!isOpen)}
      />
    </>
  );
};

// Locally Used Functions

const UsersModal = ({
  restProps,
  setAddUserAlert,
  setIsopen,
  selectedUsers,
  isOpen,
  data,
  setChildModalOpen,
  childModalOpen,
  setData,
  setSelectedUsers,
}) => {
  const users = Selectors.GetUsers();
  const [addUserLoading, setAddUserLoading] = useState(false);

  const handleChange = (selectedOption) => {
    let array = [];
    users?.map((item) => {
      selectedOption.map((option) => {
        if (item.uuid === option.value) {
          array.push(item);
        }
      });
    });
    setSelectedUsers(array);
  };
  const handleClose = () => {
    setChildModalOpen(false);
  };

  const handleDelete = (item, index) => {
    let arr = data.map((el) => el);
    arr.splice(index, 1);
    setData(arr);
    setSelectedUsers(arr);
  };

  const handleSave = () => {
    setAddUserLoading(true);
    let payload = {
      user_ids: data.map((user) => user.uuid),
      facility_ids: [restProps.row.uuid],
      type: "single",
    };
    addUsersInFacilities(payload).then((res) => {
      setAddUserAlert(true);
      setAddUserLoading(false);
      setIsopen(false);
    });
  };

  const handleUsersChange = () => {
    if (data) {
      let newArray = selectedUsers.filter(
        (array22) => !data.some((array11) => array11.uuid === array22.uuid)
      );
      let array = [...data, ...newArray];
      setData(array);
    } else {
      setData(selectedUsers);
    }
  };

  const getFacilities = () => {
    setData(restProps.row.facilities);
  };

  return (
    <CustomModal
      open={isOpen}
      close={() => {
        setIsopen(!isOpen);
        getFacilities();
      }}
      width={window.innerWidth * 0.4}>
      {!childModalOpen ? (
        <div>
          <div className="d-flex flex-row justify-content-between align-items-center mx-3">
            <div className="d-flex flex-row justify-content-between align-items-center fs-5">
              <div className="bg-primary text-light rounded-circle me-2 w-[20px] h-[20px] text-center text-[15px]">
                i
              </div>
              Facility Name: {restProps.row.name}
            </div>
            <div className="pointer" onClick={() => setIsopen(!isOpen)}>
              <ClearIcon color="secondary" fontSize="small" />
            </div>
          </div>
          <div className="m-3">
            <Typography
              variant="body1"
              className="text-[12px] mb-[1px] mt-[3px] ml-[3px] font-normal text-[#66666]">
              User Name
            </Typography>
            <div className="h-[1px] w-[100%] bg-lightGray" />
            {data?.length > 0 &&
              data.map((user, index) => {
                const odd = !!(index % 2);
                return (
                  <div
                    key={index}
                    className={`flex justify-between items-center pb-[2px] h-[44px] rounded-[6px] px-3 ${
                      odd ? "bg-lightGray" : "bg-white"
                    }`}>
                    <Typography
                      variant="body1"
                      fontSize={13}
                      color="primary"
                      fontWeight="normal">
                      {user?.username}
                    </Typography>
                    <div className="pointer">
                      <Delete
                        color="secondary"
                        fontSize="small"
                        onClick={() => handleDelete(user, index)}
                      />
                    </div>
                  </div>
                );
              })}
            <Lbutton
              className="p-2 mb-3 mt-3 w-full"
              startIcon={<Add />}
              onClick={() => setChildModalOpen(!childModalOpen)}
              component="span"
              color="primary"
              variant="outlined"
              disabled={addUserLoading}>
              Add User
            </Lbutton>
            <div className="d-flex flex-row justify-content-end align-items-center">
              <Lbutton
                className="capitalize mr-2.5"
                component="span"
                variant="outlined"
                color="secondary"
                onClick={() => {
                  getFacilities();
                  setIsopen(false);
                }}
                loading={addUserLoading}
                disabled={addUserLoading}>
                Cancel
              </Lbutton>
              <Lbutton
                component="span"
                className="capitalize"
                color="primary"
                variant="contained"
                loading={addUserLoading}
                disabled={addUserLoading}
                onClick={() => handleSave()}>
                Save
              </Lbutton>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="d-flex flex-row justify-content-between align-items-center">
            <div className="d-flex flex-row justify-content-between align-items-center text-center mx-3 fw-bold">
              Add users to Facility
            </div>
            <div
              className="pointer mx-3"
              onClick={() => setChildModalOpen(!childModalOpen)}>
              <ClearIcon color="secondary" fontSize="small" />
            </div>
          </div>
          <div className="my-3">
            <DropDown
              className="mx-3"
              multiple={true}
              // value={selectedUsers}
              onChange={handleChange}
              options={users.map((user) => ({
                value: user.uuid,
                label: `${user.fname} ${user.lname}`,
              }))}
            />
            <div className="d-flex flex-row justify-content-end align-items-center mx-3 mt-4 mb-2">
              <Lbutton
                className="capitalize mr-[10px]"
                component="span"
                variant="outlined"
                color="secondary"
                onClick={handleClose}>
                Cancel
              </Lbutton>
              <Lbutton
                component="span"
                className="capitalize"
                color="primary"
                variant="contained"
                onClick={() => {
                  handleUsersChange();
                  handleClose();
                }}>
                Save
              </Lbutton>
            </div>
          </div>
        </div>
      )}
    </CustomModal>
  );
};
const FacilityModal = ({
  restProps,
  setAddUserAlert,
  setIsopen,
  selectedFacilities,
  isOpen,
  data,
  setChildModalOpen,
  childModalOpen,
  setData,
  setSelectedFacilities,
}) => {
  const dispatch = useDispatch();
  const allFacilities = Selectors.GetFacilties();

  const handleChange = (selectedOption) => {
    let array = [];
    allFacilities?.map((item) => {
      selectedOption.map((option) => {
        if (item.uuid === option.value) {
          array.push(item);
        }
      });
    });
    setSelectedFacilities(array);
  };
  const handleClose = () => {
    setChildModalOpen(false);
  };

  const handleDelete = (item, index) => {
    let arr = data.map((el) => el);
    arr.splice(index, 1);
    setData(arr);
    setSelectedFacilities(arr);
  };

  const handleSave = () => {
    let payload = {
      user_ids: [restProps.row.uuid],
      facility_ids: data.map((fc) => fc.uuid),
      type: "single",
    };
    dispatch(Actions.updateUserFacilities(payload));
    setAddUserAlert(true);
  };

  const handleFacilityChange = (payload) => {
    let newArray = selectedFacilities.filter(
      (array22) => !data.some((array11) => array11.uuid === array22.uuid)
    );
    let array = [...data, ...newArray];
    setData(array);
  };

  const getFacilities = () => {
    setData(restProps.row.facilities);
  };

  return (
    <CustomModal
      open={isOpen}
      close={() => {
        setIsopen(!isOpen);
        getFacilities();
      }}
      width={window.innerWidth * 0.4}>
      {!childModalOpen ? (
        <div>
          <div className="d-flex flex-row justify-content-between align-items-center mx-3">
            <div className="d-flex flex-row justify-content-between align-items-center fs-5">
              <div className="bg-primary text-light rounded-circle me-2 w-5 h-5 text-center text-[15px]">
                i
              </div>
              Facilities: {restProps.row.fname}
            </div>
            <div className="pointer" onClick={() => setIsopen(!isOpen)}>
              <ClearIcon color="secondary" fontSize="small" />
            </div>
          </div>
          <div className="m-3">
            <Typography
              variant="body1"
              fontSize={12}
              marginBottom={1}
              marginTop={3}
              marginLeft={3}
              color="textSecondary"
              fontWeight="normal">
              Facility Name
            </Typography>
            <div className="h-px w-full bg-lightGray" />

            <div className="h-auto max-h-96 overflow-y-auto">
              {data?.length > 0 &&
                data.map((item, index) => {
                  const odd = !!(index % 2);
                  return (
                    <div
                      key={index}
                      className={`flex justify-between items-center pb-[2px] h-[44px] rounded-[6px] px-3 ${
                        odd ? "bg-lightGray" : "bg-white"
                      }`}>
                      <Typography
                        variant="body1"
                        fontSize={13}
                        color="primary"
                        fontWeight="normal">
                        {item.name}
                      </Typography>
                      <div className="pointer">
                        <Delete
                          color="secondary"
                          fontSize="small"
                          onClick={() => handleDelete(item, index)}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>

            <Lbutton
              className="p-2 mb-3 mt-3 capitalize w-[100%]"
              startIcon={<Add />}
              onClick={() => setChildModalOpen(!childModalOpen)}
              component="span"
              color="primary"
              variant="outlined">
              Add Facility
            </Lbutton>
            <div className="d-flex flex-row justify-content-end align-items-center">
              <Lbutton
                className="capitalize mr-[10px]"
                component="span"
                variant="outlined"
                color="secondary"
                onClick={() => {
                  getFacilities();
                  setIsopen(false);
                }}>
                Cancel
              </Lbutton>
              <Lbutton
                className="capitalize"
                component="span"
                color="primary"
                variant="contained"
                onClick={() => handleSave()}>
                Save
              </Lbutton>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="d-flex flex-row justify-content-between align-items-center">
            <div className="d-flex flex-row justify-content-between align-items-center text-center mx-3 fw-bold">
              Add facilites to user
            </div>
            <div
              className="pointer mx-3"
              onClick={() => setChildModalOpen(!childModalOpen)}>
              <ClearIcon color="secondary" fontSize="small" />
            </div>
          </div>
          <div className="my-3">
            <DropDown
              className="mx-3"
              multiple={true}
              // value={selectedFacilities}
              onChange={handleChange}
              options={allFacilities.map((fc) => ({
                value: fc.uuid,
                label: fc.name,
              }))}
            />
            <div className="d-flex flex-row justify-content-end align-items-center mx-3 mt-4 mb-2">
              <Lbutton
                className="capitalize mr-[10px]"
                component="span"
                variant="outlined"
                color="secondary"
                onClick={handleClose}>
                Cancel
              </Lbutton>
              <Lbutton
                component="span"
                className="capitalize"
                color="primary"
                variant="contained"
                onClick={() => {
                  handleFacilityChange(selectedFacilities);
                  handleClose();
                }}>
                Save
              </Lbutton>
            </div>
          </div>
        </div>
      )}
    </CustomModal>
  );
};
