import { CartSummary } from "./CartSummary";
import { v4 as uuid } from "uuid";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import {
  fetchUserDetailsAsync,
  addUserAddressAsync,
} from "../CheckoutSlice";
import { useNavigate } from "react-router-dom";

export function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* ================= LOCAL STATE ================= */
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const paymentMethods = ["Cash", "Card"];

  /* ================= FORMS ================= */
  const {
    register: registerPersonal,
    reset: resetPersonal,
    watch: watchPersonal,
    formState: { errors: errorsPersonal },
  } = useForm();

  const {
    register: registerAddress,
    handleSubmit: handleSubmitAddress,
    reset: resetAddress,
    formState: { errors: errorsAddress },
  } = useForm();

  /* ================= REDUX ================= */
  const { user: userDetails } = useSelector((state) => state.order);

  /* ================= FETCH USER ================= */
  useEffect(() => {
    dispatch(fetchUserDetailsAsync({ navigate }));
  }, [dispatch, navigate]);

  /* ================= PREFILL PERSONAL INFO ================= */
  useEffect(() => {
    if (userDetails) {
      resetPersonal({
        fullName: userDetails.fullName || "",
        email: userDetails.email || "",
        phone: userDetails.phoneNumber || "",
      });
    }
  }, [userDetails, resetPersonal]);

  /* ================= VALIDATION RULES ================= */
  const validation = {
    fullName: {
      required: "Full Name is required",
      pattern: {
        value: /^[A-Za-z ]+$/,
        message: "Enter a valid name",
      },
    },
    email: {
      required: "Email is required",
      pattern: {
        value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        message: "Invalid email format",
      },
    },
    phone: {
      required: "Phone number is required",
      pattern: {
        value: /^[0-9]{10}$/,
        message: "Enter a valid 10 digit phone number",
      },
    },
    streetAddress: {
      required: "Street Address is required",
    },
    city: {
      required: "City is required",
    },
    state: {
      required: "State is required",
    },
    pincode: {
      required: "Pincode is required",
      pattern: {
        value: /^\d{6}$/,
        message: "Enter valid 6 digit pincode",
      },
    },
  };

  /* ================= ADD ADDRESS ================= */
  function handleAddressSubmit(data) {
    const addressDetails = {
      street: data.streetAddress,
      city: data.city,
      state: data.state,
      pinCode: data.pincode,
    };

    dispatch(addUserAddressAsync({ addressDetails }));
    resetAddress();
  }

  /* ================= UI ================= */
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* ================= LEFT ================= */}
      <div className="lg:col-span-2 space-y-8">
        {/* PERSONAL INFO */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-1">
            Personal Information
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Use a permanent address where you can receive mail
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <input
                {...registerPersonal("fullName", validation.fullName)}
                className="mt-1 w-full border rounded-md px-3 py-2"
              />
              {errorsPersonal.fullName && (
                <p className="text-xs text-red-500">
                  {errorsPersonal.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                {...registerPersonal("email", validation.email)}
                className="mt-1 w-full border rounded-md px-3 py-2"
              />
              {errorsPersonal.email && (
                <p className="text-xs text-red-500">
                  {errorsPersonal.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Phone</label>
              <input
                {...registerPersonal("phone", validation.phone)}
                className="mt-1 w-full border rounded-md px-3 py-2"
              />
              {errorsPersonal.phone && (
                <p className="text-xs text-red-500">
                  {errorsPersonal.phone.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ADD ADDRESS */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">
            Add New Address
          </h2>

          <form
            onSubmit={handleSubmitAddress(handleAddressSubmit)}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            <input
              {...registerAddress("streetAddress", validation.streetAddress)}
              placeholder="Street Address"
              className="border rounded-md px-3 py-2 col-span-full"
            />

            <input
              {...registerAddress("city", validation.city)}
              placeholder="City"
              className="border rounded-md px-3 py-2"
            />

            <input
              {...registerAddress("state", validation.state)}
              placeholder="State"
              className="border rounded-md px-3 py-2"
            />

            <input
              {...registerAddress("pincode", validation.pincode)}
              placeholder="Pincode"
              className="border rounded-md px-3 py-2"
            />

            <div className="col-span-full flex justify-end gap-3">
              <button
                type="button"
                onClick={resetAddress}
                className="px-4 py-2 border rounded-md"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 text-white rounded-md"
              >
                Add Address
              </button>
            </div>
          </form>
        </div>

        {/* SAVED ADDRESSES */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">
            Saved Addresses
          </h2>

          {userDetails?.address?.length ? (
            <div className="space-y-4">
              {userDetails.address.map((address, index) => (
                <label
                  key={uuid()}
                  className={`flex gap-3 p-4 rounded-lg border cursor-pointer ${
                    selectedAddressIndex === index
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-slate-200"
                  }`}
                >
                  <input
                    type="radio"
                    checked={selectedAddressIndex === index}
                    onChange={() => setSelectedAddressIndex(index)}
                  />
                  <div>
                    <p className="font-medium">{address.street}</p>
                    <p className="text-sm text-slate-600">
                      {address.city}, {address.state}
                    </p>
                    <p className="text-sm text-slate-600">
                      {address.pinCode}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <p className="text-slate-500">
              No saved addresses found
            </p>
          )}
        </div>

        {/* PAYMENT */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">
            Payment Method
          </h2>

          <div className="flex gap-6">
            {paymentMethods.map((method) => (
              <label
                key={method}
                className={`px-4 py-2 border rounded-lg cursor-pointer ${
                  paymentMethod === method
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  checked={paymentMethod === method}
                  onChange={() => setPaymentMethod(method)}
                  className="mr-2"
                />
                {method}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* ================= RIGHT ================= */}
      <div>
        <CartSummary
          selectedAddressIndex={selectedAddressIndex}
          paymentMethod={paymentMethod}
          watch={watchPersonal}
        />
      </div>
    </div>
  );
}
