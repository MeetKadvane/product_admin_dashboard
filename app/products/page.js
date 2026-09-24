"use client";

import { useEffect, useState } from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import Navbar from "../../components/Navbar";

import ProductTable from "../../components/products/ProductTable";
import ProductList from "../../components/products/ProductList";
import Pagination from "../../components/products/Pagination";
import SearchBar from "../../components/products/SearchBar";
import ProductFilters from "../../components/products/ProductFilters";

import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";

import { isAuthenticated } from "../../lib/auth";

import {
  getProducts,
  getCategories,
  getProductsByCategory,
  searchProducts,
} from "../../services/productService";

import useDebounce from "../../hooks/useDebounce";
import {
  applyProductMutations,
  getProductMutations,
} from "../../lib/productStore";

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [error, setError] = useState("");

  const rawPage = Number(searchParams.get("page"));
  const rawLimit = Number(searchParams.get("limit"));

  const urlSearch =
    searchParams.get("search") || "";

  const urlCategory =
    searchParams.get("category") || "";

  const urlSort =
    searchParams.get("sort") || "";

  const currentPage =
    Number.isInteger(rawPage) && rawPage >= 1
      ? rawPage
      : 1;

  const pageSize =
    [10, 20, 50].includes(rawLimit)
      ? rawLimit
      : 10;

  const [searchInput, setSearchInput] =
    useState(urlSearch);

  const debouncedSearch =
    useDebounce(searchInput, 500);

  const totalPages = Math.max(
    1,
    Math.ceil(totalProducts / pageSize)
  );

  const safePage = Math.min(
    currentPage,
    totalPages
  );

  /*
   * Convert the sort value from the URL
   * into API values.
   */
  const getSortValues = () => {
    if (!urlSort) {
      return {
        sortBy: "",
        order: "",
      };
    }

    const [sortBy, order] =
      urlSort.split("-");

    return {
      sortBy,
      order,
    };
  };

  const { sortBy, order } =
    getSortValues();

  /*
   * Check authentication.
   */
  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    setAuthenticated(true);
    setCheckingAuth(false);
  }, [router]);

  /*
   * Load categories.
   */
  useEffect(() => {
    if (!authenticated) {
      return;
    }

    const loadCategories = async () => {
      setCategoryLoading(true);

      try {
        const data = await getCategories();

        setCategories(data);
      } catch (error) {
        console.error(
          "Failed to load categories:",
          error
        );
      } finally {
        setCategoryLoading(false);
      }
    };

    loadCategories();
  }, [authenticated]);

  /*
   * Keep search input synchronized
   * with the URL.
   */
  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  /*
   * When the debounced search changes:
   *
   * - search is stored in URL
   * - page resets to 1
   * - category is cleared
   */
  useEffect(() => {
    if (!authenticated) {
      return;
    }

    const currentUrlSearch =
      searchParams.get("search") || "";

    if (
      debouncedSearch === currentUrlSearch
    ) {
      return;
    }

    const params =
      new URLSearchParams(
        searchParams.toString()
      );

    if (debouncedSearch.trim()) {
      params.set(
        "search",
        debouncedSearch.trim()
      );

      params.delete("category");
    } else {
      params.delete("search");
    }

    params.set("page", "1");

    router.push(
      `/products?${params.toString()}`
    );
  }, [
    debouncedSearch,
    authenticated,
    router,
    searchParams,
  ]);

  /*
   * Fetch products whenever:
   * - page changes
   * - page size changes
   * - search changes
   * - category changes
   * - sorting changes
   */
  useEffect(() => {
    if (!authenticated) {
      return;
    }

    const controller =
      new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const skip =
          (safePage - 1) * pageSize;

        let data;

        if (urlSearch.trim()) {
          data = await searchProducts(
            urlSearch.trim(),
            pageSize,
            skip,
            sortBy,
            order,
            controller.signal
          );
        } else if (urlCategory) {
          data =
            await getProductsByCategory(
              urlCategory,
              pageSize,
              skip,
              sortBy,
              order,
              controller.signal
            );
        } else {
          data = await getProducts(
  pageSize,
  skip,
  sortBy,
  order,
  controller.signal
);
        }

const updatedProducts = applyProductMutations(
  data.products
);

const mutations = getProductMutations();

const deletedCount = mutations.deleted.length;
const createdCount = mutations.created.length;

const adjustedTotal =
  data.total - deletedCount + createdCount;

setProducts(updatedProducts);
setTotalProducts(Math.max(0, adjustedTotal));
      } catch (error) {
        if (
          error.code === "ERR_CANCELED" ||
          error.name === "CanceledError"
        ) {
          return;
        }

        setError(
          error.response?.data?.message ||
            "Unable to load products. Please try again."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [
    authenticated,
    safePage,
    pageSize,
    urlSearch,
    urlCategory,
    sortBy,
    order,
  ]);

  /*
   * Update the URL while keeping
   * existing search/filter/sort values.
   */
  const updateUrl = (
    page,
    limit = pageSize,
    extraParams = {}
  ) => {
    const params =
      new URLSearchParams(
        searchParams.toString()
      );

    params.set(
      "page",
      String(page)
    );

    params.set(
      "limit",
      String(limit)
    );

    Object.entries(extraParams).forEach(
      ([key, value]) => {
        if (value) {
          params.set(
            key,
            value
          );
        } else {
          params.delete(key);
        }
      }
    );

    router.push(
      `/products?${params.toString()}`
    );
  };

  const handlePageChange = (page) => {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    updateUrl(page);
  };

  const handlePageSizeChange = (
    newPageSize
  ) => {
    updateUrl(
      1,
      newPageSize
    );
  };

  /*
   * Selecting a category clears search.
   */
  const handleCategoryChange = (
    category
  ) => {
    setSearchInput("");

    const params =
      new URLSearchParams(
        searchParams.toString()
      );

    params.set("page", "1");

    if (category) {
      params.set(
        "category",
        category
      );
    } else {
      params.delete("category");
    }

    params.delete("search");

    router.push(
      `/products?${params.toString()}`
    );
  };

  /*
   * Sorting keeps the current page
   * but updates the sort value.
   */
  const handleSortChange = (
    sort
  ) => {
    const params =
      new URLSearchParams(
        searchParams.toString()
      );

    params.set("page", "1");

    if (sort) {
      params.set("sort", sort);
    } else {
      params.delete("sort");
    }

    router.push(
      `/products?${params.toString()}`
    );
  };

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-600">
          Checking authentication...
        </p>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8">
<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  <div>
    <h2 className="text-2xl font-bold text-gray-900">
      Products
    </h2>

    <p className="mt-1 text-gray-600">
      Manage your products from here.
    </p>
  </div>

  <button
    onClick={() => router.push("/products/new")}
    className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
  >
    + Add Product
  </button>
</div>  

        <div className="mb-6 space-y-4 rounded-lg border bg-white p-4">
          <SearchBar
            value={searchInput}
            onChange={setSearchInput}
          />

          <div className="border-t pt-4">
            {categoryLoading ? (
              <p className="text-sm text-gray-500">
                Loading categories...
              </p>
            ) : (
              <ProductFilters
                category={urlCategory}
                categories={categories}
                sort={urlSort}
                onCategoryChange={
                  handleCategoryChange
                }
                onSortChange={
                  handleSortChange
                }
              />
            )}
          </div>
        </div>

        {loading && <Loader />}

        {!loading && error && (
          <ErrorState
            message={error}
            onRetry={() =>
              window.location.reload()
            }
          />
        )}

        {!loading &&
          !error &&
          products.length === 0 && (
            <EmptyState />
          )}

        {!loading &&
          !error &&
          products.length > 0 && (
            <>
              <ProductTable
                products={products}
              />

              <ProductList
                products={products}
              />

              <Pagination
                currentPage={safePage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalProducts={
                  totalProducts
                }
                onPageChange={
                  handlePageChange
                }
                onPageSizeChange={
                  handlePageSizeChange
                }
              />
            </>
          )}
      </main>
    </div>
  );
}