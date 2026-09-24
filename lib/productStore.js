const STORAGE_KEY = "product-admin-mutations";

const getEmptyState = () => ({
  created: [],
  updated: {},
  deleted: [],
});

export const getProductMutations = () => {
  if (typeof window === "undefined") {
    return getEmptyState();
  }

  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return getEmptyState();
    }

    const parsed = JSON.parse(stored);

    return {
      created: Array.isArray(parsed.created)
        ? parsed.created
        : [],

      updated:
        parsed.updated && typeof parsed.updated === "object"
          ? parsed.updated
          : {},

      deleted: Array.isArray(parsed.deleted)
        ? parsed.deleted.map(String)
        : [],
    };
  } catch (error) {
    console.error("Failed to read product mutations:", error);
    return getEmptyState();
  }
};

const saveProductMutations = (mutations) => {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(mutations)
    );
  } catch (error) {
    console.error("Failed to save product mutations:", error);
  }
};

export const addCreatedProduct = (product) => {
  const mutations = getProductMutations();

  const productId = String(product.id);

  // Don't add a product that has already been added.
  const alreadyExists = mutations.created.some(
    (item) => String(item.id) === productId
  );

  if (!alreadyExists) {
    mutations.created.push(product);
  }

  // If it was previously marked deleted, remove that state.
  mutations.deleted = mutations.deleted.filter(
    (id) => id !== productId
  );

  saveProductMutations(mutations);
};

export const updateStoredProduct = (product) => {
  const mutations = getProductMutations();

  const productId = String(product.id);

  mutations.updated[productId] = product;

  // If it was marked deleted before, remove that deletion.
  mutations.deleted = mutations.deleted.filter(
    (id) => id !== productId
  );

  saveProductMutations(mutations);
};

export const deleteStoredProduct = (productId) => {
  const mutations = getProductMutations();

  const id = String(productId);

  // Remove from locally-created products.
  mutations.created = mutations.created.filter(
    (product) => String(product.id) !== id
  );

  // Remove any locally stored edited version.
  delete mutations.updated[id];

  // Add to deleted list.
  if (!mutations.deleted.includes(id)) {
    mutations.deleted.push(id);
  }

  saveProductMutations(mutations);

  console.log("Product marked as deleted:", id);
  console.log("Current mutations:", mutations);
};

export const getStoredProduct = (productId) => {
  const mutations = getProductMutations();

  const id = String(productId);

  // Deleted products should never be returned.
  if (mutations.deleted.includes(id)) {
    return null;
  }

  // Updated product.
  if (mutations.updated[id]) {
    return mutations.updated[id];
  }

  // Created product.
  const createdProduct = mutations.created.find(
    (product) => String(product.id) === id
  );

  return createdProduct || null;
};

export const isProductDeleted = (productId) => {
  const mutations = getProductMutations();

  return mutations.deleted.includes(String(productId));
};

export const applyProductMutations = (products) => {
  const mutations = getProductMutations();

  const deletedIds = new Set(
    mutations.deleted.map(String)
  );

  // Remove deleted products and apply edits.
  const updatedProducts = products
    .filter(
      (product) =>
        !deletedIds.has(String(product.id))
    )
    .map((product) => {
      return (
        mutations.updated[String(product.id)] ||
        product
      );
    });

  // Add locally-created products.
  const existingIds = new Set(
    updatedProducts.map((product) =>
      String(product.id)
    )
  );

  const createdProducts = mutations.created.filter(
    (product) =>
      !deletedIds.has(String(product.id)) &&
      !existingIds.has(String(product.id))
  );

  return [
    ...createdProducts,
    ...updatedProducts,
  ];
};

export const clearProductMutations = () => {
  if (typeof window === "undefined") return;

  sessionStorage.removeItem(STORAGE_KEY);
};