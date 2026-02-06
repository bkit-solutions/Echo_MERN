import { useDispatch } from "react-redux";
import {
  addItemToCartAsync,
  reduceCartItemQuantityAsync,
  removeCartItemAsync,
} from "../Cart/CartSlice";
import { useNavigate } from "react-router-dom";

export function ProductTile({ color, colorCode, product, quantity, size }) {
  const { _id, thumbnail, price, title, description, discountPercentage } =
    product;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const discountedPrice = Math.floor(
    ((100 - discountPercentage) / 100) * price
  );

  function addQuantityHandler(e) {
    e.stopPropagation();
    if (quantity === 5) return;

    const productDetails = {
      productId: _id,
      size,
      color,
      colorCode,
      quantity: 1,
    };

    dispatch(addItemToCartAsync({ productDetails, navigate }));
  }

  function reduceQuantityHandler(e) {
    e.stopPropagation();

    const productDetails = {
      productId: _id,
      size,
      color,
      colorCode,
      quantity: 1,
    };

    dispatch(reduceCartItemQuantityAsync({ productDetails, navigate }));
  }

  function removeItemHandler(e) {
    e.stopPropagation();

    const productDetails = {
      productId: _id,
      size,
      color,
      colorCode,
    };

    dispatch(removeCartItemAsync({ productDetails, navigate }));
  }

  return (
    <div className="flex gap-4 border-b border-slate-200 py-5">
      {/* Image */}
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-slate-50">
        <img
          src={thumbnail}
          alt={title}
          className="h-full w-full object-contain"
        />
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between gap-2">
        {/* Top Row */}
        <div className="flex justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-slate-800">
              {title}
            </h3>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>{size}</span>
              <span
                className="h-4 w-4 rounded-full border"
                style={{ backgroundColor: colorCode }}
                title={color}
              />
            </div>
          </div>

          <div className="text-sm font-semibold text-slate-900">
            ${discountedPrice}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-500 line-clamp-1">
          {description}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between">
          {/* Quantity */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Qty</span>

            <button
              onClick={reduceQuantityHandler}
              className="h-7 w-7 rounded-md border border-slate-300 text-sm font-medium hover:bg-slate-100"
            >
              −
            </button>

            <span className="w-6 text-center text-sm font-medium">
              {quantity}
            </span>

            <button
              onClick={addQuantityHandler}
              disabled={quantity === 5}
              className={`h-7 w-7 rounded-md border text-sm font-medium
                ${
                  quantity === 5
                    ? "cursor-not-allowed border-slate-200 text-slate-400"
                    : "border-slate-300 hover:bg-slate-100"
                }`}
            >
              +
            </button>
          </div>

          {/* Remove */}
          <button
            onClick={removeItemHandler}
            className="text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
