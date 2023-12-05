// Library Imports
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// Local Imports
import { deleteProduct } from "../../../../../api/productsApi";
import { getProducts } from "../../../../../redux/product/actions";
import { PopoverDelete, PopoverEdit, PopoverViewDetails, PopoverPrint, SettingsPopover } from "../../../../../helpers/TableUtilities";
import { SimpleDeleteModal } from "../../../../../helpers/SimpleDeleteModal";

export const ManageProduct = (restProps, previewBarcode, facilityUser) => {
  const id = restProps.row.id;
  const product = restProps.row.completeItem;
  const [isError, setIsError] = useState(false);
  const [isErrorMsg, setIsErrorMsg] = useState("");
  const dispatch = useDispatch();

  const [isOpen, setIsopen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  let navigate = useNavigate();
  const [isDelete, setIsDelete] = useState(false);

  const handleDeleteProduct = (id, setDeleteLoading) => {
    setDeleteLoading(true);
    console.log("handle delete product");
    deleteProduct({ ids: [id] })
      .then((res) => {
        setDeleteLoading(false);
        setIsDelete(false);
        let payload = {
          search: "",
          status: "",
          customer_id: "",
          allergen_id: "",
          category_id: "",
          order: "",
        };
        dispatch(getProducts(payload));
      })
      .catch((err) => {
        if (err?.response?.data?.message) {
          setIsError(true);
          setIsErrorMsg(err?.response?.data?.message);
          setDeleteLoading(false);
        }
      });
  };

  return (
    <React.Fragment>

      <SimpleDeleteModal
        states={{
          open: isDelete,
          setOpen: setIsDelete,
          errorMsg: isErrorMsg,
          setErrorMsg: setIsErrorMsg,
          headTitle: "Delete Product",
          deleteName: restProps.row.name,
          loading: deleteLoading,
          deleteMethod: () => handleDeleteProduct( restProps.row.completeItem.uuid, setDeleteLoading),
        }}
      />

      <SettingsPopover id={id}>
        <PopoverViewDetails onClick={() => previewBarcode(product)} text="Preview Barcode" />
        <PopoverPrint onClick={() => setIsopen(!isOpen)} text="Print Product" />
        <PopoverEdit
          onClick={() =>
            navigate("/inventory/edit-product/${id}", {
              state: { product: product },
            })} />
        {!facilityUser && <PopoverDelete onClick={() => setIsDelete(!isDelete)} text="Delete" />}
      </SettingsPopover>
    </React.Fragment>
  );
};
