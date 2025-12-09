// src/features/products/api/productsApi.js

let mockProducts = [
  {
    id: 1,
    name: "Car wash shampoo",
    unit: "L",
    price: 25,
    notes: "Used for exterior wash.",
  },
  {
    id: 2,
    name: "Microfiber towel",
    unit: "unit",
    price: 10,
    notes: "High absorption microfiber towel.",
  },
];

export async function getProducts() {
  return Promise.resolve([...mockProducts]);
}

export async function createProduct(product) {
  const newProduct = { ...product, id: Date.now() };
  mockProducts.push(newProduct);
  return Promise.resolve(newProduct);
}

export async function updateProduct(id, product) {
  mockProducts = mockProducts.map((p) =>
    p.id === id ? { ...p, ...product } : p
  );
  const updated = mockProducts.find((p) => p.id === id);
  return Promise.resolve(updated);
}

export async function deleteProduct(id) {
  mockProducts = mockProducts.filter((p) => p.id !== id);
  return Promise.resolve();
}