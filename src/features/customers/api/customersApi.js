// src/features/customers/api/customersApi.js

let mockCustomers = [
  {
    id: 1,
    name: "John Doe",
    phone: "(11) 99999-0000",
    email: "john.doe@example.com",
    address: "123 Main St, São Paulo - SP",
    notes: "Prefers Saturday morning appointments.",
  },
  {
    id: 2,
    name: "Maria Silva",
    phone: "(11) 98888-1111",
    email: "maria.silva@example.com",
    address: "Av. Paulista, 1000, São Paulo - SP",
    notes: "",
  },
];

export async function getCustomers() {
  return Promise.resolve([...mockCustomers]);
}

export async function createCustomer(customer) {
  const newCustomer = { ...customer, id: Date.now() };
  mockCustomers.push(newCustomer);
  return Promise.resolve(newCustomer);
}

export async function updateCustomer(id, customer) {
  mockCustomers = mockCustomers.map((c) =>
    c.id === id ? { ...c, ...customer } : c
  );
  const updated = mockCustomers.find((c) => c.id === id);
  return Promise.resolve(updated);
}

export async function deleteCustomer(id) {
  mockCustomers = mockCustomers.filter((c) => c.id !== id);
  return Promise.resolve();
}