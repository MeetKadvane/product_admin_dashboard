export default function Loader() {
  return (
    <div className="flex items-center justify-center rounded-lg border bg-white py-16">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-black" />

        <p className="mt-3 text-sm text-gray-500">
          Loading products...
        </p>
      </div>
    </div>
  );
}