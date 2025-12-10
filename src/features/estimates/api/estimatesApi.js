// src/features/estimates/api/estimatesApi.js

let mockEstimates = [
  {
    id: 1,
    estimateNumber: "0001", // <-- novo campo
    date: "2025-01-10",
    customerId: 1,
    customerName: "John Doe",
    customerEmail: "john.doe@example.com",
    customerPhone: "(11) 99999-0000",
    customerAddress: "123 Main St, São Paulo - SP",
    status: "Pending", // "Pending" | "Approved"
    notes: "First estimate example.",
    items: [
      {
        id: 1,
        type: "service",
        refId: 1,
        name: "Exterior wash",
        quantity: 1,
        unitPrice: 80,
      },
    ],
  },
];

export async function getEstimates() {
  return Promise.resolve([...mockEstimates]);
}

export async function createEstimate(estimate) {
  const newEstimate = { ...estimate, id: Date.now() };
  mockEstimates.push(newEstimate);
  return Promise.resolve(newEstimate);
}

export async function updateEstimate(id, estimate) {
  mockEstimates = mockEstimates.map((q) =>
    q.id === id ? { ...q, ...estimate } : q
  );
  const updated = mockEstimates.find((q) => q.id === id);
  return Promise.resolve(updated);
}

export async function approveEstimate(id) {
  mockEstimates = mockEstimates.map((q) =>
    q.id === id ? { ...q, status: "Approved" } : q
  );
  const updated = mockEstimates.find((q) => q.id === id);
  return Promise.resolve(updated);
}

export async function deleteEstimate(id) {
  mockEstimates = mockEstimates.filter((q) => q.id !== id);
  return Promise.resolve();
}