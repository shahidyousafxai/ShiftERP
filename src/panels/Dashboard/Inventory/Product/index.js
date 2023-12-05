/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-self-compare */
// Library Imports
import React, { useEffect, useState } from "react";
import Barcode from "react-barcode";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ClearIcon from "@mui/icons-material/Clear";
import { Add, Visibility } from "@mui/icons-material";
import Delete from "@mui/icons-material/Delete";
// Local Imports
import {
  CustomModal,
  Button,
  BreadCrumb,
  Table as ProductsTable,
  SearchBar,
  Spinner,
  OptionModal,
  ModalButton,
  Typography,
  AlertMessage,
} from "../../../../shared";
import { Status, Statistics } from "../../../../helpers/TableUtilities";
import { ManageProduct } from "./Components/utils";
import * as Actions from "../../../../redux/product/actions";
import * as Selectors from "../../../../redux/product/selectors";
import { deleteProduct, getDependencies } from "../../../../api/productsApi";
import {
  columnData,
  tableColumnExtensions,
  editColumnData,
} from "./mockupData/mockupData";
import "rsuite/dist/rsuite.min.css";
import "./Styles/product.css";
import { AssignDeleteModal } from "../../../../helpers/AssignDeleteModal";

const Products = () => {
  const user = useSelector((state) => state.user);
  const facilityUser = user?.currentUser?.role === "facility_user";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = Selectors.GetProductsLoading();
  const products = Selectors.GetProducts();
  // All States
  const [columns] = useState(columnData);
  const [ColumnSetting1] = useState(["status"]);
  const [ColumnSetting2] = useState(["high_risk"]);
  const [ColumnSetting3] = useState(["costed"]);
  const [ColumnSetting4] = useState(["manage"]);
  const [selectionIds, setSelectionIds] = useState([]);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [isOpen, setIsopen] = useState(false);
  const [isError, setIsError] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [categoriesArray, setCategoriesArray] = useState([]);
  const [customersArray, setCustomersArray] = useState([]);
  const [allergensArray, setAllergensArray] = useState([]);
  const [name, setName] = useState("");
  const [columnToShow, setColumnToShow] = useState(columnData);
  const [previewBarCode, setPreviewBarCode] = useState(false);
  const [previewBarCodeObj, setPreviewBarCodeObj] = useState({
    description: "",
    barcodeNum: "",
  });
  const [isDelete, setIsDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  // Filters
  const [filters, setFilters] = useState({
    Allergens: [],
    Categories: [],
    Customers: [],
    Status: [
      {
        title: "Active",
        value: false,
      },
      {
        title: "InActive",
        value: false,
      },
    ],
  });

  // Data Providers For Table
  const dataProviders = [
    {
      columnName: ColumnSetting1,
      func: (restProps) => Status(restProps.row.status, "Active", "Inactive"),
    },
    {
      columnName: ColumnSetting2,
      func: (restProps) => Statistics(restProps?.row?.high_risk),
    },
    {
      columnName: ColumnSetting3,
      func: (restProps) => Statistics(restProps?.row?.costed),
    },
    {
      columnName: ColumnSetting4,
      func: (restProps) =>
        ManageProduct(restProps, previewBarcode, facilityUser),
    },
  ];

  //OnRowSelect
  const onRowSelect = (selectedProduct) => {
    navigate("/inventory/edit-product/${id}", {
      state: { product: selectedProduct },
    });
  };

  // Dependencies Array State
  // eslint-disable-next-line no-unused-vars
  const [dependenciesArray, setDependenciesArray] = useState({
    allergens: [],
    categories: [],
    customers: [],
    unit_types: [],
  });

  // UseEffect For Calling Listing On Name And Filter Change
  useEffect(() => {
    if (name === "" || filters !== filters) {
      getProductsList();
      setSelectionIds([]);
    }
  }, [name, filters]);

  //UseEffect For Calling Dependency Listing On Page Load
  useEffect(() => {
    getDependencyList();
  }, []);

  // UseEffect For Hiding Info Messages
  useEffect(() => {
    if (deleteAlert) {
      setTimeout(() => {
        setDeleteAlert(false);
      }, 2000);
    }
  }, [deleteAlert]);

  const onProductSearch = () => {
    if (name !== "") {
      getProductsList();
    }
  };

  //Get Customers,Allergens,Categories Array Filter
  const filtersArray = (from) => {
    if (from === "Customers") {
      let customerData = [];
      filters?.Customers?.map((item, index) => {
        if (item.value) {
          customerData.push(customersArray[index].uuid);
        }
      });

      return customerData;
    } else if (from === "Categories") {
      let categoriesData = [];
      filters?.Categories?.map((item, index) => {
        if (item.value) {
          categoriesData.push(categoriesArray[index].uuid);
        }
      });
      return categoriesData;
    } else if (from === "Allergens") {
      let allergensData = [];
      filters?.Allergens?.map((item, index) => {
        if (item.value) {
          allergensData.push(allergensArray[index].uuid);
        }
      });
      return allergensData;
    }
  };

  //Get Products List
  const getProductsList = () => {
    let payload = {
      search: name,
      status: filters.Status[0].value ? 1 : filters.Status[1].value ? 0 : "",
      customer_id:
        filtersArray("Customers")?.length > 0 ? filtersArray("Customers") : "",
      category_id:
        filtersArray("Categories")?.length > 0
          ? filtersArray("Categories")
          : "",
      allergen_id:
        filtersArray("Allergens")?.length > 0 ? filtersArray("Allergens") : "",
      order: "",
    };
    dispatch(Actions.getProducts(payload));
  };

  // Calling Dependency Dropdown List
  const getDependencyList = () => {
    getDependencies()
      .then((res) => {
        let data = res?.data?.data;
        setDependenciesArray(data);
        let customerData = data?.customers?.map((item) => {
          return {
            title: item.name ? item.name : item.code,
            value: false,
          };
        });

        let categoriesData = data?.categories?.map((item) => {
          return {
            title: item.name,
            value: false,
          };
        });

        let allergensData = data?.allergens?.map((item) => {
          return {
            title: item.name,
            value: false,
          };
        });

        setFilters((prev) => {
          return {
            ...prev,
            Categories: categoriesData,
            Customers: customerData,
            Allergens: allergensData,
          };
        });

        setCategoriesArray(res?.data?.data?.categories);
        setCustomersArray(res?.data?.data?.customers);
        setAllergensArray(res?.data?.data?.allergens);
      })
      .catch((error) => {
        console.log("🚀 ~ file: AddNewProduct.js ~ line 35 ~ error", error);
      });
  };

  // From Manage Options Delete Product
  const handleDelete = (uuid, setDeleteLoading) => {
    let UUID = Array.isArray(uuid)
      ? uuid?.map((item) => {
          return item?.uuid;
        })
      : [uuid];

    deleteProduct({ ids: UUID })
      .then((res) => {
        setIsDelete(false);
        setDeleteLoading(false);
        setDeleteAlert(true);
        setSelectionIds([]);
        setSelectedProducts([]);
        getProductsList();
      })
      .catch((error) => {
        setDeleteLoading(false);
        if (error?.response?.data) {
          setIsError(error?.response?.data?.errors?.ids);
        }
      });
  };

  // From Manage OOptions Delete Product
  const previewBarcode = (item) => {
    setPreviewBarCodeObj({
      description: item?.description,
      barcodeNum: item?.barcode,
    });
    setPreviewBarCode(true);
  };
  const previewBarCodeClose = () => {
    setPreviewBarCodeObj({ description: "", barcodeNum: "" });
    setSelectedProducts([]);
    setSelectionIds([]);
    setPreviewBarCode(false);
    getProductsList();
  };

  // Print BarCode
  const print = () => {
    const printWindow = window.open("", "PRINT", "");

    printWindow.document.write(
      "<html><head><title>" + document.title + "</title></head><body>"
    );
    const barcodeContent = document.getElementById("section-to-print");

    printWindow.document.write(barcodeContent.innerHTML);
    printWindow.document.write("</body></html>");
    printWindow.document.close(); // Necessary for IE >= 10
    printWindow.focus();
    printWindow.print();
    printWindow.onafterprint = () => {
      printWindow.close();
    };
    return true;
  };

  // Handle OnChange Edit Columns
  const onChangeEditColumn = (item) => {
    if (item === "clearAll") {
      setColumnToShow(columnData);
    } else {
      let toShow = [...columnToShow];

      if (toShow.find((el) => el.title === item.title)) {
        toShow.splice(
          toShow.findIndex((el) => el.title === item.title),
          1
        );
      } else {
        toShow = [...columnToShow, item];
      }

      setColumnToShow(toShow);
    }
  };

  // Handle OnChange Setting
  const filterOnChange = (from, item, index) => {
    if (from === "clearAll") {
      setFilters(() => {
        let status = filters.Status.slice();
        let customers = filters.Customers.slice();
        let categories = filters.Categories.slice();
        let allergens = filters.Allergens.slice();
        customers?.map((item) => {
          item.value = false;
        });
        categories?.map((item) => {
          item.value = false;
        });
        allergens?.map((item) => {
          item.value = false;
        });

        status[0] = { title: status[0].title, value: false };
        status[1] = { title: status[1].title, value: false };

        const newObj = {
          Allergens: allergens,
          Categories: categories,
          Customers: customers,
          Status: status,
        };
        return newObj;
      });
    } else if (from === "Status") {
      setFilters(() => {
        let status = filters.Status.slice();
        let customers = filters.Customers;
        let categories = filters.Categories;
        let allergens = filters.Allergens;

        if (index === 0) {
          status[index] = { title: item.title, value: !item.value };
          status[index + 1] = { title: status[index + 1].title, value: false };
        } else {
          status[index] = { title: item.title, value: !item.value };
          status[index - 1] = { title: status[index - 1].title, value: false };
        }

        const newObj = {
          Allergens: allergens,
          Categories: categories,
          Customers: customers,
          Status: status,
        };
        return newObj;
      });
    } else if (from === "Customers") {
      setFilters(() => {
        let status = filters.Status.slice();
        let customers = filters.Customers.slice();
        let categories = filters.Categories;
        let allergens = filters.Allergens;

        customers[index].value = !customers[index].value;

        const newObj = {
          Allergens: allergens,
          Categories: categories,
          Customers: customers,
          Status: status,
        };
        return newObj;
      });
    } else if (from === "Categories") {
      setFilters(() => {
        let status = filters.Status.slice();
        let customers = filters.Customers;
        let categories = filters.Categories.slice();
        let allergens = filters.Allergens;

        categories[index].value = !categories[index].value;

        const newObj = {
          Allergens: allergens,
          Categories: categories,
          Customers: customers,
          Status: status,
        };
        return newObj;
      });
    } else if (from === "Allergens") {
      setFilters(() => {
        let status = filters.Status.slice();
        let customers = filters.Customers;
        let categories = filters.Categories;
        let allergens = filters.Allergens.slice();

        allergens[index].value = !allergens[index].value;

        const newObj = {
          Allergens: allergens,
          Categories: categories,
          Customers: customers,
          Status: status,
        };
        return newObj;
      });
    }
  };

  return (
    <div className="main-container pl-4">
      {/* To Show Barcode */}
      <CustomModal open={previewBarCode} width={window.innerWidth * 0.4}>
        <div>
          <div className="d-flex flex-row justify-content-between align-items-center">
            <div className="d-flex flex-row justify-content-between align-items-center text-center">
              <div className="pointer">
                <Visibility
                  className="mx-3 mb-1"
                  color="primary"
                  fontSize="small"
                />
              </div>
              Preview Barcode
            </div>
            <div className="pointer mx-3" onClick={previewBarCodeClose}>
              <ClearIcon color="secondary" fontSize="small" />
            </div>
          </div>

          {selectedProducts?.length > 0 ? (
            <div
              id="section-to-print"
              className="h-[400px] m-3 px-3 overflow-y-scroll flex flex-col items-center">
              {selectedProducts?.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="flex flex-col mb-2 justify-content-between align-items-center rounded-lg border-2 max-w-[max-content] items-center">
                    <p className="mt-2 px-2">{item.description}</p>
                    <Barcode height="50px" value={item.barcode} />
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              id="section-to-print"
              className={`d-flex flex-col m-3 justify-content-between align-items-center rounded-lg border-2 `}>
              <p className="mt-2 px-2">{previewBarCodeObj.description}</p>
              <Barcode height="50px" value={previewBarCodeObj.barcodeNum} />
            </div>
          )}

          <div className="mb-3">
            <div className="d-flex flex-row justify-content-between align-items-center mx-3 mt-4 mb-2">
              <Button
                component="span"
                className="capitalize mr-[10px]"
                variant="outlined"
                color="secondary"
                onClick={previewBarCodeClose}>
                Cancel
              </Button>
              <Button
                startIcon={<Visibility />}
                component="span"
                className="capitalize"
                color="primary"
                variant="contained"
                onClick={() => print()}>
                Print Barcode
              </Button>
            </div>
          </div>
        </div>
      </CustomModal>

      {/* To Mullti Delete Products */}
      <AssignDeleteModal
        open={isDelete}
        setOpen={setIsDelete}
        headTitle="Delete Products"
        warningMsg=""
        confirmationPrompt={"Are you sure you want to delete following selected products?"}
        onClose={() => {
          setIsDelete(false);
          setDeleteLoading(false);
          setSelectionIds([]);
          setSelectedProducts([]);
          getProductsList();
          setIsError("");
        }}
        onDelete={() => {
          setDeleteLoading(true);
          handleDelete(selectedProducts, setDeleteLoading);
        }}
        loading={deleteLoading}
        errorMsg={isError}
      >
        <div className="max-h-52 overflow-y-scroll">
          {selectedProducts?.map((item, index) => {
            return (
              <div key={index} className="flex justify-start mx-4">
                <div className="fw-bold">
                  {index + 1}: {item?.name}
                </div>
              </div>
            );
          })}
        </div>
      </AssignDeleteModal>

      {/* BreaddCrumbs & Add Customer Button */}
      <div className="d-flex flex-row justify-content-between align-items-center py-3">
        <div>
          <BreadCrumb
            routes={[
              { name: "Inventory", route: "/inventory/products", color: true },
              { name: "Products" },
            ]}
          />
          <div className="text-[15px] font-bold">Products</div>
        </div>
        {!facilityUser && (
          <Button
            startIcon={<Add />}
            className="capitalize text-[13px] font-medium mr-[10x]"
            onClick={() =>
              navigate("/inventory/add-product", {
                state: { from: "addProduct" },
              })
            }
            component="span"
            color="primary"
            variant="contained"
            disabled={loading}>
            Add New Product
          </Button>
        )}
      </div>

      {/* Search Bar with Buttons */}
      <div className="d-flex flex-row justify-between align-items-center mt-2 mb-2">
        <SearchBar
          disabled={
            selectionIds.length > 0
              ? true
              : filters.Status[0].value || filters.Status[1].value
              ? // ||
                // filters["High Risk"][0].value ||
                // filters["High Risk"][1].value ||
                // filters.Costed[0].value ||
                // filters.Costed[1].value
                true
              : false
          }
          onClear={() => setName("")}
          onSearch={() => onProductSearch()}
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <div className="d-flex flex-row justify-between align-items-center">
          {/* Filters */}
          <ModalButton
            option1={filters.Status[0].value || filters.Status[1].value}
            option2={
              filters?.Customers?.length > 0
                ? filters?.Customers?.some((item) => {
                    return item?.value === true;
                  })
                  ? true
                  : false
                : false
            }
            option3={
              filters?.Categories?.length > 0
                ? filters?.Categories?.some((item) => {
                    return item?.value === true;
                  })
                  ? true
                  : false
                : false
            }
            option4={
              filters?.Allergens?.length > 0
                ? filters?.Allergens?.some((item) => {
                    return item?.value === true;
                  })
                  ? true
                  : false
                : false
            }
            label={"Filter"}>
            <OptionModal
              options={filters}
              setOptions={setFilters}
              leftLabel="Filters"
              rightLabel="Clear All"
              onChange={filterOnChange}
            />
          </ModalButton>

          {/* Edit Columns */}
          <ModalButton
            option1={columnToShow.length < 13 ? true : false}
            label={"Edit Columns"}>
            <OptionModal
              options={editColumnData}
              leftLabel="Columns"
              rightLabel="Reset All"
              onChange={onChangeEditColumn}
              columnToShow={columnToShow}
            />
          </ModalButton>
        </div>
      </div>

      {/* Facility Delete Alert */}
      {deleteAlert && (
        <AlertMessage
          severity="error"
          text="Product successfully deleted"
          textColor="red"
        />
      )}

      {loading ? (
        <Spinner />
      ) : (
        <ProductsTable
          rows={products?.length ? products : []}
          columns={columnToShow.length < 13 ? columnToShow : columns}
          tableColumnExtensions={tableColumnExtensions}
          dataProviders={dataProviders}
          selectionIds={selectionIds}
          setSelectionIds={setSelectionIds}
          setDeleteAlert={setDeleteAlert}
          isOpen={isOpen}
          setIsopen={setIsopen}
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
          setIsDelete={setIsDelete}
          products={true}
          previewBarCode={previewBarCode}
          setPreviewBarCode={setPreviewBarCode}
          onRowSelect={onRowSelect}
          companyAdmin={facilityUser ? false : true}
        />
      )}
    </div>
  );
};

export default Products;
