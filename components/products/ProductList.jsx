"use client";

import Link from "next/link";

export default function ProductList({ products }) {
  return (
    <div className="space-y-4 md:hidden">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.id}`}
          className="block rounded-lg border bg-white p-4 shadow-sm transition hover:shadow-md"
        >
          <div className="flex gap-4">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="h-24 w-24 shrink-0 rounded-lg border object-contain"
            />

            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold text-gray-900">
                {product.title}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {product.category}
              </p>

              <p className="mt-2 font-semibold text-gray-900">
                ${product.price}
              </p>

              <div className="mt-2 flex gap-4 text-sm text-gray-600">
                <span>★ {product.rating}</span>
                <span>Stock: {product.stock}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}