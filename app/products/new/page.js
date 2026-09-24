"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "../../../components/Navbar";
import Loader from "../../../components/common/Loader";

import { addProduct } from "../../../services/productService";
import { isAuthenticated } from "../../../lib/auth";
import { addCreatedProduct } from "../../../lib/productStore";

export default function NewProductPage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    brand: "",
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    setCheckingAuth(false);
  }, [router]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      return "Product title is required.";
    }

    if (!formData.description.trim()) {
      return "Product description is required.";
    }

    if (!formData.category.trim()) {
      return "Product category is required.";
    }

    if (formData.price === "") {
      return "Price is required.";
    }

    if (Number(formData.price) <= 0) {
      return "Price must be greater than 0.";
    }

    if (formData.stock === "") {
      return "Stock is required.";
    }

    if (Number(formData.stock) < 0) {
      return "Stock cannot be negative.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) return;

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);

    try {
      const product = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        brand: formData.brand.trim(),
        price: Number(formData.price),
        stock: Number(formData.stock),
      };

const createdProduct = await addProduct(product);

console.log("Created product:", createdProduct);

// Store the created product locally because DummyJSON
// does not permanently persist POST operations.
addCreatedProduct(createdProduct);

setSuccess(
  `Product "${createdProduct.title}" was created successfully.`
);

setTimeout(() => {
  router.push("/products");
}, 1500);
    } catch (error) {
      console.error("Failed to add product:", error);

      setError(
        error.response?.data?.message ||
          "Unable to add product. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <button
          type="button"
          onClick={() => router.push("/products")}
          className="mb-6 text-sm font-medium text-gray-700 hover:text-black"
        >
          ← Back to Products
        </button>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Add Product
            </h1>

            <p className="mt-1 text-gray-600">
              Create a new product.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="title"
                className="mb-1 block text-sm font-medium text-gray-800"
              >
                Title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter product title"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 outline-none focus:border-black focus:ring-2 focus:ring-gray-200"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-1 block text-sm font-medium text-gray-800"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 outline-none focus:border-black focus:ring-2 focus:ring-gray-200"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="price"
                  className="mb-1 block text-sm font-medium text-gray-800"
                >
                  Price
                </label>

                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 outline-none focus:border-black focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <div>
                <label
                  htmlFor="stock"
                  className="mb-1 block text-sm font-medium text-gray-800"
                >
                  Stock
                </label>

                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 outline-none focus:border-black focus:ring-2 focus:ring-gray-200"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="category"
                  className="mb-1 block text-sm font-medium text-gray-800"
                >
                  Category
                </label>

                <input
                  id="category"
                  name="category"
                  type="text"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. smartphones"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 outline-none focus:border-black focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <div>
                <label
                  htmlFor="brand"
                  className="mb-1 block text-sm font-medium text-gray-800"
                >
                  Brand
                </label>

                <input
                  id="brand"
                  name="brand"
                  type="text"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="Enter brand"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 outline-none focus:border-black focus:ring-2 focus:ring-gray-200"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => router.push("/products")}
                disabled={saving}
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Product"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}