import { ProductInfoSection } from "./ProductInfoSection";
import { ProductImageSection } from "./ProductImagesSection";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

import {
  fetchProductDetailByIdAsync,
  selectProductById,
} from "../ProductDetailSlice";

import { Loader } from "../../../utils/Loader";

export function ProductDetail() {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const selectedProduct = useSelector(selectProductById);

  useEffect(() => {
    dispatch(fetchProductDetailByIdAsync(productId));
  }, [dispatch, productId]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Loading */}
      {selectedProduct.status === "loading" && (
        <div className="flex justify-center py-20">
          <Loader />
        </div>
      )}

      {/* Error */}
      {selectedProduct.error && (
        <p className="text-center text-red-600 font-medium">
          {selectedProduct.error}
        </p>
      )}

      {/* Product */}
      {selectedProduct?.product && (
        <>
          {/* Main Section */}
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Images */}
            <div className="lg:w-1/2">
              <ProductImageSection
                images={selectedProduct.product.images}
              />
            </div>

            {/* Info */}
            <div className="lg:w-1/2">
              <ProductInfoSection {...selectedProduct.product} />
            </div>
          </div>

          {/* Highlights */}
          <div className="mt-14 rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              Highlights
            </h2>

            <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
              <li>
                Premium build quality designed for long-term durability
              </li>
              <li>
                Carefully tested to meet performance and safety standards
              </li>
              <li>
                Optimized for everyday use with reliable performance
              </li>
              <li>
                Backed by manufacturer support and warranty coverage
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
