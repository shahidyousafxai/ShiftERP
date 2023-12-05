import React from "react";
import { useNavigate } from "react-router-dom";
import { Popover } from "rsuite";
import { Box } from "@mui/system";
import { Adjust, ArrowDropDown, NoteAdd, Work } from "@mui/icons-material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import InventoryIcon from "@mui/icons-material/Inventory";
import ViewInArRoundedIcon from "@mui/icons-material/ViewInArRounded";
import DescriptionIcon from "@mui/icons-material/Description";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import { Button } from "../../../../shared";
import CustomPopoverButton from "../../../../shared/PopOver";
import { secondaryColor } from "../../../../helpers/GlobalVariables";

//Today Button
export const TodayButton = () => {
  const navigate = useNavigate();
  return (
    <Button
      startIcon={<Adjust />}
      className="capitalize font-medium text-[13px] ml-[10px]"
      onClick={() => navigate("#")}
      component="span"
      color="secondary"
      variant="outlined">
      Today
    </Button>
  );
};

//Filter Button
export const FilterButton = () => {
  const navigate = useNavigate();
  return (
    <Button
      startIcon={<FilterAltIcon />}
      className="capitalize font-medium text-[13px] ml-[10px]"
      onClick={() => navigate("#")}
      component="span"
      color="secondary"
      variant="outlined">
      Filter By Facility
    </Button>
  );
};

//Date Range Button
export const DateRangeButton = () => {
  const navigate = useNavigate();
  return (
    <Button
      className="capitalize font-medium text-[13px] ml-[10px] text-black"
      onClick={() => navigate("#")}
      component="span"
      color="secondary"
      variant="outlined"
      endIcon={<ArrowDropDown sx={{ color: secondaryColor }} />}>
      Mar 1 - Mar 31, 2022
    </Button>
  );
};

//Quick Action Button
export const QuickActionButton = () => {
  const navigate = useNavigate();
  return (
    <CustomPopoverButton
      classes="w-fit"
      icon={true}
      children={
        <Button
          startIcon={<Work sx={{ height: "16px" }} />}
          className="capitalize font-medium text-[13px]"
          component="span"
          color="primary"
          variant="contained"
          endIcon={<ArrowDropDown />}>
          Quick Actions
        </Button>
      }
      placement="autoVerticalEnd"
      speaker={
        <Popover arrow={false} className="!p-0 w-1/4">
          <div className="border-lightGray rounded-xl">
            <div className="table border-collapse overflow-hidden border-2 rounded-[6px] m-0 w-full scale-x-[1.014] xl:scale-x-[1.01] scale-y-[1.012]">
              <div className="table-row cursor-pointer">
                <Box
                  className="table-cell !m-0 py-[25px] text-center border-lightGray border-2 hover:bg-lightGray"
                  onClick={() =>
                    navigate("/smart-schedule", {
                      state: { from: "dashboardCreateOrder" },
                    })
                  }>
                  <div className="flex flex-col flex-auto items-center gap-2">
                    <ViewInArRoundedIcon color="secondary" />
                    Create Order
                  </div>
                </Box>
                <Box
                  className="table-cell py-[25px] text-center border-lightGray border-2 hover:bg-lightGray "
                  onClick={() =>
                    navigate("/smart-schedule", {
                      state: { from: "dashboardAddNote" },
                    })
                  }>
                  <div className="flex flex-col items-center gap-2">
                    <NoteAdd color="secondary" />
                    Add Note
                  </div>
                </Box>
              </div>

              <div className="table-row cursor-pointer">
                <Box
                  className="table-cell text-center py-[25px] border-lightGray border-2 hover:bg-lightGray "
                  onClick={() =>
                    navigate("/smart-schedule", {
                      state: { from: "dashboardImportData" },
                    })
                  }>
                  <div className="flex flex-col items-center gap-2">
                    <DriveFolderUploadIcon color="secondary" />
                    Import Data
                  </div>
                </Box>
                <Box
                  className="table-cell text-center py-[25px] border-lightGray border-2  hover:bg-lightGray "
                  onClick={() => navigate("/supply-chain/needs")}>
                  <div className="flex flex-col items-center gap-2">
                    <DescriptionIcon
                      color="secondary"
                      sx={{ transform: "rotate(360deg)" }}
                    />
                    Needs Report
                  </div>
                </Box>
              </div>

              <div className="table-row cursor-pointer">
                <Box
                  className="table-cell text-center py-[25px] border-lightGray border-2 hover:bg-lightGray "
                  onClick={() => navigate("/inventory/kits")}>
                  <div className="flex flex-col items-center">
                    <p className="text-secondaryColor rotate-180 text-[26px] w-20 ml-2 -mt-2">
                      Ψ
                    </p>
                    <p className="-mt-1 ml-2">Kits</p>
                  </div>
                </Box>
                <Box
                  className="table-cell text-center py-[25px] border-lightGray border-2  hover:bg-lightGray "
                  onClick={() => navigate("/inventory/products")}>
                  <div className="flex flex-col items-center gap-2">
                    <InventoryIcon color="secondary" />
                    Inventory
                  </div>
                </Box>
              </div>
            </div>
          </div>
        </Popover>
      }
    />
  );
};
