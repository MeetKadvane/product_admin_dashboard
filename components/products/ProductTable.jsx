"use client";

import Link from "next/link";

export default function ProductTable({ products }) {
  return (
    <div className="hidden overflow-hidden rounded-lg border bg-white md:block">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                Product
              </th>

              <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                Category
              </th>

              <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                Price
              </th>

              <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                Rating
              </th>

              <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                Stock
              </th>

              <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <Link
                    href={`/products/${product.id}`}
                    className="flex items-center gap-3"
                  >
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="h-12 w-12 rounded-lg border object-contain"
                    />

                    <span className="font-medium text-gray-900 hover:underline">
                      {product.title}
                    </span>
                  </Link>
                </td>

                <td className="px-4 py-4 text-sm text-gray-600">
                  {product.category}
                </td>

                <td className="px-4 py-4 text-sm font-medium text-gray-900">
                  ${product.price}
                </td>

                <td className="px-4 py-4 text-sm text-gray-600">
                  ★ {product.rating}
                </td>

                <td className="px-4 py-4 text-sm text-gray-600">
                  {product.stock}
                </td>

                <td className="px-4 py-4">
                  <Link
                    href={`/products/${product.id}`}
                    className="text-sm font-medium text-gray-700 hover:text-black hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}