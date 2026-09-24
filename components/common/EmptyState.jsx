export default function EmptyState() {
  return (
    <div className="rounded-lg border bg-white p-8 text-center">
      <h3 className="font-semibold text-gray-900">
        No products found
      </h3>

      <p className="mt-2 text-sm text-gray-500">
        There are no products to display.
      </p>
    </div>
  );
}