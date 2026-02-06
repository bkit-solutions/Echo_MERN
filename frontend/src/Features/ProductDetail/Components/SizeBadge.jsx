export function SizeBadge({
  size,
  quantity,
  index,
  setSelectedProductIndex,
  selectedProductIndex,
  setSelectedColorIndex,
  className = "",
}) {
  function handleBadgeClick() {
    if (!quantity) return;

    setSelectedProductIndex(index);
    if (index !== selectedProductIndex) {
      setSelectedColorIndex(null);
    }
  }

  const isSelected = selectedProductIndex === index;
  const isDisabled = !quantity;

  return (
    <button
      type="button"
      onClick={handleBadgeClick}
      disabled={isDisabled}
      className={`min-w-[44px] rounded-lg border px-3 py-2 text-sm font-semibold transition
        ${isSelected
          ? "border-blue-600 bg-blue-600 text-white"
          : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"}
        ${isDisabled
          ? "cursor-not-allowed bg-slate-100 text-slate-400 hover:border-slate-300"
          : "cursor-pointer"}
        ${className}`}
    >
      {size}
    </button>
  );
}
