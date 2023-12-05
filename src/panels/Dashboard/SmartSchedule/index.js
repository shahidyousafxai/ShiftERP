// Library Imports
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Add } from "@mui/icons-material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import GetAppRoundedIcon from "@mui/icons-material/GetAppRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import LayersRoundedIcon from "@mui/icons-material/LayersRounded";
import ViewInArRoundedIcon from "@mui/icons-material/ViewInArRounded";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
// Local Imports
import { BreadCrumb, Button, CustomModal, Box } from "../../../shared";
import SmartSchedular from "./Schedular/SmartSchedular";
import { AddNoteModal, ImportDataModal } from "./Components/utils";

const SmartSchedule = () => {
  const [isSelectOrder, setIsSelectOrder] = useState(false);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [isImportDataOpen, setIsImportDataOpen] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const from = state?.from;
  console.log("🚀 ~ file: index.js:24 ~ SmartSchedule ~ from:", state);

  //useEffect for remove Modal value From URL
  useEffect(() => {
    window.history.replaceState(null, "", window.location.pathname);
  }, []);

  useEffect(() => {
    if (from === "dashboardAddNote") {
      console.log("hello");
      setIsNoteOpen(true);
    }
    if (from === "dashboardImportData") {
      setIsImportDataOpen(true);
    }
    if (from === "dashboardCreateOrder") {
      setIsSelectOrder(true);
    }
  }, [from]);

  return (
    <div className="main-container">
      {/* BreadCrums Start */}
      <div className="d-flex flex-row justify-content-between align-items-center py-3 pl-4">
        <div>
          <BreadCrumb
            routes={[
              { name: "ShiftERP", route: "/dashboard", color: true },
              { name: "Smart Schedule" },
            ]}
          />
          <div className="text-[15px] font-bold">Smart Schedule</div>
        </div>
        <div>
          <Button
            startIcon={<InsertDriveFileIcon />}
            className="capitalize text-[13px] font-[500] mr-[10px]"
            component="span"
            color="primary"
            variant="outlined"
            onClick={() => setIsNoteOpen(!isNoteOpen)}>
            Add Note
          </Button>
          <Button
            startIcon={<GetAppRoundedIcon />}
            className="capitalize text-[13px] font-[500] mr-[10px]"
            component="span"
            color="primary"
            variant="outlined"
            onClick={() => setIsImportDataOpen(!isImportDataOpen)}>
            Import Data
          </Button>
          <Button
            startIcon={<Add />}
            className="capitalize text-[13px] font-[500] mr-[10px]"
            component="span"
            color="primary"
            variant="contained"
            onClick={() => setIsSelectOrder(!isSelectOrder)}>
            Add New Order
          </Button>
        </div>
      </div>
      {/* BreadCrums End */}

      {/* Select Order Modal */}
      <CustomModal open={isSelectOrder} width={window.innerWidth * 0.5}>
        <div className="p-[20px] flex flex-col gap-3">
          <div className="flex justify-between">
            <div>Choose Order Type</div>
            <div
              className=" cursor-pointer"
              onClick={() => setIsSelectOrder(!isSelectOrder)}>
              <CloseRoundedIcon />
            </div>
          </div>
          <div className="border-lightGray border-2 rounded-xl">
            <div className="table border-collapse overflow-hidden border-2 rounded-lg !-mb-[3px] -mt-[3px]  -ml-[3px] -mr-[3px] w-[100.8%]">
              <div className="table-row cursor-pointer">
                <Box
                  className="table-cell py-[25px] text-center border-lightGray border-2 hover:bg-lightGray rounded-tl-xl"
                  onClick={() =>
                    navigate("/smart-schedule/add-new-receiving-order")
                  }>
                  <div className="flex flex-col items-center gap-2">
                    <ViewInArRoundedIcon color="secondary" />
                    Receiving Order
                  </div>
                </Box>
                <Box
                  className="table-cell py-[25px] text-center border-lightGray border-2 hover:bg-lightGray rounded-tr-xl"
                  onClick={() =>
                    navigate("/smart-schedule/add-new-production-order")
                  }>
                  <div className="flex flex-col items-center gap-2">
                    <LayersRoundedIcon color="secondary" />
                    Production Order
                  </div>
                </Box>
              </div>
              <div className="table-row cursor-pointer">
                <Box
                  className="table-cell text-center py-[25px] border-lightGray border-2 hover:bg-lightGray rounded-bl-xl"
                  onClick={() =>
                    navigate("/smart-schedule/add-new-blend-order")
                  }>
                  <div className="flex flex-col items-center gap-2">
                    <DynamicFeedIcon
                      color="secondary"
                      sx={{ transform: "rotate(360deg)" }}
                    />
                    Blend Order
                  </div>
                </Box>
                <Box
                  className="table-cell text-center py-[25px] border-lightGray border-2  hover:bg-lightGray rounded-br-xl"
                  onClick={() =>
                    navigate("/smart-schedule/add-new-shipping-order")
                  }>
                  <div className="flex flex-col items-center gap-2">
                    <LocalShippingRoundedIcon color="secondary" />
                    Shipping Order
                  </div>
                </Box>
              </div>
            </div>
          </div>
        </div>
      </CustomModal>

      {/* Add Note Modal */}
      <AddNoteModal isNoteOpen={isNoteOpen} setIsNoteOpen={setIsNoteOpen} />

      {/* Import Data Modal */}
      <ImportDataModal
        isImportDataOpen={isImportDataOpen}
        setIsImportDataOpen={setIsImportDataOpen}
      />

      <div className="text-center flex flex-col items-center">
        <SmartSchedular />
      </div>
    </div>
  );
};
export default SmartSchedule;
