import { Link } from "react-router-dom";

function getStatusStyles(status = "") {
  switch (status.toUpperCase()) {
    case "DELIVERED":
      return "bg-green-100 text-green-700";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    case "PENDING":
    default:
      return "bg-yellow-100 text-yellow-700";
  }
}

export function OrderTile({ order }) {
  if (!order) return null;

  return (
    <div className="flex flex-col gap-6">
      {/* Order Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <p className="text-sm text-slate-500">Order ID</p>
          <p className="text-lg font-semibold text-blue-600 break-all">
            #{order._id}
          </p>
        </div>

        <div className="text-sm font-medium">
          <span className="text-slate-500 mr-1">Payment:</span>
          <span className="uppercase">{order.paymentMethod}</span>
        </div>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-4">
        {order.items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row gap-4 border rounded-lg p-4"
          >
            {/* Product Image */}
            <Link to={`/products/${item.product._id}`}>
              <img
                src={item.product.thumbnail}
                alt={item.product.title}
                className="h-20 w-20 rounded-md object-contain border"
              />
            </Link>

            {/* Product Info */}
            <div className="flex-1 flex flex-col gap-1">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-slate-800">
                  {item.product.title}
                </h3>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyles(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </div>

              <p className="text-sm text-slate-500">
                Size: <span className="font-medium">{item.size}</span> · Color:{" "}
                <span className="font-medium">{item.color}</span>
              </p>

              <p className="text-sm text-slate-500">
                Quantity: <span className="font-medium">{item.quantity}</span>
              </p>
            </div>

            {/* Price */}
            <div className="flex flex-col justify-center text-right min-w-[90px]">
              <p className="font-semibold text-slate-800">
                $
                {Math.floor(
                  ((100 - item.product.discountPercentage) / 100) *
                    item.product.price
                )}
              </p>
              <p className="text-xs text-slate-500">per item</p>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="border-t pt-4 flex flex-col sm:flex-row sm:justify-between gap-4">
        <div className="text-sm text-slate-700">
          <p className="font-semibold mb-1">Shipping Address</p>
          <p>{order.billingName}</p>
          <p>{order.address.street}</p>
          <p>
            {order.address.city}, {order.address.pinCode}
          </p>
          <p>Phone: {order.phoneNumber}</p>
        </div>

        <div className="text-right">
          <p className="text-sm text-slate-500">Order Total</p>
          <p className="text-xl font-bold text-slate-900">
            $
            {order.items.reduce((total, item) => {
              const price =
                Math.floor(
                  ((100 - item.product.discountPercentage) / 100) *
                    item.product.price
                ) * item.quantity;
              return total + price;
            }, 0)}
          </p>
        </div>
      </div>
    </div>
  );
}
