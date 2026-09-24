export default function ProductCard({ product }) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex gap-4">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-20 w-20 rounded object-cover"
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
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t pt-3">
        <div>
          <p className="text-xs text-gray-500">Rating</p>
          <p className="text-sm font-medium text-gray-900">
            {product.rating}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Stock</p>
          <p className="text-sm font-medium text-gray-900">
            {product.stock}
          </p>
        </div>
      </div>
    </div>
  );
}