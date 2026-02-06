import { FaShoppingBag } from "react-icons/fa";

export function AddToCartButton({
  message = "Add to Cart",
  disabled = false,
}) {
  return (
    <button
      disabled={disabled}
      className={`group flex h-12 w-full items-center justify-center gap-2 rounded-lg border text-sm font-semibold transition
        ${
          disabled
            ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
            : "border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:border-blue-700"
        }`}
    >
      <FaShoppingBag className="h-4 w-4 transition group-hover:scale-110" />
      {message}
    </button>
  );
}
