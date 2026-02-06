export function CheckoutButton({ disabled = false, message = "Checkout" }) {
  return (
    <button
      disabled={disabled}
      className={`flex h-12 w-full items-center justify-center rounded-lg text-sm font-semibold transition
        ${
          disabled
            ? "cursor-not-allowed bg-slate-200 text-slate-400"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
    >
      {message}
    </button>
  );
}
