import { Suspense } from "react";

import ProductsPage from "./ProductsPage";

export default function ProductsRoute() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
          <p className="text-gray-600">
            Loading products...
          </p>
        </div>
      }
    >
      <ProductsPage />
    </Suspense>
  );
}