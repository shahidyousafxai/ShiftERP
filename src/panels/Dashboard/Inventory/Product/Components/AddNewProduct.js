/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
// Library Imports
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Add, Delete, Edit, Error } from "@mui/icons-material";
import Barcode from "react-barcode";
import PrintIcon from "@mui/icons-material/Print";
import ClearIcon from "@mui/icons-material/Clear";
// Local Imports
import {
  CustomModal,
  Button,
  Typography,
  BreadCrumb,
  TextField,
  MaterialDropdown as MaterialDropDown,
  Spinner,
  MuiSwitch as Switch,
  MultiDropDown,
} from "../../../../../shared";
import {
  addProduct,
  deleteProduct,
  getDependencies,
  getProductDetails,
  updateProduct,
} from "../../../../../api/productsApi.js";
import { useOnClickOutside } from "../../../../../helpers/useOutSideClick";
import "../Styles/product.css";
import { useSelector } from "react-redux";
import { danger } from "../../../../../helpers/GlobalVariables";
import { SimpleDeleteModal } from "../../../../../helpers/SimpleDeleteModal";

const AddNewProduct = () => {
  const user = useSelector((state) => state.user);
  const facilityUser = user?.currentUser?.role === "facility_user";
  const ref = useRef();
  let { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const specificProduct = state?.product;
  const [alertModal, setAlertModal] = useState(false);
  const [loadFacility, setLoadFacility] = useState(false);
  const [isError, setIsError] = useState("");
  const [errorObj, setErrorMsg] = useState({ type: "", title: "", msg: "" });
  // States
  const [dependenciesArray, setDependenciesArray] = useState({
    allergens: [],
    categories: [],
    customers: [],
    facilities: [],
    unit_types: [],
  });
  const [productData, setProductData] = useState({
    customerCode: "",
    customerId: "",
    itemDesc: "",
    categoryName: "",
    categoryId: "",
    itemName: "",
    itemDescInternal: "",
    barCode: "",
    itemNameInternal: "",
    upc: "",
    facilities: [],
    status: 0,

    unitOfStockName: "",
    unitOfOrderName: "",
    unitOfPurchaseName: "",
    unitOfCountName: "",
    unitOfPackageName: "",
    unitOfSellName: "",
    unitOfAssemblyName: "",

    unitOfStock: "",
    unitOfOrder: "",
    unitOfPurchase: "",
    unitOfCount: "",
    unitOfPackage: "",
    unitOfSell: "",
    unitOfAssembly: "",

    varUnit1Name: "",
    convertUnit1Name: "",
    varUnit2Name: "",
    convertUnit2Name: "",
    convertUnit3Name: "",

    varUnit1: "",
    convertUnit1: "",
    unit1Multiplier: "",
    varUnit2: "",
    convertUnit2: "",
    unit2Multiplier: "",
    itemGrossWeight: "",
    convertUnit3: "",
    unit3Multiplier: "",

    parLevelUnitName: "",
    safetyStockUnitName: "",

    palletTie: "",
    kitParentCost: "",
    safetyStock: "",
    global: 0,
    shelveDays: "",
    safetyStockUnit: "",
    kitParent: 0,
    parLevel: "",
    highRisk: 0,
    parLevelUnit: "",
    minBlendAmount: "",
    costItem: 0,

    allergens: [],
  });
  // User Details Error State
  const [isEmpty, setIsEmpty] = useState({
    customerId: false,
    itemDesc: false,
    categoryId: false,
    itemName: false,
    barCode: false,

    unitOfStock: false,
    unitOfOrder: false,
    unitOfCount: false,
    unitOfPackage: false,
    unitOfSell: false,

    convertUnit1: false,
    unit1Multiplier: false,
    convertUnit2: false,
    unit2Multiplier: false,
    itemGrossWeight: false,
    unit3Multiplier: false,
  });
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [changeAllergensHeight, setChangeAllergensHeight] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  // Methods

  useEffect(() => {
    if (id) {
      productDetails();
    }
    getDependencyList();
    console.log("state?.product ? true : false", state?.product ? true : false);
  }, []);

  // Calling Dependency Dropdown List
  const getDependencyList = () => {
    getDependencies()
      .then((res) => {
        setLoadingList(false);

        let data = res?.data?.data;
        setDependenciesArray(data);
        setIsDisabled(state?.product ? true : false);
      })
      .catch((error) => {
        console.log("🚀 ~ file: AddNewProduct.js ~ line 35 ~ error", error);
      });
  };

  const getFacilitiesList = (customerCode) => {
    setLoadFacility(true);
    getDependencies({ customer_id: customerCode?.uuid })
      .then((res) => {
        let data = res?.data?.data;
        setDependenciesArray(data);
        setLoadFacility(false);
        setIsDisabled(state?.product ? true : false);
      })
      .catch((error) => {
        console.log("error", error);
        setLoadFacility(false);
      });
  };

  // Get Single User Details While Editing User
  const productDetails = async () => {
    await getProductDetails({ uuid: state?.product?.uuid })
      .then((res) => {
        setLoadingList(false);

        let data = res?.data?.data?.product;
        getFacilitiesList(data?.customer);
        setProductData({
          customerCode: data?.customer?.code ? data?.customer?.code : "",
          customerId: data?.customer?.uuid ? data?.customer?.uuid : "",
          itemDesc: data?.description ? data?.description : "",
          categoryName: data?.category?.name ? data?.category?.name : "",
          categoryId: data?.category?.uuid ? data?.category?.uuid : "",
          itemName: data?.name ? data?.name : "",
          itemDescInternal: data?.internal_description
            ? data?.internal_description
            : "",
          barCode: data?.barcode ? data?.barcode : "",
          itemNameInternal: data?.internal_name ? data?.internal_name : "",
          upc: data?.universal_product_code ? data?.universal_product_code : "",
          status: data?.status ? data?.status : 0,

          unitOfStockName: data?.unit?.unit_of_stock?.name
            ? data?.unit?.unit_of_stock?.name
            : "",
          unitOfOrderName: data?.unit?.unit_of_order?.name
            ? data?.unit?.unit_of_order?.name
            : "",
          unitOfPurchaseName: data?.unit?.unit_of_purchase?.name
            ? data?.unit?.unit_of_purchase?.name
            : "",
          unitOfCountName: data?.unit?.unit_of_count?.name
            ? data?.unit?.unit_of_count?.name
            : "",
          unitOfPackageName: data?.unit?.unit_of_package?.name
            ? data?.unit?.unit_of_package?.name
            : "",
          unitOfSellName: data?.unit?.unit_of_sell?.name
            ? data?.unit?.unit_of_sell?.name
            : "",
          unitOfAssemblyName: data?.unit?.unit_of_assembly?.name
            ? data?.unit?.unit_of_assembly?.name
            : "",

          unitOfStock: data?.unit?.unit_of_stock?.uuid
            ? data?.unit?.unit_of_stock?.uuid
            : "",
          unitOfOrder: data?.unit?.unit_of_order?.uuid
            ? data?.unit?.unit_of_order?.uuid
            : "",
          unitOfPurchase: data?.unit?.unit_of_purchase?.uuid
            ? data?.unit?.unit_of_purchase?.uuid
            : "",
          unitOfCount: data?.unit?.unit_of_count?.uuid
            ? data?.unit?.unit_of_count?.uuid
            : "",
          unitOfPackage: data?.unit?.unit_of_package?.uuid
            ? data?.unit?.unit_of_package?.uuid
            : "",
          unitOfSell: data?.unit?.unit_of_sell?.uuid
            ? data?.unit?.unit_of_sell?.uuid
            : "",
          unitOfAssembly: data?.unit?.unit_of_assembly?.uuid
            ? data?.unit?.unit_of_assembly?.uuid
            : "",

          varUnit1Name: data?.unit?.variable_unit1?.name
            ? data?.unit?.variable_unit1?.name
            : "",
          convertUnit1Name: data?.unit?.convert_to_unit1?.name
            ? data?.unit?.convert_to_unit1?.name
            : "",
          varUnit2Name: data?.unit?.variable_unit2?.name
            ? data?.unit?.variable_unit2?.name
            : "",
          convertUnit2Name: data?.unit?.convert_to_unit2?.name
            ? data?.unit?.convert_to_unit2?.name
            : "",
          convertUnit3Name: data?.unit?.convert_to_unit3?.name
            ? data?.unit?.convert_to_unit3?.name
            : "",

          varUnit1: data?.unit?.variable_unit1?.uuid
            ? data?.unit?.variable_unit1?.uuid
            : "",
          convertUnit1: data?.unit?.convert_to_unit1?.uuid
            ? data?.unit?.convert_to_unit1?.uuid
            : "",
          unit1Multiplier: data?.unit?.unit1_multiplier
            ? data?.unit?.unit1_multiplier
            : "",
          varUnit2: data?.unit?.variable_unit2?.uuid
            ? data?.unit?.variable_unit2?.uuid
            : "",
          convertUnit2: data?.unit?.convert_to_unit2?.uuid
            ? data?.unit?.convert_to_unit2?.uuid
            : "",
          unit2Multiplier: data?.unit?.unit2_multiplier
            ? data?.unit?.unit2_multiplier
            : "",
          itemGrossWeight: data?.unit?.item_gross_weight
            ? data?.unit?.item_gross_weight
            : "",
          convertUnit3: data?.unit?.convert_to_unit3?.uuid
            ? data?.unit?.convert_to_unit3?.uuid
            : "",
          unit3Multiplier: data?.unit?.unit3_multiplier
            ? data?.unit?.unit3_multiplier
            : "",

          parLevelUnitName: data?.shipping?.par_level_unit?.name
            ? data?.shipping?.par_level_unit?.name
            : "",
          safetyStockUnitName: data?.shipping?.safety_stock_unit?.name
            ? data?.shipping?.safety_stock_unit?.name
            : "",

          palletTie: data?.shipping?.pallet_tie
            ? data?.shipping?.pallet_tie
            : "",
          kitParentCost: data?.shipping?.kit_parent_cost
            ? data?.shipping?.kit_parent_cost
            : "",
          safetyStock: data?.shipping?.safety_stock
            ? data?.shipping?.safety_stock
            : "",
          global: data?.shipping?.is_global ? data?.shipping?.is_global : 0,
          shelveDays: data?.shipping?.shelve_life
            ? data?.shipping?.shelve_life
            : "",
          safetyStockUnit: data?.shipping?.safety_stock_unit?.uuid
            ? data?.shipping?.safety_stock_unit?.uuid
            : "",
          kitParent: data?.shipping?.is_kit_parent
            ? data?.shipping?.is_kit_parent
            : 0,
          parLevel: data?.shipping?.par_level ? data?.shipping?.par_level : "",
          highRisk: data?.shipping?.is_high_risk
            ? data?.shipping?.is_high_risk
            : 0,
          parLevelUnit: data?.shipping?.par_level_unit?.uuid
            ? data?.shipping?.par_level_unit?.uuid
            : "",
          minBlendAmount: data?.shipping?.minimum_blend_amount
            ? data?.shipping?.minimum_blend_amount
            : "",
          costItem: data?.shipping?.cost_item ? data?.shipping?.cost_item : 0,

          allergens: data?.allergens
            ? data?.allergens?.map((allergens) => allergens)
            : [],

          facilities: data?.facilities
            ? data?.facilities?.map((facility) => facility)
            : [],
        });
        setIsDisabled(true);
      })
      .catch((error) => {
        console.log("🚀 ~ file: AddNewProduct.js ~ line 35 ~ error", error);
      });
  };

  // To Capture Form onChange
  const handleOnChange = (e) => {
    var days = /^(?!(0))[0-9]{0,3}$/;
    var amount = /^(?!(0))[0-9]{0,9}$/;
    var numbers = /^([0-9+]*[.])?[0-9]{0,9}$/;
    if (
      e.target.name === "upc" ||
      e.target.name === "itemGrossWeight" ||
      e.target.name === "unit1Multiplier" ||
      e.target.name === "unit2Multiplier" ||
      e.target.name === "unit3Multiplier" ||
      e.target.name === "kitParentCost" ||
      e.target.name === "parLevel" ||
      e.target.name === "safetyStock"
    ) {
      if (numbers.test(e.target.value)) {
        setProductData({
          ...productData,
          [e.target.name]: e.target.value,
        });
        setIsEmpty({
          ...isEmpty,
          [e.target.name]: false,
        });
      }
    } else if (e.target.name === "shelveDays") {
      if (days.test(e.target.value)) {
        setProductData({
          ...productData,
          [e.target.name]: e.target.value,
        });
      }
    } else if (
      e.target.name === "palletTie" ||
      e.target.name === "minBlendAmount"
    ) {
      if (amount.test(e.target.value)) {
        setProductData({
          ...productData,
          [e.target.name]: e.target.value,
        });
      }
    } else {
      setProductData({
        ...productData,
        [e.target.name]: e.target.value,
      });

      setIsEmpty({
        ...isEmpty,
        [e.target.name]: false,
      });
    }
  };

  // Dropdown value onChange
  const handleDropdownOnChange = (e) => {
    if (e.target.name === "customerId") {
      setProductData({
        ...productData,
        facilities: [],
        customerCode: dependenciesArray?.customers?.map((item) => {
          if (item.uuid === e.target.value) {
            getFacilitiesList(item);
            return item.code;
          }
        }),
        [e.target.name]: e.target.value,
      });
    }

    if (e.target.name === "categoryId") {
      setProductData({
        ...productData,
        categoryName: dependenciesArray?.categories?.map((item) => {
          if (item.uuid === e.target.value) {
            return item.name;
          }
        }),
        [e.target.name]: e.target.value,
      });
    }

    if (e.target.name === "unitOfStock") {
      setProductData({
        ...productData,
        unitOfStockName: dependenciesArray?.unit_types[0]?.units?.map(
          (item) => {
            if (item.uuid === e.target.value) {
              return item.name;
            }
          }
        ),
        [e.target.name]: e.target.value,
      });
    }

    if (e.target.name === "unitOfCount") {
      setProductData({
        ...productData,
        unitOfCountName: dependenciesArray?.unit_types[1]?.units?.map(
          (item) => {
            if (item.uuid === e.target.value) {
              return item.name;
            }
          }
        ),
        [e.target.name]: e.target.value,
      });
    }

    if (e.target.name === "unitOfSell") {
      setProductData({
        ...productData,
        unitOfSellName: dependenciesArray?.unit_types[1]?.units?.map((item) => {
          if (item.uuid === e.target.value) {
            return item.name;
          }
        }),
        [e.target.name]: e.target.value,
      });
    }

    if (e.target.name === "unitOfOrder") {
      setProductData({
        ...productData,
        unitOfOrderName: dependenciesArray?.unit_types[1]?.units?.map(
          (item) => {
            if (item.uuid === e.target.value) {
              return item.name;
            }
          }
        ),
        [e.target.name]: e.target.value,
      });
    }

    if (e.target.name === "unitOfPackage") {
      setProductData({
        ...productData,
        unitOfPackageName: dependenciesArray?.unit_types[1]?.units?.map(
          (item) => {
            if (item.uuid === e.target.value) {
              return item.name;
            }
          }
        ),
        [e.target.name]: e.target.value,
      });
    }

    if (e.target.name === "unitOfAssembly") {
      setProductData({
        ...productData,
        unitOfAssemblyName: dependenciesArray?.unit_types[1]?.units?.map(
          (item) => {
            if (item.uuid === e.target.value) {
              return item.name;
            }
          }
        ),
        [e.target.name]: e.target.value,
      });
    }

    if (e.target.name === "unitOfPurchase") {
      setProductData({
        ...productData,
        unitOfPurchaseName: dependenciesArray?.unit_types[1]?.units?.map(
          (item) => {
            if (item.uuid === e.target.value) {
              return item.name;
            }
          }
        ),
        [e.target.name]: e.target.value,
      });
    }

    if (e.target.name === "varUnit1") {
      setProductData({
        ...productData,
        varUnit1Name: dependenciesArray?.unit_types[1]?.units?.map((item) => {
          if (item.uuid === e.target.value) {
            return item.name;
          }
        }),
        [e.target.name]: e.target.value,
      });
    }

    if (e.target.name === "varUnit2") {
      setProductData({
        ...productData,
        varUnit2Name: dependenciesArray?.unit_types[1]?.units?.map((item) => {
          if (item.uuid === e.target.value) {
            return item.name;
          }
        }),
        [e.target.name]: e.target.value,
      });
    }

    if (e.target.name === "convertUnit1") {
      setProductData({
        ...productData,
        convertUnit1Name: dependenciesArray?.unit_types[1]?.units?.map(
          (item) => {
            if (item.uuid === e.target.value) {
              return item.name;
            }
          }
        ),
        [e.target.name]: e.target.value,
      });
    }

    if (e.target.name === "convertUnit2") {
      setProductData({
        ...productData,
        convertUnit2Name: dependenciesArray?.unit_types[1]?.units?.map(
          (item) => {
            if (item.uuid === e.target.value) {
              return item.name;
            }
          }
        ),
        [e.target.name]: e.target.value,
      });
    }

    if (e.target.name === "convertUnit3") {
      setProductData({
        ...productData,
        convertUnit3Name: dependenciesArray?.unit_types[1]?.units?.map(
          (item) => {
            if (item.uuid === e.target.value) {
              return item.name;
            }
          }
        ),
        [e.target.name]: e.target.value,
      });
    }

    if (e.target.name === "parLevelUnit") {
      setProductData({
        ...productData,
        parLevelUnitName: dependenciesArray?.unit_types[1]?.units?.map(
          (item) => {
            if (item.uuid === e.target.value) {
              return item.name;
            }
          }
        ),
        [e.target.name]: e.target.value,
      });
    }

    if (e.target.name === "safetyStockUnit") {
      setProductData({
        ...productData,
        safetyStockUnitName: dependenciesArray?.unit_types[1]?.units?.map(
          (item) => {
            if (item.uuid === e.target.value) {
              return item.name;
            }
          }
        ),
        [e.target.name]: e.target.value,
      });
    }

    setIsEmpty({
      ...isEmpty,
      [e.target.name]: false,
    });
  };

  //handle multi change customers
  const handleMultiChange = (event, newValue) => {
    setProductData({ ...productData, facilities: newValue });
  };

  const handleMultiOnChange = (event, newValue) => {
    setProductData({ ...productData, allergens: newValue });
  };

  // OnClick Add Product / Edit Product Button
  const onPressAddOrEditProduct = () => {
    // For Add New Product from Basic Information
    if (!id) {
      setLoading(true);
      console.log(
        "%cFrom Add Product",
        "color: green; font-family:sans-serif; font-size: 20px; font-weight: 700"
      );
      addNewProductPress();
    }

    // For Edit Existing Product from Basic Information
    if (id) {
      setLoading(true);
      console.log(
        "%cFrom Edit Product",
        "color: green; font-family:sans-serif; font-size: 20px; font-weight: 700"
      );
      editProductPress();
    }
  };

  // OnClick from Add New Customer Screen => Add Customer Button
  const addNewProductPress = () => {
    if (!isProductDetailsEmpty()) {
      let payload = createPayload();
      console.log("🚀 ~ file: AddNewProduct.js ~ line 395 ~ payload", payload);

      addProduct(payload)
        .then((res) => {
          navigate("/inventory/products");
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          setAlertModal(true);
          setErrorMsg({
            type: "error",
            title: "Error",
            msg: err.response.data.message,
          });
        });
    } else {
      setLoading(false);
    }
  };
  // OnClick from Add New Customer Screen For Editing the Existing Customer => Edit Customer Button
  const editProductPress = () => {
    if (!isProductDetailsEmpty()) {
      let payload = createPayload();
      payload = {
        ...payload,
        uuid: state?.product?.uuid,
      };

      updateProduct(payload)
        .then((res) => {
          navigate("/inventory/products");
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          setAlertModal(true);
          setErrorMsg({
            type: "error",
            title: "Error",
            msg: err.response.data.message,
          });
        });
    } else {
      setLoading(false);
    }
  };
  // For Validating Input Fields => Not Empty Check
  const isProductDetailsEmpty = () => {
    if (productData.customerId === "") {
      setIsEmpty({ ...isEmpty, customerId: true });
      return true;
    } else if (productData.itemDesc === "") {
      setIsEmpty({ ...isEmpty, itemDesc: true });
      return true;
    } else if (productData.categoryId === "") {
      setIsEmpty({ ...isEmpty, categoryId: true });
      return true;
    } else if (productData.itemName === "") {
      setIsEmpty({ ...isEmpty, itemName: true });
      return true;
    } else if (productData.barCode === "") {
      setIsEmpty({ ...isEmpty, barCode: true });
      return true;
    } else if (productData.unitOfStock === "") {
      setIsEmpty({ ...isEmpty, unitOfStock: true });
      return true;
    } else if (productData.unitOfOrder === "") {
      setIsEmpty({ ...isEmpty, unitOfOrder: true });
      return true;
    } else if (productData.unitOfCount === "") {
      setIsEmpty({ ...isEmpty, unitOfCount: true });
      return true;
    } else if (productData.unitOfPackage === "") {
      setIsEmpty({ ...isEmpty, unitOfPackage: true });
      return true;
    } else if (productData.unitOfSell === "") {
      setIsEmpty({ ...isEmpty, unitOfSell: true });
      return true;
    } else if (productData.convertUnit1 === "") {
      setIsEmpty({ ...isEmpty, convertUnit1: true });
      return true;
    } else if (productData.unit1Multiplier === "") {
      setIsEmpty({ ...isEmpty, unit1Multiplier: true });
      return true;
    } else if (productData.convertUnit2 === "") {
      setIsEmpty({ ...isEmpty, convertUnit2: true });
      return true;
    } else if (productData.unit2Multiplier === "") {
      setIsEmpty({ ...isEmpty, unit2Multiplier: true });
      return true;
    } else if (productData.itemGrossWeight === "") {
      setIsEmpty({ ...isEmpty, itemGrossWeight: true });
      return true;
    } else if (productData.unit3Multiplier === "") {
      setIsEmpty({ ...isEmpty, unit3Multiplier: true });
      return true;
    } else {
      return false;
    }
  };
  // For Creating Payload
  const createPayload = () => {
    let allergensArray = productData?.allergens?.map((item) => {
      return item.uuid;
    });

    let facilitiesArray = productData?.facilities?.map((item) => {
      return item.uuid;
    });

    let payload = {
      customer_id: productData?.customerId,
      category_id: productData?.categoryId,
      name: productData?.itemName,
      description: productData?.itemDesc,
      internal_name: productData?.itemNameInternal,
      internal_description: productData?.itemDescInternal,
      barcode: productData?.barCode,
      universal_product_code: productData?.upc,
      status: productData?.status,

      unit_of_stock: productData?.unitOfStock,
      unit_of_order: productData?.unitOfOrder,
      unit_of_count: productData?.unitOfCount,
      unit_of_package: productData?.unitOfPackage,
      unit_of_sell: productData?.unitOfSell,
      unit_of_assembly: productData?.unitOfAssembly,
      unit_of_purchase: productData?.unitOfPurchase,
      variable_unit1: productData?.varUnit1,
      variable_unit2: productData?.varUnit2,
      convert_to_unit1: productData?.convertUnit1,
      convert_to_unit2: productData?.convertUnit2,
      convert_to_unit3: productData?.convertUnit3,
      unit1_multiplier: productData?.unit1Multiplier,
      unit2_multiplier: productData?.unit2Multiplier,
      unit3_multiplier: productData?.unit3Multiplier,
      item_gross_weight: productData?.itemGrossWeight,

      pallet_tie: productData?.palletTie === "" ? 0 : productData?.palletTie,
      kit_parent_cost:
        productData?.kitParentCost === "" ? 0 : productData?.kitParentCost,
      shelve_life: productData?.shelveDays === "" ? 0 : productData?.shelveDays,
      safety_stock:
        productData?.safetyStock === "" ? 0 : productData?.safetyStock,
      safety_stock_unit: productData?.safetyStockUnit,
      par_level: productData?.parLevel,
      par_level_unit: productData?.parLevelUnit,
      minimum_blend_amount:
        productData?.minBlendAmount === "" ? 0 : productData?.minBlendAmount,
      is_global: productData?.global,
      is_kit_parent: productData?.kitParent,
      is_high_risk: productData?.highRisk,
      cost_item: productData?.costItem,

      allergen_ids: allergensArray,
      facility_ids: facilitiesArray,
    };
    return payload;
  };
  // OnClick Delete User
  const handleDelete = () => {
    setDeleteLoading(true);
    let uuid = state?.product?.uuid;

    deleteProduct({ ids: [uuid] })
      .then((res) => {
        setDeleteLoading(false);
        navigate("/inventory/products");
      })
      .catch((error) => {
        setDeleteLoading(false);
        if (error?.response?.data) {
          setIsError(error?.response?.data?.errors?.ids);
        }
        if (error?.response?.data?.message) {
          setIsError(error?.response?.data?.message);
        }
      });
  };

  // Print BarCode
  const print = () => {
    var mywindow = window.open("", "PRINT", "");

    mywindow.document.write(
      "<html><head><title>" + document.title + "</title>"
    );
    mywindow.document.write("</head><body >");
    mywindow.document.write(
      document.getElementById("section-to-print-add").innerHTML
    );
    mywindow.document.write("</body></html>");

    // mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();

    return true;
  };

  useOnClickOutside(ref, () => setChangeAllergensHeight(false));

  // Button Component View
  const Buttons = () => {
    return (
      <div
        className={`d-flex ${
          id && !facilityUser
            ? "justify-content-between"
            : "justify-content-end"
        } bg-white overflow-auto mt-[20px] py-[20px] border-t border-lightGray`}>
        {id && !facilityUser && (
          <div className="mx-4">
            <Button
              size="medium"
              className="capitalize mr-[20px] "
              component="span"
              variant="outlined"
              color="danger"
              onClick={() => setIsDelete(!isDelete)}>
              Delete Product
            </Button>
          </div>
        )}
        <div className="buttons d-flex">
          <Button
            size="medium"
            className="capitalize mr-[10px] w-[100px]"
            component="span"
            variant="outlined"
            color="secondary"
            disabled={loading || deleteLoading}
            onClick={() => navigate("/inventory/products")}>
            Cancel
          </Button>
          <div
            className={` mr-[20px] ${
              isDisabled ? "cursor-not-allowed" : "cursor-pointer"
            }`}>
            <Button
              size="medium"
              className="capitalize w-[130px]"
              component="span"
              color="primary"
              variant="contained"
              onClick={onPressAddOrEditProduct}
              loading={loading}
              disabled={isDisabled}>
              {id ? "Save" : "Add Product"}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    setIsDisabled(false);
  }, [productData]);

  return (
    <div className="bg-bgGray h-[100%] min-w-[300px]">
      <CustomModal
        open={alertModal}
        close={() => setAlertModal(!alertModal)}
        width={window.innerWidth * 0.4}>
        <div>
          <div className="d-flex flex-row justify-content-between align-items-center">
            <div className="d-flex flex-row justify-content-between align-items-center text-center">
              <div className="pointer">
                  <Error
                    className="mx-3 mb-1"
                    color="danger"
                    fontSize="small"
                  />
              </div>
              {errorObj.title}
            </div>
            <div
              className="pointer mx-3"
              onClick={() => setAlertModal(!alertModal)}>
              <ClearIcon color="secondary" fontSize="small" />
            </div>
          </div>
          {errorObj.type === "error" ? (
            <div className="my-3">
              <Typography
                className="d-flex flex-row align-items-center px-3 "
                variant="body1"
                fontSize={15}
                marginBottom={1}
                marginTop={3}
                marginLeft={3}
                fontWeight="normal">
                {errorObj.msg}
              </Typography>
              <div className="d-flex flex-row justify-content-end align-items-center mx-3 mt-4 mb-2">
                <Button
                  className="capitalize mr-[10px]"
                  component="span"
                  variant="outlined"
                  color="secondary"
                  onClick={() => setAlertModal(false)}>
                  {"Ok"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="my-3">
                <div className="border bg-danger/20 rounded mx-3 border-light">
                <Typography
                  className="d-flex flex-row align-items-center p-3"
                  variant="body1"
                  color={danger}
                  fontSize={15}
                  fontWeight="light">
                  The product is used in the active kit. The product must be
                  removed from the kit before you can delete this product
                </Typography>
              </div>
              <div className="d-flex flex-row justify-content-end align-items-center mx-3 mt-4 mb-2">
                <Button
                  className="capitalize mr-[10px]"
                  component="span"
                  variant="outlined"
                  color="secondary"
                  onClick={() => setAlertModal(false)}>
                  { "Ok"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </CustomModal>

      {/* Custom Modal For Delete  */}

      <SimpleDeleteModal
        states={{
          open: isDelete,
          setOpen: setIsDelete,
          errorMsg: isError,
          setErrorMsg: setIsError,
          headTitle: "Delete Product",
          deleteName: specificProduct?.name,
          loading: deleteLoading,
          deleteMethod: () => handleDelete(specificProduct?.uuid, setDeleteLoading),
        }}
      />


      {/* BreadCrumbs View */}
      <div className="d-flex flex-row justify-content-between align-items-center p-3 bg-white border-bottom">
        <div>
          <BreadCrumb
            routes={[
              { name: "Inventory", route: "/inventory/products", color: true },
              { name: "Products", route: "/inventory/products", color: true },
              { name: id ? state?.product?.name : "Add New Product" },
            ]}
          />
          {id ? (
            <div>
              <Edit className="mb-1" color="primary" />{" "}
              {`Edit: ${state?.product?.name}`}
            </div>
          ) : (
            <div>
              <Add className="mb-1" color="primary" />
              Add New Product
            </div>
          )}
        </div>
      </div>

      {/* Add Product Form View Start */}
      {loadingList ? (
        <Spinner />
      ) : (
        <div className="flex flex-col justify-between pt-[20px]">
          {/* Basic Info View */}
          <div className="border rounded bg-white pb-3 mx-4">
            <h6 className="px-3 py-3">Basic Info</h6>
            <form className="px-3">
              <div className="row">
                <div className="form-group col-md-4">
                  <div className="form-row mb-3">
                    {facilityUser ? (
                      <TextField
                        fullWidth
                        size="small"
                        label="Customer Code"
                        name="customerCode"
                        value={productData.customerCode}
                        disabled
                      />
                    ) : (
                      <MaterialDropDown
                        multiple={false}
                        options={dependenciesArray?.customers}
                        label="Customer Code"
                        name="customerId"
                        value={productData.customerId}
                        userRoleToShow={productData.customerCode}
                        withRenderValue
                        onChange={handleDropdownOnChange}
                        fullWidth
                        error={isEmpty.customerId ? true : false}
                      />
                    )}
                  </div>
                  <div className="form-row mb-3">
                    <TextField
                      fullWidth
                      size="small"
                      label="Item Name"
                      name="itemName"
                      value={productData.itemName}
                      helperText={
                        isEmpty.itemName ? "Item Name is required" : ""
                      }
                      error={isEmpty.itemName ? true : false}
                      onChange={handleOnChange}
                    />
                  </div>
                  <div className="form-row mb-3">
                    <TextField
                      fullWidth
                      size="small"
                      label="Item Name (Internal)"
                      name="itemNameInternal"
                      value={productData.itemNameInternal}
                      onChange={handleOnChange}
                    />
                  </div>
                </div>

                <div className="form-group col-md-4">
                  <div className="form-row mb-3">
                    <TextField
                      fullWidth
                      size="small"
                      label="Item Description"
                      name="itemDesc"
                      value={productData.itemDesc}
                      helperText={
                        isEmpty.itemDesc ? "Item Description is required" : ""
                      }
                      error={isEmpty.itemDesc ? true : false}
                      onChange={handleOnChange}
                    />
                  </div>
                  <div className="form-row mb-3">
                    <TextField
                      fullWidth
                      size="small"
                      label="Item Description (Internal)"
                      name="itemDescInternal"
                      value={productData.itemDescInternal}
                      onChange={handleOnChange}
                    />
                  </div>
                  <div className="form-row mb-3">
                    <TextField
                      fullWidth
                      size="small"
                      label="UPC"
                      name="upc"
                      value={productData.upc}
                      onChange={handleOnChange}
                    />
                  </div>
                </div>

                <div className="form-group col-md-4">
                  <div className="form-row mb-3">
                    <MaterialDropDown
                      multiple={false}
                      options={dependenciesArray?.categories}
                      label="Item Category"
                      name="categoryId"
                      value={productData.categoryId}
                      userRoleToShow={productData.categoryName}
                      withRenderValue
                      onChange={handleDropdownOnChange}
                      fullWidth
                      error={isEmpty.categoryId ? true : false}
                    />
                  </div>
                  {id ? (
                    <>
                      <div className="form-row mb-3">
                        <TextField
                          fullWidth
                          size="small"
                          label="Bar Code"
                          name="barCode"
                          value={productData.barCode}
                          helperText={
                            isEmpty.barCode ? "Bar Code is required" : ""
                          }
                          error={isEmpty.barCode ? true : false}
                          onChange={handleOnChange}
                        />
                      </div>

                      <div className="row flex flex-row justify-between items-center">
                        <div className="form-row w-1/2">
                          <div className="text-[13px]">Active Status</div>
                          <div className="text-[13px] -ml-[12px] -mt-[5px]">
                            <Switch
                              checked={productData.status === 1 ? true : false}
                              onChange={(event) => {
                                setProductData({
                                  ...productData,
                                  status: event.target.checked ? 1 : 0,
                                });
                              }}
                              value={productData.status}
                            />
                            {productData.status ? "Active" : "Inactive"}
                          </div>
                        </div>
                        <div className="form-row w-1/2">
                          <div className="flex items-center mt-[5px]">
                            <div className="-ml-6" onClick={() => print()}>
                              <PrintIcon
                                className="cursor-pointer"
                                color="secondary"
                                fontSize="large"
                              />
                            </div>
                            <div className="text-[12px] ml-[5px]">
                              Print Bar Code
                            </div>
                          </div>

                          <div
                            id="section-to-print-add"
                            className="flex flex-col justify-content-between align-items-center rounded-lg ">
                            <p className="mt-2 px-2">{productData?.itemDesc}</p>
                            <Barcode
                              height="40px"
                              width="1"
                              value={productData?.barCode}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="form-row mb-3">
                        <TextField
                          fullWidth
                          size="small"
                          label="Bar Code"
                          name="barCode"
                          value={productData?.barCode}
                          helperText={
                            isEmpty.barCode ? "Bar Code is required" : ""
                          }
                          error={isEmpty.barCode ? true : false}
                          onChange={handleOnChange}
                        />
                      </div>

                      <div className="form-row mb-3">
                        <div className="text-[13px]">Active Status</div>
                        <div className="text-[13px] -ml-[12px] -mt-[5px]">
                          <Switch
                            checked={productData.status === 1 ? true : false}
                            onChange={(event) => {
                              setProductData({
                                ...productData,
                                status: event.target.checked ? 1 : 0,
                              });
                            }}
                            value={productData.status}
                          />
                          {productData.status ? "Active" : "Inactive"}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="form-row col-md-8">
                  <MultiDropDown
                    multiple={true}
                    placeholder={"Facilities"}
                    optionsArray={dependenciesArray?.facilities}
                    value={productData?.facilities}
                    disabled={facilityUser ? true : false}
                    onChange={handleMultiChange}
                  />
                  {loadFacility ? (
                    <p className=" ml-2 text-[12px] text-success mt-1">
                      Loading...
                    </p>
                  ) : !productData?.customerCode ? (
                    <p className="text-[12px] text-danger mt-1">
                      Please Select Customer First
                    </p>
                  ) : productData?.customerCode &&
                    !dependenciesArray?.facilities.length ? (
                    <p className="text-[12px] text-danger mt-1">
                      Note: This Customer is not added in any Facility
                    </p>
                  ) : null}
                </div>
              </div>
            </form>
          </div>

          {/* Units View */}
          <div className="border rounded bg-white pb-0.5 mt-3 mx-4">
            <h6 className="px-3 py-3">Units</h6>
            <form className="px-3">
              <div className="row">
                <div className="form-group col-md-4">
                  <div className="form-row mb-3">
                    <MaterialDropDown
                      fullWidth
                      withRenderValue
                      multiple={false}
                      label="Unit of Stock"
                      name="unitOfStock"
                      value={productData.unitOfStock}
                      userRoleToShow={productData.unitOfStockName}
                      options={
                        dependenciesArray?.unit_types[0]?.units?.length > 0
                          ? dependenciesArray?.unit_types[0]?.units
                          : []
                      }
                      onChange={handleDropdownOnChange}
                      error={isEmpty.unitOfStock ? true : false}
                    />
                  </div>
                  <div className="form-row mb-3">
                    <MaterialDropDown
                      fullWidth
                      withRenderValue
                      multiple={false}
                      label="Unit of Count"
                      name="unitOfCount"
                      value={productData.unitOfCount}
                      userRoleToShow={productData.unitOfCountName}
                      options={
                        dependenciesArray?.unit_types[1]?.units?.length > 0
                          ? dependenciesArray?.unit_types[1]?.units
                          : []
                      }
                      onChange={handleDropdownOnChange}
                      error={isEmpty.unitOfCount ? true : false}
                    />
                  </div>
                  <div className="form-row mb-3">
                    <MaterialDropDown
                      fullWidth
                      withRenderValue
                      multiple={false}
                      label="Unit of Sell"
                      name="unitOfSell"
                      value={productData.unitOfSell}
                      userRoleToShow={productData.unitOfSellName}
                      options={
                        dependenciesArray?.unit_types[1]?.units?.length > 0
                          ? dependenciesArray?.unit_types[1]?.units
                          : []
                      }
                      onChange={handleDropdownOnChange}
                      error={isEmpty.unitOfSell ? true : false}
                    />
                  </div>
                </div>

                <div className="form-group col-md-4">
                  <div className="form-row mb-3">
                    <MaterialDropDown
                      fullWidth
                      withRenderValue
                      multiple={false}
                      label="Unit of Order"
                      name="unitOfOrder"
                      value={productData.unitOfOrder}
                      userRoleToShow={productData.unitOfOrderName}
                      options={
                        dependenciesArray?.unit_types[1]?.units?.length > 0
                          ? dependenciesArray?.unit_types[1]?.units
                          : []
                      }
                      onChange={handleDropdownOnChange}
                      error={isEmpty.unitOfOrder ? true : false}
                    />
                  </div>
                  <div className="form-row mb-3">
                    <MaterialDropDown
                      fullWidth
                      withRenderValue
                      multiple={false}
                      label="Unit of Package"
                      name="unitOfPackage"
                      value={productData.unitOfPackage}
                      userRoleToShow={productData.unitOfPackageName}
                      options={
                        dependenciesArray?.unit_types[1]?.units?.length > 0
                          ? dependenciesArray?.unit_types[1]?.units
                          : []
                      }
                      onChange={handleDropdownOnChange}
                      error={isEmpty.unitOfPackage ? true : false}
                    />
                  </div>
                  <div className="form-row mb-3">
                    <MaterialDropDown
                      fullWidth
                      withRenderValue
                      multiple={false}
                      label="Unit of Assembly"
                      name="unitOfAssembly"
                      value={productData.unitOfAssembly}
                      userRoleToShow={productData.unitOfAssemblyName}
                      options={
                        dependenciesArray?.unit_types[1]?.units?.length > 0
                          ? dependenciesArray?.unit_types[1]?.units
                          : []
                      }
                      onChange={handleDropdownOnChange}
                    />
                  </div>
                </div>

                <div className="form-group col-md-4">
                  <div className="form-row mb-3">
                    <MaterialDropDown
                      fullWidth
                      withRenderValue
                      multiple={false}
                      label="Unit of Purchase"
                      name="unitOfPurchase"
                      value={productData.unitOfPurchase}
                      userRoleToShow={productData.unitOfPurchaseName}
                      options={
                        dependenciesArray?.unit_types[1]?.units?.length > 0
                          ? dependenciesArray?.unit_types[1]?.units
                          : []
                      }
                      onChange={handleDropdownOnChange}
                    />
                  </div>
                </div>
              </div>
            </form>

            <h6 className="px-3 mb-4 mt-3 text-sm">Variable Weight Item</h6>
            <form className="px-3">
              <div className="row">
                <div className="form-group col-md-4">
                  <div className="form-row mb-3">
                    <MaterialDropDown
                      fullWidth
                      withRenderValue
                      multiple={false}
                      label="Variable Unit 1"
                      name="varUnit1"
                      value={productData.varUnit1}
                      userRoleToShow={productData.varUnit1Name}
                      options={
                        dependenciesArray?.unit_types[1]?.units?.length > 0
                          ? dependenciesArray?.unit_types[1]?.units
                          : []
                      }
                      onChange={handleDropdownOnChange}
                    />
                  </div>
                  <div className="form-row mb-3">
                    <MaterialDropDown
                      fullWidth
                      withRenderValue
                      multiple={false}
                      label="Variable Unit 2"
                      name="varUnit2"
                      value={productData.varUnit2}
                      userRoleToShow={productData.varUnit2Name}
                      options={
                        dependenciesArray?.unit_types[1]?.units?.length > 0
                          ? dependenciesArray?.unit_types[1]?.units
                          : []
                      }
                      onChange={handleDropdownOnChange}
                    />
                  </div>
                  <div className="form-row mb-3">
                    <TextField
                      fullWidth
                      size="small"
                      label="Item Gross Weight"
                      name="itemGrossWeight"
                      value={productData.itemGrossWeight}
                      helperText={
                        isEmpty.itemGrossWeight
                          ? "Item Gross Weight is required"
                          : ""
                      }
                      error={isEmpty.itemGrossWeight ? true : false}
                      onChange={handleOnChange}
                    />
                  </div>
                </div>

                <div className="form-group col-md-4">
                  <div className="form-row mb-3">
                    <MaterialDropDown
                      fullWidth
                      withRenderValue
                      multiple={false}
                      label="Convert to Unit 1"
                      name="convertUnit1"
                      value={productData.convertUnit1}
                      userRoleToShow={productData.convertUnit1Name}
                      options={
                        dependenciesArray?.unit_types[1]?.units?.length > 0
                          ? dependenciesArray?.unit_types[1]?.units
                          : []
                      }
                      onChange={handleDropdownOnChange}
                      error={isEmpty.convertUnit1 ? true : false}
                    />
                  </div>
                  <div className="form-row mb-3">
                    <MaterialDropDown
                      fullWidth
                      withRenderValue
                      multiple={false}
                      label="Convert to Unit 2"
                      name="convertUnit2"
                      value={productData.convertUnit2}
                      userRoleToShow={productData.convertUnit2Name}
                      options={
                        dependenciesArray?.unit_types[1]?.units?.length > 0
                          ? dependenciesArray?.unit_types[1]?.units
                          : []
                      }
                      onChange={handleDropdownOnChange}
                      error={isEmpty.convertUnit2 ? true : false}
                    />
                  </div>
                  <div className="form-row mb-3">
                    <MaterialDropDown
                      fullWidth
                      withRenderValue
                      multiple={false}
                      label="Convert to Unit 3"
                      name="convertUnit3"
                      value={productData.convertUnit3}
                      userRoleToShow={productData.convertUnit3Name}
                      options={
                        dependenciesArray?.unit_types[1]?.units?.length > 0
                          ? dependenciesArray?.unit_types[1]?.units
                          : []
                      }
                      onChange={handleDropdownOnChange}
                    />
                  </div>
                </div>

                <div className="form-group col-md-4">
                  <div className="form-row mb-3">
                    <TextField
                      fullWidth
                      size="small"
                      label="Unit 1 Multiplier"
                      name="unit1Multiplier"
                      value={productData.unit1Multiplier}
                      helperText={
                        isEmpty.unit1Multiplier
                          ? "Unit 1 Multiplier is required"
                          : ""
                      }
                      error={isEmpty.unit1Multiplier ? true : false}
                      onChange={handleOnChange}
                    />
                  </div>
                  <div className="form-row mb-3">
                    <TextField
                      fullWidth
                      size="small"
                      label="Unit 2 Multiplier"
                      name="unit2Multiplier"
                      value={productData.unit2Multiplier}
                      helperText={
                        isEmpty.unit2Multiplier
                          ? "Unit 2 Multiplier is required"
                          : ""
                      }
                      error={isEmpty.unit2Multiplier ? true : false}
                      onChange={handleOnChange}
                    />
                  </div>
                  <div className="form-row mb-3">
                    <TextField
                      fullWidth
                      size="small"
                      label="Unit 3 Multiplier"
                      name="unit3Multiplier"
                      value={productData.unit3Multiplier}
                      helperText={
                        isEmpty.unit3Multiplier
                          ? "Unit 3 Multiplier is required"
                          : ""
                      }
                      error={isEmpty.unit3Multiplier ? true : false}
                      onChange={handleOnChange}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Shipping View */}
          <div className="border rounded bg-white pb-0.5 mt-3 mx-4">
            <h6 className="px-3 py-3">Shipping</h6>
            <form className="px-3">
              <div className="row">
                <div className="form-group col-md-4">
                  <div className="form-row mb-3">
                    <TextField
                      fullWidth
                      size="small"
                      label="Pallet Tie"
                      name="palletTie"
                      value={productData.palletTie}
                      onChange={handleOnChange}
                    />
                  </div>
                  <div className="form-row mb-3">
                    <div className="border rounded col-12 row ml-0">
                      <div className="border-bottom flex flex-row justify-between h-10">
                        <p className="mt-2">Global</p>
                        <Switch
                          checked={productData.global === 1 ? true : false}
                          onChange={(event) => {
                            setProductData({
                              ...productData,
                              global: event.target.checked ? 1 : 0,
                            });
                          }}
                          value={productData.global}
                        />
                      </div>
                      <div className="border-bottom flex flex-row justify-between h-10">
                        <p className="mt-2">Kit Parent</p>
                        <Switch
                          checked={productData.kitParent === 1 ? true : false}
                          onChange={(event) => {
                            setProductData({
                              ...productData,
                              kitParent: event.target.checked ? 1 : 0,
                            });
                          }}
                          value={productData.kitParent}
                        />
                      </div>
                      <div className="flex flex-row justify-between h-10">
                        <p className="mt-2">High Risk</p>
                        <Switch
                          checked={productData.highRisk === 1 ? true : false}
                          onChange={(event) => {
                            setProductData({
                              ...productData,
                              highRisk: event.target.checked ? 1 : 0,
                            });
                          }}
                          value={productData.highRisk}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-row mb-3">
                    <TextField
                      fullWidth
                      size="small"
                      label="Minimum Blend Amount"
                      name="minBlendAmount"
                      value={productData.minBlendAmount}
                      onChange={handleOnChange}
                    />
                  </div>
                  <div className="form-row mb-3">
                    <div className="text-[13px]">Cost This Item</div>
                    <div className="text-[13px]">
                      <Switch
                        checked={productData.costItem === 1 ? true : false}
                        onChange={(event) => {
                          setProductData({
                            ...productData,
                            costItem: event.target.checked ? 1 : 0,
                          });
                        }}
                        value={productData.costItem}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group col-md-4">
                  <div className="form-row mb-3">
                    <TextField
                      fullWidth
                      size="small"
                      label="Kit Parent Cost"
                      name="kitParentCost"
                      value={productData.kitParentCost}
                      onChange={handleOnChange}
                    />
                  </div>
                  <div className="form-row mb-3">
                    <TextField
                      fullWidth
                      size="small"
                      label="Shelve Live in Days"
                      name="shelveDays"
                      value={productData.shelveDays}
                      onChange={handleOnChange}
                    />
                  </div>
                  <div className="form-row mb-3">
                    <TextField
                      fullWidth
                      size="small"
                      label="Par Level"
                      name="parLevel"
                      value={productData.parLevel}
                      onChange={handleOnChange}
                    />
                  </div>
                  <div className="form-row mt-[42px]">
                    <MaterialDropDown
                      fullWidth
                      withRenderValue
                      multiple={false}
                      label="Par Level Unit"
                      name="parLevelUnit"
                      value={productData.parLevelUnit}
                      userRoleToShow={productData.parLevelUnitName}
                      options={
                        dependenciesArray?.unit_types[0]?.units?.length > 0
                          ? dependenciesArray?.unit_types[0]?.units
                          : []
                      }
                      onChange={handleDropdownOnChange}
                    />
                  </div>
                </div>

                <div className="form-group col-md-4">
                  <div className="form-row mb-3">
                    <TextField
                      fullWidth
                      size="small"
                      label="Safety Stock"
                      name="safetyStock"
                      value={productData.safetyStock}
                      onChange={handleOnChange}
                    />
                  </div>
                  <div className="form-row mb-3">
                    <MaterialDropDown
                      fullWidth
                      withRenderValue
                      multiple={false}
                      label="Safety Stock Unit"
                      name="safetyStockUnit"
                      value={productData.safetyStockUnit}
                      userRoleToShow={productData.safetyStockUnitName}
                      options={
                        dependenciesArray?.unit_types[0]?.units?.length > 0
                          ? dependenciesArray?.unit_types[0]?.units
                          : []
                      }
                      onChange={handleDropdownOnChange}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Allergens View */}
          <div
            className={`border rounded bg-white pb-0.5 my-3 mx-4 overflow-hidden ${
              changeAllergensHeight ? "h-[14rem]" : "h-unset"
            }`}>
            <h6 className="px-3 py-3">Allergens</h6>
            <div className="row">
              <div className="form-group col-md-8">
                <div className="form-row mb-3 px-3">
                  <MultiDropDown
                    multiple={true}
                    placeholder={"Allergens"}
                    optionsArray={dependenciesArray?.allergens}
                    value={productData?.allergens}
                    onChange={handleMultiOnChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="h-[100%] flex flex-col justify-between">
            <Buttons />
          </div>
        </div>
      )}
    </div>
  );
};
export default AddNewProduct;
