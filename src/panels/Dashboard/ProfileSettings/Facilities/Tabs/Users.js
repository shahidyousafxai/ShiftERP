/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as Actions from "../../../../../redux/administration/actions";
import "../../../Administration/administration.module.css";

const Users = () => {
  const dispatch = useDispatch();
  // const [selectionIds, setSelectionIds] = useState([]);
  // const [isOpen, setIsopen] = useState(false);
  const [name] = useState("");
  const [roleId, setRoleId] = useState([]);
  const [status, setStatus] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [order, setOrder] = useState("");
  // const [selectedUserFacilities, setSelectedUserFacilities] = useState([]);

  // const handleClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const dataProviders = [
  //   {
  //     columnName: ColumnSetting1,
  //     func: UserName,
  //   },
  //   {
  //     columnName: ColumnSetting2,
  //     func: Status,
  //   },
  //   {
  //     columnName: ColumnSetting3,
  //     func: (restProps) => Manage(restProps, setDeleteAlert),
  //   },
  //   {
  //     columnName: ColumnSetting4,
  //     func: Facility,
  //   },
  //   {
  //     columnName: ColumnSetting5,
  //     func: UserRole,
  //   },
  // ];

  // const handleChange = (selectedOption) => {
  //   let array = [];
  //   allFacilities?.map((item) => {
  //     selectedOption.map((option) => {
  //       if (item.uuid == option.value) {
  //         array.push(item);
  //       }
  //     });
  //   });
  //   setSelectedFacilities(array);
  // };
  // const MyPopper = () => (
  //   <ClickAwayListener onClickAway={clickAwayHandler}>
  //     <Popper
  //       style={{
  //         background: "white",
  //         borderStyle: "solid",
  //         borderRadius: 4,
  //         borderWidth: 1,
  //         borderColor: secondaryColor,
  //       }}
  //       id={id}
  //       open={open}
  //       anchorEl={anchorEl}
  //       onClose={handleClose}
  //       anchorOrigin={{
  //         vertical: "bottom",
  //         horizontal: "left",
  //       }}>
  //       <div>
  //         <div className="my-3">
  //           <div className="mx-3 my-3">
  //             <div className="d-flex flex-row justify-between align-middle">
  //               <label>Role:</label>
  //               <div
  //                 onClick={() => setAnchorEl(!anchorEl)}
  //                 className="mb-2 pointer">
  //                 <Cancel color="warning" />
  //               </div>
  //             </div>
  //             {roleIds?.map((role, index) => {
  //               return (
  //                 <div key={index}>
  //                   <Checkbox
  //                     onChange={(e) => {
  //                       if (roleId.includes(role.value)) {
  //                         let ids = [];
  //                         roleId.map((id, index) => {
  //                           if (id != role.value) {
  //                             ids.push(id);
  //                           }
  //                         });
  //                         setRoleId(ids);
  //                       } else {
  //                         let ids = [...roleId, role.value];
  //                         setRoleId(ids);
  //                       }
  //                     }}
  //                     checked={roleId.includes(role.value) ? true : false}
  //                     size="small"
  //                   />
  //                   {role.label}
  //                 </div>
  //               );
  //             })}
  //           </div>
  //           <div className="mx-3">
  //             <label>Status:</label>
  //             <div>
  //               <Checkbox
  //                 onChange={(e) => {
  //                   if (status == "1") {
  //                     setStatus("");
  //                   } else {
  //                     setStatus("1");
  //                   }
  //                 }}
  //                 checked={status == "1" ? true : false}
  //                 size="small"
  //               />
  //               Active
  //             </div>
  //             <div>
  //               <Checkbox
  //                 onChange={(e) => {
  //                   if (status == "0") {
  //                     setStatus("");
  //                   } else {
  //                     setStatus("0");
  //                   }
  //                 }}
  //                 checked={status == "0" ? true : false}
  //                 size="small"
  //               />
  //               Inactive
  //             </div>
  //           </div>
  //           <div className="mx-3">
  //             <label>Order:</label>
  //             <div>
  //               <Checkbox
  //                 onChange={(e) => {
  //                   if (order == "asc") {
  //                     setOrder("");
  //                   } else {
  //                     setOrder("asc");
  //                   }
  //                 }}
  //                 checked={order == "asc" ? true : false}
  //                 size="small"
  //               />
  //               Ascending
  //             </div>
  //             <div>
  //               <Checkbox
  //                 onChange={(e) => {
  //                   if (order == "desc") {
  //                     setOrder("");
  //                   } else {
  //                     setOrder("desc");
  //                   }
  //                 }}
  //                 checked={order == "desc" ? true : false}
  //                 size="small"
  //               />
  //               Descending
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </Popper>
  //   </ClickAwayListener>
  // );

  // const getAllRolesPermissions = () => {
  //   getAllRoles().then((res) => {
  //     let roles = [];
  //     res.data.data.roles.map((role) => {
  //       roles.push({
  //         value: role.id,
  //         label: role.name,
  //         uuid: role.uuid,
  //       });
  //     });
  //     setRoleIds(roles);
  //   });
  // };

  // useEffect(() => {
  //   // dispatch(Actions.getFacilities());
  //   // dispatch(Actions.getUsers());
  //   // getAllRolesPermissions();
  // }, []);

  // These UseEffects Run While Searching
  useEffect(() => {
    if (name) {
      dispatch(Actions.getSearchedUser(name, roleId, status, order));
    } else {
      dispatch(Actions.getUsers());
    }
  }, [name]);
  useEffect(() => {
    dispatch(Actions.getSearchedUser(name, roleId, status, order));
  }, [status, order, roleId]);

  return (
    <div>Users</div>
    // <div className="main-container">
    //   <CustomModal open={isOpen} close={() => setIsopen(!isOpen)} width={window.innerWidth * 0.4}>
    //     <div>
    //       <div className="d-flex flex-row justify-content-between align-items-center">
    //         <div className="d-flex flex-row justify-content-between align-items-center text-center mx-3 fw-bold">
    //           Add {selectionIds.length} users to Facility
    //         </div>
    //         <div className="pointer mx-3" onClick={() => setIsopen(!isOpen)}>
    //           <ClearIcon color="secondary" fontSize="small" />
    //         </div>
    //       </div>
    //       <div className="my-3">
    //         <DropDown
    //           className="mx-3"
    //           multiple={true}
    //           onChange={handleChange}
    //           options={allFacilities.map((fc) => ({
    //             value: fc.uuid,
    //             label: fc.name,
    //           }))}
    //         />
    //         <div className="d-flex flex-row justify-content-end align-items-center mx-3 mt-4 mb-2">
    //           <Lbutton
    //             onClick={() => setIsopen(!isOpen)}
    //             style={{ marginRight: 10 }}
    //             component="span"
    //             variant="outlined"
    //             color='secondary'
    //           >
    //             Cancel
    //           </Lbutton>
    //           <Lbutton
    //             onClick={() => {
    //               let payload = {
    //                 user_ids: selectionIds,
    //                 facility_ids: selectedFacilities.map((fc) => fc.uuid),
    //                 type: 'multi'
    //               };
    //               dispatch(Actions.updateUserFacilities(payload))
    //               setIsopen(!isOpen)
    //               setSelectionIds([])
    //             }}
    //             component="span"
    //             color="primary"
    //             variant="contained"
    //           >
    //             Save
    //           </Lbutton>
    //         </div>
    //       </div>
    //     </div>
    //   </CustomModal>
    //   {
    //     anchorEl && <MyPopper />
    //   }
    //   <div className="d-flex flex-row justify-content-between align-items-center p-3">
    //     <div>
    //       <BreadCrumb routes={[{ name: "Administration", route: "/administration" }, { name: "Users", route: "/administration/users" }]} />
    //       <div>Users</div>
    //     </div>
    //     <Lbutton
    //       startIcon={<Add />}
    //       style={{ textTransform: "none", width: "160px" }}
    //       onClick={() => navigate("/administration/add-user", {
    //         state: { userId: users[users.length - 1].id }
    //       })}
    //       component="span"
    //       color="primary"
    //       variant="contained"
    //       disabled={loading}
    //     >
    //       Add New User
    //     </Lbutton>
    //   </div>
    //   <div className="d-flex flex-row justify-between align-items-center px-3 pb-3">
    //     <SearchBar onChange={(e) => setName(e.target.value)} value={name} />
    //     <div className="d-flex flex-row justify-between align-items-center">
    //       <Lbutton
    //         className="mx-3"
    //         startIcon={<FilterAltIcon />}
    //         component="span"
    //         variant="outlined"
    //         color={name || roleId.length || status || order ? "primary" : "secondary"}
    //         onClick={handleClick}
    //         style={{ textTransform: "none" }}
    //       >
    //         Filter
    //       </Lbutton>
    //       <Lbutton
    //         component="span"
    //         variant="outlined"
    //         color='secondary'
    //         style={{ textTransform: "none", width: "130px" }}
    //       >
    //         Edit Columns
    //       </Lbutton>
    //     </div>
    //   </div>
    //   {(name || roleId.length || status || order) && <div className="d-flex flex-row justify-end align-items-center px-3 pb-3">
    //     <Lbutton
    //       style={{ width: "130px" }}
    //       component="span"
    //       variant="outlined"
    //       color='primary'
    //       onClick={() => {
    //         setOrder("")
    //         setStatus("")
    //         setRoleId([])
    //         setName("")
    //         setAnchorEl(null)
    //         dispatch(Actions.getSearchedUser("", "", "", "", ""))
    //       }
    //       }
    //     >
    //       Reset Filter
    //     </Lbutton>
    //   </div>}
    //   {deleteAlert &&
    //     <div className="d-flex flex-row justify-end align-items-center" >
    //       <Alert className="mx-3 w-72 justify-end" severity="error" icon={true}>
    //         <div className="d-flex flex-row justify-between align-items-center">
    //           <Typography
    //             variant="h1"
    //             fontSize={13}
    //             fontWeight="medium"
    //             color={'red'}>
    //             User successfully deleted
    //           </Typography>
    //           <div onClick={() => setDeleteAlert(false)} className="ms-5 pointer">
    //             <Cancel color="warning" />
    //           </div>
    //         </div>
    //       </Alert>
    //     </div>
    //   }
    //   {
    //     loading ?
    //       <InsideSpinner />
    //       :
    //       <UsersTable
    //         rows={users?.length ? users : []}
    //         columns={columns}
    //         dataProviders={dataProviders}
    //         selectionIds={selectionIds}
    //         setSelectionIds={setSelectionIds}
    //         setDeleteAlert={setDeleteAlert}
    //         isOpen={isOpen}
    //         setIsopen={setIsopen}
    //         selectedUserFacilities={selectedUserFacilities}
    //         setSelectedUserFacilities={setSelectedUserFacilities}
    //       />
    //   }
    // </div>
  );
};

export default Users;
