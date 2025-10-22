import React from "react";
import { Helmet } from "react-helmet";
import Header from "../components/ui/Header";
import Footer from "../pages/dashboard/components/Footer";
import Button from "../components/ui/Button";

const TermsOfService = () => {
    return (
        <div className="bg-background text-black min-h-screen flex flex-col">
            <Header />
            <Helmet>
                <title>Terms of Service | HeritageBites</title>
            </Helmet>



            <main className="flex-grow">
                <section className="max-w-5xl mx-auto px-6 py-16">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-primary mb-4">
                            Terms of Service
                        </h1>
                        <p className="text-black/80 text-lg max-w-3xl mx-auto">
                            Welcome to HeritageBites! These Terms of Service outline the rules and
                            regulations for using our platform, products, and services.
                        </p>
                    </div>

                    <div className="space-y-10">
                        <div>
                            <h2 className="text-2xl font-semibold text-primary mb-3">
                                1. Acceptance of Terms
                            </h2>
                            <p className="text-black/80 leading-relaxed">
                                By accessing or using HeritageBites, you agree to comply with and
                                be bound by these Terms of Service. If you do not agree, please
                                discontinue the use of our services immediately.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold text-primary mb-3">
                                2. Use of Our Platform
                            </h2>
                            <p className="text-black/80 leading-relaxed">
                                Our mission is to preserve India’s culinary heritage. You agree
                                to use our website and marketplace responsibly, without
                                engaging in fraudulent, harmful, or misleading activities.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold text-primary mb-3">
                                3. Content Ownership
                            </h2>
                            <p className="text-black/80 leading-relaxed">
                                All recipes, content, and visuals available on HeritageBites are
                                owned by their respective creators or HeritageBites. You may not
                                copy, reproduce, or distribute content without permission.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold text-primary mb-3">
                                4. User Responsibilities
                            </h2>
                            <p className="text-black/80 leading-relaxed">
                                You are responsible for maintaining the confidentiality of your
                                account credentials. Any actions performed using your account
                                are your responsibility.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold text-primary mb-3">
                                5. Limitation of Liability
                            </h2>
                            <p className="text-black/80 leading-relaxed">
                                HeritageBites is not liable for damages arising from the use or
                                inability to use the platform, including data loss or
                                third-party interactions.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold text-primary mb-3">
                                6. Updates to These Terms
                            </h2>
                            <p className="text-black/80 leading-relaxed">
                                We may update our Terms of Service from time to time. The
                                updated version will always be available on this page. Continued
                                use of our platform after any changes means you accept them.
                            </p>
                        </div>

                        {/* <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mt-12 text-center">
                            <h3 className="text-xl font-semibold text-primary mb-3">
                                Need Help?
                            </h3>
                            <p className="text-black/70 mb-6">
                                Have questions about these Terms or our platform? Our team is
                                here to assist you.
                            </p>
                            <Button
                                variant="golden"
                                size="lg"
                                className="bg-primary text-primary-foreground hover:bg-primary/90"
                                onClick={() => (window.location.href = "/support")}
                            >
                                Contact Support
                            </Button>
                        </div> */}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default TermsOfService;
