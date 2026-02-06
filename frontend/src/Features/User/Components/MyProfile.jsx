import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserDetailsAsync,
  updateUserDetailsAsync,
  selectUserState,
} from "../UserSlice";
import { MdEdit, MdOutlineLocationOn } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useForm } from "react-hook-form";
import { Loader } from "../../../utils/Loader";
import { useNavigate } from "react-router-dom";

export function MyProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo, status } = useSelector(selectUserState);
  const user = userInfo || {};
  const addresses = Array.isArray(user.address) ? user.address : [];

  const [editField, setEditField] = useState(null);
  const [fieldValue, setFieldValue] = useState("");
  const [editAddressIndex, setEditAddressIndex] = useState(null);

  const { register, handleSubmit, setValue, reset } = useForm();

  useEffect(() => {
    dispatch(fetchUserDetailsAsync({ navigate }));
  }, [dispatch, navigate]);

  if (status === "loading") return <Loader />;

  /* ---------------- Profile Updates ---------------- */

  function updateProfileField(type) {
    if (!fieldValue.trim()) return alert("Value cannot be empty");

    const payload =
      type === "name"
        ? { fullName: fieldValue }
        : { phoneNumber: fieldValue };

    dispatch(updateUserDetailsAsync({ newData: payload, navigate }));
    setEditField(null);
  }

  /* ---------------- Address Handlers ---------------- */

  function removeAddress(index) {
    dispatch(
      updateUserDetailsAsync({
        newData: { address: addresses.filter((_, i) => i !== index) },
        navigate,
      })
    );
  }

  function editAddress(index) {
    const addr = addresses[index];
    setEditAddressIndex(index);
    setValue("street", addr.street);
    setValue("city", addr.city);
    setValue("state", addr.state);
    setValue("pincode", addr.pinCode);
  }

  function updateAddress(data) {
    const updated = addresses.map((addr, i) =>
      i === editAddressIndex
        ? {
            street: data.street,
            city: data.city,
            state: data.state,
            pinCode: data.pincode,
          }
        : addr
    );

    dispatch(updateUserDetailsAsync({ newData: { address: updated }, navigate }));
    setEditAddressIndex(null);
    reset();
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* ===== Header ===== */}
        <div>
          <h1 className="text-4xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-600 mt-1">
            Manage your personal information and saved addresses
          </p>
        </div>

        {/* ===== Profile Card ===== */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col sm:flex-row gap-6 items-start">
          
          {/* Avatar */}
          <div className="h-24 w-24 rounded-full bg-indigo-600 text-white flex items-center justify-center text-3xl font-bold">
            {user.fullName?.[0] || "U"}
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4 w-full">

            {/* Name */}
            <ProfileRow
              label="Full Name"
              value={user.fullName || "New User"}
              onEdit={() => {
                setEditField("name");
                setFieldValue(user.fullName || "");
              }}
            />

            {editField === "name" && (
              <InlineEdit
                value={fieldValue}
                setValue={setFieldValue}
                onSave={() => updateProfileField("name")}
              />
            )}

            {/* Email */}
            <div>
              <p className="text-sm text-slate-500">Email</p>
              <p className="font-semibold text-slate-800">{user.email}</p>
            </div>

            {/* Phone */}
            <ProfileRow
              label="Phone Number"
              value={user.phoneNumber || "Not added"}
              onEdit={() => {
                setEditField("phone");
                setFieldValue(user.phoneNumber || "");
              }}
            />

            {editField === "phone" && (
              <InlineEdit
                value={fieldValue}
                setValue={setFieldValue}
                onSave={() => updateProfileField("phone")}
              />
            )}
          </div>
        </div>

        {/* ===== Addresses ===== */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="text-2xl font-semibold mb-6">Saved Addresses</h2>

          {addresses.length === 0 && (
            <p className="text-slate-500">No saved addresses</p>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            {addresses.map((addr, index) => (
              <div
                key={index}
                className="border rounded-xl p-4 flex justify-between gap-4 hover:shadow-sm transition"
              >
                <div className="flex gap-3">
                  <MdOutlineLocationOn className="text-indigo-600 text-2xl mt-1" />
                  <div className="text-slate-700 text-sm">
                    <p>{addr.street}</p>
                    <p>
                      {addr.city}, {addr.state}
                    </p>
                    <p className="font-medium">{addr.pinCode}</p>
                  </div>
                </div>

                <div className="flex gap-3 text-slate-500">
                  <button
                    onClick={() => editAddress(index)}
                    className="hover:text-indigo-600"
                  >
                    <MdEdit />
                  </button>
                  <button
                    onClick={() => removeAddress(index)}
                    className="hover:text-red-600"
                  >
                    <RiDeleteBin6Line />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== Edit Address ===== */}
        {editAddressIndex !== null && (
          <form
            onSubmit={handleSubmit(updateAddress)}
            className="bg-white rounded-2xl shadow-sm border p-6 space-y-4"
          >
            <h2 className="text-xl font-semibold">Edit Address</h2>

            <input {...register("street", { required: true })} placeholder="Street" className="input" />
            <input {...register("city", { required: true })} placeholder="City" className="input" />
            <input {...register("state", { required: true })} placeholder="State" className="input" />
            <input {...register("pincode", { required: true })} placeholder="Pincode" className="input" />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditAddressIndex(null)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md">
                Update
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* ===== Small Reusable UI ===== */

function ProfileRow({ label, value, onEdit }) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="font-semibold text-slate-800">{value}</p>
      </div>
      <MdEdit
        className="cursor-pointer text-slate-400 hover:text-indigo-600"
        onClick={onEdit}
      />
    </div>
  );
}

function InlineEdit({ value, setValue, onSave }) {
  return (
    <div className="flex gap-3">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="border rounded-md px-3 py-2 w-full"
      />
      <button
        onClick={onSave}
        className="bg-indigo-600 text-white px-4 rounded-md"
      >
        Save
      </button>
    </div>
  );
}
