export const fetchProducts = async () => {
  const response = await fetch("http://localhost:5000/api/products");
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
};
