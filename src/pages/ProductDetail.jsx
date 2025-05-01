import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const { addToCart } = useCart();

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      setIsRetrying(true);
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${id}`);
      if (!response.ok) {
        switch (response.status) {
          case 404:
            throw new Error("404: Product not found.");
          case 500:
            throw new Error("500: Server error. Please try again later.");
          default:
            throw new Error(`${response.status}: Failed to load product details.`);
        }
      }
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
      setIsRetrying(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="p-6 bg-red-100 text-red-700 rounded-lg">
          <p>{error}</p>
          <button
            onClick={fetchProduct}
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
        <Link to="/" className="mt-4 inline-block text-blue-500 hover:underline">
          Back to Products
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
          <div className="w-1/2 h-64 bg-gray-200 mb-4 mx-auto"></div>
          <div className="h-6 bg-gray-200 w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 w-1/4 mb-4"></div>
          <div className="h-10 bg-gray-200 w-full"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Product not found.</p>
        <Link to="/" className="text-blue-500 hover:underline">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Link to="/" className="text-blue-500 hover:underline mb-4 inline-block">
        ← Back to Products
      </Link>
      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row gap-6">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="w-full md:w-1/2 h-64 object-contain"
        />
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">{product.title}</h2>
          <p className="text-gray-600 text-lg mb-4">${product.price}</p>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <p className="text-sm text-gray-500">
            Category: {product.category}
          </p>
          <p className="text-sm text-gray-500">
            Rating: {product.rating.rate} / 5 ({product.rating.count} reviews)
          </p>
          <button
            onClick={() => addToCart(product)}
            className="mt-6 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
