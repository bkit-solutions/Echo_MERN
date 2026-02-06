import { ProductTile } from "../../Features";
import { CheckoutButton } from "../../Features";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllCartItemsAsync, selectCartState } from "./CartSlice";
import { useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";

export function Cart() {
  const dispatch = useDispatch();
  const { cartItems, status } = useSelector(selectCartState);

  useEffect(() => {
    dispatch(fetchAllCartItemsAsync());
  }, [dispatch]);

  const subtotal = cartItems.reduce((acc, curr) => {
    const discounted =
      ((100 - curr.product.discountPercentage) / 100) *
      curr.product.price;
    return acc + Math.floor(discounted) * curr.quantity;
  }, 0);

  const totalItems = cartItems.reduce(
    (acc, curr) => acc + curr.quantity,
    0
  );

  /* ================= EMPTY CART ================= */
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] bg-slate-50 flex flex-col items-center justify-center gap-6">
        <FaShoppingCart className="text-6xl text-slate-400" />
        <h2 className="text-3xl font-bold text-slate-800">
          Your cart is empty
        </h2>
        <p className="text-slate-500">
          Looks like you haven’t added anything yet
        </p>
        <Link
          to="/products"
          className="px-6 py-3 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 transition"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ================= HEADER ================= */}
        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            Shopping Cart
          </h1>
          <p className="text-slate-500 mt-1">
            {totalItems} item{totalItems !== 1 && "s"} in your cart
          </p>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ================= CART ITEMS ================= */}
          <div className="lg:col-span-2 bg-white rounded-xl border shadow-sm p-4 sm:p-6 space-y-4">
            {cartItems.map((item) => (
              <ProductTile key={item._id} {...item} />
            ))}
          </div>

          {/* ================= SUMMARY ================= */}
          <div className="bg-white rounded-xl border shadow-sm p-6 h-fit sticky top-24 space-y-4">
            <h2 className="text-xl font-bold text-slate-800">
              Order Summary
            </h2>

            <div className="flex justify-between text-slate-700">
              <span>Subtotal</span>
              <span className="font-semibold">${subtotal}</span>
            </div>

            <div className="flex justify-between text-slate-700">
              <span>Total Items</span>
              <span className="font-semibold">{totalItems}</span>
            </div>

            <p className="text-sm text-slate-500">
              Shipping & taxes calculated at checkout
            </p>

            <Link to="/checkout">
              <CheckoutButton />
            </Link>

            <div className="text-center">
              <Link
                to="/products"
                className="text-indigo-600 font-semibold hover:underline"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
