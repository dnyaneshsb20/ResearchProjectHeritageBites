import React, { useState, useEffect } from "react";
import Header from "../../components/ui/Header";
import {  useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";
import { supabase } from "../../supabaseClient";
import { FaCreditCard, FaUniversity, FaWallet, FaMobileAlt, FaCashRegister, FaWallet as FaDigitalWallet } from "react-icons/fa";
import { SiPhonepe, SiPaytm } from "react-icons/si";
import { FaGooglePay, FaCcAmazonPay } from "react-icons/fa";
import { BsBank2 } from "react-icons/bs";
import {
    SiHdfcbank,
    SiIcicibank,
    SiBankofamerica,
    SiCommerzbank,
    SiDeutschebank,
    SiNubank,
    SiStarlingbank,
    SiThurgauerkantonalbank,
} from "react-icons/si";
import { RiBankFill } from "react-icons/ri";
import { RiVisaFill } from "react-icons/ri";
import { FaCcMastercard } from "react-icons/fa";
import Footer from "pages/dashboard/components/Footer";
import { BsCash } from "react-icons/bs";



const Payment = () => {
    const { cartItems, setCartItems } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const { address, totalAmount } = location.state || {};

    const [selectedMethod, setSelectedMethod] = useState(null);
    const [upiOption, setUpiOption] = useState(null);
    const [upiId, setUpiId] = useState("");

    const [userId, setUserId] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false); // ✅ Added state to prevent double insert

    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await supabase.auth.getUser();
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

    const [netBankingBank, setNetBankingBank] = useState("");
    const [digitalWallet, setDigitalWallet] = useState("");
    const handlePayment = async () => {
        if (isProcessing) return; // ✅ Prevent duplicate triggers
        setIsProcessing(true);

        if (!selectedMethod) {
            toast.error("Please select a payment method");
            setIsProcessing(false);
            return;
        }

        if (selectedMethod === "upi") {
            if (!upiOption) {
                toast.error("Please select a UPI option");
                setIsProcessing(false);
                return;
            }
            if (upiOption === "id" && !upiId.trim()) {
                toast.error("Please enter your UPI ID");
                setIsProcessing(false);
                return;
            }
        } else if (selectedMethod === "card") {
            if (!cardType) {
                toast.error("Please select a card type");
                setIsProcessing(false);
                return;
            }
            const { name, number, expiry, cvv } = cardDetails;
            if (!name || !number || !expiry || !cvv) {
                toast.error("Please fill all card details");
                setIsProcessing(false);
                return;
            }
        } else if (selectedMethod === "netbanking" && !netBankingBank) {
            toast.error("Please select your bank");
            setIsProcessing(false);
            return;
        } else if (selectedMethod === "digitalWallet" && !digitalWallet) {
            toast.error("Please select your digital wallet");
            setIsProcessing(false);
            return;
        }

        toast.loading("Processing payment...", { id: "payment" });

        try {
            const { data: createdOrder, error: orderError } = await supabase
                .from("orders")
                .insert([{
                    user_id: userId,
                    total_amount: totalAmount,
                    payment_method: selectedMethod,
                    status: "pending",
                    phone_number: address?.mobile_number,
                    delivery_address: address?.line,
                    city: address?.city,
                    postal_code: address?.pincode,
                    state_id: address?.state_id || null,
                }])
                .select()
                .single();


            if (orderError || !createdOrder) throw orderError || new Error("Failed to create order");

            const orderItems = cartItems.map(item => ({
                order_id: createdOrder.order_id,
                product_id: item.id,
                quantity: item.quantity || 1,
                price: item.price
            }));

            const { error: itemsError } = await supabase
                .from("order_items")
                .insert(orderItems);

            if (itemsError) throw itemsError;

            setCartItems([]);
            toast.dismiss("payment");
            toast.success("Order placed successfully 🎉");
            navigate("/order-confirmation", { state: { order: createdOrder } });
        } catch (err) {
            console.error("Order placement error:", err);
            toast.dismiss("payment");
            toast.error("Failed to place order. Please try again.");
        } finally {
            setIsProcessing(false); // ✅ Allow future payments after completion
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-10 max-w-4xl">
                <h1 className="text-3xl font-semibold mb-8 text-gray-800">Payment</h1>

                <div className="bg-white shadow rounded-lg p-6 space-y-4">

                    {/* Credit/Debit Card */}
                    <button
                        onClick={() => setSelectedMethod("card")}
                        className={`flex items-center justify-between w-full px-4 py-3 border rounded-lg transition 
    ${selectedMethod === "card" ? "border-primary bg-primary/10" : "hover:bg-gray-100"}`}
                    >
                        <div className="flex items-center gap-3">
                            <FaCreditCard size={20} className="text-blue-500" />
                            <span>Credit / Debit Card</span>
                        </div>
                        {selectedMethod === "card" && <span className="text-primary font-medium">Selected</span>}
                    </button>

                    {selectedMethod === "card" && (
                        <div className="ml-6 mt-3 space-y-3 border-l pl-4">
                            <div className="flex gap-4 items-center">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="cardType"
                                        value="credit"
                                        checked={cardType === "credit"}
                                        onChange={(e) => setCardType(e.target.value)}
                                        className="accent-primary"
                                    />
                                    Credit Card
                                    <div className="flex items-center gap-1 ml-2">
                                        <RiVisaFill size={20} className="text-blue-700" />
                                        <FaCcMastercard size={20} className="text-red-600" />
                                    </div>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="cardType"
                                        value="debit"
                                        checked={cardType === "debit"}
                                        onChange={(e) => setCardType(e.target.value)}
                                        className="accent-primary"
                                    />
                                    Debit Card
                                    <div className="flex items-center gap-1 ml-2">
                                        <RiVisaFill size={20} className="text-blue-700" />
                                        <FaCcMastercard size={20} className="text-red-600" />
                                    </div>
                                </label>
                            </div>

                            <div className="space-y-2 mt-2">
                                <input
                                    type="text"
                                    placeholder="Cardholder Name"
                                    value={cardDetails.name}
                                    onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                                    className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <input
                                    type="text"
                                    placeholder="Card Number"
                                    maxLength="16"
                                    value={cardDetails.number}
                                    onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                                    className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="MM/YY"
                                        maxLength="5"
                                        value={cardDetails.expiry}
                                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                        className="border rounded px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                    <input
                                        type="password"
                                        placeholder="CVV"
                                        maxLength="3"
                                        value={cardDetails.cvv}
                                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                                        className="border rounded px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Net Banking */}
                    <button
                        onClick={() => setSelectedMethod("netbanking")}
                        className={`flex items-center justify-between w-full px-4 py-3 border rounded-lg transition 
    ${selectedMethod === "netbanking" ? "border-primary bg-primary/10" : "hover:bg-gray-100"}`}
                    >
                        <div className="flex items-center gap-3">
                            <BsBank2 size={20} />
                            <span>Net Banking</span>
                        </div>
                        {selectedMethod === "netbanking" && <span className="text-primary font-medium">Selected</span>}
                    </button>

                    {selectedMethod === "netbanking" && (
                        <div className="ml-6 mt-3 border-l pl-4">
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    "HDFC Bank",
                                    "ICICI Bank",
                                    "Bank of America",
                                    "Starling Bank",
                                    "Deutsche Bank",
                                    "Nu Bank",
                                    "Commerz Bank",
                                    "Thurgauerkantonal Bank",
                                    "State Bank of India",
                                    "Bank Of India",
                                    "Axis Bank",
                                    "Punjab National Bank",
                                    "Bank Of Baroda",
                                    "Bank Of Maharashtra",
                                    "Kotak Mahindra Bank",
                                    "Central Bank of India",
                                    "Canara Bank",
                                    "Union Bank Of India",
                                    "India Post Payments Bank",
                                ].map((bank) => {
                                    let BankIcon;
                                    let iconColor = "#6b7280"; // default gray-500

                                    // ✅ Logo mappings with exact colors
                                    switch (bank) {
                                        case "HDFC Bank":
                                            BankIcon = SiHdfcbank;
                                            iconColor = "#E31E24"; // red outer
                                            break;
                                        case "ICICI Bank":
                                            BankIcon = SiIcicibank;
                                            iconColor = "#B03428"; // reddish brown
                                            break;
                                        case "Bank of America":
                                            BankIcon = SiBankofamerica;
                                            iconColor = "#012169"; // dark blue
                                            break;
                                        case "Starling Bank":
                                            BankIcon = SiStarlingbank;
                                            iconColor = "#7431A5"; // purple
                                            break;
                                        case "Deutsche Bank":
                                            BankIcon = SiDeutschebank;
                                            iconColor = "#0018A8"; // royal blue
                                            break;
                                        case "Nu Bank":
                                            BankIcon = SiNubank;
                                            iconColor = "#8A05BE"; // purple
                                            break;
                                        case "Commerz Bank":
                                            BankIcon = SiCommerzbank;
                                            iconColor = "#FFCC00"; // yellow
                                            break;
                                        case "Thurgauerkantonal Bank":
                                            BankIcon = SiThurgauerkantonalbank;
                                            iconColor = "#00866F"; // teal green
                                            break;
                                        case "State Bank of India":
                                            BankIcon = RiBankFill;
                                            iconColor = "#1E88E5"; // SBI blue
                                            break;
                                        case "Bank Of India":
                                            BankIcon = RiBankFill;
                                            iconColor = "#F36C21"; // orange
                                            break;
                                        case "Axis Bank":
                                            BankIcon = RiBankFill;
                                            iconColor = "#A4343A"; // maroon
                                            break;
                                        case "Punjab National Bank":
                                            BankIcon = RiBankFill;
                                            iconColor = "#800000"; // dark maroon
                                            break;
                                        case "Bank Of Baroda":
                                            BankIcon = RiBankFill;
                                            iconColor = "#EB5B25"; // bright orange
                                            break;
                                        case "Bank Of Maharashtra":
                                            BankIcon = RiBankFill;
                                            iconColor = "#0072BB"; // deep blue
                                            break;
                                        case "Kotak Mahindra Bank":
                                            BankIcon = RiBankFill;
                                            iconColor = "#004C8F"; // navy blue
                                            break;
                                        case "Central Bank of India":
                                            BankIcon = RiBankFill;
                                            iconColor = "#0066B3"; // blue
                                            break;
                                        case "Canara Bank":
                                            BankIcon = RiBankFill;
                                            iconColor = "#0079C1"; // cyan blue
                                            break;
                                        case "Union Bank Of India":
                                            BankIcon = RiBankFill;
                                            iconColor = "#ED1C24"; // red
                                            break;
                                        case "India Post Payments Bank":
                                            BankIcon = RiBankFill;
                                            iconColor = "#7B1C1C"; // dark red / maroon
                                            break;
                                        default:
                                            BankIcon = RiBankFill;
                                    }

                                    return (
                                        <label
                                            key={bank}
                                            className="flex items-center gap-2 cursor-pointer"
                                        >
                                            <input
                                                type="radio"
                                                name="netBank"
                                                value={bank}
                                                checked={netBankingBank === bank}
                                                onChange={() => setNetBankingBank(bank)}
                                                className="accent-primary"
                                            />
                                            <BankIcon size={24} style={{ color: iconColor }} />
                                            <span>{bank}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* UPI */}
                    <button
                        onClick={() => { setSelectedMethod("upi"); setUpiOption(null); }}
                        className={`flex items-center justify-between w-full px-4 py-3 border rounded-lg transition 
                        ${selectedMethod === "upi" ? "border-primary bg-primary/10" : "hover:bg-gray-100"}`}
                    >
                        <div className="flex items-center gap-3">
                            <FaMobileAlt size={20} />
                            <span>UPI / QR Code</span>
                        </div>
                        {selectedMethod === "upi" && <span className="text-primary font-medium">Selected</span>}
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
                                    placeholder="Enter your UPI ID"
                                    value={upiId}
                                    onChange={(e) => setUpiId(e.target.value)}
                                    className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            )}
                        </div>
                    )}

                    {/* Digital Wallets */}
                    <button
                        onClick={() => setSelectedMethod("digitalWallet")}
                        className={`flex items-center justify-between w-full px-4 py-3 border rounded-lg transition 
    ${selectedMethod === "digitalWallet" ? "border-primary bg-primary/10" : "hover:bg-gray-100"}`}
                    >
                        <div className="flex items-center gap-3">
                            <FaWallet size={20} className="text-amber-800" />
                            <span>Digital Wallets</span>
                        </div>
                        {selectedMethod === "digitalWallet" && <span className="text-primary font-medium">Selected</span>}
                    </button>

                    {selectedMethod === "digitalWallet" && (
                        <div className="ml-6 mt-3 border-l pl-4">
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { name: "Paytm", icon: <SiPaytm size={24} className="text-[#00baf2]" /> },
                                    { name: "PhonePe", icon: <SiPhonepe size={24} className="text-[#5f259f]" /> },
                                    { name: "Google Pay", icon: <FaGooglePay size={24} className="text-[#4285F4]" /> },
                                    { name: "Amazon Pay", icon: <FaCcAmazonPay size={24} className="text-[#FF9900]" /> },
                                ].map(wallet => (
                                    <label key={wallet.name} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="digitalWallet"
                                            value={wallet.name}
                                            checked={digitalWallet === wallet.name}
                                            onChange={() => setDigitalWallet(wallet.name)}
                                            className="accent-primary"
                                        />
                                        {wallet.icon}
                                        <span>{wallet.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Cash on Delivery */}
                    <button
                        onClick={() => setSelectedMethod("cod")}
                        className={`flex items-center justify-between w-full px-4 py-3 border rounded-lg transition 
                        ${selectedMethod === "cod" ? "border-primary bg-primary/10" : "hover:bg-gray-100"}`}
                    >
                        <div className="flex items-center gap-3">
                            <BsCash className="text-green-500" size={20} />
                            <span>Cash on Delivery</span>
                        </div>
                        {selectedMethod === "cod" && <span className="text-primary font-medium">Selected</span>}
                    </button>

                    {/* Pay / Place Order Button */}
                    <button
                        onClick={handlePayment}
                        disabled={!selectedMethod || isProcessing}
                        className={`mt-6 w-full text-white px-4 py-3 rounded-lg text-lg font-medium transition
                        ${selectedMethod === "cod"
                                ? "bg-gradient-to-r from-green-500 to-green-400 hover:opacity-90"
                                : "bg-gradient-to-r from-[#f87d46] to-[#fa874f] hover:opacity-90"
                            } ${(!selectedMethod || isProcessing) ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {isProcessing
                            ? "Processing..."
                            : selectedMethod === "cod"
                                ? "Place Order (Cash on Delivery)"
                                : `Pay ₹${totalAmount} & Place Order`}
                    </button>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Payment;
