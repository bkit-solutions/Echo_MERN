import { ProductTile } from "../../Common/ProductTile";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllCartItemsAsync, selectCartState } from "../../Cart/CartSlice";
import { useEffect } from "react";
import { createOrderAsync } from "../CheckoutSlice";
import { useNavigate } from "react-router-dom";
import {
  selectCurrentOrderDetails,
  selectOrderPlacedStatus,
} from "../CheckoutSlice";

export function CartSummary({ selectedAddressIndex, paymentMethod, watch }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* ================= REDUX STATE ================= */
  const { cartItems = [] } = useSelector(selectCartState); // ✅ SAFE DEFAULT
  const orderStatus = useSelector(selectOrderPlacedStatus);
  const { orderId, isOrderPlaced } = useSelector(
    selectCurrentOrderDetails
  );

  /* ================= FETCH CART ================= */
  useEffect(() => {
    dispatch(fetchAllCartItemsAsync());
  }, [dispatch]);

  /* ================= REDIRECT AFTER ORDER ================= */
  useEffect(() => {
    if (isOrderPlaced && orderId) {
      navigate(`/order-success/${orderId}`);
    }
  }, [isOrderPlaced, orderId, navigate]);

  /* ================= VALIDATIONS ================= */
  function validateInputs() {
    const fullName = watch("fullName");
    const email = watch("email");
    const phoneNumber = watch("phone");

    if (selectedAddressIndex === null) {
      return "Select delivery address";
    }
    if (!fullName || !/^[A-Za-z ]+$/.test(fullName)) {
      return "Enter valid full name";
    }
    if (
      !email ||
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
    ) {
      return "Enter valid email";
    }
    if (!/^\d{10}$/.test(phoneNumber)) {
      return "Enter valid 10 digit phone number";
    }
    return null;
  }

  /* ================= PLACE ORDER ================= */
  function placeOrderHandler() {
    const error = validateInputs();
    if (error) {
      alert(error);
      return;
    }

    const orderDetails = {
      addressIndex: selectedAddressIndex,
      paymentMethod,
      email: watch("email"),
      fullName: watch("fullName"),
      phoneNumber: watch("phone"),
    };

    dispatch(createOrderAsync({ orderDetails, navigate }));
  }

  /* ================= TOTALS ================= */
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

  /* ================= UI ================= */
  return (
    <div className="bg-white rounded-xl border shadow-sm p-6 sticky top-24 space-y-6">
      {/* HEADER */}
      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
        🛒 Order Summary
      </h2>

      {/* ITEMS */}
      <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
        {cartItems.length === 0 ? (
          <p className="text-center text-slate-500">
            No items in cart
          </p>
        ) : (
          cartItems.map((item) => (
            <ProductTile key={item._id} {...item} />
          ))
        )}
      </div>

      <hr />

      {/* PRICE DETAILS */}
      <div className="space-y-3 text-sm text-slate-700">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-semibold">${subtotal}</span>
        </div>

        <div className="flex justify-between">
          <span>Total Items</span>
          <span className="font-semibold">{totalItems}</span>
        </div>

        <div className="flex justify-between">
          <span>Payment Method</span>
          <span className="font-semibold uppercase">
            {paymentMethod}
          </span>
        </div>

        <p className="text-xs text-slate-500">
          Shipping & taxes calculated at checkout
        </p>
      </div>

      {/* CTA */}
      <button
        onClick={placeOrderHandler}
        disabled={orderStatus === "loading"}
        className="w-full py-4 bg-indigo-600 text-white rounded-lg font-semibold text-lg hover:bg-indigo-700 transition disabled:opacity-60"
      >
        {orderStatus === "loading"
          ? "Placing Order..."
          : "Place Order"}
      </button>

      {/* TRUST BADGE */}
      <p className="text-xs text-center text-slate-500">
        🔒 Secure & encrypted checkout
      </p>
    </div>
  );
}
