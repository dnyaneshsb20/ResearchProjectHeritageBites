import React from "react";
import { Helmet } from "react-helmet";
import Header from "../components/ui/Header";
import Footer from "../pages/dashboard/components/Footer";
import Button from "../components/ui/Button";

const PrivacyPolicy = () => {
  return (
    <div className="bg-background text-black min-h-screen flex flex-col">
      <Helmet>
        <title>Privacy Policy | HeritageBites</title>
      </Helmet>

      <Header />

      <main className="flex-grow">
        <section className="max-w-5xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">
              Privacy Policy
            </h1>
            <p className="text-black/80 text-lg max-w-3xl mx-auto">
              At <strong>HeritageBites</strong>, we value your trust and are committed
              to protecting your privacy. This policy explains how we collect,
              use, and safeguard your information when you use our platform.
            </p>
          </div>

          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-semibold text-primary mb-3">
                1. Information We Collect
              </h2>
              <ul className="list-disc list-inside text-black/80 leading-relaxed">
                <li>Email addresses when you subscribe to our newsletter.</li>
                <li>Usage data such as page visits, clicks, and preferences.</li>
                <li>Cookies for improving your browsing experience.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-primary mb-3">
                2. How We Use Your Information
              </h2>
              <ul className="list-disc list-inside text-black/80 leading-relaxed">
                <li>To personalize your experience on our website.</li>
                <li>To send newsletters, recipe updates, and offers.</li>
                <li>To improve website functionality and performance.</li>
                <li>To respond to your inquiries and support requests.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-primary mb-3">
                3. Sharing Your Information
              </h2>
              <p className="text-black/80 leading-relaxed">
                We do not sell, rent, or trade your personal data to third
                parties. We may share information only with trusted partners who
                help us operate our platform — under strict data protection
                agreements.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-primary mb-3">
                4. Security Measures
              </h2>
              <p className="text-black/80 leading-relaxed">
                We implement industry-standard security measures to protect your
                personal data from unauthorized access, alteration, or
                disclosure. However, no online system is 100% secure, and we
                encourage users to take their own precautions as well.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-primary mb-3">
                5. Your Rights
              </h2>
              <p className="text-black/80 leading-relaxed">
                You have the right to access, modify, or request deletion of your
                personal data. You may also unsubscribe from marketing
                communications at any time.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-primary mb-3">
                6. Updates to This Policy
              </h2>
              <p className="text-black/80 leading-relaxed">
                We may update this Privacy Policy periodically. Any changes will
                be reflected on this page, with the date of the last update
                indicated at the top. Continued use of our platform implies your
                acceptance of the updated terms.
              </p>
            </div>

            {/* <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mt-12 text-center">
              <h3 className="text-xl font-semibold text-primary mb-3">
                Contact Us
              </h3>
              <p className="text-black/70 mb-6">
                If you have any questions about our privacy practices, feel free
                to contact us anytime at:
              </p>
              <p className="font-semibold text-black">
                heritagebites007@gmail.com
              </p>

              <div className="mt-6">
                <Button
                  variant="golden"
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => (window.location.href = "/support")}
                >
                  Contact Support
                </Button>
              </div>
            </div> */}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
