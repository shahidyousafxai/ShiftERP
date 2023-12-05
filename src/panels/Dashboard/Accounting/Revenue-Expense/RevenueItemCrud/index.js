// Library Imports
import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import AddIcon from "@mui/icons-material/Add";
import { IconButton, Typography } from "@mui/material";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditIcon from "@mui/icons-material/Edit";
// Local Imports
import {
  addNewRevenueItem,
  deleteRevenueItem,
  getRevenueItemList,
  updateRevenueItem,
} from "../../../../../api/revenueItemApi";

export default function RevenueItemCrud({
  revenueItem,
  setRevenueItem,
  showAddNewItem,
  setShowAddNewItem,
  showAddNewItemInput,
  setShowAddNewItemInput,
  hoveredItem,
  setHoveredItem,
  editItem,
  setEditItem,
  handleChange,
  value,
  itemOnChange,
  getItemsRowValues,
  item,
  isEmpty,
  setRevenueItemArray,
  itemsList,
  setItemsList,
  revenueExpenseData,
}) {
  // console.log("revenueExpenseData", revenueExpenseData);
  // console.log("itemsList", itemsList);
  const [inputChange, setInputChange] = useState("");
  const [inputEditChange, setInputEditChange] = useState("");
  const iconContainerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [deleteIconChange, setDeleteIconChange] = useState("");

  const handleRevenueItemChange = (event) => {
    setRevenueItem(event.target.value);
    setShowAddNewItem(true);
    setShowAddNewItemInput(false);
    setHoveredItem("");
    setEditItem("");
  };

  const handleInput = (event) => {
    setShowAddNewItem(false);
    setShowAddNewItemInput(true);
    event.stopPropagation();
  };

  const handleInputChange = (event) => {
    setInputChange(event.target.value);
  };

  const handleCrossItem = () => {
    setShowAddNewItem(true);
    setShowAddNewItemInput(false);
    setInputChange("");
  };

  //Function For Edit Change
  const handleEditChange = (event) => {
    if (handleChange) {
      setInputEditChange(event.target.value);
    } else {
      setInputEditChange(event.target.value);
    }
  };

  //Function For Edit Item
  const handleEditItem = (uuid) => {
    setEditItem(uuid);
    setInputEditChange(itemsList.find((item) => item.uuid === uuid).name);
  };

  const handleCancelEdit = (uuid) => {
    setEditItem("");
  };

  const handleMenuItemHover = (uuid) => {
    setHoveredItem(uuid);
  };

  //Add New Item in the list
  const handleAddItem = (event) => {
    event.stopPropagation();
    setLoading(true);
    if (inputChange !== "") {
      addNewRevenueItem({ name: inputChange })
        .then((res) => {
          RevenueItemList();
          setInputChange("");
          setShowAddNewItem(true);
          setShowAddNewItemInput(false);
          setDeleteIconChange("");
        })
        .catch((error) => {
          setLoading(false);
          alert(error?.response?.data?.message);
          setInputChange("");
          setShowAddNewItem(true);
          setShowAddNewItemInput(false);
          setDeleteIconChange("");
          console.log("error", error);
        });
    } else {
      setLoading(false);
    }
  };

  //Function For Update Item in List
  const handleUpdateItem = (uuid) => {
    setLoading(true);
    updateRevenueItem({ uuid: uuid, name: inputEditChange })
      .then((res) => {
        RevenueItemList();
        setEditItem("");
      })
      .catch((error) => {
        alert(error?.response?.data?.message);
        setLoading(false);
        setEditItem("");
      });
  };

  //Function For Delete Item from the list
  const handleDeleteItem = (uuid) => {
    // console.log("uuid delete item", uuid);
    setLoading(true);
    deleteRevenueItem({ revenue_item_uuid: uuid })
      .then((res) => {
        RevenueItemList();
        setEditItem("");
        setDeleteIconChange("");
        // copy of the items object from revenueExpenseData
        let updatedItems = { ...revenueExpenseData.items };
        // matching uuid and then obj empty
        Object.keys(updatedItems).forEach((key) => {
          const item = updatedItems[key].revenueItem;
          if (item.uuid === uuid) {
            updatedItems[key].revenueItem = {};
          }
        });
      })
      .catch((error) => {
        alert(error?.response?.data?.errors?.revenue_item_uuid[0]);
        setDeleteIconChange("");
        setLoading(false);
      });
  };

  //Revenue Item List
  const RevenueItemList = () => {
    getRevenueItemList()
      .then((res) => {
        setItemsList(res?.data?.data);
        setRevenueItemArray(res?.data?.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  //useEffect for API Call
  useEffect(() => {
    setLoading(true);
    RevenueItemList();
    const handleClickOutside = (event) => {
      if (
        iconContainerRef.current &&
        !iconContainerRef.current.contains(event.target)
      ) {
        setHoveredItem(""); // Reset hoveredItem if click occurs outside the icon container
        setEditItem("");
        setDeleteIconChange("");
        setShowAddNewItem(true);
        setShowAddNewItemInput(false);
        setInputChange("");
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <Box>
      <FormControl fullWidth size="small">
        <InputLabel id="demo-simple-select-label">Revenue Item</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          name="revenueItem"
          value={
            value
              ? getItemsRowValues("Revenue Item", "value", item)
              : revenueItem
          }
          label="Revenue Item"
          // renderValue={getItemsRowValues("Revenue Item", "value", item)}
          onChange={
            handleChange
              ? (e) => itemOnChange(e, item)
              : handleRevenueItemChange
          }
          error={isEmpty.itemsEmpty || isEmpty?.items ? true : false}
          className={`h-10`}>
          {loading ? (
            <MenuItem>Loading...</MenuItem>
          ) : (
            itemsList?.map((o, i) => {
              const handlePreventCloseForEdit = (event) => {
                if (event.target.tagName !== "INPUT") {
                  event.stopPropagation();
                  handleEditItem(o.uuid);
                }
              };

              const handlePreventCloseForUpdate = (event) => {
                event.stopPropagation();
                handleUpdateItem(o.uuid);
              };

              const handlePrevenueDoneForDelete = (event) => {
                event.stopPropagation();
                handleDeleteItem(o.uuid);
              };

              const handlePreventCloseForDelete = (event) => {
                event.stopPropagation();
                setDeleteIconChange("");
              };

              const handlePreventCloseForClose = (event) => {
                event.stopPropagation();
                setDeleteIconChange(o.uuid);
              };

              const handlePreventCloseForCancel = (event) => {
                event.stopPropagation();
                handleCancelEdit(o.uuid);
              };

              const handlePrevent = (event) => {
                event.stopPropagation();
              };

              return (
                <MenuItem
                  value={o.uuid}
                  name={o.name}
                  key={o.uuid}
                  onMouseEnter={() => handleMenuItemHover(o.uuid)}
                  onMouseLeave={() => handleMenuItemHover("")}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    width="100%"
                    // className="hover:flex hover:justify-between hover:item-center hover:bg-danger"
                    ref={iconContainerRef}>
                    {editItem === o.uuid ? (
                      <input
                        value={inputEditChange}
                        onChange={handleEditChange}
                        className="bg-transparent border-[1px] border-transparent focus:!border-b-[1px] focus:outline-none w-full focus:!border-b-blue-800"
                        onClick={handlePrevent}
                        autoFocus
                        onKeyDown={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <div className="!my-auto !py-0  !h-fit hover:!my-auto hover:!py-0 hover:!h-fit">
                        {o.uuid === revenueItem ? (
                          <Typography className="">{o.name}</Typography>
                        ) : (
                          <Box display="flex" alignItems="center">
                            {o.name}
                          </Box>
                        )}
                      </div>
                    )}
                    {/* Functions When Hover On MenuItem */}
                    {hoveredItem === o.uuid && (
                      <Box component={"div"}>
                        {editItem === o.uuid ? (
                          <>
                            <IconButton onClick={handlePreventCloseForUpdate}>
                              <DoneRoundedIcon />
                            </IconButton>
                            <IconButton onClick={handlePreventCloseForCancel}>
                              <CloseRoundedIcon />
                            </IconButton>
                          </>
                        ) : deleteIconChange === o.uuid ? (
                          <>
                            <IconButton onClick={handlePrevenueDoneForDelete}>
                              <DoneRoundedIcon />
                            </IconButton>
                            <IconButton onClick={handlePreventCloseForDelete}>
                              <CloseRoundedIcon />
                            </IconButton>
                          </>
                        ) : (
                          <>
                            <IconButton onClick={handlePreventCloseForEdit}>
                              <EditIcon />
                            </IconButton>
                            <IconButton onClick={handlePreventCloseForClose}>
                              <DeleteRoundedIcon />
                            </IconButton>
                          </>
                        )}
                      </Box>
                    )}
                  </Box>
                </MenuItem>
              );
            })
          )}
          {!loading && (
            <div className="flex p-2 hover:bg-lightGray w-full">
              {showAddNewItem && (
                <div
                  className="flex gap-2 cursor-pointer"
                  onClick={handleInput}>
                  <AddIcon color="primary" />
                  <Typography>Add New Item</Typography>
                </div>
              )}
              {showAddNewItemInput && (
                <div className="flex w-full justify-between">
                  <input
                    value={inputChange}
                    onChange={handleInputChange}
                    className="pr-5 bg-transparent border-0 focus:border-0 focus:outline-none w-full focus:border-b focus:border-blue-800 ml-2"
                    placeholder="Add New Revenue Item"
                    autoFocus
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                  <div className="flex">
                    <IconButton onClick={handleAddItem}>
                      <DoneRoundedIcon />
                    </IconButton>
                    <IconButton onClick={handleCrossItem}>
                      <CloseRoundedIcon />
                    </IconButton>
                  </div>
                </div>
              )}
            </div>
          )}
        </Select>
      </FormControl>
    </Box>
  );
}
