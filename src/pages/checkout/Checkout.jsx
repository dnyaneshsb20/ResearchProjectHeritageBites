import React, { useEffect, useState } from 'react';
import Header from '../../components/ui/Header';
import Footer from 'pages/dashboard/components/Footer';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabaseClient';

const Checkout = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const [states, setStates] = useState([]);
  const [address, setAddress] = useState({
    name: '',
    line: '',
    city: '',
    pincode: '',
    state_id: '',
  });
  const [saveAddress, setSaveAddress] = useState(false);
  const [user, setUser] = useState(null);

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + (item.price * (item.quantity || 1)),
    0
  );

  // ✅ Fetch current user from Supabase Auth
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };
    getUser();
  }, []);

  // ✅ Fetch list of states
  useEffect(() => {
    const fetchStates = async () => {
      const { data, error } = await supabase.from('states').select('id, name');
      if (error) console.error('Error fetching states:', error);
      else setStates(data);
    };
    fetchStates();
  }, []);

  // ✅ Auto-fill address if saved
  useEffect(() => {
    const fetchSavedAddress = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, address_line, city, pincode, state_id')
        .eq('id', user.id)
        .single();
      if (!error && data && data.address_line) {
        setAddress({
          name: data.full_name || '',
          line: data.address_line || '',
          city: data.city || '',
          pincode: data.pincode || '',
          state_id: data.state_id || '',
        });
        toast.success('Loaded saved address');
      }
    };
    fetchSavedAddress();
  }, [user]);

  const handleInputChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    // Validate address
    if (!address.name || !address.line || !address.city || !address.pincode || !address.state_id) {
      toast.error('Please fill all address fields!');
      return;
    }

    // ✅ If checkbox checked, save address to profile
    if (saveAddress && user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: address.name,
          address_line: address.line,
          city: address.city,
          pincode: address.pincode,
          state_id: address.state_id,
        })
        .eq('id', user.id);

      if (profileError) console.error('Profile update error:', profileError);
      else toast.success('Address saved for future use!');
    }

    // ✅ Insert order
    const { error: orderError } = await supabase.from('orders').insert([
      {
        user_id: user?.id,
        user_name: address.name,
        address_line: address.line,
        city: address.city,
        pincode: address.pincode,
        state_id: address.state_id,
        total_price: totalAmount,
        created_at: new Date(),
      },
    ]);

    if (orderError) {
      toast.error('Error placing order!');
      console.error(orderError);
      return;
    }

    toast.success('Order placed successfully!');
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

              {/* Shipping Address */}
              <div className="mt-8">
                <h2 className="text-xl font-medium mb-4 text-gray-700">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" name="name" value={address.name} onChange={handleInputChange} placeholder="Full Name" className="border p-2 rounded w-full" />
                  <input type="text" name="line" value={address.line} onChange={handleInputChange} placeholder="Address Line" className="border p-2 rounded w-full" />
                  <input type="text" name="city" value={address.city} onChange={handleInputChange} placeholder="City" className="border p-2 rounded w-full" />
                  <input type="text" name="pincode" value={address.pincode} onChange={handleInputChange} placeholder="Pincode" className="border p-2 rounded w-full" />

                  <select name="state_id" value={address.state_id} onChange={handleInputChange} className="border p-2 rounded w-full">
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state.id} value={state.id}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Save Address Toggle */}
                <div className="mt-4 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="saveAddress"
                    checked={saveAddress}
                    onChange={(e) => setSaveAddress(e.target.checked)}
                  />
                  <label htmlFor="saveAddress" className="text-gray-600 text-sm">
                    Save this address for future use
                  </label>
                </div>
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

      <Footer />
    </div>
  );
};

export default Checkout;
