export function PriceDetail({ discountPercentage, price, className = "" }) {
  const discountedPrice = Math.floor(
    ((100 - discountPercentage) / 100) * price
  );

  const savings = price - discountedPrice;

  return (
    <div
      className={`mt-4 space-y-1 whitespace-nowrap overflow-hidden text-ellipsis ${className}`}
    >
      {/* Main price row */}
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-slate-900">
          ${discountedPrice}
        </span>

        <span className="text-sm text-slate-500 line-through">
          ${price}
        </span>

        {/* Discount badge */}
        {discountPercentage > 0 && (
          <span className="ml-1 rounded-md bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
            {discountPercentage}% OFF
          </span>
        )}
      </div>

      {/* Savings */}
      {discountPercentage > 0 && (
        <div className="text-sm font-medium text-emerald-600">
          You save ${savings}
        </div>
      )}

      {/* Tax info */}
      <div className="text-xs text-slate-500">
        Inclusive of all taxes
      </div>
    </div>
  );
}
