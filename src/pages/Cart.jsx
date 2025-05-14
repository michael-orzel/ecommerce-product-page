import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

  const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getTotalItems, getTotalPrice } = useCart();

  return (
    <div className="container mx-auto p-4">
      <Link to="/" className="text-[#0D1E3D] hover:underline mb-4 inline-block">
        ← Back to Products
      </Link>
      <h2 className="text-[#08090A] text-2xl font-bold mb-6">Your Cart ({getTotalItems()} items)</h2>
      {cart.length === 0 ? (
        <p className="text-[#1F2021] text-center">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-[#F5F5F5] flex items-center justify-center p-4 rounded-lg shadow-md"
            >
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="w-16 h-16 object-contain mr-4"
              />
              <div className="flex-1">
                <h3 className="text-[#08090A] text-lg font-semibold">{item.title}</h3>
                <p className="text-[#1F2021]">
                  ${item.price} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
              <div className="flex items-center space-x-2 mr-4">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="bg-[#2B2B2B] hover:bg-[#212121] text-[#F5F5F5] py-1 px-2 rounded"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="bg-[#2B2B2B] hover:bg-[#212121] text-[#F5F5F5] py-1 px-2 rounded"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="bg-[#3F0F0F] hover:bg-[#2F0A0A] text-[#F5F5F5] py-1 px-3 rounded-lg"
              >
                X
              </button>
            </div>
          ))}
          <div className="mt-6 text-right">
            <p className="text-xl font-bold">Total: ${getTotalPrice()}</p>
            <button className="mt-4 bg-[#042C21] hover:bg-[#02160F] text-[#F5F5F5] py-2 px-4 rounded-lg">
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
