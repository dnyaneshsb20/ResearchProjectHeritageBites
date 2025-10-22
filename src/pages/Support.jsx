import React, { useState } from "react";
import { Helmet } from "react-helmet";
import Header from "../components/ui/Header";
import Footer from "../pages/dashboard/components/Footer";
import Button from "../components/ui/Button";
import { Mail, Phone, MapPin, HelpCircle } from "lucide-react";

const Support = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateEmail = (email) => {
    // Simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateName = (name) => {
    // Only letters and spaces
    return /^[A-Za-z\s]+$/.test(name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = formData;

    if (!name || !email || !message) {
      alert("All fields are required.");
      return;
    }

    if (!validateName(name)) {
      alert("Name can only contain letters and spaces.");
      return;
    }

    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (message.length < 10) {
      alert("Message should be at least 10 characters long.");
      return;
    }

    const subject = `Support Request from ${name}`;
    const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

    // Open default mail client
    window.location.href = `mailto:heritagebites007@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="bg-background text-black min-h-screen flex flex-col">
      <Helmet>
        <title>Support | HeritageBites</title>
      </Helmet>

      <Header />

      <main className="flex-grow">
        <section className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">Need Help?</h1>
            <p className="text-black/70 text-lg max-w-3xl mx-auto">
              We’re here to help! Whether it’s a technical issue, an account
              query, or feedback — our support team is always ready to assist you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Contact Information */}
            <div className="bg-primary/5 border border-gray-200 rounded-2xl p-8 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-2">
                  <HelpCircle className="w-6 h-6 text-primary" />
                  Contact Information
                </h2>
                <p className="text-black/70 mb-6">
                  You can reach out directly through the following details. Our
                  support team will respond as quickly as possible.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <p className="text-black/80">heritagebites007@gmail.com</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <p className="text-black/80">+91 98765 43210</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <p className="text-black/80">Pune, Maharashtra, India</p>
                  </div>
                </div>

                {/* Embedded Map */}
                <div className="rounded-lg overflow-hidden shadow-sm border border-primary/10">
                  <iframe
                    title="Pune Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.325056406704!2d73.85674317496123!3d18.52043007128593!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c0669c7fefb5%3A0xf8c9adbb8685c23b!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1739967323123!5m2!1sen!2sin"
                    width="100%"
                    height="250"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>

            {/* Support Form */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">
                Send Us a Message
              </h2>
              <p className="text-black/70 mb-6">
                Fill out the form below and our team will respond as soon as possible.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-primary/30 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-primary/30 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-1">
                    Message
                  </label>
                  <textarea
                    name="message"
                    placeholder="Write your message here..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-primary/30 outline-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4"
                >
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Support;
