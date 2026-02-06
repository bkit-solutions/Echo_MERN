import { useState } from "react";
import { v4 as uuid } from "uuid";

export function ProductImageSection({ images = [] }) {
  const [mainImageIndex, setMainImageIndex] = useState(0);

  function handleImageClick(index) {
    setMainImageIndex(index);
  }

  if (!images.length) return null;

  return (
    <div className="flex w-full flex-col-reverse gap-4 lg:flex-row lg:gap-6">
      {/* Thumbnails */}
      <div className="flex flex-row gap-2 overflow-x-auto lg:w-24 lg:flex-col lg:overflow-visible">
        {images.map((img, index) => (
          <button
            key={uuid()}
            onClick={() => handleImageClick(index)}
            className={`flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg border transition
              ${
                index === mainImageIndex
                  ? "border-blue-600 ring-2 ring-blue-200"
                  : "border-slate-200 hover:border-slate-400"
              }`}
          >
            <img
              src={img}
              alt={`product-thumbnail-${index + 1}`}
              className="h-full w-full rounded-md object-contain"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-4">
        <img
          src={images[mainImageIndex]}
          alt={`product-main-${mainImageIndex + 1}`}
          className="max-h-[420px] w-full object-contain transition"
        />
      </div>
    </div>
  );
}
