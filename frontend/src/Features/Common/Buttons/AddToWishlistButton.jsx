import { FaHeart } from "react-icons/fa";

export function AddToWishlistButton({
  message = "Add to Wishlist",
  disabled = false,
}) {
  return (
    <button
      disabled={disabled}
      className={`group flex h-12 w-full items-center justify-center gap-2 rounded-lg border text-sm font-semibold transition
        ${
          disabled
            ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
            : "border-slate-700 bg-slate-700 text-white hover:bg-slate-800 hover:border-slate-800"
        }`}
    >
      <FaHeart className="h-4 w-4 transition group-hover:scale-110" />
      {message}
    </button>
  );
}
