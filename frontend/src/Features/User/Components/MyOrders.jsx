import { useSelector, useDispatch } from "react-redux";
import {
  fetchUserOrdersAsync,
  selectUserOrderDetails,
  selectUserState,
} from "../UserSlice";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { OrderTile } from "./OrderTile";
import { Loader } from "../../../utils/Loader";
import { v4 as uuid } from "uuid";

export function MyOrders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const ordersFromStore = useSelector(selectUserOrderDetails);
  const { status } = useSelector(selectUserState);

  // ✅ NORMALIZE DATA (this fixes the crash)
  const orders = Array.isArray(ordersFromStore)
    ? ordersFromStore
    : [];

  useEffect(() => {
    dispatch(fetchUserOrdersAsync({ navigate }));
  }, [dispatch, navigate]);

  /* ---------------- Loading ---------------- */
  if (status === "loading") {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 sm:px-8 py-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
          My Orders
        </h1>
        <p className="mt-2 text-slate-600">
          Track and manage your purchases
        </p>
      </div>

      {/* Empty State */}
      {orders.length === 0 ? (
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm border p-10 flex flex-col items-center justify-center text-center gap-4">
          <div className="text-5xl">📦</div>

          <h2 className="text-2xl font-semibold text-slate-800">
            No orders yet
          </h2>

          <p className="text-slate-500 max-w-md">
            You haven’t placed any orders. Once you do, they’ll appear here.
          </p>

          <Link
            to="/products"
            className="mt-4 inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-2 text-white font-semibold hover:bg-blue-700 transition"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        /* Orders List */
        <div className="max-w-6xl mx-auto flex flex-col gap-6">
          {orders.map((order) => (
            <div
              key={order._id || uuid()}
              className="bg-white rounded-xl shadow-sm border p-5 sm:p-6"
            >
              <OrderTile order={order} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
