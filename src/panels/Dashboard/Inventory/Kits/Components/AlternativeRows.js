import React, { useState, useRef, useEffect } from "react";
import { Delete } from "@mui/icons-material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

const AlternativeRows = ({
  data,
  removeAlternative,
  dropdowndata,
  kitDetails,
  setKitDetails,
  index,
  setIsError,
}) => {
  const dragItem = useRef();
  const dragOverItem = useRef();
  const [list, setList] = useState(data);
  let increasingNum = 1;

  useEffect(() => {
    setList(data);
  }, [data]);

  const dragStart = (position) => {
    dragItem.current = position;
  };

  const dragEnter = (position) => {
    dragOverItem.current = position;
  };

  const drop = () => {
    const copyListItems = [...list];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setList(copyListItems);

    let items = kitDetails?.kit_products;
    items[index].product_alternative = copyListItems;
    setKitDetails({ ...kitDetails, kit_products: items });
  };

  return (
    <div
      className={`mb-2 rounded-b-[6px] ${index % 2 !== 0 ? "bg-lightGray" : "bg-white"}`}>
      <p className={`ml-5 mb-2 text-darkGray text-[13px]`}>Alternative:</p>
      {list?.map((item, index2) => {
        return (
          <div
            key={index2}
            className="flex flex-row h-10 gap-3 my-2"
            onDragStart={() => dragStart(index2)}
            onDragEnter={() => dragEnter(index2)}
            onDragEnd={drop}
            draggable>
            <div className="text-sm text-primaryColor !pl-5 w-[17.28%] py-2">
              <DragIndicatorIcon
                fontSize="small"
                color="secondary"
                className="cursor-move -ml-5 mb-1"
              />
              {item?.product?.name}
            </div>
            <div className="text-sm w-[17.28%] py-2">
              {item?.part_type?.name?.includes("Raw")
                ? `Raw ${increasingNum++}`
                : item?.part_type?.name}
            </div>
            <div className="text-sm w-[24%] py-1">
              {item?.product?.description}
            </div>
            <div className="text-sm w-[10.6%]">
              <input
                value={item?.amount}
                className="border-2 rounded pl-2 ml-2 py-2 w-28 focus:border-primaryColor focus:outline-none"
                onChange={(e) => {
                  e.target.value = e.target.value.replace(/[^\d]/g, "");
                  let items = kitDetails?.kit_products;
                  items[index].product_alternative[index2].amount =
                    e.target.value;
                  setKitDetails({ ...kitDetails, kit_products: items });
                  setIsError(false);
                }}
              />
            </div>
            <div className="text-sm w-[17.5%]">
              <select
                className="border-2 rounded ml-1 py-2 w-24 focus:border-primaryColor focus:outline-none"
                name="unit"
                id="unit"
                onChange={(e) => {
                  const unit = JSON.parse(e.target.value);
                  let data = [...kitDetails?.kit_products];
                  data[index].product_alternative[index2].unit = unit;
                  setKitDetails({ ...kitDetails, kit_products: data });
                }}>
                <option value="" selected disabled hidden>
                  {item?.unit?.name}
                </option>
                {dropdowndata?.unit?.map((unit, index) => {
                  return (
                    <option key={index} value={JSON.stringify(unit)}>
                      {unit?.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="w-[6.6%]"> </div>
            <div className="flex justify-center w-[6.6%] pl-[0.3%]">
              <Delete
                onClick={() => removeAlternative(index, index2)}
                className="cursor-pointer ml-2"
                fontSize="small"
                color="secondary"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default AlternativeRows;
