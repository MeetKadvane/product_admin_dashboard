"use client";

export default function ProductFilters({
  category,
  categories,
  sort,
  onCategoryChange,
  onSortChange,
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <label
          htmlFor="category"
          className="mb-1 block text-sm font-medium text-gray-800"
        >
          Category
        </label>

        <select
          id="category"
          value={category}
          onChange={(event) =>
            onCategoryChange(event.target.value)
          }
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-black focus:ring-2 focus:ring-gray-200"
        >
          <option value="">All Categories</option>

          {categories.map((item) => (
            <option
              key={item.slug}
              value={item.slug}
            >
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="sort"
          className="mb-1 block text-sm font-medium text-gray-800"
        >
          Sort
        </label>

        <select
          id="sort"
          value={sort}
          onChange={(event) =>
            onSortChange(event.target.value)
          }
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-black focus:ring-2 focus:ring-gray-200"
        >
          <option value="">Default</option>

          <option value="price-asc">
            Price: Low to High
          </option>

          <option value="price-desc">
            Price: High to Low
          </option>

          <option value="rating-asc">
            Rating: Low to High
          </option>

          <option value="rating-desc">
            Rating: High to Low
          </option>

          <option value="title-asc">
            Title: A to Z
          </option>

          <option value="title-desc">
            Title: Z to A
          </option>
        </select>
      </div>
    </div>
  );
}