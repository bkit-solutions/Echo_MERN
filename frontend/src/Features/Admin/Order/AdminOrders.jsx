import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import {
  fetchAllOrdersAsync,
  selectAllOrders,
  selectTotalOrders,
  selectAdminAPIStatus,
} from "../AdminSlice";
import { AdminOrderTile } from "./AdminOrderTile";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Pagination } from "../../Common/Pagination";
import { Loader } from "../../../utils/Loader";
import { useNavigate } from "react-router-dom";

export function AdminOrders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const orders = useSelector(selectAllOrders);
  const totalOrders = useSelector(selectTotalOrders);
  const apiStatus = useSelector(selectAdminAPIStatus);

  const [page, setPage] = useState(1);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const sortMenuRef = useRef(null);

  const [sort, setSort] = useState({
    _sort: "createdAt",
    _order: "desc",
  });

  const sortOptions = [
    { name: "Latest Orders", sortBy: "createdAt", order: "desc" },
    { name: "Oldest Orders", sortBy: "createdAt", order: "asc" },
    { name: "Amount : Low to High", sortBy: "totalAmount", order: "asc" },
    { name: "Amount : High to Low", sortBy: "totalAmount", order: "desc" },
  ];

  /* ================= FETCH ORDERS ================= */
  useEffect(() => {
    dispatch(fetchAllOrdersAsync({ page, sort, navigate }));
  }, [dispatch, page, sort, navigate]);

  /* ================= CLOSE SORT MENU ================= */
  useEffect(() => {
    function handleClickOutside(e) {
      if (sortMenuRef.current && !sortMenuRef.current.contains(e.target)) {
        setShowSortMenu(false);
      }
    }
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
      <div className="mx-4 md:mx-10 my-6 bg-white rounded-xl border shadow-sm p-4 md:p-6">
        {/* ===== HEADER ===== */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-3xl md:text-4xl font-bold">Orders</h1>

          {/* SORT */}
          <div className="relative" ref={sortMenuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSortMenu((prev) => !prev);
              }}
              className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              <span className="font-medium">Sort</span>
              <MdKeyboardArrowDown className="text-xl" />
            </button>

            {showSortMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-xl z-20">
                {sortOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSort({
                        _sort: option.sortBy,
                        _order: option.order,
                      });
                      setShowSortMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                      sort._sort === option.sortBy &&
                      sort._order === option.order
                        ? "bg-gray-100 font-semibold"
                        : ""
                    }`}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <hr className="mb-6" />

        {/* ===== CONTENT ===== */}
        {apiStatus === "loading" && (
          <div className="flex justify-center py-20">
            <Loader />
          </div>
        )}

        {apiStatus !== "loading" && (!orders || orders.length === 0) && (
          <div className="text-center py-20 text-gray-500 text-xl">
            No orders found
          </div>
        )}

        {apiStatus !== "loading" &&
          orders &&
          orders.map((order) => (
            <AdminOrderTile key={order._id} order={order} />
          ))}
      </div>

      {/* ===== PAGINATION ===== */}
      {totalOrders > 0 && (
        <div className="mx-4 md:mx-10 mb-10">
          <Pagination
            page={page}
            setPage={setPage}
            totalDocs={totalOrders}
          />
        </div>
      )}
    </>
  );
}
