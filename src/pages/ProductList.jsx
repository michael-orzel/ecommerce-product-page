import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const { addToCart } = useCart();

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setIsRetrying(true);
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/products`);
      if (!response.ok) {
        switch (response.status) {
          case 404:
            throw new Error("404: Products not found.");
          case 500:
            throw new Error("500: Server error. Please try again later.");
          default:
            throw new Error(`${response.status}: Failed to fetch products.`);
        }
      }
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
      setIsRetrying(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = products.filter((product) =>
      product.title.toLowerCase().includes(term)
    );
    setFilteredProducts(filtered);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading || error}
        />
      </div>

      {error ? (
        <div className="text-center p-6 bg-red-100 text-red-700 rounded-lg">
          <p>{error}</p>
          <button
            onClick={fetchProducts}
            className={`mt-4 bg-red-500 text-white py-2 px-4 rounded-lg flex items-center justify-center ${
              isRetrying ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"
            }`}
            disabled={isRetrying}
          >
            {isRetrying ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Retrying...
              </>
            ) : (
              "Try Again"
            )}
          </button>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md animate-pulse"
            >
              <div className="w-full h-48 bg-gray-200 mb-4"></div>
              <div className="h-4 bg-gray-200 w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 w-1/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.title}
                    loading="lazy"
                    className="w-full h-48 object-contain mb-4"
                  />
                  <h2 className="text-lg font-semibold truncate">{product.title}</h2>
                </Link>
                <p className="text-gray-600">${product.price}</p>
                <button
                  onClick={() => addToCart(product)}
                  className="mt-2 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                >
                  Add to Cart
                </button>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full">No products found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductList;
