import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  fetchOrderByIdAsync,
  selectOrderDetails,
  updateOrderByIdAsync,
} from "../AdminSlice";
import { useForm } from "react-hook-form";

export const AdminEditOrderForm = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const order = useSelector(selectOrderDetails);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      billingName: "",
      phoneNumber: "",
      paymentStatus: "pending",
      street: "",
      city: "",
      state: "",
      pinCode: "",
      items: [], // 🔥 CRITICAL FIX
    },
  });

  /* ================= FETCH ORDER ================= */
  useEffect(() => {
    dispatch(fetchOrderByIdAsync({ orderId, navigate }));
  }, [dispatch, orderId, navigate]);

  /* ================= SET FORM VALUES ================= */
  useEffect(() => {
    if (!order) return;

    reset({
      billingName: order.billingName || "",
      phoneNumber: order.phoneNumber || "",
      paymentStatus: order.paymentStatus || "pending",
      street: order.address?.street || "",
      city: order.address?.city || "",
      state: order.address?.state || "",
      pinCode: order.address?.pinCode || "",
      items: order.items || [], // 🔥 CRITICAL FIX
    });
  }, [order, reset]);

  /* ================= SUBMIT ================= */
  function handleFormSubmit(data) {
    const updatedOrderDetails = {
      ...order,
      billingName: data.billingName,
      phoneNumber: data.phoneNumber,
      paymentStatus: data.paymentStatus,
      address: {
        street: data.street,
        city: data.city,
        state: data.state,
        pinCode: data.pinCode,
      },
      items: order.items.map((item, index) => ({
        ...item,
        status: data.items[index]?.status || item.status,
      })),
    };

    dispatch(
      updateOrderByIdAsync({
        orderId,
        updatedOrderDetails,
        navigate,
      })
    );
  }

  const items = watch("items");

  return (
    <div className="sm:mx-16 my-6 bg-white rounded-xl border shadow-sm p-6">
      <h1 className="text-3xl font-bold">Order Details</h1>
      <p className="text-gray-600 mt-1">#{orderId}</p>

      {!order && <p className="mt-10 text-xl">Loading order...</p>}

      {order && (
        <form className="mt-6" onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Billing Name */}
          <div className="mb-4">
            <label className="block font-medium text-sm">Billing Name</label>
            <input
              {...register("billingName", { required: true })}
              className="mt-1 w-full h-9 px-2 border rounded-md"
            />
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label className="block font-medium text-sm">Phone Number</label>
            <input
              {...register("phoneNumber", { required: true })}
              className="mt-1 w-full h-9 px-2 border rounded-md"
            />
          </div>

          {/* Payment */}
          <div className="mb-4">
            <label className="block font-medium text-sm">
              Payment Status
            </label>
            <select
              {...register("paymentStatus")}
              className="mt-1 w-full h-9 border rounded-md"
            >
              <option value="pending">Pending</option>
              <option value="fulfilled">Fulfilled</option>
            </select>
          </div>

          {/* Address */}
          <div className="grid sm:grid-cols-2 gap-4">
            <input {...register("street")} placeholder="Street" className="h-9 px-2 border rounded-md" />
            <input {...register("city")} placeholder="City" className="h-9 px-2 border rounded-md" />
            <input {...register("state")} placeholder="State" className="h-9 px-2 border rounded-md" />
            <input {...register("pinCode")} placeholder="Pincode" className="h-9 px-2 border rounded-md" />
          </div>

          {/* Items */}
          <h3 className="font-semibold text-lg mt-8 mb-4">Items</h3>

          {items?.length === 0 && (
            <p className="text-gray-500">No items found</p>
          )}

          {items?.map((item, index) => (
            <div
              key={item._id || index}
              className="border rounded-lg p-4 mb-4"
            >
              <div className="flex gap-4 items-center">
                <img
                  src={item.product.thumbnail}
                  alt={item.product.title}
                  className="h-16 w-16 rounded-md"
                />

                <div className="flex-1">
                  <p className="font-medium">{item.product.title}</p>
                  <p className="text-sm text-gray-600">
                    Qty: {item.quantity} | Size: {item.size}
                  </p>
                </div>

                <select
                  {...register(`items.${index}.status`)}
                  className="h-9 border rounded-md"
                >
                  <option value="pending">Pending</option>
                  <option value="dispatched">Dispatched</option>
                  <option value="delivered">Delivered</option>
                  <option value="received">Received</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={() => reset()}
              className="px-4 py-2 border rounded-md"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
