import React from 'react';
import Header from '../../components/ui/Header';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Footer from 'pages/dashboard/components/Footer';

const Checkout = () => {
  const { cartItems, setCartItems } = useCart();
  const navigate = useNavigate();

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + (item.price * (item.quantity || 1)),
    0
  );

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    // Redirect to order confirmation page
    navigate('/payment');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-10 max-w-5xl">
        <h1 className="text-3xl font-semibold mb-8 text-gray-800">Checkout</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
            Your cart is empty.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cart Items Table */}
            <div className="md:col-span-2 bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-medium mb-4 text-gray-700">Your Items</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-2 text-gray-500">Product</th>
                      <th className="py-2 text-gray-500">Quantity</th>
                      <th className="py-2 text-gray-500 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                        <td className="py-3 text-gray-700">{item.name}</td>
                        <td className="py-3 text-gray-700">{item.quantity || 1}</td>
                        <td className="py-3 text-gray-700 text-right">₹{item.price * (item.quantity || 1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white shadow rounded-lg p-6 flex flex-col justify-between">
              <h2 className="text-xl font-medium mb-6 text-gray-700">Order Summary</h2>
              <div className="flex justify-between mb-4 text-gray-600">
                <span>Subtotal</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-6 text-gray-800 font-semibold text-lg">
                <span>Total</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="w-full bg-gradient-to-r from-[#f87d46] to-[#fa874f] text-white py-3 rounded-lg hover:opacity-90 transition font-medium"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer/>
    </div>
  );
};

export default Checkout;
