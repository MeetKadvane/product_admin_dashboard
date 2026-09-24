"use client";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="w-full">
      <label
        htmlFor="product-search"
        className="mb-1 block text-sm font-medium text-gray-800"
      >
        Search products
      </label>

      <input
        id="product-search"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by product name..."
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-500 outline-none focus:border-black focus:ring-2 focus:ring-gray-200"
      />
    </div>
  );
}