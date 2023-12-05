import { useNavigate } from "react-router-dom";
import { Edit } from "@mui/icons-material";
import { secondaryColor } from "../../../../../helpers/GlobalVariables";
import { useState } from "react";

export const Product = (restProps) => {
  const navigate = useNavigate();
  const product = restProps?.row;
  return (
    <div
      className="d-flex flex-row align-items-center cursor-pointer"
      onClick={() =>
        navigate("/inventory/edit-product/${id}", {
          state: { product: product },
        })
      }>
      <Edit className={`text-[20px] mr-2 text-[${secondaryColor}]`} />
      {restProps?.row?.name}
    </div>
  );
};

export const ManageWeeksValue = (
  restProps,
  weekDataArray,
) => {
  const rowUuid = restProps?.row?.uuid;
  const [rowData, setRowData] = useState({});

  const handleInputChange = (event) => {
    event.preventDefault();
    const name = event.target.name;
    const value = event.target.value;

    setRowData((prevRowDataMap) => ({
      ...prevRowDataMap,
      [rowUuid]: {
        ...prevRowDataMap[rowUuid],
        values: {
          ...prevRowDataMap[rowUuid]?.values,
          [name]: value,
        },
      },
    }));
  };

  console.log("🚀 ~ file: addUtils.js:69 ~ rowData:", rowData);
  console.log("weekdataarray", weekDataArray);
  return (
    <div className="d-flex flex-row align-items-center">
      <div className="w-20 h-10">
        <input
          className="!h-8 !w-24 outline-none border border-[#E0E0E0] rounded-md px-2"
          value={rowData.values[restProps?.column?.name] || ""}
          name={restProps?.column?.name}
          onChange={(event) => {
            handleInputChange(event);
          }}
        />
      </div>
    </div>
  );
};
