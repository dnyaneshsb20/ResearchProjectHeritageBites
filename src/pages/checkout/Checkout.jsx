import React from 'react';
import Header from '../../components/ui/Header';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

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

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        <div className="bg-popover rounded-lg p-4 shadow space-y-4">
          {cartItems.length === 0 ? (
            <p className="text-muted-foreground text-center">Your cart is empty.</p>
          ) : (
            <>
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between border-b border-border py-2">
                  <span>{item.name} x {item.quantity || 1}</span>
                  <span>₹{item.price * (item.quantity || 1)}</span>
                </div>
              ))}

              <div className="flex justify-between font-bold text-lg mt-4">
                <span>Total:</span>
                <span>₹{totalAmount}</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="mt-6 w-full bg-gradient-to-r from-[#f87d46] to-[#fa874f] text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
              >
                Proceed to Payment
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Checkout;
