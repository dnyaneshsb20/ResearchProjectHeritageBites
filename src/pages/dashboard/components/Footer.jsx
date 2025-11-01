import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import Button from '../../../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../../context/AuthContext"; // ✅ added

import Feedback from "pages/Feedback";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate(); // ✅ added
  const { user, setShowAuthPopup } = useAuth(); // ✅ added
  const isAuthenticated = !!user; // ✅ added

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubscribe = () => {
    if (!email) {
      setMessage("Email cannot be empty.");
      return;
    }
    if (!isValidEmail(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }
    setMessage(`Thank you for subscribing! A confirmation has been sent to ${email}.`);
    setEmail("");
  };

  return (
    <footer className="bg-earth-brown text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-10 h-10 bg-golden rounded-lg">
                <span className="text-earth-brown text-lg font-bold">HB</span>
              </div>
              <span className="text-2xl font-bold">HeritageBites</span>
            </div>
            <p className="text-white/80 leading-relaxed">
              Preserving India's culinary heritage while connecting communities
              through authentic flavors and sustainable practices.
            </p>
            <Link to="/recipe-discovery-dashboard">
              <Button
                variant="golden"
                size="sm"
                className="text-earth-brown bg-golden mt-3"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Explore Recipes
              </Button>
            </Link>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-golden mb-2">Connect With Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-golden" />
                <span className="text-white/80">heritagebites007@gmail.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-golden" />
                <span className="text-white/80">+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-golden" />
                <span className="text-white/80">Pune, India</span>
              </li>
            </ul>

            {/* Newsletter */}
            <div>
              <h5 className="font-medium text-golden mb-2">Stay Updated</h5>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-golden"
                />
                <Button
                  variant="golden"
                  size="sm"
                  className="text-earth-brown bg-golden"
                  onClick={handleSubscribe}
                >
                  Subscribe
                </Button>
              </div>
              {message && (
                <p className="text-white/80 mt-2 text-sm">{message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm">
            © 2025 HeritageBites. Preserving India's culinary heritage.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {/* ✅ Protected Feedback Link */}
            <Link
              to={isAuthenticated ? "/feedback" : "#"}
              onClick={(e) => {
                if (!isAuthenticated) {
                  e.preventDefault();
                  setShowAuthPopup(true); // show sign-in popup
                }
              }}
              className="text-white/60 hover:text-golden transition-colors text-sm"
            >
              Feedback
            </Link>

            <Link to="/privacy-policy" className="text-white/60 hover:text-golden transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-white/60 hover:text-golden transition-colors text-sm">
              Terms of Service
            </Link>
            <Link to="/support" className="text-white/60 hover:text-golden transition-colors text-sm">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
