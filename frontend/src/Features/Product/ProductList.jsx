import { MdKeyboardArrowDown } from "react-icons/md";
import { CiFilter } from "react-icons/ci";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuid } from "uuid";
import { useNavigate } from "react-router-dom";

import { ProductCard } from "../Common/ProductCard";
import { Pagination } from "../Common/Pagination";
import { Loader } from "../../utils/Loader";

import {
  fetchAllProductsAsync,
  fetchAllBrandsAsync,
  fetchAllCategoriesAsync,
  selectProductState,
} from "../Product/ProductSlice";
import { selectSearchParameters } from "./ProductSlice";
import { selectLoggedInUser } from "../Auth/AuthSlice";

export function ProductList() {
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filter, setFilter] = useState({ category: [], brand: [] });
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const state = useSelector(selectProductState);
  const searchParameter = useSelector(selectSearchParameters);
  const user = useSelector(selectLoggedInUser);
  const { role } = user;

  const sortOptions = [
    { name: "Price: Low to High", sortBy: "price", order: "asc" },
    { name: "Price: High to Low", sortBy: "price", order: "desc" },
    { name: "Better Discount", sortBy: "discountPercentage", order: "desc" },
  ];

  const filterHandler = (value, filterType) => {
    const isSelected = filter[filterType].includes(value);
    setFilter({
      ...filter,
      [filterType]: isSelected
        ? filter[filterType].filter((v) => v !== value)
        : [...filter[filterType], value],
    });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(
        fetchAllProductsAsync({
          filter,
          page,
          sort,
          searchParameter,
          role,
        })
      );
    }, 500);

    return () => clearTimeout(timeout);
  }, [filter, page, sort, searchParameter, role, dispatch]);

  useEffect(() => {
    dispatch(fetchAllBrandsAsync());
    dispatch(fetchAllCategoriesAsync());
  }, [dispatch]);

  function addProductHandler() {
    navigate("/admin/products/create");
  }

  useEffect(() => {
    function handleClickOutside() {
      setShowSortMenu(false);
    }
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative">
        <h1 className="text-3xl font-semibold text-slate-800">
          All Products
        </h1>

        <div className="flex items-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowSortMenu((v) => !v);
            }}
            className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-blue-600"
          >
            Sort <MdKeyboardArrowDown className="h-5 w-5" />
          </button>

          <CiFilter
            className="h-5 w-5 text-slate-600 hover:text-blue-600 lg:hidden cursor-pointer"
            onClick={() => setShowMobileFilters(true)}
          />

          {showSortMenu && (
            <div className="absolute right-0 top-10 w-56 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden z-20">
              {sortOptions.map((opt) => (
                <div
                  key={uuid()}
                  className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 cursor-pointer"
                  onClick={() =>
                    setSort({ _sort: opt.sortBy, _order: opt.order })
                  }
                >
                  {opt.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop Filters */}
        <DesktopFilters
          state={state}
          filter={filter}
          filterHandler={filterHandler}
        />

        {/* Products */}
        <div className="flex-1">
          {/* {role === "admin" && (
            <button
              className="btn-primary mb-4"
              onClick={addProductHandler}
            >
              Add Product
            </button>
          )} */}

          {state.status.products === "loading" && <Loader />}

          {state.error.products && (
            <p className="text-lg font-medium text-red-600">
              {state.error.products}
            </p>
          )}

          {state.products && state.products.length === 0 ? (
            <p className="text-lg text-slate-600">No products found</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {state.products?.map((product, index) => (
                <ProductCard key={index} {...product} />
              ))}
            </div>
          )}

          <Pagination
            totalDocs={state.totalProducts}
            page={page}
            setPage={setPage}
          />
        </div>
      </div>

      {/* Mobile Filters */}
      <MobileFilters
        state={state}
        filter={filter}
        filterHandler={filterHandler}
        showMobileFilters={showMobileFilters}
        setShowMobileFilters={setShowMobileFilters}
      />
    </div>
  );
}

/* ---------------- Filters ---------------- */

function DesktopFilters({ state, filter, filterHandler }) {
  const [showCategory, setShowCategory] = useState(true);
  const [showBrand, setShowBrand] = useState(true);

  return (
    <div className="hidden lg:block w-64">
      <FilterSection
        title="Category"
        show={showCategory}
        toggle={() => setShowCategory((v) => !v)}
      >
        {state.filters.categories?.map(({ label }) => (
          <FilterCheckbox
            key={uuid()}
            label={label}
            checked={filter.category.includes(label)}
            onChange={() => filterHandler(label, "category")}
          />
        ))}
      </FilterSection>

      <FilterSection
        title="Brand"
        show={showBrand}
        toggle={() => setShowBrand((v) => !v)}
      >
        {state.filters.brands?.map(({ label }) => (
          <FilterCheckbox
            key={uuid()}
            label={label}
            checked={filter.brand.includes(label)}
            onChange={() => filterHandler(label, "brand")}
          />
        ))}
      </FilterSection>
    </div>
  );
}

function MobileFilters({
  state,
  filter,
  filterHandler,
  showMobileFilters,
  setShowMobileFilters,
}) {
  return (
    <div
      className={`${
        showMobileFilters ? "translate-x-0" : "translate-x-full"
      } fixed inset-y-0 right-0 w-80 bg-white shadow-xl transition-transform z-50 lg:hidden`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-semibold text-lg">Filters</h2>
        <RxCross1
          className="cursor-pointer"
          onClick={() => setShowMobileFilters(false)}
        />
      </div>

      <div className="p-4 space-y-6">
        {state.filters.categories?.map(({ label }) => (
          <FilterCheckbox
            key={uuid()}
            label={label}
            checked={filter.category.includes(label)}
            onChange={() => filterHandler(label, "category")}
          />
        ))}

        {state.filters.brands?.map(({ label }) => (
          <FilterCheckbox
            key={uuid()}
            label={label}
            checked={filter.brand.includes(label)}
            onChange={() => filterHandler(label, "brand")}
          />
        ))}
      </div>
    </div>
  );
}

function FilterSection({ title, show, toggle, children }) {
  return (
    <div className="mb-6">
      <div
        onClick={toggle}
        className="flex justify-between items-center cursor-pointer mb-2"
      >
        <h3 className="font-semibold text-slate-800">{title}</h3>
        {show ? <FaMinus /> : <FaPlus />}
      </div>
      {show && <div className="space-y-2">{children}</div>}
    </div>
  );
}

function FilterCheckbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="rounded border-slate-300"
      />
      {label}
    </label>
  );
}
