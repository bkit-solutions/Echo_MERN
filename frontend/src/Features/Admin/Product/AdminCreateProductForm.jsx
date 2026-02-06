import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  fetchAllBrandsAsync,
  fetchAllCategoriesAsync,
  selectCategories,
  selectBrands,
  addBrandAsync,
  addCategoryAsync,
} from "../../Product/ProductSlice";
import { uploadOnCloudinary } from "../../../utils/uploadOnCloudinary";
import { FaCloudUploadAlt } from "react-icons/fa";
import { createProductAsync } from "../AdminSlice";
import { useNavigate } from "react-router-dom";

export function AdminCreateProductForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
        { size: "", colors: [{ color: "", colorCode: "", stock: "" }] },
      ],
      deleted: false,
    },
  });

  const brands = useSelector(selectBrands);
  const categories = useSelector(selectCategories);

  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    dispatch(fetchAllBrandsAsync());
    dispatch(fetchAllCategoriesAsync());
  }, [dispatch]);

  /* ================= VALIDATIONS ================= */
  const validations = {
    title: { required: "Title is required" },
    price: { required: "Price is required", min: 0 },
    discountPercentage: { required: true, min: 0, max: 100 },
    description: { required: "Description is required" },
    brand: { required: "Brand is required" },
    category: { required: "Category is required" },
  };

  /* ================= IMAGE UPLOAD ================= */
  const imageUploadRefs = useRef([]);
  const thumbnailRef = useRef(null);

  const [uploading, setUploading] = useState({
    thumbnail: false,
    images: new Array(4).fill(false),
  });

  const uploadImage = async (file, index) => {
    setUploading((p) => ({
      ...p,
      images: p.images.map((v, i) => (i === index ? true : v)),
    }));

    const url = await uploadOnCloudinary(file);
    const images = getValues().images || new Array(4).fill("");

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

  const addColor = (i) => {
    const vars = watch("variations");
    vars[i].colors.push({ color: "", colorCode: "", stock: 0 });
    setValue("variations", vars);
  };

  const removeColor = (vi, ci) => {
    const vars = watch("variations");
    vars[vi].colors.splice(ci, 1);
    setValue("variations", vars);
  };

  /* ================= SUBMIT ================= */
  const submitHandler = (data) => {
    const totalStock = data.variations.reduce(
      (a, v) => a + v.colors.reduce((b, c) => b + Number(c.stock), 0),
      0
    );

    dispatch(
      createProductAsync({
        product: { ...data, stock: totalStock },
        navigate,
      })
    );
  };

  /* ================= ADD BRAND / CATEGORY ================= */
  const addBrand = async () => {
    if (!brand.trim()) return alert("Enter brand name");
    await dispatch(addBrandAsync({ label: brand, navigate }));
    setBrand("");
  };

  const addCategory = async () => {
    if (!category.trim()) return alert("Enter category name");
    await dispatch(addCategoryAsync({ label: category, navigate }));
    setCategory("");
  };

  return (
    <div className="max-w-6xl mx-auto my-6 bg-white p-6 rounded-xl shadow">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Create Product</h1>
          <p className="text-sm text-gray-500">
            Add product details, pricing and variations
          </p>
        </div>
        <button
          form="create-product-form"
          type="submit"
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold"
        >
          Save Product
        </button>
      </div>

      <form
        id="create-product-form"
        onSubmit={handleSubmit(submitHandler)}
        className="space-y-8"
      >
        {/* BASIC INFO */}
        <section className="border rounded-xl p-4">
          <h2 className="font-semibold mb-4">Basic Information</h2>

          <input
            {...register("title", validations.title)}
            placeholder="Product Title"
            className="input w-full mb-3"
          />

          <input
            {...register("description", validations.description)}
            placeholder="Description"
            className="input w-full"
          />
        </section>

        {/* PRICING */}
        <section className="border rounded-xl p-4">
          <h2 className="font-semibold mb-4">Pricing</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              {...register("price", validations.price)}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <select {...register("brand")} className="input">
              <option value="">Select Brand</option>
              {brands.map((b) => (
                <option key={b._id}>{b.label}</option>
              ))}
            </select>

            <select {...register("category")} className="input">
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c._id}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-4">
            <input
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="New Brand"
              className="input w-40"
            />
            <button type="button" onClick={addBrand} className="btn-primary">
              Add
            </button>

            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="New Category"
              className="input w-40"
            />
            <button type="button" onClick={addCategory} className="btn-primary">
              Add
            </button>
          </div>
        </section>

        {/* IMAGES */}
        <section className="border rounded-xl p-4">
          <h2 className="font-semibold mb-4">Images</h2>

          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 mb-2">
              <input
                {...register(`images.${i}`)}
                placeholder={`Image ${i + 1}`}
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
              placeholder="Thumbnail"
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
                    {...register(
                      `variations.${vi}.colors.${ci}.color`
                    )}
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
                    {...register(
                      `variations.${vi}.colors.${ci}.stock`
                    )}
                    type="number"
                    placeholder="Stock"
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
            Reset Form
          </button>
        </div>
      </form>
    </div>
  );
}
