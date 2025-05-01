import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getTotalItems, getTotalPrice } = useCart();

  return (
    <div className="container mx-auto p-4">
      <Link to="/" className="text-blue-500 hover:underline mb-4 inline-block">
        ← Back to Products
      </Link>
      <h2 className="text-2xl font-bold mb-6">Your Cart ({getTotalItems()} items)</h2>
      {cart.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center bg-white p-4 rounded-lg shadow-md"
            >
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="w-16 h-16 object-contain mr-4"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold truncate">{item.title}</h3>
                <p className="text-gray-600">
                  ${item.price} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
              <div className="flex items-center space-x-2 mr-4">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="bg-gray-200 text-gray-700 py-1 px-2 rounded hover:bg-gray-300"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="bg-gray-200 text-gray-700 py-1 px-2 rounded hover:bg-gray-300"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="mt-6 text-right">
            <p className="text-xl font-bold">Total: ${getTotalPrice()}</p>
            <button className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600">
              Checkout (Demo)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
