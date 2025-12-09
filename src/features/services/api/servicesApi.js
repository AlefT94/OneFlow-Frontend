// Mock in-memory services list for now
let mockServices = [
  {
    id: 1,
    name: "Exterior wash",
    description: "Full exterior car wash with wax.",
    price: 80,
    notes: "SUVs and trucks have an additional fee.",
  },
  {
    id: 2,
    name: "Interior detailing",
    description: "Deep interior cleaning and detailing.",
    price: 150,
    notes: "",
  },
];

export async function getServices() {
  // In the future, replace with axios/fetch to your backend
  return Promise.resolve([...mockServices]);
}

export async function createService(service) {
  const newService = {
    ...service,
    id: Date.now(),
  };
  mockServices.push(newService);
  return Promise.resolve(newService);
}

export async function updateService(id, service) {
  mockServices = mockServices.map((s) =>
    s.id === id ? { ...s, ...service } : s
  );
  const updated = mockServices.find((s) => s.id === id);
  return Promise.resolve(updated);
}

export async function deleteService(id) {
  mockServices = mockServices.filter((s) => s.id !== id);
  return Promise.resolve();
}