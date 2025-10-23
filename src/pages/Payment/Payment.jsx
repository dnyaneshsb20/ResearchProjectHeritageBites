import React, { useState, useEffect } from "react";

import Header from "../../components/ui/Header";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { CreditCard, Smartphone, Wallet, QrCode } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../context/AuthContext";


const Payment = () => {
    const { cartItems, setCartItems } = useCart();
    const navigate = useNavigate();
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [upiOption, setUpiOption] = useState(null);
    const [upiId, setUpiId] = useState("");

    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (data?.user) setUserId(data.user.id);
            else toast.error("User not logged in");
        };
        fetchUser();
    }, []);

    const [cardType, setCardType] = useState("");


    const [cardDetails, setCardDetails] = useState({
        name: "",
        number: "",
        expiry: "",
        cvv: "",
    });

    const totalAmount = cartItems.reduce(
        (acc, item) => acc + (item.price * (item.quantity || 1)),
        0
    );

    // const handlePayment = () => {
    //     if (selectedMethod === "upi") {
    //         if (!upiOption) return toast.error("Please select a UPI option");
    //         if (upiOption === "id" && !upiId.trim()) return toast.error("Please enter your UPI ID");
    //     } else if (selectedMethod === "card") {
    //         if (!cardType) return toast.error("Please select a card type");
    //         const { name, number, expiry, cvv } = cardDetails;
    //         if (!name || !number || !expiry || !cvv)
    //             return toast.error("Please fill all card details");
    //     }

    //     toast.loading("Processing payment...", { id: "payment" });

    //     setTimeout(() => {
    //         toast.dismiss("payment");
    //         toast.success("Order placed successfully 🎉");
    //         setCartItems([]);
    //         navigate("/order-confirmation");
    //     }, 2000);
    // };
    const handlePayment = async () => {
        if (!selectedMethod) return toast.error("Please select a payment method");

        if (selectedMethod === "upi") {
            if (!upiOption) return toast.error("Please select a UPI option");
            if (upiOption === "id" && !upiId.trim()) return toast.error("Please enter your UPI ID");
        } else if (selectedMethod === "card") {
            if (!cardType) return toast.error("Please select a card type");
            const { name, number, expiry, cvv } = cardDetails;
            if (!name || !number || !expiry || !cvv)
                return toast.error("Please fill all card details");
        }

        toast.loading("Processing payment...", { id: "payment" });

        try {
            // Prepare items for jsonb
            const orderItems = cartItems.map(item => ({
                product_id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity || 1
            }));

            // Insert order with items in jsonb
            const { data: createdOrder, error: orderError } = await supabase
                .from("orders")
                .insert([
                    {
                        user_id: userId,
                        total_amount: totalAmount,
                        payment_method: selectedMethod,
                        items: orderItems
                    }
                ])
                .select()
                .single();

            if (orderError || !createdOrder) throw orderError || new Error("Failed to create order");

            // Clear cart
            setCartItems([]);

            // Show success
            toast.dismiss("payment");
            toast.success("Order placed successfully 🎉");

            // Navigate to confirmation
            navigate("/order-confirmation", { state: { order: createdOrder } });

        } catch (err) {
            console.error("Order placement error:", err);
            toast.dismiss("payment");
            toast.error("Failed to place order. Please try again.");
        }
    };


    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-8 max-w-3xl">
                <h1 className="text-2xl font-bold mb-6">Payment</h1>

                {/* Order Summary */}
                <div className="bg-popover rounded-lg p-4 shadow mb-6">
                    <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                    {cartItems.length === 0 ? (
                        <p>Your cart is empty.</p>
                    ) : (
                        <>
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex justify-between mb-2">
                                    <span>
                                        {item.name} × {item.quantity || 1}
                                    </span>
                                    <span>₹{item.price * (item.quantity || 1)}</span>
                                </div>
                            ))}
                            <div className="flex justify-between font-bold mt-4 border-t pt-2">
                                <span>Total</span>
                                <span>₹{totalAmount}</span>
                            </div>
                        </>
                    )}
                </div>

                {/* Payment Methods */}
                <div className="bg-popover rounded-lg p-4 shadow space-y-3">
                    <h2 className="text-lg font-semibold mb-4">Select Payment Method</h2>

                    {/* UPI Option */}
                    <button
                        onClick={() => {
                            setSelectedMethod("upi");
                            setUpiOption(null);
                        }}
                        className={`flex items-center justify-between w-full px-4 py-3 border rounded-lg transition 
              ${selectedMethod === "upi" ? "border-primary bg-primary/10" : "hover:bg-muted"}`}
                    >
                        <div className="flex items-center gap-3">
                            <Smartphone size={20} />
                            <span>UPI / QR Code</span>
                        </div>
                        {selectedMethod === "upi" && (
                            <span className="text-primary font-medium">Selected</span>
                        )}
                    </button>

                    {selectedMethod === "upi" && (
                        <div className="ml-6 mt-3 space-y-3 border-l pl-4">
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="upiOption"
                                        value="id"
                                        checked={upiOption === "id"}
                                        onChange={() => setUpiOption("id")}
                                    />
                                    Enter UPI ID
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="upiOption"
                                        value="qr"
                                        checked={upiOption === "qr"}
                                        onChange={() => setUpiOption("qr")}
                                    />
                                    Scan QR Code
                                </label>
                            </div>

                            {upiOption === "id" && (
                                <input
                                    type="text"
                                    placeholder="Enter your UPI ID (e.g. user@upi)"
                                    value={upiId}
                                    onChange={(e) => setUpiId(e.target.value)}
                                    className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            )}

                            {upiOption === "qr" && (
                                <div className="flex flex-col items-center text-center">
                                    <QrCode size={60} className="text-primary mb-2" />
                                    <p className="text-sm text-muted-foreground">
                                        Scan this QR using your UPI app to complete payment.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Card Option */}
                    <button
                        onClick={() => setSelectedMethod("card")}
                        className={`flex items-center justify-between w-full px-4 py-3 border rounded-lg transition 
              ${selectedMethod === "card" ? "border-primary bg-primary/10" : "hover:bg-muted"}`}
                    >
                        <div className="flex items-center gap-3">
                            <CreditCard size={20} />
                            <span>Credit / Debit Card</span>
                        </div>
                        {selectedMethod === "card" && (
                            <span className="text-primary font-medium">Selected</span>
                        )}
                    </button>

                    {selectedMethod === "card" && (
                        <div className="ml-6 mt-3 space-y-3 border-l pl-4">
                            {/* Card type */}
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="cardType"
                                        value="credit"
                                        checked={cardType === "credit"}
                                        onChange={(e) => setCardType(e.target.value)}
                                    />
                                    Credit Card
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="cardType"
                                        value="debit"
                                        checked={cardType === "debit"}
                                        onChange={(e) => setCardType(e.target.value)}
                                    />
                                    Debit Card
                                </label>
                            </div>

                            {/* Card details form */}
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    placeholder="Cardholder Name"
                                    value={cardDetails.name}
                                    onChange={(e) =>
                                        setCardDetails({ ...cardDetails, name: e.target.value })
                                    }
                                    className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <input
                                    type="text"
                                    placeholder="Card Number"
                                    maxLength="16"
                                    value={cardDetails.number}
                                    onChange={(e) =>
                                        setCardDetails({ ...cardDetails, number: e.target.value })
                                    }
                                    className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="MM/YY"
                                        maxLength="5"
                                        value={cardDetails.expiry}
                                        onChange={(e) =>
                                            setCardDetails({ ...cardDetails, expiry: e.target.value })
                                        }
                                        className="border rounded px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                    <input
                                        type="password"
                                        placeholder="CVV"
                                        maxLength="3"
                                        value={cardDetails.cvv}
                                        onChange={(e) =>
                                            setCardDetails({ ...cardDetails, cvv: e.target.value })
                                        }
                                        className="border rounded px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Cash on Delivery */}
                    <button
                        onClick={() => setSelectedMethod("cod")}
                        className={`flex items-center justify-between w-full px-4 py-3 border rounded-lg transition 
              ${selectedMethod === "cod" ? "border-primary bg-primary/10" : "hover:bg-muted"}`}
                    >
                        <div className="flex items-center gap-3">
                            <Wallet size={20} />
                            <span>Cash on Delivery</span>
                        </div>
                        {selectedMethod === "cod" && (
                            <span className="text-primary font-medium">Selected</span>
                        )}
                    </button>
                </div>

                {/* Pay / Place Order Button */}
                {/* Pay / Place Order Button */}
                <button
                    onClick={handlePayment}
                    disabled={!selectedMethod}
                    className={`mt-8 w-full text-white px-4 py-3 rounded-lg text-lg font-medium transition 
        ${selectedMethod === "cod"
                            ? "bg-gradient-to-r from-[#4caf50] to-[#66bb6a] hover:opacity-90"
                            : "bg-gradient-to-r from-[#f87d46] to-[#fa874f] hover:opacity-90"
                        } ${!selectedMethod ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    {selectedMethod === "cod"
                        ? "Place Order (Cash on Delivery)"
                        : `Pay ₹${totalAmount} & Place Order`}
                </button>

            </main>
        </div>
    );
};

export default Payment;
