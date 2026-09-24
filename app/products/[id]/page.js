"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Navbar from "../../../components/Navbar";

import Loader from "../../../components/common/Loader";
import ErrorState from "../../../components/common/ErrorState";

import {
  getProductById,
  deleteProduct,
} from "../../../services/productService";
import {
  deleteStoredProduct,
  getStoredProduct,
  isProductDeleted,
} from "../../../lib/productStore";
import { isAuthenticated } from "../../../lib/auth";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    const fetchProduct = async () => {
  setLoading(true);
  setError("");

  try {
    // Check if this product was deleted locally.
    if (isProductDeleted(params.id)) {
      setProduct(null);
      setError("Product not found.");
      return;
    }

    // Check for locally created or edited product first.
    const storedProduct = getStoredProduct(params.id);

    if (storedProduct) {
      setProduct(storedProduct);
      return;
    }

    // Otherwise load the product from DummyJSON.
    const data = await getProductById(params.id);
    setProduct(data);
  } catch (error) {
    console.error("Failed to load product:", error);

    setError(
      error.response?.status === 404
        ? "Product not found."
        : error.response?.data?.message ||
            "Unable to load product. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

    if (params.id) {
      fetchProduct();
    }
  }, [params.id, router]);

  const handleDelete = async () => {
    if (deleting) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.title}"?`
    );

    if (!confirmed) return;

    setDeleting(true);
    setDeleteError("");
    setSuccess("");

    try {
      const response = await deleteProduct(product.id);

console.log("Deleted product:", response);

deleteStoredProduct(product.id);

setSuccess("Product deleted successfully.");

      setTimeout(() => {
        router.push("/products");
      }, 1500);
    } catch (error) {
      console.error("Failed to delete product:", error);

      setDeleteError(
        error.response?.data?.message ||
          "Unable to delete product. Please try again."
      );

      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />

        <main className="mx-auto max-w-7xl px-4 py-8">
          <Loader />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />

        <main className="mx-auto max-w-7xl px-4 py-8">
          <ErrorState
            message={error}
            onRetry={() => window.location.reload()}
          />

          <div className="mt-4 text-center">
            <button
              onClick={() => router.push("/products")}
              className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              Back to Products
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8">
        <button
          onClick={() => router.push("/products")}
          className="mb-6 text-sm font-medium text-gray-700 hover:text-black"
        >
          ← Back to Products
        </button>

        {success && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        {deleteError && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {deleteError}
          </div>
        )}

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Product Images */}
            <div>
              <div className="overflow-hidden rounded-xl border bg-gray-50">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="h-[400px] w-full object-contain p-6"
                />
              </div>

              {product.images?.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {product.images.slice(0, 4).map((image, index) => (
                    <div
                      key={index}
                      className="overflow-hidden rounded-lg border bg-gray-50"
                    >
                      <img
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        className="h-24 w-full object-contain p-2"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Information */}
            <div>
              <div className="mb-3">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  {product.category}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900">
                {product.title}
              </h1>

              <div className="mt-4 flex items-center gap-4">
                <p className="text-2xl font-bold text-gray-900">
                  ${product.price}
                </p>

                <span className="rounded bg-yellow-100 px-2 py-1 text-sm font-medium text-yellow-800">
                  ★ {product.rating}
                </span>
              </div>

              <div className="mt-6 border-t pt-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Description
                </h2>

                <p className="mt-2 leading-7 text-gray-600">
                  {product.description}
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 border-t pt-6">
                <div>
                  <p className="text-sm text-gray-500">Stock</p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {product.stock}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Brand</p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {product.brand || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Discount</p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {product.discountPercentage}%
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">SKU</p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {product.sku || "N/A"}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex flex-col gap-3 border-t pt-6 sm:flex-row">
                <button
                  onClick={() =>
                    router.push(`/products/${product.id}/edit`)
                  }
                  disabled={deleting}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Edit Product
                </button>

                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Delete Product"}
                </button>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="mt-10 border-t pt-8">
            <h2 className="text-xl font-bold text-gray-900">
              Reviews
            </h2>

            {!product.reviews || product.reviews.length === 0 ? (
              <p className="mt-4 text-gray-500">
                No reviews available.
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                {product.reviews.map((review, index) => (
                  <div
                    key={index}
                    className="rounded-lg border bg-gray-50 p-4"
                  >
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <p className="font-semibold text-gray-900">
                        {review.reviewerName}
                      </p>

                      <span className="text-sm text-yellow-700">
                        ★ {review.rating}
                      </span>
                    </div>

                    <p className="mt-2 text-gray-600">
                      {review.comment}
                    </p>

                    <p className="mt-2 text-xs text-gray-400">
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}