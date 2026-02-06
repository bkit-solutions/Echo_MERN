import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { updateProductAsync } from "../ProductDetail/ProductDetailSlice";
import { selectLoggedInUser } from "../Auth/AuthSlice";
import {
  selectWishlistItems,
  removeFromWishlistAsync,
  addToWishlistAsync,
} from "../Wishlist/WishlistSlice";

export function ProductCard({
  _id,
  thumbnail,
  title,
  brand,
  discountPercentage,
  stock,
  price,
  deleted,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [addOrDeleteProductStatus, setAddOrDeleteProductStatus] =
    useState(false);
  const [isDeleted, setIsDeleted] = useState(deleted);

  const user = useSelector(selectLoggedInUser);

  /* ---------------- Wishlist logic ---------------- */
  let wishlistItems = [];
  let isProductInWishlist = false;

  if (user && user.role !== "admin") {
    wishlistItems = useSelector(selectWishlistItems);
    isProductInWishlist = wishlistItems?.some(
      (item) => item._id.toString() === _id.toString()
    );
  }

  /* ---------------- Handlers ---------------- */
  function clickHandler() {
    navigate(`/products/${_id}`);
  }

  function editProductHandler(e) {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/admin/product/${_id}`);
  }

  async function ProductStatusHandler(e) {
    e.preventDefault();
    e.stopPropagation();

    setAddOrDeleteProductStatus(true);

    const response = await dispatch(
      updateProductAsync({
        _id,
        fieldsToBeUpdated: { deleted: !isDeleted },
        navigate,
      })
    );

    if (response?.payload?.data?.statusCode === 200) {
      setIsDeleted((prev) => !prev);
    }

    setAddOrDeleteProductStatus(false);
  }

  function handleAddOrRemoveFromWishlist(e) {
    e.preventDefault();
    e.stopPropagation();

    if (isProductInWishlist) {
      dispatch(removeFromWishlistAsync({ productId: _id, navigate }));
    } else {
      dispatch(addToWishlistAsync({ productId: _id, navigate }));
    }
  }

  /* ---------------- Price calc ---------------- */
  const discountedPrice = Math.floor(
    ((100 - discountPercentage) / 100) * price
  );

  return (
    <div
      onClick={clickHandler}
      className="group relative w-full max-w-64 cursor-pointer rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:shadow-lg"
    >
      {/* Wishlist */}
      {user && user.role !== "admin" && (
        <button
          onClick={handleAddOrRemoveFromWishlist}
          className="absolute right-3 top-3 z-10 rounded-full bg-white p-1 shadow hover:scale-110 transition"
        >
          <img
            src={
              isProductInWishlist
                ? "https://img.icons8.com/?size=100&id=7697&format=png&color=3056d3"
                : "https://img.icons8.com/?size=100&id=87&format=png&color=000000"
            }
            alt="wishlist"
            className="h-6 w-6"
          />
        </button>
      )}

      {/* Image */}
      <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-lg bg-slate-50">
        <img
          src={thumbnail}
          alt={title}
          className="h-full object-contain transition-transform duration-300 group-hover:scale-105"
        />

        {discountPercentage > 0 && (
          <span className="absolute left-2 top-2 rounded-md bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">
            {discountPercentage}% OFF
          </span>
        )}
      </div>

      {/* Details */}
      <div className="mt-3 space-y-1">
        <p className="text-xs font-semibold text-slate-500 truncate">
          {brand}
        </p>
        <h3 className="text-sm font-medium text-slate-800 truncate">
          {title}
        </h3>

        {/* Price */}
        <div className="mt-1 flex items-center gap-2">
          <span className="text-lg font-bold text-slate-900">
            ${discountedPrice}
          </span>
          <span className="text-xs text-slate-500 line-through">
            ${price}
          </span>
        </div>

        {/* Stock */}
        {stock === 0 && (
          <p className="text-xs font-semibold text-red-600">
            Out of stock
          </p>
        )}
      </div>

      {/* Admin actions */}
      {user && user.role === "admin" && (
        <div className="mt-3 flex gap-2">
          <button
            onClick={editProductHandler}
            className="flex-1 rounded-md bg-blue-600 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
          >
            Edit
          </button>

          <button
            onClick={ProductStatusHandler}
            className="flex-1 rounded-md bg-slate-700 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
          >
            {addOrDeleteProductStatus
              ? isDeleted
                ? "Adding…"
                : "Deleting…"
              : isDeleted
              ? "Add"
              : "Delete"}
          </button>
        </div>
      )}

      {/* Deleted label */}
      {user && user.role === "admin" && isDeleted && (
        <p className="mt-2 text-xs font-semibold text-red-600">
          Deleted
        </p>
      )}
    </div>
  );
}
