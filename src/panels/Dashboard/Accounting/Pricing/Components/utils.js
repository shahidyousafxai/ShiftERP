// Local Imports
import { PopoverPrint, PopoverSend, SettingsPopover } from "../../../../../helpers/TableUtilities";

export const ManagePricing = (restProps) => {
  const id = restProps.row.id;

  return (
    <>
      {/* <DeleteModal
        id={pricingRule.uuid}
        singleRowData={pricingRule}
        isDelete={isDelete}
        setIsDelete={setIsDelete}
        setDeleteAlert={setDeleteAlert}
        setLoading={setLoading}
        setSelectionIds={setSelectionIds}
        setFromModal={() => {}}
      /> */}

      <SettingsPopover id={id}>
        <PopoverSend text="Send Bill" />
        <PopoverPrint text="Print Bill" />
      </SettingsPopover>
    </>
  );
};
