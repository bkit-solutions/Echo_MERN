import { FaStarHalfAlt } from "react-icons/fa";
import { PriceDetail } from "../../Common/PriceDetailTile";
import { SizeBadge } from "./SizeBadge";
import { v4 as uuid } from "uuid";
import { AddToCartButton } from "../../Common/Buttons/AddToCartButton";
import { AddToWishlistButton } from "../../Common/Buttons/AddToWishlistButton";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addItemToCartAsync,
  selectCartStatus,
} from "../../Cart/CartSlice";
import { useParams, useNavigate } from "react-router-dom";
import { selectLoggedInUser } from "../../Auth/AuthSlice";
import {
  selectWishlistItems,
  removeFromWishlistAsync,
  addToWishlistAsync,
} from "../../Wishlist/WishlistSlice";

export function ProductInfoSection({
  _id,
  title,
  brand,
  description,
  stock,
  rating,
  price,
  discountPercentage,
  variations,
}) {
  const MAX_CHAR_LIMIT = 300;

  const [selectedProductIndex, setSelectedProductIndex] = useState(null);
  const [selectedColorIndex, setSelectedColorIndex] = useState(null);
  const [readMore, setReadMore] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productId } = useParams();

  const user = useSelector(selectLoggedInUser);
  const addToCartStatus = useSelector(selectCartStatus);

  /* ---------------- Wishlist logic ---------------- */
  let wishlistItems = [];
  let isProductInWishlist = false;

  if (user && user.role !== "admin") {
    wishlistItems = useSelector(selectWishlistItems);
    isProductInWishlist = wishlistItems?.some(
      (item) => item._id.toString() === _id.toString()
    );
  }

  /* ---------------- Effects ---------------- */

  // reset color when size changes
  useEffect(() => {
    setSelectedColorIndex(null);
  }, [selectedProductIndex]);

  // default size with stock
  useEffect(() => {
    variations.find(({ colors }, sizeIndex) => {
      const totalStock = colors.reduce(
        (acc, curr) => acc + curr.stock,
        0
      );
      if (totalStock > 0) {
        setSelectedProductIndex(sizeIndex);
        return true;
      }
      return false;
    });
  }, [variations]);

  // default color with stock
  useEffect(() => {
    if (selectedProductIndex === null) return;

    variations[selectedProductIndex].colors.find(
      ({ stock }, colorIndex) => {
        if (stock > 0) {
          setSelectedColorIndex(colorIndex);
          return true;
        }
        return false;
      }
    );
  }, [selectedProductIndex, variations]);

  /* ---------------- Handlers ---------------- */

  function addOrRemoveFromWishlistHandler() {
    if (isProductInWishlist) {
      dispatch(removeFromWishlistAsync({ productId: _id, navigate }));
    } else {
      dispatch(addToWishlistAsync({ productId: _id, navigate }));
    }
  }

  function addToCartHandler() {
    if (selectedProductIndex === null) {
      alert("Select size");
      return;
    }
    if (selectedColorIndex === null) {
      alert("Select color");
      return;
    }

    const productDetails = {
      productId: _id || productId,
      size: variations[selectedProductIndex].size,
      color:
        variations[selectedProductIndex].colors[selectedColorIndex].color,
      colorCode:
        variations[selectedProductIndex].colors[selectedColorIndex]
          .colorCode,
      quantity: 1,
    };

    dispatch(addItemToCartAsync({ productDetails, navigate }));
  }

  function truncateDescription(text) {
    if (text.length <= MAX_CHAR_LIMIT) return text;
    return readMore ? text.slice(0, MAX_CHAR_LIMIT) + "…" : text;
  }

  return (
    <div className="flex flex-col gap-6 px-2 lg:px-0">
      {/* Title */}
      <h1 className="text-2xl font-semibold text-slate-900">
        {title}{" "}
        <span className="text-slate-500 font-medium">
          by {brand.toUpperCase()}
        </span>
      </h1>

      {/* Description */}
      <p className="text-slate-600 text-sm leading-relaxed">
        {truncateDescription(description)}
        {description.length > MAX_CHAR_LIMIT && (
          <button
            onClick={() => setReadMore((p) => !p)}
            className="ml-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            {readMore ? "Read more" : "Read less"}
          </button>
        )}
      </p>

      {/* Rating */}
      <div className="flex items-center gap-2 text-sm text-slate-700">
        <span>{rating}</span>
        <FaStarHalfAlt className="text-blue-600" />
      </div>

      {/* Price */}
      <PriceDetail
        discountPercentage={discountPercentage}
        price={price}
      />

      {/* Stock */}
      {!stock && (
        <p className="text-sm font-semibold text-red-600">
          Out of stock
        </p>
      )}

      {/* Variants */}
      {stock > 0 && (
        <>
          {/* Sizes */}
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Available Sizes
            </h3>
            <ul className="flex flex-wrap gap-3">
              {variations.map(({ size, colors }, index) => {
                const totalStock = colors.reduce(
                  (acc, curr) => acc + curr.stock,
                  0
                );

                if (totalStock > 0) {
                  return (
                    <SizeBadge
                      key={uuid()}
                      size={size}
                      index={index}
                      quantity={totalStock}
                      selectedProductIndex={selectedProductIndex}
                      setSelectedProductIndex={setSelectedProductIndex}
                      setSelectedColorIndex={setSelectedColorIndex}
                    />
                  );
                }
                return null;
              })}
            </ul>
          </div>

          {/* Colors */}
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Available Colors
            </h3>
            <ul className="flex flex-wrap gap-4">
              {selectedProductIndex !== null &&
                variations[selectedProductIndex].colors.map(
                  ({ color, colorCode, stock }, index) =>
                    stock > 0 && (
                      <li key={uuid()} className="text-center">
                        <div
                          onClick={() =>
                            setSelectedColorIndex(index)
                          }
                          className={`mx-auto mb-1 h-10 w-10 rounded-full cursor-pointer border flex items-center justify-center
                            ${
                              selectedColorIndex === index
                                ? "border-blue-600 ring-2 ring-blue-200"
                                : "border-slate-300"
                            }`}
                        >
                          <div
                            className="h-7 w-7 rounded-full"
                            style={{ backgroundColor: colorCode }}
                          />
                        </div>
                        <span className="text-xs text-slate-600 capitalize">
                          {color}
                        </span>
                      </li>
                    )
                )}
            </ul>
          </div>
        </>
      )}

      {/* Actions */}
      {!user ||
        (user?.role !== "admin" && (
          <>
            <div className="mt-6 flex flex-col gap-4 max-w-md">
              <div onClick={addToCartHandler}>
                {stock > 0 && (
                  <AddToCartButton
                    message={
                      addToCartStatus === "loading"
                        ? "Adding to Cart…"
                        : "Add to Cart"
                    }
                  />
                )}
              </div>

              <div onClick={addOrRemoveFromWishlistHandler}>
                <AddToWishlistButton
                  message={
                    isProductInWishlist
                      ? "Remove from Wishlist"
                      : "Add to Wishlist"
                  }
                />
              </div>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Max quantity allowed per variation: 5
            </p>
          </>
        ))}
    </div>
  );
}
