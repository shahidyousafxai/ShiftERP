import React from "react";
import { Appointment } from "../../SmartSchedule/Schedular/Components/Appointments";
import EventRoundedIcon from "@mui/icons-material/EventRounded";

const Orders = ({ customerOrders }) => {
  // console.log("🚀 customerOrders:", customerOrders);
  const customerOrdersData = customerOrders?.map((item, index) => {
    let orderlist = {
      uuid: item?.uuid,
      type: item?.type,
      status: item?.status,
      updatedBy: item?.updated_by,
      releaseNo: item?.release_number,
      poNumber: item?.po_number,
      poNotes: item?.po_notes,
      notes: item?.notes,
      driver1: item?.driver1,
      driver2: item?.driver2,
      date: item?.date,
      time: item?.time,
      customer: item?.customer,
      productionOrder: item?.production_order,
      blendOrder: item?.blendOrder,
      shippingOrder: item?.shipping_order,
      recieveingOrder: item?.receiving_order,
      startDate: `${item?.date}T${item?.time}`,
      updatedAt: item?.updated_at,
      hasConnectedOrders: item?.has_connected_orders,
      scheduleId: item?.schedule_id,
    };
    return orderlist;
  });

  return (
    <div className="flex flex-col justify-between pr-[20px] pl-[20px] w-full">
      <div className="border rounded bg-white pb-0.5 my-[20px]">
        <p className="px-3 py-3 text-base font-semibold">Orders</p>
        {customerOrdersData?.length === 0 ? (
          <div className="flex items-center justify-center py-4">
            <div className="flex flex-col item-center gap-1 text-[14px] text-black font-normal">
              <EventRoundedIcon
                fontSize="small"
                className={`text-secondaryColor m-auto `}
              />
              No Orders yet.
            </div>
          </div>
        ) : (
          customerOrdersData?.map((order) => {
            return (
              <div className="max-h-[640px] overflow-y-auto">
                <div className="flex flex-col gap-2 justify-between h-[150px] relative z-50 mx-3 ">
                  <Appointment data={order} currentViewName="Day" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Orders;
