import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  selectWishlistItems,
  fetchAllWishlistItemsAsync,
  removeFromWishlistAsync,
  selectWishlistStatus,
} from "./WishlistSlice";
import { Loader } from "../../utils/Loader";
import { FaHeart, FaTrashAlt } from "react-icons/fa";

export function Wishlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const wishlistItems = useSelector(selectWishlistItems) || [];
  const status = useSelector(selectWishlistStatus);

  useEffect(() => {
    dispatch(fetchAllWishlistItemsAsync({ navigate }));
  }, [dispatch, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3">
              <FaHeart className="text-pink-500" />
              My Wishlist
            </h1>
            <p className="text-slate-600 mt-1">
              {wishlistItems.length} item{wishlistItems.length !== 1 && "s"} saved for later
            </p>
          </div>
        </div>

        {/* ================= CONTENT ================= */}
        {status === "loading" ? (
          <Loader />
        ) : wishlistItems.length === 0 ? (
          <EmptyWishlist />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {wishlistItems.map((product) => (
              <WishlistItemCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ================================================= */
/* ================= ITEM CARD ===================== */
/* ================================================= */

function WishlistItemCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    _id,
    thumbnail,
    title,
    brand,
    discountPercentage,
    price,
  } = product;

  function removeHandler(e) {
    e.stopPropagation();
    dispatch(removeFromWishlistAsync({ productId: _id, navigate }));
  }

  const discountedPrice = Math.floor(
    ((100 - discountPercentage) / 100) * price
  );

  return (
    <div
      onClick={() => navigate(`/products/${_id}`)}
      className="group cursor-pointer bg-white rounded-xl border shadow-sm hover:shadow-lg transition-all overflow-hidden"
    >
      {/* Image */}
      <div className="h-[180px] bg-slate-100 flex items-center justify-center overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Details */}
      <div className="p-3 space-y-1">
        <p className="text-xs text-slate-500 font-medium">{brand}</p>
        <p className="text-sm font-semibold text-slate-800 line-clamp-1">
          {title}
        </p>

        {/* Price */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-bold text-slate-900">
            ${discountedPrice}
          </span>
          <span className="text-xs text-slate-400 line-through">
            ${price}
          </span>
          <span className="text-xs text-indigo-600 font-semibold">
            {discountPercentage}% OFF
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-3 pb-3">
        <button
          onClick={removeHandler}
          className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-red-600 border border-red-200 rounded-md py-2 hover:bg-red-50 transition"
        >
          <FaTrashAlt />
          Remove
        </button>
      </div>
    </div>
  );
}

/* ================================================= */
/* ================= EMPTY STATE =================== */
/* ================================================= */

function EmptyWishlist() {
  return (
    <div className="bg-white rounded-2xl border shadow-sm py-20 flex flex-col items-center gap-6">
      <FaHeart className="text-pink-400 text-6xl" />
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">
          Your wishlist is empty
        </h2>
        <p className="text-slate-500">
          Save items you love and come back to them anytime
        </p>
      </div>
      <Link
        to="/products"
        className="px-6 py-3 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 transition"
      >
        Explore Products
      </Link>
    </div>
  );
}
