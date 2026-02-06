import { Link } from "react-router-dom";
import { MdEdit, MdRemoveRedEye } from "react-icons/md";

export function AdminOrderTile({ order }) {
  return (
    <div className="mx-6 xl:mx-20 my-4">
      <div className="bg-white border rounded-xl shadow-sm p-4 md:p-6">
        {/* ===== TOP ROW ===== */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Order ID</p>
            <p className="font-semibold text-indigo-600 break-all">
              #{order._id}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Ordered At</p>
            <p className="font-medium">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="font-bold text-lg">${order.totalAmount}</p>
          </div>

          <div className="flex gap-3">
            <Link
              to={`view/${order._id}`}
              className="flex items-center gap-1 px-3 py-2 text-sm rounded-md border hover:bg-gray-50"
            >
              <MdRemoveRedEye />
              View
            </Link>

            <Link
              to={`edit/${order._id}`}
              className="flex items-center gap-1 px-3 py-2 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
            >
              <MdEdit />
              Edit
            </Link>
          </div>
        </div>

        <hr className="my-4" />

        {/* ===== ITEMS ===== */}
        <div className="mb-4">
          <p className="text-sm font-semibold mb-2">Items</p>

          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 text-sm"
              >
                <img
                  src={item.product.thumbnail}
                  alt={item.product.title}
                  className="w-10 h-10 rounded object-cover border"
                />

                <div className="flex-1">
                  <p className="font-medium">{item.product.title}</p>
                  <p className="text-gray-500">
                    Qty: {item.quantity}
                  </p>
                </div>

                <div className="font-semibold">
                  $
                  {Math.floor(
                    ((100 - item.product.discountPercentage) / 100) *
                      item.product.price
                  ) * item.quantity}
                </div>
              </div>
            ))}
          </div>
        </div>

        <hr className="my-4" />

        {/* ===== SHIPPING ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold mb-1">Shipping Details</p>
            <p>
              {order.billingName || "USER"}
              <br />
              {order.address.street}
              <br />
              {order.address.city}, {order.address.state}
              <br />
              {order.address.pinCode}
            </p>
          </div>

          <div>
            <p className="font-semibold mb-1">Contact</p>
            <p>{order.phoneNumber}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
