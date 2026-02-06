import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  fetchProductDetailByIdAsync,
  selectProductById,
  updateProductAsync,
} from "../../ProductDetail/ProductDetailSlice";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  fetchAllBrandsAsync,
  fetchAllCategoriesAsync,
  selectCategories,
  selectBrands,
} from "../../Product/ProductSlice";
import { FaCloudUploadAlt } from "react-icons/fa";
import { uploadOnCloudinary } from "../../../utils/uploadOnCloudinary";

export function AdminEditProductForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productId } = useParams();

  const { product } = useSelector(selectProductById);
  const brands = useSelector(selectBrands);
  const categories = useSelector(selectCategories);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      variations: [
        { size: "", colors: [{ color: "", colorCode: "", stock: 0 }] },
      ],
      deleted: "false",
    },
  });

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    dispatch(fetchAllBrandsAsync());
    dispatch(fetchAllCategoriesAsync());
    dispatch(fetchProductDetailByIdAsync(productId, navigate));
  }, [dispatch, productId, navigate]);

  /* ================= SET PRODUCT ================= */
  useEffect(() => {
    if (!product) return;

    reset({
      title: product.title,
      price: product.price,
      discountPercentage: product.discountPercentage,
      description: product.description,
      brand: product.brand,
      category: product.category,
      images: product.images,
      thumbnail: product.thumbnail,
      variations: product.variations,
      deleted: String(product.deleted),
    });
  }, [product, reset]);

  /* ================= IMAGE UPLOAD ================= */
  const imageUploadRefs = useRef([]);
  const thumbnailRef = useRef(null);

  const [uploading, setUploading] = useState({
    images: [],
    thumbnail: false,
  });

  const uploadImage = async (file, index) => {
    setUploading((p) => ({
      ...p,
      images: p.images.map((v, i) => (i === index ? true : v)),
    }));

    const url = await uploadOnCloudinary(file);
    const images = [...getValues("images")];
    images[index] = url;
    setValue("images", images);

    setUploading((p) => ({
      ...p,
      images: p.images.map((v, i) => (i === index ? false : v)),
    }));
  };

  const uploadThumbnail = async (file) => {
    setUploading((p) => ({ ...p, thumbnail: true }));
    const url = await uploadOnCloudinary(file);
    setValue("thumbnail", url);
    setUploading((p) => ({ ...p, thumbnail: false }));
  };

  /* ================= VARIATIONS ================= */
  const addVariation = () => {
    setValue("variations", [
      ...watch("variations"),
      { size: "", colors: [{ color: "", colorCode: "", stock: 0 }] },
    ]);
  };

  const removeVariation = (i) => {
    setValue(
      "variations",
      watch("variations").filter((_, idx) => idx !== i)
    );
  };

  const addColor = (vi) => {
    const vars = [...watch("variations")];
    vars[vi].colors.push({ color: "", colorCode: "", stock: 0 });
    setValue("variations", vars);
  };

  const removeColor = (vi, ci) => {
    const vars = [...watch("variations")];
    vars[vi].colors.splice(ci, 1);
    setValue("variations", vars);
  };

  /* ================= SUBMIT ================= */
  const submitHandler = (data) => {
    if (!data.variations.length) {
      alert("At least one variation required");
      return;
    }

    const totalStock = data.variations.reduce(
      (a, v) => a + v.colors.reduce((b, c) => b + Number(c.stock), 0),
      0
    );

    dispatch(
      updateProductAsync({
        _id: productId,
        fieldsToBeUpdated: { ...data, stock: totalStock },
        navigate,
      })
    );
  };

  if (!product) return null;

  return (
    <div className="max-w-6xl mx-auto my-6 bg-white p-6 rounded-xl shadow">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <p className="text-sm text-gray-500">
            Update product details and variations
          </p>
        </div>
        <button
          form="edit-product-form"
          type="submit"
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold"
        >
          Save Changes
        </button>
      </div>

      <form
        id="edit-product-form"
        onSubmit={handleSubmit(submitHandler)}
        className="space-y-8"
      >
        {/* BASIC INFO */}
        <section className="border rounded-xl p-4">
          <h2 className="font-semibold mb-4">Basic Information</h2>

          <input
            {...register("title", { required: true })}
            placeholder="Title"
            className="input w-full mb-3"
          />

          <input
            {...register("description", { required: true })}
            placeholder="Description"
            className="input w-full"
          />
        </section>

        {/* PRICING */}
        <section className="border rounded-xl p-4">
          <h2 className="font-semibold mb-4">Pricing</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              {...register("price", { required: true })}
              placeholder="Price"
              className="input"
            />
            <input
              {...register("discountPercentage")}
              placeholder="Discount %"
              className="input"
            />
          </div>
        </section>

        {/* BRAND & CATEGORY */}
        <section className="border rounded-xl p-4">
          <h2 className="font-semibold mb-4">Brand & Category</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select {...register("brand")} className="input">
              <option value="">Select Brand</option>
              {brands.map((b) => (
                <option key={b._id} value={b.label}>
                  {b.label}
                </option>
              ))}
            </select>

            <select {...register("category")} className="input">
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c.label}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* IMAGES */}
        <section className="border rounded-xl p-4">
          <h2 className="font-semibold mb-4">Images</h2>

          {watch("images")?.map((_, i) => (
            <div key={i} className="flex items-center gap-3 mb-2">
              <input
                {...register(`images.${i}`)}
                className="input flex-1"
              />
              <FaCloudUploadAlt
                className="cursor-pointer"
                onClick={() => imageUploadRefs.current[i].click()}
              />
              <input
                type="file"
                hidden
                ref={(el) => (imageUploadRefs.current[i] = el)}
                onChange={(e) => uploadImage(e.target.files[0], i)}
              />
            </div>
          ))}

          <div className="flex items-center gap-3 mt-4">
            <input
              {...register("thumbnail")}
              className="input flex-1"
            />
            <FaCloudUploadAlt
              className="cursor-pointer"
              onClick={() => thumbnailRef.current.click()}
            />
            <input
              type="file"
              hidden
              ref={thumbnailRef}
              onChange={(e) => uploadThumbnail(e.target.files[0])}
            />
          </div>
        </section>

        {/* VARIATIONS */}
        <section className="border rounded-xl p-4 bg-gray-50">
          <h2 className="font-semibold mb-4">Variations</h2>

          {watch("variations").map((v, vi) => (
            <div key={vi} className="bg-white p-4 rounded mb-4 border">
              <div className="flex gap-2 mb-3">
                <input
                  {...register(`variations.${vi}.size`)}
                  placeholder="Size"
                  className="input w-32"
                />
                <button
                  type="button"
                  onClick={() => removeVariation(vi)}
                  className="btn-danger"
                >
                  Remove
                </button>
              </div>

              {v.colors.map((c, ci) => (
                <div key={ci} className="flex gap-2 mb-2">
                  <input
                    {...register(`variations.${vi}.colors.${ci}.color`)}
                    placeholder="Color"
                    className="input w-28"
                  />
                  <input
                    {...register(
                      `variations.${vi}.colors.${ci}.colorCode`
                    )}
                    placeholder="#FFFFFF"
                    className="input w-28"
                  />
                  <input
                    {...register(`variations.${vi}.colors.${ci}.stock`)}
                    type="number"
                    className="input w-24"
                  />
                  <button
                    type="button"
                    onClick={() => removeColor(vi, ci)}
                    className="btn-secondary"
                  >
                    X
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => addColor(vi)}
                className="btn-secondary mt-2"
              >
                Add Color
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addVariation}
            className="btn-primary"
          >
            Add Variation
          </button>
        </section>

        {/* ADVANCED */}
        <section className="border rounded-xl p-4 bg-red-50">
          <h2 className="font-semibold text-red-600 mb-2">
            Advanced Settings
          </h2>
          <select {...register("deleted")} className="input w-40">
            <option value="false">Active</option>
            <option value="true">Deleted</option>
          </select>
        </section>

        <div className="flex justify-end">
          <button type="button" onClick={reset} className="btn-secondary">
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
