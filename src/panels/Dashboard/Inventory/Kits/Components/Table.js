import React from "react";
import DescriptionIcon from "@mui/icons-material/Description";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

import { ManageItem } from "./utils";

import AlternativeRows from "./AlternativeRows";

// eslint-disable-next-line import/no-anonymous-default-export
export default ({
  products,
  kitDetails,
  setKitDetails,
  dropdowndata,
  setAddAlternativeModal,
  kitData,
  setKitData,
  onRemoveItem,
  setAddAlternativeItemIndex,
  removeAlternative,
  setIsError,
  setAlternativeItemAlertModal,
  setTotalItem,
  setAlternativeSelectedItemId,
}) => {
  let increasingNum = 1;
  return (
    <div>
      <table className="bg-white text-black table-fixed border-separate w-full shadow-none">
        <thead className="sticky top-0 bg-lightGray z-[30]">
          <tr>
            <th className="w-52 font-medium !pl-5 border-b-2 py-2 text-[12px] text-darkGray">
              Product
            </th>
            <th className="w-52 font-medium border-b-2 py-2 text-[12px] text-darkGray">
              Part Type
            </th>
            <th className="w-72 font-medium border-b-2 py-2 text-[12px] text-darkGray">
              Product Description
            </th>
            <th className="w-32 font-medium border-b-2 py-2 text-[12px] text-darkGray">
              Amount
            </th>
            <th className="w-48 font-medium border-b-2 py-2 text-[12px] text-darkGray">
              Unit
            </th>
            <th className=" w-24 font-medium border-b-2 py-2 text-[12px] text-darkGray">
              Availability
            </th>
            <th className="w-20 font-medium !pl-7 border-b-2 py-2 text-[12px] text-darkGray">
              Manage
            </th>
          </tr>
        </thead>

        <tbody>
          {products?.length > 0 ? (
            products?.map((item, index) => {
              return (
                <>
                  {/* Item Rows */}
                  <tr
                    className={`${
                      index % 2 !== 0 ? "bg-lightGray" : "bg-white"
                    }`}
                    key={index}>
                    <td
                      className={`text-sm text-primaryColor py-2 !pl-5 rounded-tl-[6px]  ${
                        item?.product_alternative?.length > 0
                          ? "rounded-bl-0"
                          : "rounded-bl-[6px]"
                      }`}>
                      {item?.product?.name}
                    </td>
                    <td className="text-sm py-2">
                      {item?.part_type?.name?.includes("Raw")
                        ? `Raw ${increasingNum++}`
                        : item?.part_type?.name}
                    </td>
                    <td className="text-sm py-2">
                      {item?.product?.description}
                    </td>
                    <td className="text-sm py-2 !w-72">
                      <div className="flex gap-3 mr-2">
                        <input
                          value={item?.amount}
                          className="border-2 rounded-[6px] bg-white pl-2 py-2 w-28 focus:border-primaryColor focus:outline-none"
                          onChange={(e) => {
                            e.target.value = e.target.value.replace(
                              /[^\d]/g,
                              ""
                            );
                            let data = [...kitDetails?.kit_products];
                            data[index].amount = e.target.value;
                            setKitDetails({
                              ...kitDetails,
                              kit_products: data,
                            });
                            setIsError(false);
                          }}
                        />
                      </div>
                    </td>
                    <td className="w-28">
                      <select
                        className="border-2 rounded pr-2 py-2 w-24 focus:border-primaryColor focus:outline-none"
                        name="unit"
                        id="unit"
                        onChange={(e) => {
                          const unit = JSON.parse(e.target.value);
                          let data = [...kitDetails?.kit_products];
                          data[index].unit = unit;
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
                    </td>
                    <td className="text-sm py-2">
                      {item?.product?.status !== 0 ? (
                        <CheckCircleRoundedIcon
                          color="success"
                          className="fs-5"
                        />
                      ) : (
                        <div className="flex w-32">
                          <WarningRoundedIcon
                            color="danger"
                            className="me-1 fs-5"
                          />
                          Not available
                        </div>
                      )}
                    </td>
                    <td className="rounded-t rounded-b">
                      <div
                        className="w-fit ml-[30%]"
                        onClick={() => {
                          if (item?.product_alternative.length >= 3) {
                            setAlternativeItemAlertModal(true);
                          }
                        }}>
                        <ManageItem
                          id={index}
                          setAddAlternativeModal={setAddAlternativeModal}
                          setAddAlternativeItemIndex={
                            setAddAlternativeItemIndex
                          }
                          removeItem={onRemoveItem}
                          alternativeItemAlertModal
                          value={item?.product_alternative?.length}
                          setTotalItem={setTotalItem}
                          setAlternativeSelectedItemId={
                            setAlternativeSelectedItemId
                          }
                          completeProduct={item}
                        />
                      </div>
                    </td>
                  </tr>
                  {/* Alternative Items Rows */}
                  {item?.product_alternative.length !== 0 && (
                    <tr>
                      <td colspan="7">
                        <table className="bg-white text-black table-fixed w-full shadow-none">
                          <AlternativeRows
                            data={item.product_alternative}
                            kitData={kitData}
                            removeAlternative={removeAlternative}
                            setKitData={setKitData}
                            dropdowndata={dropdowndata}
                            index={index}
                            products={products}
                            setKitDetails={setKitDetails}
                            kitDetails={kitDetails}
                            setIsError={setIsError}
                          />
                        </table>
                      </td>
                    </tr>
                  )}
                </>
              );
            })
          ) : (
            // Empty Table Placeholder
            <tr className="flex items-center justify-center w-[80vw]">
              <div className="flex flex-col items-center mt-3">
                <DescriptionIcon fontSize="large" color="secondary" />
                <p className="mt-2 text-black text-[13px]">
                  No data added to the table.
                </p>
              </div>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
